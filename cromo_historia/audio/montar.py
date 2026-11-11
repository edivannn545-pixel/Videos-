import subprocess, json, numpy as np
SR=48000
def load(p, ln):
    raw=subprocess.run(['ffmpeg','-loglevel','error','-i',p,'-af',f'loudnorm=I={ln}:TP=-1.5:LRA=11','-ar',str(SR),'-ac','1','-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(raw,np.float32).copy()
N=load('narrador.mp3',-17); C=load('cromo.mp3',-17)
def cut(a,s,e=None): 
    x=a[int(s*SR): (int(e*SR) if e else len(a))].copy()
    f=int(0.03*SR); x[:f]*=np.linspace(0,1,f); x[-f:]*=np.linspace(1,0,f); return x
nb=[0,39.9,57.99,62.36,70.1,94.2,109.17,143.75,165.0,218.4,226.9,246.75,None]
cb=[0,2.95,6.78,10.2,13.2,15.72,21.6,24.5,28.4,34.15,37.55,None]
Nseg=[cut(N,nb[i],nb[i+1]) for i in range(12)]
Cseg=[cut(C,cb[i],cb[i+1]) for i in range(11)]
order=[('N',0),('C',0),('N',1),('C',1),('N',2),('C',2),('N',3),('C',3),('N',4),('C',4),('N',5),('C',5),('N',6),('C',6),('N',7),('C',7),('N',8),('C',8),('N',9),('C',9),('N',10),('C',10),('N',11)]
out=[np.zeros(int(1.0*SR),np.float32)]; t=1.0; tl=[]
for k,i in order:
    x=(Nseg if k=='N' else Cseg)[i]; d=len(x)/SR
    tl.append({'who':k,'i':i,'s':round(t,3),'e':round(t+d,3)})
    out.append(x); t+=d
    g=0.35; out.append(np.zeros(int(g*SR),np.float32)); t+=g
out.append(np.zeros(int(3.0*SR),np.float32)); t+=3.0
a=np.concatenate(out); a/=max(1,np.abs(a).max()/0.97)
a.tofile('trilha.f32')
subprocess.run(['ffmpeg','-loglevel','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','trilha.f32','-c:a','pcm_s16le','trilha_vozes.wav'])
json.dump({'total':t,'segs':tl},open('trilha.json','w'),indent=1)
print(round(t,2)); [print(x) for x in tl]
