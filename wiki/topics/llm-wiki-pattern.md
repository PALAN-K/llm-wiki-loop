# LLM Wiki Pattern

> Sources: Andrej Karpathy, LLM Wiki gist (2026-04-04); llm-wiki-loop ecosystem survey (2026-08-14)
> Raw: [Karpathy LLM Wiki gist](../../raw/notes/2026-04-04-karpathy-llm-wiki.md); [Ecosystem survey](../../raw/notes/2026-08-14-ecosystem-survey.md)
> Updated: 2026-08-14
> Triggers: karpathy, llm wiki, knowledge vault, second brain, RAG alternative

## Overview

Andrej Karpathy's LLM Wiki pattern (gist published 2026-04-04) replaces
query-time RAG with a persistent, incrementally compiled knowledge base:
"the wiki is a persistent, compounding artifact". Instead of re-deriving
answers from raw documents on every question, the LLM compiles knowledge
once and keeps it current — updating entity pages, revising summaries, and
flagging contradictions as new sources arrive.

## The three layers

**Raw sources** — curated source documents: "Articles, papers, images, data
files". Immutable: "the LLM reads from them but never modifies them".

**The wiki** — a directory of LLM-generated markdown pages owned entirely by
the LLM. It creates pages, maintains cross-references, and keeps the
synthesis consistent.

**The schema** — a document (CLAUDE.md for Claude Code or AGENTS.md for
Codex) that tells the LLM the vault's structure and workflows. It is what
makes the LLM "a disciplined wiki maintainer rather than a generic chatbot".

## Operations

- **Ingest** — a source enters the raw collection and the LLM integrates it.
  "A single source might touch 10-15 wiki pages."
- **Query** — answers synthesized with citations; "good answers can be
  filed back into the wiki as new pages" so explorations compound.
- **Lint** — periodic health checks: contradictions, stale claims, orphan
  pages, missing cross-references.

## Index and log

Two special files navigate the vault. `index.md` catalogs every page with a
one-line summary; queries read it first and drill into pages, which "avoids
the need for embedding-based RAG infrastructure" at moderate scale. `log.md`
is append-only and parseable (`grep "^## \[" log.md | tail -5`). A small
vault needs no search engine: "the index file is all you need, no search
engine required".

## Why it works

The maintenance burden — cross-references, summaries, contradiction notes —
grows faster than the value for humans: "LLMs don't get bored, don't forget
to update a cross-reference, and can touch 15 files in one pass". The
division of labor is "The LLM's job is everything else." In daily practice
the pattern pairs an agent with Obsidian: "Obsidian is the IDE; the LLM is
the programmer; the wiki is the codebase". Karpathy traces the idea to
"Vannevar Bush's Memex (1945)" — a curated store whose connections matter
as much as its documents.

## See Also

[LLM Wiki Ecosystem Landscape](../references/ecosystem-landscape.md)
