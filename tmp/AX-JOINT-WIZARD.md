# Motion Master API — Complete Call Reference

Base URL: `http://localhost:63526/api`  
`{SERIAL}` = device serial number (e.g. `8624-03-123456`)

| Component         | Docker image                            |
| ----------------- | --------------------------------------- |
| Motion Master     | `synapticon/motion-master:v5.3.0`       |
| Motion Master API | `synapticon/motion-master-api:v0.0.363` |

---

## Connection

**Connect to EtherCAT bus**

```bash
curl -X GET http://localhost:63526/api/connect/
```

**Disconnect**

```bash
curl -X GET http://localhost:63526/api/disconnect
```

**Get API version**

```bash
curl -X GET http://localhost:63526/api/system-version
```

**List devices on bus**

```bash
curl -X GET "http://localhost:63526/api/devices?request-timeout=10000"
```

---

## Generic parameter read/write

All object reads route through `get-parameter-values`, all writes through `set-parameter-values`.

**Read parameter**

```bash
curl -X POST http://localhost:63526/api/devices/{SERIAL}/get-parameter-values \
  -H "Content-Type: application/json" \
  -d '[{"index": "0x6041", "subindex": 0}]'
```

**Write parameter (int)**

```bash
curl -X POST http://localhost:63526/api/devices/{SERIAL}/set-parameter-values \
  -H "Content-Type: application/json" \
  -d '[{"index": "0x6040", "subindex": 0, "intValue": 6, "typeValue": "intValue"}]'
```

**Write parameter (uint)**

```bash
curl -X POST http://localhost:63526/api/devices/{SERIAL}/set-parameter-values \
  -H "Content-Type: application/json" \
  -d '[{"index": "0x2012", "subindex": 9, "uintValue": 2, "typeValue": "uintValue"}]'
```

**Write parameter (float)**

```bash
curl -X POST http://localhost:63526/api/devices/{SERIAL}/set-parameter-values \
  -H "Content-Type: application/json" \
  -d '[{"index": "0x607C", "subindex": 0, "floatValue": 0.0, "typeValue": "floatValue"}]'
```

**Write parameter (string)**

```bash
curl -X POST http://localhost:63526/api/devices/{SERIAL}/set-parameter-values \
  -H "Content-Type: application/json" \
  -d '[{"index": "0x20F2", "subindex": 0, "stringValue": "MyJoint", "typeValue": "stringValue"}]'
```

### REVIEW

A simpler API is to use upload/download, which does not require providing unnecessary types such as intValue or uintValue. It also uses the more appropriate HTTP methods: GET for retrieving values (upload) and PUT for setting values (download).

---

## Configuration

**Upload device config (CSV)**

```bash
curl -X PUT "http://localhost:63526/api/devices/{SERIAL}/load-config?refresh=true" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @joint_config.csv
```

**Save config to non-volatile memory**

```bash
curl -X GET http://localhost:63526/api/devices/{SERIAL}/save-config
```

**Download all parameters as JSON**

```bash
curl -X GET "http://localhost:63526/api/devices/{SERIAL}/parameters?load-from-cache=false&request-timeout=10000"
```

**Get firmware version** (reads object `0x2700:01`)

```bash
curl -X POST "http://localhost:63526/api/devices/{SERIAL}/get-parameter-values?request-timeout=10000" \
  -H "Content-Type: application/json" \
  -d '[{"index": "0x2700", "subindex": 1}]'
```

**Install firmware** (binary zip payload; device reboots, ~30 s wait after)

```bash
curl -X POST "http://localhost:63526/api/devices/{SERIAL}/start-firmware-installation?skip-sii-installation=false&request-timeout=120000" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @firmware.zip
```

**Upload SMM (safety) config**

```bash
curl -X POST "http://localhost:63526/api/devices/{SERIAL}/configure-smm?username=AX%20Wizard&password=SomanetSMM" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @smm_config.csv
```

---

## OS commands

All OS commands use the same endpoint. `command` is a comma-separated byte string.
`os-command-mode` is always `EXECUTE_THE_NEXT_COMMAND_IMMEDIATELY`.

**SMM restart**

```bash
curl -X POST "http://localhost:63526/api/devices/{SERIAL}/run-os-command?command=11%2C15%2C0%2C0%2C0%2C0%2C0%2C0&command-timeout=10000&os-command-mode=EXECUTE_THE_NEXT_COMMAND_IMMEDIATELY&response-polling-interval=1000&read-fs-buffer=false&fs-buffer-read-write-timeout=30000" \
  -H "Content-Type: application/octet-stream" \
  --data-binary ""
```

**SMM firmware version check** (response in `fsBuffer[1].fsBuffer[0]` → `v{major}.{minor}`)

```bash
curl -X POST "http://localhost:63526/api/devices/{SERIAL}/run-os-command?command=11%2C13%2C1%2C0%2C0%2C0%2C0%2C0&command-timeout=10000&os-command-mode=EXECUTE_THE_NEXT_COMMAND_IMMEDIATELY&response-polling-interval=1000&read-fs-buffer=true&fs-buffer-read-write-timeout=30000" \
  -H "Content-Type: application/octet-stream" \
  --data-binary ""
```

**Read max encoder discrepancy** (result in `fsBuffer[0]`)

```bash
curl -X POST "http://localhost:63526/api/devices/{SERIAL}/run-os-command?command=11%2C13%2C17%2C0%2C0%2C0%2C0%2C0&command-timeout=10000&os-command-mode=EXECUTE_THE_NEXT_COMMAND_IMMEDIATELY&response-polling-interval=1000&read-fs-buffer=true&fs-buffer-read-write-timeout=30000" \
  -H "Content-Type: application/octet-stream" \
  --data-binary ""
```

**Set encoder zero** (replace `1` with `2` for motor encoder)

```bash
curl -X POST "http://localhost:63526/api/devices/{SERIAL}/run-os-command?command=0%2C1%2C1%2C117%2C9%2C0%2C0%2C0&command-timeout=10000&os-command-mode=EXECUTE_THE_NEXT_COMMAND_IMMEDIATELY&response-polling-interval=1000&read-fs-buffer=false&fs-buffer-read-write-timeout=30000" \
  -H "Content-Type: application/octet-stream" \
  --data-binary ""
```

**Commutation offset detection** (30 s timeout; result decoded from `response` bytes `[2]<<8 | [3]`)

```bash
curl -X POST "http://localhost:63526/api/devices/{SERIAL}/run-os-command?command=5%2C0%2C0%2C0%2C0%2C0%2C0%2C0&command-timeout=30000&os-command-mode=EXECUTE_THE_NEXT_COMMAND_IMMEDIATELY" \
  -H "Content-Type: application/octet-stream" \
  --data-binary ""
```

---

## Device file system

**Unlock device FS**

```bash
curl -X GET "http://localhost:63526/api/devices/{SERIAL}/files/unlock?request-timeout=10000" \
  -H "accept: */*"
```

**Upload file to device FS**

```bash
curl -X PUT "http://localhost:63526/api/devices/{SERIAL}/files/production_data.txt?request-timeout=10000" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @production_data.txt
```

**Download file from device FS**

```bash
curl -X GET "http://localhost:63526/api/devices/{SERIAL}/files/production_data.txt?request-timeout=10000" \
  -H "accept: */*"
```

---

## Encoder

**Run Circulo encoder configuration** (called for ordinal 2, then 1)

```bash
curl -X GET "http://localhost:63526/api/devices/{SERIAL}/start-circulo-encoder-configuration?encoder-ordinal=2&battery-mode-max-acceleration=10000&request-timeout=20000"
```

**Narrow angle calibration** (returns phase reserve in response JSON)

```bash
curl -X GET "http://localhost:63526/api/devices/{SERIAL}/start-circulo-encoder-narrow-angle-calibration?encoder-ordinal=1&activate-health-monitoring=false&measurement-only=false&request-timeout=100000"
```

**Magnet distance measurement**

```bash
curl -X GET "http://localhost:63526/api/devices/{SERIAL}/circulo-encoder-magnet-distance?encoder-ordinal=1&ring-revision=2"
```

Parameters read/written via the generic endpoint:

| Purpose                               | Index    | Subindex | Direction |
| ------------------------------------- | -------- | -------- | --------- |
| Position control encoder source       | `0x2012` | `9`      | R/W       |
| Torque encoder source                 | `0x2010` | `12`     | R/W       |
| Velocity encoder source               | `0x2011` | `5`      | R/W       |
| Encoder resolution                    | `0x2112` | `3`      | R         |
| Output encoder position (single-turn) | `0x2111` | `1`      | R         |
| Output encoder position (multi-turn)  | `0x2111` | `2`      | R         |
| Motor encoder position (single-turn)  | `0x2113` | `1`      | R         |
| Motor encoder position (multi-turn)   | `0x2113` | `2`      | R         |
| Motor velocity                        | `0x2113` | `3`      | R         |

---

## Motion

**Run position profile**

```bash
curl -X GET "http://localhost:63526/api/devices/{SERIAL}/run-position-profile" \
  -H "accept: text/plain" \
  --get \
  -d "type=position" \
  -d "target=5242880" \
  -d "velocity=1010000" \
  -d "acceleration=1000000" \
  -d "deceleration=1000000" \
  -d "skip-quick-stop=false" \
  -d "relative=true" \
  -d "window=1500" \
  -d "window-time=50" \
  -d "holding-duration=50" \
  -d "target-reach-timeout=60000"
```

**Run torque profile**

```bash
curl -X GET "http://localhost:63526/api/devices/{SERIAL}/run-torque-profile" \
  -H "accept: text/plain" \
  --get \
  -d "type=torque" \
  -d "target=300" \
  -d "slope=300" \
  -d "skip-quick-stop=false" \
  -d "target-reach-timeout=3000" \
  -d "window=100" \
  -d "window-time=5"
```

**Quick stop**

```bash
curl -X GET http://localhost:63526/api/devices/{SERIAL}/quick-stop
```

Parameters read/written via the generic endpoint:

| Purpose                    | Index    | Subindex | Direction | Notes                                                                                            |
| -------------------------- | -------- | -------- | --------- | ------------------------------------------------------------------------------------------------ |
| Controlword                | `0x6040` | `0`      | W         | 6=Shutdown, 7=SwitchOn, 15=EnableOp, 63=StartMove, 128=FaultReset                                |
| Statusword                 | `0x6041` | `0`      | R         | Mask `0x006F` for CiA 402 state; Bit 10=TargetReached, Bit 12=HomingAttained, Bit 13=HomingError |
| Modes of operation         | `0x6060` | `0`      | W         | 1=ProfilePosition, 6=Homing, -2=Diagnostics                                                      |
| Modes of operation display | `0x6061` | `0`      | R         | Actual active mode                                                                               |
| Target position            | `0x607A` | `0`      | W         | Increments                                                                                       |
| Position actual            | `0x6064` | `0`      | R         | Increments                                                                                       |
| Home offset                | `0x607C` | `0`      | W         | Degrees                                                                                          |
| Homing method              | `0x6098` | `0`      | W         | 37                                                                                               |
| Commutation offset         | `0x2001` | `0`      | R/W       | Written by extended detection                                                                    |
| Offset detection method    | `0x2020` | `0`      | W         | 0=current injection                                                                              |
| Applied torque %           | `0x2009` | `2`      | W         | 100                                                                                              |
| Brake status               | `0x2004` | `7`      | R         | 1=engaged, 2=disengaged                                                                          |
| Brake release voltage      | `0x2004` | `10`     | W         | mV: 48000=pull, 6000=hold, 0=off                                                                 |
| Brake release strategy     | `0x2004` | `4`      | W         | 0=manual voltage, 2=pin control                                                                  |
| Digital outputs physical   | `0x60FE` | `1`      | R/W       | Bit 0 = manual brake pin                                                                         |
| Digital outputs bit mask   | `0x60FE` | `2`      | R/W       | Set Bit 0 to allow manual brake control                                                          |
| Safety statusword          | `0x6621` | `3`      | R         | Bit 1 = SBC (hardware brake interlock) active                                                    |
| Last error code            | `0x603F` | `0`      | R         | Read on fault                                                                                    |

---

## GPIO

**Configure GPIO voltage** — `0x2214:1`, value `1`=3.3 V, `2`=5.0 V

```bash
curl -X POST http://localhost:63526/api/devices/{SERIAL}/set-parameter-values \
  -H "Content-Type: application/json" \
  -d '[{"index": "0x2214", "subindex": 1, "uintValue": 1, "typeValue": "uintValue"}]'
```

**Configure GPIO pin mode** — `0x2210:{pin}`, value `0`=disabled, `2`=input, `3`=output; valid pins: 1–4, 7

```bash
curl -X POST http://localhost:63526/api/devices/{SERIAL}/set-parameter-values \
  -H "Content-Type: application/json" \
  -d '[{"index": "0x2210", "subindex": 7, "uintValue": 2, "typeValue": "uintValue"}]'
```

**Force on-demand parameters update** (called after GPIO mode change)

```bash
curl -X GET http://localhost:63526/api/devices/{SERIAL}/force-on-demand-parameters-update
```

**Write GPIO output pin** — `0x60FE:1`, bitmask = `value << (16 + pin - 1)`; valid pins: 1–4

```bash
# pin=1, value=1 → bitmask = 1 << 16 = 65536
curl -X POST http://localhost:63526/api/devices/{SERIAL}/set-parameter-values \
  -H "Content-Type: application/json" \
  -d '[{"index": "0x60FE", "subindex": 1, "uintValue": 65536, "typeValue": "uintValue"}]'
```

**Read GPIO input pin** — `0x60FD:0`; extract bit `(result >> (16 + pin - 1)) & 0x01`; valid pins: 1–7

```bash
curl -X POST http://localhost:63526/api/devices/{SERIAL}/get-parameter-values \
  -H "Content-Type: application/json" \
  -d '[{"index": "0x60FD", "subindex": 0}]'
```

**Set GPIO output mask** (hardcoded to `0xFFFF0000`)

```bash
curl -X GET "http://localhost:63526/api/devices/{SERIAL}/download/0x60FE/0x02/4294901760?request-timeout=5000"
```

---

## Offset detection

**Start dedicated offset detection routine**

```bash
curl -X GET http://localhost:63526/api/devices/{SERIAL}/start-offset-detection
```

The `extended_commutation_offset_detection` method does not use this endpoint. Instead it manually sequences the drive through CiA 402 states using `set-parameter-values` / `get-parameter-values` and fires `run-os-command` with `5,0,0,0,0,0,0,0` at each of 15 equidistant rotor positions, then writes the trigonometric average to `0x2001:0` and saves config.
