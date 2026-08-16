---
name: vault-cicd
description: Best practices, schema validation rules, and GitHub Actions CI/CD workflows for LLM-maintained knowledge vaults.
---

# Vault CI/CD Specification & Linting Rules

## 1. CI Pipeline Architecture
A robust CI workflow for LLM-wiki vaults separates concerns into three isolated stages:

```
[Stage 1: Syntax & Static Checks] -> [Stage 2: Sandbox E2E & Unit Tests] -> [Stage 3: Vault Evidence Invariants]
```

### Stage 1: Syntax & Static Checks
- Verify `package.json` syntax and schema.
- Validate Node CLI entrypoints exist and parse without syntax errors (`node --check bin/cli.js`).
- Verify required schema files exist (`AGENTS.md`, `SPEC.md`, `index.md`, `log.md`).

### Stage 2: Sandbox E2E & Unit Tests
- Execute isolated Python `unittest` suites using temporary sandbox directories (`tempfile.TemporaryDirectory()`).
- Verify lifecycle transformations:
  - New Raw note ingested -> Wiki article compiled -> index and log updated -> Evidence passes.
  - Failure injection: Hallucinated date/number -> Evidence verification returns nonzero errors.

### Stage 3: Vault Evidence Invariants
- Run `check_evidence.py` against the repository vault.
- Ensure 0 evidence errors and 0 unreferenced raw files (unless explicitly marked).

## 2. GitHub Actions YAML Matrix Pattern
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node-version: [18.x, 20.x]
    python-version: ['3.9', '3.11', '3.12']
```
Ensure checkout uses `actions/checkout@v4`, python setup uses `actions/setup-python@v5`, and node setup uses `actions/setup-node@v4`.
