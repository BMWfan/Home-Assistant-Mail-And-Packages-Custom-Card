# Plan

1. Inspect open prerequisite PRs, branch pins and development stack. Avoid the
   companion's checked-in production-mirroring configuration entirely.
2. Add a fresh config generator, pinned HA Compose service, test-only coordinator
   input boundary and real Lovelace Playwright runner. Record actual HA/frontend
   versions and source/image provenance, never test auth storage.
3. Add hosted CI with read-only permissions, unconditional cleanup and bounded
   artifact retention. Run companion pytest separately in the same HA image.
4. Close PR #21 tooling gaps without changing the runtime bundle. Cross-check
   fixtures against pinned producer code and use actual Lit in the mock harness.
5. Execute available checks, record failures and limits; open a stacked Draft PR.

## Risks and mitigation

The official HA image is large, especially with Docker vfs; distinguish a
storage failure from a test failure. CI on a clean hosted runner is the fallback.
The coordinator seam excludes external IO and parser coverage; document this
boundary and run the companion suite. The test bootstrap uses version-specific
HA internals; pin Core and fail loudly if setup or readiness fails. Enabling
Amazon entities triggers a real integration reload, avoiding mock-only IDs.
Auth tokens remain under ignored runtime; upload only explicit test artifacts.
No release workflow or runtime source changes are needed.
