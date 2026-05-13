# oblac-tests

Hardware-in-the-loop integration tests for [Motion Master](https://github.com/synapticon/oblac) / SOMANET devices.

Tests run against real SOMANET devices connected via EtherCAT. Motion Master and its HTTP API are started automatically in Docker before the test suite runs.

## Requirements

- Docker (with Compose v2)
- Node.js ≥ 22
- SOMANET devices reachable via EtherCAT
- _(optional)_ A P1535 PSU controller on the local network

## Provisioning a test machine

The target platform is **Ubuntu 26.04 LTS**. To provision a fresh machine:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/synapticon/oblac-tests/main/provision/bootstrap.sh)
```

This installs Docker, Node.js, Python, build tools, `gh`, `lazygit`, `vim`, VS Code, and RustDesk, clones the repository, runs `npm install`, creates `.env` from `.env.example`, caches available `oblac-drives` Debian packages to `~/oblac-drives-releases/`, and registers the machine as a self-hosted GitHub Actions runner for the repo.

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

## Run Workflow

Use `run-workflow.sh` to dispatch the workflow with specific image versions:

```bash
./run-workflow.sh --mm_version=<tag> --mm_api_version=<tag> [options]

# Options:
#   --mm_version=<tag>         Motion Master image tag, e.g. v5.4.1-flatbot.19
#   --mm_api_version=<tag>     Motion Master API image tag, e.g. v0.0.396
#   --file_filter=<pattern>    File path pattern passed to vitest (e.g. integro)
#   --test_name_filter=<name>  Test name pattern passed to vitest -t (e.g. offset)
#   --stream_api_logs=<bool>   Stream motion-master-api logs (default: true)
#   --stream_mm_logs=<bool>    Stream motion-master logs (default: false)

# Examples:
./run-workflow.sh --mm_version=v5.4.1-flatbot.19 --mm_api_version=v0.0.396
./run-workflow.sh --mm_version=v5.4.1-flatbot.19 --mm_api_version=v0.0.396 --file_filter=integro
./run-workflow.sh --mm_version=v5.4.1-flatbot.19 --mm_api_version=v0.0.396 --test_name_filter=offset
./run-workflow.sh --mm_version=v5.4.1-flatbot.19 --mm_api_version=v0.0.396 --file_filter=circulo --test_name_filter=offset
./run-workflow.sh --mm_version=v5.4.1-flatbot.19 --mm_api_version=v0.0.396 --stream_mm_logs=true
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
npm test                         # run all tests
npm test -- integro              # run files matching "integro"
npm test -- -t "offset"          # run tests whose name matches "offset"
npm test -- circulo -t "offset"  # combine file and test name filter
```

Vitest starts the Docker services, waits 3 s for the containers to come up, connects to Motion Master, powers on the PSU, waits 10 s for Motion Master to enumerate and configure devices, polls `GET /devices` until the EtherCAT bus is enumerated, then runs all tests sequentially. Teardown powers off the PSU and (on CI) tears down the containers. Tests should not call `psu.on()`/`psu.off()` themselves — power-cycling mid-suite forces re-enumeration and risks losing slaves.

| Test file                               | What it covers                                                                                                                                                                                              |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `system.test.ts`                        | MM client/system version, device enumeration                                                                                                                                                                |
| `circulo-parameters.test.ts`            | Read/write individual parameters on the Circulo 7                                                                                                                                                           |
| `circulo-files.test.ts`                 | File system operations (list, upload, download, delete) on the Circulo 7; regular and hidden files, unlock semantics, error paths                                                                           |
| `circulo-config.test.ts`                | `save-config`, `load-config`, and parameter restore on the Circulo 7                                                                                                                                        |
| `circulo-profiles.test.ts`              | Position profile, velocity profile, torque profile (1 s post-torque wait to let the drive leave CiA 402 QUICK_STOP_ACTIVE), and quick-stop on the Circulo 7; error paths for missing `target-reach-timeout` |
| `circulo-motion.test.ts`                | Two half-rotation position profiles in opposite directions on the Circulo 7, verifying CiA 402 state transitions (OPERATION_ENABLED mid-motion, SWITCH_ON_DISABLED after quick-stop)                        |
| `circulo-offset-detection.test.ts`      | Full offset detection run on the Circulo 7                                                                                                                                                                  |
| `circulo-encoder.test.ts`               | Circulo 7 encoder procedures: narrow-angle calibration, encoder configuration, and encoder error check (expects empty error list)                                                                            |
| `circulo-system-identification.test.ts` | System identification on the Circulo 7: runs the chirp signal, verifies `plant_model.csv` was created, and prints the parsed plant model                                                                    |
| `circulo-auto-tuning.test.ts`           | Compute and full auto-tuning for velocity and position controllers on the Circulo 7; zeros out gains before each run, verifies kp > 0 after tuning                                                          |
| `circulo-smm.test.ts`                   | SMM (Safe Motion Module) OS commands on the Circulo 7: read SMM firmware version, SMM restart                                                                                                               |
| `integro-offset-detection.test.ts`      | Full offset detection run on the Integro-60                                                                                                                                                                 |

```bash
npm run test:watch   # re-run on file changes
npm run test:ui      # browser UI at http://localhost:51204
npm run check        # lint + format with Biome (auto-fix)
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
