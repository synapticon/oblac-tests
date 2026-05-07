# oblac-tests

Hardware-in-the-loop integration tests for [Motion Master](https://github.com/synapticon/oblac) / SOMANET devices.

Tests run against a real device connected via EtherCAT. Motion Master and its HTTP API are started automatically in Docker before the test suite runs.

## Requirements

- Docker (with Compose v2)
- Node.js ≥ 22
- A SOMANET device reachable via EtherCAT
- *(optional)* A P1535 PSU controller on the local network

## Provisioning a test machine

The target platform is **Ubuntu 26.04 LTS**. To provision a fresh machine:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/synapticon/oblac-tests/main/provision/bootstrap.sh)
```

This installs Docker, Node.js, Python, build tools, `gh`, `lazygit`, `vim`, and VS Code, clones the repository, runs `npm install`, creates `.env` from `.env.example`, and registers the machine as a self-hosted GitHub Actions runner for the repo.

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

The CI workflow (`.github/workflows/test.yml`) is `workflow_dispatch`-only and targets `runs-on: [self-hosted, OptiPlex-3080]`. To target a different machine, change the second label to that machine's hostname (each runner is auto-labelled with its hostname by the playbook).

## Setup

```bash
cp .env.example .env
# Edit .env — set MM_MAC to the MAC address of the EtherCAT network interface
npm install
```

## Running tests

```bash
npm test
```

Vitest starts the Docker services, waits for Motion Master to connect to the device, runs all tests sequentially, and (on CI) tears down the containers.

```bash
npm run test:watch   # re-run on file changes
npm run test:ui      # browser UI at http://localhost:51204
```

## Configuration

All configuration is via environment variables in `.env` (see `.env.example`).

The most important ones:

| Variable | Description |
|---|---|
| `MM_MAC` | MAC address of the EtherCAT network interface *(required)* |
| `PSU_URL` | Base URL of the ESP32 PSU controller (default `http://192.168.212.103`) |
| `MM_API_PORT` | HTTP API port (default `63526`) |

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
