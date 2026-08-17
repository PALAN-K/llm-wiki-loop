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

function copySkill(destDir) {
  const dest = path.join(destDir, "wiki-manager");
  fs.mkdirSync(destDir, { recursive: true });
  fs.cpSync(SKILL_SRC, dest, { recursive: true, force: true });
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

function main() {
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
      try {
        const fallbackDir = path.join(root, ".agents", "skills");
        installed.push(copySkill(fallbackDir));
      } catch (error) {
        console.warn(`llm-wiki-loop: could not write fallback skill ${error.message}`);
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
}

main();
