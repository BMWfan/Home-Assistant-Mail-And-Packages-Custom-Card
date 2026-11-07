# SPEC-002: Reproducible builds, PR CI and compatibility tests (L)

Status: **Draft - audit/feasibility gate only. Awaiting owner approval before any implementation.**
Refs: #17 (parent), #18/#19 (SDD-Light), #20 (this issue).

## Audit findings (evidence from repo at 5215dff)
- Single committed artifact: `dist/Home-Assistant-Mail-And-Packages-Custom-Card.js` (2402 lines, ~226 KB).
- It is **unminified, hand-readable, commented ES module-less script** (header comment, `CARD_VERSION`, inline carrier logos, translations). No sourcemap, no bundler banner, no webpack/rollup markers. It appears to be hand-authored directly in `dist/`.
- No `src/`, no lockfile, no dependencies, no build/lint/test scripts in `package.json` (only metadata; version 1.0.1 drives release).
- `hacs.json`: `filename` = `Home-Assistant-Mail-And-Packages-Custom-Card.js`, `homeassistant` = `0.100`, `render_readme: true`. This contract must not change.
- Only workflow: `release-on-master.yml` (contents: write; tags `v<package.json version>`). No PR CI exists.
- Git history is shallow (2 commits visible); no earlier sources recoverable.
- `AGENTS.md` does not exist yet (PR #19 not landed); spec follows the SDD-Light convention from repo memory (L = spec + plan + tasks + verification).

## Feasibility gate conclusion
Authoritative original sources do **not** exist separately; `dist/` file *is* the source of truth. Introducing `src/` + bundler would require moving/splitting that file and risks changing runtime bytes. That is a disruptive migration and needs **owner decision** (see plan.md, options A/B).

## Goals (unchanged from issue)
Locked deterministic tooling, Node version, lint/format, unit tests, PR CI (least privilege), fixture contract tests, Playwright smoke with mocked HA, paired-HA test instructions, HA breaking-change review, honest coverage record.

## Non-goals
No change to card runtime, filename, HACS contract, release workflow, secrets, branch protection, merge.

## Requirements
- R1 `dist/*.js` bytes unchanged unless owner approves migration.
- R2 PR workflow: `permissions: contents: read`, no secrets, no `pull_request_target`.
- R3 Test results only claimed with evidence in verification.md.
