"""Generate favicons and the header/footer brand mark from public/brand/logo-mark.png.

Two different treatments, because the contexts differ:

* Favicons sit on unknown browser chrome, so the cave gets a square rounded tile
  in --bca-fog. Fog rather than --bca-depth: the cave is charcoal, and on a dark
  tile the silhouette disappears.
* The site's header and footer are both --bca-paper, so the mark is emitted
  transparent with no tile, at 2x its 32px display height.

Usage:  python3 tools/make_icons.py
Requires Pillow (pip install Pillow).
"""

from PIL import Image, ImageDraw

SRC = "public/brand/logo-mark.png"
FOG = (246, 246, 244, 255)  # --bca-fog #F6F6F4

FAVICONS = [
    ("public/favicon-16.png", 16),
    ("public/favicon-32.png", 32),
    ("public/apple-touch-icon.png", 180),
]

# 2x the 32px CSS height used by .brand .mark
MARK_OUT = "public/brand/logo-mark-64.png"
MARK_HEIGHT = 64

src = Image.open(SRC).convert("RGBA")
cave = src.crop(src.getbbox())


def tile(size, pad_frac=0.12, radius_frac=0.22):
    """Square rounded tile with the cave centred, rendered 4x then downsampled."""
    ss = 4
    s = size * ss
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    ImageDraw.Draw(img).rounded_rectangle(
        [0, 0, s - 1, s - 1], radius=int(s * radius_frac), fill=FOG
    )
    avail = int(s * (1 - 2 * pad_frac))
    scale = min(avail / cave.width, avail / cave.height)
    w, h = int(cave.width * scale), int(cave.height * scale)
    resized = cave.resize((w, h), Image.LANCZOS)
    img.paste(resized, ((s - w) // 2, (s - h) // 2), resized)
    return img.resize((size, size), Image.LANCZOS)


for path, size in FAVICONS:
    tile(size).save(path, "PNG", optimize=True)
    print(f"wrote {path}  ({size}x{size})")

w = round(cave.width * MARK_HEIGHT / cave.height)
cave.resize((w, MARK_HEIGHT), Image.LANCZOS).save(MARK_OUT, "PNG", optimize=True)
print(f"wrote {MARK_OUT}  ({w}x{MARK_HEIGHT})  -> display at {w // 2}x{MARK_HEIGHT // 2}")
