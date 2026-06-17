import { describe, expect, test } from 'vitest';
import type { RequestParams } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

// A quarter of the Circulo's 2^19 counts/rev encoder.
const QUARTER_ROTATION = 131_072;

// Number of forward+back cycles to run per test; override with POSITION_PROFILE_CYCLES.
const CYCLES = Number(process.env.POSITION_PROFILE_CYCLES) || 2;

// Position is considered "reached" when the final delta is within this many counts of
// the commanded target (matches the profile `window` with a little slack).
const DELTA_TOLERANCE = 50;

interface MoveStat {
  label: string;
  target: number;
  posBefore: number;
  posAfter: number;
  delta: number;
  error: number;
}

function runQuarterRotation(target: number, skipQuickStop: boolean) {
  return api.devices.runPositionProfile(device.serialNumber, undefined, {
    query: {
      target,
      velocity: 5_000,
      acceleration: 10_000,
      deceleration: 10_000,
      relative: true,
      'skip-quick-stop': skipQuickStop,
      'target-reach-timeout': 30_000,
      'holding-duration': 1_000,
      window: 10,
      'window-time': 1,
      'request-timeout': 60_000,
    },
  } as unknown as RequestParams);
}

async function readPos(): Promise<number> {
  const { data } = await api.devices.uploadParameter(device.serialNumber, '0x6064', '0x00');
  return data.value as number;
}

async function expectState(expected: string) {
  const {
    data: { state },
  } = await api.devices.getCia402State(device.serialNumber);
  expect(state).toBe(expected);
}

// Block until the drive sets statusword (0x6041) bit 10 (target reached) so the after-position
// is read once the move has actually settled rather than mid-ramp. Uses the server-side
// when-target-reached endpoint rather than polling the parameter from the test.
async function waitForTargetReached(): Promise<void> {
  const { ok, data } = await api.devices.whenTargetReached(device.serialNumber, {
    'monitoring-interval': 500,
    'request-timeout': 30_000,
  });
  expect(ok).toBe(true);
  expect(data.targetReached).toBe(true);
}

// Block until the drive reaches the given CiA 402 state, server-side. Resolving without error is
// itself the assertion (the endpoint errors if the state is not reached within request-timeout).
async function waitForCia402State(state: string): Promise<void> {
  const { ok } = await api.devices.whenCia402StateReached(device.serialNumber, state, {
    'monitoring-interval': 200,
    'request-timeout': 10_000,
  });
  expect(ok).toBe(true);
}

function recordMove(stats: MoveStat[], label: string, target: number, posBefore: number, posAfter: number): MoveStat {
  const delta = posAfter - posBefore;
  const stat: MoveStat = { label, target, posBefore, posAfter, delta, error: delta - target };
  stats.push(stat);
  console.log(`  ${label}: target=${target} before=${posBefore} after=${posAfter} delta=${delta} error=${stat.error}`);
  return stat;
}

function logSummary(title: string, stats: MoveStat[]) {
  console.log(`\n=== ${title} ===`);
  for (const [i, s] of stats.entries()) {
    const reached = Math.abs(s.error) <= DELTA_TOLERANCE ? 'YES' : 'NO';
    console.log(
      `  move ${i + 1}: ${s.label} target=${s.target} before=${s.posBefore} after=${s.posAfter} ` +
        `delta=${s.delta} error=${s.error} reached=${reached}`,
    );
  }
}

// Move the motor a quarter rotation forward and back, CYCLES times. The two tests differ
// only in skip-quick-stop, which is the behaviour under test:
//
// - skip-quick-stop=true: MM returns as soon as motion starts, so the drive stays in
//   OPERATION_ENABLED between moves and we sleep to let each quarter-rotation complete
//   before reversing. No quick-stop follows a move.
// - skip-quick-stop=false: the call blocks until target-reach + holding, then MM runs
//   the trailing quick-stop sequence and the drive settles into SWITCH_ON_DISABLED.
//   Each subsequent move therefore needs a fresh resetFault.
describe('position profile quarter-rotation cycles', () => {
  test(
    'skip-quick-stop=true: drive stays enabled across cycles',
    async () => {
      await api.devices.resetFault(device.serialNumber, { force: true });

      const stats: MoveStat[] = [];
      for (let i = 0; i < CYCLES; i++) {
        let posBefore = await readPos();
        await runQuarterRotation(QUARTER_ROTATION, true);
        await expectState('OPERATION_ENABLED');
        // skip-quick-stop=true returns at motion start; wait for the move to settle.
        await waitForTargetReached();
        recordMove(stats, `cycle ${i + 1} +`, QUARTER_ROTATION, posBefore, await readPos());

        posBefore = await readPos();
        await runQuarterRotation(-QUARTER_ROTATION, true);
        await expectState('OPERATION_ENABLED');
        await waitForTargetReached();
        recordMove(stats, `cycle ${i + 1} -`, -QUARTER_ROTATION, posBefore, await readPos());
      }
      logSummary('skip-quick-stop=true', stats);
    },
    CYCLES * 60_000,
  );

  test(
    'skip-quick-stop=false: drive quick-stops after each move',
    async () => {
      const stats: MoveStat[] = [];
      for (let i = 0; i < CYCLES; i++) {
        await api.devices.resetFault(device.serialNumber, { force: true });
        let posBefore = await readPos();
        await runQuarterRotation(QUARTER_ROTATION, false);
        // At the moment the call returns the drive may still be in QUICK_STOP_ACTIVE;
        // block until it settles into SWITCH_ON_DISABLED.
        await waitForCia402State('SWITCH_ON_DISABLED');
        recordMove(stats, `cycle ${i + 1} +`, QUARTER_ROTATION, posBefore, await readPos());

        await api.devices.resetFault(device.serialNumber, { force: true });
        posBefore = await readPos();
        await runQuarterRotation(-QUARTER_ROTATION, false);
        await waitForCia402State('SWITCH_ON_DISABLED');
        recordMove(stats, `cycle ${i + 1} -`, -QUARTER_ROTATION, posBefore, await readPos());
      }
      logSummary('skip-quick-stop=false', stats);
    },
    CYCLES * 60_000,
  );
});
