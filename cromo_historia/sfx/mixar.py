"""Mixa vozes + música + efeitos sonoros para 'O Robô que Queria Sentir'.
Uso: python3 mixar.py  -> gera trilha_final.wav (48 kHz estéreo)"""
import os, subprocess, numpy as np

SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))
VOZ = os.path.join(HERE, '..', 'audio', 'trilha_vozes.wav')


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def S(name):
    x = load(os.path.join(HERE, name + '.mp3'))
    return x * (0.1 / (np.sqrt(np.mean(x ** 2)) + 1e-9))   # normaliza para -20 dBFS RMS


voz = load(VOZ)
N = len(voz)
TOTAL = N / SR
mix = np.zeros(N, np.float32)


def fade(x, fi=0.05, fo=0.05):
    x = x.copy(); a, b = int(fi * SR), int(fo * SR)
    if a: x[:a] *= np.linspace(0, 1, a)
    if b: x[-b:] *= np.linspace(1, 0, b)
    return x


def put(snd, t, gain, fi=0.02, fo=0.05, dur=None):
    if dur is not None: snd = snd[:int(dur * SR)]
    i = int(t * SR); snd = fade(snd, fi, fo) * gain
    j = min(N, i + len(snd)); mix[i:j] += snd[:j - i]


def loop(snd, t0, t1, gain, fi=1.0, fo=1.0, xf=0.5):
    """Repete um som em loop (com crossfade) entre t0 e t1."""
    n = int((t1 - t0) * SR); out = np.zeros(n, np.float32); x = int(xf * SR); pos = 0
    ramp = np.linspace(0, 1, x)
    while pos < n:
        seg = snd.copy(); seg[:x] *= ramp; seg[-x:] *= ramp[::-1]
        k = min(len(seg), n - pos); out[pos:pos + k] += seg[:k]; pos += len(seg) - x
    put(out, t0, gain, fi, fo)


# ---------- ambientes ----------
birds, wind, crick, rain, drum, roda = S('passaros'), S('vento'), S('grilos'), S('chuva'), S('tambor'), S('roda')
for a, b in [(0, 58), (87, 120), (135.9, 162.8), (174.1, 199.9), (216.7, 277.7)]:
    loop(birds, a, b, 0.22)
for a, b in [(58, 75.5), (199.9, 216.7), (277.7, TOTAL)]:
    loop(wind, a, b, 0.20)
loop(crick, 75.5, 87.0, 0.22)
loop(crick, 162.8, 174.1, 0.14)
loop(rain, 120.0, 136.4, 0.28, fi=1.2, fo=0.8)
loop(rain, 158.4, 159.25, 0.40, fi=0.05, fo=0.1)
for a, b in [(0, 21.0), (87, 114.3)]:
    loop(drum, a, b, 0.14)
put(drum, 157.6, 0.14, dur=0.8)
for a, b in [(21.0, 33.0), (51.1, 62.8), (87.0, 94.0), (135.9, 140.2), (162.8, 170.7), (272.4, 277.7)]:
    loop(roda, a, b, 0.20, fi=0.2, fo=0.3, xf=0.3)

# ---------- efeitos pontuais ----------
thunder = S('trovao')
for t, g in [(121.3, 0.55), (122.8, 0.35), (125.4, 0.55), (130.0, 0.45)]:
    put(thunder, t, g, fi=0.005, fo=0.8)
risada = S('risada')
put(risada, 11.7, 0.30, dur=2.4, fo=0.4)
put(risada, 105.6, 0.45, fo=0.5)
pis = S('pisadas')
put(pis, 15.8, 0.45, dur=2.2, fo=0.2)
put(pis, 140.2, 0.45, fo=0.2); put(pis, 145.0, 0.45, dur=2.8, fo=0.3)
put(pis, 159.2, 0.45, dur=1.2, fo=0.2)
if os.path.exists(os.path.join(HERE, 'motor.mp3')):
    motor = S('motor'); put(motor, 147.8, 0.35, fo=0.4); put(motor, 243.4, 0.22, fo=0.4)
apito, trem = S('apito'), S('trem')
put(trem, 0.0, 0.10, fo=2.0, dur=9.2)          # trem ao longe na abertura
put(apito, 217.0, 0.30, fo=0.4)
put(apito, 231.0, 0.45, fo=0.4)
put(trem, 235.5, 0.55, fo=2.5)
put(S('brilho'), 289.0, 0.55, fo=0.6)

# ---------- música (com ducking sob as vozes) ----------
mus = S('musica')
L = len(mus); xf = int(4 * SR)
track = np.zeros(N, np.float32); track[:min(L, N)] = mus[:N]
if N > L:   # recomeça a música com crossfade de 4 s
    st = L - xf; seg = mus[:N - st].copy(); seg[:xf] *= np.linspace(0, 1, xf)
    track[L - xf:L] *= np.linspace(1, 0, xf); track[st:st + len(seg)] += seg
# envelope da voz -> ducking
win = int(0.05 * SR); env = np.sqrt(np.convolve(voz ** 2, np.ones(win) / win, 'same'))
active = (env > 0.02).astype(np.float32)
k = int(0.4 * SR); active = np.convolve(active, np.ones(k) / k, 'same').clip(0, 1)
mg = 0.30 - 0.15 * active
t = np.arange(N) / SR
mg *= np.where((t > 119.5) & (t < 136.5), 0.5, 1.0)       # tempestade: música mais baixa
track *= mg
track[:int(1.5 * SR)] *= np.linspace(0, 1, int(1.5 * SR))

out = voz + mix + track
import sys
if '--an' in sys.argv:
    bed=mix+track
    i=np.argmax(np.abs(out)); print('pico em', i/SR)
    for a in range(0,int(TOTAL),10):
        sl=slice(a*SR,(a+10)*SR); r=lambda x:20*np.log10(np.sqrt(np.mean(x[sl]**2))+1e-9)
        print(a, 'voz %.1f  fundo %.1f' % (r(voz), r(bed)))
    sys.exit()
fo = int(3.0 * SR); out[-fo:] *= np.linspace(1, 0, fo)
peak = np.abs(out).max(); print('pico', peak)
a = np.abs(out); T = 0.85
out = np.where(a > T, np.sign(out) * (T + 0.14 * np.tanh((a - T) / 0.14)), out)   # limitador suave
print('pico final', np.abs(out).max())
st = np.stack([out, out], 1).astype(np.float32)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-',
                os.path.join(HERE, 'trilha_final.wav')], input=st.tobytes(), check=True)
print('ok', TOTAL)
