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

<p align="center">
  <b>🌏 Read in:</b> <a href="README.md">🇺🇸 English</a> • <a href="README.ja.md">🇯🇵 日本語</a> • <a href="README.ko.md">🇰🇷 한국어</a> &nbsp;|&nbsp; <b>🌐 Live Demo:</b> <a href="https://palan-k.github.io/llm-wiki-loop/">EN</a> • <a href="https://palan-k.github.io/llm-wiki-loop/ja/">JA</a> • <a href="https://palan-k.github.io/llm-wiki-loop/ko/">KO</a> &nbsp;|&nbsp; <i>Zero-DB • 100% Markdown • 7 Agents • 25 Tests • v1.3.2</i>
</p>

```bash
# ⚡ 1-Second Setup: Zero DB/daemons, 100% pure Markdown 3-layer vault + 7-Agent skill injection
npx llm-wiki-loop init
```

<p align="center">
  <img src="docs/assets/impact-hero.gif" alt="Impact hero — npx llm-wiki-loop init → check --strict → scan:skills in 22s (860×484, 1.0MB MP4 / 273KB GIF)" width="860" />
  <br><em>↑ One take — $ npx llm-wiki-loop init (0.8s, 7 agents) → $ check --strict (0 errors, 0 drifted) → $ scan:skills (1 candidate) — 22s, 860×484</em>
</p>

---

### ⚡ Why Ordinary AI Notes Fail vs. `llm-wiki-loop`

| ❌ Ordinary AI Notes / Karpathy Wiki | ✅ `llm-wiki-loop` Architecture |
| :--- | :--- |
| **Silent Hallucinations**: AI subtly fabricates numbers & quotes over time | **0-Token Machine Grounding**: `check_evidence.py` mechanically matches 100% of facts against immutable `raw/` sources |
| **Expensive Code Drift**: Re-reading codebase every session burns $$$ tokens | **Universal Fingerprint**: `git diff` checks monitored code in 0.01s without LLM tokens |
| **Knowledge Silos**: Fixes stay as text; agent repeats the same errors | **Auto-Skillification**: Frequent fixes (2+) automatically evolve into permanent `.agents/skills` |
| **Framework Bloat**: Heavy databases, complex server setups | **Zero-Dependency Simplicity**: 100% pure Markdown (`raw/`, `wiki/`, `archive/`) |

<p align="center">
  <img src="docs/assets/wheel-lifecycle.svg" alt="4-Stage Self-Improving Loop — Raw → Grounded Compile → Mechanical Check → GC & Skillify" width="860" />
  <br><em>4-Stage Self-Improving Loop — 1 sec ingest → 0-token verify → event GC & 2× skillify (proposal-first)</em>
</p>

---

## 💡 What is llm-wiki-loop?

**llm-wiki-loop** transforms volatile AI outputs into an **immutable, self-organizing second brain**. 

Most LLM notes gradually hallucinate, cite outdated assumptions, or bloat over time. **llm-wiki-loop** fixes this at the architectural layer:
- 🛡️ **0-Hallucination Machine Grounding**: Every number, date, and quote in `wiki/` is mechanically verified against immutable `raw/` sources using `check_evidence.py` (now with `--strict`/`--strict-all` 2-tier).
- 🔍 **0-Token Code Drift Detection**: Wiki articles track source code implementations with **Universal Fingerprints** (`Fingerprint: git:<hash>` & per-file `sha256:<hex>`), saving 99% of token context costs on session startup.
- ♻️ **Self-Organizing Vault**: Outdated facts are automatically tagged `Status: Outdated` or `Status: Disputed` and archived—never deleted, preserving complete historical fidelity.
- ⚡ **Auto-Skillify Evolution**: Repeated solutions and error fixes (2+ times) logged in `log.md` are automatically promoted into reusable agent skills. New `npm run scan:skills` reports candidates with zero overhead.
- 🌏 **Global & Accessible Showcase**: EN/JA/KO live demos (`/ja/` `/ko/`) with `hreflang` sitemap, keyboard-navigable wheel and `prefers-reduced-motion` support.
- 🎯 **Zero Friction for Beginners**: One command (`npx llm-wiki-loop init`) instantly equips **Claude Code, Cursor, Codex, OpenCode, Gemini, Windsurf, and CommandCode** with structured knowledge.

---

## 🧬 Self-Organizing Architecture & Lifecycle

<p align="center">
  <img src="docs/assets/hero-lifecycle.gif" alt="4-Stage Self-Improving Loop — 4.5s motion: Raw → Grounded Compile → Mechanical Check → GC & Skillify" width="860" />
  <br><em>Lifecycle in 4.5s — cards slide, code types, drift flashes (Remotion 860×220, 293KB MP4 / 376KB GIF)</em>
  <br><a href="https://palan-k.github.io/llm-wiki-loop"><img src="https://img.shields.io/badge/%F0%9F%8C%90_Live_Demo-Interactive_Wheel-00f2fe?style=for-the-badge" alt="Live Interactive Wheel Demo" /></a>
</p>

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

## 🎬 Feature Demos — Text + GIF 1:1

<p align="center">
  <img src="docs/assets/commit-gate.gif" alt="Commit gate — git commit → check_evidence 0 errors, index/log updated together" width="860" /><br>
  <b>A. Commit Gate</b><br><sub>git commit → <code>check_evidence 0 errors</code> → <code>index.md+log.md</code> together (local nudge, CI gate)</sub>
</p>

<p align="center">
  <img src="docs/assets/drift-detection.gif" alt="Drift detection — 0.01s git diff → Status Outdated" width="860" /><br>
  <b>B. Drift Detection</b><br><sub>edit <code>bin/cli.js</code> → <code>git diff</code> 0.01s → <code>Status: Outdated</code> bump</sub>
</p>

<p align="center">
  <img src="docs/assets/skill-evolution.gif" alt="Skill evolution — 2× log repeat → scan:skills → .agents/skills" width="860" /><br>
  <b>C. Skill Evolution</b><br><sub><code>log.md</code> 2× repeat → <code>scan:skills</code> emphasized → <code>.agents/skills/</code></sub>
</p>

<p align="center">
  <img src="docs/assets/multi-agent.gif" alt="Multi-agent — 7 agents 1-click stamp" width="860" /><br>
  <b>D. Multi-Agent</b><br><sub><code>npx llm-wiki-loop init</code> → 7 agents stamped in 1s</sub>
</p>

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

## 🚀 Quickstart: True 1-Click Agent Setup

Run **just one command** in your project terminal:

```bash
npx llm-wiki-loop init
```

### ⚡ What Happens in that 1 Second?
1. 📂 **Capsules Knowledge Vault**: Scaffolds a complete 3-layer vault in `./llm-wiki-loop/` (`raw/`, `wiki/`, `archive/`, `index.md`, `log.md`, `AGENTS.md`) without polluting your project root.
2. 🏛️ **Non-Destructive Constitution Linking**: Automatically links the vault protocol to your project's root `AGENTS.md` without overwriting existing project rules.
3. 🤖 **Equips All AI Agents**: Automatically detects and injects the `wiki-manager` skill into **Claude Code, Cursor, Codex, Gemini, OpenCode, Windsurf, and CommandCode** (or defaults to `.agents/skills/`).
4. 🛡️ **Zero Token Waste & Zero Config**: Grounding invariants, 0-token git drift detection, and auto-skillification are active immediately.

---

### 💡 Daily Workflow (Prompt Your AI Agent)

After running `npx llm-wiki-loop init`, simply prompt your AI agent inside your IDE / CLI:

```text
Prompt to Agent:
"I dropped a paper in raw/notes/2026-08-17-analysis.md. Ingest it into wiki/topics/ and verify grounding."
```

Your AI agent uses the installed `wiki-manager` skill to automatically triage, compile with exact verbatim provenance, and update `index.md` & `log.md`.

---

## 🛠️ CLI Commands & Tooling

The built-in CLI (`npx llm-wiki-loop` or `llm-wiki`) works cross-platform (Windows, macOS, Linux):

```
Usage:
  npx llm-wiki-loop <command> [options]
  llm-wiki <command> [options]

Commands:
  init [dir]          ✨ 1-Click setup: Scaffold vault & auto-install agent skill
                      (default: ./llm-wiki-loop. Pass '.' or --root for current project root)
  check [vaultDir]    🛡️ Run mechanical evidence verification (0-hallucination check)
                      [--strict: fail on errors/drift, --strict-all: also fail on suspects]
  doctor [vaultDir]   🩺 Diagnose Python environment, detected AI agent runtimes & vault schema
  install [options]   🤖 Manually inject/update wiki-manager skill into agent runtimes
  clean [dir]         🧹 Safely remove scaffolded vault files & unlinks constitution anchors
  version             🏷️ Print current package version
  help                ❓ Show help screen

Options for 'init':
  . or --root         Scaffold directly in the current working directory (for vault-only standalone repos)
  --no-install        Skip automatic agent skill installation (vault-only)
  --vault-only        Alias for --no-install

Options for 'install':
  --global, -g        Install to global user home directories (~/.claude, ~/.agents, etc.)
  --custom <path>     Install to a custom skill directory

Extras (npm scripts):
  npm run scan:skills  🔍 Report skill candidates from log.md (2+ repeats, 0 overhead)
  npm run sync:version 🔄 Sync package.json version → docs badges + sitemap (prepack)
```

---

## 📂 Vault Structure & Responsibilities

llm-wiki-loop supports both **embedded mode** (inside existing apps) and **standalone mode** (dedicated knowledge repo):

### Mode 1: Embedded Vault (Recommended for Existing Projects)
```
<your-project>/
├── AGENTS.md                      # [LINKED] Project constitution (auto-linked with Vault Protocol)
├── .agents/skills/wiki-manager/   # [AGENT SKILL] Codex / Antigravity / Gemini runtime skill
├── .claude/skills/wiki-manager/   # [AGENT SKILL] Claude Code runtime skill
├── llm-wiki-loop/                 # [ISOLATED VAULT] Cleanly separated knowledge vault
│   ├── raw/                       # [IMMUTABLE] Sources: notes/, data/, assets/ (Never edited by LLM)
│   ├── wiki/                      # [LLM-OWNED] Compiled knowledge: concepts/, topics/, references/
│   ├── archive/                   # [SUPERSEDED] Historical snapshots (never cascade-updated)
│   ├── index.md                   # [CATALOG] Exactly 1 line per active wiki page (progressive disclosure)
│   ├── log.md                     # [AUDIT LEDGER] Append-only event log (## [YYYY-MM-DD] op | ...)
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
