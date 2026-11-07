import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
const artifacts = fileURLToPath(new URL("./artifacts/", import.meta.url));
export default defineConfig({
  testDir: ".",
  testMatch: "paired.spec.js",
  timeout: 120_000,
  workers: 1,
  retries: 0,
  outputDir: `${artifacts}/results`,
  reporter: [["list"], ["json", { outputFile: `${artifacts}/results.json` }]],
  use: { baseURL: "http://127.0.0.1:18123", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
