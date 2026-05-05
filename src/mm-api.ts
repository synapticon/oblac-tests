// Typed HTTP client for Motion Master REST API
// API reference: https://synapticon.github.io/oblac/motion-master-api/
// To regenerate types: npm run generate:types

import type { operations, components } from './mm-api-types.js'

export type ClientVersion = operations['getVersion']['responses']['200']['content']['application/json']
export type SystemVersion = components['schemas']['SystemVersion']

export class MotionMasterApi {
  readonly baseUrl: string

  constructor(baseUrl = process.env.MM_API_URL ?? 'http://localhost:63526/api') {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`GET ${path} → ${res.status}: ${body}`)
    }
    return res.json() as Promise<T>
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`POST ${path} → ${res.status}: ${text}`)
    }
    return res.json() as Promise<T>
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`PUT ${path} → ${res.status}: ${text}`)
    }
    return res.json() as Promise<T>
  }

  async connect(): Promise<void> {
    const res = await fetch(`${this.baseUrl}/connect`, {
      headers: { Accept: 'application/json' },
    })
    // 409 means already connected — that's fine
    if (!res.ok && res.status !== 409) {
      const body = await res.text()
      throw new Error(`GET /connect → ${res.status}: ${body}`)
    }
  }

  getVersion(): Promise<ClientVersion> {
    return this.get<ClientVersion>('/version')
  }

  getSystemVersion(): Promise<SystemVersion> {
    return this.get<SystemVersion>('/system-version')
  }

  async waitReady(timeoutMs = 60_000, intervalMs = 1_000): Promise<void> {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      try {
        await fetch(`${this.baseUrl}/version`)
        return
      } catch {
        await new Promise(r => setTimeout(r, intervalMs))
      }
    }
    throw new Error(`Motion Master API not ready after ${timeoutMs}ms`)
  }
}
