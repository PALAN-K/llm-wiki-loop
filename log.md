# Vault Log

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



