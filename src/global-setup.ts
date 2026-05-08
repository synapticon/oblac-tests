// Vitest global setup — runs once before the entire test suite, then teardown once after.
// Sequence: start Docker services → wait for MM API HTTP → connect MM to EtherCAT bus.

import { execSync, spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { Api } from './mm-api.js';
import { logFetch } from './log-fetch.js';

const port = process.env.MM_API_PORT ?? '63526';
const apiBase = `http://localhost:${port}/api`;
const api = new Api({
  baseUrl: apiBase,
  customFetch: (input, init) => logFetch('api', input, init),
});

// Polls GET /version until Motion Master API is accepting requests.
async function waitForApi(timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await logFetch('api', `${apiBase}/version`);
      if (res.ok) {
        return;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 1_000));
  }
  throw new Error(`Motion Master API not ready after ${timeoutMs}ms`);
}

// Calls POST /connect until the API has established both WebSocket connections to Motion Master
// (request/response and publish/subscribe).
// 409 means already connected — treat as success.
async function connectToMotionMaster(timeoutMs = 120_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  console.log('Connecting to Motion Master...');
  while (Date.now() < deadline) {
    try {
      const res = await api.connect.connect();
      console.log('Connected to Motion Master', res);
      return;
    } catch (e) {
      const err = e as { status?: number; error?: { message?: string } };
      if (err?.status === 409) {
        return;
      }
      console.log(`  waiting (${err?.error?.message ?? e})`);
    }
    await new Promise((r) => setTimeout(r, 2_000));
  }
  throw new Error(`Could not connect to Motion Master after ${timeoutMs}ms`);
}

// Streams the motion-master container's stdout/stderr into the test output,
// prefixed so it interleaves cleanly with [mm]/[psu] HTTP logs.
let logProc: ChildProcess | undefined;
function streamMotionMasterLogs() {
  logProc = spawn('docker', ['logs', '-f', '--tail=0', 'motion-master'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const forward = (tag: string) => (chunk: Buffer) => {
    for (const line of chunk.toString().split('\n')) {
      if (line.length > 0) {
        process.stdout.write(`[${tag}] ${line}\n`);
      }
    }
  };
  logProc.stdout?.on('data', forward('mm'));
  logProc.stderr?.on('data', forward('mm'));
  logProc.unref();
}

// Starts motion-master and motion-master-api containers, then waits until ready.
// If containers with conflicting names are already present, removes them and retries.
export async function setup() {
  try {
    execSync('docker compose up -d', { stdio: 'inherit' });
  } catch {
    spawnSync('docker', ['rm', '-f', 'motion-master', 'motion-master-api'], {
      stdio: 'inherit',
    });
    execSync('docker compose up -d', { stdio: 'inherit' });
  }
  streamMotionMasterLogs();
  await waitForApi();
  await connectToMotionMaster();
}

// Stops and removes containers. Skipped locally so containers stay up between runs.
export function teardown() {
  logProc?.kill('SIGTERM');
  if (process.env.CI) {
    execSync('docker compose down', { stdio: 'inherit' });
  }
}
