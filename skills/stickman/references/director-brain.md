# Director brain: how to build animation that is "intelligent" (read BEFORE writing shots.js)
The failures so far (floating legs, moonwalking, characters through each other, huge/tiny props, wrong cricket positions, teacher falling on a kid) all came from placing things by eye. Fix = think like a director + animator, in this order, and write it down BEFORE code.

## 1. Shot card (write for every shot, 6 lines, in a comment above the shot)
- PLACE: which stage (classroom/cricket/street/...) and which named places each actor uses (S.at('crease')).
- ACTORS: type (stick / human / animal), size from depth (S.kid(y)/S.adult(y)), facing, who is nearest the camera.
- ACTION BEATS: 2-4 beats with times anchored to spoken words (A(k)/L('word')): before -> action -> reaction.
- CONTACT: every beat that touches something: which hand, which object, where the object is in world coords (hand pos is known: use IK + prop callback). If a hand cannot reach (reach ~ .27*s from the shoulder) change the staging (throw, jump, move closer), never stretch/lean a body.
- CAMERA/FRAME: wide / medium / close-up (closeup:true allowed to crop). Everything else inside x .26s..W-.26s.
- CONTINUITY: where each actor/prop ends so the next shot starts there.

## 2. Space and scale (stage.js)
- One ground plane per stage. Actor feet y decides size: s = S.kid(y) / S.adult(y). Props use real size: S.px(y, REAL.bus / bin / desk / stumps...). A bus is bigger than a kid, a bin is knee-high, a desk is waist-high.
- Depth order: draw far (small y) first, near last, drawCast(ctx,[...]) does it. Hero is drawn LAST and nothing frozen/background may sit behind the hero's body: give every actor its own x lane (>= .5*s apart) unless the story needs contact.
- Named places only. Never invent x,y inline for sports/room set-ups (batter on the crease with stumps BEHIND him; bowler at far end; fielders on the far side; teacher beside the board; students at desks facing the board).

## 3. Characters (stick / human / animal share one pose API)
- Walking = walker(x0,x,s,gait): feet planted, legs follow travel direction, body faces travel direction, never slide, stop on a settled pose. Run = bigger stride/lift/lean. Sitting = SIT legs + bob, desk drawn AFTER the actor.
- Facing: actor looks at what they interact with (flip toward it). Eyes/head tilt toward the target (look:[x,y]).
- Natural poses only: no leaning/falling bodies to reach things, no arms through bodies, hands hold props at the hand point, one prop per hand.
- Expressions match beat: happy = eyes happy + grin; never drops/sweat on a happy face; angry = browAng + frown; talking = talk:0..1.
- Anticipation + follow-through on every action (wind-up before a hit/throw, settle after). Reaction shot for the second character.

## 3b. Camera angle of each character (view intelligence)
Pick the view per character per beat, not one view for the whole video:
- FRONT (default stand/idle): talking to the audience, hook close-ups, big reactions, posters, group poses.
- 3/4 (`view:'3q'`, face turns, torso narrows): two characters talking to each other, looking at an object/other actor off to the side, pointing, reacting to something. Set flip toward the partner.
- SIDE / profile (automatic when you use `walker()`; or `view:'side'`): walking, running, chasing, carrying, entering/exiting, crossing the street, any travel across the screen. Humans get a real profile walk (arm/leg counter-swing, bob, planted feet); never move a front-facing character sideways.
- Switch at the start/end of motion: front/3q -> side when he starts walking, side -> 3q/front when he stops and speaks.
- Animals use their real locomotion in side view, upright cartoon pose for talking/gesturing: panda/bear = heavy lateral-sequence quadruped walk, cat = diagonal trot with tail up, bunny = hop (crouch, launch, air, land, ears flop), robot = stiff piston walk. Use `walker(x0,x,s,{})` with `species:'cat'`... then draw with drawActor; for talking switch to `view:'front'`/`'upright'` mascot pose. Dogs/others: add a TOON_SPECIES + TOON_SIDE entry (gait 'walk' or 'trot').
- Stick figures keep their front-style walk (that is the stickman look).
Samples: thumbs/walks_side_views.jpg (human, teacher, panda, cat, bunny, robot walk cycles) and thumbs/views_front_3q_side.jpg.

## 4. Story physics
- "Freeze/pause": tint everything frozen (freezeFX BEFORE drawing the hero), hero in full colour; frozen things stop at their last pose.
- Cause -> visible effect: if narration says X happens, show X (wig lands on head, ball leaves the bat, bus stops). No magic pops without a thrown/applied object.
- Props have ownership: where it starts, who holds it, where it ends.

## 5. Pre-render gate (automatic + manual)
1. `node render.js stills T1,T2,...` prints CROP / OVERLAP warnings. Fix every one that is not intentional (mark intentional exits with cropOK:true, close-ups with closeup:true).
2. Look at ONE contact sheet and answer: Is anyone cut/overlapped/floating? Is every size believable? Does each hand touch what it should? Does each actor face what it looks at? Is it natural, not just technically placed? (the checker cannot judge naturalness: you must).
3. Only then render. Fix single shots with `./redo.sh <shot numbers>` (re-renders only those).

## 6. Token discipline
- One contact sheet per check, never one image per frame. Fix from warnings first. Reuse stage places, human/toon kits and helper snippets from the last project instead of rewriting.
