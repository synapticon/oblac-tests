import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    // Hardware tests need longer timeouts
    timeout: 60_000,
    hookTimeout: 120_000,
    teardownTimeout: 30_000,
    globalSetup: './src/global-setup.ts',
    include: [
      'tests/system.test.ts',
      'tests/offset-detection.test.ts',
    ],
    reporters: ['verbose'],
    // Run tests sequentially — only one device attached
    pool: 'forks',
    poolOptions: {
      forks: { singleFork: true },
    },
    env: {
      PSU_URL: process.env.PSU_URL ?? 'http://192.168.212.103',
      MM_API_URL: `http://localhost:${process.env.MM_API_PORT ?? '63526'}/api`,
    },
  },
})
