# Self-Improving Loop Guide

> Raw: [Self-Improving Workflow Notes](../../raw/notes/2026-08-15-self-improving-workflow.md)
> Updated: 2026-08-15

The self-improving loop manages procedure harvesting and event-driven vault invalidation within the llm-wiki-loop reference architecture.

## Procedure Harvesting & Auto-Skillifying

When the same error or procedure is repeated 2 times within a single session, the agent proposes promoting it into a reusable skill. The promotion is proposal-first and requires human approval before writing to runtime skill directories.

## Vault Hygiene & Obsidian Integration

- For Obsidian users, setting the attachment folder path to `raw/assets/` ensures clipped media lands in the immutable source layer.
- Fully superseded pages move to `archive/` as point-in-time snapshots and are removed from the active index.
