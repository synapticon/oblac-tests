import { test, expect } from '../src/fixtures.js'

test('client library version', async ({ api }) => {
  const { version } = await api.getVersion()
  console.log('motion-master-client version:', version)
  expect(version).toMatch(/^\d+\.\d+\.\d+/)
})

test('system version', async ({ api }) => {
  const systemVersion = await api.getSystemVersion()
  console.log('system version:', JSON.stringify(systemVersion, null, 2))
  expect(systemVersion.version).toBeTruthy()
})
