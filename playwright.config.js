// @ts-check
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/smoke",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npx http-server . -p 4173 -s --silent",
    url: "http://127.0.0.1:4173/tests/smoke/harness.html",
    reuseExistingServer: true,
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
