"""Generate public/og-default.png — the default Open Graph share card.

Colours and type mirror src/styles/tokens.css, so the card matches the site.
Re-run this whenever the hero copy, brand name, or palette changes.

Fonts are not vendored. Fetch them into a local (gitignored) directory first:

    mkdir -p .fonts && cd .fonts
    curl -sO "$(curl -s 'https://fonts.googleapis.com/css2?family=Geist:wght@700' \
        | grep -o 'https://[^)]*\\.ttf')"   # -> rename to Geist-Bold.ttf
    curl -sO "$(curl -s 'https://fonts.googleapis.com/css2?family=Geist:wght@600' \
        | grep -o 'https://[^)]*\\.ttf')"   # -> rename to Geist-SemiBold.ttf
    curl -sO "$(curl -s 'https://fonts.googleapis.com/css2?family=Inter:wght@500' \
        | grep -o 'https://[^)]*\\.ttf')"   # -> rename to Inter-Medium.ttf

Then:  python3 tools/make_og_image.py .fonts public/og-default.png

Requires Pillow (pip install Pillow).
"""

from PIL import Image, ImageDraw, ImageFont
import sys

W, H = 1200, 630
PAD = 88

DEPTH = (30, 30, 30)          # --bca-depth   #1E1E1E
GLOW = (245, 158, 11)         # --bca-glow    #F59E0B
CLARITY = (14, 165, 164)      # --bca-clarity #0EA5A4
STONE_2 = (156, 163, 175)     # --bca-stone-2 #9CA3AF
WHITE = (255, 255, 255)

EYEBROW = "AI-ERA WEB STRATEGY AND ANALYTICS"
HEADLINE = "Your website, ready for"
HEADLINE_ACCENT = "today's buyers."
DOMAIN = "brightcavedigital.com"

FONTS = sys.argv[1] if len(sys.argv) > 1 else ".fonts"
OUT = sys.argv[2] if len(sys.argv) > 2 else "public/og-default.png"
BRAND = sys.argv[3] if len(sys.argv) > 3 else "Bright Cave Digital"

geist_bold = ImageFont.truetype(f"{FONTS}/Geist-Bold.ttf", 72)
geist_semi = ImageFont.truetype(f"{FONTS}/Geist-SemiBold.ttf", 30)
inter_eyebrow = ImageFont.truetype(f"{FONTS}/Inter-Medium.ttf", 21)
inter_url = ImageFont.truetype(f"{FONTS}/Inter-Medium.ttf", 24)


def radial_glow(w, h, cx, cy, rx, ry, colour, peak):
    """Elliptical glow, computed small and upscaled — cheap and smooth."""
    s = 160
    mask = Image.new("L", (s, s))
    px = mask.load()
    for y in range(s):
        for x in range(s):
            dx = (x / s * w - cx) / rx
            dy = (y / s * h - cy) / ry
            d = (dx * dx + dy * dy) ** 0.5
            px[x, y] = 0 if d >= 1 else int(peak * 255 * (1 - d) ** 1.6)
    mask = mask.resize((w, h), Image.BICUBIC)
    return Image.new("RGB", (w, h), colour), mask


def tracked(draw, xy, text, font, fill, tracking):
    """Draw text with letter-spacing, which PIL has no native support for."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x


img = Image.new("RGB", (W, H), DEPTH)

# Warm glow bleeding in from the top-right, mirroring the .statement band.
layer, mask = radial_glow(W, H, cx=W, cy=0, rx=820, ry=430, colour=GLOW, peak=0.20)
img.paste(layer, (0, 0), mask)

d = ImageDraw.Draw(img)

tracked(d, (PAD, PAD), EYEBROW, inter_eyebrow, CLARITY, 2.6)

# Headline — the accent phrase carries the glow, as it does in the hero.
y = PAD + 74
d.text((PAD, y), HEADLINE, font=geist_bold, fill=WHITE)
d.text((PAD, y + 88), HEADLINE_ACCENT, font=geist_bold, fill=GLOW)

# Hairline above the footer row
fy = H - PAD - 46
d.line([(PAD, fy), (W - PAD, fy)], fill=(64, 64, 64), width=1)

# Footer: gem motif, wordmark, domain
gem = 13
gy = fy + 34
d.polygon(
    [(PAD + gem, gy - gem), (PAD + gem * 2, gy), (PAD + gem, gy + gem), (PAD, gy)],
    fill=GLOW,
)
d.text((PAD + gem * 2 + 18, gy - 20), BRAND, font=geist_semi, fill=WHITE)
d.text(
    (W - PAD - d.textlength(DOMAIN, font=inter_url), gy - 16),
    DOMAIN,
    font=inter_url,
    fill=STONE_2,
)

img.save(OUT, "PNG", optimize=True)
print(f"wrote {OUT}  ({W}x{H})")
