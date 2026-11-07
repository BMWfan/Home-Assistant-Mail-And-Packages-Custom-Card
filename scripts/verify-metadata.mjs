import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const packageJson = JSON.parse(
  readFileSync(resolve(root, "package.json"), "utf8"),
);
const hacsJson = JSON.parse(readFileSync(resolve(root, "hacs.json"), "utf8"));

const expectedFile = "Home-Assistant-Mail-And-Packages-Custom-Card.js";
const expectedMain = `dist/${expectedFile}`;

if (hacsJson.filename !== expectedFile) {
  console.error(
    `hacs.json filename must be ${expectedFile}, got ${hacsJson.filename}`,
  );
  process.exit(1);
}

if (packageJson.main !== expectedMain) {
  console.error(
    `package.json main must be ${expectedMain}, got ${packageJson.main}`,
  );
  process.exit(1);
}

console.log(
  "Metadata contract OK: package main and HACS filename are aligned.",
);
