import { execSync, spawnSync } from 'child_process';

const port = process.env.MM_API_PORT ?? '63526';
const apiBase = `http://localhost:${port}/api`;

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
      const res = await fetch(`${apiBase}/connect`);
      if (res.ok || res.status === 409) {
        console.log('Connected to Motion Master');
        return;
      }
      const body = await res.text();
      console.log(`  waiting (${res.status}: ${body})`);
    } catch (e) {
      console.log(`  waiting (${e})`);
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
