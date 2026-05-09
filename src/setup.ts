// Imported by test files to get the two shared handles:
//   api — typed HTTP client for the Motion Master REST API
//   psu — on/off control for the device power supply

import { logFetch } from './log-fetch.js';
import { Api } from './mm-api.js';

export const api = new Api({
  baseUrl: process.env.MM_API_URL ?? 'http://localhost:63526/api',
  customFetch: (input, init) => logFetch('req', input, init),
});
export { psu } from './psu.js';
