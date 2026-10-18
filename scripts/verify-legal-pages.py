#!/usr/bin/env python3
"""Confirm terms.html and privacy.html match the markdown sources.

Comparison is independent of the renderer. Visible text is extracted from
the markdown with a small block parser, and from each page's
`<div class="legal-inner">` with the stdlib HTML parser.

The only allowed difference is the owner-authorized substitution
https://www.holy365.app -> https://get-dova.com
(which also rewrites /terms and /privacy on that origin).
admin@holy365.app, com.holy365.app, "holy365 Pro", and other Holy365
mentions must stay as they are in the source.
"""

from __future__ import annotations

import difflib
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OLD_ORIGIN = "https://www.holy365.app"
NEW_ORIGIN = "https://get-dova.com"

PAGES = (
    ("Terms and Conditions", ROOT / "legal" / "terms-and-conditions.md", ROOT / "terms.html"),
    ("Privacy Policy", ROOT / "legal" / "privacy-policy.md", ROOT / "privacy.html"),
)

LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
STRONG_RE = re.compile(r"\*\*([^*]+)\*\*")
CODE_RE = re.compile(r"`([^`]+)`")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+)$")
HEALING_RE = re.compile(r"healing", re.IGNORECASE)

CHECKED_FILES = (
    ROOT / "index.html",
    ROOT / "terms.html",
    ROOT / "privacy.html",
    ROOT / "styles.css",
    ROOT / "legal" / "terms-and-conditions.md",
    ROOT / "legal" / "privacy-policy.md",
)


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def strip_inline(text: str) -> str:
    without_links = LINK_RE.sub(lambda match: match.group(1), text)
    without_code = CODE_RE.sub(lambda match: match.group(1), without_links)
    return without_code.replace("**", "")


def blocks_from_markdown(source: str) -> list[str]:
    """Visible text blocks in source order: headings, paragraphs, list items."""
    blocks: list[str] = []
    paragraph: list[str] = []

    def flush_paragraph() -> None:
        if not paragraph:
            return
        blocks.append(normalize(" ".join(strip_inline(line) for line in paragraph)))
        paragraph.clear()

    for raw_line in source.splitlines():
        line = raw_line.strip()
        if not line:
            flush_paragraph()
            continue
        heading = HEADING_RE.match(line)
        if heading:
            flush_paragraph()
            blocks.append(normalize(strip_inline(heading.group(2))))
            continue
        if line.startswith("- "):
            flush_paragraph()
            blocks.append(normalize(strip_inline(line[2:])))
            continue
        paragraph.append(line)
    flush_paragraph()
    return [block for block in blocks if block]


class LegalTextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.blocks: list[str] = []
        self.links: list[tuple[str, str]] = []
        self._in_legal = False
        self._depth = 0
        self._capture: str | None = None
        self._buf: list[str] = []
        self._href: str | None = None
        self._link_buf: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = {key: value or "" for key, value in attrs}
        classes = attr.get("class", "").split()
        if tag == "div" and "legal-inner" in classes:
            self._in_legal = True
            self._depth = 1
            return
        if not self._in_legal:
            return
        if tag == "div":
            self._depth += 1
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6", "p", "li"}:
            self._capture = tag
            self._buf = []
        if tag == "br" and self._capture:
            self._buf.append(" ")
        if tag == "a":
            self._href = attr.get("href")
            self._link_buf = []

    def handle_endtag(self, tag: str) -> None:
        if not self._in_legal:
            return
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6", "p", "li"} and self._capture == tag:
            text = normalize("".join(self._buf))
            if text:
                self.blocks.append(text)
            self._capture = None
            self._buf = []
        if tag == "a" and self._href is not None:
            self.links.append((normalize("".join(self._link_buf)), self._href))
            self._href = None
            self._link_buf = []
        if tag == "div":
            self._depth -= 1
            if self._depth <= 0:
                self._in_legal = False

    def handle_data(self, data: str) -> None:
        if self._capture:
            self._buf.append(data)
        if self._href is not None:
            self._link_buf.append(data)


def legal_inner(html: str) -> str:
    match = re.search(
        r'<div class="legal-inner">(.*)</div>\s*</main>',
        html,
        flags=re.DOTALL,
    )
    if not match:
        raise SystemExit("could not find <div class='legal-inner'>")
    return match.group(1)


def markdown_links(source: str) -> list[tuple[str, str]]:
    return [(normalize(text), href) for text, href in LINK_RE.findall(source)]


def markdown_strong(source: str) -> list[str]:
    return [normalize(LINK_RE.sub(lambda match: match.group(1), text)) for text in STRONG_RE.findall(source)]


def html_strong(fragment: str) -> list[str]:
    return [normalize(text) for text in re.findall(r"<strong>(.*?)</strong>", fragment, flags=re.DOTALL)]


def markdown_code(source: str) -> list[str]:
    return [normalize(text) for text in CODE_RE.findall(source)]


def html_code(fragment: str) -> list[str]:
    return [normalize(text) for text in re.findall(r"<code>(.*?)</code>", fragment, flags=re.DOTALL)]


def markdown_headings(source: str) -> list[tuple[int, str]]:
    found = []
    for line in source.splitlines():
        heading = HEADING_RE.match(line.strip())
        if heading:
            found.append((len(heading.group(1)), normalize(strip_inline(heading.group(2)))))
    return found


def html_headings(fragment: str) -> list[tuple[int, str]]:
    found = []
    for level, text in re.findall(r"<h([1-6])>(.*?)</h\1>", fragment, flags=re.DOTALL):
        found.append((int(level), normalize(re.sub(r"<[^>]+>", "", text))))
    return found


def unified(label: str, expected: list[str], actual: list[str]) -> str:
    diff = difflib.unified_diff(
        expected,
        actual,
        fromfile=f"{label} source",
        tofile=f"{label} html",
        lineterm="",
    )
    text = "\n".join(diff)
    return f"{text}\n" if text else ""


def require(condition: bool, message: str, failures: list[str]) -> None:
    if condition:
        print(f"  PASS  {message}")
    else:
        print(f"  FAIL  {message}")
        failures.append(message)


def check_page(label: str, markdown_path: Path, html_path: Path, failures: list[str]) -> str:
    print(f"\n== {label} ==")
    source = markdown_path.read_text(encoding="utf-8")
    html = html_path.read_text(encoding="utf-8")
    fragment = legal_inner(html)
    substituted = source.replace(OLD_ORIGIN, NEW_ORIGIN)

    original_blocks = blocks_from_markdown(source)
    expected_blocks = blocks_from_markdown(substituted)
    parser = LegalTextExtractor()
    parser.feed(html)
    actual_blocks = parser.blocks

    require(bool(actual_blocks), "extracted legal text is non-empty", failures)
    require(
        expected_blocks == actual_blocks,
        "visible text matches the source after URL substitution",
        failures,
    )
    require(
        OLD_ORIGIN not in fragment,
        "legal body has no https://www.holy365.app URL",
        failures,
    )
    require(
        source.count(OLD_ORIGIN) == fragment.count(NEW_ORIGIN),
        f"get-dova.com count {fragment.count(NEW_ORIGIN)} "
        f"equals source holy365.app URL count {source.count(OLD_ORIGIN)}",
        failures,
    )
    require(
        source.count("admin@holy365.app") == fragment.count("admin@holy365.app"),
        f"admin@holy365.app count unchanged ({source.count('admin@holy365.app')})",
        failures,
    )
    require(
        source.count("com.holy365.app") == fragment.count("com.holy365.app"),
        "bundle identifier com.holy365.app unchanged",
        failures,
    )
    require(
        source.count("holy365 Pro") == fragment.count("holy365 Pro"),
        '"holy365 Pro" unchanged',
        failures,
    )
    require(
        source.count("Holy365") == fragment.count("Holy365"),
        f"Holy365 mentions unchanged ({source.count('Holy365')})",
        failures,
    )
    require(
        markdown_links(substituted) == parser.links,
        f"links match in text and href ({len(parser.links)})",
        failures,
    )
    require(
        markdown_strong(substituted) == html_strong(fragment),
        f"bold spans match ({len(html_strong(fragment))})",
        failures,
    )
    require(
        markdown_code(substituted) == html_code(fragment),
        f"code spans match ({html_code(fragment)})",
        failures,
    )
    require(
        markdown_headings(substituted) == html_headings(fragment),
        f"headings match ({len(html_headings(fragment))})",
        failures,
    )
    require(not HEALING_RE.search(html), "page does not contain 'healing'", failures)

    url_diff = unified(label, original_blocks, actual_blocks)
    if not url_diff.strip():
        print("  NOTE  no textual difference at all (no URL lines were present)")
    else:
        changed = [
            line
            for line in url_diff.splitlines()
            if line.startswith(("+", "-")) and not line.startswith(("+++", "---"))
        ]
        only_urls = all(
            (OLD_ORIGIN in line or NEW_ORIGIN in line) for line in changed
        )
        require(
            only_urls,
            "diff against the untouched source changes only holy365.app URLs",
            failures,
        )
    return url_diff


def check_footer(failures: list[str]) -> None:
    print("\n== Footer links ==")
    for name in ("index.html", "terms.html", "privacy.html"):
        html = (ROOT / name).read_text(encoding="utf-8")
        require(
            'href="terms.html"' in html and 'href="privacy.html"' in html,
            f"{name} links to Terms and Privacy",
            failures,
        )
        require(
            html.count(">Terms<") >= 1 and html.count(">Privacy<") >= 1,
            f"{name} shows Terms and Privacy labels",
            failures,
        )


def check_forbidden_word(failures: list[str]) -> None:
    print("\n== Forbidden word ==")
    for path in CHECKED_FILES:
        text = path.read_text(encoding="utf-8")
        require(
            not HEALING_RE.search(text),
            f"{path.relative_to(ROOT)} does not contain 'healing'",
            failures,
        )


def main() -> None:
    failures: list[str] = []
    diffs: list[str] = []
    print("Legal text verification")
    print(f"Allowed edit: {OLD_ORIGIN} -> {NEW_ORIGIN}")
    for label, markdown_path, html_path in PAGES:
        diffs.append(check_page(label, markdown_path, html_path, failures))
    check_footer(failures)
    check_forbidden_word(failures)

    print("\n== Diff of extracted text (source vs HTML) ==")
    print("Lines below are the only extracted-text differences.")
    print("Each removed line is the source; each added line is the page.")
    print("They should differ solely by the holy365.app -> get-dova.com URL.\n")
    for diff in diffs:
        if diff.strip():
            print(diff)
        else:
            print("(empty diff)")

    print("\n== Result ==")
    if failures:
        print(f"FAILED {len(failures)} check(s):")
        for failure in failures:
            print(f"  - {failure}")
        raise SystemExit(1)
    print(
        "PASS: both pages match the markdown source apart from the "
        "https://www.holy365.app -> https://get-dova.com substitution."
    )


if __name__ == "__main__":
    main()
