from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "assets" / "hero-person.jpg"
DST = ROOT / "public" / "assets" / "hero-person.webp"
PREVIEW = ROOT / "public" / "assets" / "_cutout-preview.jpg"


def disk(radius: int):
    y, x = np.ogrid[-radius : radius + 1, -radius : radius + 1]
    return x * x + y * y <= radius * radius


def main():
    rgb = np.array(Image.open(SRC).convert("RGB"), dtype=np.float32)
    h, w = rgb.shape[:2]
    r, g, bch = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * bch

    orange = (r > 90) & (g > 32) & (bch < 175) & (r > g + 10) & (r > bch + 14)
    skin = (r > 68) & (g > 32) & (bch > 20) & (r > bch + 6) & (r >= g - 14) & (lum > 42) & (lum < 235)
    seed = orange | skin | (lum > 105)

    person = ndimage.binary_closing(seed, structure=disk(18))
    person = ndimage.binary_dilation(person, structure=disk(16))
    person = ndimage.binary_fill_holes(person)
    person = ndimage.binary_erosion(person, structure=disk(6))
    person = ndimage.binary_closing(person, structure=disk(12))

    sy, sx = np.where(skin)
    face_y0 = int(sy.min())
    cx = int((sx.min() + sx.max()) / 2)
    hair_top = face_y0
    for y in range(face_y0, max(0, face_y0 - 130), -1):
        band = lum[y, max(0, cx - 42) : min(w, cx + 42)]
        if band.size and float(band.mean()) < 24:
            hair_top = y + 3
            break
    yy, xx = np.ogrid[:h, :w]
    hair_span = max(48, int((sx.max() - sx.min()) * 0.62))
    hair = (
        (yy >= hair_top)
        & (yy <= face_y0 + 36)
        & (np.abs(xx - cx) <= hair_span)
        & (lum > 16)
    )
    person = ndimage.binary_fill_holes(person | hair)

    dist_out = ndimage.distance_transform_edt(~person)
    alpha = np.zeros((h, w), dtype=np.float32)
    alpha[person] = 255.0
    feather = 3.5
    edge = (~person) & (dist_out <= feather)
    alpha[edge] = np.clip(255.0 * (1.0 - dist_out[edge] / feather), 0, 255)

    a = np.clip(alpha / 255.0, 0, 1)[..., None]
    rgb_out = rgb.copy()
    rgb_out[alpha < 8] = 0
    fringe = (alpha > 8) & (alpha < 220) & (lum < 40)
    alpha[fringe] = 0
    rgb_out[alpha < 8] = 0

    ys, xs = np.where(alpha > 8)
    pad = 4
    y0, y1 = max(0, int(ys.min()) - pad), min(h, int(ys.max()) + pad)
    x0, x1 = max(0, int(xs.min()) - pad), min(w, int(xs.max()) + pad)
    cut = np.dstack([rgb_out[y0:y1, x0:x1].astype(np.uint8), alpha[y0:y1, x0:x1].astype(np.uint8)])
    out = Image.fromarray(cut, "RGBA")
    if out.width > 720:
        ratio = 720 / out.width
        out = out.resize((720, int(out.height * ratio)), Image.Resampling.LANCZOS)

    out.save(DST, "WEBP", quality=80, method=6)
    preview = Image.new("RGB", out.size, (0, 255, 80))
    preview.paste(out, mask=out.split()[-1])
    preview.save(PREVIEW, "JPEG", quality=85)
    print(f"wrote {DST} ({DST.stat().st_size} bytes) {out.size}")


if __name__ == "__main__":
    main()
