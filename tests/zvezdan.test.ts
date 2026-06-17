import { expect, test } from 'vitest';
import type { RequestParams } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;
const DIST = 131_072;

async function readPos(): Promise<number> {
  const { data } = await api.devices.uploadParameter(device.serialNumber, '0x6064', '0x00');
  return data.value as number;
}

async function waitForSwitchOnDisabled(timeoutMs = 10_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const { data } = await api.devices.uploadParameter(device.serialNumber, '0x6041', '0x00');
    if (((data.value as number) & 0x6f) === 0x40) return;
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('Timed out waiting for SWITCH_ON_DISABLED after quick stop');
}

test(`${device.name}: position profile four alternating moves`, async () => {
  await api.devices.resetFault(device.serialNumber, { force: true });
  await new Promise((r) => setTimeout(r, 10_000));

  console.log('pos after resetFault:', await readPos());

  const results: { target: number; posBefore: number; posAfter: number; delta: number; ok: boolean }[] = [];

  for (const target of [DIST, -DIST, DIST, -DIST]) {
    await api.devices.resetFault(device.serialNumber, { force: true });
    const posBefore = await readPos();
    console.log(`--- move ${target > 0 ? '+' : ''}${target} ---`);
    console.log(`  pos before:     ${posBefore}`);

    let ok = false;
    try {
      ({ ok } = await api.devices.runPositionProfile(device.serialNumber, undefined, {
        query: {
          target,
          velocity: 5_000,
          acceleration: 10_000,
          deceleration: 10_000,
          relative: true,
          'skip-quick-stop': false,
          'target-reach-timeout': 30_000,
          window: 10,
          'window-time': 1,
          'request-timeout': 60_000,
        },
      } as unknown as RequestParams));
    } catch (e) {
      console.log(`  error: ${e}`);
    }

    // Wait for the quick-stop deceleration ramp to finish before reading final position.
    // The HTTP API returns ok:true at target-reach; the drive is still in QUICK_STOP_ACTIVE
    // and coasting. Polling statusword until SWITCH_ON_DISABLED ensures posAfter is settled.
    await waitForSwitchOnDisabled();

    const posAfter = await readPos();
    const delta = posAfter - posBefore;
    results.push({ target, posBefore, posAfter, delta, ok });
    console.log(`  pos after:      ${posAfter}`);
    console.log(`  delta:          ${delta}  (expected ${target})`);
    console.log(`  profile ok:     ${ok ? 'YES' : 'NO'}`);
  }

  console.log('\n=== run summary ===');
  for (const [i, r] of results.entries()) {
    const moved = Math.abs(r.delta - r.target) <= 4_369;
    console.log(
      `  move ${i + 1}: target=${r.target}  before=${r.posBefore}  after=${r.posAfter}  delta=${r.delta}  moved=${moved ? 'YES' : 'NO'}  ok=${r.ok ? 'YES' : 'NO'}`,
    );
  }

  for (const r of results) {
    expect(r.ok).toBe(true);
  }
}, 300_000);
