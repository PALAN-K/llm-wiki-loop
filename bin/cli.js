#!/usr/bin/env node

/**
 * llm-wiki-loop CLI
 * The production framework for self-improving & self-organizing LLM knowledge vaults.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const PKG = require('../package.json');
const SKILL_SRC = path.join(__dirname, '..', 'skills', 'wiki-manager');
const CHECK_SCRIPT = path.join(SKILL_SRC, 'scripts', 'check_evidence.py');
const HOME = os.homedir();

const GLOBAL_RUNTIMES = [
  { name: 'Claude Code', marker: path.join(HOME, '.claude'), dir: path.join(HOME, '.claude', 'skills') },
  { name: 'OpenCode', marker: path.join(HOME, '.config', 'opencode'), dir: path.join(HOME, '.config', 'opencode', 'skills') },
  { name: 'Agents / Codex', marker: path.join(HOME, '.agents'), dir: path.join(HOME, '.agents', 'skills') },
  { name: 'Cursor', marker: path.join(HOME, '.cursor'), dir: path.join(HOME, '.cursor', 'skills') },
  { name: 'Gemini', marker: path.join(HOME, '.gemini'), dir: path.join(HOME, '.gemini', 'skills') },
  { name: 'CommandCode', marker: path.join(HOME, '.commandcode'), dir: path.join(HOME, '.commandcode', 'skills') },
  { name: 'Windsurf', marker: path.join(HOME, '.windsurf'), dir: path.join(HOME, '.windsurf', 'skills') },
];

const PROJECT_RUNTIMES = [
  { name: 'Claude Code', folder: '.claude' },
  { name: 'OpenCode', folder: '.opencode' },
  { name: 'Agents / Codex', folder: '.agents' },
  { name: 'Cursor', folder: '.cursor' },
  { name: 'Gemini', folder: '.gemini' },
  { name: 'CommandCode', folder: '.commandcode' },
  { name: 'Windsurf', folder: '.windsurf' },
];

function resolvePython() {
  const candidates = process.platform === 'win32'
    ? ['py', 'python', 'python3']
    : ['python3', 'python'];

  for (const cmd of candidates) {
    try {
      const res = spawnSync(cmd, ['--version'], { stdio: 'pipe', encoding: 'utf-8' });
      if (res.status === 0) {
        const ver = (res.stdout || res.stderr || '').trim();
        return { cmd, version: ver };
      }
    } catch {
      // ignore ENOENT
    }
  }
  return null;
}

function copySkill(destDir) {
  const dest = path.join(destDir, 'wiki-manager');
  fs.mkdirSync(destDir, { recursive: true });
  fs.cpSync(SKILL_SRC, dest, { recursive: true, force: true });
  return dest;
}

function findProjectRoot(start) {
  let dir = start;
  while (true) {
    if (fs.existsSync(path.join(dir, 'package.json')) || fs.existsSync(path.join(dir, '.git'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function printHelp() {
  console.log(`
llm-wiki-loop v${PKG.version}
The reference architecture for LLM-maintained knowledge vaults.

Usage:
  llm-wiki <command> [options]
  npx llm-wiki-loop <command> [options]

Commands:
  init [dir]          1-Click setup: Scaffold vault & auto-install agent skill
                      (default: ./llm-wiki-loop. Pass '.' or --root for current dir)
  check [vaultDir]    Run machine verification on grounding invariants
  doctor [vaultDir]   Diagnose local environment, Python runtime, and agent skills
  install [options]   Install wiki-manager skill into detected agent runtimes
  clean [dir]         Clean/uninstall scaffolded vault files safely
  version, --version  Print version information
  help, --help        Show this help message

Options for 'init':
  . or --root         Scaffold directly in the current working directory
  --no-install        Skip automatic agent skill installation
  --vault-only        Alias for --no-install

Options for 'install':
  --global, -g        Install globally to detected user home runtimes (~/)
  --custom <path>     Install to a custom skill directory
`);
}

function runDoctor(targetDir) {
  console.log(`=== llm-wiki Doctor (v${PKG.version}) ===\n`);

  // 1. Python Check
  const py = resolvePython();
  if (py) {
    console.log(`[✓] Python Runtime: Detected (${py.cmd} -> ${py.version})`);
  } else {
    console.log(`[✗] Python Runtime: NOT found in PATH.`);
    console.log(`    Evidence checks require Python 3.8+. Please install from https://python.org`);
  }

  // 2. Global Agent Runtimes
  console.log(`\n--- Global Agent Runtimes (~/) ---`);
  let globalFound = 0;
  for (const r of GLOBAL_RUNTIMES) {
    const exists = fs.existsSync(r.marker);
    const skillInstalled = fs.existsSync(path.join(r.dir, 'wiki-manager', 'SKILL.md'));
    if (exists) {
      globalFound++;
      console.log(`[✓] ${r.name.padEnd(16)}: Found (${r.marker}) | Skill: ${skillInstalled ? 'Installed' : 'Not installed'}`);
    }
  }
  if (globalFound === 0) {
    console.log(`[-] No global agent directories found.`);
  }

  // 3. Project Runtimes
  const root = findProjectRoot(process.cwd());
  console.log(`\n--- Current Project Scope (${root || process.cwd()}) ---`);
  if (root) {
    let projectFound = 0;
    for (const r of PROJECT_RUNTIMES) {
      const base = path.join(root, r.folder);
      if (fs.existsSync(base)) {
        projectFound++;
        const skillInstalled = fs.existsSync(path.join(base, 'skills', 'wiki-manager', 'SKILL.md'));
        console.log(`[✓] ${r.name.padEnd(16)}: Found (${base}) | Skill: ${skillInstalled ? 'Installed' : 'Not installed'}`);
      }
    }
    if (projectFound === 0) {
      console.log(`[-] No project agent folders (.claude, .agents, .cursor, etc.) found.`);
    }
  }

  // 4. Vault Structure Check
  let vaultDir = targetDir ? path.resolve(targetDir) : process.cwd();
  if (!targetDir && !fs.existsSync(path.join(vaultDir, 'index.md')) && fs.existsSync(path.join(vaultDir, 'llm-wiki-loop', 'index.md'))) {
    vaultDir = path.join(vaultDir, 'llm-wiki-loop');
  }

  console.log(`\n--- Local Vault Schema Check (${vaultDir}) ---`);
  const requiredPaths = ['raw', 'wiki', 'archive', 'index.md', 'log.md', 'AGENTS.md'];
  let vaultValid = true;
  for (const p of requiredPaths) {
    const fullPath = path.join(vaultDir, p);
    if (fs.existsSync(fullPath)) {
      console.log(`[✓] ${p}`);
    } else {
      console.log(`[!] ${p} (missing)`);
      vaultValid = false;
    }
  }
  if (vaultValid) {
    console.log(`\n[✓] Target directory is a conformant LLM-wiki vault.`);
  } else {
    console.log(`\n[i] Run 'npx llm-wiki-loop init' to scaffold a conformant vault.`);
  }
}

function runCheck(targetDir) {
  let vaultPath = targetDir ? path.resolve(targetDir) : process.cwd();
  if (!targetDir && !fs.existsSync(path.join(vaultPath, 'index.md')) && fs.existsSync(path.join(vaultPath, 'llm-wiki-loop', 'index.md'))) {
    vaultPath = path.join(vaultPath, 'llm-wiki-loop');
  }

  const py = resolvePython();
  if (!py) {
    console.error(`Error: Python runtime not found. Python 3.8+ is required to run verification.`);
    process.exit(1);
  }

  console.log(`Checking vault at: ${vaultPath}`);
  console.log(`Using Python executable: ${py.cmd} (${py.version})\n`);

  const res = spawnSync(py.cmd, [CHECK_SCRIPT, vaultPath], { stdio: 'inherit' });
  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
}

function runInstall(args = [], options = {}) {
  const isGlobal = args.includes('--global') || args.includes('-g');
  const customIdx = args.indexOf('--custom');
  const customDir = customIdx !== -1 && args[customIdx + 1] ? args[customIdx + 1] : process.env.SKILL_DIR;

  const installed = [];

  if (customDir) {
    try {
      installed.push(copySkill(customDir));
    } catch (err) {
      if (!options.silent) console.warn(`Could not install to custom dir ${customDir}: ${err.message}`);
    }
  }

  if (isGlobal) {
    for (const r of GLOBAL_RUNTIMES) {
      if (fs.existsSync(r.marker)) {
        try {
          installed.push(copySkill(r.dir));
        } catch (err) {
          if (!options.silent) console.warn(`Could not install to ${r.dir}: ${err.message}`);
        }
      }
    }
  } else {
    const root = findProjectRoot(process.cwd()) || process.cwd();
    let runtimeFound = false;

    for (const r of PROJECT_RUNTIMES) {
      const base = path.join(root, r.folder);
      if (fs.existsSync(base)) {
        runtimeFound = true;
        try {
          installed.push(copySkill(path.join(base, 'skills')));
        } catch (err) {
          if (!options.silent) console.warn(`Could not install to ${base}: ${err.message}`);
        }
      }
    }

    // Standard Fallback: If no runtime folders exist, install into .agents/skills (Open Agent standard)
    if (!runtimeFound && !customDir) {
      try {
        const fallbackDir = path.join(root, '.agents', 'skills');
        installed.push(copySkill(fallbackDir));
      } catch (err) {
        if (!options.silent) console.warn(`Could not install fallback skill: ${err.message}`);
      }
    }
  }

  if (!options.silent) {
    if (installed.length > 0) {
      console.log(`\n[✓] Successfully installed wiki-manager skill to:`);
      for (const dest of installed) {
        console.log(`    - ${dest}`);
      }
      console.log(`    Restart your agent runtime to activate.`);
    } else {
      console.log(`No supported agent runtime found. Use --global or specify --custom <path>.`);
    }
  }

  return installed;
}

function runInit(rawArgs = []) {
  const args = Array.isArray(rawArgs) ? rawArgs : [rawArgs].filter(Boolean);
  const skipInstall = args.includes('--no-install') || args.includes('--vault-only');
  const isRoot = args.includes('--root') || args.includes('.');

  let targetPath = null;
  for (const arg of args) {
    if (arg && !arg.startsWith('--') && arg !== '.') {
      targetPath = arg;
      break;
    }
  }

  let root;
  if (targetPath) {
    root = path.resolve(targetPath);
  } else if (isRoot) {
    root = process.cwd();
  } else {
    // Default 1-Click encapsulation in ./llm-wiki-loop
    root = path.resolve(process.cwd(), 'llm-wiki-loop');
  }

  console.log(`\n=== 🚀 Initializing llm-wiki-loop (v${PKG.version}) ===`);
  console.log(`Scaffolding knowledge vault at: ${root}\n`);

  const dirs = [
    'raw/notes',
    'raw/data',
    'raw/assets',
    'wiki/concepts',
    'wiki/topics',
    'wiki/references',
    'archive',
  ];

  for (const d of dirs) {
    const full = path.join(root, d);
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true });
      console.log(`[+] Created: ${d}/`);
    }
  }

  const indexFile = path.join(root, 'index.md');
  if (!fs.existsSync(indexFile)) {
    fs.writeFileSync(indexFile, `# Knowledge Vault Index\n\n- (no pages compiled yet)\n`, 'utf-8');
    console.log(`[+] Created: index.md`);
  }

  const logFile = path.join(root, 'log.md');
  if (!fs.existsSync(logFile)) {
    const today = new Date().toISOString().split('T')[0];
    fs.writeFileSync(logFile, `# Vault Audit Log\n\n## [${today}] init | Vault initialized via llm-wiki-loop CLI\n`, 'utf-8');
    console.log(`[+] Created: log.md`);
  }

  const agentsFile = path.join(root, 'AGENTS.md');
  if (!fs.existsSync(agentsFile)) {
    let content = `# AGENTS.md — Knowledge Vault Constitution\n\n`;
    const sourceAgents = path.join(__dirname, '..', 'AGENTS.md');
    if (fs.existsSync(sourceAgents)) {
      content = fs.readFileSync(sourceAgents, 'utf-8');
    }
    fs.writeFileSync(agentsFile, content, 'utf-8');
    console.log(`[+] Created: AGENTS.md`);
  }

  // 1-Click Auto-install Agent Skill
  let installedSkills = [];
  if (!skipInstall) {
    console.log(`\n--- Equipping AI Agent Skills ---`);
    installedSkills = runInstall([], { silent: false });
  }

  console.log(`\n✨ [✓] 1-Click Setup Complete!`);
  console.log(`📖 Vault Location : ${root}`);
  if (installedSkills.length > 0) {
    console.log(`🤖 Agent Skill   : Equipped and ready to compile knowledge.`);
  }
  console.log(`\n👉 Next Steps:`);
  console.log(`   1. Place source notes/papers/logs into '${path.relative(process.cwd(), path.join(root, 'raw', 'notes')) || 'raw/notes'}'`);
  console.log(`   2. Prompt your AI Agent: "Compile a new wiki topic from raw/notes with grounding invariant"`);
  console.log(`   3. Verify integrity anytime with: 'npx llm-wiki-loop check'\n`);
}

function runClean(rawArgs = []) {
  const args = Array.isArray(rawArgs) ? rawArgs : [rawArgs].filter(Boolean);
  let targetPath = null;
  for (const arg of args) {
    if (arg && !arg.startsWith('--')) {
      targetPath = arg;
      break;
    }
  }

  let root;
  if (targetPath) {
    root = path.resolve(targetPath);
  } else if (fs.existsSync(path.resolve(process.cwd(), 'llm-wiki-loop'))) {
    root = path.resolve(process.cwd(), 'llm-wiki-loop');
  } else {
    root = process.cwd();
  }

  console.log(`Cleaning LLM-wiki vault files in: ${root}\n`);

  // If cleaning the encapsulated subdirectory itself and it only has vault items
  if (path.basename(root) === 'llm-wiki-loop' && fs.existsSync(root)) {
    fs.rmSync(root, { recursive: true, force: true });
    console.log(`[✓] Removed encapsulated vault directory: ${root}`);
    return;
  }

  const itemsToRemove = [
    'raw',
    'wiki',
    'archive',
    'index.md',
    'log.md',
    'agent.md',
    'AGENTS.md'
  ];

  let count = 0;
  for (const item of itemsToRemove) {
    const target = path.join(root, item);
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true });
      console.log(`Removed: ${item}`);
      count++;
    }
  }

  if (count > 0) {
    console.log(`\nClean completed! ${count} vault items removed.`);
  } else {
    console.log(`No vault items found in ${root}.`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === 'version' || command === '--version' || command === '-v') {
    console.log(`llm-wiki-loop v${PKG.version}`);
    return;
  }

  switch (command) {
    case 'doctor':
      runDoctor(args[1]);
      break;
    case 'check':
      runCheck(args[1]);
      break;
    case 'install':
      runInstall(args.slice(1));
      break;
    case 'init':
      runInit(args.slice(1));
      break;
    case 'clean':
      runClean(args.slice(1));
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main();