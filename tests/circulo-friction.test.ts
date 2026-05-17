import { resolveAfter } from 'motion-master-client';
import { expect, test } from 'vitest';
import type { RequestParams } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

// 1000–10000 mRPM in 1000 mRPM steps; no load attached so steady-state torque = friction torque
const SPEED_STEPS_MRPM = Array.from({ length: 10 }, (_, i) => (i + 1) * 1_000);

// Parse the monitoring CSV (first row = parameter-ID headers) and return all values
// from the column whose header contains `colHint` (e.g. "6077" for torque actual).
function extractMonitoringColumn(csv: string, colHint: string): number[] {
  const lines = csv.trim().split('\n').filter((l) => l.length > 0);
  if (lines.length < 2) {
    return [];
  }
  const headers = lines[0].split(',');
  const colIdx = headers.findIndex((h) => h.toLowerCase().includes(colHint.toLowerCase()));
  if (colIdx === -1) {
    return [];
  }
  return lines
    .slice(1)
    .map((line) => Number(line.split(',')[colIdx]))
    .filter((v) => Number.isFinite(v));
}

test('friction torque sweep 1000–10000 mRPM', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  const results: { speedMrpm: number; torquePermil: number }[] = [];

  for (const speedMrpm of SPEED_STEPS_MRPM) {
    // Fresh monitoring session — clears any previous data for this device
    await api.devices.startMonitoring(device.serialNumber);

    // skip-quick-stop=true: MM returns once OPERATION_ENABLED, motor keeps running
    await api.devices.runVelocityProfile(device.serialNumber, undefined, {
      query: {
        target: speedMrpm,
        acceleration: 10_000,
        deceleration: 10_000,
        'skip-quick-stop': true,
        'request-timeout': 15_000,
      },
    } as unknown as RequestParams);

    // Wait for the motor to reach steady state at the target speed
    await resolveAfter(2_000);

    const { data: csv } = await api.devices.getMonitoringData(device.serialNumber);
    await api.devices.stopMonitoring(device.serialNumber);

    // 0x6077: Torque actual value — signed permil (‰) of rated torque (CiA 402)
    const torqueValues = extractMonitoringColumn(csv as unknown as string, '6077');
    expect(torqueValues.length).toBeGreaterThanOrEqual(10);

    // Average the last 10 samples to smooth out noise
    const last10 = torqueValues.slice(-10);
    const torquePermil = Math.round(last10.reduce((sum, v) => sum + v, 0) / last10.length);

    results.push({ speedMrpm, torquePermil });
    console.log(
      `${speedMrpm} mRPM → torque actual (avg 10 samples): ${torquePermil} ‰ (${(torquePermil / 10).toFixed(1)} %) [${torqueValues.length} total samples]`,
    );

    await api.devices.quickStop(device.serialNumber);
    // Allow the drive to complete quick stop and settle into SWITCH_ON_DISABLED
    await resolveAfter(1_500);
  }

  expect(results).toHaveLength(SPEED_STEPS_MRPM.length);
  for (const { torquePermil } of results) {
    expect(Number.isFinite(torquePermil)).toBe(true);
  }

  console.log('\nFriction summary:');
  console.log('Speed [mRPM] | Torque actual [‰] | Torque actual [%]');
  console.log('-------------|-------------------|------------------');
  for (const { speedMrpm, torquePermil } of results) {
    console.log(
      `${String(speedMrpm).padStart(11)} | ${String(torquePermil).padStart(17)} | ${(torquePermil / 10).toFixed(1).padStart(17)}`,
    );
  }
}, 120_000);
