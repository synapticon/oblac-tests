import { expect, test } from 'vitest';
import type { RequestParams } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

test('run position profile', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  const { ok } = await api.devices.runPositionProfile(
    device.serialNumber,
    {
      target: 5_242_880,
      velocity: 1_010_000,
      acceleration: 1_000_000,
      deceleration: 1_000_000,
      relative: true,
      'skip-quick-stop': false,
      'target-reach-timeout': 30_000,
      window: 1500,
      'window-time': 50,
    },
    { query: { 'request-timeout': 60_000 } } as unknown as RequestParams,
  );

  expect(ok).toBe(true);
}, 90_000);

test('run torque profile', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  const { ok } = await api.devices.runTorqueProfile(
    device.serialNumber,
    {
      target: 300,
      slope: 300,
      'skip-quick-stop': false,
      'target-reach-timeout': 5_000,
      window: 100,
      'window-time': 5,
    },
    { query: { 'request-timeout': 30_000 } } as unknown as RequestParams,
  );

  expect(ok).toBe(true);
}, 60_000);

test('quick-stop', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  // Start a long position move with skip-quick-stop=true — returns immediately with motor moving.
  await api.devices.runPositionProfile(device.serialNumber, {
    target: 5_242_880,
    velocity: 1_010_000,
    acceleration: 1_000_000,
    deceleration: 1_000_000,
    relative: true,
    'skip-quick-stop': true,
  });

  const { ok } = await api.devices.quickStop(device.serialNumber);
  expect(ok).toBe(true);
});

test('position profile without target-reach-timeout returns error', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  await expect(
    api.devices.runPositionProfile(device.serialNumber, {
      target: 5_242_880,
      velocity: 1_010_000,
      acceleration: 1_000_000,
      deceleration: 1_000_000,
      relative: true,
      'skip-quick-stop': false,
    }),
  ).rejects.toMatchObject({ ok: false, status: 400 });
});

test('torque profile without target-reach-timeout returns error', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  await expect(
    api.devices.runTorqueProfile(device.serialNumber, {
      target: 300,
      slope: 300,
      'skip-quick-stop': false,
    }),
  ).rejects.toMatchObject({ ok: false, status: 400 });
});
