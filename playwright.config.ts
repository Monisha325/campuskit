import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "html" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:5173",
    trace: "on-first-retry"
  },
  webServer: [
    {
      command: "corepack pnpm --filter @campuskit/server dev:e2e",
      port: 3001,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: "corepack pnpm --filter @campuskit/web dev",
      port: 5173,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    }
  ],
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
