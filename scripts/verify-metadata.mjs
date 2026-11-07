import { readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const hacsJson = JSON.parse(readFileSync(resolve(root, "hacs.json"), "utf8"));

const expectedFile = "Home-Assistant-Mail-And-Packages-Custom-Card.js";
const mainName = basename(packageJson.main || "");

if (hacsJson.filename !== expectedFile) {
  console.error(`hacs.json filename must be ${expectedFile}, got ${hacsJson.filename}`);
  process.exit(1);
}

if (mainName !== expectedFile) {
  console.error(`package.json main must end with ${expectedFile}, got ${packageJson.main}`);
  process.exit(1);
}

console.log("Metadata contract OK: package main and HACS filename are aligned.");
