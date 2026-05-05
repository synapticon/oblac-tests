import { test, expect } from 'vitest';
import { api } from '../src/setup.js';

test('client library version', async () => {
  const { data } = await api.version.getVersion();
  console.log('motion-master-client version:', data.version);
  expect(data.version).toMatch(/^\d+\.\d+\.\d+/);
});

test('system version', async () => {
  const { data } = await api.systemVersion.getSystemVersion();
  console.log('system version:', JSON.stringify(data, null, 2));
  expect(data.version).toBeTruthy();
});
