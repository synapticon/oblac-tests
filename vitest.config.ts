import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // Hardware tests need long timeouts (PSU power-cycle + EtherCAT enumeration + procedures)
    testTimeout: 300_000,
    hookTimeout: 300_000,
    teardownTimeout: 60_000,
    globalSetup: './src/global-setup.ts',
    include: [
      'tests/system.test.ts',
      'tests/circulo-files.test.ts',
      'tests/circulo-config.test.ts',
      'tests/circulo-parameters.test.ts',
      'tests/circulo-offset-detection.test.ts',
      'tests/circulo-system-identification.test.ts',
      'tests/circulo-auto-tuning.test.ts',
      'tests/circulo-encoder.test.ts',
      'tests/circulo-profiles.test.ts',
      'tests/circulo-smm.test.ts',
      // 'tests/integro-offset-detection.test.ts',
    ],
    // Local: 'verbose' for per-test feedback (the streamed [srv]/[api] logs
    // do redraw the test tree, but we accept that noise locally for the detail).
    // CI: 'basic' (no live redraws — clean linear log) plus 'github-actions' for
    // inline failure annotations on the run summary.
    reporters: process.env.GITHUB_ACTIONS ? ['basic', 'github-actions'] : ['verbose'],
    // Run tests sequentially — multiple devices attached but tests target specific ones
    pool: 'forks',
    poolOptions: {
      forks: { singleFork: true },
    },
    env: {
      PSU_URL: process.env.PSU_URL ?? 'http://192.168.212.103',
      MM_API_URL: `http://localhost:${process.env.MM_API_PORT ?? '63526'}/api`,
    },
  },
});
