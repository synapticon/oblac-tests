import { test as base } from 'vitest'
import { MotionMasterApi } from './mm-api.js'
import { psu } from './psu.js'

interface Fixtures {
  api: MotionMasterApi
  psu: typeof psu
}

export const test = base.extend<Fixtures>({
  api: async ({}, use) => {
    const api = new MotionMasterApi()
    await api.waitReady()
    await api.connect()
    await use(api)
  },
  psu: async ({}, use) => {
    await use(psu)
    // Safety: turn off PSU after each test that used it
    await psu.off()
  },
})

export { expect } from 'vitest'
