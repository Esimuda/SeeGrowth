"""Cut out hero portrait — red/orange studio background → transparent WebP."""

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "assets" / "hero-person.jpg"
DST = ROOT / "public" / "assets" / "hero-person.webp"
PREVIEW = ROOT / "public" / "assets" / "_cutout-preview.jpg"
MAX_WIDTH = 720


def disk(radius: int):
    y, x = np.ogrid[-radius : radius + 1, -radius : radius + 1]
    return x * x + y * y <= radius * radius


def red_background_mask(rgb: np.ndarray) -> np.ndarray:
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b

    corners = np.vstack(
        [
            rgb[0, 0],
            rgb[0, -1],
            rgb[-1, 0],
            rgb[-1, -1],
            rgb[:40, :40].reshape(-1, 3).mean(axis=0),
            rgb[:40, -40:].reshape(-1, 3).mean(axis=0),
        ]
    )
    bg = corners.mean(axis=0)
    dist = np.sqrt(np.sum((rgb - bg) ** 2, axis=2))

    # Red/orange gradient studio backdrop
    red_studio = (
        (r > 70)
        & (r > g + 12)
        & (r > b + 18)
        & (g < 145)
        & (lum > 28)
        & (dist < 95)
    )
    return red_studio


def person_mask(rgb: np.ndarray) -> np.ndarray:
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    h, w = rgb.shape[:2]

    bg = red_background_mask(rgb)

    # Dark blazer / silhouette
    dark = lum < 62

    # Visor glow — bright warm highlight (keep even when reddish)
    visor = (lum > 115) & (r > 100) & (g > 45)

    # Face / skin lit by visor
    skin = (r > 55) & (g > 28) & (b > 18) & (r >= g - 10) & (lum > 38) & (lum < 230)

    seed = (dark | visor | skin) & ~bg

    # Anchor from lower center (torso) upward
    cx, cy = w // 2, int(h * 0.72)
    seed[cy, max(0, cx - 8) : min(w, cx + 8)] = True
    seed[int(h * 0.55) :, max(0, cx - 60) : min(w, cx + 60)] |= dark[int(h * 0.55) :, max(0, cx - 60) : min(w, cx + 60)]

    person = ndimage.binary_closing(seed, structure=disk(14))
    person = ndimage.binary_dilation(person, structure=disk(10))
    person = ndimage.binary_fill_holes(person)
    person = ndimage.binary_closing(person, structure=disk(8))
    person = ndimage.binary_erosion(person, structure=disk(4))

    # Drop isolated background specks
    labeled, n = ndimage.label(person)
    if n > 1:
        sizes = ndimage.sum(person, labeled, range(1, n + 1))
        keep = int(np.argmax(sizes)) + 1
        person = labeled == keep

    return person


def build_rgba(rgb: np.ndarray, person: np.ndarray) -> Image.Image:
    h, w = person.shape
    dist_out = ndimage.distance_transform_edt(~person)
    alpha = np.zeros((h, w), dtype=np.float32)
    alpha[person] = 255.0
    feather = 4.0
    edge = (~person) & (dist_out <= feather)
    alpha[edge] = np.clip(255.0 * (1.0 - dist_out[edge] / feather), 0, 255)

    rgb_out = rgb.copy()
    lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    fringe = (alpha > 6) & (alpha < 200) & (lum < 35)
    alpha[fringe] = 0
    rgb_out[alpha < 8] = 0

    ys, xs = np.where(alpha > 8)
    pad = 6
    y0, y1 = max(0, int(ys.min()) - pad), min(h, int(ys.max()) + pad)
    x0, x1 = max(0, int(xs.min()) - pad), min(w, int(xs.max()) + pad)
    cut = np.dstack(
        [rgb_out[y0:y1, x0:x1].astype(np.uint8), alpha[y0:y1, x0:x1].astype(np.uint8)]
    )
    return Image.fromarray(cut, "RGBA")


def main():
    rgb = np.array(Image.open(SRC).convert("RGB"), dtype=np.float32)
    person = person_mask(rgb)
    out = build_rgba(rgb, person)

    if out.width > MAX_WIDTH:
        ratio = MAX_WIDTH / out.width
        out = out.resize((MAX_WIDTH, int(out.height * ratio)), Image.Resampling.LANCZOS)

    out.save(DST, "WEBP", quality=85, method=6)
    preview = Image.new("RGB", out.size, (0, 255, 80))
    preview.paste(out, mask=out.split()[-1])
    preview.save(PREVIEW, "JPEG", quality=85)
    print(f"wrote {DST} ({DST.stat().st_size} bytes) {out.size}")


if __name__ == "__main__":
    main()
