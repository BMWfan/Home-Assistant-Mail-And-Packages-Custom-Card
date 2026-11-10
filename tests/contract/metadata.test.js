import { afterEach, expect, it } from "vitest";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const roots = [];
afterEach(() =>
  roots
    .splice(0)
    .forEach((root) => rmSync(root, { recursive: true, force: true })),
);

function verify({
  main = "dist/Home-Assistant-Mail-And-Packages-Custom-Card.js",
  bundle = true,
} = {}) {
  const root = mkdtempSync(resolve(tmpdir(), "card-metadata-"));
  roots.push(root);
  mkdirSync(resolve(root, "scripts"));
  mkdirSync(resolve(root, "dist"));
  copyFileSync(
    "scripts/verify-metadata.mjs",
    resolve(root, "scripts/verify-metadata.mjs"),
  );
  writeFileSync(resolve(root, "package.json"), JSON.stringify({ main }));
  writeFileSync(
    resolve(root, "hacs.json"),
    JSON.stringify({
      filename: "Home-Assistant-Mail-And-Packages-Custom-Card.js",
    }),
  );
  if (bundle)
    writeFileSync(
      resolve(root, "dist/Home-Assistant-Mail-And-Packages-Custom-Card.js"),
      "// fixture",
    );
  return spawnSync(
    process.execPath,
    [resolve(root, "scripts/verify-metadata.mjs")],
    { encoding: "utf8" },
  );
}

it("accepts the complete distribution entry point when its file exists", () => {
  expect(verify().status).toBe(0);
});
it("rejects a matching basename in the wrong directory", () => {
  expect(
    verify({ main: "missing/Home-Assistant-Mail-And-Packages-Custom-Card.js" })
      .status,
  ).toBe(1);
});
it("rejects an absent distribution file", () => {
  const result = verify({ bundle: false });
  expect(result.status).toBe(1);
  expect(result.stderr).toContain("does not exist as a file");
});
