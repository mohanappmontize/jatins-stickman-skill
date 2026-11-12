import asyncio, json, sys, edge_tts
import os
S = json.load(open('script.json'))
SP = json.load(open('speakers.json')) if os.path.exists('speakers.json') else ['A']*len(S)
VOICE = open('voice.txt').read().strip() if os.path.exists('voice.txt') else 'en-US-AndrewNeural'   # hi: hi-IN-MadhurNeural / hi-IN-SwaraNeural
async def main():
    words = []; audio = bytearray(); off0 = 0
    # one call per sentence so sentence starts are exact; join with 0.35s gaps later
    import subprocess
    for li, s in enumerate(S):
        for attempt in range(6):
            try:
                c = edge_tts.Communicate(s, VOICE, rate=('+8%' if SP[li]=='B' else '+0%'), pitch=('+28Hz' if SP[li]=='B' else '+0Hz'), boundary='WordBoundary')
                data = bytearray(); ws = []
                async for ch in c.stream():
                    if ch['type'] == 'audio': data += ch['data']
                    elif ch['type'] == 'WordBoundary': ws.append((ch['text'], ch['offset']/1e7, (ch['offset']+ch['duration'])/1e7))
                if len(ws) < len(s.replace('.',' ').replace(',',' ').split()): raise RuntimeError('truncated %d words' % len(ws))
                break
            except Exception as e:
                print('retry', li, e); await asyncio.sleep(2 + attempt * 2)
        open(f'audio/s{li:02d}.mp3','wb').write(data)
        json.dump(ws, open(f'audio/s{li:02d}.json','w'))
asyncio.run(main())
