import { Api } from './mm-api.js';

export const api = new Api({ baseUrl: process.env.MM_API_URL ?? 'http://localhost:63526/api' });
export { psu } from './psu.js';
