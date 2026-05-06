# oblac-tests

Hardware-in-the-loop integration tests for [Motion Master](https://github.com/synapticon/oblac) / SOMANET devices.

Tests run against a real device connected via EtherCAT. Motion Master and its HTTP API are started automatically in Docker before the test suite runs.

## Requirements

- Docker (with Compose v2)
- Node.js ≥ 20
- A SOMANET device reachable via EtherCAT
- *(optional)* A P1535 PSU controller on the local network

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
