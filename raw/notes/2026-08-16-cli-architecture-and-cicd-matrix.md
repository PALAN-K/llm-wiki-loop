# Cross-Platform CLI Architecture and CI/CD Pipeline Design Note

> Source: Project Architecture Log (palank-llm-wiki)
> Author: PALAN-K Core Team
> Date: 2026-08-16

## Background & Problem
When distributing an LLM-maintained knowledge vault framework as an open-source npm package, two operational challenges arise:
1. Cross-platform execution: Python runtime naming conventions differ between Windows (`py`, `python`) and Unix/macOS (`python3`, `python`).
2. Postinstall resilience: An error during `npm install` postinstall hooks aborts user package installation.

## Architectural Decisions & Specifications
1. Python Runtime Resolution:
   - Priority sequence on Windows: `py` -> `python` -> `python3`.
   - Priority sequence on POSIX: `python3` -> `python`.
   - If no Python runtime is available, the CLI exits gracefully with status code 1 and outputs a friendly remediation message instead of crashing with uncaught `ENOENT`.

2. Multi-Stage CI Pipeline Architecture:
   - Stage 1: Static syntax linting (`node --check`).
   - Stage 2: Sandboxed E2E lifecycle and hallucination detection tests using isolated temporary directories (`tempfile.TemporaryDirectory`).
   - Stage 3: Self-vault evidence invariant verification (`check_evidence.py`).

3. Multi-OS Matrix Verification:
   - Operating systems: Ubuntu, Windows, and macOS.
   - Node.js versions: 18.x and 20.x.
   - Python versions: 3.9, 3.11, and 3.12.

4. Package Boundary Isolation:
   - The npm distribution bundle includes only `bin/`, `skills/`, `scripts/`, `README.md`, `SPEC.md`, `AGENTS.md`, and `LICENSE`.
   - Internal vault artifacts (`raw/`, `wiki/`, `archive/`, `tests/`) are excluded from npm releases.
