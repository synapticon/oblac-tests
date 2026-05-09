import * as semver from 'semver';
import { expect, test } from 'vitest';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

test('read firmware version', async () => {
  const { data } = await api.devices.getDeviceParameterValues(device.serialNumber, [{ index: 0x100a, subindex: 0 }]);
  const [fw] = data.parameterValues ?? [];
  expect(semver.valid(fw?.stringValue)).not.toBeNull();
  console.log(`firmware version: ${fw?.stringValue}`);
});

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

test('read and write back velocity loop Kp', async () => {
  const { data: initialData } = await api.devices.getDeviceParameterValues(device.serialNumber, [
    { index: 0x2012, subindex: 5 },
  ]);
  const [initial] = initialData.parameterValues ?? [];
  expect(initial?.floatValue).toBeTypeOf('number');
  expect(Number.isFinite(initial?.floatValue)).toBe(true);
  console.log(`velocity loop Kp initial: ${initial?.floatValue}`);

  await api.devices.setDeviceParameterValues(device.serialNumber, [
    { index: 0x2012, subindex: 5, floatValue: 1.2345, typeValue: 'floatValue' },
  ]);
  const { data: writtenData } = await api.devices.getDeviceParameterValues(device.serialNumber, [
    { index: 0x2012, subindex: 5 },
  ]);
  const [written] = writtenData.parameterValues ?? [];
  expect(written?.floatValue).toBeCloseTo(1.2345, 4);
  console.log(`velocity loop Kp written: ${written?.floatValue}`);

  await api.devices.setDeviceParameterValues(device.serialNumber, [
    { index: 0x2012, subindex: 5, floatValue: initial?.floatValue, typeValue: 'floatValue' },
  ]);
  console.log(`velocity loop Kp reverted: ${initial?.floatValue}`);
});

test('read and write back assigned name', async () => {
  const { data: initialData } = await api.devices.getDeviceParameterValues(device.serialNumber, [
    { index: 0x20f2, subindex: 0 },
  ]);
  const [initial] = initialData.parameterValues ?? [];
  expect(initial?.stringValue).toBeTypeOf('string');
  console.log(`assigned name initial: "${initial?.stringValue}"`);

  await api.devices.setDeviceParameterValues(device.serialNumber, [
    { index: 0x20f2, subindex: 0, stringValue: 'test-name', typeValue: 'stringValue' },
  ]);
  const { data: writtenData } = await api.devices.getDeviceParameterValues(device.serialNumber, [
    { index: 0x20f2, subindex: 0 },
  ]);
  const [written] = writtenData.parameterValues ?? [];
  expect(written?.stringValue).toBe('test-name');
  console.log(`assigned name written: "${written?.stringValue}"`);

  await api.devices.setDeviceParameterValues(device.serialNumber, [
    { index: 0x20f2, subindex: 0, stringValue: initial?.stringValue, typeValue: 'stringValue' },
  ]);
  console.log(`assigned name reverted: "${initial?.stringValue}"`);
});

test('read and write back commutation angle offset', async () => {
  const { data: initialData } = await api.devices.getDeviceParameterValues(device.serialNumber, [
    { index: 0x2001, subindex: 0 },
  ]);
  const [initial] = initialData.parameterValues ?? [];
  expect(initial?.intValue).toBeTypeOf('number');
  console.log(`commutation angle offset initial: ${initial?.intValue}`);

  await api.devices.setDeviceParameterValues(device.serialNumber, [
    { index: 0x2001, subindex: 0, intValue: 100, typeValue: 'intValue' },
  ]);
  const { data: writtenData } = await api.devices.getDeviceParameterValues(device.serialNumber, [
    { index: 0x2001, subindex: 0 },
  ]);
  const [written] = writtenData.parameterValues ?? [];
  expect(written?.intValue).toBe(100);
  console.log(`commutation angle offset written: ${written?.intValue}`);

  await api.devices.setDeviceParameterValues(device.serialNumber, [
    { index: 0x2001, subindex: 0, intValue: initial?.intValue, typeValue: 'intValue' },
  ]);
  console.log(`commutation angle offset reverted: ${initial?.intValue}`);
});

test('upload/download commutation angle offset', async () => {
  const { data: initial } = await api.devices.uploadParameter(device.serialNumber, '0x2001', '0x00');
  expect(initial?.value).toBeTypeOf('number');
  console.log(`commutation angle offset initial: ${initial?.value}`);

  await api.devices.downloadParameter(device.serialNumber, '0x2001', '0x00', 100);
  const { data: written } = await api.devices.uploadParameter(device.serialNumber, '0x2001', '0x00');
  expect(written?.value).toBe(100);
  console.log(`commutation angle offset written: ${written?.value}`);

  await api.devices.downloadParameter(device.serialNumber, '0x2001', '0x00', initial?.value as number);
  console.log(`commutation angle offset reverted: ${initial?.value}`);
});

test('upload/download assigned name', async () => {
  const { data: initial } = await api.devices.uploadParameter(device.serialNumber, '0x20f2', '0x00');
  expect(initial?.value).toBeTypeOf('string');
  console.log(`assigned name initial: "${initial?.value}"`);

  await api.devices.downloadParameter(device.serialNumber, '0x20f2', '0x00', 'test-name');
  const { data: written } = await api.devices.uploadParameter(device.serialNumber, '0x20f2', '0x00');
  expect(written?.value).toBe('test-name');
  console.log(`assigned name written: "${written?.value}"`);

  await api.devices.downloadParameter(device.serialNumber, '0x20f2', '0x00', initial?.value as string);
  console.log(`assigned name reverted: "${initial?.value}"`);
});

test('upload/download velocity loop Kp', async () => {
  const { data: initial } = await api.devices.uploadParameter(device.serialNumber, '0x2012', '0x05');
  expect(initial?.value).toBeTypeOf('number');
  expect(Number.isFinite(initial?.value as number)).toBe(true);
  console.log(`velocity loop Kp initial: ${initial?.value}`);

  await api.devices.downloadParameter(device.serialNumber, '0x2012', '0x05', 1.2345);
  const { data: written } = await api.devices.uploadParameter(device.serialNumber, '0x2012', '0x05');
  expect(written?.value as number).toBeCloseTo(1.2345, 4);
  console.log(`velocity loop Kp written: ${written?.value}`);

  await api.devices.downloadParameter(device.serialNumber, '0x2012', '0x05', initial?.value as number);
  console.log(`velocity loop Kp reverted: ${initial?.value}`);
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
