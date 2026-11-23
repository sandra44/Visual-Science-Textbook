import json
import argparse
import os
import re
import fitz

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_PATH = os.path.join(ROOT, "Science Textbook.pdf")
OUT_DIR = os.path.join(ROOT, "public", "data")
os.makedirs(OUT_DIR, exist_ok=True)

CHAPTERS = [
    {"number": 1, "title": "Exploration: Entering the World of Secondary Science", "category": "Foundations", "pdfStart": 266, "pdfEnd": 272},
    {"number": 2, "title": "Cell: The Building Block of Life", "category": "Biology", "pdfStart": 246, "pdfEnd": 265},
    {"number": 3, "title": "Tissues in Action", "category": "Biology", "pdfStart": 226, "pdfEnd": 245},
    {"number": 4, "title": "Describing Motion Around Us", "category": "Physics", "pdfStart": 202, "pdfEnd": 225},
    {"number": 5, "title": "Exploring Mixtures and their Separation", "category": "Chemistry", "pdfStart": 180, "pdfEnd": 201},
    {"number": 6, "title": "How Forces Affect Motion", "category": "Physics", "pdfStart": 158, "pdfEnd": 179},
    {"number": 7, "title": "Work, Energy, and Simple Machines", "category": "Physics", "pdfStart": 134, "pdfEnd": 157},
    {"number": 8, "title": "Journey Inside the Atom", "category": "Chemistry", "pdfStart": 112, "pdfEnd": 133},
    {"number": 9, "title": "Atomic Foundations of Matter", "category": "Chemistry", "pdfStart": 90, "pdfEnd": 111},
    {"number": 10, "title": "Sound Waves: Characteristics and Applications", "category": "Physics", "pdfStart": 66, "pdfEnd": 89},
    {"number": 11, "title": "Reproduction: How Life Continues", "category": "Biology", "pdfStart": 46, "pdfEnd": 65},
    {"number": 12, "title": "Patterns in Life: Diversity and Classification", "category": "Biology", "pdfStart": 22, "pdfEnd": 45},
    {"number": 13, "title": "Earth as a System: Energy, Matter, and Life", "category": "Earth Science", "pdfStart": 1, "pdfEnd": 21},
]

CURATED_TOPIC_MAP = {
    1: "scientific-inquiry",
    2: "cell-explorer",
    3: "tissues-joints",
    4: "motion-graphs",
    5: "mixtures-lab",
    6: "forces-newton",
    7: "work-energy",
    8: "bohr-atom",
    9: "bohr-atom",
    10: "sound-waves",
    11: "reproduction-life",
    12: "biodiversity-tree",
    13: "earth-system",
}


def main():
    parser = argparse.ArgumentParser(description="Build the local reader index. With no arguments use the original Grade 9 book profile.")
    parser.add_argument("--chapters", help="JSON array of chapters, in reading order, with inclusive PDF page ranges")
    args = parser.parse_args()
    doc = fitz.open(PDF_PATH)
    if args.chapters:
        with open(args.chapters, encoding="utf-8-sig") as source:
            chapters = json.load(source)
        mapping = {c["number"]: c.get("curatedSimId") for c in chapters}
    else:
        chapters, mapping = CHAPTERS, CURATED_TOPIC_MAP
    numbers = [c["number"] for c in chapters]
    if len(numbers) != len(set(numbers)) or not chapters:
        parser.error("Chapter numbers must be unique and at least one chapter is required.")
    for c in chapters:
        if not 1 <= c["pdfStart"] <= c["pdfEnd"] <= len(doc):
            parser.error(f"Invalid PDF page range for chapter {c['number']}. Check --chapters.")
    covered = [n for c in chapters for n in range(c["pdfStart"], c["pdfEnd"] + 1)]
    if sorted(covered) != list(range(1, len(doc)+1)):
        parser.error("Chapter ranges must cover each physical PDF page exactly once.")
    chapters_out = []
    pages_out = {}
    ordered_pages = []
    book_page_counter = 1

    for ch in chapters:
        ch_num = ch["number"]
        topics = []
        seen_topic_keys = set()
        ch_book_start = book_page_counter

        for pdf_page in range(ch["pdfStart"], ch["pdfEnd"] + 1):
            page = doc[pdf_page - 1]
            rect = page.rect
            text = page.get_text("text")
            pages_out[str(pdf_page)] = {
                "pdfPage": pdf_page,
                "bookPage": book_page_counter,
                "chapterNumber": ch_num,
                "chapterTitle": ch["title"],
                "text": text[:4000],
            }

            page_topics = []
            data = page.get_text("dict")
            for block in data.get("blocks", []):
                if block.get("type") != 0:
                    continue
                for line in block.get("lines", []):
                    line_text = "".join(span.get("text", "") for span in line.get("spans", [])).strip()
                    if not line_text:
                        continue

                    m_sec = re.match(rf"^({ch_num}\.\d+(?:\.\d+)?)\s+(.+)$", line_text)
                    m_act = re.match(rf"^(Activity\s+{ch_num}\.\d+)\s*[:\-]?\s*(.*)$", line_text, re.I)

                    topic_num = None
                    topic_title = None
                    kind = "section"

                    if m_sec:
                        topic_num = m_sec.group(1)
                        topic_title = m_sec.group(2).strip()
                        if len(topic_title) < 3 or re.match(r"^[\d.,\s/%]+$", topic_title):
                            continue
                    elif m_act:
                        topic_num = m_act.group(1)
                        topic_title = m_act.group(2).strip() or topic_num
                        kind = "activity"

                    if topic_num and topic_num not in seen_topic_keys:
                        seen_topic_keys.add(topic_num)
                        bx0, by0, bx1, by1 = line["bbox"]
                        bbox = [
                            round(bx0 / rect.width, 4),
                            round(by0 / rect.height, 4),
                            round((bx1 - bx0) / rect.width, 4),
                            round((by1 - by0) / rect.height, 4),
                        ]
                        t_obj = {
                            "id": f"ch{ch_num}-{topic_num.lower().replace(' ', '-')}",
                            "number": topic_num,
                            "title": topic_title[:90],
                            "kind": kind,
                            "pdfPage": pdf_page,
                            "bookPage": book_page_counter,
                            "bbox": bbox,
                            "curatedSimId": mapping.get(ch_num),
                        }
                        topics.append(t_obj)
                        page_topics.append(t_obj)

            ordered_pages.append({
                "bookPage": book_page_counter,
                "pdfPage": pdf_page,
                "chapterNumber": ch_num,
                "chapterTitle": ch["title"],
                "topics": page_topics,
            })
            book_page_counter += 1

        chapters_out.append({
            "number": ch_num,
            "title": ch["title"],
            "category": ch["category"],
            "pdfStart": ch["pdfStart"],
            "pdfEnd": ch["pdfEnd"],
            "bookStart": ch_book_start,
            "bookEnd": book_page_counter - 1,
            "curatedSimId": mapping.get(ch_num),
            "topics": topics,
        })

    index_payload = {
        "totalPages": len(ordered_pages),
        "chapters": chapters_out,
        "orderedPages": ordered_pages,
    }

    with open(os.path.join(OUT_DIR, "textbook-index.json"), "w", encoding="utf-8") as f:
        json.dump(index_payload, f, ensure_ascii=False, indent=2)

    with open(os.path.join(OUT_DIR, "textbook-pages.json"), "w", encoding="utf-8") as f:
        json.dump(pages_out, f, ensure_ascii=False)

    print(f"Indexed {len(chapters_out)} chapters, {len(ordered_pages)} pages, {sum(len(c['topics']) for c in chapters_out)} topics.")


if __name__ == "__main__":
    main()
