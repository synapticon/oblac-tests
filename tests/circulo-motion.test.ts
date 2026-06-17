import { expect, test } from 'vitest';
import type { RequestParams } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

// Two half-rotation (262_144 counts = half of the Circulo's 2^19/rev encoder) position
// profiles in opposite directions. The first uses skip-quick-stop=true so MM returns as
// soon as motion starts and the drive keeps turning — we then assert the drive is in
// OPERATION_ENABLED and block on when-target-reached until the rotation completes. The
// second profile reverses with skip-quick-stop=false, so the call blocks until target-reach,
// holds for 2 s, and MM performs the trailing quick-stop sequence itself. At the moment the
// second call returns the drive may still be in QUICK_STOP_ACTIVE, so we block on
// when-cia402-state-reached until it settles into SWITCH_ON_DISABLED.
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

  const { ok: targetReached, data: targetReachedData } = await api.devices.whenTargetReached(device.serialNumber, {
    'monitoring-interval': 500,
    'request-timeout': 30_000,
  });
  expect(targetReached).toBe(true);
  expect(targetReachedData.targetReached).toBe(true);

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

  const { ok: stateReached } = await api.devices.whenCia402StateReached(device.serialNumber, 'SWITCH_ON_DISABLED', {
    'monitoring-interval': 200,
    'request-timeout': 10_000,
  });
  expect(stateReached).toBe(true);
}, 120_000);
