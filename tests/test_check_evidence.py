import sys
import unittest
from pathlib import Path
import tempfile
import shutil

# Add skills/wiki-manager/scripts to sys.path
SCRIPT_DIR = Path(__file__).resolve().parent.parent / "skills" / "wiki-manager" / "scripts"
sys.path.insert(0, str(SCRIPT_DIR))

import check_evidence


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


if __name__ == "__main__":
    unittest.main()
