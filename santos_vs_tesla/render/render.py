import json, math, subprocess, sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from jawlib import jaw
FPS=30; OW,OH=1080,1920
TL=json.load(open('timeline.json')); TOTAL=TL['total']; BOOM=TL['boom']
SEGS=TL['segs']
base=np.asarray(Image.open('clean.png').convert('RGB')).astype(np.float32)
H,W,_=base.shape
light=np.load('lightning.npy').astype(np.float32)
LY0,LY1=0,1400; light=light[LY0:LY1]
plane=Image.open('plane.png'); plane=plane.resize((int(plane.width*0.72),int(plane.height*0.72)),Image.LANCZOS)
planeF=plane.transpose(Image.FLIP_LEFT_RIGHT)
pigeon=Image.open('pigeon.png'); PGX,PGY=795,495; PIV=(75,135)
MOUTH={'S':dict(cx=512,ym=791,yc=824,hw=24,dmax=13),'T':dict(cx=661,ym=604,yc=668,hw=31,dmax=17)}
# --- audio envelope for lip sync (voice only)
SR=44100; voice=np.fromfile('voice.f32',np.float32)
hop=SR//FPS; nfr=int(math.ceil(TOTAL*FPS))
env=np.array([np.sqrt(np.mean(voice[i*hop:(i+1)*hop+hop//2]**2)+1e-9) for i in range(nfr)])
db=20*np.log10(env); amp=np.clip((db+42)/26,0,1)
# fast attack / slower release smoothing
sm=np.zeros_like(amp); v=0
for i,a in enumerate(amp):
    v = a if a>v else v*0.55+a*0.45
    sm[i]=v
amp=sm**0.9
def seg_at(t):
    for s in SEGS:
        if s['s']-0.05<=t<=s['e']+0.05: return s
    return None
CURSE=('caralho','porra','puta','merda','cacete','cassete','desgraçado','filho')
shakes=[(w['s'],0.4,16) for s in SEGS for w in s['words'] if any(c in w['w'].lower() for c in CURSE)]
shakes.append((BOOM,1.4,42))
def shake(t):
    A=0
    for s0,d,a in shakes:
        if s0<=t<=s0+d: A=max(A,a*(1-(t-s0)/d))
    return A*math.sin(t*71.3)*1.0, A*math.cos(t*53.1)*0.8
seg7=[s for s in SEGS if s['n']==7][0]
HAND=(900,735); GROUND=(575,1560)
rng=np.random.default_rng(7)
puffs=[(rng.uniform(-330,330),rng.uniform(-260,60),rng.uniform(120,230),rng.uniform(0.05,0.45),rng.uniform(175,235)) for _ in range(34)]
def draw_bomb(d,x,y,t,r=54):
    d.ellipse([x-r,y-r,x+r,y+r],fill=(22,22,28),outline=(0,0,0),width=3)
    d.ellipse([x-r*0.55,y-r*0.6,x-r*0.15,y-r*0.2],fill=(110,110,125))
    d.rectangle([x-12,y-r-14,x+12,y-r+4],fill=(60,60,66))
    fx,fy=x+10,y-r-28
    d.line([(x,y-r-12),(x+6,y-r-22),(fx,fy)],fill=(150,110,60),width=5)
    k=6+4*math.sin(t*40)
    for a in range(8):
        ang=a*math.pi/4+t*9
        d.line([(fx,fy),(fx+math.cos(ang)*k*2.2,fy+math.sin(ang)*k*2.2)],fill=(255,220,80),width=3)
    d.ellipse([fx-k,fy-k,fx+k,fy+k],fill=(255,250,200))
cam=[W/2,H/2,1.0]
def target(t):
    if BOOM-0.15<=t<=BOOM+1.6: return (W/2,1150,1.08)
    s=seg_at(t)
    if s is None:
        # hold previous speaker between lines
        prev=[x for x in SEGS if x['e']<t]
        s=prev[-1] if prev else None
    if s is None or s['spk']=='N': return (W/2,H/2,1.0)
    return (470,930,1.32) if s['spk']=='S' else (690,820,1.30)
TEST=[float(x) for x in sys.argv[1:]]
if not TEST:
  ff=subprocess.Popen(['ffmpeg','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{OW}x{OH}','-r',str(FPS),'-i','-',
    '-i','mix.m4a','-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-c:a','copy','-shortest','video_noText.mp4'],stdin=subprocess.PIPE)
FR=range(nfr) if not TEST else [int(x*FPS) for x in TEST]
for fi in FR:
    t=fi/FPS
    if TEST: cam[:]=list(target(t))
    img=base.copy()
    # lightning flicker
    fl=0.15+0.85*max(0,math.sin(t*7.1)*math.sin(t*3.3+1)) + (0.9 if (int(t*10)%37==0) else 0)
    if t>=BOOM and t<BOOM+0.4: fl+=1.5
    img[LY0:LY1]+= (light*fl*22)[...,None]*np.array([0.55,0.75,1.0])
    s=seg_at(t)
    if s and s['spk'] in MOUTH: jaw(img,MOUTH[s['spk']],float(amp[min(fi,nfr-1)]))
    pil=Image.fromarray(img.clip(0,255).astype(np.uint8))
    # plane figure-8 glide
    ph=t*2*math.pi/16
    px=575+420*math.sin(ph); py=235+70*math.sin(2*ph)
    vx=math.cos(ph); vy=2*70*math.cos(2*ph)/420
    sp=planeF if vx<0 else plane
    ang=-math.degrees(math.atan2(vy*abs(vx) ,1))*(1 if vx>=0 else -1)*0.6+3*math.sin(t*2.1)
    rp=sp.rotate(ang,resample=Image.BICUBIC,expand=True)
    pil.paste(rp,(int(px-rp.width/2),int(py-rp.height/2)),rp)
    # pigeon: head bob/peck + hops, flies up at boom
    hop=0; rot=4*math.sin(t*5.3)+ (6 if math.sin(t*1.7)>0.93 else 0)
    if math.sin(t*0.9)>0.97: hop=10*abs(math.sin(t*14))
    if BOOM<=t<=BOOM+1.8:
        u=(t-BOOM)/1.8; hop=260*math.sin(math.pi*u); rot=25*math.sin(t*30)
    pr=pigeon.rotate(rot,resample=Image.BICUBIC,center=PIV)
    pil.paste(pr,(PGX,int(PGY-hop)),pr)
    d=ImageDraw.Draw(pil,'RGBA')
    # bomb
    if seg7['s']<=t<BOOM:
        if t<seg7['e']+0.05:
            bx,by=HAND[0]+4*math.sin(t*20),HAND[1]-30
        else:
            u=(t-seg7['e']-0.05)/(BOOM-seg7['e']-0.05); u=min(max(u,0),1)
            bx=HAND[0]+(GROUND[0]-HAND[0])*u; by=HAND[1]-30+(GROUND[1]-HAND[1]+30)*u-380*math.sin(math.pi*u)
        draw_bomb(d,bx,by,t)
    # explosion (soft layer)
    if BOOM<=t<=BOOM+4.5:
        u=t-BOOM
        L=Image.new('RGBA',(W//2,H//2),(0,0,0,0)); dl=ImageDraw.Draw(L)
        gx,gy=GROUND[0]/2,GROUND[1]/2
        for ox,oy,r0,delay,g in puffs:
            v_=u-delay
            if v_<0: continue
            rr=r0/2*(0.4+1.5*min(v_/1.2,1)**0.5); al=int(min(255,330*max(0,1-v_/4.2)))
            cx_=gx+ox/2*(1+v_*0.7); cy_=gy+oy/2-80*v_
            warm=max(0,1-v_/0.8)
            col=(int(min(255,g+warm*40)),int(g*0.97),int(g*0.93),al)
            dl.ellipse([cx_-rr,cy_-rr,cx_+rr,cy_+rr],fill=col)
        F=Image.new('RGBA',(W//2,H//2),(0,0,0,0)); dl=ImageDraw.Draw(F)
        if u<0.8:
            R=40+400*(u/0.8)**0.55; al=int(min(255,420*(1-u/0.8)))
            dl.ellipse([gx-R,gy-R*0.85,gx+R,gy+R*0.55],fill=(255,120,10,al))
            R2=R*0.62; dl.ellipse([gx-R2,gy-R2*0.85,gx+R2,gy+R2*0.55],fill=(255,210,60,al))
            R3=R*0.3; dl.ellipse([gx-R3,gy-R3*0.85,gx+R3,gy+R3*0.55],fill=(255,255,220,al))
        L=Image.alpha_composite(L,F)
        L=L.filter(ImageFilter.GaussianBlur(9)).resize((W,H),Image.BILINEAR)
        pil.paste(L,(0,0),L)
        # debris sparks
        if u<1.2:
            for i in range(18):
                ang=i*2*math.pi/18+0.3; sp_=700*u; gyv=900*u*u
                x_=GROUND[0]+math.cos(ang)*sp_; y_=GROUND[1]-abs(math.sin(ang))*sp_*0.9+gyv
                d.ellipse([x_-7,y_-7,x_+7,y_+7],fill=(255,200,60,int(255*(1-u/1.2))))
    # camera
    tx,ty,tz=target(t); k=0.12 if not (BOOM<=t<BOOM+0.2) else 0.5
    cam[0]+= (tx-cam[0])*k; cam[1]+=(ty-cam[1])*k; cam[2]+=(tz-cam[2])*k
    z=cam[2]*(1+0.012*math.sin(t*1.3))
    cw,ch=W/z,H/z
    sx,sy=shake(t)
    cx=min(max(cam[0]+sx/z,cw/2),W-cw/2); cy=min(max(cam[1]+sy/z,ch/2),H-ch/2)
    frame=pil.crop((int(cx-cw/2),int(cy-ch/2),int(cx+cw/2),int(cy+ch/2))).resize((OW,OH),Image.BILINEAR)
    if BOOM<=t<BOOM+0.3:
        a=1-(t-BOOM)/0.3; frame=Image.blend(frame,Image.new('RGB',(OW,OH),(255,255,240)),a*0.9)
    if TEST: frame.save(f'test_{t:.1f}.png'); continue
    ff.stdin.write(frame.tobytes())
    if fi%300==0: print(fi,'/',nfr,flush=True)
if not TEST: ff.stdin.close(); ff.wait()
print('done')
