import json, subprocess, numpy as np
from faster_whisper import WhisperModel
SR=44100
NORM='/tmp/claude-0/-home-user/69964380-780b-5dd7-ad90-da8404113638/scratchpad/audio/norm/'
order=[(1,'N'),(2,'S'),(3,'T'),(4,'S'),(5,'T'),(6,'S'),(7,'T'),(8,'S'),(9,'T'),(10,'S'),(12,'N')]
def load(p):
    raw=subprocess.run(['ffmpeg','-loglevel','error','-i',p,'-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
    return np.frombuffer(raw,np.float32).copy()
m=WhisperModel("small",device="cpu",compute_type="int8")
segs=[];track=[];t=0.4
track.append(np.zeros(int(0.4*SR),np.float32))
rng=np.random.default_rng(1)
sfx=[]
for n,spk in order:
    a=load(NORM+f'{n}.wav'); d=len(a)/SR
    a16=subprocess.run(['ffmpeg','-loglevel','error','-i',NORM+f'{n}.wav','-f','f32le','-ac','1','-ar','16000','-'],capture_output=True).stdout
    ws,_=m.transcribe(np.frombuffer(a16,np.float32),language='pt',word_timestamps=True)
    words=[{'w':w.word.strip(),'s':t+w.start,'e':t+w.end} for s_ in ws for w in s_.words]
    segs.append({'n':n,'spk':spk,'s':t,'e':t+d,'words':words})
    track.append(a); t+=d
    gap = 0.9 if n in (1,10) else 0.45
    if n==7:
        gap=2.2; sfx.append(('boom',t+0.55))
    track.append(np.zeros(int(gap*SR),np.float32)); t+=gap
track.append(np.zeros(int(0.8*SR),np.float32)); t+=0.8
voice=np.concatenate(track)
total=len(voice)/SR
mix=voice.copy()
def add(sig,at,gain=1.0):
    i=int(at*SR); j=min(len(mix),i+len(sig)); mix[i:j]+=sig[:j-i]*gain
# boom: low thump + noise burst
tt=np.arange(int(2.0*SR))/SR
thump=np.sin(2*np.pi*(55*tt+ -15*tt**2))*np.exp(-tt*3.5)
noise=rng.standard_normal(len(tt)).astype(np.float32)
from scipy.signal import butter,lfilter
b,a=butter(2,900/(SR/2)); nz=lfilter(b,a,noise)*np.exp(-tt*2.2)
boom=(0.9*thump+2.5*nz); boom/=np.abs(boom).max()
for kind,at in sfx: add(boom,at,0.85)
# whoosh of throw just before boom
tw=np.arange(int(0.5*SR))/SR; wn=rng.standard_normal(len(tw))
b2,a2=butter(2,[300/(SR/2),3000/(SR/2)],'band'); wh=lfilter(b2,a2,wn)*np.sin(np.pi*tw/0.5)**2
add(wh/np.abs(wh).max(),sfx[0][1]-0.5,0.25)
# fuse hiss during line 7
s7=[s for s in segs if s['n']==7][0]
th=np.arange(int((s7['e']-s7['s']+0.2)*SR))/SR; hs=lfilter(*butter(2,4000/(SR/2),'high'),rng.standard_normal(len(th)))
add(hs*(0.5+0.5*np.sin(2*np.pi*13*th))*0.06,s7['s'])
mix/=max(1.0,np.abs(mix).max()/0.97)
mix.astype(np.float32).tofile('mix.f32'); voice.astype(np.float32).tofile('voice.f32')
subprocess.run(['ffmpeg','-loglevel','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','mix.f32','-c:a','aac','-b:a','192k','mix.m4a'])
json.dump({'total':total,'segs':segs,'boom':sfx[0][1]},open('timeline.json','w'),ensure_ascii=False,indent=1)
print(total)
for s in segs: print(s['n'],s['spk'],round(s['s'],2),round(s['e'],2),' '.join(w['w'] for w in s['words']))
