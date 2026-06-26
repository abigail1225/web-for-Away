from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "art"
OUT.mkdir(parents=True, exist_ok=True)

COLORS = {
    "cream": (255, 244, 199),
    "honey": (255, 232, 163),
    "paper": (255, 250, 232),
    "ink": (95, 58, 32),
    "muted": (146, 109, 82),
    "rose": (255, 159, 159),
    "rose_deep": (242, 109, 125),
    "blue": (184, 220, 255),
    "lavender": (217, 194, 255),
    "lavender_deep": (140, 101, 200),
    "pink": (255, 212, 226),
}


def rgba(name: str, alpha: int) -> tuple[int, int, int, int]:
    return (*COLORS[name], alpha)


def lerp(a: int, b: int, t: float) -> int:
    return round(a + (b - a) * t)


def soft_gradient(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGBA", size)
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        for x in range(w):
            warm = 0.035 * math.sin((x / w) * math.pi * 2.2) + 0.025 * math.cos((y / h) * math.pi * 1.6)
            tt = min(1, max(0, t + warm))
            px[x, y] = (
                lerp(top[0], bottom[0], tt),
                lerp(top[1], bottom[1], tt),
                lerp(top[2], bottom[2], tt),
                255,
            )
    return img


def add_grain(img: Image.Image, strength: int = 13, seed: int = 7) -> None:
    random.seed(seed)
    w, h = img.size
    grain = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gp = grain.load()
    alpha = img.getchannel("A").load()
    for y in range(h):
        for x in range(w):
            if alpha[x, y] == 0:
                continue
            n = random.randint(-strength, strength)
            cap = max(0, min(18, alpha[x, y] // 14))
            if n >= 0:
                gp[x, y] = (255, 255, 255, min(cap, n + 3))
            else:
                gp[x, y] = (92, 59, 34, min(cap, -n + 2))
    img.alpha_composite(grain)


def petal(draw: ImageDraw.ImageDraw, cx: float, cy: float, r: float, color: tuple[int, int, int, int], angle: float) -> None:
    pts = []
    for i in range(28):
        a = (i / 28) * math.tau
        local_r = r * (0.52 + 0.48 * math.sin(a))
        x = local_r * math.cos(a) * 0.64
        y = local_r * math.sin(a) * 1.18
        ca, sa = math.cos(angle), math.sin(angle)
        pts.append((cx + x * ca - y * sa, cy + x * sa + y * ca))
    draw.polygon(pts, fill=color)


def flower_cluster(layer: Image.Image, x: int, y: int, scale: float, seed: int) -> None:
    random.seed(seed)
    d = ImageDraw.Draw(layer, "RGBA")
    for stem in range(9):
        sx = x + random.randint(-120, 120) * scale
        sy = y + random.randint(-70, 80) * scale
        length = random.randint(78, 160) * scale
        bend = random.randint(-42, 42) * scale
        color = rgba("muted", random.randint(32, 58))
        d.line(
            [(sx, sy), (sx + bend * 0.32, sy - length * 0.45), (sx + bend, sy - length)],
            fill=color,
            width=max(1, round(2 * scale)),
            joint="curve",
        )
        bloom_x, bloom_y = sx + bend, sy - length
        petals = random.randint(5, 7)
        palette = ["rose", "pink", "lavender", "blue"]
        for i in range(petals):
            angle = (i / petals) * math.tau + random.uniform(-0.12, 0.12)
            petal(d, bloom_x + math.cos(angle) * 7 * scale, bloom_y + math.sin(angle) * 7 * scale, random.randint(12, 22) * scale, rgba(random.choice(palette), random.randint(64, 112)), angle)
        d.ellipse(
            [bloom_x - 4 * scale, bloom_y - 4 * scale, bloom_x + 4 * scale, bloom_y + 4 * scale],
            fill=rgba("honey", 140),
        )
        for leaf in range(random.randint(1, 3)):
            ly = sy - random.uniform(0.2, 0.8) * length
            lx = sx + random.uniform(-0.12, 0.4) * bend
            petal(d, lx, ly, random.randint(12, 20) * scale, rgba("blue" if leaf % 2 else "lavender", 44), random.uniform(-1.2, 1.2))


def postal_marks(layer: Image.Image, size: tuple[int, int], seed: int) -> None:
    random.seed(seed)
    d = ImageDraw.Draw(layer, "RGBA")
    w, h = size
    for _ in range(34):
        x = random.randint(80, w - 80)
        y = random.randint(70, h - 70)
        if random.random() < 0.45:
            r = random.randint(18, 54)
            d.ellipse([x - r, y - r, x + r, y + r], outline=rgba("ink", random.randint(12, 28)), width=1)
            d.arc([x - r + 8, y - r + 8, x + r - 8, y + r - 8], 20, 260, fill=rgba("rose_deep", random.randint(10, 22)), width=1)
        else:
            ww = random.randint(40, 96)
            hh = random.randint(18, 42)
            d.rounded_rectangle([x, y, x + ww, y + hh], radius=4, outline=rgba("lavender_deep", random.randint(9, 23)), width=1)
            for i in range(3):
                yy = y + 7 + i * 9
                d.line([x + 8, yy, x + ww - 8, yy], fill=rgba("muted", random.randint(9, 21)), width=1)


def rounded_mask(size: tuple[int, int], box: tuple[int, int, int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle(box, radius=radius, fill=255)
    return mask


def satin_rect(layer: Image.Image, box: tuple[int, int, int, int], radius: int, seed: int) -> None:
    random.seed(seed)
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    ribbon = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    rp = ribbon.load()
    base = (83, 38, 132)
    hi = (152, 93, 203)
    low = (48, 25, 91)
    for y in range(y0, y1):
        yy = (y - y0) / max(1, h)
        sheen = 0.52 + 0.28 * math.sin(yy * math.pi) + 0.08 * math.sin(yy * math.tau * 5)
        for x in range(x0, x1):
            xx = (x - x0) / max(1, w)
            streak = 0.06 * math.sin((xx * 24 + yy * 3) * math.tau)
            t = max(0, min(1, sheen + streak))
            color = tuple(lerp(low[i], hi[i], t) for i in range(3))
            rp[x, y] = (*color, 232)
    mask = Image.new("L", layer.size, 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle(box, radius=radius, fill=255)
    ribbon.putalpha(mask)
    rd = ImageDraw.Draw(ribbon, "RGBA")
    rd.line([(x0 + 18, y0 + 10), (x1 - 18, y0 + 9)], fill=(236, 219, 255, 80), width=2)
    rd.line([(x0 + 18, y1 - 11), (x1 - 18, y1 - 12)], fill=(38, 18, 68, 72), width=2)
    for _ in range(160):
        x = random.randint(x0 + 6, x1 - 6)
        y = random.randint(y0 + 5, y1 - 5)
        a = random.randint(10, 24)
        rd.point((x, y), fill=(255, 240, 255, a))
    layer.alpha_composite(ribbon.filter(ImageFilter.GaussianBlur(0.18)))


def satin_loop(layer: Image.Image, points: list[tuple[int, int]], seed: int) -> None:
    random.seed(seed)
    loop = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(loop, "RGBA")
    d.polygon(points, fill=(91, 43, 139, 236))
    d.line(points + [points[0]], fill=(38, 20, 76, 80), width=4)
    d.line([points[0], points[1], points[2]], fill=(218, 190, 255, 74), width=3)
    cx = sum(p[0] for p in points) / len(points)
    cy = sum(p[1] for p in points) / len(points)
    for i in range(12):
        p1 = random.choice(points)
        p2 = (cx + random.randint(-36, 36), cy + random.randint(-18, 18))
        d.line([p1, p2], fill=(255, 235, 255, random.randint(12, 30)), width=1)
    layer.alpha_composite(loop.filter(ImageFilter.GaussianBlur(0.35)))


def bow_loop(layer: Image.Image, center: tuple[int, int], size: tuple[int, int], angle: float, flip: int, seed: int) -> None:
    random.seed(seed)
    lw, lh = size[0] + 80, size[1] + 64
    local = Image.new("RGBA", (lw, lh), (0, 0, 0, 0))
    d = ImageDraw.Draw(local, "RGBA")
    ox, oy = 40, 32
    outer = [ox, oy, ox + size[0], oy + size[1]]
    d.ellipse(outer, fill=(92, 43, 143, 232), outline=(48, 23, 88, 92), width=4)
    d.ellipse([ox + 34, oy + 32, ox + size[0] - 32, oy + size[1] - 28], fill=(43, 22, 83, 118))
    d.ellipse([ox + 48, oy + 38, ox + size[0] - 54, oy + size[1] - 38], fill=(70, 34, 119, 170))
    d.arc([ox + 16, oy + 12, ox + size[0] - 18, oy + size[1] - 14], 202 if flip < 0 else 332, 24 if flip < 0 else 154, fill=(230, 205, 255, 116), width=6)
    d.arc([ox + 20, oy + 22, ox + size[0] - 16, oy + size[1] - 8], 190 if flip < 0 else 318, 30 if flip < 0 else 168, fill=(34, 16, 68, 74), width=4)
    for y in range(oy + 10, oy + size[1] - 10, 10):
        alpha = random.randint(4, 10)
        d.line([(ox + 18, y), (ox + size[0] - 18, y + random.randint(-1, 1))], fill=(255, 240, 255, alpha), width=1)
    pinch_x = ox + size[0] - 30 if flip < 0 else ox + 30
    d.ellipse([pinch_x - 42, oy + 24, pinch_x + 42, oy + size[1] - 22], fill=(42, 19, 81, 128))
    d.line([(pinch_x, oy + 20), (pinch_x + flip * 28, oy + size[1] - 24)], fill=(236, 216, 255, 82), width=3)
    rotated = local.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    x = round(center[0] - rotated.size[0] / 2)
    y = round(center[1] - rotated.size[1] / 2)
    layer.alpha_composite(rotated, (x, y))


def ribbon_tail(layer: Image.Image, points: list[tuple[int, int]], seed: int) -> None:
    random.seed(seed)
    tail = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(tail, "RGBA")
    d.polygon(points, fill=(88, 41, 138, 224))
    d.line(points + [points[0]], fill=(42, 20, 80, 92), width=3)
    for i in range(8):
        a = random.randint(18, 38)
        d.line([points[0], (points[1][0] + random.randint(-20, 20), points[1][1] + random.randint(-20, 20))], fill=(232, 206, 255, a), width=1)
    layer.alpha_composite(tail.filter(ImageFilter.GaussianBlur(0.35)))


def draw_lavender_sprig(layer: Image.Image, base: tuple[int, int], length: int, angle: float, seed: int, scale: float = 1.0) -> None:
    random.seed(seed)
    d = ImageDraw.Draw(layer, "RGBA")
    bx, by = base
    ca, sa = math.cos(angle), math.sin(angle)
    tip = (bx + ca * length, by + sa * length)
    d.line([base, tip], fill=(83, 92, 57, 150), width=max(1, round(2 * scale)))
    for i in range(10):
        t = 0.22 + i * 0.065
        sx = bx + ca * length * t
        sy = by + sa * length * t
        side = -1 if i % 2 else 1
        ox = -sa * side * random.randint(8, 18) * scale
        oy = ca * side * random.randint(8, 18) * scale
        d.line([(sx, sy), (sx + ox, sy + oy)], fill=(94, 101, 65, 95), width=1)
        for k in range(random.randint(2, 4)):
            px = sx + ox * (0.72 + k * 0.11) + random.uniform(-3, 3)
            py = sy + oy * (0.72 + k * 0.11) + random.uniform(-3, 3)
            color = random.choice([(126, 75, 177, 180), (164, 116, 208, 150), (218, 154, 197, 132), (240, 231, 220, 142)])
            r = random.uniform(3.2, 6.2) * scale
            d.ellipse([px - r, py - r * 0.7, px + r, py + r * 0.7], fill=color)
    leaf_color = (105, 123, 78, 92)
    for i in range(3):
        t = 0.12 + i * 0.16
        sx = bx + ca * length * t
        sy = by + sa * length * t
        petal(d, sx - sa * 13 * scale, sy + ca * 13 * scale, 14 * scale, (*leaf_color[:3], leaf_color[3]), angle + 1.2)


def wax_seal(layer: Image.Image, cx: int, cy: int, r: int) -> None:
    seal = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(seal, "RGBA")
    shadow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow, "RGBA")
    sd.ellipse([cx - r - 5, cy - r + 5, cx + r + 7, cy + r + 12], fill=(72, 45, 30, 46))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    layer.alpha_composite(shadow)
    for i in range(30):
        a = i / 30 * math.tau
        rr = r + 5 + math.sin(i * 1.9) * 2
        d.ellipse(
            [
                cx + math.cos(a) * rr - 9,
                cy + math.sin(a) * rr - 9,
                cx + math.cos(a) * rr + 9,
                cy + math.sin(a) * rr + 9,
            ],
            fill=(252, 246, 234, 232),
        )
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(253, 248, 238, 252), outline=(207, 187, 158, 138), width=3)
    d.ellipse([cx - r + 13, cy - r + 13, cx + r - 13, cy + r - 13], outline=(211, 190, 160, 116), width=2)
    heart = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    hd = ImageDraw.Draw(heart, "RGBA")
    hr = r * 0.29
    hx, hy = cx, cy + r * 0.02
    hd.ellipse([hx - hr * 1.3, hy - hr * 1.25, hx - hr * 0.05, hy], fill=(195, 162, 141, 156))
    hd.ellipse([hx + hr * 0.05, hy - hr * 1.25, hx + hr * 1.3, hy], fill=(195, 162, 141, 156))
    hd.polygon([(hx - hr * 1.32, hy - hr * 0.42), (hx + hr * 1.32, hy - hr * 0.42), (hx, hy + hr * 1.45)], fill=(195, 162, 141, 156))
    d.ellipse([cx - r + 14, cy - r + 10, cx + r - 18, cy - r + 28], fill=(255, 255, 255, 54))
    seal.alpha_composite(heart.filter(ImageFilter.GaussianBlur(0.2)))
    layer.alpha_composite(seal.filter(ImageFilter.GaussianBlur(0.2)))


def make_background() -> None:
    w, h = 2400, 1600
    img = soft_gradient((w, h), COLORS["paper"], COLORS["honey"])
    d = ImageDraw.Draw(img, "RGBA")

    washes = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    wd = ImageDraw.Draw(washes, "RGBA")
    for box, color in [
        ((-280, -160, 1040, 840), rgba("pink", 96)),
        ((1420, -260, 2660, 840), rgba("blue", 86)),
        ((1260, 820, 2520, 1880), rgba("lavender", 70)),
        ((-260, 880, 960, 1860), rgba("rose", 54)),
    ]:
        wd.ellipse(box, fill=color)
    washes = washes.filter(ImageFilter.GaussianBlur(110))
    img.alpha_composite(washes)

    for y in range(96, h, 92):
        d.line([(0, y), (w, y + random.randint(-8, 8))], fill=rgba("ink", 10), width=1)
    for x in range(120, w, 180):
        d.line([(x, 0), (x + random.randint(-18, 18), h)], fill=rgba("rose_deep", 7), width=1)

    pattern = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pattern, "RGBA")
    random.seed(37)
    for _ in range(780):
        x, y = random.randint(0, w), random.randint(0, h)
        r = random.choice([1, 1, 1, 2, 3])
        color = random.choice([rgba("rose", 36), rgba("blue", 32), rgba("lavender", 34), rgba("ink", 16)])
        pd.ellipse([x - r, y - r, x + r, y + r], fill=color)

    flower_cluster(pattern, 310, 1390, 1.45, 91)
    flower_cluster(pattern, 2150, 360, 1.2, 117)
    flower_cluster(pattern, 2020, 1490, 0.95, 141)
    flower_cluster(pattern, 260, 300, 0.82, 171)
    postal_marks(pattern, (w, h), 211)
    img.alpha_composite(pattern.filter(ImageFilter.GaussianBlur(0.25)))

    veil = Image.new("RGBA", (w, h), (255, 252, 239, 46))
    img.alpha_composite(veil)
    add_grain(img, 10, 19)
    img.save(OUT / "letter-garden-bg.png", optimize=True)


def make_envelope() -> None:
    w, h = 1400, 860
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow, "RGBA")
    sd.rounded_rectangle([96, 150, 1304, 700], radius=34, fill=(68, 38, 104, 64))
    shadow = shadow.filter(ImageFilter.GaussianBlur(30))
    img.alpha_composite(shadow)

    body = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(body, "RGBA")
    envelope_box = (92, 124, 1308, 680)
    d.rounded_rectangle(envelope_box, radius=28, fill=(204, 180, 246, 240), outline=(140, 101, 200, 104), width=2)

    wash = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    wd = ImageDraw.Draw(wash, "RGBA")
    wd.ellipse([-40, 70, 760, 620], fill=(255, 212, 226, 42))
    wd.ellipse([660, 20, 1480, 600], fill=(184, 220, 255, 34))
    wd.ellipse([270, 280, 1160, 760], fill=(140, 101, 200, 48))
    wd.ellipse([300, 330, 1140, 780], fill=(255, 250, 232, 34))
    body.alpha_composite(wash.filter(ImageFilter.GaussianBlur(82)))

    d = ImageDraw.Draw(body, "RGBA")
    d.polygon([(92, 142), (700, 402), (1308, 142), (1308, 680), (92, 680)], fill=(211, 190, 250, 92))
    d.polygon([(92, 680), (508, 386), (700, 492), (892, 386), (1308, 680)], fill=(248, 242, 255, 42))
    d.line([(112, 154), (700, 402), (1288, 154)], fill=(255, 252, 238, 164), width=4)
    d.line([(110, 660), (508, 386), (700, 492), (892, 386), (1290, 660)], fill=(76, 45, 116, 42), width=2)
    d.arc([74, 130, 530, 670], 202, 310, fill=(255, 252, 238, 78), width=3)
    d.arc([870, 130, 1326, 670], 230, 338, fill=(255, 252, 238, 78), width=3)

    random.seed(50)
    for _ in range(360):
        x = random.randint(118, 1284)
        y = random.randint(142, 660)
        if random.random() < 0.62:
            r = random.choice([1, 1, 1, 2])
            d.ellipse([x - r, y - r, x + r, y + r], fill=random.choice([(255, 255, 255, 34), (132, 91, 48, 13), (184, 220, 255, 22), (255, 212, 226, 24)]))

    botanicals = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw_lavender_sprig(botanicals, (690, 510), 250, -1.74, 401, 0.86)
    draw_lavender_sprig(botanicals, (710, 510), 238, -1.42, 402, 0.82)
    draw_lavender_sprig(botanicals, (674, 512), 212, -2.02, 403, 0.68)
    draw_lavender_sprig(botanicals, (728, 512), 210, -1.12, 404, 0.68)
    body.alpha_composite(botanicals.filter(ImageFilter.GaussianBlur(0.15)))

    botanicals_top = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw_lavender_sprig(botanicals_top, (688, 518), 280, -1.72, 451, 0.9)
    draw_lavender_sprig(botanicals_top, (710, 518), 264, -1.39, 452, 0.86)
    draw_lavender_sprig(botanicals_top, (672, 520), 228, -2.02, 453, 0.72)
    draw_lavender_sprig(botanicals_top, (728, 520), 224, -1.12, 454, 0.72)
    body.alpha_composite(botanicals_top.filter(ImageFilter.GaussianBlur(0.12)))
    wax_seal(body, 700, 424, 66)
    d = ImageDraw.Draw(body, "RGBA")

    try:
        font = ImageFont.truetype("/System/Library/Fonts/Avenir.ttc", 25)
    except OSError:
        font = ImageFont.load_default()
    for x, y, label in [(1094, 178, "HB"), (186, 176, "06.21")]:
        d.rounded_rectangle([x - 24, y - 20, x + 96, y + 32], radius=8, outline=(95, 58, 32, 42), width=2)
        d.text((x, y), label, fill=(95, 58, 32, 74), font=font)

    highlight = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    hd = ImageDraw.Draw(highlight, "RGBA")
    hd.rounded_rectangle([118, 146, 1282, 654], radius=24, outline=(255, 255, 255, 84), width=2)
    hd.line([(148, 168), (1224, 170)], fill=(255, 255, 255, 64), width=2)
    hd.arc([82, 144, 526, 650], 204, 308, fill=(255, 255, 255, 52), width=2)
    hd.arc([874, 144, 1318, 650], 232, 336, fill=(255, 255, 255, 52), width=2)
    body.alpha_composite(highlight)

    mask = rounded_mask((w, h), envelope_box, 28)
    soft_edge = Image.new("L", (w, h), 0)
    ed = ImageDraw.Draw(soft_edge)
    ed.rounded_rectangle([86, 104, 1314, 710], radius=34, fill=90)
    mask = Image.composite(mask, soft_edge, soft_edge.filter(ImageFilter.GaussianBlur(8)))
    body.putalpha(Image.composite(body.getchannel("A"), mask, mask))
    add_grain(body, 6, 29)
    img.alpha_composite(body)
    img.save(OUT / "envelope-cover.png", optimize=True)


if __name__ == "__main__":
    make_background()
    make_envelope()
