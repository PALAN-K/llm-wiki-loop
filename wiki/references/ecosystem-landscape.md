# LLM Wiki Ecosystem Landscape

> Sources: llm-wiki-loop maintainer survey of GitHub (2026-08-14)
> Raw: [Ecosystem survey](../../raw/notes/2026-08-14-ecosystem-survey.md)
> Updated: 2026-08-14
> Triggers: ecosystem, github, stars, competitors, nashsu, nvk, kulaxyz, helicerat

## Overview

As of 2026-08-14, the LLM-wiki ecosystem originates from Karpathy's gist
(published 2026-04-04, 5,000+ stars) and comprises 5.8k repositories. The
ecosystem grows by parallel re-implementation rather than forking: the
largest implementation (nashsu/llm_wiki, 16.3k stars) has 1.9k forks whose
top forks carry only 1 to 2 stars.

## Knowledge-wiki implementations

The largest implementation is nashsu/llm_wiki — a Tauri v2 desktop app with
16.3k stars, GPL-3.0 license, last committed 2026-08-14. Runtime and
plugin approaches include SamurAIGPT/llm-wiki-agent (3.4k stars, MIT) and
nvk/llm-wiki (1.0k stars, MIT). Obsidian variants exist:
kytmanov/obsidian-llm-wiki-local (802 stars) and
jason-effi-lab/karpathy-llm-wiki-vault (686 stars).
Astro-Han/karpathy-llm-wiki ships agent skills (1.9k stars);
swarmclawai/swarmvault (656 stars) adds a knowledge graph and contradiction
detection. helicerat/llm-wiki-loop (created 2026-08) implements claim
verification with per-claim counters.

## Self-improving skill loops

Kulaxyz/self-learning-skills (931 stars, MIT) harvests session procedures
into SKILL.md files but has no knowledge layer. Undertone0809/rudder
(282 stars, Apache-2.0, 4,381 commits) runs an agent-team harness with a
skill promotion loop. withkynam/vibecode-pro-max-kit (1.1k stars) pairs a
spec-based coding harness with self-improving context.

## Distribution channels

Skill-sharing lists dominate curation: hesreallyhim/awesome-claude-code
(52.3k stars), VoltAgent/awesome-agent-skills (30.3k stars),
travisvn/awesome-claude-skills (14.7k stars),
awesome-opencode/awesome-opencode (9.6k stars). Adjacent agent-memory
projects show the demand for persistence: thedotmack/claude-mem
(90.7k stars) and rohitg00/agentmemory (27k stars).

## The gap

No project combines a Karpathy-style knowledge vault with machine
verification of grounding, lifecycle GC with archiving, and auto-skill
promotion. nvk/llm-wiki extracts lessons without the full loop;
Kulaxyz/self-learning-skills runs the loop without a knowledge layer;
helicerat/llm-wiki-loop verifies claims without skills or lifecycle.

## See Also

[LLM Wiki Pattern](../topics/llm-wiki-pattern.md)
