import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ConfigFile, resolveAfter } from 'motion-master-client';
import * as semver from 'semver';
import { expect, test } from 'vitest';
import { logFetch } from '../src/log-fetch.js';
import { ContentType, type RequestParams } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;
const SETTLE_MS = 30_000;
const BASE_URL = process.env.MM_API_URL ?? 'http://localhost:63526/api';

// The generated client types `data: File` and runs JSON.stringify on any non-string body,
// which would mangle the firmware ZIP. The endpoint accepts application/octet-stream, so
// we POST the raw buffer with fetch directly (via logFetch for [req] log parity).
async function installFirmware(version: string, opts: { skipFiles?: string[] } = {}): Promise<void> {
  const pkg = `devices/${device.serialNumber}/packages/package_SOMANET-Circulo-7_8602-01_motion-drive_v${version}.zip`;
  const buf = await readFile(pkg);
  const query = new URLSearchParams([['request-timeout', '300000']]);
  for (const f of opts.skipFiles ?? []) {
    query.append('skip-files', f);
  }
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

async function readFirmwareVersion(): Promise<string> {
  const { data } = await api.devices.getDeviceParameterValues(device.serialNumber, [{ index: 0x100a, subindex: 0 }]);
  const [fw] = data.parameterValues ?? [];
  expect(fw?.stringValue).toBeTypeOf('string');
  return fw?.stringValue as string;
}

async function readCommutationOffset(): Promise<number> {
  const { data } = await api.devices.getDeviceParameterValues(device.serialNumber, [{ index: 0x2001, subindex: 0 }]);
  const [offset] = data.parameterValues ?? [];
  expect(offset?.intValue).toBeTypeOf('number');
  return offset?.intValue as number;
}

test(
  `${device.name}: install v5.6.5, factory reset, install v5.6.6, load config`,
  async () => {
    await installFirmware('5.6.5', {
      skipFiles: ['SOMANET_CiA_402.xml.zip', 'stack_image.svg.zip'],
    });
    console.log('Installed v5.6.5, waiting 30 s for Motion Master to re-init device...');
    await resolveAfter(SETTLE_MS);
    const after565 = await readFirmwareVersion();
    console.log(`firmware version after v5.6.5 install: ${after565}`);
    expect(semver.eq(after565, '5.6.5')).toBe(true);

    console.log('Performing factory reset (wipes config.csv and all non-essential files)...');
    // factoryReset's typed query does not include `request-timeout`; pass it via the
    // RequestParams cast escape hatch (see CLAUDE.md). Default install-empty-firmware=true
    // means the next firmware install starts from a blank device.
    await api.devices.factoryReset(device.serialNumber, undefined, {
      query: { 'request-timeout': 300_000 },
    } as unknown as RequestParams);
    await resolveAfter(SETTLE_MS);

    await installFirmware('5.6.6');
    console.log('Installed v5.6.6, waiting 30 s for Motion Master to re-init device...');
    await resolveAfter(SETTLE_MS);
    const after566 = await readFirmwareVersion();
    console.log(`firmware version after v5.6.6 install: ${after566}`);
    expect(semver.eq(after566, '5.6.6')).toBe(true);

    const offsetAfterReset = await readCommutationOffset();
    console.log(`commutation angle offset after factory reset: ${offsetAfterReset}`);
    expect(offsetAfterReset).toBe(0);

    const csvPath = path.resolve(`devices/${device.serialNumber}/config.csv`);
    const csvText = await readFile(csvPath, 'utf8');
    const expectedOffset = new ConfigFile(csvText).parameters.find((p) => p.index === 0x2001 && p.subindex === 0)
      ?.value as number;
    expect(expectedOffset).toBeTypeOf('number');
    expect(expectedOffset).not.toBe(0);

    const { ok } = await api.devices.loadConfig(
      device.serialNumber,
      csvText as unknown as File,
      { refresh: true, strategy: 'replace' },
      { type: ContentType.Text },
    );
    expect(ok).toBe(true);
    console.log(`loaded config.csv (${csvText.length} bytes) with refresh=true, strategy=replace`);

    const offsetAfterLoad = await readCommutationOffset();
    console.log(`commutation angle offset after load-config: ${offsetAfterLoad} (csv: ${expectedOffset})`);
    expect(offsetAfterLoad).toBe(expectedOffset);
  },
  720_000,
);
