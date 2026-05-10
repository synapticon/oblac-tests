# oblac-tests

Hardware-in-the-loop integration tests for [Motion Master](https://github.com/synapticon/oblac) / SOMANET devices.

Tests run against a real device connected via EtherCAT. Motion Master and its HTTP API are started automatically in Docker before the test suite runs.

## Requirements

- Docker (with Compose v2)
- Node.js ≥ 22
- A SOMANET device reachable via EtherCAT
- _(optional)_ A P1535 PSU controller on the local network

## Provisioning a test machine

The target platform is **Ubuntu 26.04 LTS**. To provision a fresh machine:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/synapticon/oblac-tests/main/provision/bootstrap.sh)
```

This installs Docker, Node.js, Python, build tools, `gh`, `lazygit`, `vim`, VS Code, and RustDesk, clones the repository, runs `npm install`, creates `.env` from `.env.example`, and registers the machine as a self-hosted GitHub Actions runner for the repo.

The runner registration step requires `gh` to be authenticated with admin permission on `synapticon/oblac-tests`. The first run will fail at that step on a fresh machine (since `gh` is installed by the playbook itself); after the failure, run:

```bash
gh auth login
./provision/play.sh
```

After provisioning completes, set `MM_MAC` in `.env` and run the tests.

To re-provision an existing machine:

```bash
./provision/play.sh
```

`play.sh` prompts for the BECOME (sudo) password and forwards any extra arguments to `ansible-playbook`, so you can pass through tags, extra-vars, limits, etc. — for example `./provision/play.sh -e rustdesk_password=yourpassword` or `./provision/play.sh --tags actions-runner`.

### Checking the GitHub Actions runner

The runner is installed as a systemd service named `actions.runner.synapticon-oblac-tests.$(hostname).service`.

```bash
# status
systemctl status "actions.runner.synapticon-oblac-tests.$(hostname).service"

# follow logs
journalctl -u "actions.runner.synapticon-oblac-tests.$(hostname).service" -f

# recent logs
journalctl -u "actions.runner.synapticon-oblac-tests.$(hostname).service" -n 200 --no-pager
```

The runner's own helper also works, but it must be run from the runner directory and with `sudo`:

```bash
cd ~/actions-runner && sudo ./svc.sh status
```

Per-job diagnostics live in `~/actions-runner/_diag/` and `~/actions-runner/_work/`.

### Remote desktop (RustDesk)

RustDesk is installed automatically by the playbook. To set a permanent unattended-access password, pass it as an extra variable:

```bash
./provision/play.sh -e rustdesk_password=yourpassword
```

The playbook prints the machine's RustDesk ID at the end of every run (via `rustdesk --get-id`); that's what you use to connect from your own machine. The same ID is also visible in the RustDesk app on the test machine.

The CI workflow (`.github/workflows/test.yml`) is `workflow_dispatch`-only and targets `runs-on: [self-hosted, OptiPlex-3080]`. To target a different machine, change the second label to that machine's hostname (each runner is auto-labelled with its hostname by the playbook).

## Triggering CI

Use `run-ci.sh` to dispatch the workflow with specific image versions:

```bash
./run-ci.sh <mm_version> <mm_api_version> [test_filter]

# Examples:
./run-ci.sh v5.4.1-flatbot.16 v0.0.389           # run all tests
./run-ci.sh v5.4.1-flatbot.16 v0.0.389 offset     # run tests matching "offset"
```

Requires `gh` authenticated with permission to dispatch workflows on `synapticon/oblac-tests`.

## Setup

```bash
cp .env.example .env
# Edit .env — set MM_MAC to the MAC address of the EtherCAT network interface
npm install
```

`.env` is what Docker Compose reads — `.env.example` is just a committed template. To pick up version bumps in the template, copy them into your local `.env` and `docker compose pull` to fetch the new images before the next test run.

## Running tests

```bash
npm test
```

Vitest starts the Docker services, waits 3 s for the containers to come up, connects to Motion Master, powers on the PSU, waits 10 s for Motion Master to enumerate and configure devices, polls `GET /devices` until the EtherCAT bus is enumerated, then runs all tests sequentially. Teardown powers off the PSU and (on CI) tears down the containers. Tests should not call `psu.on()`/`psu.off()` themselves — power-cycling mid-suite forces re-enumeration and risks losing slaves.

| Test file | What it covers |
| --- | --- |
| `system.test.ts` | MM client/system version, device enumeration |
| `circulo-parameters.test.ts` | Read/write individual parameters on the Circulo 7 |
| `circulo-config.test.ts` | `save-config`, `load-config`, and parameter restore on the Circulo 7 |
| `offset-detection.test.ts` | Full offset detection run on the Integro-60 |
| `circulo-files.test.ts` | File system operations (list, upload, download, delete) on the Circulo 7; regular and hidden files, unlock semantics, error paths |
| `circulo-profiles.test.ts` | Position profile, torque profile, and quick-stop on the Circulo 7; error paths for missing `target-reach-timeout` |

```bash
npm run test:watch   # re-run on file changes
npm run test:ui      # browser UI at http://localhost:51204
```

### Test output

Each line is prefixed with its source so HTTP traffic and container logs interleave readably:

| Prefix  | Source                                                                    |
| ------- | ------------------------------------------------------------------------- |
| `[req]` | Outgoing HTTP request from the test process (`method url → status (Xms)`) |
| `[psu]` | HTTP call to the P1535 PSU controller                                     |
| `[srv]` | Streamed stdout/stderr from the `motion-master` container                 |
| `[api]` | Streamed stdout/stderr from the `motion-master-api` container             |

Locally both `[srv]` and `[api]` stream by default. On CI `[srv]` is opt-in (set `STREAM_MM_LOGS=true` to enable). Either stream can be silenced with `STREAM_MM_LOGS=false` / `STREAM_API_LOGS=false`.

The reporter is `verbose` locally — it redraws the test tree on every stdout write, so the streamed container logs cause the tree to reprint repeatedly. That's accepted as noise in exchange for per-test feedback. On CI (`GITHUB_ACTIONS=true`) the reporter switches to `['basic', 'github-actions']`: `basic` is non-interactive so the log stays linear, and `github-actions` emits inline failure annotations on the workflow run summary.

Per-test and per-hook timeout is 5 min; teardown timeout is 60 s. Configurable in `vitest.config.ts`.

## Configuration

All configuration is via environment variables in `.env` (see `.env.example`).

The most important ones:

| Variable      | Description                                                             |
| ------------- | ----------------------------------------------------------------------- |
| `MM_MAC`      | MAC address of the EtherCAT network interface _(required)_              |
| `PSU_URL`     | Base URL of the ESP32 PSU controller (default `http://192.168.212.103`) |
| `MM_API_PORT` | HTTP API port (default `63526`)                                         |

## Device fixture files

Each device on the test rig has a subdirectory under `devices/<serial>/` containing:

- `config.csv` — saved parameter set used by config tests (`load-config` / `save-config`)
- `.hardware_description` — EtherCAT hardware description file
- `.factory_config`, `.safety_parameters_report` — optional factory files

The serial number subdirectory matches the device serial number reported by Motion Master (e.g. `8612-02-0001553-2341`). Tests resolve the path dynamically from the device's serial number, so adding a new device only requires adding its fixture directory.

## Regenerating the API client

`src/mm-api.ts` is auto-generated from the Motion Master OpenAPI spec:

```bash
npm run generate:api
```

## P1535 PSU firmware

The `p1535/` directory contains the ESP32-IDF firmware for the P1535 HTTP PSU controller. Flash it with:

```bash
cd p1535
idf.py -p /dev/ttyUSB0 flash monitor
```

## License

See [LICENSE](LICENSE).
