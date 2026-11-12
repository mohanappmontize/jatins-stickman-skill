import json, subprocess, numpy as np
S = json.load(open('script.json')); caps = {}
import os
GAP = json.load(open('gaps.json')) if os.path.exists('gaps.json') else []   # optional per-sentence pause list; default .3 s
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
t = 0.0; words = []; sent = []; parts = []; import re; PH = 0
for i in range(len(S)):
    f = f'audio/s{i:02d}.mp3'; subprocess.run(['ffmpeg','-v','error','-y','-i',f,'-ac','1','-ar','44100',f'audio/s{i:02d}.wav'],check=True)
    d = dur(f); ws = json.load(open(f'audio/s{i:02d}.json'))
    # lead trim: shift so first word starts at 0.05
    lead = max(0, ws[0][1]-0.05)
    counts = [len(p.split()) for p in re.split(r'[,.;:?!।]+', S[i]) if p.strip()]; bounds = []; acc = 0
    for c in counts: acc += c; bounds.append(acc)
    for k,(w,s,e) in enumerate(ws):
        pi = next((j for j,b in enumerate(bounds) if k < b), len(bounds)-1)
        words.append({'w':w,'s':round(t+s-lead,3),'e':round(t+e-lead,3),'line':i,'ph':PH+pi})
    PH += len(bounds)
    sent.append([round(t,3), round(t+d-lead,3)])
    parts.append((f'audio/s{i:02d}.wav', t-lead))
    t += d - lead + (0 if i == len(S) - 1 else (GAP[i] if i < len(GAP) else .3))
total = t
import wave
sr=44100; buf = np.zeros(int((total+1)*sr), dtype=np.float32)
for f,off in parts:
    w = wave.open(f); a = np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
    st = int(max(0,off)*sr); buf[st:st+len(a)] += a[:len(buf)-st]
from scipy.io import wavfile
wavfile.write("audio/vo.wav", sr, (np.clip(buf,-1,1)*32767).astype(np.int16))
open('web/words.js','w').write('const WORDS='+json.dumps(words)+';\nconst SENT='+json.dumps(sent)+';\nconst VO_END='+str(round(total,3))+';\n')
print(total, sent)
