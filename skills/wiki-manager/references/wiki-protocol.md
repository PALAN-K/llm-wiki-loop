# Vault operation protocol

Full operating spec of the `wiki-manager` skill. Targets the vault at the
project root (canonical llm-wiki-loop layout). Layout and mandatory rules are
defined in SPEC.md of the distribution repo; this file defines the workflows.

## 0. Layout summary & Vault Root Discovery

### Vault Root Resolution
AI Agents operating this skill must resolve `<root>` using the following priority:
1. **Encapsulated Mode (Default)**: If `./llm-wiki-loop/index.md` (or `./llm-wiki/index.md`) exists, `<root>` is `<project>/llm-wiki-loop/`.
2. **Standalone / Root Mode**: If `./index.md` and `./AGENTS.md` exist directly at the project root, `<root>` is `<project>/`.
3. All operations (`raw/`, `wiki/`, `archive/`, `index.md`, `log.md`) are executed relative to `<root>`.

```
<root>/
├── AGENTS.md           # schema (canonical; CLAUDE.md/GEMINI.md are one-line pointers)
├── index.md            # content catalog — one line per page
├── log.md              # append-only, parseable audit log
├── raw/                # immutable sources — never modify
│   ├── notes/          # document and note snapshots
│   ├── data/           # data and script snapshots
│   └── assets/         # binary attachments (images, PDFs)
├── wiki/               # LLM-owned compiled layer (active knowledge only)
│   ├── concepts/       # concept and entity pages
│   ├── topics/         # topic overviews
│   └── references/     # reference pages
└── archive/            # fully superseded pages — snapshots, excluded from index and cascade
```

- Originals live in `raw/`; compiled knowledge only in `wiki/`. A wiki page is
  never another wiki page's grounding.
- Unused layers are created lazily on first use — no empty scaffolding.
- Relative links from `wiki/<layer>/<a>.md` to raw: `../../raw/<kind>/<b>.md`.
- `.obsidian/` and `.sessions/` are git-ignored; vault content is committed.

## 1. Ingest

### 1.1 Fetch (raw/)

1. Obtain the source as markdown (web / file / paste). If it cannot be read,
   ask the user to paste it.
2. Classify: documents and notes → `raw/notes/`; data and script snapshots →
   `raw/data/`; binaries → `raw/assets/` (record a SHA-256 hash alongside).
3. Filename `YYYY-MM-DD-descriptive-slug.md` (kebab-case, ≤60 chars). Omit the
   date when the publication date is unknown.
4. Include a metadata header (Source / Collected / Published), preserve the
   original text verbatim, do not rewrite opinions. Formats:
   `references/templates.md`.
5. Windows note: copy raw sources with UTF-8-safe tooling. PowerShell 5.1
   `Get-Content`/`Set-Content` silently mangles non-ASCII text — verify a
   keyword of the copied file afterward.

### 1.2 Triage (mandatory before compile)

Search `wiki/` for the source's core entities and synonyms, then judge:

- **New** — create a new page
- **Update** — merge into an existing page
- **Disputed** — contradicts existing content (may combine with New/Update)
- **No material** — no new knowledge → keep raw, log only, stop. Never force
  a page.

### 1.3 Compile

- Same topic = merge into the existing page (append Sources/Raw, update the
  affected sections).
- New concept = new page named after the concept in the best-fit layer.
- Multi-layer topics go in the most relevant layer with See Also cross-links.
- **Grounding Invariant**: before writing, locate every number, date, and
  direct quotation in the raw sources (grep/read) and copy the exact form.
  Derived values (sums, deltas) state their components so each is traceable.
  A value that cannot be located must not be written in exact form.
- Contradictions get a `Status: Disputed` block; superseded claims get
  `Status: Outdated` (YYYY-MM-DD). History is never deleted.

### 1.4 Cascade updates

After the primary page, ripple outward: search the whole wiki for the source's
core entities and claims, update every genuinely affected non-archive page,
and refresh its Updated date. Archive pages are point-in-time snapshots —
never cascade-update them.

### 1.5 Post-ingest (mandatory)

- `index.md`: add/update one row per touched page.
- `log.md`: append
  ```
  ## [YYYY-MM-DD] ingest | <primary page title>
  - Disposition: New; Update
  - Raw: raw/notes/<file>.md
  - Updated: <cascaded pages>
  ```
  No material: `## [YYYY-MM-DD] ingest | no material: raw/notes/<file>.md`
  plus `- Disposition: No material` (a machine-parseable key — never omit).

## 2. Query

1. Pick candidates from `index.md`, then full-text search `wiki/` with the
   keywords **and synonyms**. Only when both index and search come up empty
   may "not found" be declared (state that the search was performed).
2. Read the found pages and synthesize an answer with citations
   (`[page](wiki/<layer>/<a>.md)` relative to the root).
3. Prefer wiki content over training knowledge. Output the answer in the
   conversation only — no file writes.
4. **Archiving** (only on explicit user request): file the answer as a new
   page (never merge into an existing page, no Raw field, `> Archived:`
   date header). Prefix its index summary with `[Archived]` and log
   `## [YYYY-MM-DD] query | Archived: <title>`.

## 3. Lint

### 3.1 Safe fixes (automatic)

- **Index parity**: compare `index.md` with actual files — add missing files
  as `(no summary)`, mark dead rows `[MISSING]` (never delete), fix stale
  Updated dates on the index side.
- **Internal links**: markdown links in `wiki/` (excluding Raw fields and
  See Also) whose targets are missing — fix the path if exactly one name
  match exists, else report.
- **Raw references**: Raw field links pointing outside `raw/` or missing —
  fix on exactly one name match, else report.
- **See Also**: missing targets — fix on one match, remove on zero (a dead
  cross-reference carries no value), report on many.

### 3.2 Mechanical reports (script — never auto-fix)

Run `python3 scripts/check_evidence.py <root>` (Windows: `py`) and judge:

- **Fidelity suspects**: candidate literals (numbers, ISO dates, quotes) not
  found verbatim in the linked raw files — suspects, not verdicts. Compare
  against the raw context and report only real mismatches.
- **Evidence errors**: missing Raw field (non-archive), unresolvable Raw
  links, Raw links escaping `raw/` — decision required.
- **Unreferenced raw files**: raw files no page references, excluding those
  logged as "no material" — an ingest backlog.

### 3.3 Judgment reports (model judgment — report only)

- Factual contradictions between pages
- Superseded claims without Status blocks
- Contradictions left unmarked
- Missing cross-references (suggestions only)
- Malformed Status blocks
- Orphan pages
- Concepts frequently mentioned but lacking a page
- Archive pages whose originals were heavily rewritten afterward
- Pages not re-verified after a dependency or architecture change

### 3.4 Post-lint

Append `## [YYYY-MM-DD] lint | <N> issues found, <M> auto-fixed` to `log.md`.
**check_evidence.py results are recorded mandatorily** — under the entry add
`- Evidence: <suspects> suspects / <errors> errors / <unreferenced>
unreferenced` (the script is report-only, so the log is the sole audit trail).

## 4. Prohibitions

- Editing or rewriting files in `raw/` (immutable originals)
- Force-compiling a No-material source
- Grounding a wiki page on another wiki page
- Deleting superseded or disputed claims without Status blocks
- Query writing files (except the explicit archiving request)
- Storing skills inside `wiki/` or `raw/` — skills belong to the runtime's
  skills directory
- Time-based TTL or access-frequency decay rules (event-based GC only —
  self-improving-loop §2)

## 5. Self-improving loop

- **Auto-skillifying**: the same error fixed twice, or the same solution
  applied twice, in one session → propose promoting it into a skill (human
  approval; merge into an existing skill when possible; runtime skills
  directory only). Procedure and quality gates: `references/self-improving-loop.md` §1.
- **Event-based GC**: dependency/architecture change, superseding source,
  or lint finding → cross-validate old knowledge → partial obsolescence gets
  an Outdated block; full replacement moves to `archive/` + index removal +
  log. No time-based TTL. Details: §2.
- **Progressive disclosure**: never load the whole vault at session start —
  read `index.md` first, load pages on demand. Details: §3.
