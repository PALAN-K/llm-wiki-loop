# Bootstrap protocol (init)

Standard procedure to reproduce the llm-wiki-loop architecture reliably in any
project. Read this file fully before running `init`. Scope and mode decide the
path; everything else is common.

## 0. Scope and modes

| Scope | Where things land | Wiki |
|---|---|---|
| Global | skill → runtime global skills dir (`~/.claude/skills/`, `~/.config/opencode/skills/`, …) | none — vaults stay per-project |
| Project | skill → project skills dir (`.claude/skills/`, `.opencode/skills/`, …) + vault in project root | yes |

| Mode | Applies when | Path |
|---|---|---|
| A. Fresh | empty project | §1 + §2 + §4 |
| B. Existing | project already has code/docs/leftover agent files | §1 + §3 + §4 |
| C. Global | user wants the skill everywhere, no per-project vault | §1 only |

## 1. Install the skill (all modes)

Copy `skills/wiki-manager/` (SKILL.md + references/ + scripts/) into the
runtime's skills directory — global or project per scope. Never symlink into
a git-committed project on Windows without checking clone support; plain copy
is the default. Re-running `init` later re-syncs from the distribution repo
(the repo is the SSOT; installed copies are consumers).

## 2. Mode A — fresh project

1. Scaffold the layout (only layers that will be used):
   `raw/notes`, `raw/data`, `raw/assets`, `wiki/concepts|topics|references`,
   `archive/`, `index.md`, `log.md`. Add `.obsidian/` and `.sessions/` to
   `.gitignore`.
2. Write the schema: `AGENTS.md` with title/scope, layout, compaction-safe
   rules, verification commands (format in `templates.md`). Add one-line
   pointers `CLAUDE.md` and `GEMINI.md` (`@AGENTS.md`) for runtimes that
   read them — never a second full copy.
3. `log.md`: `## [YYYY-MM-DD] init | Vault initialized (project, <name>)`.
4. **Seed**: ask the user which of the project's documents are the knowledge
   base's starting material → ingest them to `raw/` → compile 2–4 seed pages
   (synthesize, never copy) → update index + log.
5. **Seed verification**: run `check_evidence.py` on the compiled pages —
   zero evidence errors, judged fidelity suspects. Unreferenced raw files
   must be disposed as "no material" in the log or scheduled for ingest.

## 3. Mode B — existing project

1. **Diagnose leftovers** (any present): root `agent.md`, `.agents/AGENTS.md`
   → fold into `AGENTS.md`/`CLAUDE.md`, delete originals after user
   confirmation. `CLAUDE.md`, `.cursor/rules/`, existing `AGENTS.md`,
   `docs/` rule files → read, then merge the still-relevant rules into the
   new schema. Domain skills in `.claude/skills/`, `.agents/skills/` are
   runtime-loaded — keep them; only remove duplicates/obsolete skills after
   user confirmation.
2. Scaffold as §2, but do not overwrite any existing file without user
   confirmation. If an existing wiki-like structure is found, check it
   against the canonical layout and migrate only with approval.
3. Seed from the project's existing documents: ingest the 2–4 most
   knowledge-bearing files first.
4. Report the diagnosis (integrated / deleted / kept) at completion.

## 4. Completion checklist (all modes except C)

- [ ] Layout present; `.gitignore` covers `.obsidian/`, `.sessions/`
- [ ] Schema file ≤ ~40 lines (details live in the skill's references/)
- [ ] SKILL.md ≤ 50 lines
- [ ] Index row count equals actual page count
- [ ] Vault lint: structure, links, orphans + `check_evidence.py` report
      (fidelity suspects judged, evidence errors zero)
- [ ] Mode B: leftover-file report (integrated/deleted/kept)
- [ ] Remind the user to restart the runtime so the new skill is loaded
