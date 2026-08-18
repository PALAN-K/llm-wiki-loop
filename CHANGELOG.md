# Changelog

All notable changes to **llm-wiki-loop** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
