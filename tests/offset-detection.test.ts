import { test, expect } from 'vitest';
import { api } from '../src/setup.js';

test('run-offset-detection', async () => {
  const { data: devices } = await api.devices.getDevices();
  if (devices.length === 0) {
    throw new Error('No devices found — cannot run offset detection');
  }

  const device = devices[0];
  const deviceRef = String(device.position);

  const { data: steps } = await api.devices.runOffsetDetection(deviceRef);

  console.log('\nOffset detection results:');
  for (const step of steps) {
    if (step.status === 'succeeded') {
      console.log(`  ✔ ${step.label}: ${step.value}`);
    } else {
      console.log(`  ✘ ${step.label}: ${step.status}${step.error ? ` — ${step.error}` : ''}`);
    }
  }

  const failed = steps.filter(s => s.status === 'failed');
  expect(failed, `failed steps: ${failed.map(s => s.label).join(', ')}`).toHaveLength(0);
}, 300_000);
