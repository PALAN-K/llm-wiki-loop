---
name: wiki-manager
description: >
  Operates an LLM-maintained knowledge vault (llm-wiki-loop architecture) —
  init (bootstrap), ingest (absorb sources), query (cited answers), lint
  (health check), and the self-improving loop (auto-skillifying, event-based
  GC, skill audit). Use when the user says "wiki", "ingest this", "what does
  the wiki say", "set up my vault", "make a skill for this error", or when
  the same fix/solution repeats twice in a session. Details:
  references/wiki-protocol.md; machine verification:
  scripts/check_evidence.py.
---

# Wiki Manager

Operates an LLM-maintained knowledge vault per the llm-wiki-loop architecture
(SPEC.md in the distribution repo). **Before any operation, read
`references/wiki-protocol.md` fully and follow it.** Bootstrap follows
`references/bootstrap-protocol.md`; the self-improving loop is
`references/self-improving-loop.md`; templates: `references/templates.md`.

## Core principles

1. **Layers**: `raw/` (immutable sources — never write) → `wiki/` (LLM-owned
   compiled knowledge) → schema (`AGENTS.md`).
2. **Grounding Invariant**: every number, date, and quotation on a wiki page
   must exist verbatim in the raw files linked by its `Raw:` field. Locate
   before write; binaries carry a SHA-256 anchor.
3. **Triage first**: every ingest is judged New / Update / Disputed /
   No material. No material → log only, never a forced page.
4. **Cascade + status**: new sources update every affected page. Superseded
   claims keep `Status: Outdated` / `Status: Disputed` blocks; history is
   never deleted.
5. **Index + log on every write**: `index.md` (one line per page) and
   `log.md` (parseable, append-only) are updated together, always.

## Operations

| Command | Action | Writes |
|---|---|---|
| init | Scaffold layout, install skill, write schema, seed wiki (fresh / existing / global modes) | O |
| ingest | Source → raw/ → triage → compile → cascade → index + log | O |
| query | index.md + full-text search → cited answer. Files answers back only on request | Δ |
| lint | 3 tiers: safe fixes (auto) / mechanical (script reports) / judgment (reports only) | Δ |
| loop | auto-skillify proposals, event-based GC, skill audit — proposal-first, human approves | Δ |

## Verification

- `python3 scripts/check_evidence.py <root>` (Windows: `py`; read-only) —
  fidelity suspects, evidence errors, unreferenced raw files.
- Index row count must equal actual page count after every write.
