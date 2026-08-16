# AGENTS.md — llm-wiki-loop vault schema

This repository is a reference architecture for LLM-maintained knowledge vaults
(see SPEC.md). It dogfoods itself: this repo is also a conformant vault.

Canonical schema file is this one. CLAUDE.md and GEMINI.md are one-line
pointers here for runtimes that read them.

## Layout (fixed — do not deviate)

```
raw/      immutable sources — never write, never edit (notes/ data/ assets/)
wiki/     LLM-owned compiled knowledge — you may read, you write (concepts/ topics/ references/)
archive/  fully superseded pages — snapshots, never cascade-updated, not in index
index.md  one line per wiki page, updated on every write
log.md    append-only audit log, parseable prefix "## [YYYY-MM-DD] op | ..."
SPEC.md   the architecture spec (the product). README.md — landing page.
skills/wiki-manager/  the skill's distribution source (the second product)
AGENTS.md this file (canonical schema). CLAUDE.md/GEMINI.md point here — keep them pointers
```

## Rules that survive context compaction

1. **Grounding Invariant.** Every number, date, and quotation on a wiki page must
   appear verbatim in the raw files listed in its `Raw:` header field. Locate
   before write. A page without a `Raw:` field (except archive pages) is an error.
2. **Triage before compile.** Every ingest is judged New / Update / Disputed /
   No material. No material → log entry only, never a forced page.
3. **Status blocks.** Superseded claims get `Status: Outdated` (date + what changed)
   or `Status: Disputed` (competing claims). Never delete history.
4. **Index + log on every write.** No exceptions. Log entry format is in
   skills/wiki-manager/references/templates.md.
5. **Never edit raw/.** Never write skills into wiki/. Skills belong to the
   runtime's skills directory.
6. **The loop is proposal-first.** Auto-skillifying and archiving require explicit
   human approval before any write.

## Verification

```
python3 skills/wiki-manager/scripts/check_evidence.py .
```

Report-only. Zero evidence errors required; fidelity suspects are judged by a human.
On Windows without python3, use `py`. After any wiki write, update index.md and
log.md in the same change.

## Domain notes (this vault)

- Wiki pages document the LLM-wiki ecosystem and this project's design decisions.
  External sources are ingested to raw/notes/ first, then compiled.
- Keep wiki pages grounded in raw — SPEC.md itself is normative and is not raw
  evidence for ecosystem claims.
- English throughout (OSS project).
