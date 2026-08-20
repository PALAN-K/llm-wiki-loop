# Changelog

All notable changes to **llm-wiki-loop** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.1] - 2026-08-20

### 🛡️ Framework Integrity & Dogfooding Hardening (P0+P1)

#### Fixed (Critical — Framework Product)
- **SHA-256 Per-File Drift (A1)**: `check_evidence.py:452` now supports `Monitored: src/a.ts:sha256:<hex>, src/b.ts:sha256:<hex>` per-file mapping; legacy single-hash single-file mode preserved. Multi-file false drift eliminated.
- **Exit Code Strictness (A/B)**: `check_evidence.py:583` always 0 → 2-tier `--strict` (error+drift → exit 1) and `--strict-all`/`--include-suspects` (also suspect). `bin/cli.js:307` forwards flags; `ci.yml`/`release.yml` now use `--strict` for true CI failure.
- **AGENTS.md Ephemeral Anchor Leak (E1)**: Root vault `AGENTS.md:25` contained `C:/.../Temp/tmp*/new-vault` after `init` with external temp target. Added containment guard in `bin/cli.js:142` (`vault inside projectRoot` check) + `ci.yml:35` Vault Integrity Guard (`grep AppData/Local/Temp`).
- **Metadata Case Sensitivity (A2)**: `METADATA_RE:61`/`STATUS_LINE_RE:64`/`ARCHIVED_RE:73` now `IGNORECASE`; `raw_links_of:285` case-insensitive; `> Status:` plain block correctly skipped, preventing false suspects.

#### Improved (Stability — CLI & Distribution)
- **Engine Consistency (B1/B7)**: `package.json:38` `>=16.17` → `>=18.0.0` to match `bin/cli.js:147` and `CONTRIBUTING.md:10`; `resolvePython:38` now parses `Python 3.x` and gates `>=3.9`; `package.json:34` `test: py -m unittest` → `node scripts/run-tests.js` cross-platform.
- **Path Normalization (H2)**: `referenced_raws:365`/`unreferenced_raws:374`/`check_code_drift:412` all `as_posix()` unified; fixes Windows `\` vs Ubuntu `/` orphan/drift false positives.
- **Clean Safety (B4)**: `bin/cli.js:506` now validates `isVaultDir` before `rmSync`, encapsulated `llm-wiki-loop` deletion requires vault markers; root-mode `AGENTS.md` preserved if user content remains.
- **Install Hygiene (H3)**: `scripts/install.js:56` detects `__dirname inside node_modules` and skips project fallback skill creation; outer `try/catch` guarantees `postinstall` never fails install.
- **Pack Hygiene (H2)**: `.npmignore` `**/__pycache__` + `scripts/sync-version.js:40` `cleanPycache` → `npm pack` no longer leaks `__pycache__/*.pyc` (was 16→15 files, 144kB→106kB).
- **Version Single Source (H4)**: New `scripts/sync-version.js` (40 LOC) syncs `package.json:3` → `docs/index.html:33` badge + `docs/sitemap.xml:5` lastmod; wired to `sync:version`/`prepack`/`pretest` and `ci.yml:42` Version Sync Check.

#### CI/CD
- **ci.yml:10-44**: `cache: npm/pip`, Node matrix `+22.x`, Python matrix `+3.10`, `Version Sync Check`, `Vault Integrity Guard`, `Pack Dry Run __pycache__ guard`, `check --strict` in matrix.
- **release.yml:4-46**: Strict tag glob `v[0-9]+.[0-9]+.[0-9]+`, `id-token: write` + provenance, `tag == package.json version` guard, `sync:version` before checks, `__pycache__` guard, `--strict` before publish, `if: success()` on release.

#### Tests & Docs
- **Tests**: 18 → 25 passing (`tests/test_check_evidence.py:193` added: `test_sha256_per_file`, `test_metadata_case_insensitive`, `test_status_block_plain`, `test_unreferenced_posix`, `test_strict_flags`).
- **Showcase**: `docs/app.js:7` respects `prefers-reduced-motion`, clipboard `catch`+`execCommand` fallback + `aria-label`, auto-rotate `mouseleave` resume + throttle reset to avoid permanent stall.
- **Keeps (deferred P2)**: ① numeric boundary fine-tuning ② full a11y ③ physical vault separation `examples/` — all Keep per review; no change, revisit on user report or landing redesign.

---

## [1.2.0] - 2026-08-19

### 🏛️ Root-Anchored Architecture & Non-Destructive Constitution Linking

#### Added & Improved
- **Non-Destructive Project Constitution Linking**:
  - `llm-wiki-loop init` automatically detects the project root `AGENTS.md` and appends a lightweight 4-line Vault Protocol anchor block without modifying or overwriting existing project rules.
  - Ensures newly initialized AI sessions in embedded subproject vaults immediately recognize `llm-wiki-loop/` and enforce audit logging invariants.
- **Idempotent Linking & Clean Teardown**:
  - Re-running `init` will never duplicate the anchor block.
  - `llm-wiki-loop clean` cleanly and safely unlinks the anchor block from project constitutions while preserving user rules.
- **Canonical Terminology & Disambiguation**:
  - Standardized `log.md` definition as **Vault Audit Ledger** across `SPEC.md`, `SKILL.md`, and documentation, eliminating confusion with topic internal changelogs.
  - Standardized root-anchored naming conventions (`llm-wiki-loop/` prefix) for embedded vaults across all AI runtimes.
- **Comprehensive E2E Test Suite**:
  - Added test cases in `tests/test_cli_e2e.py` covering constitution linking, preservation of pre-existing rules, idempotency, and clean unlinking.

---

## [1.1.3] - 2026-08-18

### ⚡ High-Impact Quickstart & Showcase Alignment

#### Added & Improved
- **High-Impact README Hero Section**:
  - Added 1-second quickstart TL;DR box.
  - Added "Why Ordinary AI Notes Fail vs. llm-wiki-loop" paradigm shift comparison table.
- **Showcase & Terminal Synchronization**:
  - Aligned all interactive terminal simulator and copy commands across the web showcase to `npx llm-wiki-loop init`.

---

## [1.1.2] - 2026-08-18

### 🛡️ Scaffolding Reliability, Schema Consistency & SEO Indexing

#### Added & Improved
- **Automated Directory Skeleton Retention**:
  - `init` now automatically creates `.gitkeep` files in `raw/notes`, `raw/data`, `raw/assets`, `wiki/concepts`, `wiki/topics`, `wiki/references`, and `archive/` ensuring empty folders are tracked across git clones.
- **Unified Schema & Documentation Headers**:
  - Standardized H1 headers to `# Knowledge Vault Index` (in `index.md`, CLI templates, references) and `# Vault Audit Log` (in `log.md`, CLI templates).
- **Search Engine Discovery Assets**:
  - Added `docs/robots.txt` and `docs/sitemap.xml` for crawler indexing.
  - Added Google Search Console verification meta tag slot in `docs/index.html`.
- **Enhanced CLI Usability & Diagnostics**:
  - Explicitly documented system requirements (`Node.js >= 18.0.0`, `Python >= 3.9.0`) in CLI help and doctor.
  - Added safety clarification on the `clean` command lifecycle.

---

## [1.1.1] - 2026-08-17

### 🎯 1-Click Init & Subdirectory Encapsulation

#### 5 Core Features & Improvements
1. **1-Click Multi-Agent Skill Injection**:
   - `npx llm-wiki-loop init` automatically installs the `wiki-manager` skill into all detected agent runtimes (`.claude`, `.agents`, `.cursor`, `.gemini`, `.opencode`, `.commandcode`, `.windsurf`) simultaneously with vault scaffolding.
2. **Default `./llm-wiki-loop` Subdirectory Encapsulation**:
   - `init` without arguments cleanly scaffolds the vault inside `./llm-wiki-loop/` rather than polluting existing project roots.
   - Added `init .` and `init --root` support for dedicated standalone vault repositories.
3. **Fail-Safe Open Standard Fallback (`.agents/skills`)**:
   - When no proprietary agent folders exist, automatically falls back to `.agents/skills/wiki-manager` complying with the Open Agent Skills standard.
4. **Smart CLI Auto-Discovery**:
   - Commands (`doctor`, `check`, `clean`) automatically detect `./llm-wiki-loop` subdirectories when no explicit path argument is provided.
5. **Flexible & Non-Destructive Scaffolding Flags**:
   - Added `--no-install` and `--vault-only` flags for vault-only workflows without modifying agent skill folders.
   - Enhanced `clean` lifecycle ensuring safety and non-destructive removal of scaffolded directories.
- **CLI E2E Test Suite**:
  - Added automated test suites (`tests/test_cli_e2e.py`) validating 1-Click scaffolding, fallback skill creation, clean lifecycle, and directory resolution (18 tests passing).

---

## [1.1.0] - 2026-08-17

### ⚡ Universal Fingerprint & 0-Token Code Drift Detection

#### Added
- **Universal Fingerprint Header Support (`SPEC.md`, `AGENTS.md`)**:
  - `Fingerprint: git:<commit-hash>` and `Monitored: <paths>` optional metadata fields for code-bound wiki articles.
  - `Fingerprint: sha256:<hash>` for tracking individual files in non-git environments.
- **Mechanical Code Freshness Sweep in `check_evidence.py`**:
  - Automatically evaluates Git repository diffs (`git diff --name-only <hash> -- <paths>`) in sub-second execution without consuming LLM context tokens.
  - Generates clear drift reports alerting stale articles for synchronization or `Status: Outdated` tagging.
- **Unit & Integration Test Suite**:
  - Added test cases covering fingerprint parsing, working tree drift, committed drift, and SHA-256 hash drift detection.

---

## [1.0.0] - 2026-08-16

### 🚀 Official Production Release

#### Added
- **Cross-Platform CLI (`bin/cli.js`)**:
  - `llm-wiki init`: Scaffolds a conformant 3-layer vault (`raw/`, `wiki/`, `archive/`, `index.md`, `log.md`, `AGENTS.md`).
  - `llm-wiki doctor`: Diagnoses Python environment, detected AI agent runtimes, and local vault integrity.
  - `llm-wiki check [dir]`: Runs mechanical grounding invariant verification.
  - `llm-wiki install`: Injects the `wiki-manager` skill into detected agent directories.
- **Universal Multi-Agent Auto-Injection**:
  - Automatic detection and skill installation for **Claude Code, Cursor, Codex/Agents, OpenCode, Gemini, Windsurf, and CommandCode**.
- **Automated CI/CD Pipeline**:
  - Multi-OS validation across **Ubuntu, Windows, and macOS** with matrix testing across Node.js (18, 20) and Python (3.9, 3.11, 3.12).
  - GitHub Pages deployment for the interactive web showcase.
  - Automated GitHub Releases on version tag creation.
- **Interactive 3D-Wheel Showcase Web App (`docs/`)**:
  - Live terminal typing simulation, dynamic wheel scroll animations, and one-click commands hosted at [https://palan-k.github.io/llm-wiki-loop/](https://palan-k.github.io/llm-wiki-loop/).
- **Mechanical Grounding Linter (`check_evidence.py`)**:
  - 0-hallucination verification ensuring every date, grouped number, and quotation in `wiki/` matches immutable `raw/` bodies.
- **Self-Organizing Lifecycle**:
  - Event-driven GC and archival (`Status: Outdated` / `Status: Disputed`).
  - Procedure harvesting and auto-skillification loop.
- **Full Documentation**:
  - [SPEC.md](SPEC.md): Normative architecture specification.
  - [AGENTS.md](AGENTS.md): Canonical vault constitution (<50 lines).
  - [CONTRIBUTING.md](CONTRIBUTING.md): Multi-runtime contribution guide.
  - [PR_SUBMISSIONS.md](PR_SUBMISSIONS.md): Global Awesome list PR packages.
