# Release Guards 1.2.1 — CI Infrastructure Hardening

> Sources: GitHub Actions logs 2026-08-20, 2026-08-18; Maintainer incident report
> Raw: [Incident 1.2.1](../../raw/notes/2026-08-20-incident-1.2.1-ci-release-guards.md)
> Updated: 2026-08-20
> Triggers: release guard, cache npm, E403 duplicate publish, anchor leak, vault integrity, version sync

## Overview

On 2026-08-20 and 2026-08-18, release infrastructure failed without any product code defect. Each failure was traced to a workflow or vault configuration, and five guards were added so the same failure cannot recur.

## Failure Modes

- **Lock file (2026-08-20):** Both the Release & Publish and the CI Lint jobs failed at `Setup Node.js` with `Dependencies lock file is not found in /home/runner/work/llm-wiki-loop/llm-wiki-loop. Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock.` The lock is absent because the package has no dependencies.
- **Deprecated runner (2026-08-20):** Annotation warned `Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24.` for `actions/checkout@v4, actions/setup-node@v4`.
- **Duplicate publish (2026-08-18):** Three `v1.1.2` tag pushes (`4d002ce`, `17b6b5a`, `72cce54`) all failed at `Publish to NPM` with `npm error code E403` and `npm error 403 403 Forbidden - PUT https://registry.npmjs.org/llm-wiki-loop - You cannot publish over the previously published versions: 1.1.2.`
- **Vault anchor leak (2026-08-20):** `AGENTS.md` transiently contained `C:/Users/jayeo/AppData/Local/Temp/tmp7kwxoxsf/new-vault/` and `C:/Users/jayeo/AppData/Local/Temp/tmpqtrlq5ef/new-vault/` inside `<!-- [llm-wiki-loop:anchor:start] -->`.

## Guards Added

- **Cache removal:** Removed `cache: npm` from `actions/setup-node` (no `package-lock.json` to cache). Upgraded `actions/checkout@v4` to `v5` and `actions/setup-node@v4` to `v5`.
- **Vault Integrity Guard:** CI step runs `grep -q AppData/Local/Temp AGENTS.md` and fails if an ephemeral `tmp*new-vault` anchor leaked. Prevents the leak seen with `tmp7kwxoxsf/new-vault`.
- **Version Single Source:** `scripts/sync-version.js` syncs `package.json` version `1.2.1` to `docs/index.html` badge `v1.2.1` and `docs/sitemap.xml` `2026-08-20`. CI enforces `Version Sync Check` via `npm run sync:version` and `git diff --exit-code docs/` and `Pack Dry Run` for `__pycache__` leak.
- **Publish idempotency:** `release.yml` now checks `npm view llm-wiki-loop@$PKG version` before `npm publish --access public --provenance`; if the version already exists the step notices and skips.
- **Anchor descendant guard:** `bin/cli.js` `linkRootConstitution` now only links when the vault is inside the project root, preventing external temp vaults from contaminating the caller repo.
- **Pack hygiene:** `.npmignore` plus `cleanPycache` in `scripts/sync-version.js` removes `__pycache__` so `npm pack --dry-run` shows `total files: 15` with `package size 34.8 kB` and `unpacked size 107.6 kB` without leaks.
- **Strict verification:** Added `--strict` (`error+drift`) and `--strict-all` to `check_evidence.py` and `bin/cli.js`, `extend CI matrix to Node 22.x and Python 3.10`, and `per-file sha256` support `Monitored: src/a.ts:sha256:<hex>`.

## Verification

After the fixes, verification showed `0 fidelity suspect(s), 0 evidence error(s), 0 unreferenced raw file(s), 0 drifted article(s)` with strict checks, `25 tests` passing, and `npm pack --dry-run` with `total files: 15`.

## See Also

- [Cross-Platform CLI and CI/CD Architecture](../topics/cross-platform-cli-and-cicd.md)
- [Self-Improving Loop Guide](../topics/self-improving-loop-guide.md)
