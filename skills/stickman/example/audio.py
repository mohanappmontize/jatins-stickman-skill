import json, re, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR = 44100
src = open('web/words.js').read()
WORDS = json.loads(re.search(r'const WORDS=(.*?);\n', src, re.S).group(1)); SENT = json.loads(re.search(r'const SENT=(.*?);\n', src).group(1)); VO_END = float(re.search(r'VO_END=([\d.]+)', src).group(1))
sh = [0] + [s[0] for s in SENT[1:]]
def W(w, l=None): return next(x['s'] for x in WORDS if x['w'].lower() == w.lower() and (l is None or x['line'] == l))
N = int((VO_END + 1.6) * SR)
def buf(): return np.zeros(N, np.float32)
def put(b, t, x, g=1.0):
    i = int(t * SR); 
    if i < 0: x = x[-i:]; i = 0
    j = min(N, i + len(x)); b[i:j] += g * x[:j - i]
def env(n, a=.005, d=6.0): t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t * d)
def tone(f, dur, d=6, h=(1, .35, .15)):
    t = np.arange(int(dur * SR)) / SR; x = sum(a * np.sin(2 * np.pi * f * (k + 1) * t) for k, a in enumerate(h)); return (x * env(len(t), .004, d)).astype(np.float32)
def noise(dur): return np.random.RandomState(1).randn(int(dur * SR)).astype(np.float32)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x).astype(np.float32)
def lp(x, f): b, a = butter(2, f / (SR / 2), 'low'); return lfilter(b, a, x).astype(np.float32)
def whoosh(t, dur=.4, g=.5):
    n = noise(dur); k = np.arange(len(n)) / len(n); out = np.zeros_like(n)
    for lo, hi in [(300, 900), (900, 2600), (2600, 6000)]:
        out += bp(n, lo, hi) * np.sin(np.pi * k) ** 2 * (1 + 0)
    return out * g
def pop(f=520, dur=.12): t = np.arange(int(dur * SR)) / SR; x = np.sin(2 * np.pi * (f * (1 + 1.2 * np.exp(-t * 40))) * t); return (x * np.exp(-t * 28)).astype(np.float32)
def thud(dur=.22): t = np.arange(int(dur * SR)) / SR; x = np.sin(2 * np.pi * (70 + 60 * np.exp(-t * 30)) * t) * np.exp(-t * 14) + lp(noise(dur), 800) * np.exp(-t * 22) * .4; return x.astype(np.float32)
def chime(f, dur=1.0): return tone(f, dur, 3.2, (1, .5, .25, .12))
def gliss(f0, f1, dur, d=2.0):
    t = np.arange(int(dur * SR)) / SR; f = f0 * (f1 / f0) ** (t / dur); ph = 2 * np.pi * np.cumsum(f) / SR; return (np.sin(ph) * np.minimum(1, t / .02) * np.exp(-t * d)).astype(np.float32)
# ---------- music ----------
M = buf(); bpm = 100; beat = 60 / bpm
NOTE = lambda n: 440 * 2 ** ((n - 69) / 12)
bright = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]      # C G Am F
sad = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]          # Am F C G
t0 = 0.0; bar = 0
while t0 < VO_END + .6:
    sect = 'bright' if t0 < sh[4] else 'sad' if t0 < sh[7] else 'hope'
    ch = (sad if sect == 'sad' else bright)[bar % 4]
    gain = .5 if sect == 'sad' else .6 if sect == 'bright' else .72
    for k in range(8):
        tt = t0 + k * beat / 2; n = ch[[0, 1, 2, 1, 0, 1, 2, 1][k]] + (12 if sect == 'hope' and k % 2 else 0)
        put(M, tt, tone(NOTE(n + 12), .5, 7 if sect != 'sad' else 5), gain * .5)
    put(M, t0, tone(NOTE(ch[0] - 12), beat * 2, 3, (1, .5)), gain * .55)
    if sect != 'sad':
        put(M, t0 + beat * 2, tone(NOTE(ch[0] - 12), beat * 1.5, 3, (1, .5)), gain * .4)
        for k in (1, 3): put(M, t0 + k * beat, lp(noise(.05), 6000) * np.exp(-np.arange(int(.05 * SR)) / SR * 60) * .5, gain * .35)
    t0 += beat * 4; bar += 1
# resolve
put(M, sh[10] + .1, np.sum([tone(NOTE(n), 2.4, 1.5, (1, .4, .2)) for n in (60, 64, 67, 72)], axis=0), .5)
# ---------- sfx ----------
S = buf()
tr = {0, 2, 4, 5, 6, 8}
for i in tr: e = sh[i + 1]; put(S, e - .27, whoosh(e - .27, .42), .55)
lau = W('everyone'); put(S, lau + .05, pop(540), .6); put(S, lau + .25, pop(640), .6)
put(S, sh[1] + .02, pop(500), .6); put(S, W('never') - .05, pop(560), .6)
for n in range(3): put(S, sh[2] + n / 1.55, thud(), .8); put(S, sh[2] + (n + .62) / 1.55, lp(noise(.25), 1500) * np.exp(-np.arange(int(.25 * SR)) / SR * 14), .5)
put(S, sh[2] + 2.65, pop(380, .18), .7); put(S, sh[2] + 2.78, lp(noise(.3), 1800) * np.exp(-np.arange(int(.3 * SR)) / SR * 10), .6); put(S, sh[2] + 3.2, chime(1318, .8), .35)
d3 = sh[4] - sh[3]; put(S, sh[3], bp(noise(d3), 1500, 5000) * (.5 + .5 * np.sin(np.arange(int(d3 * SR)) / SR * 40)) * .22)
for k in range(4): put(S, sh[3] + k * d3 / 4, chime(660 + k * 110, .6), .2)
put(S, sh[4] + 2.1, gliss(420, 190, .8, 2.5), .45)
tf = np.arange(int(2.6 * SR)) / SR; put(S, sh[4] + .1, (np.sin(2 * np.pi * 180 * tf + 8 * np.sin(2 * np.pi * 9 * tf)) * .05 * np.abs(np.sin(2 * np.pi * 2.2 * tf))).astype(np.float32), 1)
rd = (sh[7] + .6) - (sh[6] - .3); put(S, sh[6] - .3, bp(noise(rd), 2000, 9000) * np.minimum(1, np.arange(int(rd * SR)) / SR / .6) * .34)
put(S, sh[6] + .15, lp(noise(1.6), 140) * np.exp(-np.arange(int(1.6 * SR)) / SR * 1.5) * 1.6)
pop_t = W('pushed')
qk = np.arange(int(.9 * SR)) / SR; put(S, pop_t - .9, (np.sin(2 * np.pi * 55 * qk) * (qk / .9) * .35 * (1 + np.sin(2 * np.pi * 14 * qk))).astype(np.float32))
put(S, pop_t, pop(300, .3), .9)
for k, n in enumerate((72, 76, 79, 84, 88)): put(S, pop_t + .05 + k * .09, chime(NOTE(n), 1.3), .42)
gold = W('golden'); rs = np.arange(int(2.4 * SR)) / SR; put(S, sh[8], (np.sin(2 * np.pi * np.cumsum(180 + 380 * (rs / 2.4) ** 2) / SR) * (rs / 2.4) * .12).astype(np.float32))
for i in range(9): put(S, gold + i / 2.6, pop(620 + (i % 5) * 120, .14), .5); put(S, gold + i / 2.6 + .03, chime(NOTE(84 + [0, 2, 4, 7, 9][i % 5]), .5), .22)
for x in (1.25, 1.95, 2.65): put(S, sh[9] + x - .3, whoosh(0, .3), .3); put(S, sh[9] + x + .5, pop(700, .12), .6); put(S, sh[9] + x + .55, chime(NOTE(88), .7), .25)
put(S, sh[10] + .15, pop(480, .2), .6); put(S, sh[10] + .45, pop(600, .2), .6)
for k in range(6): put(S, sh[10] + .6 + k * .35, chime(NOTE(91 + [0, 3, 5, 7, 5, 3][k]), .6), .13)
# ---------- mix ----------
sr, vo = wavfile.read('audio/vo.wav'); vo = vo.astype(np.float32) / 32768; V = buf(); V[:len(vo)] = vo[:N]
e = np.abs(V); k = int(.12 * SR); e = np.convolve(e, np.ones(k) / k, 'same'); e = np.clip(e / (e.max() * .5), 0, 1)
duck = 1 - .72 * e
mix = V * 1.0 + M * duck * .55 + S * .62
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
wavfile.write('audio/mix.wav', SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16)); print('mix ok', N / SR)
