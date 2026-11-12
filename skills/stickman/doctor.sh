#!/usr/bin/env bash
# Verifies the /stickman toolchain. Prints OK/FAIL per item.
H="$HOME/.stickman"; bad=0
chk() { if eval "$2" >/dev/null 2>&1; then echo "OK   $1"; else echo "FAIL $1  ($3)"; bad=1; fi; }
chk "node" "node -v" "install Node.js 18+"
chk "ffmpeg" "ffmpeg -version" "install ffmpeg"
chk "venv python" "[ -x $H/venv/bin/python ]" "run install.sh"
chk "edge-tts" "$H/venv/bin/python -c 'import edge_tts'" "run install.sh"
chk "numpy/scipy" "$H/venv/bin/python -c 'import numpy, scipy'" "run install.sh"
chk "playwright" "node -e \"require('$H/node_modules/playwright')\"" "run install.sh"
chk "chromium" "node -e \"const p=require('$H/node_modules/playwright');const fs=require('fs');process.exit(fs.existsSync(p.chromium.executablePath())?0:1)\"" "run install.sh"
[ $bad = 0 ] && echo "ALL GOOD - type /stickman in Claude Code" || { echo "Some checks failed: run bash ~/.claude/skills/stickman/install.sh"; exit 1; }
