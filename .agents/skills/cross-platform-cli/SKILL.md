---
name: cross-platform-cli
description: Node.js CLI patterns for hybrid Node + Python tools, cross-platform python resolution, fail-safe postinstall, and agent runtime skill installation.
---

# Cross-Platform CLI & Python Interop Standards

## 1. Python Runtime Resolution Pattern
In cross-platform Node.js applications that invoke Python subprocesses, runtime executables differ across operating systems:
- Windows: `py`, `python`, `python3`
- Linux / macOS: `python3`, `python`

### Node.js Implementation Snippet
```javascript
const { spawnSync } = require('child_process');

function resolvePython() {
  const candidates = process.platform === 'win32'
    ? ['py', 'python', 'python3']
    : ['python3', 'python'];

  for (const cmd of candidates) {
    try {
      const res = spawnSync(cmd, ['--version'], { stdio: 'pipe', encoding: 'utf-8' });
      if (res.status === 0) {
        return { cmd, version: (res.stdout || res.stderr).trim() };
      }
    } catch {
      // ignore ENOENT and continue
    }
  }
  return null;
}
```

## 2. Fail-Safe Postinstall
Postinstall lifecycle scripts (`npm install`) must NEVER crash the parent installation:
- Always wrap in `try/catch`.
- On error, log warning/guidance with remediation steps (`npx llm-wiki doctor`).
- Always exit with code 0.

## 3. Supported Agent Runtimes
Detect and manage target skill directories:
- Claude Code: `~/.claude/skills` / `.claude/skills`
- OpenCode: `~/.config/opencode/skills` / `.opencode/skills`
- Codex / Agents: `~/.agents/skills` / `.agents/skills`
- Cursor: `~/.cursor/skills` / `.cursor/skills`
- Gemini: `~/.gemini/skills` / `.gemini/skills`
- CommandCode: `~/.commandcode/skills` / `.commandcode/skills`
- Windsurf: `~/.windsurf/skills` / `.windsurf/skills`
