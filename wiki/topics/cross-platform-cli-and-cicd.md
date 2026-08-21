# Cross-Platform CLI and CI/CD Architecture

> Raw: [Note](../../raw/notes/2026-08-16-cli-architecture-and-cicd-matrix.md); [UX Note](../../raw/notes/2026-08-17-v1-1-1-release-ux-improvements.md)
> Fingerprint: git:7abfe09
> Monitored: bin/cli.js, .github/workflows/ci.yml, .github/workflows/release.yml
> Sources: Project Architecture Log (palank-llm-wiki)

## Overview
Distributing an LLM knowledge vault framework requires robust interop between Node.js CLI entrypoints and Python verification engines across operating systems.

## Runtime Resolution & Resilience
- On Windows systems, the CLI resolves Python in the order `py` -> `python` -> `python3`.
- On POSIX platforms, the resolution order is `python3` -> `python`.
- If Python 3 is absent, the CLI returns an exit status code of 1 with user remediation guidance.

## 1-Click Initialization & Subdirectory Encapsulation (v1.1.1)
Released on 2026-08-17, version 1.1.1 introduced major DX improvements:
- **True 1-Click Init**: `npx llm-wiki-loop init` combines vault scaffolding and AI agent skill injection in a single operation.
- **Default Subdirectory Encapsulation**: Scaffolds inside `./llm-wiki-loop/` by default to prevent root pollution, while supporting `init .` for root placement.
- **Fallback Agent Skill Injection**: Installs into `.agents/skills/wiki-manager` (Open Agent standard) when no proprietary IDE folder is detected.

## CI/CD Pipeline & Matrix
The GitHub Actions workflow implements a 3-stage validation pipeline:
1. **Stage 1 (Syntax Lint)**: Syntax verification via `node --check`.
2. **Stage 2 (Isolated Tests)**: Sandboxed E2E testing using `tempfile.TemporaryDirectory` to prevent circular dependencies (all 18 automated tests passing with 0 evidence errors).
3. **Stage 3 (Evidence Check)**: Invariant verification on the repository vault.

The matrix tests across Ubuntu, Windows, and macOS with Node.js versions 18.x and 20.x, and Python versions 3.9, 3.11, and 3.12.

## Distribution Isolation
To maintain clean distribution boundaries:
- The npm package publishes only `bin/`, `skills/`, `scripts/`, `README.md`, `SPEC.md`, `AGENTS.md`, and `LICENSE`.
- Internal vault historical artifacts (`raw/`, `wiki/`, `archive/`, `tests/`) remain isolated within repository source control.
