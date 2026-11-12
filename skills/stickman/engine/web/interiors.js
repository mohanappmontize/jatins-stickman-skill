// ---------- cozy interiors for "Mira's Rainy Window" ----------
function rainOnGlass(ctx, x, y, w, h, t, n = 26, seed = 5, a = .85) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); const R = rng(seed);
  for (let i = 0; i < n; i++) { const dx = x + R() * w, sp = .25 + R() * .5, ph = (R() + t * sp * .6) % 1, dy = y + ph * (h + 80) - 40, r = 5 + R() * 7;
    ctx.beginPath(); ctx.moveTo(dx, dy - r * 4); ctx.lineTo(dx, dy); ctx.lineWidth = r * .35; ctx.strokeStyle = `rgba(220,240,255,${.35 * a})`; ctx.lineCap = 'round'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(dx, dy - r); ctx.quadraticCurveTo(dx + r * .9, dy + r * .3, dx, dy + r * .9); ctx.quadraticCurveTo(dx - r * .9, dy + r * .3, dx, dy - r); ctx.fillStyle = `rgba(235,247,255,${.75 * a})`; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = `rgba(90,130,170,${.5 * a})`; ctx.stroke(); }
  ctx.restore();
}
function windowView(ctx, x, y, w, h, t, mood, extra) {
  // what you see outside: sky, hills, houses, street, (optional red umbrella walker)
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, mood.top); g.addColorStop(1, mood.bot); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  for (let i = 0; i < 3; i++) { const cx = x + ((i * 260 + t * 8) % (w + 300)) - 100; ctx.beginPath(); ctx.ellipse(cx, y + 60 + i * 40, 110, 36, 0, 0, TAU); ctx.fillStyle = mood.cloud; ctx.fill(); }
  const base = y + h * .62;
  hills(ctx, base, 40, .01, 2, mood.far, 4);
  [[x + 40, 150, '#ffe3b5', '#e0523f'], [x + 250, 120, '#cfe8ff', '#3a6fd1'], [x + 470, 160, '#ffd1d9', '#7a4bc4'], [x + 650, 130, '#fff0a8', '#e0523f']].forEach(([hx, s, wall, roof]) => { if (hx < x + w) drawHouse(ctx, hx + s * .5, base + 40, s, wall, roof, mood.lit); });
  ctx.fillStyle = mood.road; ctx.fillRect(x, base + 40, w, h); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(x, base + 40, w, 6);
  if (extra) extra(ctx, x, y, w, h, base + 40, t);
  ctx.restore();
}
const VIEW_RAIN = { top: '#8e9cbc', bot: '#cdd3e3', cloud: '#aeb7cf', far: '#7ea28f', road: '#6f7a90', lit: 0 };
const VIEW_JOY = { top: '#ffb86b', bot: '#ffe9b0', cloud: '#fff4d8', far: '#a6d880', road: '#8d7aa8', lit: 1 };
function drawRoom(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .5); ctx.fillStyle = o.wall || '#f4d7b0'; ctx.fillRect(-1400, -1400, 4000, 2900 + 1400);
  ctx.fillStyle = 'rgba(190,130,80,.18)'; for (let i = 0; i < 12; i++) ctx.fillRect(-1400 + i * 230, -1400, 90, 3000);
  applyCam(ctx, cam, .85);
  const wx = 150, wy = 330, ww = 780, wh = 900;
  rrP(ctx, wx - 36, wy - 36, ww + 72, wh + 72, 24); fillStroke(ctx, '#fff7ea', 8);
  windowView(ctx, wx, wy, ww, wh, t, o.view || VIEW_RAIN, o.extra);
  if (o.rain !== false) rainOnGlass(ctx, wx, wy, ww, wh, t, 30, 5, o.rainA == null ? 1 : o.rainA);
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(wx, wy, ww * .35, wh);
  ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh * .48); ctx.lineTo(wx + ww, wy + wh * .48); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#fff7ea'; ctx.stroke();
  rrP(ctx, wx - 70, wy + wh + 30, ww + 140, 40, 12); fillStroke(ctx, '#d9a46a', 7);
  // plant on sill
  rrP(ctx, wx + 70, wy + wh - 60, 90, 90, 14); fillStroke(ctx, '#e0705a', 6); for (const a of [-.5, 0, .5]) { ctx.beginPath(); ctx.ellipse(wx + 115 + a * 55, wy + wh - 90, 24, 70, a, 0, TAU); fillStroke(ctx, '#3fc24f', 5); }
  applyCam(ctx, cam, 1); const fy = o.floorY || 1500; ctx.fillStyle = o.floor || '#c98e5a'; ctx.fillRect(-1600, fy, 4400, 1500); ctx.beginPath(); ctx.moveTo(-1600, fy); ctx.lineTo(2800, fy); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = 'rgba(80,40,10,.15)'; for (let i = 0; i < 9; i++) ctx.fillRect(-1600, fy + 40 + i * 70, 4400, 5);
  ctx.beginPath(); ctx.ellipse(540, fy + 330, 520, 120, 0, 0, TAU); fillStroke(ctx, o.rug || '#e0705a', 6); ctx.beginPath(); ctx.ellipse(540, fy + 330, 380, 80, 0, 0, TAU); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.stroke();
}
function steamHeart(ctx, x, y, t, i, a = 1) {
  const p = (t * .55 + i * .27) % 1; heart(ctx, x + Math.sin(p * 6 + i) * 26, y - p * 260, 22 + p * 18, a * Math.min(1, p * 5) * (1 - p), Math.sin(p * 5 + i) * .3);
}
function drawCup(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-40, -70); ctx.lineTo(40, -70); ctx.lineTo(30, 0); ctx.lineTo(-30, 0); ctx.closePath(); fillStroke(ctx, '#fff7ea', 5); ctx.beginPath(); ctx.arc(42, -38, 20, -1.2, 1.2); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#fff7ea'; ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -70, 40, 9, 0, 0, TAU); fillStroke(ctx, '#7a4a2a', 4); ctx.restore(); }
function drawCafe(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .5); ctx.fillStyle = '#e8c08a'; ctx.fillRect(-1400, -1400, 4000, 4400);
  ctx.fillStyle = '#b9794a'; ctx.fillRect(-1400, 1000, 4000, 700);
  applyCam(ctx, cam, .85);
  for (const lx of [200, 540, 880]) { line(ctx, lx, -200, lx, 360, 6, INK); ctx.beginPath(); ctx.arc(lx, 400, 80, Math.PI, 0); ctx.lineTo(lx + 80, 420); ctx.lineTo(lx - 80, 420); ctx.closePath(); fillStroke(ctx, '#e0523f', 6); const g = ctx.createRadialGradient(lx, 460, 10, lx, 460, 320); g.addColorStop(0, 'rgba(255,220,140,.55)'); g.addColorStop(1, 'rgba(255,220,140,0)'); ctx.fillStyle = g; ctx.fillRect(lx - 330, 200, 660, 600); circle(ctx, lx, 440, 22); ctx.fillStyle = '#fff3b0'; ctx.fill(); }
  rrP(ctx, 90, 560, 420, 330, 14); fillStroke(ctx, '#a9d6e8', 6); rainOnGlass(ctx, 90, 560, 420, 330, t, 14, 8); rrP(ctx, 600, 560, 390, 330, 14); fillStroke(ctx, '#a9d6e8', 6); rainOnGlass(ctx, 600, 560, 390, 330, t, 14, 9);
  rrP(ctx, -200, 1000, 1500, 220, 14); fillStroke(ctx, '#8a5530', 7); for (let i = 0; i < 4; i++) drawCup(ctx, 150 + i * 240, 1000, .8);
  applyCam(ctx, cam, 1); ctx.fillStyle = '#7a4a2a'; ctx.fillRect(-1600, 1330, 4400, 1500); ctx.beginPath(); ctx.moveTo(-1600, 1330); ctx.lineTo(2800, 1330); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  for (let i = -6; i < 14; i++) for (let j = 0; j < 8; j++) if ((i + j) % 2) { ctx.fillStyle = 'rgba(255,240,215,.16)'; ctx.fillRect(i * 130, 1330 + j * 110, 130, 110); }
}
function drawTable(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rrP(ctx, -170, -330, 340, 36, 18); fillStroke(ctx, '#c47f48', 6); line(ctx, 0, -294, 0, -20, 22, INK); line(ctx, 0, -294, 0, -20, 11, '#8a5530'); ctx.beginPath(); ctx.ellipse(0, 0, 100, 22, 0, 0, TAU); fillStroke(ctx, '#8a5530', 6); ctx.restore(); }
function drawBus(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .5); ctx.fillStyle = '#7fb5d9'; ctx.fillRect(-1400, -1400, 4000, 4400);
  applyCam(ctx, cam, .85);
  const wy = 380, wh = 760; ctx.fillStyle = '#4a6f94'; ctx.fillRect(-300, wy - 60, 1700, wh + 120);
  ctx.save(); ctx.beginPath(); ctx.rect(-200, wy, 1500, wh); ctx.clip();
  const g = ctx.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#9fb0cf'); g.addColorStop(1, '#d4d9e8'); ctx.fillStyle = g; ctx.fillRect(-200, wy, 1500, wh);
  const off = (t * 220) % 600; for (let k = -1; k < 4; k++) { const hx = k * 600 - off + 120; drawHouse(ctx, hx + 90, wy + wh - 80, 230, ['#ffe3b5', '#cfe8ff', '#ffd1d9'][((k % 3) + 3) % 3], ['#e0523f', '#3a6fd1', '#7a4bc4'][((k % 3) + 3) % 3], 0); }
  ctx.fillStyle = '#6f7a90'; ctx.fillRect(-200, wy + wh - 90, 1500, 200); ctx.restore();
  rainOnGlass(ctx, -200, wy, 1500, wh, t, 18, 3, .6);
  for (const px of [0, 560, 1100]) { ctx.fillStyle = '#35597d'; ctx.fillRect(px - 16, wy - 60, 32, wh + 120); }
  applyCam(ctx, cam, 1); ctx.fillStyle = '#35597d'; ctx.fillRect(-1600, 1250, 4400, 1500); ctx.fillStyle = '#e0a74a'; ctx.fillRect(-1600, 1250, 4400, 26);
  for (const sx of [120, 640]) { rrP(ctx, sx - 80, 1380, 460, 430, 40); fillStroke(ctx, '#e0705a', 7); rrP(ctx, sx - 100, 1230, 130, 360, 40); fillStroke(ctx, '#c9574a', 7); }
}
function puddleMoon(ctx, x, y, w, t, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.ellipse(x, y, w, w * .26, 0, 0, TAU); fillStroke(ctx, '#7fa8d0', 5); ctx.beginPath(); ctx.ellipse(x, y, w * .86, w * .2, 0, 0, TAU); ctx.fillStyle = '#9fc2e2'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(x - w * .1, y - w * .02, w * .22, w * .075, 0, 0, TAU); ctx.fillStyle = '#f6f3dc'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3; const p = (t * .8) % 1; ctx.beginPath(); ctx.ellipse(x + w * .4, y + w * .04, w * .18 * p, w * .05 * p, 0, 0, TAU); ctx.globalAlpha = a * (1 - p); ctx.stroke(); ctx.restore(); }
