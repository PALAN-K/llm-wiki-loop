# Templates

## Raw file (raw/notes/, raw/data/)

```markdown
# {Title}

> Source: {URL or origin}
> Collected: {YYYY-MM-DD}
> Published: {YYYY-MM-DD | Unknown}

{Original text verbatim — preserve, never rewrite}
```

Binary assets in `raw/assets/` get a sibling note or header line with the
SHA-256 hash and origin.

## Wiki page (wiki/concepts|topics|references/)

```markdown
# {Concept or topic name}

> Sources: {author/organization, YYYY-MM-DD; ...}
> Raw: [{title}](../../raw/notes/{file}.md); [...]
> Fingerprint: git:{commit-hash} {optional — for code-bound pages}
> Monitored: {path1, path2... optional — monitored source files for 0-token drift detection}
> Updated: {YYYY-MM-DD — last date knowledge content changed}
> Triggers: {optional — search keywords, comma-separated, mirrored in index.md}

## Overview

{One-paragraph synthesis — synthesize, never copy}

## {Body sections}

{Synthesized structure from the sources. Verbatim quotes are minimal — only
key phrases as blockquotes.}

> **Status: Outdated** (YYYY-MM-DD)
> {What changed and the current understanding + source}

> **Status: Disputed**
> {Competing claims, each + source}

## See Also

{Cross-references — same layer: [A](a.md), other layer: [B](../topics/b.md)}
```

## Archived page (query answers filed on request)

```markdown
# {Query topic}

> Sources: [{cited wiki pages}](../concepts/{a}.md); ...
> Archived: {YYYY-MM-DD}
> Updated: {YYYY-MM-DD}

{Synthesized answer body — no Raw field}
```

## index.md (row format)

```markdown
# Knowledge Base Index

## concepts
- [Page name](wiki/concepts/{a}.md) — {one-line summary} (Updated: YYYY-MM-DD)
## topics
...
## references
...
```

## log.md (entry format — append-only, parseable)

```markdown
# Vault Log

## [YYYY-MM-DD] init | Vault initialized (project, <name>)
## [YYYY-MM-DD] ingest | <primary page title>
- Disposition: New; Update
- Raw: raw/notes/<file>.md
- Updated: <cascaded pages>
## [YYYY-MM-DD] ingest | no material: raw/notes/<file>.md
- Disposition: No material
## [YYYY-MM-DD] query | Archived: <title>
## [YYYY-MM-DD] archive | <title> (fully replaced — GC)
## [YYYY-MM-DD] lint | <N> issues found, <M> auto-fixed
```

`grep "^## \[" log.md | tail -5` lists the last five operations.

## Auto-generated skill (runtime skills dir/<name>/SKILL.md)

Created when the same error/solution repeats twice (self-improving-loop §1).
Never inside `wiki/`.

```markdown
---
name: fix-<error-slug>
description: "<one line — when it triggers; error message and symptom keywords>"
---

# Fix: <error summary>

## Trigger
<error message or symptom — in a matchable form>

## Reproduction
<minimal reproduction steps>

## Cause
<root cause — verification tag required: [docs](URL) / [experiment] / [reasoned]>

## Fix
1. <step>
2. ...

## Verification
<confirmation command and result>

## Related wiki
[<knowledge page>](<path>) — knowledge lives in the wiki, procedure lives here
```
