import os
import sys
import unittest
import tempfile
from pathlib import Path
import subprocess

SCRIPT_DIR = Path(__file__).resolve().parent.parent / "skills" / "wiki-manager" / "scripts"
sys.path.insert(0, str(SCRIPT_DIR))

import check_evidence


class TestVaultLifecycleE2E(unittest.TestCase):
    """
    End-to-End simulation of the LLM-wiki self-improving lifecycle in an isolated sandbox.
    """

    def setUp(self):
        self.tmpdir = tempfile.TemporaryDirectory()
        self.root = Path(self.tmpdir.name)
        (self.root / "raw" / "notes").mkdir(parents=True)
        (self.root / "wiki" / "topics").mkdir(parents=True)
        (self.root / "wiki" / "concepts").mkdir(parents=True)
        (self.root / "archive").mkdir(parents=True)

    def tearDown(self):
        self.tmpdir.cleanup()

    def test_lifecycle_grounding_success(self):
        """
        Valid lifecycle: Raw note with verified numbers & dates -> Wiki article referencing note verbatim.
        Must produce 0 errors and 0 misses.
        """
        raw_note = self.root / "raw" / "notes" / "2026-08-16-eval-result.md"
        raw_note.write_text(
            "# Model Evaluation Note\n"
            "> Source: Internal Benchmark\n\n"
            "Published on 2026-08-16. Benchmark score reached 94.8% on dataset v2.4 with 1,250 samples.\n"
            'Lead researcher confirmed: "The inference loop converged in 12 iterations."\n',
            encoding="utf-8"
        )

        wiki_topic = self.root / "wiki" / "topics" / "eval-benchmark.md"
        wiki_topic.write_text(
            "# Evaluation Benchmark Analysis\n"
            "> Raw: [Note](../../raw/notes/2026-08-16-eval-result.md)\n"
            "> Sources: Internal Benchmark\n\n"
            "According to the 2026-08-16 run on dataset v2.4, accuracy reached 94.8% over 1,250 samples.\n"
            'The report noted that "The inference loop converged in 12 iterations."\n',
            encoding="utf-8"
        )

        misses, errors = check_evidence.check_article(wiki_topic, self.root)
        self.assertEqual(errors, [], f"Expected 0 errors, got: {errors}")
        self.assertEqual(misses, [], f"Expected 0 fidelity suspects, got: {misses}")

    def test_lifecycle_hallucination_detection(self):
        """
        Failure scenario: Wiki article contains ungrounded/hallucinated numbers not present in Raw.
        Must detect fidelity suspect/miss.
        """
        raw_note = self.root / "raw" / "notes" / "2026-08-16-ground-truth.md"
        raw_note.write_text(
            "# Ground Truth\n"
            "> Source: Monitoring Team\n\n"
            "Server latency is 15.0ms under 1,000 concurrent connections.\n",
            encoding="utf-8"
        )

        wiki_topic = self.root / "wiki" / "topics" / "hallucinated-topic.md"
        wiki_topic.write_text(
            "# System Performance\n"
            "> Raw: [Ground Truth](../../raw/notes/2026-08-16-ground-truth.md)\n"
            "> Sources: Monitoring Team\n\n"
            "Server latency reached 99.9% under 50,000 concurrent connections.\n",
            encoding="utf-8"
        )

        misses, errors = check_evidence.check_article(wiki_topic, self.root)
        self.assertEqual(errors, [])
        self.assertTrue(len(misses) > 0, "Expected fidelity suspects for ungrounded numbers 99.9% or 50,000")
        self.assertIn("99.9%", misses)
        self.assertIn("50,000", misses)

    def test_lifecycle_missing_raw_header(self):
        """
        Failure scenario: A wiki page without a Raw: header violates the Grounding Invariant.
        Must be caught as an evidence error.
        """
        wiki_topic = self.root / "wiki" / "topics" / "orphaned-page.md"
        wiki_topic.write_text(
            "# Orphaned Topic\n\n"
            "This article has no Raw: provenance header.\n",
            encoding="utf-8"
        )

        misses, errors = check_evidence.check_article(wiki_topic, self.root)
        self.assertTrue(any("no Raw field" in e for e in errors))

    def test_cli_init_scaffolding(self):
        """
        Test Node CLI 'init' command scaffolds conformant directory structure.
        """
        cli_js = Path(__file__).resolve().parent.parent / "bin" / "cli.js"
        target = self.root / "new-vault"
        
        res = subprocess.run(["node", str(cli_js), "init", str(target)], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0)
        
        self.assertTrue((target / "raw" / "notes").exists())
        self.assertTrue((target / "wiki" / "concepts").exists())
        self.assertTrue((target / "archive").exists())
        self.assertTrue((target / "index.md").exists())
        self.assertTrue((target / "log.md").exists())
        self.assertTrue((target / "AGENTS.md").exists())


if __name__ == "__main__":
    unittest.main()
