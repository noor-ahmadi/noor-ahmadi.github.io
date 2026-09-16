"""Convert the original Java 1.12.2 ASCII atlas to WOFF2.

Install requirements-font.txt before running this script.
"""

import hashlib
import io
import sys
from pathlib import Path

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/minecraft/textures/font/ascii.png"
OUTPUT = ROOT / "public/minecraft/fonts/minecraft-ascii.woff2"
ATLAS_SHA256 = "8d3320e77d2449bc2311390fd452736c046298854377addc940e56ce4e7dda2b"
PIXEL = 64


def trace_glyph(tile: Image.Image):
    pen = TTGlyphPen(None)
    for y in range(8):
        for x in range(8):
            if tile.getpixel((x, y)) == 0:
                continue
            left, top = x * PIXEL, (7 - y) * PIXEL
            pen.moveTo((left, top))
            pen.lineTo((left + PIXEL, top))
            pen.lineTo((left + PIXEL, top - PIXEL))
            pen.lineTo((left, top - PIXEL))
            pen.closePath()
    return pen.glyph()


def build_font(source: Path = SOURCE, output: Path = OUTPUT) -> Path:
    data = source.read_bytes()
    if hashlib.sha256(data).hexdigest() != ATLAS_SHA256:
        raise ValueError("Unexpected font atlas. Run scripts/import_assets.py first.")
    with Image.open(io.BytesIO(data)) as image:
        alpha = image.getchannel("A")

    characters = {code: f"uni{code:04X}" for code in range(32, 127)}
    codes = {".notdef": ord("?"), **{name: code for code, name in characters.items()}}
    glyphs, metrics = {}, {}
    for name, code in codes.items():
        x, y = (code % 16) * 8, (code // 16) * 8
        tile = alpha.crop((x, y, x + 8, y + 8))
        bounds = tile.getbbox()
        # Vanilla uses a four-pixel space and one pixel after each visible glyph.
        advance = 4 if code == 32 else bounds[2] + 1
        bearing = bounds[0] if bounds else 0
        glyphs[name] = trace_glyph(tile)
        metrics[name] = (advance * PIXEL, bearing * PIXEL)

    font = FontBuilder(8 * PIXEL, isTTF=True)
    font.setupGlyphOrder(list(codes))
    font.setupCharacterMap(characters)
    font.setupGlyf(glyphs)
    font.setupHorizontalMetrics(metrics)
    font.setupHorizontalHeader(ascent=7 * PIXEL, descent=-PIXEL)
    font.setupNameTable({
        "familyName": "Minecraft ASCII",
        "styleName": "Regular",
        "uniqueFontIdentifier": "noor-portfolio-java-1.12.2-ascii",
        "fullName": "Minecraft ASCII Regular",
        "psName": "MinecraftASCII-Regular",
        "version": "Version 1.0",
        "copyright": "Original glyphs from Minecraft Java Edition 1.12.2.",
    })
    font.setupOS2(
        sTypoAscender=7 * PIXEL, sTypoDescender=-PIXEL, sTypoLineGap=0,
        usWinAscent=7 * PIXEL, usWinDescent=PIXEL,
    )
    font.setupPost()
    # Fixed font timestamps keep repeated conversions byte-identical.
    font.updateHead(created=2082844800, modified=2082844800)
    font.font.flavor = "woff2"
    output.parent.mkdir(parents=True, exist_ok=True)
    font.save(output)
    return output


if __name__ == "__main__":
    try:
        target = build_font()
    except (OSError, ValueError) as error:
        print(f"Font conversion failed: {error}", file=sys.stderr)
        sys.exit(1)
    print(f"Converted 95 printable ASCII glyphs into {target}")
