# AGENTS.md — llm-wiki-loop vault schema (canonical)

Reference architecture for LLM-maintained vaults (SPEC.md). CLAUDE.md/GEMINI.md point here.

## Layout (fixed)
raw/ (immutable) | wiki/ (LLM-owned) | archive/ (superseded) | index.md | log.md | SPEC.md | skills/wiki-manager/

## Rules that survive context compaction
1. **Grounding Invariant.** Every number, date, quotation must appear verbatim in `Raw:` files.
2. **Universal Fingerprint.** Code-bound pages declare `Fingerprint: git:<hash>` & `Monitored: <paths>`. On drift, inspect diff only, update page, and bump hash.
3. **Triage before compile.** Every ingest = New / Update / Disputed / No material (log only).
4. **Status blocks.** Superseded claims get `Status: Outdated` or `Status: Disputed`. Never delete history.
5. **Index + log on every write.** No exceptions (templates in skills/wiki-manager/references/templates.md).
6. **Never edit raw/.** Never write skills into wiki/ (skills live in runtime skills dir).
7. **Proposal-first loop.** Auto-skillifying & archiving require human approval before write.

## Verification
`python3 skills/wiki-manager/scripts/check_evidence.py .` (Windows: `py`). Zero errors required.

## Domain notes (this vault)
- Documents LLM-wiki ecosystem & design decisions. Sources ingested to raw/notes/ first.
- Keep pages grounded in raw. SPEC.md is normative, not raw evidence for ecosystem claims.
- English throughout (OSS project).


<!-- [llm-wiki-loop:anchor:start] -->
## 🏛️ LLM Wiki Protocol
- Knowledge Vault: `C:/Users/jayeo/AppData/Local/Temp/tmpqtrlq5ef/new-vault/` (Catalog: `C:/Users/jayeo/AppData/Local/Temp/tmpqtrlq5ef/new-vault/index.md`)
- Audit Ledger: On any wiki change, append to `C:/Users/jayeo/AppData/Local/Temp/tmpqtrlq5ef/new-vault/log.md`
- Detailed Constitution: See `C:/Users/jayeo/AppData/Local/Temp/tmpqtrlq5ef/new-vault/AGENTS.md`
<!-- [llm-wiki-loop:anchor:end] -->
