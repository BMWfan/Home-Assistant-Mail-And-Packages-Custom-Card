# Verification

## Evidence so far (audit only)
| Check | Command / source | Result |
|---|---|---|
| dist size/lines | `wc -l -c dist/*.js` | 2402 lines, 226355 bytes |
| Source layout | `ls` | no `src/`, no lockfile, no tests, no AGENTS.md |
| Workflows | `ls .github/workflows` | only release-on-master.yml |
| Local Node | `node -v` | v24.22.1 (target pin to be set in T3) |

## Tests
None added in this stage. **No lint, unit, contract, Playwright or paired-HA test has been run or is claimed to pass.**

## Compatibility matrix (planned, unverified)
| HA Core/frontend | Card | Status |
|---|---|---|
| Stable current | 1.0.1 | not tested |
| Stable previous | 1.0.1 | not tested |
| HACS `homeassistant: 0.100` | metadata only | unchanged, unverified in practice |

## Limitations
HA frontend breaking-change review not yet performed (needs release notes access). Integration (Mail and Packages) entity/attribute fixtures not yet derived.
