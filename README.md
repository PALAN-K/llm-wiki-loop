# llm-wiki-loop

<p align="center">
  <a href="https://github.com/PALAN-K/llm-wiki-loop/actions/workflows/ci.yml"><img src="https://github.com/PALAN-K/llm-wiki-loop/actions/workflows/ci.yml/badge.svg" alt="CI Status" /></a>
  <a href="https://www.npmjs.com/package/llm-wiki-loop"><img src="https://img.shields.io/npm/v/llm-wiki-loop.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/llm-wiki-loop"><img src="https://img.shields.io/npm/dw/llm-wiki-loop.svg" alt="npm downloads" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
  <a href="https://agentskills.io"><img src="https://img.shields.io/badge/standard-open%20agent%20skills-brightgreen.svg" alt="Open Agent Skills" /></a>
</p>

<p align="center">
  <b>The Production Framework for Self-Improving & Self-Organizing LLM Knowledge Vaults.</b><br>
  <i>Grounding Invariants • Event-Driven GC • Auto-Skillification • Multi-Agent 1-Click Injection</i>
</p>

<p align="center">
  <a href="https://palan-k.github.io/llm-wiki-loop">
    <img src="https://img.shields.io/badge/%F0%9F%8C%90_Live_Showcase-Interactive_Wheel_Demo-00f2fe?style=for-the-badge&logoColor=black" alt="Live Interactive Showcase" />
  </a>
</p>

---

## 💡 What is llm-wiki-loop?

**llm-wiki-loop** transforms volatile AI outputs into an **immutable, self-organizing second brain**. 

Most LLM notes gradually hallucinate, cite outdated assumptions, or bloat over time. **llm-wiki-loop** fixes this at the architectural layer:
- 🛡️ **0-Hallucination Machine Grounding**: Every number, date, and quote in `wiki/` is mechanically verified against immutable `raw/` sources using `check_evidence.py`.
- 🔍 **0-Token Code Drift Detection**: Wiki articles track source code implementations with **Universal Fingerprints** (`Fingerprint: git:<hash>` & `Monitored: <paths>`), saving 99% of token context costs on session startup.
- ♻️ **Self-Organizing Vault**: Outdated facts are automatically tagged `Status: Outdated` or `Status: Disputed` and archived—never deleted, preserving complete historical fidelity.
- ⚡ **Auto-Skillify Evolution**: Repeated solutions and error fixes (2+ times) logged in `log.md` are automatically promoted into reusable agent skills.
- 🎯 **Zero Friction for Beginners**: One command (`npx llm-wiki-loop init`) instantly equips **Claude Code, Cursor, Codex, OpenCode, Gemini, Windsurf, and CommandCode** with structured knowledge.

---

## 🧬 Self-Organizing Architecture & Lifecycle

```mermaid
flowchart TD
    subgraph S1["1. Immutable Ingestion"]
        Raw["raw/notes/ & raw/data/
(Original benchmark runs, papers, chat logs)"]
    end

    subgraph S2["2. Grounded Compilation Loop"]
        Agent["AI Agent + wiki-manager Skill
(Claude / Cursor / Codex / Gemini)"]
        Wiki["wiki/concepts/ & wiki/topics/
(LLM-synthesized knowledge with Raw: links & Fingerprints)"]
        Index["index.md & log.md
(Progressive disclosure & audit trail)"]
    end

    subgraph S3["3. Mechanical Verification Engine"]
        Engine["check_evidence.py
(Grounding Invariant & Drift Engine)"]
        Verdict{"0 Errors & Fresh?"}
        Pass["✅ 100% Grounded & Code Synced"]
        Fail["❌ Ungrounded Claim / Code Drift Detected"]
    end

    subgraph S4["4. Self-Evolution & Active GC"]
        Dispute["Status: Outdated / Disputed
(Preserve historical context)"]
        Archive["archive/
(Superseded snapshots, isolated from index)"]
        Skillify["Auto-Skillification Engine
(Promote repeated procedures into SKILL.md)"]
    end

    Raw -->|Triage: New / Update / Disputed| Agent
    Agent -->|Write with exact Raw: links & Fingerprint| Wiki
    Agent -->|Append state transitions| Index
    Wiki -->|Verify literals & monitored paths| Engine
    Raw -->|Match against source body| Engine
    Engine --> Verdict
    Verdict -->|Yes| Pass
    Verdict -->|No| Fail
    Wiki -->|Contradicted or code drifted| Dispute
    Dispute -->|Event-driven GC| Archive
    Index -->|Detect 2+ recurring patterns| Skillify
    Skillify -->|Human approves| Agent
```

---

## 🔥 Key Pillars: Why It's Built Differently

| Capability | Ordinary AI Notes / RAG | **llm-wiki-loop** |
|---|---|---|
| **Grounding** | Probabilistic, hallucination-prone | **Mechanically verified**: numbers & quotes must match raw sources verbatim |
| **Code Freshness** | Blindly re-reads code files every session ($$$ tokens) | **0-Token Universal Fingerprint**: `git diff` detects drift in 0.01s without token waste |
| **History & Truth** | Silently overwrites or deletes | **Status blocks + archive/**: immutable truth with evolutionary audit logs |
| **Vault Organization** | Manual curation / bloat | **Event-based GC**: self-organizing progressive disclosure (`index.md`) |
| **Agent Portability** | Vendor lock-in (single IDE) | **Universal Adapter**: 1-click install across 7+ AI agent runtimes |
| **Self-Evolution** | Static prompts | **Auto-skillifying**: frequent workflows evolve into automated agent skills |

---

## ⚡ Universal Fingerprint & 0-Token Code Drift Detection

When connecting your LLM knowledge vault to an active software engineering repository, keeping wiki articles synchronized with source code changes is paramount:

```markdown
# Authentication Architecture Overview
> Raw: [raw/notes/auth-v1.md](raw/notes/auth-v1.md)
> Fingerprint: git:5b237fa
> Monitored: src/auth/jwt.ts, src/auth/session.ts, package.json
```

1. **Intuitive**: Human-readable markdown header clearly stating the baseline Git commit and monitored files.
2. **Ultra-lightweight (Zero-Config)**: 0 extra databases, 0 daemons. Fully leverages standard Git version control.
3. **Token & Compute Efficient**: AI does not waste tens of thousands of tokens re-reading intact codebases. `npx llm-wiki check .` immediately identifies drifted articles in milliseconds.


---

## 🚀 Quickstart (1-Minute Setup)

### Option A: Direct Execution via NPX (No Installation Needed)
```bash
# 1. Scaffold vault in your project (isolated in ./llm-wiki-loop or target dir)
npx llm-wiki-loop init

# 2. Inject wiki-manager skill into all installed AI agent runtimes
npx llm-wiki-loop install

# 3. Check local environment & detect installed AI agent runtimes
npx llm-wiki-loop doctor

# 4. Verify grounding invariants across your vault
npx llm-wiki-loop check .
```

### Option B: Global Installation (Auto-injects to AI Runtimes)
```bash
npm install -g llm-wiki-loop
```

Once installed, simply prompt your favorite AI agent in the repository:
```
set up my vault for <your domain>
```

---

## 🛠️ CLI Commands & Tooling

The built-in CLI (`llm-wiki` / `llm-wiki-loop`) provides an intuitive developer experience across all operating systems (Windows, macOS, Linux):

```
Usage: llm-wiki <command> [options]

Commands:
  doctor [vaultDir]   Diagnose Python runtime, agent skill directories, and vault schema
  check [vaultDir]    Run mechanical evidence verification (0-hallucination check)
  init [dir]          Scaffold standard vault structure (default: ./llm-wiki-loop or target dir)
  clean [dir]         Clean/uninstall scaffolded vault files safely (rollback)
  install [options]   Inject wiki-manager skill into detected agent runtimes
  version             Print version
  help                Show help screen

Options for 'install':
  --global, -g        Install to global user home directories (~/.claude, ~/.agents, etc.)
  --custom <path>     Install to a custom skill directory
```

---

## 📂 Vault Structure & Responsibilities

llm-wiki-loop supports both **embedded mode** (inside existing apps) and **standalone mode** (dedicated knowledge repo):

### Mode 1: Embedded Vault (Recommended for Existing Projects)
```
<your-project>/
├── .agents/skills/wiki-manager/   # [AGENT SKILL] Codex / Antigravity / Gemini runtime skill
├── .claude/skills/wiki-manager/   # [AGENT SKILL] Claude Code runtime skill
├── llm-wiki-loop/                 # [ISOLATED VAULT] Cleanly separated knowledge vault
│   ├── raw/                       # [IMMUTABLE] Sources: notes/, data/, assets/ (Never edited by LLM)
│   ├── wiki/                      # [LLM-OWNED] Compiled knowledge: concepts/, topics/, references/
│   ├── archive/                   # [SUPERSEDED] Historical snapshots (never cascade-updated)
│   ├── index.md                   # [MAP] Exactly 1 line per active wiki page (progressive disclosure)
│   ├── log.md                     # [AUDIT] Append-only event log (## [YYYY-MM-DD] op | ...)
│   └── AGENTS.md                  # [CONSTITUTION] Vault rules & grounding invariants (< 50 lines)
├── src/                           # Your existing application code
└── package.json
```

### Mode 2: Standalone Knowledge Vault
```
<knowledge-vault>/
├── raw/                           # [IMMUTABLE] Sources: notes/, data/, assets/ (Never edited by LLM)
├── wiki/                          # [LLM-OWNED] Compiled knowledge: concepts/, topics/, references/
├── archive/                       # [SUPERSEDED] Historical snapshots (never cascade-updated)
├── index.md                       # [MAP] Exactly 1 line per active wiki page (progressive disclosure)
├── log.md                         # [AUDIT] Append-only event log (## [YYYY-MM-DD] op | ...)
└── AGENTS.md                      # [CONSTITUTION] Vault rules & grounding invariants (< 50 lines)
```

---

### The 6 Core Vault Operations

Every conformant agent strictly adheres to the 6 vault lifecycle operations:

| Operation | Purpose | Lifecycle Flow |
|---|---|---|
| `init` | **Bootstrap**: Scaffolds layout, installs agent skills, establishes schema, and sets up index/log. | CLI / Agent $\rightarrow$ Scaffold $\rightarrow$ Schema verification |
| `ingest` | **Knowledge Absorption**: Raw sources $\rightarrow$ 4-tier triage $\rightarrow$ Compiled knowledge with verbatim `Raw:` links. | `raw/` $\rightarrow$ Triage (New / Update / Disputed) $\rightarrow$ `wiki/` $\rightarrow$ Sync `index.md` & `log.md` |
| `query` | **Progressive Disclosure**: High-precision answer retrieval with minimal token consumption. | Read `index.md` (L1) $\rightarrow$ Targeted `wiki/` page read (L2) $\rightarrow$ Synthesize with citations |
| `lint` | **3-Tier Health Check**: Structural formatting, mechanical evidence verification, and judgment review. | Schema check $\rightarrow$ `check_evidence.py` $\rightarrow$ Fix ungrounded claims |
| `loop` | **Self-Evolution & GC**: Event-driven garbage collection and auto-skillification of repeated solutions. | Detect outdated facts $\rightarrow$ Move to `archive/` $\rightarrow$ Detect 2+ recurring patterns $\rightarrow$ Promote to `SKILL.md` |
| `audit` | **Skill Coverage Audit**: Evaluates existing skills against official docs and execution logs. | Log inspection $\rightarrow$ Gap analysis $\rightarrow$ Skill refinement |

---

## 🧠 Seamless Integration with Obsidian & AI IDEs

Because **llm-wiki-loop** relies exclusively on plain Markdown, it fits naturally into existing workflows:
- **Obsidian**: Open the repository or `llm-wiki-loop/` folder directly. Configure `raw/assets/` as the attachment folder for screenshots and research papers.
- **Cursor & Windsurf**: Rules and skills reside in `.cursor/skills/` or `.windsurf/skills/`, instantly empowering the in-editor agent.
- **Claude Code, Codex & Gemini**: Uses standard `.claude/skills/` and `.agents/skills/` distribution for zero-setup command line execution.

---

## 🤝 Contributing & Community

We welcome contributions from the open-source community! 
- Check out [CONTRIBUTING.md](CONTRIBUTING.md) for local testing instructions, multi-runtime adapter guides, and architecture specifications.
- Read [SPEC.md](SPEC.md) for the formal normative specification of the LLM-wiki standard.

---

## 📄 License & Acknowledgments

- **License**: [MIT](LICENSE)
- **Conceptual Grounding**: The LLM-Wiki pattern (immutable raw sources, LLM-compiled wiki, grounding loop) originated from [Andrej Karpathy's gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) (2026-04-04).
- `check_evidence.py` is adapted from [Astro-Han/karpathy-llm-wiki](https://github.com/Astro-Han/karpathy-llm-wiki) (MIT).
