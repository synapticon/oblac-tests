# oblac-tests

Hardware-in-the-loop integration tests for Motion Master / SOMANET devices, plus ESP32 firmware for the P1535 PSU controller.

## Architecture

- **`src/`** — shared test infrastructure
  - `global-setup.ts` — Vitest global setup/teardown: starts Docker services, streams `motion-master` and `motion-master-api` container stdout/stderr to the test output (locally both stream by default; on CI `motion-master` is opt-in via `STREAM_MM_LOGS=true`), waits 3 s for containers to come up, waits for the MM API, connects to Motion Master, powers on the PSU, waits 10 s for Motion Master to enumerate and configure devices, then polls `GET /devices` until enumeration succeeds. Teardown powers off the PSU.
  - `setup.ts` — per-test exports: `api` (Motion Master HTTP client) and `psu` (PSU power control)
  - `test-devices.ts` — defines the `TestDevice` interface (`position`, `serialNumber`, `name`, `productName`) and exports named constants for each physical device on the rig (`nodeTestDevice`, `integroTestDevice`, `circuloTestDevice`). `name` is a short label used in test names (e.g. `'circulo'`, `'integro'`, `'node'`); `productName` is the full human-readable product name.
  - `psu.ts` — HTTP client for the ESP32 PSU controller (`PSU_URL`)
  - `log-fetch.ts` — wraps `fetch` to log method/URL/status/duration with a `[req]` prefix; used by `api` and `psu` so every endpoint call appears in the test output
  - `mm-api.ts` — generated TypeScript client from the Motion Master OpenAPI spec (do not edit by hand)
- **`tests/`** — Vitest test files; all tests run sequentially (single device attached)
  - `system.test.ts` — MM client/system version, device enumeration
  - `circulo-parameters.test.ts` — read/write individual parameters on the Circulo 7 (get-parameter-values, set-parameter-values, upload, download)
  - `circulo-config.test.ts` — save-config, load-config, and parameter restore on the Circulo 7; uses `ConfigFile` from `motion-master-client` to parse the CSV and derive expected values
  - `offset-detection.test.ts` — full offset detection run on the Integro-60
  - `circulo-files.test.ts` — device file system operations (list, upload, download, delete) on the Circulo 7; covers both regular and hidden (`.`-prefixed) files, with unlock-before-write/delete semantics for hidden files, and error paths (nonexistent file, missing unlock)
  - `circulo-profiles.test.ts` — position profile, velocity profile, torque profile, and quick-stop on the Circulo 7; error paths for missing `target-reach-timeout` when `skip-quick-stop: false`
  - `circulo-smm.test.ts` — SMM (Safe Motion Module) OS commands on the Circulo 7 via `run-os-command`: read SMM firmware version (command `11,13,1,…`, `read-fs-buffer=true`, parsed as `v{fsBuffer[1]}.{fsBuffer[0]}`) and SMM restart (command `11,15,…`)
- **`devices/`** — per-device fixture files, one subdirectory per serial number (e.g. `devices/8612-02-0001553-2341/`); each contains `config.csv` (saved parameter set loaded by `circulo-config.test.ts`), `.hardware_description`, and optional `.factory_config` / `.safety_parameters_report`
- **`p1535/`** — ESP32-IDF firmware for the P1535 PSU HTTP controller
- **`provision/`** — Ansible playbook + bootstrap script for Ubuntu 26.04 LTS test machines. `play.sh` prompts for the BECOME password and forwards any extra arguments to `ansible-playbook` (`./provision/play.sh -e rustdesk_password=foo`, `./provision/play.sh --tags actions-runner`, etc.). Three roles:
  - `test-machine` — installs system packages from `roles/test-machine/vars/main.yml` (Docker, Node.js, Python, build tools, `gh`, `lazygit`, `vim`), VS Code via snap, configures git for Marko, adds the user to `docker`, and installs `psu-on`/`psu-off` PSU control scripts to `~/.local/bin`.
  - `rustdesk` — installs RustDesk (latest release from GitHub) for remote desktop access and enables the systemd service. Optional: pass `rustdesk_password` to set a permanent unattended-access password. The role prints the machine's RustDesk ID at the end of every run via `rustdesk --get-id`.
  - `actions-runner` — registers the machine as a self-hosted GitHub Actions runner for `synapticon/oblac-tests` and installs the runner as a systemd service. Idempotent (skips if `~/actions-runner/.runner` exists). Requires `gh auth login` first; fetches the registration token at runtime via `gh api`.
- **`docker-compose.yml`** — runs `synapticon/motion-master` and `synapticon/motion-master-api` containers
- **`.github/workflows/test.yml`** — `workflow_dispatch`-only CI; targets `runs-on: [self-hosted, OptiPlex-3080]` (the test machine's hostname-derived label)

## Commands

```bash
npm test              # run all tests once
npm run test:watch    # watch mode
npm run test:ui       # Vitest browser UI
npm run typecheck     # tsc --noEmit
npm run generate:api  # regenerate mm-api.ts from the live swagger spec
```

Dispatch CI with specific image versions:

```bash
./run-ci.sh <mm_version> <mm_api_version> [test_filter]
```

## Environment

Copy `.env.example` to `.env` and fill in at minimum `MM_MAC` (EtherCAT interface MAC address). Docker Compose reads `.env` (not `.env.example`); changes to the template are only picked up after copying them into the local `.env`.

Key variables (see `.env.example` for full list):

| Variable         | Default                  | Description                          |
| ---------------- | ------------------------ | ------------------------------------ |
| `MM_VERSION`     | `v5.4.1-flatbot.18`      | Motion Master image tag              |
| `MM_API_VERSION` | `v0.0.390`               | Motion Master API image tag          |
| `MM_MAC`         | _(required)_             | EtherCAT network interface MAC       |
| `MM_DRV`         | `soem`                   | EtherCAT driver (`soem` or `rtsoem`) |
| `MM_API_PORT`    | `63526`                  | HTTP API port                        |
| `PSU_URL`        | `http://192.168.212.103` | ESP32 PSU controller base URL        |

## Code style

- Semicolons always.
- Curly braces always on control-flow bodies.
- No comments unless the WHY is non-obvious.

## Notes

- Tests run sequentially (`pool: forks`, `singleFork: true`) — only one device is connected.
- Global timeout is 5 min per test and per hook; teardown is 60 s.
- Reporter is `verbose` locally and `['basic', 'github-actions']` on CI (gated on `GITHUB_ACTIONS`). `verbose` redraws the test tree on every stdout write so the streamed `[srv]`/`[api]` lines cause the tree to reprint repeatedly — accepted as noise locally for the per-test detail; CI uses `basic` for a clean linear log plus `github-actions` for inline failure annotations.
- On CI, `docker compose down` is called in teardown. Locally, containers are left running.
- `mm-api.ts` is generated — regenerate with `npm run generate:api` after the swagger spec changes.
- Test output is tagged: `[req]` for outgoing HTTP requests to the Motion Master gateway, `[psu]` for PSU controller calls, `[srv]` for streamed `motion-master` container logs, `[api]` for streamed `motion-master-api` container logs.
- PSU is powered on once in `globalSetup` (after the readiness gate) and powered off in teardown — tests should not call `psu.on()`/`psu.off()` themselves, since power-cycling forces EtherCAT re-enumeration and risks losing slaves mid-suite.
  - The Motion Master gateway honours a server-side `request-timeout` query parameter on every endpoint, but the generated client only types it on a few (e.g. `getDevices`). The generated method's third `params` arg is spread _after_ the typed `query`, so a `params.query` **replaces** (does not merge with) the typed one — and `RequestParams` deliberately Omits `query`, so TypeScript needs an `as unknown as RequestParams` cast. For endpoints with no other typed query params (e.g. `runOffsetDetection`), you can pass `request-timeout` in isolation: `runOffsetDetection(serial, undefined, { query: { 'request-timeout': 240_000 } } as unknown as RequestParams)`. For endpoints **with** typed query params (e.g. `runPositionProfile`, `runVelocityProfile`, `runTorqueProfile`), pass `undefined` for the typed query and put everything — including `request-timeout` — in `params.query`; otherwise the typed params are silently dropped and the call falls back to server defaults (e.g. `skip-quick-stop=true`, returns immediately). See `tests/circulo-profiles.test.ts` for the pattern.
