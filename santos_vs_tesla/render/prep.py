import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
im = np.asarray(Image.open('base.png').convert('RGB')).astype(np.float32)
H,W,_ = im.shape
r,g,b = im[...,0],im[...,1],im[...,2]
mx = im.max(-1); mn = im.min(-1); sat = (mx-mn)/(mx+1e-3)

def fill(img, mask, iters=3):
    out = img.copy()
    known = (~mask).astype(np.float32)
    done = ~mask
    for s in (8,20,45,100):
        num = np.stack([ndi.gaussian_filter(img[...,c]*known, s) for c in range(3)],-1)
        den = ndi.gaussian_filter(known, s)[...,None]
        ok = (den[...,0] > 0.08) & ~done
        out[ok] = (num/np.maximum(den,1e-6))[ok]
        done |= ok
    return out

def sprite(mask, box):
    x0,y0,x1,y1 = box
    m = mask[y0:y1,x0:x1].astype(np.float32)
    m = ndi.gaussian_filter(m,1.0)
    rgba = np.dstack([im[y0:y1,x0:x1], m*255]).clip(0,255).astype(np.uint8)
    return Image.fromarray(rgba,'RGBA')

# PLANE: non-sky pixels in box
pb = (80,110,470,320)
x0,y0,x1,y1 = pb
sky = (b > r+35) & (b > 170)
cloud = (mn > 170) & (sat < 0.25) & (b >= r)
pm = np.zeros((H,W),bool)
sub = ~(sky|cloud)
pm[y0:y1,x0:x1] = sub[y0:y1,x0:x1]
pm = ndi.binary_opening(pm, iterations=1)
lab,n = ndi.label(ndi.binary_dilation(pm,iterations=3))
sizes = ndi.sum(pm, lab, range(1,n+1))
keep = np.isin(lab, [i+1 for i,s in enumerate(sizes) if s>2000])
pm = pm & keep
pm = ndi.binary_closing(pm, iterations=2)
# PIGEON
qb = (795,495,955,645)
x0,y0,x1,y1 = qb
white = (mn > 120) & (sat < 0.22)
feet = (r > 150) & (r > b+50) & (g < r-20)
qm = np.zeros((H,W),bool)
qm[y0:y1,x0:x1] = (white|feet)[y0:y1,x0:x1]
qm = ndi.binary_closing(qm, iterations=3); qm = ndi.binary_fill_holes(qm)
lab,n = ndi.label(qm); sizes = ndi.sum(qm, lab, range(1,n+1))
qm = lab == (np.argmax(sizes)+1)
qm = qm | (ndi.binary_dilation(qm,iterations=2) & feet)
Image.fromarray((pm*255).astype(np.uint8)).crop(pb).save('dbg_plane_mask.png')
Image.fromarray((qm*255).astype(np.uint8)).crop(qb).save('dbg_pigeon_mask.png')
sprite(pm,pb).save('plane.png'); sprite(qm,qb).save('pigeon.png')
x0,y0,x1,y1 = pb
rm = np.zeros((H,W),bool); rm[y0-10:y1+10,x0-10:x1+10] = ~(sky|cloud)[y0-10:y1+10,x0-10:x1+10]
rm = ndi.binary_dilation(rm|pm, iterations=8); rm = ndi.binary_fill_holes(ndi.binary_closing(rm, iterations=25)); rm = ndi.binary_dilation(rm, iterations=6)
both = rm | ndi.binary_dilation(qm, iterations=5)
clean = fill(im, both)
Image.fromarray(clean.clip(0,255).astype(np.uint8)).save('clean.png')
# lightning mask
lm = (b > 200) & (mn > 150) & (b >= r) & (b>g-10)
lm2 = ndi.gaussian_filter(lm.astype(np.float32), 3)
np.save('lightning.npy', (lm2/lm2.max()).astype(np.float16))
print(pm.sum(), qm.sum())
