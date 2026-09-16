"""Run scripts/import_assets.py before these font conversion checks."""

import io
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fontTools.ttLib import TTFont
from PIL import Image, ImageChops, ImageDraw, ImageFont

from scripts.build_font import SOURCE, build_font


class FontConversionTests(unittest.TestCase):
    def setUp(self):
        self.assertTrue(SOURCE.is_file(), "Run scripts/import_assets.py first.")
        temporary = tempfile.TemporaryDirectory(prefix="noor-portfolio-font-")
        self.addCleanup(temporary.cleanup)
        self.directory = Path(temporary.name)
        self.output = build_font(output=self.directory / "font.woff2")

    def test_glyphs_match_original_pixels_and_spacing(self):
        with TTFont(self.output) as font:
            self.assertEqual(font.flavor, "woff2")
            self.assertEqual(set(font.getBestCmap()), set(range(32, 127)))
            font.flavor = None
            ttf = io.BytesIO()
            font.save(ttf)

        with Image.open(SOURCE) as image:
            alpha = image.getchannel("A")

        for scale in (2, 3, 4):
            raster_font = ImageFont.truetype(io.BytesIO(ttf.getvalue()), 8 * scale)
            self.assertEqual(raster_font.getlength("Ai W"), 18 * scale)
            for code in range(32, 127):
                with self.subTest(size=8 * scale, character=chr(code)):
                    x, y = (code % 16) * 8, (code // 16) * 8
                    expected = alpha.crop((x, y, x + 8, y + 8)).resize(
                        (8 * scale, 8 * scale), Image.Resampling.NEAREST
                    )
                    actual = Image.new("L", expected.size)
                    ImageDraw.Draw(actual).text(
                        (0, 7 * scale), chr(code), font=raster_font,
                        fill=255, anchor="ls",
                    )
                    self.assertIsNone(ImageChops.difference(expected, actual).getbbox())

    def test_build_is_identical_across_timestamps(self):
        original = self.output.read_bytes()
        for timestamp in ("0", "86400"):
            with self.subTest(timestamp=timestamp):
                with patch.dict("os.environ", {"SOURCE_DATE_EPOCH": timestamp}):
                    rebuilt = build_font(output=self.directory / "rebuilt.woff2")
                self.assertEqual(original, rebuilt.read_bytes())

    def test_modified_atlas_preserves_existing_output(self):
        original = self.output.read_bytes()
        modified = self.directory / "modified.png"
        modified.write_bytes(SOURCE.read_bytes() + b"modified")

        with self.assertRaisesRegex(ValueError, "Unexpected font atlas"):
            build_font(source=modified, output=self.output)

        self.assertEqual(original, self.output.read_bytes())


if __name__ == "__main__":
    unittest.main()
