import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { resolveAfter } from 'motion-master-client';
import * as semver from 'semver';
import { expect, test } from 'vitest';
import { logFetch } from '../src/log-fetch.js';
import { ContentType, type RequestParams } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;
const SETTLE_MS = 30_000;
const BASE_URL = process.env.MM_API_URL ?? 'http://localhost:63526/api';

async function installFirmware(version: string): Promise<void> {
  const pkg = `devices/${device.serialNumber}/packages/package_SOMANET-Circulo-7_8602-01_motion-drive_v${version}.zip`;
  const buf = await readFile(pkg);
  const query = new URLSearchParams([['request-timeout', '300000']]);
  const res = await logFetch(
    'req',
    `${BASE_URL}/devices/${device.serialNumber}/start-firmware-installation?${query}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: buf,
    },
  );
  if (!res.ok) {
    throw new Error(`firmware installation failed: ${res.status} ${await res.text()}`);
  }
}

// 1. Factory reset the drive with removing the firmware
test('factory-reset', async () => {
  await api.devices.factoryReset(device.serialNumber, undefined, {
    query: { 'request-timeout': 300_000 },
  } as unknown as RequestParams);
  console.log('Factory reset complete, waiting 30 s for Motion Master to re-init device...');
  await resolveAfter(SETTLE_MS);
}, 120_000 + SETTLE_MS);

// 2. Install v5.6.6 firmware
test('install-v5.6.6-firmware', async () => {
  await installFirmware('5.6.6');
  console.log('Installed v5.6.6, waiting 30 s for Motion Master to re-init device...');
  await resolveAfter(SETTLE_MS);

  const { data } = await api.devices.getDeviceParameterValues(device.serialNumber, [{ index: 0x100a, subindex: 0 }]);
  const [fw] = data.parameterValues ?? [];
  expect(fw?.stringValue).toBeTypeOf('string');
  console.log(`firmware version: ${fw?.stringValue}`);
  expect(semver.eq(fw?.stringValue as string, '5.6.6')).toBe(true);
}, 420_000);

// 3. Load circulo configuration from file
test('load-circulo-configuration', async () => {
  const csvPath = path.resolve(`devices/${device.serialNumber}/config.csv`);
  const csvText = await readFile(csvPath, 'utf8');
  const { ok } = await api.devices.loadConfig(
    device.serialNumber,
    csvText as unknown as File,
    { refresh: true, strategy: 'replace' },
    { type: ContentType.Text },
  );
  expect(ok).toBe(true);
  console.log(`loaded config.csv (${csvText.length} bytes) with refresh=true, strategy=replace`);
});

// 4. Configure encoder
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

// 5. Run offset detection
test('run-offset-detection', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  const { data: steps } = await api.devices.runOffsetDetection(
    device.serialNumber,
    undefined,
    { query: { 'request-timeout': 240_000 } } as unknown as RequestParams,
  );

  console.log('\nOffset detection results:');
  for (const step of steps) {
    if (step.status === 'succeeded') {
      console.log(`  ✔ ${step.label}: ${step.value}`);
    } else {
      console.log(`  ✘ ${step.label}: ${step.status}${step.error ? ` — ${step.error}` : ''}`);
    }
  }

  const failed = steps.filter((s) => s.status === 'failed');
  expect(failed, `failed steps: ${failed.map((s) => s.label).join(', ')}`).toHaveLength(0);
}, 300_000);
