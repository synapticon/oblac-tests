import { afterAll, beforeAll, expect, test } from 'vitest';
import { api, psu } from '../src/setup.js';
import { integroTestDevice } from '../src/test-devices.js';

beforeAll(() => psu.on());
afterAll(() => psu.off());

test('run-offset-detection', async () => {
  const { data: steps } = await api.devices.runOffsetDetection(integroTestDevice.serialNumber);

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
