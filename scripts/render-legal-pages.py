#!/usr/bin/env python3
"""Render terms.html and privacy.html from the verbatim markdown sources.

The only transformation applied to the legal text is the owner-authorized
URL substitution https://www.holy365.app -> https://get-dova.com.
Emails, the bundle identifier, and other Holy365 mentions are left unchanged.

Requires the Python `markdown` package (pip install markdown).
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parents[1]
OLD_ORIGIN = "https://www.holy365.app"
NEW_ORIGIN = "https://get-dova.com"

PAGES = (
    {
        "source": ROOT / "legal" / "terms-and-conditions.md",
        "output": ROOT / "terms.html",
        "title": "Terms and Conditions — Dova",
        "description": "Terms and Conditions for the Dova app.",
        "og_title": "Dova – Terms",
        "og_url": "https://get-dova.com/terms",
    },
    {
        "source": ROOT / "legal" / "privacy-policy.md",
        "output": ROOT / "privacy.html",
        "title": "Privacy Policy — Dova",
        "description": "Privacy Policy for the Dova app.",
        "og_title": "Dova – Privacy",
        "og_url": "https://get-dova.com/privacy",
    },
)

PAGE = """\
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>__TITLE__</title>
    <meta name="description" content="__DESCRIPTION__" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Dova" />
    <meta property="og:title" content="__OG_TITLE__" />
    <meta property="og:description" content="Learn the Bible with Dova." />
    <meta property="og:image" content="https://get-dova.com/assets/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="__OG_URL__" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="__OG_TITLE__" />
    <meta name="twitter:description" content="Learn the Bible with Dova." />
    <meta name="twitter:image" content="https://get-dova.com/assets/og-image.png" />
    <meta name="theme-color" content="#f3e2ce" />
    <link rel="icon" href="assets/icon.png" type="image/png" />
    <link rel="apple-touch-icon" href="assets/icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="index.html">
        <img src="assets/icon.png" alt="" width="64" height="64" />
        Dova
      </a>
    </header>

    <main class="legal">
      <div class="legal-inner">
__CONTENT__
      </div>
    </main>

    <footer class="site-footer">
      <a class="brand" href="index.html">
        <img src="assets/icon.png" alt="" width="64" height="64" />
        Dova
      </a>
      <p class="tagline">A daily path to learn about God.</p>
      <nav class="footer-legal" aria-label="Legal">
        <a class="terms-link" href="terms.html">Terms</a>
        <a class="terms-link" href="privacy.html">Privacy</a>
      </nav>
      <p class="hello-label">Say hello</p>
      <a class="email" href="mailto:admin@holy365.app">admin@holy365.app</a>
      <p class="copy">© 2026 Dova</p>
    </footer>
  </body>
</html>
"""


def render_body(source: str) -> str:
    substituted = source.replace(OLD_ORIGIN, NEW_ORIGIN)
    if OLD_ORIGIN in substituted:
        raise SystemExit(f"URL substitution left {OLD_ORIGIN} in the source")
    html = markdown.markdown(substituted, extensions=["nl2br"])
    html = html.replace(
        "<p><strong>Last updated:",
        '<p class="updated"><strong>Last updated:',
        1,
    )
    indented = "\n".join(
        f"        {line}" if line else "" for line in html.splitlines()
    )
    return indented


def render_page(spec: dict) -> None:
    source = spec["source"].read_text(encoding="utf-8")
    page = (
        PAGE.replace("__TITLE__", spec["title"])
        .replace("__DESCRIPTION__", spec["description"])
        .replace("__OG_TITLE__", spec["og_title"])
        .replace("__OG_URL__", spec["og_url"])
        .replace("__CONTENT__", render_body(source))
    )
    spec["output"].write_text(page, encoding="utf-8")
    print(f"wrote {spec['output'].relative_to(ROOT)}", flush=True)


def main() -> None:
    for spec in PAGES:
        render_page(spec)
    check = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "verify-legal-pages.py")],
        cwd=ROOT,
    )
    if check.returncode != 0:
        raise SystemExit(check.returncode)


if __name__ == "__main__":
    main()
