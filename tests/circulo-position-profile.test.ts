import { resolveAfter } from 'motion-master-client';
import { describe, expect, test } from 'vitest';
import type { RequestParams } from '../src/mm-api.js';
import { api } from '../src/setup.js';
import { circuloTestDevice } from '../src/test-devices.js';

const device = circuloTestDevice;

// A quarter of the Circulo's 2^19 counts/rev encoder.
const QUARTER_ROTATION = 131_072;

// Number of forward+back cycles to run per test; override with POSITION_PROFILE_CYCLES.
const CYCLES = Number(process.env.POSITION_PROFILE_CYCLES) || 2;

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

async function expectState(expected: string) {
  const {
    data: { state },
  } = await api.devices.getCia402State(device.serialNumber);
  expect(state).toBe(expected);
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

      for (let i = 0; i < CYCLES; i++) {
        await runQuarterRotation(QUARTER_ROTATION, true);
        await expectState('OPERATION_ENABLED');

        await runQuarterRotation(-QUARTER_ROTATION, true);
        await expectState('OPERATION_ENABLED');
      }
    },
    CYCLES * 60_000,
  );

  test(
    'skip-quick-stop=false: drive quick-stops after each move',
    async () => {
      for (let i = 0; i < CYCLES; i++) {
        await api.devices.resetFault(device.serialNumber, { force: true });
        await runQuarterRotation(QUARTER_ROTATION, false);
        // At the moment the call returns the drive may still be in QUICK_STOP_ACTIVE;
        // give it a moment to settle into SWITCH_ON_DISABLED.
        await resolveAfter(1_000);
        await expectState('SWITCH_ON_DISABLED');

        await api.devices.resetFault(device.serialNumber, { force: true });
        await runQuarterRotation(-QUARTER_ROTATION, false);
        await resolveAfter(1_000);
        await expectState('SWITCH_ON_DISABLED');
      }
    },
    CYCLES * 60_000,
  );
});
