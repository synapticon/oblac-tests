# oblac-tests

Hardware-in-the-loop integration tests for Motion Master / SOMANET devices, plus ESP32 firmware for the P1535 PSU controller.

## Architecture

- **`src/`** — shared test infrastructure
  - `global-setup.ts` — Vitest global setup/teardown: starts Docker services, waits for the MM API, connects to Motion Master
  - `setup.ts` — per-test exports: `api` (Motion Master HTTP client) and `psu` (PSU power control)
  - `psu.ts` — HTTP client for the ESP32 PSU controller (`PSU_URL`)
  - `mm-api.ts` — generated TypeScript client from the Motion Master OpenAPI spec (do not edit by hand)
- **`tests/`** — Vitest test files; all tests run sequentially (single device attached)
- **`p1535/`** — ESP32-IDF firmware for the P1535 PSU HTTP controller
- **`provision/`** — Ansible playbook + bootstrap script for Ubuntu 26.04 LTS test machines. The role: `apt install` everything in `roles/test-machine/vars/main.yml` (Docker, Node.js, Python, build tools, `gh`, `lazygit`, `vim`), `snap install code --classic`, and add the user to the `docker` group. Ordering when adding new tooling: apt first; snap (via `community.general.snap`) as the fallback when a package isn't in 26.04 universe — do not introduce upstream PPAs, third-party apt repos, or tarball downloads.
- **`docker-compose.yml`** — runs `synapticon/motion-master` and `synapticon/motion-master-api` containers

## Commands

```bash
npm test              # run all tests once
npm run test:watch    # watch mode
npm run test:ui       # Vitest browser UI
npm run typecheck     # tsc --noEmit
npm run generate:api  # regenerate mm-api.ts from the live swagger spec
```

## Environment

Copy `.env.example` to `.env` and fill in at minimum `MM_MAC` (EtherCAT interface MAC address).

Key variables (see `.env.example` for full list):

| Variable | Default | Description |
|---|---|---|
| `MM_VERSION` | `v5.4.1-flatbot.12` | Motion Master image tag |
| `MM_API_VERSION` | `v0.0.382` | Motion Master API image tag |
| `MM_MAC` | *(required)* | EtherCAT network interface MAC |
| `MM_DRV` | `soem` | EtherCAT driver (`soem` or `rtsoem`) |
| `MM_API_PORT` | `63526` | HTTP API port |
| `PSU_URL` | `http://192.168.212.103` | ESP32 PSU controller base URL |

## Code style

- Semicolons always.
- Curly braces always on control-flow bodies.
- No comments unless the WHY is non-obvious.

## Notes

- Tests run sequentially (`pool: forks`, `singleFork: true`) — only one device is connected.
- Global timeout is 60 s per test; the offset-detection test uses its own 300 s timeout.
- On CI, `docker compose down` is called in teardown. Locally, containers are left running.
- `mm-api.ts` is generated — regenerate with `npm run generate:api` after the swagger spec changes.
