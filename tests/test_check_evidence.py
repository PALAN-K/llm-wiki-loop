import sys
import unittest
from pathlib import Path
import tempfile
import shutil

import importlib.util

SCRIPT_PATH = Path(__file__).resolve().parent.parent / "skills" / "wiki-manager" / "scripts" / "check_evidence.py"
spec = importlib.util.spec_from_file_location("check_evidence", SCRIPT_PATH)
check_evidence = importlib.util.module_from_spec(spec)
sys.modules["check_evidence"] = check_evidence
spec.loader.exec_module(check_evidence)


class TestCheckEvidence(unittest.TestCase):
    def test_normalize(self):
        self.assertEqual(check_evidence.normalize("  hello   world \n test "), "hello world test")

    def test_parse_document(self):
        doc_text = (
            "# My Title\n"
            "> Raw: [Note](raw/notes/test.md)\n"
            "> Sources: Test Source\n"
            "\n"
            "This is the body of the article.\n"
        )
        doc = check_evidence.parse_document(doc_text)
        self.assertEqual(doc.title, "# My Title")
        self.assertTrue(any("Raw:" in h for h in doc.header))
        self.assertTrue(any("This is the body" in b for b in doc.body))

    def test_extract_numeric_date_candidates(self):
        line = "Released on 2026-08-15 with version 2.1.80 and 10,000 downloads."
        candidates = check_evidence.extract_numeric_date_candidates(line)
        values = {c.value for c in candidates}
        self.assertIn("2026-08-15", values)
        self.assertIn("2.1.80", values)
        self.assertIn("10,000", values)

    def test_extract_candidates_quotes(self):
        text = (
            "# Test Article\n"
            "> Raw: [Note](raw/notes/test.md)\n"
            "\n"
            'According to the report, "this is a verbatim quotation span" from the source.\n'
        )
        candidates = check_evidence.extract_candidates(text)
        quotes = [c.value for c in candidates if c.kind == "quote"]
        self.assertIn("this is a verbatim quotation span", quotes)

    def test_contains(self):
        haystack = "The project reached 10,000 active users on 2026-08-14."
        cand_number = check_evidence.Candidate("number", "10,000")
        cand_date = check_evidence.Candidate("date", "2026-08-14")
        cand_missing = check_evidence.Candidate("number", "99,999")

        self.assertTrue(check_evidence.contains(haystack, cand_number))
        self.assertTrue(check_evidence.contains(haystack, cand_date))
        self.assertFalse(check_evidence.contains(haystack, cand_missing))

    def test_check_article_e2e(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            raw_dir = root / "raw" / "notes"
            wiki_dir = root / "wiki" / "topics"
            raw_dir.mkdir(parents=True)
            wiki_dir.mkdir(parents=True)

            raw_file = raw_dir / "sample.md"
            raw_file.write_text(
                "# Raw Note\n> Source: Original\n\nThe benchmark score is 99.9% on 2026-08-15.\n",
                encoding="utf-8"
            )

            article_file = wiki_dir / "topic.md"
            article_file.write_text(
                "# Topic Overview\n> Raw: [Note](../../raw/notes/sample.md)\n\nAchieved 99.9% on 2026-08-15.\n",
                encoding="utf-8"
            )

            misses, errors = check_evidence.check_article(article_file, root)
            self.assertEqual(misses, [])
            self.assertEqual(errors, [])

    def test_parse_fingerprint_info(self):
        text = (
            "# App Overview\n"
            "> Raw: [Note](raw/notes/test.md)\n"
            "> Fingerprint: git:5b237fa\n"
            "> Monitored: src/App.tsx, package.json\n"
            "\n"
            "Overview body.\n"
        )
        fp, monitored = check_evidence.parse_fingerprint_info(text)
        self.assertEqual(fp, "git:5b237fa")
        self.assertEqual(monitored, ["src/App.tsx", "package.json"])

    def test_check_code_drift_sha256(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            src_file = root / "src" / "index.js"
            src_file.parent.mkdir(parents=True)
            content_bytes = b"console.log('hello');\n"
            src_file.write_bytes(content_bytes)

            import hashlib
            hasher = hashlib.sha256()
            hasher.update(content_bytes)
            correct_hash = f"sha256:{hasher.hexdigest()}"

            wiki_file = root / "wiki" / "topics" / "overview.md"
            wiki_file.parent.mkdir(parents=True)

            # 1. Fresh case
            drifts = check_evidence.check_code_drift(
                wiki_file, root, correct_hash, ["src/index.js"]
            )
            self.assertEqual(drifts, [])

            # 2. Drift case (file modified)
            drifts_drifted = check_evidence.check_code_drift(
                wiki_file, root, "sha256:0000000000000000000000000000000000000000000000000000000000000000", ["src/index.js"]
            )
            self.assertEqual(len(drifts_drifted), 1)
            self.assertIn("SHA-256 changed", drifts_drifted[0])

    def test_check_code_drift_git(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            import subprocess
            try:
                subprocess.run(["git", "init"], cwd=root, capture_output=True, check=True)
                subprocess.run(["git", "config", "user.name", "Test"], cwd=root, capture_output=True, check=True)
                subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=root, capture_output=True, check=True)
            except Exception:
                # If git is not installed in environment, skip gracefully
                return

            src_file = root / "src" / "App.tsx"
            src_file.parent.mkdir(parents=True)
            src_file.write_text("export const App = () => <div>V1</div>;\n", encoding="utf-8")

            subprocess.run(["git", "add", "."], cwd=root, capture_output=True, check=True)
            subprocess.run(["git", "commit", "-m", "Initial commit"], cwd=root, capture_output=True, check=True)

            rev_res = subprocess.run(["git", "rev-parse", "HEAD"], cwd=root, capture_output=True, text=True, check=True)
            commit_hash = rev_res.stdout.strip()

            wiki_file = root / "wiki" / "topics" / "overview.md"
            wiki_file.parent.mkdir(parents=True)

            # 1. Fresh case
            drifts = check_evidence.check_code_drift(
                wiki_file, root, f"git:{commit_hash}", ["src/App.tsx"]
            )
            self.assertEqual(drifts, [])

            # 2. Modify file (working tree drift) -> Drift case
            src_file.write_text("export const App = () => <div>V2</div>;\n", encoding="utf-8")
            drifts_modified = check_evidence.check_code_drift(
                wiki_file, root, f"git:{commit_hash}", ["src/App.tsx"]
            )
            self.assertEqual(len(drifts_modified), 1)
            self.assertIn("modified since", drifts_modified[0])

            # 3. Commit new changes -> Still drifted from old commit_hash
            subprocess.run(["git", "add", "."], cwd=root, capture_output=True, check=True)
            subprocess.run(["git", "commit", "-m", "Bump to V2"], cwd=root, capture_output=True, check=True)
            drifts_committed = check_evidence.check_code_drift(
                wiki_file, root, f"git:{commit_hash}", ["src/App.tsx"]
            )
            self.assertEqual(len(drifts_committed), 1)

            # 4. Bump fingerprint to new commit -> Fresh again
            rev_res2 = subprocess.run(["git", "rev-parse", "HEAD"], cwd=root, capture_output=True, text=True, check=True)
            commit_hash2 = rev_res2.stdout.strip()
            drifts_bumped = check_evidence.check_code_drift(
                wiki_file, root, f"git:{commit_hash2}", ["src/App.tsx"]
            )
            self.assertEqual(drifts_bumped, [])


if __name__ == "__main__":
    unittest.main()


