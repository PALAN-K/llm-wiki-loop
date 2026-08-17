import os
import sys
import unittest
import tempfile
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CLI_PATH = REPO_ROOT / "bin" / "cli.js"


class TestCLIE2E(unittest.TestCase):
    """
    Automated E2E tests for the llm-wiki-loop CLI.
    Tests 1-Click Init, Subdirectory Encapsulation, Fallback Skill Injection,
    and Auto-Discovery.
    """

    def setUp(self):
        self.tmpdir = tempfile.TemporaryDirectory()
        self.sandbox = Path(self.tmpdir.name)

    def tearDown(self):
        self.tmpdir.cleanup()

    def run_cli(self, args, cwd=None):
        cmd = ["node", str(CLI_PATH)] + args
        res = subprocess.run(
            cmd,
            cwd=str(cwd or self.sandbox),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace"
        )
        return res

    def test_init_default_encapsulation_and_skill_install(self):
        """
        Running `init` without arguments in an empty project should:
        1. Scaffold vault in ./llm-wiki-loop
        2. Auto-install wiki-manager skill into .agents/skills (Open Agent fallback)
        """
        res = self.run_cli(["init"])
        self.assertEqual(res.returncode, 0, f"CLI init failed: {res.stderr}")
        self.assertIn("1-Click Setup Complete", res.stdout)

        # 1. Check encapsulated vault files
        vault_dir = self.sandbox / "llm-wiki-loop"
        self.assertTrue(vault_dir.exists())
        self.assertTrue((vault_dir / "raw" / "notes").exists())
        self.assertTrue((vault_dir / "wiki" / "topics").exists())
        self.assertTrue((vault_dir / "index.md").exists())
        self.assertTrue((vault_dir / "log.md").exists())
        self.assertTrue((vault_dir / "AGENTS.md").exists())

        # 2. Check auto-installed agent skill fallback
        skill_file = self.sandbox / ".agents" / "skills" / "wiki-manager" / "SKILL.md"
        self.assertTrue(skill_file.exists(), "Fallback agent skill was not installed!")

    def test_init_root_mode(self):
        """
        Running `init .` or `init --root` should scaffold directly in current dir.
        """
        res = self.run_cli(["init", "."])
        self.assertEqual(res.returncode, 0)
        self.assertTrue((self.sandbox / "raw" / "notes").exists())
        self.assertTrue((self.sandbox / "index.md").exists())
        self.assertFalse((self.sandbox / "llm-wiki-loop").exists())

    def test_init_no_install_flag(self):
        """
        Running `init --no-install` should create vault without installing skills.
        """
        res = self.run_cli(["init", "--no-install"])
        self.assertEqual(res.returncode, 0)
        self.assertTrue((self.sandbox / "llm-wiki-loop" / "index.md").exists())
        self.assertFalse((self.sandbox / ".agents" / "skills").exists())

    def test_doctor_and_check_auto_discovery(self):
        """
        Doctor and check should auto-discover ./llm-wiki-loop when no targetDir is given.
        """
        self.run_cli(["init"])
        
        doc_res = self.run_cli(["doctor"])
        self.assertEqual(doc_res.returncode, 0)
        self.assertIn("Target directory is a conformant LLM-wiki vault", doc_res.stdout)

        chk_res = self.run_cli(["check"])
        self.assertEqual(chk_res.returncode, 0, f"Check failed: {chk_res.stderr}")
        self.assertIn("0 evidence error(s)", chk_res.stdout)

    def test_clean_command(self):
        """
        Clean should safely remove ./llm-wiki-loop.
        """
        self.run_cli(["init"])
        self.assertTrue((self.sandbox / "llm-wiki-loop").exists())

        clean_res = self.run_cli(["clean"])
        self.assertEqual(clean_res.returncode, 0)
        self.assertFalse((self.sandbox / "llm-wiki-loop").exists())

    def test_full_agent_ingest_lifecycle_in_subfolder(self):
        """
        Real End-to-End Simulation:
        1. 1-Click Init in subfolder ./llm-wiki-loop
        2. Ingest source note into ./llm-wiki-loop/raw/notes/
        3. Agent compiles grounded topic into ./llm-wiki-loop/wiki/topics/
        4. Update index.md and log.md
        5. CLI check auto-discovers and passes with 0 errors
        """
        init_res = self.run_cli(["init"])
        self.assertEqual(init_res.returncode, 0)

        vault_dir = self.sandbox / "llm-wiki-loop"

        # 1. Ingest raw note
        raw_note = vault_dir / "raw" / "notes" / "2026-08-17-benchmarks.md"
        raw_note.write_text(
            "# Architecture Benchmark Run\n"
            "> Source: System Metrics Lab\n"
            "> Date: 2026-08-17\n\n"
            "Published on 2026-08-17. The cluster reached 12,400 rps with 3.2ms p99 latency on 8 worker nodes.\n",
            encoding="utf-8"
        )

        # 2. Compile wiki topic with exact verbatim grounding
        wiki_topic = vault_dir / "wiki" / "topics" / "cluster-performance.md"
        wiki_topic.write_text(
            "# Cluster Performance Analysis\n\n"
            "> Raw: [Benchmark Note](../../raw/notes/2026-08-17-benchmarks.md)\n"
            "> Sources: System Metrics Lab\n\n"
            "According to the 2026-08-17 evaluation, the system achieved 12,400 rps with 3.2ms p99 latency across 8 worker nodes.\n",
            encoding="utf-8"
        )

        # 3. Update index.md
        index_file = vault_dir / "index.md"
        index_file.write_text(
            "# Knowledge Vault Index\n\n"
            "## topics\n"
            "- [Cluster Performance Analysis](wiki/topics/cluster-performance.md) — 12,400 rps benchmark (Updated: 2026-08-17)\n",
            encoding="utf-8"
        )

        # 4. Update log.md
        log_file = vault_dir / "log.md"
        log_content = log_file.read_text(encoding="utf-8")
        log_file.write_text(
            log_content +
            "\n## [2026-08-17] ingest | Cluster Performance Analysis\n"
            "- Disposition: New\n"
            "- Raw: raw/notes/2026-08-17-benchmarks.md\n",
            encoding="utf-8"
        )

        # 5. Run verification from root (auto-discovers ./llm-wiki-loop)
        chk_res = self.run_cli(["check"])
        self.assertEqual(chk_res.returncode, 0, f"Check failed: {chk_res.stderr}\nStdout: {chk_res.stdout}")
        self.assertIn("0 evidence error(s)", chk_res.stdout)
        self.assertIn("0 fidelity suspect(s)", chk_res.stdout)


if __name__ == "__main__":
    unittest.main()

