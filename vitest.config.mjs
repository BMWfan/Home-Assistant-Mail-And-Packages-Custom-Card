import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["tests/contract/setup.js"],
    include: ["tests/contract/**/*.test.js"],
    reporters: ["default"],
  },
});
