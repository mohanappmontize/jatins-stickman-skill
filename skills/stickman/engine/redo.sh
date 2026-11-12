#!/usr/bin/env bash
# re-render only the listed shots, then re-concat and mux:  ./redo.sh 2 3
cd "$(dirname "$0")"; pids=()
for i in "$@"; do node render.js segments $i > seg/redo$i.txt 2>&1 & pids+=($!); done
for p in "${pids[@]}"; do wait $p; done
for f in seg/shot_??.mp4; do echo "file '$PWD/$f'"; done > seg/list.txt
ffmpeg -v error -y -f concat -safe 0 -i seg/list.txt -c copy silent.mp4
ffmpeg -v error -y -i silent.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy -af "alimiter=limit=0.85:attack=2:release=60,loudnorm=I=-14:TP=-1.5:LRA=9" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart remote_stage.mp4
ffmpeg -v error -y -i remote_stage.mp4 -c:v libx264 -crf 22 -preset medium -c:a copy -movflags +faststart remote_stage_share.mp4
echo done
