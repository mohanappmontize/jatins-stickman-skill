// ---------- STYLE PACKS (modes). useStyle('b3') etc. Learned from kaomei/stickman-video-director, rebuilt as code. ----------
// Each pack: char (rig overrides), cast (default costume), bg(ctx,t,cam,o), cap (caption look), finish, desc.
const rrP = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
const flat = (ctx, col) => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); };
function gridBG(ctx, cam, paper, gridCol, step = 54, depth = .5) {
  flat(ctx, paper); applyCam(ctx, cam, depth);
  ctx.strokeStyle = gridCol; ctx.lineWidth = 1.2; ctx.beginPath();
  for (let x = -1400; x < 2500; x += step) { ctx.moveTo(x, -1500); ctx.lineTo(x, 3400); }
  for (let y = -1500; y < 3400; y += step) { ctx.moveTo(-1400, y); ctx.lineTo(2500, y); }
  ctx.stroke();
}
function floorBand(ctx, y, col, edge) { ctx.fillStyle = col; ctx.fillRect(-1600, y, 4400, 2200); if (edge) { ctx.beginPath(); ctx.moveTo(-1600, y); ctx.lineTo(2800, y); ctx.lineWidth = 4; ctx.strokeStyle = edge; ctx.stroke(); } }
function skyGrad(ctx, cam, top, bot, y1 = 1200) { applyCam(ctx, cam, .08); drawSky(ctx, top, bot, -1100, y1); }
function tinyWindow(ctx, x, y, w, h, on) { ctx.fillStyle = on ? '#ffb347' : 'rgba(20,10,30,.6)'; ctx.fillRect(x, y, w, h); }
function skyline(ctx, base, seed, col, lit, minH = 260, maxH = 640, x0 = -300, x1 = 1500) {
  const R = rng(seed); let x = x0;
  while (x < x1) { const w = 120 + R() * 150, h = minH + R() * (maxH - minH); ctx.fillStyle = col; ctx.fillRect(x, base - h, w, h + 400);
    if (lit) for (let wy = base - h + 30; wy < base - 30; wy += 54) for (let wx = x + 16; wx < x + w - 26; wx += 40) if (R() < .5) tinyWindow(ctx, wx, wy, 20, 28, true);
    x += w + 6 + R() * 20; }
}
function rocks(ctx, base, seed, col, n = 9) { const R = rng(seed); for (let i = 0; i < n; i++) { const x = -300 + R() * 1700, y = base + 60 + R() * 700, s = 50 + R() * 90 * (1 + (y - base) / 900); ctx.beginPath(); ctx.ellipse(x, y, s * 1.2, s * .7, 0, Math.PI, 0); ctx.closePath(); fillStroke(ctx, col, 6); } }
function palm(ctx, x, y, s) { ctx.beginPath(); ctx.moveTo(x - 14 * s, y); ctx.quadraticCurveTo(x + 10 * s, y - 120 * s, x + 20 * s, y - 220 * s); ctx.lineTo(x + 36 * s, y - 220 * s); ctx.quadraticCurveTo(x + 24 * s, y - 120 * s, x + 14 * s, y); ctx.closePath(); fillStroke(ctx, '#b0793c', 5);
  for (let i = 0; i < 6; i++) { const a = -2.6 + i * .42; ctx.beginPath(); ctx.moveTo(x + 28 * s, y - 220 * s); ctx.quadraticCurveTo(x + 28 * s + Math.cos(a) * 80 * s, y - 220 * s + Math.sin(a) * 80 * s - 30 * s, x + 28 * s + Math.cos(a) * 150 * s, y - 220 * s + Math.sin(a) * 90 * s + 40 * s); ctx.quadraticCurveTo(x + 28 * s + Math.cos(a) * 80 * s, y - 220 * s + Math.sin(a) * 80 * s + 10 * s, x + 28 * s, y - 220 * s); fillStroke(ctx, '#3fa35b', 5); } }
function glassPanel(ctx, x, y, w, h, t, i) { ctx.save(); ctx.translate(x, y + Math.sin(t * 1.4 + i) * 12); const g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, 'rgba(120,220,255,.55)'); g.addColorStop(1, 'rgba(60,120,255,.35)'); rrP(ctx, 0, 0, w, h, 22); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.7)'; for (let k = 0; k < 4; k++) ctx.fillRect(24, 28 + k * 26, (w - 48) * (.4 + .5 * ((k * 37 + i * 11) % 10) / 10), 10); ctx.restore(); }

const STYLES = {
  candy: { name: 'Kids Colourful (default)', desc: 'Bright saturated cartoon world, big white heads, striped shirts, whip transitions, pop captions',
    cast: { cols: PAL.red, hat: 'none' }, bg: (ctx, t, cam, o = {}) => drawWorld(ctx, t, cam, o.M || MOODS.day, o), cap: { mode: 'word', font: 'Poppins', size: 70, fill: '#fff', stroke: '#111', sw: 13, y: 1345, lower: true }, finish: 'grade' },
  cozy: { name: 'S4 Cozy Storytelling', desc: 'Warm full-colour 2D settings, minimalist white-filled characters with dark stick limbs, varied locations',
    char: { limbW: .03, legL: .16, headR: .18, headDrop: .22, eyeMode: 'dot', ink: '#2a2230' }, cast: { cols: ['#ffffff', '#ffffff'], belt: false }, bg: (ctx, t, cam, o = {}) => drawWorld(ctx, t, cam, o.M || MOODS.gold, o), cap: { mode: 'phrase', font: 'Nunito', size: 58, fill: '#fff', stroke: '#3a2a20', sw: 12, y: 1620 }, finish: 'grade' },
  classic_light: { name: 'S1 Classic Minimalist (light)', desc: 'Pure white canvas, black stick figure, max three saturated accent colours on props',
    char: { torso: 'line', limbW: .022, lw: .016, legL: .17, torsoLen: .27, headR: .14, headDrop: .19, shoulderX: .012, ink: '#111', head: '#fff', headSh: '#fff', eyeMode: 'dot', noBrows: true, face: '#111' }, cast: {}, bg: (ctx, t, cam) => { flat(ctx, '#fff'); applyCam(ctx, cam, 1); ctx.beginPath(); ctx.ellipse(540, 1760, 420, 30, 0, 0, TAU); ctx.fillStyle = 'rgba(0,0,0,.05)'; ctx.fill(); },
    cap: { mode: 'phrase', font: 'Nunito', size: 54, fill: '#111', stroke: null, sw: 0, y: 1700 }, finish: 'none' },
  classic_grey: { name: 'S1 Classic Minimalist (soft grey studio)', desc: 'Soft grey studio floor, black stick figures, red/blue/orange accents; best for two-character gag dialogues',
    char: { torso: 'line', limbW: .022, lw: .016, legL: .17, torsoLen: .27, headR: .14, headDrop: .19, shoulderX: .012, ink: '#111', head: '#fff', headSh: '#fff', eyeMode: 'dot', noBrows: true, face: '#111' }, cast: {}, bg: (ctx, t, cam) => { flat(ctx, '#e8ecf3'); applyCam(ctx, cam, 1); ctx.fillStyle = '#dce2ec'; ctx.fillRect(-1600, 1730, 4400, 1200); ctx.beginPath(); ctx.moveTo(-1600, 1730); ctx.lineTo(2800, 1730); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.stroke(); },
    cap: { mode: 'phrase', font: 'Nunito', size: 74, fill: '#111', stroke: '#fff', sw: 14, y: 1745 }, finish: 'none' },
  classic_dark: { name: 'S1 Classic Minimalist (dark)', desc: 'Black canvas, white stick figure, three accent colours',
    char: { torso: 'line', limbW: .022, lw: .016, legL: .17, torsoLen: .27, headR: .14, headDrop: .19, shoulderX: .012, ink: '#f4f4f4', head: '#000', headSh: '#000', eyeMode: 'dot', noBrows: true, face: '#f4f4f4' }, cast: {}, bg: (ctx, t, cam) => { flat(ctx, '#050505'); applyCam(ctx, cam, 1); ctx.beginPath(); ctx.ellipse(540, 1760, 420, 30, 0, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fill(); },
    cap: { mode: 'phrase', font: 'Nunito', size: 54, fill: '#fff', stroke: null, sw: 0, y: 1700 }, finish: 'none' },
  studio_tech: { name: 'A2 Modern Pop · Studio Tech (2A)', desc: 'White high-key studio, light grid floor, floating cyan glass UI, red-beanie yellow-shirt hero with a blank face',
    char: { eyeMode: 'none', headSh: '#e9edf3', ink: '#1b1b22' }, cast: { cols: ['#ffd23a', '#ffd23a'], hat: 'beanie', hatCol: '#e0392f', belt: false }, bg: (ctx, t, cam, o = {}) => { flat(ctx, '#fbfcff'); applyCam(ctx, cam, .8);
      const vy = 1000; ctx.strokeStyle = 'rgba(150,160,180,.38)'; ctx.lineWidth = 2; ctx.beginPath(); for (let i = -14; i <= 14; i++) { ctx.moveTo(540 + i * 40, vy); ctx.lineTo(540 + i * 360, 2600); } for (let k = 0; k < 14; k++) { const y = vy + Math.pow(k / 14, 2) * 1600 + 20; ctx.moveTo(-1400, y); ctx.lineTo(2500, y); } ctx.stroke();
      applyCam(ctx, cam, .55); (o.panels || [[80, 340, 380, 250], [640, 520, 360, 220], [300, 880, 420, 240]]).forEach((p, i) => glassPanel(ctx, p[0], p[1], p[2], p[3], t, i)); applyCam(ctx, cam, 1); },
    cap: { mode: 'word', font: 'Poppins', size: 66, fill: '#13204a', stroke: '#fff', sw: 12, y: 1345, lower: true }, finish: 'none' },
  cinema: { name: 'A2 Modern Pop · Cinematic Story (2B)', desc: 'Full-colour narrative worlds with cinematic light; same red-beanie yellow-shirt hero',
    char: { eyeMode: 'none' }, cast: { cols: ['#ffd23a', '#ffd23a'], hat: 'beanie', hatCol: '#e0392f', belt: false }, bg: (ctx, t, cam, o = {}) => drawWorld(ctx, t, cam, o.M || MOODS.dusk, o), cap: { mode: 'word', font: 'Poppins', size: 70, fill: '#fff', stroke: '#111', sw: 13, y: 1345, lower: true }, finish: 'grade' },
  prehistoric: { name: 'S3 Prehistoric Dark Comedy', desc: 'Earthy hand-drawn prehistoric world, expressive white heads, black stick limbs, animal-hide vests, ironic payoffs',
    char: { torso: 'bean', limbW: .034, lw: .021, headR: .19, eyeMode: 'googly', ink: '#1a1410' }, cast: { cols: ['#b9824a', '#9a6a38'], hat: 'none', belt: false }, bg: (ctx, t, cam, o = {}) => {
      skyGrad(ctx, cam, '#f1b46a', '#fdebc4'); applyCam(ctx, cam, .1); drawSun(ctx, 820, 330, 90, t, .8); applyCam(ctx, cam, .3);
      ctx.beginPath(); ctx.moveTo(250, 1120); ctx.lineTo(520, 640); ctx.lineTo(560, 640); ctx.lineTo(840, 1120); ctx.closePath(); fillStroke(ctx, '#8a5a44', 6); for (let i = 0; i < 5; i++) puff(ctx, 540 + Math.sin(t + i) * 30, 600 - i * 110 - (t * 30) % 110, 60 + i * 14, t, '#6d6560', 3 + i, .8 - i * .12);
      applyCam(ctx, cam, .55); hills(ctx, 1160, 80, .006, 2, '#c9914f', 6); applyCam(ctx, cam, 1); const g = ctx.createLinearGradient(0, 1130, 0, 2200); g.addColorStop(0, '#dfae6c'); g.addColorStop(1, '#b17a42'); ctx.fillStyle = g; ctx.fillRect(-1600, 1130, 4400, 1500); ctx.beginPath(); ctx.moveTo(-1600, 1130); ctx.lineTo(2800, 1130); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); rocks(ctx, 1130, 7, '#9c8f86'); palm(ctx, 120, 1150, 1.2); palm(ctx, 1010, 1140, .9); },
    cap: { mode: 'phrase', font: 'Poppins', size: 58, fill: '#fff6dc', stroke: '#3a2412', sw: 13, y: 1620 }, finish: 'grade' },
  historical: { name: 'S5 Historical Cartoon', desc: 'Cel-shaded period settings (era packs: egypt, rome, castle), white heads with short necks, period robes',
    char: { torso: 'robe', neck: .05, headDrop: .26, limbW: .026, headR: .17 }, cast: { cols: ['#c0392b', '#c0392b'], hat: 'none', trim: '#e8c04a' }, bg: (ctx, t, cam, o = {}) => {
      const era = o.era || 'egypt'; const pal = { egypt: ['#f4cf8a', '#fff0cc'], rome: ['#8fc7ef', '#fbf0d8'], castle: ['#9fb4d8', '#f6e8d0'] }[era]; skyGrad(ctx, cam, pal[0], pal[1]); applyCam(ctx, cam, .1); drawSun(ctx, 200, 340, 80, t, .7); applyCam(ctx, cam, .35);
      if (era === 'egypt') { for (const [x, h, w] of [[260, 420, 300], [720, 320, 240], [1060, 260, 200]]) { ctx.beginPath(); ctx.moveTo(x - w, 1130); ctx.lineTo(x, 1130 - h); ctx.lineTo(x + w, 1130); ctx.closePath(); fillStroke(ctx, '#e3b25f', 6); ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(120,60,10,.22)'; ctx.fillRect(x, 1130 - h, w, h); ctx.restore(); } }
      else if (era === 'rome') { for (let i = 0; i < 6; i++) { rrP(ctx, 200 + i * 130, 760, 56, 370, 8); fillStroke(ctx, '#f4efe4', 6); } ctx.beginPath(); ctx.moveTo(150, 770); ctx.lineTo(560, 620); ctx.lineTo(970, 770); ctx.closePath(); fillStroke(ctx, '#e8dfc9', 6); }
      else { rrP(ctx, 300, 700, 480, 430, 6); fillStroke(ctx, '#aeb4c0', 6); for (const x of [300, 480, 640, 740]) { rrP(ctx, x, 640, 60, 90, 4); fillStroke(ctx, '#aeb4c0', 6); } rrP(ctx, 480, 940, 120, 190, 60); fillStroke(ctx, '#5a4030', 6); ctx.beginPath(); ctx.moveTo(540, 540); ctx.lineTo(540, 700); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.moveTo(540, 540); ctx.lineTo(640, 580); ctx.lineTo(540, 620); ctx.closePath(); fillStroke(ctx, '#c0392b', 5); }
      applyCam(ctx, cam, 1); const gc = { egypt: ['#ecc87e', '#c99a4e'], rome: ['#cfd7a0', '#9bb060'], castle: ['#a6d17f', '#6aa04c'] }[era]; const g = ctx.createLinearGradient(0, 1130, 0, 2200); g.addColorStop(0, gc[0]); g.addColorStop(1, gc[1]); ctx.fillStyle = g; ctx.fillRect(-1600, 1130, 4400, 1500); ctx.beginPath(); ctx.moveTo(-1600, 1130); ctx.lineTo(2800, 1130); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); if (era === 'egypt') palm(ctx, 90, 1150, 1.1); },
    cap: { mode: 'phrase', font: 'Lora', size: 56, fill: '#fff8e6', stroke: '#3a2412', sw: 12, y: 1620, weight: 700 }, finish: 'grade' },
  noir: { name: 'A6 Amber Noir', desc: 'Matte-black heads with cream eye marks, amber light and deep plum shadows, night city; uppercase dynamic captions, white corner title',
    char: { torso: 'line', limbW: .026, lw: 0, neck: .04, headDrop: .25, headR: .17, shoulderX: .015, ink: '#0b0710', head: '#0e0a14', headSh: '#0e0a14', face: '#f3e2c0', eyeMode: 'cream', rim: 'rgba(255,175,90,.75)' }, cast: {}, bg: (ctx, t, cam, o = {}) => {
      skyGrad(ctx, cam, '#1d0f2e', '#6a2f55', 1250); applyCam(ctx, cam, .2); const g = ctx.createRadialGradient(780, 980, 20, 780, 980, 700); g.addColorStop(0, 'rgba(255,170,70,.55)'); g.addColorStop(1, 'rgba(255,170,70,0)'); ctx.fillStyle = g; ctx.fillRect(0, 300, 1500, 1500);
      applyCam(ctx, cam, .4); skyline(ctx, 1180, 4, '#1b0f27', true, 260, 700, -400, 1600); applyCam(ctx, cam, .65); skyline(ctx, 1260, 9, '#0e0814', true, 160, 480, -400, 1600); applyCam(ctx, cam, 1);
      const gr = ctx.createLinearGradient(0, 1250, 0, 2200); gr.addColorStop(0, '#4a2250'); gr.addColorStop(1, '#1d0c26'); ctx.fillStyle = gr; ctx.fillRect(-1600, 1250, 4400, 1500);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(540, 1650, 20, 540, 1650, 520); lg.addColorStop(0, 'rgba(255,170,70,.45)'); lg.addColorStop(1, 'rgba(255,170,70,0)'); ctx.fillStyle = lg; ctx.save(); ctx.translate(540, 1650); ctx.scale(1, .3); ctx.translate(-540, -1650); ctx.fillRect(0, 1000, 1080, 1300); ctx.restore(); ctx.restore(); },
    cap: { mode: 'word', font: 'Poppins', size: 80, fill: '#ffd28a', stroke: '#1a0b22', sw: 14, y: 1345, upper: true }, finish: 'grade' },
  b1: { name: 'B1 Minimal Line Art', desc: 'Warm near-white paper with a faint grid, slender hand-drawn figure, big hand-lettered scene text, quiet captions',
    char: { torso: 'line', limbW: .015, lw: .013, legL: .21, torsoLen: .3, headR: .115, headDrop: .17, shoulderX: .012, armL1: .17, armL2: .16, ink: '#1c1c1c', head: '#fff', headSh: '#fff', eyeMode: 'dot', face: '#1c1c1c' }, cast: {}, bg: (ctx, t, cam) => { gridBG(ctx, cam, '#fdfdfc', 'rgba(76,90,105,.07)', 54); applyCam(ctx, cam, 1); },
    cap: { mode: 'phrase', font: 'NotoSans', size: 52, fill: '#26262c', stroke: null, sw: 0, y: 1700, weight: 600 }, finish: 'none', sceneFont: 'Caveat' },
  b2: { name: 'B2 Colorful Hand-Drawn', desc: 'Warm ivory paper, ink contours, muted coloured props, dot-eyed round-head stickmen, captions on a small ivory label',
    char: { torso: 'line', limbW: .02, lw: .015, legL: .165, headR: .17, headDrop: .2, shoulderX: .015, ink: '#2b2622', head: '#fffaf0', headSh: '#fffaf0', eyeMode: 'dot', noBrows: true, face: '#2b2622' }, cast: {}, bg: (ctx, t, cam, o = {}) => { flat(ctx, '#f4ecd8'); applyCam(ctx, cam, .7); const g = ctx.createRadialGradient(540, 900, 300, 540, 960, 1500); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(150,110,60,.12)'); ctx.fillStyle = g; ctx.fillRect(-300, -300, 1700, 2500); applyCam(ctx, cam, 1); floorBand(ctx, o.floorY || 1500, '#e8dbbb', '#2b2622'); },
    cap: { mode: 'phrase', font: 'NotoSans', size: 50, fill: '#2b2622', stroke: null, sw: 0, y: 1740, weight: 500, label: '#fbf5e6' }, finish: 'none', sceneFont: 'Caveat' },
  b3: { name: 'B3 Retro TV', desc: 'Dark field, refined white/grey silhouettes, uppercase captions, analog-broadcast finish (scanlines, bloom, signal flicker)',
    char: { torso: 'bean', limbW: .03, lw: .01, eyeMode: 'none', ink: '#dedede', head: '#f2f2f2', headSh: '#cfcfcf', neck: .01 }, cast: { cols: ['#8a8d94', '#8a8d94'], hat: 'none', belt: false }, bg: (ctx, t, cam, o = {}) => { flat(ctx, '#0a0b0e'); applyCam(ctx, cam, 1); const g = ctx.createRadialGradient(540, 1650, 30, 540, 1650, 800); g.addColorStop(0, 'rgba(120,125,140,.38)'); g.addColorStop(1, 'rgba(120,125,140,0)'); ctx.save(); ctx.translate(540, 1700); ctx.scale(1, .35); ctx.translate(-540, -1700); ctx.fillStyle = g; ctx.fillRect(-400, 900, 1900, 1500); ctx.restore(); },
    cap: { mode: 'phrase', font: 'NotoSans', size: 50, fill: '#f2f2f2', stroke: null, sw: 0, y: 1730, weight: 600, upper: true }, finish: 'crt' },
  b4: { name: 'B4 Survival Thriller', desc: 'Painted cool-night world with warm practical lights, thin black stick bodies with white cartoon gloves, high-stakes pacing',
    char: { torso: 'line', limbW: .024, lw: .014, headR: .15, headDrop: .2, shoulderX: .015, gloves: true, eyeMode: 'dot', noBrows: true, ink: '#14141a', head: '#fff', headSh: '#fff', face: '#14141a' }, cast: {}, bg: (ctx, t, cam, o = {}) => {
      skyGrad(ctx, cam, '#0c1633', '#35568c', 1250); applyCam(ctx, cam, .1); circle(ctx, 820, 330, 80); ctx.fillStyle = '#f3efd6'; ctx.fill(); applyCam(ctx, cam, .45); skyline(ctx, 1210, 12, '#16213f', true, 300, 760, -400, 1600); applyCam(ctx, cam, .75); skyline(ctx, 1290, 3, '#0e1630', true, 180, 520, -400, 1600);
      applyCam(ctx, cam, 1); floorBand(ctx, 1290, '#1a2338', '#0b0f1c'); ctx.fillStyle = '#252f4a'; ctx.fillRect(-1600, 1290, 4400, 40); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(200, 1500, 10, 200, 1500, 520); lg.addColorStop(0, 'rgba(255,190,90,.32)'); lg.addColorStop(1, 'rgba(255,190,90,0)'); ctx.fillStyle = lg; ctx.fillRect(-400, 1000, 1200, 1000); ctx.restore(); },
    cap: { mode: 'phrase', font: 'NotoSans', size: 54, fill: '#fff', stroke: '#0a0f1c', sw: 11, y: 1650, weight: 700 }, finish: 'grade' },
  b5: { name: 'B5 Character Explainer', desc: 'Warm paper; a speaking presenter (cartoon avatar head on a stick body) bottom-right while the left stage plays causal slapstick with anonymous stickmen and oversized props; up to 3 caption lines',
    char: { torso: 'line', limbW: .034, lw: .02, headR: .17, headDrop: .2, shoulderX: .015, eyeMode: 'dot', ink: '#2a2420', head: '#fffaf0', headSh: '#fffaf0', face: '#2a2420' }, cast: {}, bg: (ctx, t, cam, o = {}) => { flat(ctx, '#f3ead7'); applyCam(ctx, cam, .6); ctx.fillStyle = 'rgba(160,120,70,.08)'; for (let i = 0; i < 18; i++) { circle(ctx, (i * 337) % 1500 - 200, (i * 521) % 2000 - 100, 40 + (i % 4) * 22); ctx.fill(); } applyCam(ctx, cam, 1); floorBand(ctx, o.floorY || 1380, '#e8dcc0', '#2a2420'); },
    cap: { mode: 'phrase', font: 'NotoSans', size: 48, fill: '#2a2420', stroke: null, sw: 0, y: 1570, weight: 700, left: true, label: '#fffaf0' }, finish: 'none' },
};
STYLES.modern_pop = STYLES.studio_tech; STYLES.modern_pop_cinema = STYLES.cinema;
let STYLE_ID = 'candy';
function useStyle(id) { const d = STYLES[id]; if (!d) throw new Error('unknown style ' + id); STYLE_ID = id; setStyle(Object.assign({ id }, d.char || {})); return d; }
const styleDef = () => STYLES[STYLE_ID];
const BG = (ctx, t, cam, o) => { styleDef().bg(ctx, t, cam, o || {}); applyCam(ctx, cam, 1); };
const ACTOR = (extra) => Object.assign({}, styleDef().cast || {}, extra || {});
// B5 presenter: cartoon avatar head on a stick body, bottom right, mouth opens with speech
function speaking(t) { return WORDS.some(w => t >= w.s && t < w.e); }
function drawPresenter(ctx, t, o = {}) {
  const x = o.x || 830, y = o.y || 1880, s = o.s || 520, talk = speaking(t), mo = talk ? .3 + .7 * Math.abs(Math.sin(t * 17)) : 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(s, s);
  line(ctx, 0, -.6, 0, -.25, .045, INK); line(ctx, 0, -.55, -.2, -.4 + Math.sin(t * 4) * .02, .04, INK); line(ctx, 0, -.55, .24, -.5 + (talk ? Math.sin(t * 9) * .08 : 0), .04, INK); line(ctx, 0, -.25, -.1, 0, .04, INK); line(ctx, 0, -.25, .12, 0, .04, INK);
  circle(ctx, 0, -.9, .34); fillStroke(ctx, '#fffaf0', .03); ctx.beginPath(); ctx.moveTo(-.3, -1.05); ctx.quadraticCurveTo(-.2, -1.4, .05, -1.22); ctx.quadraticCurveTo(.25, -1.35, .32, -1.02); ctx.quadraticCurveTo(.1, -1.12, -.3, -1.05); fillStroke(ctx, o.hair || '#3a2a20', .025);
  for (const sx of [-.13, .13]) { circle(ctx, sx, -.9, .09); fillStroke(ctx, 'rgba(255,255,255,.7)', .02); circle(ctx, sx, -.9, .03); ctx.fillStyle = INK; ctx.fill(); } line(ctx, -.04, -.9, .04, -.9, .02, INK);
  ctx.beginPath(); ctx.ellipse(0, -.7, .09, .02 + .07 * mo, 0, 0, TAU); fillStroke(ctx, '#7a2630', .018); ctx.restore();
}
function sceneText(ctx, str, x, y, size = 120, col = '#222', rot = -.02) { const f = styleDef().sceneFont || 'Poppins'; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); text(ctx, str, 0, 0, size, col, '#fff', 0, f, 700); ctx.restore(); }
