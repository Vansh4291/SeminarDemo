const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0, // Explicitly no retries by default, but user said "Do NOT retry more than once" so maybe retries: 1? User said "Do NOT retry more than once" so retries: 0 is safer to just fail and stop. Actually I'll set retries: 0.
  workers: 1, // Run sequentially for reliable timing and stress tests
  reporter: [
    ['html', { outputFolder: 'reports/playwright-report' }],
    ['list']
  ],
  outputDir: 'artifacts/', // Automatically saves traces, videos, screenshots here
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on', // Always record traces
    video: 'on', // Always record video
    screenshot: 'on', // Always capture screenshot
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
