import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: { globals: globals.browser },
    // Incremental legacy baseline: retain syntax, undefined name and correctness rules.
    // Unused callback parameters and historical escapes are deferred to a source migration.
    rules: { "no-unused-vars": "off", "no-useless-escape": "off" },
  },
  {
    files: ["scripts/**/*.mjs", "tests/**/*.js", "tests/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      "no-console": "off",
    },
  },
];
