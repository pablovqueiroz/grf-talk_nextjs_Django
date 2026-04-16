import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: [
    {
      command: "..\\grftalk-backend\\venv\\Scripts\\python.exe manage.py runserver 127.0.0.1:8000",
      cwd: "..\\grftalk-backend",
      url: "http://127.0.0.1:8000/admin/login/",
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: "npm run start",
      cwd: ".",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
