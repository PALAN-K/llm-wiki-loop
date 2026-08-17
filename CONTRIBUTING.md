# Contributing to llm-wiki-loop

Thank you for your interest in contributing to **llm-wiki-loop**! This project implements a reference architecture for self-improving, LLM-maintained knowledge vaults.

---

## 1. Development Workflow

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Python**: `3.9` or higher

### Setup & Local Verification
Clone the repository and install dependencies:
```bash
git clone https://github.com/PALAN-K/llm-wiki-loop.git
cd llm-wiki-loop
```

Run test suites and syntax lints:
```bash
# 1. Lint JavaScript CLI scripts
npm run lint

# 2. Run unit and lifecycle integration tests
npm test

# 3. Diagnose local setup and check vault evidence
node bin/cli.js doctor
node bin/cli.js check .
```

---

## 2. Core Invariants (Grounding Rules)

When contributing changes to the vault or to the verification engine, keep these invariants:

1. **Grounding Invariant**: Every number, date, and quote on a wiki page must trace verbatim to immutable files in `raw/` listed in its `Raw:` header field.
2. **Layer Separation**:
   - `raw/`: Immutable sources (never edit, never delete).
   - `wiki/`: LLM-compiled knowledge (managed by agents & verification).
   - `archive/`: Superseded snapshots.
   - `index.md`: One line per wiki page.
   - `log.md`: Append-only audit log.
3. **Evidence Errors = Zero**: `node bin/cli.js check .` (or `py skills/wiki-manager/scripts/check_evidence.py .`) must exit with `0` evidence errors.

---

## 3. Adding Support for New Agent Runtimes

To add a new AI coding agent runtime (e.g., `.cursor`, `.claude`, `.gemini`, `.windsurf`):

1. Update `bin/cli.js` and `scripts/install.js`:
   - Add the marker path and skill target directory in `GLOBAL_RUNTIMES` and `PROJECT_RUNTIMES`.
2. Update documentation in `README.md` and `SPEC.md`.
3. Add a test case in `tests/test_vault_lifecycle.py`.

---

## 4. Submitting Pull Requests

1. Fork the repo and create a feature branch (`git checkout -b feat/my-feature`).
2. Ensure all tests pass locally (`npm test` and `npm run lint`).
3. Commit with a concise message following conventional commit standards.
4. Push and open a Pull Request against `main`. GitHub Actions CI will automatically validate your PR across Linux, macOS, and Windows.
