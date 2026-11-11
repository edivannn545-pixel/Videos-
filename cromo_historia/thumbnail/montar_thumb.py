"""Monta a miniatura do YouTube (1280x720) a partir do render 3D + título."""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src, out = sys.argv[1], sys.argv[2]
W, H = 1280, 720
im = Image.open(src).convert('RGB').resize((W, H), Image.LANCZOS)
# leve vinheta escura à esquerda para o texto aparecer
grad = Image.new('L', (W, H)); g = ImageDraw.Draw(grad)
for x in range(W): g.line([(x, 0), (x, H)], fill=int(150 * max(0, 1 - x / 760) ** 1.6))
im = Image.composite(Image.new('RGB', (W, H), (40, 10, 60)), im, grad)
F = '/usr/share/fonts/opentype/inter/InterDisplay-Black.otf'

def txt(layer, xy, s, size, fill, stroke=(25, 10, 45), sw=12, rot=0):
    f = ImageFont.truetype(F, size)
    tmp = Image.new('RGBA', (W, H)); d = ImageDraw.Draw(tmp)
    # sombra
    d.text((xy[0] + 8, xy[1] + 10), s, font=f, fill=(0, 0, 0, 160), stroke_width=sw, stroke_fill=(0, 0, 0, 160))
    tmp = tmp.filter(ImageFilter.GaussianBlur(4)); d = ImageDraw.Draw(tmp)
    d.text(xy, s, font=f, fill=fill, stroke_width=sw, stroke_fill=stroke)
    if rot: tmp = tmp.rotate(rot, center=xy, resample=Image.BICUBIC)
    layer.alpha_composite(tmp)

L = im.convert('RGBA')
txt(L, (48, 40), 'O ROBÔ QUE', 104, (255, 255, 255))
txt(L, (48, 158), 'QUERIA', 132, (255, 255, 255))
txt(L, (40, 300), 'SENTIR', 190, (255, 214, 40), stroke=(200, 20, 70), sw=14, rot=4)

# coração em blocos (voxel) com brilho
heart = ["0110110", "1111111", "1111111", "0111110", "0011100", "0001000"]
s = 30; ox, oy = 500, 500
d = ImageDraw.Draw(L)
for j, row in enumerate(heart):
    for i, c in enumerate(row):
        if c == '1':
            x, y = ox + i * s, oy + j * s
            d.rectangle([x + 4, y + 6, x + s + 4, y + s + 6], fill=(60, 0, 20))
for j, row in enumerate(heart):
    for i, c in enumerate(row):
        if c == '1':
            x, y = ox + i * s, oy + j * s
            d.rectangle([x, y, x + s - 2, y + s - 2], fill=(235, 30, 80), outline=(140, 0, 40), width=3)
            d.rectangle([x + 4, y + 4, x + s - 10, y + 9], fill=(255, 110, 150))
d.rectangle([ox + s + 4, oy + s + 4, ox + 2 * s - 6, oy + 2 * s - 6], fill=(255, 220, 230))
L.convert('RGB').save(out, quality=94)
print('ok', out)
