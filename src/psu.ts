// HTTP client for the ESP32 PSU controller (P1535).
// Tests call psu.on() / psu.off() manually to power-cycle the devices under test.

const baseUrl = process.env.PSU_URL ?? 'http://192.168.212.103';

async function request(path: string): Promise<void> {
  const res = await fetch(`${baseUrl}${path}`);
  if (!res.ok) {
    throw new Error(`PSU request ${path} failed: ${res.status} ${res.statusText}`);
  }
}

export const psu = {
  on: () => request('/output-on'),
  off: () => request('/output-off'),
};
