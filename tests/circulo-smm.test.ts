import { expect, test } from 'vitest';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

test('read SMM firmware version', async () => {
  const { data } = await api.devices.runOsCommand(
    device.serialNumber,
    {
      command: '11,13,1,0,0,0,0,0',
      'command-timeout': 10_000,
      'response-polling-interval': 1_000,
      'os-command-mode': 'EXECUTE_THE_NEXT_COMMAND_IMMEDIATELY',
      'read-fs-buffer': true,
      'fs-buffer-read-write-timeout': 30_000,
    },
    null,
  );
  expect(data.errorCode ?? 0).toBe(0);
  const [minor, major] = data.fsBuffer ?? [];
  expect(major).toBeTypeOf('number');
  expect(minor).toBeTypeOf('number');
  console.log(`SMM firmware version: v${major}.${minor}`);
});

test('SMM restart', async () => {
  const { data } = await api.devices.runOsCommand(
    device.serialNumber,
    {
      command: '11,15,0,0,0,0,0,0',
      'command-timeout': 10_000,
      'response-polling-interval': 1_000,
      'os-command-mode': 'EXECUTE_THE_NEXT_COMMAND_IMMEDIATELY',
      'read-fs-buffer': false,
      'fs-buffer-read-write-timeout': 30_000,
    },
    null,
  );
  expect(data.errorCode ?? 0).toBe(0);
});
