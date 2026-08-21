#!/usr/bin/env node
// Installs the wiki-manager skill into detected agent runtimes.
// Postinstall-safe: never fails an npm install; prints guidance instead.
//
// Global install (npm i -g): copies into the home skill dirs of detected
// runtimes (Claude Code ~/.claude/skills, opencode ~/.config/opencode/skills,
// Codex CLI ~/.agents/skills).
//
// Project install (npm i in a project): copies into the project's runtime
// skill dirs (.claude/skills, .opencode/skills, .agents/skills,
// .cursor/skills) whose base directory already exists, or falls back to
// .agents/skills (Open Agent standard).

const fs = require("fs");
const os = require("os");
const path = require("path");

const SKILL_SRC = path.join(__dirname, "..", "skills", "wiki-manager");
const HOME = os.homedir();

const GLOBAL_RUNTIMES = [
  { marker: path.join(HOME, ".claude"), dir: path.join(HOME, ".claude", "skills") },
  { marker: path.join(HOME, ".config", "opencode"), dir: path.join(HOME, ".config", "opencode", "skills") },
  { marker: path.join(HOME, ".agents"), dir: path.join(HOME, ".agents", "skills") },
  { marker: path.join(HOME, ".cursor"), dir: path.join(HOME, ".cursor", "skills") },
  { marker: path.join(HOME, ".gemini"), dir: path.join(HOME, ".gemini", "skills") },
  { marker: path.join(HOME, ".commandcode"), dir: path.join(HOME, ".commandcode", "skills") },
  { marker: path.join(HOME, ".windsurf"), dir: path.join(HOME, ".windsurf", "skills") },
];

const PROJECT_RUNTIMES = [".claude", ".opencode", ".agents", ".cursor", ".gemini", ".commandcode", ".windsurf"];

function isTruthy(value) {
  return value === "true" || value === "1";
}

// Windows Node v24 + Korean (non-ASCII) paths: fs.cpSync({recursive:true}) triggers
// STATUS_STACK_BUFFER_OVERRUN (-1073740791) native crash — not catchable via JS try/catch.
// Single primary path: pure JS loop only (fs.lstatSync + Dirent).
function rmRecursiveSync(target) {
  if (!fs.existsSync(target)) return;
  let st;
  try { st = fs.lstatSync(target); } catch { return; }
  if (st.isDirectory() && !st.isSymbolicLink()) {
    let entries = [];
    try { entries = fs.readdirSync(target); } catch { entries = []; }
    for (const e of entries) rmRecursiveSync(path.join(target, e));
    try { fs.rmdirSync(target); } catch {}
  } else {
    try { fs.unlinkSync(target); } catch {}
  }
}

function copyRecursiveSync(src, dest) {
  let st;
  try { st = fs.lstatSync(src); } catch (e) { throw e; }
  if (st.isSymbolicLink()) {
    const linkTarget = fs.readlinkSync(src);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try { fs.unlinkSync(dest); } catch {}
    try {
      fs.symlinkSync(linkTarget, dest, process.platform === "win32" ? "junction" : "file");
    } catch {
      try { fs.copyFileSync(src, dest); } catch {}
    }
    return;
  }
  if (st.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    let entries = [];
    try { entries = fs.readdirSync(src, { withFileTypes: true }); } catch (e) { throw e; }
    for (const d of entries) {
      const s = path.join(src, d.name);
      const t = path.join(dest, d.name);
      if (d.isSymbolicLink()) {
        const linkTarget = fs.readlinkSync(s);
        try { fs.unlinkSync(t); } catch {}
        try {
          fs.symlinkSync(linkTarget, t, process.platform === "win32" ? "junction" : "file");
        } catch {
          try { fs.copyFileSync(s, t); } catch {}
        }
      } else if (d.isDirectory()) {
        copyRecursiveSync(s, t);
      } else {
        fs.mkdirSync(path.dirname(t), { recursive: true });
        fs.copyFileSync(s, t);
      }
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copySkill(destDir) {
  const dest = path.join(destDir, "wiki-manager");
  fs.mkdirSync(destDir, { recursive: true });
  rmRecursiveSync(dest);
  copyRecursiveSync(SKILL_SRC, dest);
  return dest;
}

function findProjectRoot(start) {
  let dir = start;
  while (true) {
    if (fs.existsSync(path.join(dir, "package.json")) || fs.existsSync(path.join(dir, ".git"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function isInsideNodeModules() {
  // Detect if this package is being installed as a dependency inside node_modules
  return __dirname.includes(`${path.sep}node_modules${path.sep}`) || __dirname.includes(`${path.sep}node_modules`);
}

function main() {
  try {
  const installed = [];
  const global = isTruthy(process.env.npm_config_global);
  const customDir = process.env.SKILL_DIR || process.env.CUSTOM_SKILL_DIR;

  if (customDir) {
    try {
      installed.push(copySkill(customDir));
    } catch (error) {
      console.warn(`llm-wiki-loop: could not write custom SKILL_DIR ${customDir}: ${error.message}`);
    }
  }

  if (global) {
    for (const runtime of GLOBAL_RUNTIMES) {
      if (fs.existsSync(runtime.marker)) {
        try {
          installed.push(copySkill(runtime.dir));
        } catch (error) {
          console.warn(`llm-wiki-loop: could not write ${runtime.dir}: ${error.message}`);
        }
      }
    }
  } else {
    const root = findProjectRoot(process.cwd()) || process.cwd();
    let runtimeFound = false;

    for (const name of PROJECT_RUNTIMES) {
      const base = path.join(root, name);
      if (fs.existsSync(base)) {
        runtimeFound = true;
        try {
          installed.push(copySkill(path.join(base, "skills")));
        } catch (error) {
          console.warn(`llm-wiki-loop: could not write ${base}: ${error.message}`);
        }
      }
    }

    if (!runtimeFound && !customDir) {
      // Avoid polluting consumer projects when installed as dependency inside node_modules
      if (isInsideNodeModules()) {
        console.log("llm-wiki-loop: installed as dependency inside node_modules - skipping project fallback skill install.");
        console.log("Run 'npx llm-wiki-loop init' in your project to scaffold vault and install skill.");
      } else {
        try {
          const fallbackDir = path.join(root, ".agents", "skills");
          installed.push(copySkill(fallbackDir));
        } catch (error) {
          console.warn(`llm-wiki-loop: could not write fallback skill ${error.message}`);
        }
      }
    }
  }

  if (installed.length > 0) {
    for (const dest of installed) {
      console.log(`llm-wiki-loop: installed wiki-manager skill into ${dest}`);
    }
    console.log("Restart your agent runtime to load the new skill.");
  } else {
    console.log("llm-wiki-loop: no supported agent runtime detected in this scope.");
    console.log("Copy the skill manually - see https://github.com/PALAN-K/llm-wiki-loop#quickstart");
  }
  } catch (e) {
    // Postinstall must never fail npm install
    console.warn(`llm-wiki-loop: postinstall warning: ${e.message}`);
  }
}

try { main(); } catch (e) { console.warn(`llm-wiki-loop: postinstall warning: ${e.message}`); }
