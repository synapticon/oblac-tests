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
