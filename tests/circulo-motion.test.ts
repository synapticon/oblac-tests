import { resolveAfter } from 'motion-master-client';
import { expect, test } from 'vitest';
import type { RequestParams } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

// Two half-rotation (262_144 counts = half of the Circulo's 2^19/rev encoder) position
// profiles in opposite directions. The first uses skip-quick-stop=true so MM returns as
// soon as motion starts and the drive keeps turning — we then assert the drive is in
// OPERATION_ENABLED and sleep 10 s to let it rotate. The second profile reverses with
// skip-quick-stop=false, so the call blocks until target-reach, holds for 2 s, and MM
// performs the trailing quick-stop sequence itself. We then sleep 1 s — at the moment
// the second call returns the drive may still be in QUICK_STOP_ACTIVE and needs a
// little time to settle into SWITCH_ON_DISABLED, which we then assert.
test('position profile half a circle in two directions verifies CiA402 state transitions', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  await api.devices.runPositionProfile(device.serialNumber, undefined, {
    query: {
      target: 262_144,
      velocity: 5_000,
      acceleration: 10_000,
      deceleration: 10_000,
      relative: true,
      'skip-quick-stop': true,
      window: 10,
      'window-time': 1,
      'request-timeout': 60_000,
    },
  } as unknown as RequestParams);

  const {
    data: { state: cia402State1 },
  } = await api.devices.getCia402State(device.serialNumber);
  expect(cia402State1).toBe('OPERATION_ENABLED');

  await resolveAfter(7_000);

  await api.devices.runPositionProfile(device.serialNumber, undefined, {
    query: {
      target: -262_144,
      velocity: 5_000,
      acceleration: 10_000,
      deceleration: 10_000,
      relative: true,
      'skip-quick-stop': false,
      'target-reach-timeout': 30_000,
      'holding-duration': 2_000,
      window: 10,
      'window-time': 1,
      'request-timeout': 60_000,
    },
  } as unknown as RequestParams);

  await resolveAfter(1_000);

  const {
    data: { state: cia402State2 },
  } = await api.devices.getCia402State(device.serialNumber);
  expect(cia402State2).toBe('SWITCH_ON_DISABLED');
}, 120_000);
