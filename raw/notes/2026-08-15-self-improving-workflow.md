# Self-Improving Loop Operational Notes

> Source: PALAN-K / llm-wiki-loop operational guidelines
> Collected: 2026-08-15

The self-improving loop in llm-wiki-loop converts session experience into persistent agent capabilities without manual configuration.

## Key Workflow Rules

1. **Auto-skillifying trigger**: When the same error or procedure is repeated 2 times within a single session, the agent proposes promoting it into a reusable skill.
2. **Human approval invariant**: Auto-skillifying and archiving require explicit human approval before any write.
3. **Obsidian Integration**: Obsidian attachment folder path should be set to `raw/assets/` to keep clipped media inside the immutable source layer.
4. **Verification Frequency**: Machine verification via `check_evidence.py` is executed after every wiki compilation pass.
5. **Obsolescence**: Fully superseded pages move to `archive/` and maintain point-in-time snapshots, never deleted.
