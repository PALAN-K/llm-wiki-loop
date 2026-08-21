# Cross-Platform CLI and CI/CD Architecture

> Raw: [Note](../../raw/notes/2026-08-16-cli-architecture-and-cicd-matrix.md); [UX Note](../../raw/notes/2026-08-17-v1-1-1-release-ux-improvements.md); [Incident](../../raw/notes/2026-08-21-incident-windows-non-ascii-crash.md)
> Fingerprint: git:1a8ecc1
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

## Windows Non-ASCII Path Hardening (v1.3.2)

On 2026-08-21, installation of llm-wiki-loop@1.3.1 failed on Windows Node v24.11.0 when the project path contained Korean characters (집꾸미다견적솔루션). The call `fs.cpSync(SKILL_SRC, dest, { recursive: true, force: true })` in `bin/cli.js:78` and `scripts/install.js` plus `fs.rmSync(dest, { recursive: true, force: true })` triggered a native `STATUS_STACK_BUFFER_OVERRUN` crash with exit code -1073740791, not catchable via JavaScript `try/catch`. `llm-wiki doctor` passed, while `llm-wiki install` crashed; manual `Copy-Item -Recurse -Force` and per-file `fs.copyFileSync` loop succeeded.

Fixed in 1.3.2 by replacing all recursive `fs.cpSync`/`fs.rmSync` with a single primary pure-JS loop: `fs.lstatSync` + `fs.readdirSync({ withFileTypes: true })` Dirent handling (`isDirectory()`, `isSymbolicLink()`) and `fs.copyFileSync` per file. Previous `fs.statSync` made `isSymbolicLink()` always false; now correctly preserves symlinks (fallback to copy on `EPERM`). The skill payload is 7 files, total package size 48.2 kB, unpacked size 157.5 kB, total files 18 — overhead <10ms. Verified with `npm run lint` exit 0, `npm test` 25 tests passing, `npm pack --dry-run` 18 files, and isolated Korean path `집꾸미다견적솔루션-테스트` `init`/`install`/`clean` all exit 0 with 7 files content-equal.

## Distribution Isolation
To maintain clean distribution boundaries:
- The npm package publishes only `bin/`, `skills/`, `scripts/`, `README.md`, `SPEC.md`, `AGENTS.md`, and `LICENSE`.
- Internal vault historical artifacts (`raw/`, `wiki/`, `archive/`, `tests/`) remain isolated within repository source control.
