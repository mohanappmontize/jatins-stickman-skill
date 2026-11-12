#!/usr/bin/env bash
# Sets up the tools the /stickman skill needs. Safe to re-run.
set -e
H="$HOME/.stickman"; mkdir -p "$H"
need() { command -v "$1" >/dev/null 2>&1 || { echo "MISSING: $1 -> $2"; MISS=1; }; }
MISS=0
need node "install Node.js 18+ (https://nodejs.org)"; need python3 "install Python 3.9+"; need ffmpeg "install ffmpeg (apt install ffmpeg / brew install ffmpeg)"; need npm "comes with Node.js"
[ "$MISS" = 1 ] && { echo "Install the missing tools above, then run this again."; exit 1; }
echo "==> Python venv (edge-tts, numpy, scipy)"
python3 -m venv "$H/venv"
"$H/venv/bin/pip" install -q --upgrade pip
"$H/venv/bin/pip" install -q edge-tts numpy scipy
echo "==> Playwright + Chromium (used to render frames)"
cd "$H"; [ -f package.json ] || echo "{\"name\":\"stickman-runtime\",\"version\":\"1.0.0\",\"private\":true}" > package.json
npm install --silent playwright
npx --yes playwright install chromium
cp "$(dirname "$0")/doctor.sh" "$H/doctor.sh" 2>/dev/null || true; chmod +x "$H/doctor.sh" 2>/dev/null || true
echo "Setup done. Check with: bash ~/.stickman/doctor.sh"
