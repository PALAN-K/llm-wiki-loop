# Vault Audit Log

## [2026-08-14] init | Vault initialized (project, llm-wiki-loop)
## [2026-08-14] ingest | LLM Wiki Pattern
- Disposition: New
- Raw: raw/notes/2026-04-04-karpathy-llm-wiki.md; raw/notes/2026-08-14-ecosystem-survey.md
- Updated: (none — seed compile)
## [2026-08-14] ingest | LLM Wiki Ecosystem Landscape
- Disposition: New
- Raw: raw/notes/2026-08-14-ecosystem-survey.md
- Updated: (none — seed compile)
## [2026-08-14] lint | 2 issues found, 2 auto-fixed
- Evidence: 0 suspects / 0 errors / 0 unreferenced
- Fixed: Triggers field added to metadata regex in check_evidence.py (metadata lines were flagged as fidelity suspects)
## [2026-08-14] update | Schema canonicalized to AGENTS.md (CLAUDE.md and GEMINI.md are now one-line pointers)
## [2026-08-16] ingest | Cross-Platform CLI and CI/CD Architecture
- Disposition: New
- Raw: raw/notes/2026-08-16-cli-architecture-and-cicd-matrix.md
- Updated: (none — seed compile)
## [2026-08-17] update | Universal Fingerprint and 0-Token Drift Detection (v1.1.0)
- Spec: SPEC.md Section 4.5 & AGENTS.md rule 2 added
- Engine: check_evidence.py Sweep 4 (Code Freshness / Drift Detection) added
- Tests: 13 unit tests passing across fidelity, evidence, git drift, and SHA-256 hash
## [2026-08-17] update | 1-Click Init, Subdirectory Encapsulation, and NPM v1.1.1 Release
- CLI: Integrated runInstall into runInit; default encapsulation in ./llm-wiki-loop; fallback to .agents/skills
- Tests: Added tests/test_cli_e2e.py; 18 automated tests passing
- Release: llm-wiki-loop@1.1.1 published to npm registry
## [2026-08-18] update | Schema Consistency, .gitkeep Scaffolding, and NPM v1.1.2 Release
- CLI: Added .gitkeep scaffolding during init; explicit system requirements and clean safety descriptions
- SEO: Added docs/robots.txt, docs/sitemap.xml, and Search Console verification slot
- Release: llm-wiki-loop@1.1.2 published via GitHub Actions release.yml
## [2026-08-18] update | High-Impact Hero & NPM v1.1.3 Release
- Docs: Added high-impact quickstart hero box and paradigm shift comparison table in README.md
- Showcase: Synchronized terminal commands and quickstart copy handlers to npx llm-wiki-loop init
- Release: llm-wiki-loop@1.1.3 published via GitHub Actions release.yml
## [2026-08-19] update | Root-Anchored Architecture, Non-Destructive Constitution Linking, and NPM v1.2.0 Release
- CLI: Added linkRootConstitution and unlinkRootConstitution for non-destructive AGENTS.md anchor injection
- Conventions: Standardized Vault Audit Ledger (log.md) definition and root-anchored naming across SPEC.md, SKILL.md, README.md, and docs/
- Tests: Added E2E tests for constitution linking, idempotency, and clean unlinking (20/20 tests passing)
- Release: llm-wiki-loop@1.2.0 published via GitHub Actions release.yml
## [2026-08-20] update | Framework Integrity & Dogfooding Hardening and NPM v1.2.1 Release
- Fix: SHA-256 per-file drift, 2-tier --strict, as_posix normalization, resolvePython >=3.9 gate, engines >=18.0.0, clean guard, Vault Integrity Guard
- Fix: remove cache: npm requiring lock file, upgrade actions/checkout@v5 and setup-node@v5
- Docs: scripts/sync-version.js single source for v1.2.1 and 2026-08-20, showcase prefers-reduced-motion and clipboard fallback
- Tests: 25 tests passing (per-file, case-insensitive, status plain, posix, strict)
- Release: llm-wiki-loop@1.2.1 published via GitHub Actions release.yml
## [2026-08-20] ingest | Release Guards 1.2.1
- Disposition: New
- Raw: raw/notes/2026-08-20-incident-1.2.1-ci-release-guards.md
- Updated: wiki/references/release-guards-1.2.1.md
## [2026-08-21] update | Dual-Tier Commit Template and wiki:lint Guard (v1.3.1)
- Template: .github/commit-template.txt added (wiki checklist: Raw + wiki + index/log + verify)
- Schema: AGENTS.md Verification — nudge (commit-template) + gate (CI check --strict) clarified
- CLI: bin/cli.js configureCommitTemplate() wired into init (idempotent git config, fail-safe)
- Scripts: package.json wiki:lint + lint:all (lint && wiki:lint) for local 1-line verify
- Docs: .gitignore already isolates scratch (*.local.md, raw/notes/internal-*); .npmignore isolates vault for npm users
- Release: llm-wiki-loop@1.3.1 via GitHub Actions release.yml
## [2026-08-21] update | Self-Improving Loop Guard and Fingerprint Demo (v1.3.1 patch, no bump)
- Loop: AGENTS.md Loop nudge (scan:skills 1-line/emphasized) + CONTRIBUTING.md Self-Improving Loop section added
- Scripts: package.json lint:all now chains lint && wiki:lint && scan:skills; scan-skill-candidates.js 1-line when 0, emphasized when ≥2
- Fingerprint: wiki/topics/cross-platform-cli-and-cicd.md — git:f43f292 + Monitored: bin/cli.js, ci.yml, release.yml (0-token demo)
- Trust: sync-version now covers README 3 locales, pages.yml checkout@v5, docs placeholder pro wording, branch master unify
## [2026-08-21] fix | Windows Non-ASCII Path Native Crash Hotfix (v1.3.2)
- Incident: Windows Node v24.11.0 + Korean path 집꾸미다견적솔루션 — fs.cpSync({recursive:true}) STATUS_STACK_BUFFER_OVERRUN -1073740791 at bin/cli.js:78 and scripts/install.js (doctor passed, install crashed; Copy-Item succeeded)
- Fix: Replace fs.cpSync/fs.rmSync recursive with single primary pure-JS loop (fs.lstatSync + Dirent + copyFileSync); correct isSymbolicLink handling (was false via statSync)
- Raw: raw/notes/2026-08-21-incident-windows-non-ascii-crash.md
- Updated: wiki/topics/cross-platform-cli-and-cicd.md — Windows Non-ASCII Path Hardening (v1.3.2) section, 7 files payload verified
- Evidence: 0 suspects / 0 errors / 0 unreferenced after fix; Fingerprint: git:a8d384c -> git:1691497 + Monitored: bin/cli.js, ci.yml, release.yml
- Release: llm-wiki-loop@1.3.2 via GitHub Actions release.yml










