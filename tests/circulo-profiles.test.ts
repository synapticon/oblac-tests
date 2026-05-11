import { resolveAfter } from 'motion-master-client';
import { expect, test } from 'vitest';
import type { RequestParams } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

test('run position profile', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  const { ok } = await api.devices.runPositionProfile(device.serialNumber, undefined, {
    query: {
      target: 43_692,
      velocity: 2_000,
      acceleration: 5_000,
      deceleration: 5_000,
      relative: true,
      'skip-quick-stop': false,
      'target-reach-timeout': 30_000,
      window: 10,
      'window-time': 1,
      'request-timeout': 60_000,
    },
  } as unknown as RequestParams);

  expect(ok).toBe(true);
}, 90_000);

test('run velocity profile', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  const { ok } = await api.devices.runVelocityProfile(device.serialNumber, undefined, {
    query: {
      target: -3_000,
      acceleration: 5_000,
      deceleration: 5_000,
      'skip-quick-stop': false,
      'target-reach-timeout': 30_000,
      'holding-duration': 2_000,
      window: 10,
      'window-time': 1,
      'request-timeout': 30_000,
    },
  } as unknown as RequestParams);

  expect(ok).toBe(true);
}, 60_000);

test('run torque profile', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  const { ok } = await api.devices.runTorqueProfile(device.serialNumber, undefined, {
    query: {
      target: 150,
      slope: 50,
      'skip-quick-stop': false,
      'target-reach-timeout': 30_000,
      'holding-duration': 3_000,
      window: 30,
      'window-time': 1,
      'request-timeout': 30_000,
    },
  } as unknown as RequestParams);

  expect(ok).toBe(true);

  // skip-quick-stop=false leaves the drive in CiA 402 QUICK_STOP_ACTIVE; give it
  // time to settle into SWITCH_ON_DISABLED so the next test can re-enable operation.
  await resolveAfter(1_000);
}, 60_000);

test('quick-stop', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  // Start a long position move with skip-quick-stop=true — returns immediately with motor moving.
  await api.devices.runPositionProfile(device.serialNumber, undefined, {
    query: {
      target: 524_288,
      velocity: 2_000,
      acceleration: 5_000,
      deceleration: 5_000,
      relative: true,
      'skip-quick-stop': true,
    },
  } as unknown as RequestParams);

  await resolveAfter(2_000);

  const { ok } = await api.devices.quickStop(device.serialNumber);
  expect(ok).toBe(true);
});

test('position profile without target-reach-timeout returns error', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  await expect(
    api.devices.runPositionProfile(device.serialNumber, undefined, {
      query: {
        target: 43_692,
        velocity: 2_000,
        acceleration: 5_000,
        deceleration: 5_000,
        relative: true,
        'skip-quick-stop': false,
        'target-reach-timeout': undefined,
        window: 10,
        'window-time': 1,
        'request-timeout': 60_000,
      },
    } as unknown as RequestParams),
  ).rejects.toMatchObject({ ok: false, status: 400 });
});

test('velocity profile without target-reach-timeout returns error', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  await expect(
    api.devices.runVelocityProfile(device.serialNumber, undefined, {
      query: {
        target: -3_000,
        acceleration: 5_000,
        deceleration: 5_000,
        'skip-quick-stop': false,
        'target-reach-timeout': undefined,
        'holding-duration': 2_000,
        window: 10,
        'window-time': 1,
        'request-timeout': 30_000,
      },
    } as unknown as RequestParams),
  ).rejects.toMatchObject({ ok: false, status: 400 });
});

test('torque profile without target-reach-timeout returns error', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  await expect(
    api.devices.runTorqueProfile(device.serialNumber, undefined, {
      query: {
        target: 150,
        slope: 50,
        'skip-quick-stop': false,
        'target-reach-timeout': undefined,
        'holding-duration': 3_000,
        window: 30,
        'window-time': 1,
        'request-timeout': 30_000,
      },
    } as unknown as RequestParams),
  ).rejects.toMatchObject({ ok: false, status: 400 });
});
