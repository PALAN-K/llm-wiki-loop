# Incident — Windows Non-ASCII Path Native Crash (fs.cpSync)

> Source: Field report from consumer project 집꾸미다견적솔루션
> Collected: 2026-08-21
> Published: 2026-08-21
> Node: v24.11.0
> OS: Windows

On 2026-08-21, installation of llm-wiki-loop@1.3.1 failed during `postinstall` (`scripts/install.js`) and `bin/cli.js:78` `copySkill` on Windows Node v24.11.0 when the project path contained Korean characters (집꾸미다견적솔루션).

The failing call was `fs.cpSync(SKILL_SRC, dest, { recursive: true, force: true })` and `fs.rmSync(dest, { recursive: true, force: true })`. The process terminated with `STATUS_STACK_BUFFER_OVERRUN` and exit code -1073740791. The crash occurred at the native libuv layer and was not catchable via JavaScript `try/catch`. `llm-wiki doctor` passed (only `fs.existsSync` checks), while `llm-wiki install` crashed. Manual PowerShell `Copy-Item -Recurse -Force` succeeded, and a pure-JS loop using `fs.copyFileSync` per file also succeeded, confirming the bug is isolated to the recursive native implementation.

The fix replaces all recursive `fs.cpSync`/`fs.rmSync` usage with a single primary path: a pure-JS recursive loop using `fs.lstatSync` and `fs.readdirSync({ withFileTypes: true })` `Dirent` (`isDirectory()`, `isSymbolicLink()`) plus `fs.copyFileSync` per file and `fs.mkdirSync`/`fs.unlinkSync`/`fs.rmdirSync`. This avoids the native stack buffer overrun and correctly handles symlinks (previous `fs.statSync` made `isSymbolicLink()` always false). The skill payload is 7 files (SKILL.md, 4 references, check_evidence.py, __pycache__ excluded), total package size 48.2 kB, unpacked size 157.5 kB, total files 18 in tarball — per-file overhead is negligible (<10ms).

Affected files: `bin/cli.js`, `scripts/install.js`, `scripts/sync-version.js`. Verification: `npm run lint` exit 0, `npm test` 25 tests passing, `npm pack --dry-run` 18 files, isolated Korean path `집꾸미다견적솔루션-테스트` `init`/`install`/`clean` all exit 0 with 7 files copied and content-equal, CI matrix should include Node 24.x and Korean-path E2E in future.

Framework version at time of incident: 1.3.1. Fixed version: 1.3.2.
