import { expect, test } from 'vitest';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

test('read statusword', async () => {
  const { data } = await api.devices.getDeviceParameterValues(device.serialNumber, [{ index: 0x6041, subindex: 0 }]);
  const [sw] = data.parameterValues ?? [];
  expect(sw?.uintValue).toBeTypeOf('number');
  console.log(`statusword: 0x${sw?.uintValue?.toString(16).padStart(4, '0')}`);
});

test('read position actual', async () => {
  const { data } = await api.devices.getDeviceParameterValues(device.serialNumber, [{ index: 0x6064, subindex: 0 }]);
  const [pos] = data.parameterValues ?? [];
  expect(pos?.intValue).toBeTypeOf('number');
  console.log(`position actual: ${pos?.intValue} inc`);
});

test('read encoder resolution', async () => {
  const { data } = await api.devices.getDeviceParameterValues(device.serialNumber, [{ index: 0x2112, subindex: 3 }]);
  const [res] = data.parameterValues ?? [];
  expect(res?.uintValue).toBeTypeOf('number');
  console.log(`encoder resolution: ${res?.uintValue}`);
});

test('read output and motor encoder positions', async () => {
  const { data } = await api.devices.getDeviceParameterValues(device.serialNumber, [
    { index: 0x2111, subindex: 1 }, // output raw position (UDINT)
    { index: 0x2111, subindex: 2 }, // output adjusted position (DINT)
    { index: 0x2113, subindex: 1 }, // motor raw position (UDINT)
    { index: 0x2113, subindex: 2 }, // motor adjusted position (DINT)
  ]);
  const [outSingle, outMulti, motSingle, motMulti] = data.parameterValues ?? [];
  expect(outSingle?.uintValue).toBeTypeOf('number');
  expect(outMulti?.intValue).toBeTypeOf('number');
  expect(motSingle?.uintValue).toBeTypeOf('number');
  expect(motMulti?.intValue).toBeTypeOf('number');
  console.log(`output: single=${outSingle?.uintValue}, multi=${outMulti?.intValue}`);
  console.log(`motor:  single=${motSingle?.uintValue}, multi=${motMulti?.intValue}`);
});

test('write and read back home offset', async () => {
  await api.devices.setDeviceParameterValues(device.serialNumber, [
    { index: 0x607c, subindex: 0, intValue: 0, typeValue: 'intValue' },
  ]);
  const { data } = await api.devices.getDeviceParameterValues(device.serialNumber, [{ index: 0x607c, subindex: 0 }]);
  const [offset] = data.parameterValues ?? [];
  expect(offset?.intValue).toBe(0);
  console.log(`home offset: ${offset?.intValue}`);
});
