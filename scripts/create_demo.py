"""Create an original, redistributable two-page reader fixture in a fresh clone."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile

import fitz

root = Path(__file__).resolve().parents[1]
pdf = root / "Science Textbook.pdf"
if pdf.exists() or any((root / "public" / "data").glob("textbook-*.json")):
    sys.exit("Demo setup requires a fresh clone; it will not overwrite a local textbook or index.")

with fitz.open() as doc:
    for heading, body in [
        ("2.2 Structure of a Cell", "Watch a genetic message travel from the nucleus to a ribosome."),
        ("Activity 2.2: Compare potato pieces", "Compare water movement in potato pieces in fresh and salty water."),
    ]:
        page = doc.new_page()
        page.insert_text((55, 80), "Science | Reader demonstration", fontsize=20)
        page.insert_text((55, 145), heading, fontsize=16)
        page.insert_textbox(fitz.Rect(55, 170, 480, 240), body, fontsize=13)
    doc.save(pdf)
with tempfile.TemporaryDirectory() as folder:
    profile = Path(folder) / "chapters.json"
    profile.write_text(json.dumps([dict(number=2, title="Cells", category="Biology", pdfStart=1,
                                        pdfEnd=2, curatedSimId="cell-explorer")]), encoding="utf8")
    subprocess.run([sys.executable, str(root / "scripts/index_textbook.py"), "--chapters", str(profile)], check=True)
