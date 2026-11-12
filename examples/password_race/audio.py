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
def A(i, k): return [x for x in WORDS if x['line'] == i][k]['s']
# ---------- music: playful heist-comedy groove ----------
M = buf(); bpm = 118; beat = 60 / bpm
NOTE = lambda n: 440 * 2 ** ((n - 69) / 12)
prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
t0 = 0.0; bar = 0
while t0 < VO_END + .6:
    ch = prog[bar % 4]; tense = sh[7] <= t0 < sh[9]; gain = .6 if tense else .5
    for k in range(8):
        tt = t0 + k * beat / 2; n_ = ch[[0, 2, 1, 2, 0, 1, 2, 1][k]] + (12 if k % 2 else 0)
        put(M, tt, tone(NOTE(n_ + 12), .3, 11), gain * .5)
    put(M, t0, tone(NOTE(ch[0] - 12), beat * 1.5, 4, (1, .6)), gain * .6); put(M, t0 + beat * 2, tone(NOTE(ch[0] - 12), beat * 1.2, 4, (1, .6)), gain * .5)
    for k in (1, 3): put(M, t0 + k * beat, lp(noise(.06), 7000) * np.exp(-np.arange(int(.06 * SR)) / SR * 50) * .5, gain * .35)
    put(M, t0, thud(.15), gain * .35); put(M, t0 + 2 * beat, thud(.15), gain * .35)
    if tense: put(M, t0, tone(NOTE(33), beat * 4, 1.2, (1, .5)), .35)
    t0 += beat * 4; bar += 1
put(M, sh[11] + .1, np.sum([tone(NOTE(n), 2.4, 1.5, (1, .4, .2)) for n in (60, 64, 67, 72)], axis=0), .5)
# ---------- sfx ----------
S = buf()
for i in (0, 1, 3, 5, 6, 9): e = sh[i + 1]; put(S, e - .27, whoosh(e - .27, .42), .5)
def click(t): put(S, t, pop(1500, .05), .7)
def buzz(t): put(S, t, tone(140, .35, 4, (1, .8, .6)), .7)
put(S, A(0, 3), chime(NOTE(88), .8), .35); put(S, A(0, 3) + .05, tone(300, .3, 6), .4)
for k in range(8): put(S, sh[0] + .1 + k * .33, thud(.08), .25)
put(S, A(1, 5), pop(600, .15), .6); put(S, sh[1] + 2.5, thud(.25), .7)
for k in range(4): put(S, A(2, 2) + k * .28, pop(500 + k * 60, .1), .5)
buzz(A(3, 8)); put(S, A(3, 8), pop(250, .2), .8)
buzz(A(5, 6)); 
for ti in (.5, 1.4, 2.25, 2.7): put(S, sh[6] + ti + .3, thud(.22), .9); put(S, sh[6] + ti + .3, tone(1800, .08, 25, (1,)), .5)
for i, k in enumerate((2, 4, 5, 6, 7)): put(S, A(7, k), pop(300 - i * 20, .18), .7)
put(S, sh[7] + 2.3, whoosh(sh[7] + 2.3, .3), .5)
put(S, A(9, 4), chime(NOTE(84), 1.0), .4); put(S, A(9, 4) + .12, chime(NOTE(88), 1.2), .35)
b = A(10, 1)
for k in range(5): put(S, b + k * .06, pop(1200 + k * 150, .08), .6)
put(S, b, lp(noise(.5), 3000) * np.exp(-np.arange(int(.5 * SR)) / SR * 8), 1.0)
o = A(10, 9) - .1; put(S, o, chime(NOTE(96), 1.2), .45)
for k, n in enumerate((72, 76, 79, 84)): put(S, o + .1 + k * .12, chime(NOTE(n), 1.0), .3)
put(S, A(11, 2), chime(NOTE(79), 1.0), .35); put(S, sh[11] + .1, pop(480, .2), .5)
# ---------- mix ----------
sr, vo = wavfile.read('audio/vo.wav'); vo = vo.astype(np.float32) / 32768; V = buf(); V[:len(vo)] = vo[:N]
e = np.abs(V); k = int(.12 * SR); e = np.convolve(e, np.ones(k) / k, 'same'); e = np.clip(e / (e.max() * .5), 0, 1)
duck = 1 - .72 * e
mix = V * 1.0 + M * duck * .55 + S * .62
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
wavfile.write('audio/mix.wav', SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16)); print('mix ok', N / SR)
