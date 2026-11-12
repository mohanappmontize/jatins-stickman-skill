import json,re
src=open('web/words.js').read()
W=json.loads(re.search(r'const WORDS=(.*?);\n',src,re.S).group(1)); rest=src[src.index('const SENT'):]
EN=json.load(open('caps_en.json')); out=[]; PH=0
for i,c in enumerate(EN):
    hw=[w for w in W if w['line']==i]; a,b=hw[0]['s'],hw[-1]['e']
    ws=c.split(); L=[len(w)+1 for w in ws]; tot=sum(L); t=a
    parts=[len(p.split()) for p in re.split(r'[,.;:?!]+',c) if p.strip()]; bounds=[]; acc=0
    for n in parts: acc+=n; bounds.append(acc)
    for k,w in enumerate(ws):
        d=(b-a)*L[k]/tot; pi=next((j for j,bb in enumerate(bounds) if k<bb),len(bounds)-1)
        out.append({'w':w,'s':round(t,3),'e':round(t+d,3),'line':i,'ph':PH+pi}); t+=d
    PH+=len(bounds)
open('web/words.js','w').write('const WORDS='+json.dumps(out)+';\nconst WORDS_HI='+json.dumps(W)+';\n'+rest)
print(len(out))
