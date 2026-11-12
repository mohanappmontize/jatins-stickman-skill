#!/usr/bin/env bash
# Jatin's Stickman Skill - one-command installer (Linux / macOS / WSL).
#   git clone https://github.com/<owner>/jatins-stickman-skill && bash jatins-stickman-skill/install.sh
set -e
SRC="$(cd "$(dirname "$0")" && pwd)/skills/stickman"
DEST="$HOME/.claude/skills/stickman"
[ -f "$SRC/SKILL.md" ] || { echo "Run this from inside the cloned repo."; exit 1; }
mkdir -p "$HOME/.claude/skills"
if [ -d "$DEST" ]; then mv "$DEST" "$DEST.bak.$(date +%s)"; echo "Existing skill backed up."; fi
cp -r "$SRC" "$DEST"
echo "Skill copied to $DEST"
bash "$DEST/install.sh"
cp "$DEST/doctor.sh" "$HOME/.stickman/doctor.sh"
bash "$HOME/.stickman/doctor.sh"
echo; echo "Done. Open Claude Code and type /stickman"
