import { readFileSync } from "node:fs";
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

const src = readFileSync(srcFile, "utf8");
const dist = readFileSync(distFile, "utf8");

if (src !== dist) {
  console.error("Bundle mismatch: src and dist files differ.");
  process.exit(1);
}

console.log("Bundle consistency OK: src and dist match byte-for-byte.");
