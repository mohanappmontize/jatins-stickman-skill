# /stickman modes (learned from kaomei/stickman-video-director, rebuilt as code style packs)
Pick with `useStyle('<id>')` at the TOP of web/shots.js. Backgrounds: `BG(ctx,t,cam,opts)`. Characters: `drawStick(ctx, Object.assign(ACTOR({x,y,s,...}), gaitPose(dist,s)))`. Preview of all packs: `modes_preview.jpg` (14 frames).
All packs are 9:16 (1080x1920) for now. 16:9 is not built yet; say so if asked.

| id | Mode | Look | Story fit / rules |
|---|---|---|---|
| candy | Kids Colourful (default) | saturated cartoon world, striped shirts, pop captions | fables, morals, funny shorts |
| cozy | S4 Cozy Storytelling | warm full-colour rooms/outdoors, white heads, dark limbs, dot eyes | gentle life lessons, anxiety/science/education explainers. NEW SETTING EVERY ~10 s (office->commute->park), vertical depth, hook->conflict->insight->callback. Cozy = visual warmth, not always cheerful |
| classic_light / classic_dark | S1 Classic Minimalist | pure white (or black) canvas, black (or white) slender figure, max 3 accent colours on props | idea explainers, business/psychology; no gradients/textures; concrete actions, a visual change every 2-3 s |
| studio_tech (alias modern_pop) | A2 Modern Pop · 2A Studio Tech | white studio, light grid floor, floating cyan glass UI panels, red-beanie yellow-shirt hero, blank face | tech/AI/product explainers; keep minimal, no circuit boards |
| cinema (alias modern_pop_cinema) | A2 Modern Pop · 2B Cinematic Story | full-colour narrative worlds, cinematic light, same beanie hero | story shorts with mood changes (moodMix) |
| prehistoric | S3 Prehistoric Dark Comedy | ochre/brown world, volcano, palms, hide vests, expressive white heads | modern topics as caveman situations (workload = growing spear pile). Setup -> escalation -> ironic payoff, no forced discussion ending. Track prop ownership. Deadpan 0.5 s reaction beats. Satire, not history claims |
| historical | S5 Historical Cartoon | cel-shaded eras (`era:'egypt'|'rome'|'castle'`), period robes with gold trim, short neck | history/daily life/civilisation, physical-action pacing; freeze each cast member's costume |
| noir | A6 Amber Noir | matte-black heads, cream eye marks, amber rim light, plum night city | mystery/thriller/reflective; ACTING and reaction beats, deliberate pauses; UPPERCASE word captions; add a white corner title (sceneText) |
| b1 | B1 Minimal Line Art | warm near-white paper + faint grid, slender hand-drawn figure, Caveat scene text | explainers/habits/tech. Big short in-scene text is the focal point (`sceneText`), quiet single-line captions. Act with the whole body (lean, gaze, reach); sometimes character-free close-ups of props/diagrams. Don't repeat one entrance pattern |
| b2 | B2 Colorful Hand-Drawn | ivory paper, ink contours, muted props, dot eyes, caption on ivory label | everyday psychology/habits. Handwritten headings. DIFFERENT room/viewpoint per story; hold stable poses, don't fidget. Hands must really touch objects |
| b3 | B3 Retro TV | dark field, white/grey silhouettes with blank heads, UPPERCASE captions, CRT finish (scanlines, bloom, flicker) | explainers/warnings/pets/behaviour. Build clean first; mechanisms: progressive diagrams, framed surveillance inserts, red strike + warning card, signal glitch. If narration names a behaviour, SHOW it (approach, hide) |
| b4 | B4 Survival Thriller | cool painted night city, warm practical lights, thin black bodies with white gloves | thriller/survival. Hook in 3 s = visible anomaly + short audience-facing question; dramatic job for every text; low drone, heartbeat, impacts; escalate every ~2.5 s |
| b5 | B5 Character Explainer | warm paper; PRESENTER (`drawPresenter`) speaking bottom-right, LEFT STAGE = causal slapstick with anonymous stickmen + oversized props; up to 3 caption lines on the left | explainers/memes. Action cards per beat: before_state -> anticipation -> contact -> consequence (body changes: flattened, tangled, drained) -> secondary motion -> recovery. Prop slides are NOT action |

## Common rules (all modes)
- Hook in the first 3 s: a concrete visible anomaly/conflict, not a generic intro. Something principal changes within every 2.5 s (acting, prop contact, new info/viewpoint), not only camera drift or captions.
- Explainers use the 5-stage arc: Golden Hook -> Disrupt assumption -> Insider secret -> Ultimate truth -> memorable line (+ optional comment prompt). Fables/stories use setup -> escalation -> payoff.
- One narrator voice for the whole video, native speed, no stretching. Captions are SEMANTIC phrases (mode phrase) or pop words (mode word); never invent text that is not narrated.
- Sound = 3 layers under the voice: ambience bed (place), physical foley at contact, emotional punctuation (impact/riser/chime/silence). Never decorate every cut.
- Characters: keep one design per role through the film; objects never teleport; hand holds what it carries (use IK prop callbacks); keep faces out of caption band.
- Walking: ALWAYS `walker(x0, x, s)` (wraps gaitPose and sets the facing from the direction of travel) (feet planted, no sliding, body bob). `lift`/`stride` options for running. When stopping, end on phase ~0 or hold idle.
- Optional after approval: cover frame/thumbnail from best still + big title.

- Expressions: happy = eyes 'happy' + mouth 'grin'/'smile'. Never put drops/sweat/rain particles near the face of a happy character (reads as crying). 'teeth' is a clenched grimace, only for anger/effort.
