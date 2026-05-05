import { test, expect } from 'vitest';
import { api } from '../src/setup.js';

test('client library version', async () => {
  const { data } = await api.version.getVersion();
  console.log('motion-master-client version:', data.version);
  expect(data.version).toMatch(/^\d+\.\d+\.\d+/);
});

test('system version', async () => {
  const { data } = await api.systemVersion.getSystemVersion();
  console.log(`system version: ${data.version}`);
  expect(data.version).toBeTruthy();
});

test('devices', async () => {
  const { data } = await api.devices.getDevices();
  console.log(`devices found: ${data.length}`);
  for (const device of data) {
    console.log(`position: ${device.position}, serial: ${device.hardwareDescription?.device?.serialNumber}`);
  }
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);
});
