# Release Note & UX Improvements for v1.1.1
> Source: Project Retrospective & Test Results
> Date: 2026-08-17

On 2026-08-17, llm-wiki-loop released version 1.1.1 to address field feedback from real project tests.

Key enhancements delivered:
1. True 1-Click Init: `npx llm-wiki-loop init` combines vault scaffolding and AI agent skill injection in a single operation.
2. Default Subdirectory Encapsulation: Scaffolds inside `./llm-wiki-loop/` by default to prevent root pollution, while supporting `init .` for root placement.
3. Fallback Agent Skill Injection: Installs into `.agents/skills/wiki-manager` (Open Agent standard) when no proprietary IDE folder is detected.
4. E2E Test Suite: Added `tests/test_cli_e2e.py` covering all CLI lifecycle operations.
5. All 18 automated tests passing with 0 evidence errors.
