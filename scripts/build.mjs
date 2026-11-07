import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const srcFile = resolve(
  root,
  "src/Home-Assistant-Mail-And-Packages-Custom-Card.js",
);
const distFile = resolve(
  root,
  "dist/Home-Assistant-Mail-And-Packages-Custom-Card.js",
);

mkdirSync(dirname(distFile), { recursive: true });
cpSync(srcFile, distFile);

console.log(`Copied ${srcFile} -> ${distFile}`);
