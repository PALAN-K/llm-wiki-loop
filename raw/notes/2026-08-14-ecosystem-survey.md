# LLM Wiki Ecosystem Survey

> Source: GitHub repository search and gist comment threads, via web search
> Collected: 2026-08-14
> Published: 2026-08-14

Survey of the LLM-wiki ecosystem as of 2026-08-14. Star counts and commit
dates are spot values read from GitHub pages on 2026-08-14.

## Origin

The ecosystem originates from Andrej Karpathy's "llm-wiki" gist
(https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f),
published 2026-04-04. The gist itself has 5,000+ stars and 5,000+ forks.
GitHub search for "llm-wiki" returns 5.8k repositories. The ecosystem grows
by parallel re-implementations rather than by forks of one canonical repo:
the largest implementation has 1.9k forks, but its top forks carry only
1 to 2 stars.

## Knowledge-wiki implementations

- nashsu/llm_wiki — 16.3k stars, Tauri v2 desktop app, knowledge graph, MCP
  server. Last commit 2026-08-14. License GPL-3.0.
- SamurAIGPT/llm-wiki-agent — 3.4k stars, multi-runtime agent skill
  (Claude/Codex/OpenCode/Gemini), no API key needed. License MIT.
- nvk/llm-wiki — 1.0k stars, runtime plugin, /wiki:ll lesson extraction.
  License MIT.
- kytmanov/obsidian-llm-wiki-local — 802 stars, Ollama 100% local with
  Obsidian auto-linking.
- jason-effi-lab/karpathy-llm-wiki-vault — 686 stars, Obsidian vault
  configuration.
- swarmclawai/swarmvault — 656 stars, knowledge graph, contradiction
  detection, MCP.
- Astro-Han/karpathy-llm-wiki — 1.9k stars, Agent Skills for Claude
  Code/Cursor/Codex.
- helicerat/llm-wiki-loop — 5 stars, claim-verification loop with per-claim
  counters, MIT, created 2026-08.

## Self-improving skill implementations

- Kulaxyz/self-learning-skills — 931 stars, session procedure harvesting
  into SKILL.md files, MIT.
- Undertone0809/rudder — 282 stars, Apache-2.0, 4,381 commits, agent-team
  harness with a skill promotion loop.
- withkynam/vibecode-pro-max-kit — 1.1k stars, spec-based coding harness
  with self-improving context.

## Skill-sharing lists

- hesreallyhim/awesome-claude-code — 52.3k stars, the de facto curation
  standard.
- VoltAgent/awesome-agent-skills — 30.3k stars, 1,000+ cross-runtime skills.
- travisvn/awesome-claude-skills — 14.7k stars.
- awesome-opencode/awesome-opencode — 9.6k stars.

## Agent memory (adjacent)

- thedotmack/claude-mem — 90.7k stars, session capture with AI compression.
- rohitg00/agentmemory — 27k stars, benchmark-based persistent memory.

## Gap assessment

No project combines (a) a Karpathy-style knowledge vault, (b) machine
verification of grounding, (c) lifecycle GC with archiving, and (d)
auto-skill promotion. The closest partial overlaps: nvk/llm-wiki has lesson
extraction without the full loop; Kulaxyz/self-learning-skills has the loop
without a knowledge layer; helicerat/llm-wiki-loop has claim verification
without skills or lifecycle.
