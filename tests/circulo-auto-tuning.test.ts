import { expect, test } from 'vitest';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

test('compute-auto-tuning-gains velocity', async () => {
  await api.devices.downloadParameter(device.serialNumber, '0x2011', '0x01', 0);
  await api.devices.downloadParameter(device.serialNumber, '0x2011', '0x02', 0);
  await api.devices.downloadParameter(device.serialNumber, '0x2011', '0x03', 0);

  const { ok } = await api.devices.computeAutoTuningGainsVelocity(device.serialNumber, {
    'request-timeout': 10_000,
  });

  expect(ok).toBe(true);

  const { data: kp } = await api.devices.uploadParameter(device.serialNumber, '0x2011', '0x01');
  expect(kp?.value).toBeGreaterThan(0);
  console.log(`velocity kp after compute: ${kp?.value}`);
});

test('compute-auto-tuning-gains position', async () => {
  await api.devices.downloadParameter(device.serialNumber, '0x2012', '0x01', 0);
  await api.devices.downloadParameter(device.serialNumber, '0x2012', '0x02', 0);
  await api.devices.downloadParameter(device.serialNumber, '0x2012', '0x03', 0);

  const { ok } = await api.devices.computeAutoTuningGainsPosition(device.serialNumber, {
    'controller-type': 'P_PI',
    'request-timeout': 10_000,
  });

  expect(ok).toBe(true);

  const { data: kp } = await api.devices.uploadParameter(device.serialNumber, '0x2012', '0x01');
  expect(kp?.value).toBeGreaterThan(0);
  console.log(`position kp after compute: ${kp?.value}`);
});

test('start-full-auto-tuning velocity', async () => {
  await api.devices.downloadParameter(device.serialNumber, '0x2011', '0x01', 0);
  await api.devices.downloadParameter(device.serialNumber, '0x2011', '0x02', 0);
  await api.devices.downloadParameter(device.serialNumber, '0x2011', '0x03', 0);

  const { data, ok } = await api.devices.startFullAutoTuningVelocity(device.serialNumber, {
    'request-timeout': 20_000,
  });

  expect(ok).toBe(true);
  console.log('full velocity auto-tuning result:', JSON.stringify(data, null, 2));

  const { data: kp } = await api.devices.uploadParameter(device.serialNumber, '0x2011', '0x01');
  expect(kp?.value).toBeGreaterThan(0);
  console.log(`velocity kp after full auto-tuning: ${kp?.value}`);
});

test('start-full-auto-tuning position', async () => {
  await api.devices.downloadParameter(device.serialNumber, '0x2012', '0x01', 0);
  await api.devices.downloadParameter(device.serialNumber, '0x2012', '0x02', 0);
  await api.devices.downloadParameter(device.serialNumber, '0x2012', '0x03', 0);

  const { data, ok } = await api.devices.startFullAutoTuningPosition(device.serialNumber, 'P_PI', {
    'request-timeout': 20_000,
  });

  expect(ok).toBe(true);
  console.log('full position auto-tuning result:', JSON.stringify(data, null, 2));

  const { data: kp } = await api.devices.uploadParameter(device.serialNumber, '0x2012', '0x01');
  expect(kp?.value).toBeGreaterThan(0);
  console.log(`position kp after full auto-tuning: ${kp?.value}`);
});
