# LLM Wiki Loop — Reference Architecture

Version 0.1.0 (draft) · 2026-08-14

A domain-agnostic reference architecture for LLM-maintained knowledge vaults.
It instantiates Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
pattern and adds what the pattern deliberately leaves open:

1. **A fixed layout** that every vault conforms to (raw / wiki / schema / index / log / archive)
2. **Machine-verifiable grounding** — every claim traces to an immutable source, and a linter checks it
3. **A lifecycle loop** — knowledge is superseded and archived, procedures are promoted into reusable skills
4. **Self-installation** — one skill bootstraps the whole architecture into any folder

Bring your domain (code, research, a book, an Obsidian vault): the architecture installs itself,
and the loop keeps the knowledge honest as it grows.

## 1. Layout

```
<root>/
├── AGENTS.md              # the schema — vault conventions the agent must follow (canonical)
├── CLAUDE.md              # one-line pointer: @AGENTS.md (Claude Code)
├── GEMINI.md              # one-line pointer: @AGENTS.md (Gemini CLI)
├── index.md               # content catalog — one line per page
├── log.md                 # append-only audit log — parseable
├── raw/                   # immutable sources — notes/ data/ assets/
├── wiki/                  # LLM-owned compiled knowledge — concepts/ topics/ references/
└── archive/               # fully superseded pages, isolated from the active wiki
```

The layout sits at the vault root — no hidden wrapper directory — so it is identical
whether the vault is a code repository, a notes folder, or an Obsidian vault.

## 2. The three layers

### 2.1 `raw/` — immutable sources (you own)

Your curated collection of source material: articles, papers, notes, data snapshots, images.
**Immutable**: the agent reads from it and never writes to it. It is the only grounding authority.

- `raw/notes/` — document and note snapshots (markdown)
- `raw/data/` — data and script snapshots
- `raw/assets/` — binary attachments (images, PDFs). In Obsidian, set
  "Attachment folder path" to `raw/assets/` so clipped media lands here.

Only the layers you actually use are created; unused layers are added lazily.

### 2.2 `wiki/` — compiled knowledge (the LLM owns)

A directory of LLM-written markdown pages: entity pages, topic summaries, references.
The agent creates pages, updates them when new sources arrive, and maintains cross-references.
You read it; the agent writes it.

- `wiki/concepts/` — entities and concepts
- `wiki/topics/` — topic overviews
- `wiki/references/` — reference pages (surveys, catalogs, decision records)

### 2.3 The schema — `AGENTS.md` (you and the LLM co-evolve)

A single root-level file that tells the agent how this vault is structured, what its
conventions are, and what workflows to follow. It is prose *plus* machine-checked rules —
the enforceable parts live in `check_evidence.py`, not in paragraphs. Keep it short:
only what breaks things if forgotten mid-session. The canonical name is `AGENTS.md`
(the open cross-runtime standard, read natively by Codex and opencode); `CLAUDE.md`
(Claude Code) and `GEMINI.md` (Gemini CLI) are one-line pointers to it —
never second copies, to avoid drift.

## 3. The two rails

Two special files keep the vault navigable and auditable:

**`index.md` (Knowledge Catalog)** — content-oriented. A catalog of every page: link, one-line summary,
updated date, optional trigger keywords. Organized by layer. The agent updates it on
every write. Queries read the index first, then drill into pages. This is the
progressive-disclosure engine: a session starts by reading *only* the index
(one line per page) and loads pages on demand — no RAG infrastructure needed at
moderate scale.

**`log.md` (Vault Audit Ledger)** — chronological. Append-only record of every operation.
Each entry starts with a parseable prefix, e.g. `## [2026-08-14] ingest | Article Title`, so
`grep "^## \[" log.md | tail -5` returns recent history.
*Distinction*: `log.md` is the global audit ledger for the entire vault. It must **never** be
confused with or replaced by a topic page's internal `## Changelog` section.

**Invariant: every write updates index and log together.** A state transition that
does not leave an index row and an audit log line has not happened. When embedded inside a
parent project, files are consistently referenced by their canonical root-anchored prefix
(e.g., `llm-wiki-loop/index.md` and `llm-wiki-loop/log.md`).

## 4. Grounding Invariant

Every wiki page declares its evidence sources in a `Raw:` header field, pointing at
immutable `raw/` files. The rules:

1. **Verbatim for text.** Every number, date, and direct quotation in a wiki page must
   appear verbatim in one of the raw files linked by its `Raw:` field.
   Locate before write: grep the raw source, then copy the exact form.
2. **Hash anchor for binaries.** Text search cannot verify images. A binary reference
   carries a SHA-256 hash in the page; the linter verifies the file exists and matches.
3. **No wiki self-grounding.** A wiki page may never be another wiki page's grounding.
   A claim whose only support is another page is a draft, not knowledge.
4. **Derived values.** Computed values (sums, deltas) must state their components so
   each component is traceable to raw.
5. **Universal Fingerprint (Code Grounding & Drift Invariant).** Wiki pages that summarize
   or depend on codebase implementations declare optional `Fingerprint:` and `Monitored:`
   header fields:
   ```markdown
   > Fingerprint: git:<commit-hash>
   > Monitored: src/App.tsx, package.json
   ```
   - **0-Token Drift Detection:** The verification engine evaluates `git diff --name-only <hash> HEAD -- <paths>`.
     Any detected changes mark the page as drifted (`Status: Outdated` trigger), eliminating
     the need for LLMs to re-read hundreds of source files across sessions.
   - **Non-git environments:** Support `Fingerprint: sha256:<hash>` for tracking individual files without Git.

Enforcement is mechanical: `check_evidence.py` extracts candidate literals (numbers,
ISO dates, quotes) from every page and verifies each against the page's raw sources,
as well as verifying code freshness for fingerprinted articles.

## 5. The lifecycle loop

The wiki is a stateful store; the loop manages its state transitions. Nothing is ever
deleted — superseded material moves through statuses:

### 5.1 Knowledge lifecycle (facts)

```
ingest ──triage──▶ New ───────────────▶ page
        │         Update ────────────▶ merge into existing page
        │         Disputed ──────────▶ Status: Disputed block (both claims + sources)
        └───────── No material ──────▶ log only, no compilation
```

- **Status blocks.** A superseded claim keeps its history: `Status: Outdated`
  (date + what changed + source) or `Status: Disputed` (competing claims + sources).
- **Event-based GC.** When a dependency or architecture changes, or a new source
  supersedes old claims, cross-validate old pages against the new evidence:
  partial obsolescence becomes an Outdated block; full replacement moves the page
  to `archive/` (a point-in-time snapshot — never cascade-updated) and removes it
  from the index. `raw/` is never deleted.
- **No time-based TTL.** "Haven't read it in 90 days" says nothing about truth.
  Invalidation is triggered by events, not clocks.

### 5.2 Procedure lifecycle (skills)

- **Auto-skillifying.** When the same error is fixed twice, or the same solution is
  applied twice, in one session, the agent proposes promoting the procedure into a
  skill. Human approval required. Before creating, search existing skills — merge if
  a home already exists. Skills are stored in the runtime's skills directory
  (`~/.claude/skills/`, `.opencode/skills/`, …), never inside the wiki.
- **Skill audit.** Periodically review skill coverage against the project's actual
  stack and check technical claims against official docs.

### 5.3 Role separation

**Wiki = knowledge** (facts, decisions, evidence). **Skills = procedures** (how to do
things). When something is both, the fact goes in the wiki and the procedure goes in
a skill that links the wiki page.

## 6. Operations

| Operation | What it does | Writes |
|---|---|---|
| `init` | Scaffolds the layout, installs the skill, writes the schema, seeds the wiki (modes: fresh project / existing project / global) | yes |
| `ingest` | Source → `raw/` → triage → compile → cascade → index + log | yes |
| `query` | Index + full-text search → cited answer; files good answers back as pages | on request |
| `lint` | Health check in 3 tiers: safe fixes (auto), mechanical reports (`check_evidence.py`), judgment reports (contradictions, stale claims, orphans) | safe fixes |
| `loop` | Auto-skillifying, event-based GC, skill audit | proposal-first |

## 7. Conformance

A vault conforms to this architecture when:

1. The layout exists (`raw/`, `wiki/`, `index.md`, `log.md`, schema file)
2. Every non-archive wiki page has a `Raw:` field resolving to files inside `raw/`
3. `check_evidence.py` reports zero evidence errors
4. Index row count matches the actual page count
5. Every operation leaves a parseable log entry

## 8. Installation scopes

- **Global** — the skill alone, in the runtime's global skills directory.
  Vaults stay per-project.
- **Project** — skill + vault in the project root.

`init` distinguishes **fresh** projects (full scaffold) from **existing** projects
(diagnose leftover instruction files — `CLAUDE.md`, `.cursor/`, `agent.md` — integrate
them, then seed from existing documents).

## 9. Non-goals

- **No time-based TTL or access-frequency decay.** Event-based invalidation only.
- **No RAG, vectors, or knowledge graphs at moderate scale.** At up to hundreds of
  pages, index + grep is more reliable and auditable. Search infrastructure is
  revisited only when retrieval quality measurably degrades.
- **No plugin, app, service, or database.** Plain markdown in a folder, one schema
  file, one skill, one linter.
- **No deletion.** Everything moves to a status or the archive; history survives.
