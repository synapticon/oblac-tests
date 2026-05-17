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
function extractMonitoringColumn(csv: string | null | undefined, colHint: string): number[] {
  if (!csv) {
    return [];
  }
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

  // 0x6076: Motor rated torque — unit is mNm (CiA 402)
  const { data: ratedTorqueData } = await api.devices.getDeviceParameterValues(device.serialNumber, [
    { index: 0x6076, subindex: 0 },
  ]);
  const [ratedTorqueParam] = ratedTorqueData.parameterValues ?? [];
  const ratedTorqueMNm = ratedTorqueParam?.uintValue;
  expect(ratedTorqueMNm).toBeTypeOf('number');
  console.log(`rated torque: ${ratedTorqueMNm} mNm (${((ratedTorqueMNm as number) / 1000).toFixed(3)} Nm)`);

  const results: { speedMrpm: number; torquePermil: number; frictionTorqueMNm: number; frictionCoeffNmSRad: number }[] =
    [];

  for (const speedMrpm of SPEED_STEPS_MRPM) {
    // Fresh monitoring session — clears any previous data for this device
    const { ok: monitoringStarted } = await api.devices.startMonitoring(device.serialNumber);
    expect(monitoringStarted).toBe(true);

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

    const { data: csv } = await api.devices.getMonitoringData(device.serialNumber, { format: 'text' });
    await api.devices.stopMonitoring(device.serialNumber);

    // 0x6077: Torque actual value — signed permil (‰) of rated torque (CiA 402)
    const torqueValues = extractMonitoringColumn(csv as unknown as string | null, '6077');
    expect(torqueValues.length).toBeGreaterThanOrEqual(10);

    // Average the last 10 samples to smooth out noise
    const last10 = torqueValues.slice(-10);
    const torquePermil = Math.round(last10.reduce((sum, v) => sum + v, 0) / last10.length);

    // Friction torque: τ = (permil / 1000) × rated_torque
    const frictionTorqueMNm = (torquePermil / 1000) * (ratedTorqueMNm as number);
    // Angular velocity: ω [rad/s] = speed [mRPM] / 1000 [RPM] × 2π / 60
    const omegaRadS = (speedMrpm / 1000) * ((2 * Math.PI) / 60);
    // Viscous friction coefficient: B [Nm·s/rad] = τ [Nm] / ω [rad/s]
    const frictionCoeffNmSRad = frictionTorqueMNm / 1000 / omegaRadS;

    results.push({ speedMrpm, torquePermil, frictionTorqueMNm, frictionCoeffNmSRad });
    console.log(
      `${speedMrpm} mRPM → friction torque: ${frictionTorqueMNm.toFixed(1)} mNm, B = ${frictionCoeffNmSRad.toFixed(4)} Nm·s/rad [avg of last 10 / ${torqueValues.length} samples]`,
    );

    await api.devices.quickStop(device.serialNumber);
    // Allow the drive to complete quick stop and settle into SWITCH_ON_DISABLED
    await resolveAfter(1_500);
  }

  expect(results).toHaveLength(SPEED_STEPS_MRPM.length);
  for (const { frictionTorqueMNm, frictionCoeffNmSRad } of results) {
    expect(Number.isFinite(frictionTorqueMNm)).toBe(true);
    expect(Number.isFinite(frictionCoeffNmSRad)).toBe(true);
  }

  const avgB =
    results.reduce((sum, { frictionCoeffNmSRad }) => sum + frictionCoeffNmSRad, 0) / results.length;

  console.log('\nFriction summary:');
  console.log('Speed [mRPM] | ω [rad/s] | τ_friction [mNm] | B [Nm·s/rad]');
  console.log('-------------|-----------|------------------|-------------');
  for (const { speedMrpm, frictionTorqueMNm, frictionCoeffNmSRad } of results) {
    const omega = (speedMrpm / 1000) * ((2 * Math.PI) / 60);
    console.log(
      `${String(speedMrpm).padStart(11)} | ${omega.toFixed(4).padStart(9)} | ${frictionTorqueMNm.toFixed(1).padStart(16)} | ${frictionCoeffNmSRad.toFixed(4).padStart(12)}`,
    );
  }
  console.log(`\nMean viscous friction coefficient B = ${avgB.toFixed(4)} Nm·s/rad`);
}, 120_000);
