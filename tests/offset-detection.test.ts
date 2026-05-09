import { expect, test } from 'vitest';
import { api } from '../src/setup.js';
import { integroTestDevice } from '../src/test-devices.js';

test('run-offset-detection', async () => {
  await api.devices.resetFault(integroTestDevice.serialNumber, { force: true });

  const { data: steps } = await api.devices.runOffsetDetection(
    integroTestDevice.serialNumber,
    undefined,
    // request-timeout is a server-side timeout the gateway honours but the generated
    // type doesn't expose for this endpoint. 240 s — bump if procedures get longer.
    { query: { 'request-timeout': 240_000 } } as any,
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
