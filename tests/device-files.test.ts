import { expect, test } from 'vitest';
import { ContentType } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice, integroTestDevice } from '../src/test-devices.js';

const TEST_FILENAME = 'test_oblac.txt';
const TEST_HIDDEN_FILENAME = '.test_oblac';
const TEST_CONTENT = 'oblac-tests file operations\n';

for (const device of [circuloTestDevice, integroTestDevice]) {
  test(`${device.name}: list files`, async () => {
    const { data } = await api.devices.getDeviceFileList(device.serialNumber);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data).toContain('.hardware_description');
    console.log(`${device.name} files: ${data.join(', ')}`);
  });

  test(`${device.name}: upload, download, and delete a file`, async () => {
    const { ok: uploadOk } = await api.devices.setDeviceFile(
      device.serialNumber,
      TEST_FILENAME,
      TEST_CONTENT as unknown as File,
      {},
      { type: ContentType.Text },
    );
    expect(uploadOk).toBe(true);

    const { data: listed } = await api.devices.getDeviceFileList(device.serialNumber);
    expect(listed).toContain(TEST_FILENAME);

    const { data: downloaded } = await api.devices.getDeviceFile(
      device.serialNumber,
      TEST_FILENAME,
      {},
      { format: 'text' },
    );
    expect(downloaded as unknown as string).toBe(TEST_CONTENT);
    console.log(`${device.name} downloaded: ${(downloaded as unknown as string).trim()}`);

    const { ok: deleteOk } = await api.devices.deleteDeviceFile(device.serialNumber, TEST_FILENAME);
    expect(deleteOk).toBe(true);

    const { data: afterDelete } = await api.devices.getDeviceFileList(device.serialNumber);
    expect(afterDelete).not.toContain(TEST_FILENAME);
  });

  test(`${device.name}: upload, download, and delete a hidden file`, async () => {
    await api.devices.unlockProtectedFiles(device.serialNumber);
    const { ok: uploadOk } = await api.devices.setDeviceFile(
      device.serialNumber,
      TEST_HIDDEN_FILENAME,
      TEST_CONTENT as unknown as File,
      {},
      { type: ContentType.Text },
    );
    expect(uploadOk).toBe(true);

    const { data: listed } = await api.devices.getDeviceFileList(device.serialNumber);
    expect(listed).toContain(TEST_HIDDEN_FILENAME);

    const { data: downloaded } = await api.devices.getDeviceFile(
      device.serialNumber,
      TEST_HIDDEN_FILENAME,
      {},
      { format: 'text' },
    );
    expect(downloaded as unknown as string).toBe(TEST_CONTENT);
    console.log(`${device.name} hidden downloaded: ${(downloaded as unknown as string).trim()}`);

    await api.devices.unlockProtectedFiles(device.serialNumber);
    const { ok: deleteOk } = await api.devices.deleteDeviceFile(device.serialNumber, TEST_HIDDEN_FILENAME);
    expect(deleteOk).toBe(true);

    const { data: afterDelete } = await api.devices.getDeviceFileList(device.serialNumber);
    expect(afterDelete).not.toContain(TEST_HIDDEN_FILENAME);
  });

  test(`${device.name}: download nonexistent file returns error`, async () => {
    await expect(api.devices.getDeviceFile(device.serialNumber, 'nonexistent_oblac.txt')).rejects.toMatchObject({
      ok: false,
      status: 404,
    });
  });

  test(`${device.name}: delete nonexistent file returns error`, async () => {
    await expect(api.devices.deleteDeviceFile(device.serialNumber, 'nonexistent_oblac.txt')).rejects.toMatchObject({
      ok: false,
    });
  });

  test(`${device.name}: write hidden file without unlock returns error`, async () => {
    await expect(
      api.devices.setDeviceFile(
        device.serialNumber,
        TEST_HIDDEN_FILENAME,
        TEST_CONTENT as unknown as File,
        {},
        { type: ContentType.Text },
      ),
    ).rejects.toMatchObject({ ok: false });
  });

  test(`${device.name}: delete hidden file without unlock returns error`, async () => {
    await api.devices.unlockProtectedFiles(device.serialNumber);
    await api.devices.setDeviceFile(
      device.serialNumber,
      TEST_HIDDEN_FILENAME,
      TEST_CONTENT as unknown as File,
      {},
      { type: ContentType.Text },
    );
    try {
      await expect(api.devices.deleteDeviceFile(device.serialNumber, TEST_HIDDEN_FILENAME)).rejects.toMatchObject({
        ok: false,
      });
    } finally {
      await api.devices.unlockProtectedFiles(device.serialNumber);
      await api.devices.deleteDeviceFile(device.serialNumber, TEST_HIDDEN_FILENAME);
    }
  });
}
