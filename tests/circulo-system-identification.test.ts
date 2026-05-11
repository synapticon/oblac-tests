import { parsePlantModelCsv } from 'motion-master-client';
import { expect, test } from 'vitest';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const PLANT_MODEL_FILE = 'plant_model.csv';
const device = circuloTestDevice;

test('run-system-identification', async () => {
  const { data: filesBefore } = await api.devices.getDeviceFileList(device.serialNumber);
  if (filesBefore.includes(PLANT_MODEL_FILE)) {
    await api.devices.deleteDeviceFile(device.serialNumber, PLANT_MODEL_FILE);
  }

  await api.devices.resetFault(device.serialNumber, { force: true });

  await api.devices.startSystemIdentification(device.serialNumber, {
    'duration-seconds': 3,
    'torque-amplitude': 300,
    'start-frequency': 2,
    'end-frequency': 60,
    'request-timeout': 60_000,
  });

  const { data: filesAfter } = await api.devices.getDeviceFileList(device.serialNumber);
  expect(filesAfter).toContain(PLANT_MODEL_FILE);

  const { data: content } = await api.devices.getDeviceFile(
    device.serialNumber,
    PLANT_MODEL_FILE,
    {},
    { format: 'text' },
  );
  expect((content as unknown as string).length).toBeGreaterThan(0);

  const plantModel = parsePlantModelCsv(content as unknown as string);
  console.log(JSON.stringify(plantModel, null, 2));
}, 120_000);
