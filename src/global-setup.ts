import { execSync, spawnSync } from 'child_process';
import { Api } from './mm-api.js';

const port = process.env.MM_API_PORT ?? '63526';
const apiBase = `http://localhost:${port}/api`;
const api = new Api({ baseUrl: apiBase });

async function waitForApi(timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${apiBase}/version`);
      if (res.ok) { return; }
    } catch {}
    await new Promise(r => setTimeout(r, 1_000));
  }
  throw new Error(`Motion Master API not ready after ${timeoutMs}ms`);
}

async function connectToMotionMaster(timeoutMs = 120_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  console.log('Connecting to Motion Master...');
  while (Date.now() < deadline) {
    try {
      const res = await api.connect.connect();
      console.log('Connected to Motion Master', res);
      return;
    } catch (e: any) {
      if (e?.status === 409) { return; }
      console.log(`  waiting (${e?.error?.message ?? e})`);
    }
    await new Promise(r => setTimeout(r, 2_000));
  }
  throw new Error(`Could not connect to Motion Master after ${timeoutMs}ms`);
}

export async function setup() {
  try {
    execSync('docker compose up -d', { stdio: 'inherit' });
  } catch {
    // Stray containers with conflicting names — remove and retry
    spawnSync('docker', ['rm', '-f', 'motion-master', 'motion-master-api'], { stdio: 'inherit' });
    execSync('docker compose up -d', { stdio: 'inherit' });
  }
  await waitForApi();
  await connectToMotionMaster();
}

export function teardown() {
  if (process.env.CI) {
    execSync('docker compose down', { stdio: 'inherit' });
  }
}
