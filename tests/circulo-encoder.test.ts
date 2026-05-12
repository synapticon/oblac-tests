import { expect, test } from 'vitest';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

test('start-circulo-encoder-narrow-angle-calibration', async () => {
  const { data, ok } = await api.devices.startCirculoEncoderNarrowAngleCalibrationProcedure(device.serialNumber, {
    'request-timeout': 300_000,
  });

  expect(ok).toBe(true);
  for (const step of data) {
    console.log(`  ${step.result.meaning}: ${step.result.value}`);
  }
});

test('start-circulo-encoder-configuration', async () => {
  const { ok } = await api.devices.startCirculoEncoderConfiguration(device.serialNumber);

  expect(ok).toBe(true);
});

test('check-circulo-encoder-errors', async () => {
  const { data, ok } = await api.devices.checkCirculoEncoderErrors(device.serialNumber);

  expect(ok).toBe(true);
  for (const error of data) {
    console.log(`  ${error.name}: ${error.error}`);
  }
  expect(data).toHaveLength(0);
});
