import { readFile } from 'node:fs/promises';
import path from 'node:path';
import * as semver from 'semver';
import { expect, test } from 'vitest';
import { ConfigFile } from 'motion-master-client';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

test('read firmware version via parameter', async () => {
  const { data } = await api.devices.getDeviceParameterValues(device.serialNumber, [{ index: 0x2700, subindex: 1 }]);
  const [fw] = data.parameterValues ?? [];
  expect(semver.valid(fw?.stringValue)).not.toBeNull();
  console.log(`firmware version: ${fw?.stringValue}`);
});

test('get all parameters', async () => {
  const { data } = await api.devices.getDeviceParameters(device.serialNumber, {
    'load-from-cache': true,
    'request-timeout': 30_000,
  });
  expect(data.parameters?.length).toBeGreaterThan(0);
  console.log(`parameters count: ${data.parameters?.length}`);
});

test('save config', async () => {
  const { ok } = await api.devices.saveConfig(device.serialNumber);
  expect(ok).toBe(true);
});

test('load config restores parameters', async () => {
  const csvPath = path.resolve(`devices/${device.serialNumber}/config.csv`);
  const csvText = await readFile(csvPath, 'utf8');
  const configFile = new ConfigFile(csvText);
  const expectedOffset = configFile.parameters.find(p => p.index === 0x2001 && p.subindex === 0)?.value;

  await api.devices.downloadParameter(device.serialNumber, '0x2001', '0x00', 123);
  const { data: dirty } = await api.devices.uploadParameter(device.serialNumber, '0x2001', '0x00');
  expect(dirty?.value).toBe(123);

  const file = new File([csvText], 'config.csv', { type: 'text/csv' });
  const { ok } = await api.devices.loadConfig(device.serialNumber, file, {
    strategy: 'replace',
    refresh: true,
  });
  expect(ok).toBe(true);

  const { data: restored } = await api.devices.uploadParameter(device.serialNumber, '0x2001', '0x00');
  expect(restored?.value).toBe(expectedOffset);
  console.log(`commutation angle offset after load-config: ${restored?.value}`);
});
