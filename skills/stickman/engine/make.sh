#!/usr/bin/env bash
# build the stick-figure story: audio mix + parallel shot render + mux -> seed.mp4
set -euo pipefail
cd "$(dirname "$0")"; WORKERS=${WORKERS:-6}
PY=${STICKMAN_PY:-$HOME/.stickman/venv/bin/python}; [ -x "$PY" ] || PY=python3
"$PY" audio.py
mkdir -p seg; find seg -maxdepth 1 -name 'shot_*.mp4' -delete
N=$(grep -c "^shot(" web/shots.js); pids=()
for ((w = 0; w < WORKERS; w++)); do
  ids=""; for ((i = w; i < N; i += WORKERS)); do ids="${ids:+$ids,}$i"; done
  [ -n "$ids" ] && { node render.js segments "$ids" > seg/log$w.txt 2>&1 & pids+=($!); }
done
for p in "${pids[@]}"; do wait "$p"; done
[ "$(ls seg/shot_??.mp4 | wc -l)" -eq "$N" ] || { echo "a shot failed, see seg/log*.txt"; exit 1; }
for f in seg/shot_??.mp4; do echo "file '$PWD/$f'"; done > seg/list.txt
ffmpeg -v error -y -f concat -safe 0 -i seg/list.txt -c copy silent.mp4
ffmpeg -v error -y -i silent.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy -af "alimiter=limit=0.85:attack=2:release=60,loudnorm=I=-14:TP=-1.5:LRA=9" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart seed.mp4
echo done
