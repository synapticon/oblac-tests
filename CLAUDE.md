# oblac-tests

Hardware-in-the-loop integration tests for Motion Master / SOMANET devices, plus ESP32 firmware for the P1535 PSU controller.

## Architecture

- **`src/`** — shared test infrastructure
  - `global-setup.ts` — Vitest global setup/teardown: starts Docker services, streams `motion-master` and `motion-master-api` container stdout/stderr to the test output (locally both stream by default; on CI `motion-master` is opt-in via `STREAM_MM_LOGS=true`), waits 3 s for containers to come up, waits for the MM API, connects to Motion Master, powers on the PSU, waits 10 s for Motion Master to enumerate and configure devices, then polls `GET /devices` until enumeration succeeds. Teardown powers off the PSU, kills log-streaming processes, and (on CI) runs `docker compose down`.
  - `setup.ts` — per-test exports: `api` (Motion Master HTTP client) and `psu` (PSU power control)
  - `test-devices.ts` — defines the `TestDevice` interface (`position`, `serialNumber`, `name`, `productName`) and exports a `testDevices` ordered array plus named constants for each physical device on the rig (`nodeTestDevice`, `integroTestDevice`, `circuloTestDevice`). `name` is a short label used in test names (e.g. `'circulo'`, `'integro'`, `'node'`); `productName` is the full human-readable product name. Tests select a specific device by serial number.
  - `psu.ts` — HTTP client for the ESP32 PSU controller (`PSU_URL`)
  - `log-fetch.ts` — wraps `fetch` to log method/URL/status/duration with a `[req]` prefix; used by `api` and `psu` so every endpoint call appears in the test output
  - `mm-api.ts` — generated TypeScript client from the Motion Master OpenAPI spec (do not edit by hand)
- **`tests/`** — Vitest test files; all tests run sequentially (multiple devices attached)
  - `system.test.ts` — MM client/system version, device enumeration
  - `circulo-parameters.test.ts` — read/write individual parameters on the Circulo 7 (get-parameter-values, set-parameter-values, upload, download)
  - `circulo-files.test.ts` — device file system operations (list, upload, download, delete) on the Circulo 7; covers both regular and hidden (`.`-prefixed) files, with unlock-before-write/delete semantics for hidden files, and error paths (nonexistent file, missing unlock)
  - `circulo-config.test.ts` — save-config, load-config, and parameter restore on the Circulo 7; uses `ConfigFile` from `motion-master-client` to parse the CSV and derive expected values
  - `circulo-profiles.test.ts` — position profile, velocity profile, torque profile (1 s post-torque settlement after `skip-quick-stop=false` — lets the drive leave CiA 402 QUICK_STOP_ACTIVE before the next test), and quick-stop on the Circulo 7; error paths for missing `target-reach-timeout` when `skip-quick-stop: false`
  - `circulo-motion.test.ts` — two half-rotation (262_144 counts = half of the Circulo's 2^19/rev encoder) position profiles in opposite directions on the Circulo 7; first with `skip-quick-stop=true` (asserts OPERATION_ENABLED mid-motion, sleeps 7 s to let the drive rotate), second with `skip-quick-stop=false` (blocks until target-reach + 2 s hold), then sleeps 1 s and asserts SWITCH_ON_DISABLED
  - `circulo-offset-detection.test.ts` — full offset detection run on the Circulo 7
  - `circulo-encoder.test.ts` — Circulo 7 encoder procedures: narrow-angle calibration (up to 300 s, logs per-step results), encoder configuration, and encoder error check (expects empty error list)
  - `circulo-system-identification.test.ts` — system identification on the Circulo 7: deletes any existing `plant_model.csv`, runs the chirp signal via `start-system-identification`, verifies the file was created, downloads and parses it with `parsePlantModelCsv` from `motion-master-client`
  - `circulo-auto-tuning.test.ts` — compute and full auto-tuning for velocity (0x2011) and position (0x2012) controllers on the Circulo 7; zeros out gains before each run, then verifies kp > 0 after tuning; covers `compute-auto-tuning-gains` and `start-full-auto-tuning` for both controller types, using `P_PI` for position
  - `circulo-smm.test.ts` — SMM (Safe Motion Module) OS commands on the Circulo 7 via `run-os-command`: read SMM firmware version (command `11,13,1,…`, `read-fs-buffer=true`, parsed as `v{fsBuffer[1]}.{fsBuffer[0]}`) and SMM restart (command `11,15,…`)
  - `circulo-firmware.test.ts` — **opt-in** (`OPTIONAL_TESTS=firmware`, ~5 min): installs `v5.6.5` (skipping `SOMANET_CiA_402.xml.zip` and `stack_image.svg.zip` to shorten the run), waits 30 s for Motion Master to re-init the device, verifies `0x100A` reports `5.6.5`; runs `factory-reset` (default `install-empty-firmware=true` wipes `config.csv` and all non-essential files); installs `v5.6.6` without `skip-files`; verifies `0x100A`; reads `0x2001` (Commutation angle offset), asserts it's `0` post-reset; runs `load-config` with `refresh=true, strategy=replace` against `devices/<serial>/config.csv`; re-reads `0x2001` and asserts it matches the value parsed from the CSV via `ConfigFile`. The firmware install endpoint expects `application/octet-stream`, but the generated client JSON-stringifies non-string bodies — this test bypasses it via raw `logFetch`. `factory-reset` doesn't expose `request-timeout` on its typed query, so it's passed via the `as unknown as RequestParams` cast escape hatch.
  - `jonas.test.ts` — **opt-in** (`OPTIONAL_TESTS=jonas`): factory reset → v5.6.6 install → load config → encoder → offset detection
  - `integro-offset-detection.test.ts` — full offset detection run on the Integro-60
- **`devices/`** — per-device fixture files, one subdirectory per serial number (e.g. `devices/8612-02-0001553-2341/`); each contains `config.csv` (saved parameter set loaded by `circulo-config.test.ts`), `.hardware_description`, and optional `.factory_config` / `.safety_parameters_report`
- **`p1535/`** — ESP32-IDF firmware for the P1535 PSU HTTP controller
- **`provision/`** — Ansible playbook + bootstrap script for Ubuntu 26.04 LTS test machines. `play.sh` prompts for the BECOME password and forwards any extra arguments to `ansible-playbook` (`./provision/play.sh -e rustdesk_password=foo`, `./provision/play.sh --tags actions-runner`, etc.). Four roles:
  - `test-machine` — installs system packages from `roles/test-machine/vars/main.yml` (Docker, Node.js, Python, build tools, `gh`, `lazygit`, `vim`), VS Code via snap, configures git for Marko, adds the user to `docker`, and installs `psu-on`/`psu-off` PSU control scripts to `~/.local/bin`.
  - `rustdesk` — installs RustDesk (latest release from GitHub) for remote desktop access and enables the systemd service. Optional: pass `rustdesk_password` to set a permanent unattended-access password. The role prints the machine's RustDesk ID at the end of every run via `rustdesk --get-id`.
  - `oblac-drives-releases` — installs `sync-oblac-drives-releases` to `~/.local/bin` and runs it. The script (a standalone bash file, portable to any OS with `bash`, `curl`, and `jq` or `python3`) fetches `oblac-drives-releases.json`, skips versions already on disk in `~/oblac-drives-releases/`, HEAD-probes the CDN to filter out releases that don't publish a `.deb`, then downloads the rest. Idempotent — re-running only HEAD-probes versions not already cached and never re-downloads existing files. Override paths via `OBLAC_DRIVES_RELEASES_URL`, `OBLAC_DRIVES_RELEASES_BASE_URL`, `OBLAC_DRIVES_RELEASES_DIR`.

  `group_vars/all.yml` derives `username`/`home_dir` from `lookup('env', 'USER')` / `lookup('env', 'HOME')` — **not** from `ansible_facts`. The first play declares `become: true`, so gather_facts runs escalated and `ansible_facts['user_id']`/`ansible_facts['env']['HOME']` resolve to `root`/`/root`. Reverting to the `ansible_facts` form silently lands every role's user-home writes (psu scripts, the deb cache, etc.) under `/root/`.
  - `actions-runner` — registers the machine as a self-hosted GitHub Actions runner at the `synapticon` org scope (runner name `ci-belgrade-linux`, extra labels = hostname + `ci-belgrade-linux`) and installs the runner as a systemd service `actions.runner.synapticon.ci-belgrade-linux.service`. Idempotent (skips if `~/actions-runner/.runner` exists). Requires `gh auth login` first with `admin:org` scope on `synapticon` (`gh auth refresh -h github.com -s admin:org` if you already have a login); fetches the registration token at runtime via `gh api -X POST /orgs/synapticon/actions/runners/registration-token`. Per-role tags are wired in `test-machine.yml`, so `./provision/play.sh --tags <role>` runs just one role (e.g. `--tags actions-runner`, `--tags rustdesk`).
- **`docker-compose.yml`** — runs `synapticon/motion-master` and `synapticon/motion-master-api` containers
- **`.github/workflows/test.yml`** — `workflow_dispatch`-only CI; targets `runs-on: [self-hosted, ci-belgrade-linux]` (label set by the `actions-runner` role). Inputs: `mm_version`, `mm_api_version`, `file_filter` (vitest file path pattern), `test_name_filter` (vitest `-t` pattern), `stream_api_logs` (default `true`), `stream_mm_logs` (default `false`), `optional_tests` (comma-separated list of opt-in suites: `firmware`, `jonas`, or `all`; default empty — opt-in tests excluded). Use `run-workflow.sh` to dispatch.

## Commands

```bash
npm test              # run all tests once
npm run test:watch    # watch mode
npm run test:ui       # Vitest browser UI
npm run typecheck     # tsc --noEmit
npm run generate:api  # regenerate mm-api.ts from the live swagger spec
npm run format        # format with Biome
npm run check         # lint + format with Biome (auto-fix)
```

Dispatch CI with specific image versions:

```bash
./run-workflow.sh --mm_version=<tag> --mm_api_version=<tag> [--file_filter=<pattern>] [--test_name_filter=<name>] [--stream_api_logs=<bool>] [--stream_mm_logs=<bool>] [--optional_tests=<list>]
```

`--optional_tests` accepts a comma-separated list of opt-in suites (`firmware`, `jonas`) or `all`. To run only one opt-in suite, combine with `--file_filter`: `--optional_tests=jonas --file_filter=jonas`.

## Environment

Copy `.env.example` to `.env` and fill in at minimum `MM_MAC` (EtherCAT interface MAC address). Docker Compose reads `.env` (not `.env.example`); changes to the template are only picked up after copying them into the local `.env`.

Key variables (see `.env.example` for full list):

| Variable         | Default                  | Description                          |
| ---------------- | ------------------------ | ------------------------------------ |
| `MM_VERSION`     | `v5.5.6`                 | Motion Master image tag              |
| `MM_API_VERSION` | `v0.0.407`               | Motion Master API image tag          |
| `MM_MAC`         | _(required)_             | EtherCAT network interface MAC       |
| `MM_DRV`         | `soem`                   | EtherCAT driver (`soem` or `rtsoem`) |
| `MM_API_PORT`    | `63526`                  | HTTP API port                        |
| `PSU_URL`        | `http://192.168.212.103` | ESP32 PSU controller base URL        |

## Code style

- Semicolons always.
- Single quotes for strings.
- Curly braces always on control-flow bodies.
- No comments unless the WHY is non-obvious.
- Biome (`biome.json`) enforces formatting and linting — run `npm run check` to auto-fix.

## Adding new test files

New test files are **not** auto-discovered. Every new `tests/*.test.ts` file must be explicitly added to the `include` array in `vitest.config.ts`, otherwise Vitest silently finds no matching tests and exits with code 1.

## Monitoring API

The monitoring API (`startMonitoring` / `getMonitoringData` / `stopMonitoring`) streams EtherCAT PDO data as CSV. Several non-obvious behaviours:

- **`getMonitoringData` returns `null` without a format hint.** The generated HTTP client does not parse the response body unless a format is specified. Always pass `{ format: 'text' }` as the `params` argument, exactly as `getDeviceFile` does in the system-identification test:
  ```ts
  const { data: csv } = await api.devices.getMonitoringData(serialNumber, { format: 'text' });
  ```
- **Verify `startMonitoring` succeeded** before relying on the data:
  ```ts
  const { ok } = await api.devices.startMonitoring(serialNumber);
  expect(ok).toBe(true);
  ```
- **CSV column header format is `0xINDEX:SUBINDEX`** (e.g. `0x6077:00`). Match by substring when searching for a parameter column — the exact casing or zero-padding may vary across firmware versions.
- **`getMonitoringData` accumulates all samples since `startMonitoring`.** Call `startMonitoring` at the beginning of each measurement window to reset the buffer. Take the _last N_ rows (not the first) so that data collected during acceleration ramps or state transitions is excluded.
- **Always call `stopMonitoring` after reading**, even on failure paths, to avoid leaving a dangling session that would be silently replaced by the next `startMonitoring` call.

## Reading physical quantities from the object dictionary

When computing a result in standard engineering units, read the relevant scaling constant from the device dictionary rather than hard-coding it — hardware variants have different rated values.

Key objects (CiA 402):

| Object  | Name                  | Unit  | Value type  |
| ------- | --------------------- | ----- | ----------- |
| `0x6076` | Motor rated torque   | mNm   | `uintValue` |
| `0x6077` | Torque actual value  | ‰ of rated torque (permil) | `intValue` |
| `0x6064` | Position actual      | inc   | `intValue`  |
| `0x606C` | Velocity actual      | unit defined by `0x60A9` (SI Unit Velocity) | `intValue`  |

## Notes

- Tests run sequentially (`pool: forks`, `singleFork: true`) — multiple devices are connected but tests target specific ones.
- Global timeout is 5 min per test and per hook; teardown is 60 s.
- Reporter is `verbose` locally and `['basic', 'github-actions']` on CI (gated on `GITHUB_ACTIONS`). `verbose` redraws the test tree on every stdout write so the streamed `[srv]`/`[api]` lines cause the tree to reprint repeatedly — accepted as noise locally for the per-test detail; CI uses `basic` for a clean linear log plus `github-actions` for inline failure annotations.
- On CI, `docker compose down` is called in teardown. Locally, containers are left running.
- `mm-api.ts` is generated — regenerate with `npm run generate:api` after the swagger spec changes.
- Test output is tagged: `[req]` for outgoing HTTP requests to the Motion Master gateway, `[psu]` for PSU controller calls, `[srv]` for streamed `motion-master` container logs, `[api]` for streamed `motion-master-api` container logs.
- PSU is powered on once in `globalSetup` (after the readiness gate) and powered off in teardown — tests should not call `psu.on()`/`psu.off()` themselves, since power-cycling forces EtherCAT re-enumeration and risks losing slaves mid-suite.
- The Motion Master gateway honours a server-side `request-timeout` query parameter on every endpoint, but the generated client only types it on a few (e.g. `getDevices`). The generated method's third `params` arg is spread _after_ the typed `query`, so a `params.query` **replaces** (does not merge with) the typed one — and `RequestParams` deliberately Omits `query`, so TypeScript needs an `as unknown as RequestParams` cast. For endpoints with no other typed query params (e.g. `runOffsetDetection`), you can pass `request-timeout` in isolation: `runOffsetDetection(serial, undefined, { query: { 'request-timeout': 240_000 } } as unknown as RequestParams)`. For endpoints **with** typed query params (e.g. `runPositionProfile`, `runVelocityProfile`, `runTorqueProfile`), pass `undefined` for the typed query and put everything — including `request-timeout` — in `params.query`; otherwise the typed params are silently dropped and the call falls back to server defaults (e.g. `skip-quick-stop=true`, returns immediately). See `tests/circulo-profiles.test.ts` for the pattern.
