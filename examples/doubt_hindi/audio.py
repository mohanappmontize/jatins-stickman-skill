import json, re, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR = 44100
src = open('web/words.js').read()
WORDS = json.loads(re.search(r'const WORDS_HI=(.*?);\n', src, re.S).group(1)); SENT = json.loads(re.search(r'const SENT=(.*?);\n', src).group(1)); VO_END = float(re.search(r'VO_END=([\d.]+)', src).group(1))
sh = [0] + [s[0] for s in SENT[1:]]
def W(w, l=None): return next(x['s'] for x in WORDS if x['w'].lower() == w.lower() and (l is None or x['line'] == l))
N = int((VO_END + 1.6) * SR)
def buf(): return np.zeros(N, np.float32)
def put(b, t, x, g=1.0):
    i = int(t * SR)
    if i >= N: return
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
    ch = prog[bar % 4]; tense = sh[10] <= t0 < sh[11]; gain = .6 if tense else .5
    for k in range(8):
        tt = t0 + k * beat / 2; n_ = ch[[0, 2, 1, 2, 0, 1, 2, 1][k]] + (12 if k % 2 else 0)
        put(M, tt, tone(NOTE(n_ + 12), .3, 11), gain * .5)
    put(M, t0, tone(NOTE(ch[0] - 12), beat * 1.5, 4, (1, .6)), gain * .6); put(M, t0 + beat * 2, tone(NOTE(ch[0] - 12), beat * 1.2, 4, (1, .6)), gain * .5)
    for k in (1, 3): put(M, t0 + k * beat, lp(noise(.06), 7000) * np.exp(-np.arange(int(.06 * SR)) / SR * 50) * .5, gain * .35)
    put(M, t0, thud(.15), gain * .35); put(M, t0 + 2 * beat, thud(.15), gain * .35)
    if tense: put(M, t0, tone(NOTE(33), beat * 4, 1.2, (1, .5)), .35)
    t0 += beat * 4; bar += 1
put(M, sh[12] + .1, np.sum([tone(NOTE(n), 2.4, 1.5, (1, .4, .2)) for n in (60, 64, 67, 72)], axis=0), .5)
# ---------- sfx ----------
S = buf()
for i in (0, 8, 10, 11): put(S, sh[i] - .15, whoosh(sh[i] - .15, .35), .5)
put(S, sh[0] + .6, pop(760, .15), .6)
put(S, A(3, 2), pop(420, .12), .5); put(S, A(3, 5), pop(600, .12), .5)
put(S, A(5, 2) + .05, pop(300, .06), .5)
h = A(6, 3) + .1
put(S, h, thud(.3), 1.2); put(S, h, lp(noise(.25), 3000) * np.exp(-np.arange(int(.25 * SR)) / SR * 14), 1.1); put(S, h + .05, gliss(900, 200, .45, 3), .6)
for k, n in enumerate((88, 91, 95)): put(S, h + .3 + k * .1, chime(NOTE(n), .6), .2)
put(S, A(7, 2), pop(520, .12), .5)
put(S, A(8, 4), chime(NOTE(84), 1.0), .4); put(S, A(8, 4) + .1, chime(NOTE(91), 1.2), .35)
for k in range(3): put(S, sh[9] + .3 + k * .3, pop(500 + k * 120, .1), .5)
c = A(10, 2)
put(S, c, gliss(700, 60, .9, 2), .7); put(S, c, bp(noise(.5), 500, 5000) * np.exp(-np.arange(int(.5 * SR)) / SR * 5), .8)
for k in range(3): put(S, c + .5 + k * .22, tone(880, .12, 18, (1,)), .5)
hit = sh[11] + (sh[12] - sh[11]) - .25
put(S, hit - .3, whoosh(hit - .3, .3), .7); put(S, hit, thud(.35), 1.3); put(S, hit, lp(noise(.25), 3000) * np.exp(-np.arange(int(.25 * SR)) / SR * 14), 1.1); put(S, hit + .05, gliss(800, 150, .5, 3), .6)
put(S, sh[12] + .1, gliss(300, 500, .5, 2), .4); put(S, A(12, 1), pop(500, .2), .8); put(S, A(12, 1) + .1, chime(NOTE(84), 1.2), .4)
# ---------- mix ----------
sr, vo = wavfile.read('audio/vo.wav'); vo = vo.astype(np.float32) / 32768; V = buf(); V[:len(vo)] = vo[:N]
e = np.abs(V); k = int(.12 * SR); e = np.convolve(e, np.ones(k) / k, 'same'); e = np.clip(e / (e.max() * .5), 0, 1)
duck = 1 - .72 * e
mix = V * 1.0 + M * duck * .55 + S * .62
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
wavfile.write('audio/mix.wav', SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16)); print('mix ok', N / SR)
