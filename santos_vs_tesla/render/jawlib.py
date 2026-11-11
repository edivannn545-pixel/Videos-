import numpy as np
def jaw(img,p,amt):
    d=p['dmax']*amt
    if d<0.5: return
    cx,ym,yc,hw=p['cx'],p['ym'],p['yc'],p['hw']
    x0,x1=cx-hw,cx+hw; y1=yc+45
    xs=np.arange(x0,x1); w=np.cos((xs-cx)/hw*np.pi/2).clip(0)**1.5
    ys=np.arange(ym,y1)[:,None]
    v=np.clip((y1-ys)/(y1-yc),0,1)
    dx=d*w[None,:]*v
    src=ys-dx
    gap=(ys-ym)<dx
    sy=np.clip(src,ym-2,y1-1)
    i0=np.floor(sy).astype(int); f=(sy-i0)[...,None]
    cols=np.arange(x1-x0)[None,:].repeat(len(ys),0)
    a=img[i0,x0+cols]; b=img[np.minimum(i0+1,img.shape[0]-1),x0+cols]
    warped=a*(1-f)+b*f
    depth=((ys-ym)/np.maximum(dx,1e-3)).clip(0,1)
    inside=np.array([70,18,20])*(0.6+0.4*np.sin(np.pi*depth))[...,None]
    tongue=np.array([150,55,60])
    col=np.where((depth>0.65)[...,None],inside*0.5+tongue*0.5,inside)
    # soft edge: blend gap colour with warped near the gap border
    edge=np.clip((dx-(ys-ym))/1.5,0,1)[...,None]
    warped=np.where(gap[...,None],col*edge+warped*(1-edge),warped)
    img[ym:y1,x0:x1]=warped
