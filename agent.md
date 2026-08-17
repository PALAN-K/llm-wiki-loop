# agent.md — llm-wiki-loop Project Constitution

@AGENTS.md

Canonical schema for this vault lives in AGENTS.md.
All AI agents operating in this repository MUST obey the following principles:

## Core Invariants & Rules (< 50 lines)

1. **Grounding Invariant**: Never write from unverified memory. Every claim, number, date, and quote in `wiki/` must trace verbatim to immutable files in `raw/` listed in its `Raw:` header field.
2. **Layer Separation**: `raw/` is immutable (never edit). `wiki/` is LLM-compiled knowledge. `AGENTS.md` is the canonical schema.
3. **Index & Log Consistency**: Every wiki write MUST update `index.md` (one line per page) and append to `log.md` in the same change.
4. **Machine Verification**: After any wiki modification, run verification via `py skills/wiki-manager/scripts/check_evidence.py .` and ensure 0 evidence errors.
5. **Self-Improving Loop**: Repeated solutions or error fixes (2+ times) must be proposed as reusable skills with human approval.
