"""Generate a readable bilingual PDF from seed-data.json using Unicode fonts."""
from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

import arabic_reshaper
from bidi.algorithm import get_display
from fpdf import FPDF
from fpdf.enums import XPos, YPos

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "docs" / "seed-data.json"
PDF_OUT = ROOT / "docs" / "aroma-care-categories-and-brands.pdf"
FONTS_DIR = Path(__file__).resolve().parent / "fonts"

FONT_URLS = {
    "NotoSans-Regular.ttf": (
        "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf"
    ),
    "NotoSansArabic-Regular.ttf": (
        "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansArabic/NotoSansArabic-Regular.ttf"
    ),
}

MONO_FONT_CANDIDATES = [
    Path(r"C:\Windows\Fonts\consola.ttf"),
    FONTS_DIR / "DejaVuSansMono.ttf",
]


def resolve_mono_font() -> Path:
    for candidate in MONO_FONT_CANDIDATES:
        if candidate.exists() and candidate.stat().st_size > 10000:
            return candidate
    dest = FONTS_DIR / "DejaVuSansMono.ttf"
    url = "https://github.com/dejavu-fonts/dejavu-fonts/raw/version_2_37/ttf/DejaVuSansMono.ttf"
    print(f"Downloading font: {dest.name}")
    urllib.request.urlretrieve(url, dest)
    return dest


def ensure_fonts() -> None:
    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    for name, url in FONT_URLS.items():
        dest = FONTS_DIR / name
        if dest.exists() and dest.stat().st_size > 10000:
            continue
        print(f"Downloading font: {name}")
        urllib.request.urlretrieve(url, dest)


def shape_ar(text: str) -> str:
    return get_display(arabic_reshaper.reshape(text))


def has_latin(text: str) -> bool:
    return bool(re.search(r"[A-Za-z]", text))


class SeedPDF(FPDF):
    def __init__(self) -> None:
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_auto_page_break(auto=True, margin=18)
        self.set_margins(18, 18, 18)

        ensure_fonts()
        self.add_font("Noto", "", str(FONTS_DIR / "NotoSans-Regular.ttf"))
        self.add_font("Noto", "B", str(FONTS_DIR / "NotoSans-Regular.ttf"))
        self.add_font("Arabic", "", str(FONTS_DIR / "NotoSansArabic-Regular.ttf"))
        self.add_font("Mono", "", str(resolve_mono_font()))

    def _usable_width(self) -> float:
        return self.w - self.l_margin - self.r_margin

    def heading1(self, text: str) -> None:
        self.ln(4)
        self.set_font("Noto", "B", 18)
        self.set_text_color(6, 62, 56)
        self.multi_cell(0, 9, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_draw_color(11, 122, 110)
        self.set_line_width(0.8)
        y = self.get_y()
        self.line(self.l_margin, y, self.w - self.r_margin, y)
        self.ln(6)

    def heading2(self, text: str) -> None:
        if self.get_y() > 250:
            self.add_page()
        self.ln(6)
        self.set_font("Noto", "B", 14)
        self.set_text_color(11, 122, 110)
        self.multi_cell(0, 8, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def heading3(self, text: str) -> None:
        if self.get_y() > 265:
            self.add_page()
        self.ln(4)
        self.set_font("Noto", "B", 12)
        self.set_text_color(6, 62, 56)
        self.multi_cell(0, 7, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def heading4(self, text: str) -> None:
        self.ln(3)
        self.set_font("Noto", "B", 10)
        self.set_text_color(80, 80, 80)
        self.multi_cell(0, 6, text.upper(), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def body_text(self, text: str, size: float = 10) -> None:
        self.set_font("Noto", "", size)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5.5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def note_box(self, text: str) -> None:
        self.set_fill_color(255, 248, 232)
        self.set_font("Noto", "", 9)
        self.set_text_color(60, 60, 60)
        self.multi_cell(0, 5, text, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(3)

    def _draw_block_bg(self, line_count: int, line_h: float) -> tuple[float, float]:
        start_y = self.get_y()
        block_h = line_h * line_count + 8
        if start_y + block_h > 280:
            self.add_page()
            start_y = self.get_y()
        self.set_fill_color(247, 250, 249)
        self.rect(self.l_margin, start_y, self._usable_width(), block_h, style="F")
        return start_y, block_h

    def tree_block_en(self, lines: list[str]) -> None:
        if not lines:
            return
        line_h = 6.5
        start_y, _ = self._draw_block_bg(len(lines), line_h)
        x = self.l_margin + 5
        self.set_xy(x, start_y + 4)
        self.set_font("Mono", "", 10.5)
        self.set_text_color(26, 26, 26)
        w = self._usable_width() - 10

        for line in lines:
            if self.get_y() + line_h > 285:
                self.add_page()
                remaining = len(lines) - lines.index(line)
                start_y, _ = self._draw_block_bg(remaining, line_h)
                self.set_xy(x, start_y + 4)
            self.set_x(x)
            self.cell(w, line_h, line, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(5)

    def tree_block_ar(self, lines: list[str]) -> None:
        if not lines:
            return
        line_h = 7
        start_y, _ = self._draw_block_bg(len(lines), line_h)
        x = self.l_margin + 5
        self.set_xy(x, start_y + 4)
        w = self._usable_width() - 10
        prefix_w = 16

        for line in lines:
            if self.get_y() + line_h > 285:
                self.add_page()
                remaining = len(lines) - lines.index(line)
                start_y, _ = self._draw_block_bg(remaining, line_h)
                self.set_xy(x, start_y + 4)

            if not line:
                self.ln(line_h * 0.5)
                continue

            if has_latin(line) and "(key:" in line:
                self._mixed_ar_line(line, w, line_h)
                continue

            prefix, content = split_tree_line(line)
            if prefix:
                self.set_font("Mono", "", 10.5)
                self.set_text_color(26, 26, 26)
                self.set_x(x)
                self.cell(prefix_w, line_h, prefix, new_x=XPos.RIGHT, new_y=YPos.TOP)
                if has_latin(content):
                    self.write_mixed_ar_content(content, x + prefix_w, w - prefix_w, line_h)
                else:
                    self.set_font("Arabic", "", 11)
                    self.cell(w - prefix_w, line_h, shape_ar(content), align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            else:
                self.set_font("Arabic", "", 11)
                self.set_text_color(26, 26, 26)
                self.set_x(x)
                self.cell(w, line_h, shape_ar(line), align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(5)

    def _text_width(self, text: str, font: str, size: float, arabic: bool = False) -> float:
        self.set_font(font, "", size)
        payload = text if not arabic else shape_ar(text)
        return self.get_string_width(payload)

    def write_mixed_ar_content(self, text: str, x: float, w: float, line_h: float) -> None:
        parts = re.split(r"([A-Za-z0-9][\w\-]*)", text)
        segments: list[tuple[str, float, bool]] = []
        total_w = 0.0
        for part in parts:
            if not part:
                continue
            is_latin = has_latin(part)
            font = "Noto" if is_latin else "Arabic"
            size = 10.5 if is_latin else 11
            seg_w = self._text_width(part, font, size, arabic=not is_latin)
            segments.append((part, seg_w, is_latin))
            total_w += seg_w

        cur_x = x + w - total_w
        y = self.get_y()
        for part, seg_w, is_latin in segments:
            self.set_xy(cur_x, y)
            if is_latin:
                self.set_font("Noto", "", 10.5)
                self.cell(seg_w, line_h, part)
            else:
                self.set_font("Arabic", "", 11)
                self.cell(seg_w, line_h, shape_ar(part))
            cur_x += seg_w
        self.set_xy(x, y + line_h)
    def _mixed_ar_line(self, line: str, w: float, line_h: float) -> None:
        match = re.match(r"^(.+?)(\s*\(key: [^)]+\))$", line)
        if match:
            ar_text, key_suffix = match.groups()
            ar_width = w * 0.62
            key_width = w - ar_width
            self.set_font("Arabic", "", 11)
            self.set_x(self.l_margin + 5)
            self.cell(ar_width, line_h, shape_ar(ar_text), align="R")
            self.set_font("Noto", "", 9.5)
            self.cell(key_width, line_h, key_suffix, align="L", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        else:
            self.write_mixed_ar_content(line, self.l_margin + 5, w, line_h)

    def bullet_list_en(self, items: list[str]) -> None:
        self.set_font("Noto", "", 10.5)
        self.set_text_color(26, 26, 26)
        for item in items:
            if self.get_y() > 275:
                self.add_page()
            self.set_x(self.l_margin + 2)
            self.cell(5, 6.5, "-", new_x=XPos.RIGHT, new_y=YPos.TOP)
            self.multi_cell(self._usable_width() - 8, 6.5, f" {item}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            self.ln(1.5)
        self.ln(2)

    def bullet_list_ar(self, items: list[str]) -> None:
        for item in items:
            if self.get_y() > 275:
                self.add_page()
            if has_latin(item):
                match = re.match(r"^(.+?)(\s*\(key: [^)]+\))$", item)
                if match:
                    ar_text, key_suffix = match.groups()
                    w = self._usable_width() - 4
                    ar_width = w * 0.62
                    key_width = w - ar_width
                    self.set_font("Arabic", "", 11)
                    self.set_x(self.l_margin + 2)
                    self.cell(ar_width, 7, f"- {shape_ar(ar_text)}", align="R")
                    self.set_font("Noto", "", 9.5)
                    self.cell(key_width, 7, key_suffix, align="L", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                else:
                    self.set_font("Noto", "", 10.5)
                    self.set_x(self.l_margin + 2)
                    self.cell(self._usable_width() - 4, 7, f"- {item}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            else:
                self.set_font("Arabic", "", 11)
                self.set_text_color(26, 26, 26)
                self.set_x(self.l_margin + 2)
                shaped = shape_ar(item)
                self.cell(self._usable_width() - 4, 7, f"- {shaped}", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            self.ln(1.5)
        self.ln(2)


def build_tree_lines(parent: str, children: list[str]) -> list[str]:
    lines = [parent]
    for i, child in enumerate(children):
        branch = "└── " if i == len(children) - 1 else "├── "
        lines.append(f"    {branch}{child}")
    return lines


def build_tree_lines_ar(parent: str, children: list[str]) -> list[str]:
    return build_tree_lines(parent, children)


def split_tree_line(line: str) -> tuple[str, str]:
    for prefix in ("    ├── ", "    └── ", "├── ", "└── "):
        if line.startswith(prefix):
            return prefix, line[len(prefix) :]
    return "", line


def build_multi_tree_lines(trees: list[dict], lang: str) -> list[str]:
    lines: list[str] = []
    builder = build_tree_lines_ar if lang == "ar" else build_tree_lines
    for idx, tree in enumerate(trees):
        if idx > 0:
            lines.append("")
        lines.extend(builder(tree["parent"], tree.get("children", [])))
    return lines


def main() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    pdf = SeedPDF()
    pdf.add_page()

    meta = data["meta"]
    pdf.heading1("Aroma Care Website Prototype")
    pdf.body_text(
        "Categories & Brands Reference — extracted from Website-prototype/src/App.tsx\n"
        f"Generated: {meta['generated']} · Purpose: backend database seeding",
        size=10,
    )
    pdf.body_text(
        f"Shop mega-menu hierarchies: {meta['shopHierarchyCount']}  |  "
        f"English brands: {meta['englishBrandCount']}  |  "
        f"Arabic brands in source: {meta['arabicBrandCount']}",
        size=9.5,
    )

    pdf.heading2("Categories")

    for section in data["categorySections"]:
        pdf.heading3(section["title"])

        if section["type"] == "trees":
            pdf.heading4("English")
            pdf.tree_block_en(build_multi_tree_lines(section["english"], "en"))
            pdf.heading4("Arabic")
            pdf.tree_block_ar(build_multi_tree_lines(section["arabic"], "ar"))
        elif section["type"] == "single":
            pdf.heading4("English")
            pdf.tree_block_en([section["english"]])
            pdf.heading4("Arabic")
            pdf.tree_block_ar([section["arabic"]])
        else:
            pdf.heading4("English")
            pdf.bullet_list_en(section["english"])
            pdf.heading4("Arabic")
            pdf.bullet_list_ar(section["arabic"])

    pdf.add_page()
    pdf.heading2("Brands")

    pdf.heading3("English Brands")
    pdf.body_text(
        "Sources: MEGA_BRANDS, TOP_BRANDS, product brand fields (PRODUCTS, CREAM_RX_PRODUCTS). "
        "Duplicates removed; names preserved exactly as in source.",
        size=9.5,
    )
    pdf.bullet_list_en(data["englishBrands"])

    pdf.heading3("Arabic Brands")
    pdf.note_box(
        "Arabic brand names appear only where explicitly present in the project source "
        "(banner subtitles and Arabic product name transliterations). "
        "Brands without Arabic representations in the prototype are listed only in the English section."
    )
    pdf.bullet_list_ar(data["arabicBrands"])

    pdf.heading2("Source Constants Reference")
    pdf.bullet_list_en(data["sources"])

    pdf.ln(4)
    pdf.set_font("Noto", "", 8)
    pdf.set_text_color(120, 120, 120)
    pdf.multi_cell(
        0,
        4.5,
        "Aroma Care KW · Website Prototype Data Export · "
        "All category and brand names preserved verbatim from source files.",
        new_x=XPos.LMARGIN,
        new_y=YPos.NEXT,
    )

    pdf.output(str(PDF_OUT))
    print(f"PDF written: {PDF_OUT}")


if __name__ == "__main__":
    main()
