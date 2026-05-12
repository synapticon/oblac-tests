import { resolveAfter } from 'motion-master-client';
import { expect, test } from 'vitest';
import type { RequestParams } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

test('position profile mid-motion retarget and quick stop', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  // Half rotation forward; holds at target for 2 s before returning.
  await api.devices.runPositionProfile(device.serialNumber, undefined, {
    query: {
      target: 65_536,
      velocity: 5_000,
      acceleration: 5_000,
      deceleration: 5_000,
      relative: true,
      'skip-quick-stop': true,
      'target-reach-timeout': 30_000,
      'holding-duration': 2_000,
      window: 10,
      'window-time': 1,
      'request-timeout': 60_000,
    },
  } as unknown as RequestParams);

  // Download new target position — half rotation in the opposite direction (relative).
  await api.devices.downloadParameter(device.serialNumber, '0x607A', '0', -65_536);

  // Apply the new set-point; motor starts moving toward the new target.
  await api.devices.applySetPoint(device.serialNumber);

  await resolveAfter(2_000);

  const { ok } = await api.devices.quickStop(device.serialNumber);
  expect(ok).toBe(true);
}, 120_000);
