// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000, // Increased timeout for tests
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1, // Retry failed tests once
  workers: 1,
  reporter: [
    ['html'],
    ['list']
  ],
  
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000, // Timeout for actions like click, fill
    navigationTimeout: 30000, // Timeout for page navigations
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // webServer: {
  //   command: 'cd SliceMaster-Backend && java -jar target/pizzeria-backend-1.0.0.jar',
  //   url: 'http://localhost:8081/api/v1/pizzas',
  //   reuseExistingServer: true,
  //   timeout: 120000,
  // },
});
