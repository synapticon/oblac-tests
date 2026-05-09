// Vitest global setup — runs once before the entire test suite, then teardown once after.
// Sequence: start Docker services → wait for MM API HTTP → connect MM to EtherCAT bus →
// power on PSU → wait until devices enumerate. Teardown powers off the PSU.

import { type ChildProcess, execSync, spawn, spawnSync } from 'node:child_process';
import { resolveAfter } from 'motion-master-client';
import { logFetch } from './log-fetch.js';
import { Api } from './mm-api.js';
import { psu } from './psu.js';

const port = process.env.MM_API_PORT ?? '63526';
const apiBase = `http://localhost:${port}/api`;
const api = new Api({
  baseUrl: apiBase,
  customFetch: (input, init) => logFetch('req', input, init),
});

// Polls GET /version until Motion Master API is accepting requests.
async function waitForApi(timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await logFetch('req', `${apiBase}/version`);
      if (res.ok) {
        return;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 1_000));
  }
  throw new Error(`Motion Master API not ready after ${timeoutMs}ms`);
}

// Polls GET /devices with a short per-poll request-timeout until Motion Master returns a
// non-empty device list. This is the real readiness gate: a 200 response with devices means
// MM is past EtherCAT enumeration and able to service requests; a 500 "Timeout has occurred"
// means MM is still busy initializing.
async function waitForDevices(timeoutMs = 90_000, pollTimeoutMs = 2_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;
  while (Date.now() < deadline) {
    try {
      const { data } = await api.devices.getDevices({
        'request-timeout': pollTimeoutMs,
      });
      if (data.length > 0) {
        console.log(`Motion Master ready: ${data.length} device(s) enumerated`);
        return;
      }
    } catch (e) {
      lastError = e;
    }
  }
  const suffix =
    lastError && typeof lastError === 'object' && 'error' in lastError
      ? ` (last error: ${JSON.stringify((lastError as { error: unknown }).error)})`
      : '';
  throw new Error(`Motion Master did not enumerate any devices within ${timeoutMs}ms${suffix}`);
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

// Streams a container's stdout/stderr into the test output, prefixed so it interleaves
// cleanly with [api]/[psu] HTTP logs.
const logProcs: ChildProcess[] = [];
function streamContainerLogs(container: string, tag: string) {
  const proc = spawn('docker', ['logs', '-f', '--tail=0', container], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const forward = (chunk: Buffer) => {
    for (const line of chunk.toString().split('\n')) {
      if (line.length > 0) {
        process.stdout.write(`[${tag}] ${line}\n`);
      }
    }
  };
  proc.stdout?.on('data', forward);
  proc.stderr?.on('data', forward);
  proc.unref();
  logProcs.push(proc);
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
  streamContainerLogs('motion-master', 'mm');
  streamContainerLogs('motion-master-api', 'api');
  await waitForApi();
  await connectToMotionMaster();
  await psu.on();
  console.log('Waiting 10 s for Motion Master to enumerate and configure devices...');
  await resolveAfter(10_000);
  await waitForDevices();
}

// Stops and removes containers. Skipped locally so containers stay up between runs.
export async function teardown() {
  try {
    await psu.off();
  } catch (e) {
    console.log(`psu.off() in teardown failed: ${e}`);
  }
  for (const p of logProcs) {
    p.kill('SIGTERM');
  }
  if (process.env.CI) {
    execSync('docker compose down', { stdio: 'inherit' });
  }
}
