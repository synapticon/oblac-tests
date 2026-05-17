import { resolveAfter } from 'motion-master-client';
import { expect, test } from 'vitest';
import type { RequestParams } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;
const SPEED_STEPS_MRPM = Array.from({ length: 10 }, (_, i) => (i + 1) * 1_000);

function parseMonitoringColumn(csv: string, colHint: string): number[] {
  const lines = csv.trim().split('\n').filter((l) => l.length > 0);
  if (lines.length < 2) {
    return [];
  }
  const headers = lines[0].split(',');
  const col = headers.findIndex((h) => h.includes(colHint));
  if (col === -1) {
    return [];
  }
  return lines
    .slice(1)
    .map((l) => Number(l.split(',')[col]))
    .filter((v) => Number.isFinite(v));
}

test('friction torque sweep 1000–10000 mRPM', async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });

  const { data: ratedTorqueData } = await api.devices.getDeviceParameterValues(device.serialNumber, [
    { index: 0x6076, subindex: 0 },
  ]);
  const ratedTorqueMNm = ratedTorqueData.parameterValues?.[0]?.uintValue;
  expect(ratedTorqueMNm).toBeTypeOf('number');
  console.log(`rated torque: ${ratedTorqueMNm} mNm (${((ratedTorqueMNm as number) / 1000).toFixed(3)} Nm)`);

  const results: { speedMrpm: number; frictionTorqueMNm: number; frictionCoeffNmSRad: number }[] = [];

  for (const speedMrpm of SPEED_STEPS_MRPM) {
    const { ok: monOk } = await api.devices.startMonitoring(device.serialNumber);
    expect(monOk).toBe(true);

    await api.devices.runVelocityProfile(device.serialNumber, undefined, {
      query: {
        target: speedMrpm,
        acceleration: 10_000,
        deceleration: 10_000,
        'skip-quick-stop': true,
        'request-timeout': 15_000,
      },
    } as unknown as RequestParams);

    await resolveAfter(2_000);

    const { data: csv } = await api.devices.getMonitoringData(device.serialNumber, { format: 'text' });
    await api.devices.stopMonitoring(device.serialNumber);

    const torqueValues = parseMonitoringColumn(csv as unknown as string, '6077');
    expect(torqueValues.length).toBeGreaterThanOrEqual(5);

    const last10 = torqueValues.slice(-10);
    const torquePermil = last10.reduce((s, v) => s + v, 0) / last10.length;
    const frictionTorqueMNm = (torquePermil / 1000) * (ratedTorqueMNm as number);
    const omegaRadS = (speedMrpm / 1000) * ((2 * Math.PI) / 60);
    const frictionCoeffNmSRad = frictionTorqueMNm / 1000 / omegaRadS;

    results.push({ speedMrpm, frictionTorqueMNm, frictionCoeffNmSRad });
    console.log(
      `${speedMrpm} mRPM → τ_friction: ${frictionTorqueMNm.toFixed(1)} mNm, B: ${frictionCoeffNmSRad.toFixed(4)} Nm·s/rad`,
    );

    await api.devices.quickStop(device.serialNumber);
    await resolveAfter(1_500);
  }

  const avgB = results.reduce((s, r) => s + r.frictionCoeffNmSRad, 0) / results.length;

  console.log('\nSpeed [mRPM] | τ_friction [mNm] | B [Nm·s/rad]');
  console.log('-------------|------------------|-------------');
  for (const { speedMrpm, frictionTorqueMNm, frictionCoeffNmSRad } of results) {
    const omega = (speedMrpm / 1000) * ((2 * Math.PI) / 60);
    console.log(
      `${String(speedMrpm).padStart(11)} | ${frictionTorqueMNm.toFixed(1).padStart(16)} | ${frictionCoeffNmSRad.toFixed(4).padStart(12)}  (ω = ${omega.toFixed(4)} rad/s)`,
    );
  }
  console.log(`\nMean viscous friction coefficient B = ${avgB.toFixed(4)} Nm·s/rad`);

  for (const { frictionTorqueMNm, frictionCoeffNmSRad } of results) {
    expect(Number.isFinite(frictionTorqueMNm)).toBe(true);
    expect(Number.isFinite(frictionCoeffNmSRad)).toBe(true);
  }
}, 120_000);
