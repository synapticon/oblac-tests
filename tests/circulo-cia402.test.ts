import { expect, test } from 'vitest';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

test('transition to READY_TO_SWITCH_ON', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  const { ok } = await api.devices.transitionToCia402State(device.serialNumber, 'READY_TO_SWITCH_ON');
  expect(ok).toBe(true);

  const {
    data: { state },
  } = await api.devices.getCia402State(device.serialNumber);
  expect(state).toBe('READY_TO_SWITCH_ON');
});

test('transition to SWITCHED_ON', async () => {
  const { ok } = await api.devices.transitionToCia402State(device.serialNumber, 'SWITCHED_ON');
  expect(ok).toBe(true);

  const {
    data: { state },
  } = await api.devices.getCia402State(device.serialNumber);
  expect(state).toBe('SWITCHED_ON');
});

test('transition to OPERATION_ENABLED', async () => {
  const { ok } = await api.devices.transitionToCia402State(device.serialNumber, 'OPERATION_ENABLED');
  expect(ok).toBe(true);

  const {
    data: { state },
  } = await api.devices.getCia402State(device.serialNumber);
  expect(state).toBe('OPERATION_ENABLED');
});

test('transition to SWITCH_ON_DISABLED from OPERATION_ENABLED', async () => {
  const { ok } = await api.devices.transitionToCia402State(device.serialNumber, 'SWITCH_ON_DISABLED');
  expect(ok).toBe(true);

  const {
    data: { state },
  } = await api.devices.getCia402State(device.serialNumber);
  expect(state).toBe('SWITCH_ON_DISABLED');
});
