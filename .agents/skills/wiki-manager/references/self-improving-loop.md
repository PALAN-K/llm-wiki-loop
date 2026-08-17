# Self-improving loop

The self-improving loop of Hermes-class agents (auto-skillifying, knowledge
GC, progressive disclosure) applied to the vault harness. Principle: do not
multiply rules in the always-loaded system prompt; details live in this
on-demand document.

## 1. Auto-skillifying (error patterns become skills)

**Trigger**: the same error was fixed twice, or the same solution applied
twice, in one session → propose creating a skill (one human approval).

**Corrections vs. the original theory**:

| Original | Ruling | Why |
|---|---|---|
| Store in `.wiki/skills/` | **Runtime skills directory** | Skill loaders scan only fixed directories (`~/.claude/skills/`, `.opencode/skills/`, `~/.agents/skills/`, …); a wiki-adjacent folder is a dead zone |
| Mechanical detection (hooks) | **Model self-judgment + rule** | Runtimes differ in session hooks; automatic plugin detection costs more maintenance than it saves (no over-engineering) |

**Procedure**:

1. Repetition detected → **propose** skillifying (never create before approval)
2. Search existing skills first → **merge** if a home exists (prevents skill spam)
3. New skill quality gate (all required):
   - frontmatter `description` with trigger keywords (short — context costs)
   - trigger symptom → reproduction → cause → fix steps → verification command
   - verification tags on every claim: `[docs](URL)` / `[experiment]` / `[reasoned]`
   - link to the relevant wiki page (role separation: wiki = knowledge, skill = procedure)
4. Template: `templates.md`, "Auto-generated skill" section
5. Periodic consolidation: §4 audit proposes merging/deprecating duplicates

## 2. Knowledge GC (event-based invalidation — never TTL)

**Time-based TTL and access-frequency decay are forbidden.** Rationale: the
rate of domain change cannot be predicted at compile time, and "rarely read"
does not imply false. Instead, **event-based**:

**Trigger events** (any one):

1. **Dependency / architecture change** — migrations, package replacements,
   schema changes
2. **A new ingest** supersedes or contradicts existing claims (Triage
   Disputed/Update)
3. **A lint finding** spots superseded claims without Status blocks

**Procedure — cross-validation before replacement**:

1. Compare old page claims against the new source / official docs (verification tags required)
2. Branch:
   - **Partially obsolete** → keep the page, add `Status: Outdated`
     (date + new understanding + source) — history preserved
   - **Fully replaced** → move the page to `archive/` + remove from
     `index.md` + log `## [YYYY-MM-DD] archive | <title>`
   - `raw/` originals are never deleted (immutable)
3. Archive page rules: excluded from cascade updates (point-in-time
   snapshot); broken links handled by lint safe fixes; optionally recorded
   in the index under an archive section

**Why this prevents context pollution**: the vault is read on demand, so the
pollution risk is "old pages still surface in search and index" — archive
isolation + index removal blocks that. Since vault content is never
always-loaded, TTL itself is unnecessary.

## 3. Progressive disclosure

**Already implemented**: skills load only a one-line description at session
start (SKILL.md is on-demand); vault pages enter context only when read.

**Codified rules**:

1. **Never load the whole vault at session start** — read `index.md` (one
   line per page) first; load pages only when needed.
2. Wiki pages may carry `Triggers:` keywords (optional) — mirrored in their
   index row to speed up matching.
3. **No RAG / vectors / graphs at moderate scale** — for a curated vault of
   hundreds of pages, grep + index is more reliable (search tooling is
   revisited only when recall measurably degrades).
4. Keep `index.md` at one row per page — split into topic sections if it
   grows unwieldy.

## 4. Skill audit

Skill coverage analysis, updates, and official-doc comparison belong to this
loop. Shares the quality gates of §1.

- **review**: analyze skill coverage — inventory `.opencode/skills/` (or the
  runtime's skills dir) against the project's actual stack → report missing
  areas (Critical / Important / Nice-to-have) → on approval, chain creates.
- **create / update**: same procedure and quality gates as §1 — verification
  tags mandatory, no unsourced information, never delete existing content
  (add/modify only), preserve frontmatter structure, human approval required.
- **audit**: compare every skill's technical claims against official docs —
  Critical items recommend immediate update; Warnings are batched.
- **Trigger**: direct user request ("audit my skills", "make this error a
  skill") or §1's two-repetition detection. Channel: session-time proposals,
  not a separate command.

## Verification summary

| Mechanism | Ruling | Reflected in |
|---|---|---|
| Auto-skillifying | Adopted (storage location and detection corrected) | Runtime skills dir, model self-judgment + approval |
| Knowledge TTL & GC | Time TTL rejected → event-based | `archive/` isolation, cross-validation procedure |
| Progressive disclosure | Adopted (mostly pre-existing) | Codified rules + Triggers keywords |
| Skill audit | Adopted — folded into the loop | §4, quality gates shared with §1 |
