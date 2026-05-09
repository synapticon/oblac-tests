/** A physical device under test, identified by its EtherCAT position and serial number. */
export interface TestDevice {
  /** EtherCAT bus position (1-based). */
  position: number;
  /** Device serial number in `PPPP-VV-SSSSSSS-YYWW` format. */
  serialNumber: string;
  /** Human-readable device name. */
  name: string;
}

/**
 * Ordered list of devices attached to the test rig.
 *
 * Position values must match the physical EtherCAT topology.
 * Tests that target a specific device select it by serial number.
 */
export const testDevices: TestDevice[] = [
  { position: 1, serialNumber: '9501-01-0001512-1851', name: 'Node 400 EtherCAT' },
  {
    position: 2,
    serialNumber: '9002-02-0000466-2339',
    name: 'Integro-60 R1.5 (600 W, EtherCAT, STO, 18 bit + MT + IOs)',
  },
  {
    position: 3,
    serialNumber: '8612-02-0001553-2341',
    name: 'Circulo 7 Safe Motion - 700, Magnetic Rings (pos.1&2), no external encoders',
  },
];

/** SOMANET Node 400 EtherCAT at EtherCAT position 1. */
export const nodeTestDevice: TestDevice = testDevices[0] as TestDevice;
/** SOMANET Integro-60 at EtherCAT position 2. */
export const integroTestDevice: TestDevice = testDevices[1] as TestDevice;
/** SOMANET Circulo 7 with Safe Motion Module at EtherCAT position 3. */
export const circuloTestDevice: TestDevice = testDevices[2] as TestDevice;
