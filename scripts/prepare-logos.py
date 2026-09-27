"""
Turns the logo files the team supplied (public/logo/<brand>/source/) into the
transparent artwork the posters use:

  logo.png        horizontal logo for light backgrounds (mark + wordmark side by side)
  logo-light.png  the same for dark backgrounds (dark ink → white)
  mark.png        symbol only
  mark-light.png  symbol for dark backgrounds

plus public/favicon.png and public/apple-touch-icon.png from public/logo/favicon.png.
Run: python scripts/prepare-logos.py   (needs Pillow + numpy)
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent / 'public'
LOGO = ROOT / 'logo'


def rgba(im: Image.Image) -> np.ndarray:
    return np.asarray(im.convert('RGBA')).astype(np.float32)


def knock_white(a: np.ndarray, lo: float = 200, hi: float = 238) -> np.ndarray:
    """White/near-white background → transparent, with soft anti-aliased edges."""
    out = a.copy()
    light = a[..., :3].min(axis=2)
    alpha = np.clip((hi - light) / (hi - lo), 0, 1)
    out[..., 3] = np.minimum(out[..., 3], alpha * 255)
    return out


def knock_white_outside(a: np.ndarray) -> np.ndarray:
    """Like knock_white, but only for background connected to the border (keeps white shapes inside a mark)."""
    light = a[..., :3].min(axis=2)
    cand = Image.fromarray(((light > 200) * 255).astype(np.uint8), 'L').copy()
    h, w = light.shape
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if cand.getpixel(seed) == 255:
            ImageDraw.floodfill(cand, seed, 128, thresh=0)
    outside = np.asarray(cand) == 128
    soft = knock_white(a)
    out = a.copy()
    out[..., 3] = np.where(outside, soft[..., 3], a[..., 3])
    return out


def trim(a: np.ndarray, pad: int = 0) -> np.ndarray:
    ys, xs = np.where(a[..., 3] > 8)
    return a[max(0, ys.min() - pad): ys.max() + 1 + pad, max(0, xs.min() - pad): xs.max() + 1 + pad]


def to_img(a: np.ndarray) -> Image.Image:
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA')


def scale(a: np.ndarray, h: int) -> np.ndarray:
    im = to_img(a)
    return rgba(im.resize((max(1, round(im.width * h / im.height)), h), Image.LANCZOS))


def lighten_ink(a: np.ndarray, max_sat: float = 0.35, max_light: float = 110) -> np.ndarray:
    """Dark, low-saturation ink (black/navy text) → white; colours are kept."""
    out = a.copy()
    rgb = a[..., :3]
    mx, mn = rgb.max(axis=2), rgb.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    ink = (mx < max_light) & (sat < max_sat)
    out[ink, :3] = 255
    return out


def invert_mono(a: np.ndarray) -> np.ndarray:
    """Black ↔ white for a monochrome mark (keeps alpha)."""
    out = a.copy()
    out[..., :3] = 255 - a[..., :3]
    return out


def side_by_side(mark: np.ndarray, words: np.ndarray, words_ratio: float = 0.62, gap: float = 0.18) -> np.ndarray:
    h = 600
    m = scale(mark, h)
    t = scale(words, round(h * words_ratio))
    g = round(h * gap)
    canvas = np.zeros((h, m.shape[1] + g + t.shape[1], 4), np.float32)
    canvas[:, : m.shape[1]] = m
    y = (h - t.shape[0]) // 2
    canvas[y: y + t.shape[0], m.shape[1] + g:] = t
    return canvas


def save(a: np.ndarray, path: Path) -> None:
    to_img(trim(a, 2)).save(path, optimize=True)
    print('wrote', path.relative_to(ROOT.parent), to_img(trim(a, 2)).size)


def source(brand: str, name: str) -> Image.Image:
    return Image.open(LOGO / brand / 'source' / name)


# --- Artova Research: A-mark on top, wordmark below → mark | wordmark ---------
fav = trim(rgba(Image.open(LOGO / 'favicon.png')))
art = knock_white(rgba(source('artova-research', 'logo-2-whitebg.png')))
art_mark = trim(art[40:760])
art_words = trim(art[790:1160])  # ARTOVA · RESEARCH · IDEAS | INSIGHTS | IMPACT (rows above the corner triangle)
art_logo = side_by_side(art_mark, art_words, 0.66)
out = LOGO / 'artova-research'
save(art_logo, out / 'logo.png')
art_light = art_logo.copy()
w_art = scale(art_mark, 600).shape[1]
art_light[:, w_art:] = lighten_ink(art_logo[:, w_art:], max_sat=1.0, max_light=110)  # wordmark only; the A keeps its shading
save(art_light, out / 'logo-light.png')
save(fav, out / 'mark.png')
save(fav, out / 'mark-light.png')

# --- Thesis Companion: round mark above THESIS / COMPANION → mark | words ------
tc_src = rgba(source('thesis-companion', 'logo-1.jpg').resize((800, 800), Image.LANCZOS))
tc_mark = trim(knock_white_outside(tc_src[100:440]))
tc_words = trim(knock_white(tc_src[455:640]))
tc_logo = side_by_side(tc_mark, tc_words, 0.5, 0.14)
out = LOGO / 'thesis-companion'
save(tc_logo, out / 'logo.png')
tc_light = tc_logo.copy()
w_mark = scale(tc_mark, 600).shape[1]
tc_light[:, :w_mark] = invert_mono(tc_logo[:, :w_mark])
tc_light[:, w_mark:] = lighten_ink(tc_logo[:, w_mark:], max_light=140)
save(tc_light, out / 'logo-light.png')
save(tc_mark, out / 'mark.png')
save(invert_mono(tc_mark), out / 'mark-light.png')

# --- Nepal Scholar: already horizontal; mark supplied separately --------------
ns_logo = trim(knock_white(rgba(source('nepal-scholar', 'logo-1.png'))))
ns_mark = trim(rgba(source('nepal-scholar', 'justlogo.png')))
out = LOGO / 'nepal-scholar'
save(ns_logo, out / 'logo.png')
save(lighten_ink(ns_logo, max_sat=0.6, max_light=90), out / 'logo-light.png')
save(ns_mark, out / 'mark.png')
save(lighten_ink(ns_mark, max_sat=0.6, max_light=90), out / 'mark-light.png')

# --- Favicon (Artova A) ------------------------------------------------------
fav_img = to_img(fav)
side = max(fav_img.size)
square = Image.new('RGBA', (side, side), (0, 0, 0, 0))
square.paste(fav_img, ((side - fav_img.width) // 2, (side - fav_img.height) // 2))
square.resize((256, 256), Image.LANCZOS).save(ROOT / 'favicon.png', optimize=True)
touch = Image.new('RGBA', (180, 180), (255, 255, 255, 255))
touch.alpha_composite(square.resize((150, 150), Image.LANCZOS), (15, 15))
touch.convert('RGB').save(ROOT / 'apple-touch-icon.png', optimize=True)
print('wrote public/favicon.png, public/apple-touch-icon.png')
