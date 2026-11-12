function applyCam(ctx, cam, depth = 1) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const z = 1 + (cam.z - 1) * depth;
  ctx.translate(W / 2, H / 2); ctx.rotate((cam.r || 0) * depth); ctx.scale(z, z);
  ctx.translate(-(540 + (cam.x - 540) * depth), -(960 + (cam.y - 960) * depth));
}
function drawSky(ctx, top = '#3ea6ee', bot = '#c9ecfb', y0 = -400, y1 = 1100) {
  const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, top); g.addColorStop(1, bot);
  ctx.fillStyle = g; ctx.fillRect(-2000, y0 - 2000, 5080, y1 - y0 + 4000);
}
function drawSun(ctx, x, y, r, t, power = 1) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, r * .2, x, y, r * 4.5);
  g.addColorStop(0, `rgba(255,250,210,${.9 * power})`); g.addColorStop(.25, `rgba(255,230,150,${.35 * power})`); g.addColorStop(1, 'rgba(255,220,150,0)');
  ctx.fillStyle = g; ctx.fillRect(x - r * 5, y - r * 5, r * 10, r * 10);
  // rays
  ctx.translate(x, y); ctx.rotate(t * .15);
  for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(-r * .18, r * 1.2); ctx.lineTo(r * .18, r * 1.2); ctx.lineTo(0, r * (2.6 + (i % 2) * .8)); ctx.closePath(); ctx.fillStyle = `rgba(255,240,170,${.22 * power})`; ctx.fill(); }
  ctx.restore();
  circle(ctx, x, y, r); ctx.fillStyle = '#fffbe6'; ctx.fill();
  circle(ctx, x, y, r * .82); ctx.fillStyle = '#fff6c4'; ctx.fill();
}
// ---------- world + props for "The Seed" ----------
const hx2 = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const hmix = (a, b, t) => { const A = hx2(a), B = hx2(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(t))).toString(16).padStart(2, '0')).join(''); };
const MOODS = {
  day:   { top: '#35a9f7', bot: '#d4f2ff', far: '#8fdc9c', mid: '#4fc277', gnd: ['#7be069', '#3cae58'] },
  sad:   { top: '#8798c4', bot: '#dad6ea', far: '#9cc2a8', mid: '#69a98b', gnd: ['#8cc884', '#58996a'] },
  rain:  { top: '#4a5a84', bot: '#9fabc6', far: '#7ba093', mid: '#51896f', gnd: ['#69a577', '#3d7656'] },
  dawn:  { top: '#ff7f86', bot: '#ffe29a', far: '#b3e08c', mid: '#6fc96b', gnd: ['#a0e466', '#4eb655'] },
  gold:  { top: '#ffa83f', bot: '#fff1b8', far: '#bde67e', mid: '#80d35c', gnd: ['#aaea5e', '#55ba4a'] },
  dusk:  { top: '#6f4cc4', bot: '#ff9f7a', far: '#5a9a8a', mid: '#3d8070', gnd: ['#4f9a68', '#2f6a52'] },
  night: { top: '#161a4a', bot: '#5a4f96', far: '#2d5a64', mid: '#1f4a4f', gnd: ['#2d6a55', '#1a4540'] },
};
function moodMix(a, b, t) { const A = MOODS[a], B = MOODS[b], r = {}; for (const k of ['top', 'bot', 'far', 'mid']) r[k] = hmix(A[k], B[k], t); r.gnd = [hmix(A.gnd[0], B.gnd[0], t), hmix(A.gnd[1], B.gnd[1], t)]; return r; }

function hills(ctx, base, amp, f, ph, col, lw) {
  ctx.beginPath(); ctx.moveTo(-1600, base + 1600);
  for (let x = -1600; x <= 2700; x += 40) ctx.lineTo(x, base - amp * (Math.sin(x * f + ph) * .6 + Math.sin(x * f * 2.3 + ph * 1.7) * .4));
  ctx.lineTo(2700, base + 1600); ctx.closePath(); fillStroke(ctx, col, lw);
}
function drawHouse(ctx, x, y, s, wall, roof, lit = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -.5, -.7, 1, .7, .03); fillStroke(ctx, wall, .035);
  ctx.beginPath(); ctx.moveTo(-.64, -.68); ctx.lineTo(0, -1.22); ctx.lineTo(.64, -.68); ctx.closePath(); fillStroke(ctx, roof, .035);
  rrect(ctx, -.12, -.36, .24, .36, .03); fillStroke(ctx, '#7a4a2a', .03);
  rrect(ctx, .22, -.52, .18, .18, .02); fillStroke(ctx, lit ? '#ffe27a' : '#bfe8ff', .03);
  rrect(ctx, -.4, -.52, .18, .18, .02); fillStroke(ctx, lit ? '#ffe27a' : '#bfe8ff', .03);
  rrect(ctx, .24, -1.12, .12, .22, .01); fillStroke(ctx, '#b86a4a', .03);
  ctx.restore();
}
function drawMoon(ctx, x, y, r) {
  ctx.save(); const g = ctx.createRadialGradient(x, y, r * .5, x, y, r * 3); g.addColorStop(0, 'rgba(200,220,255,.45)'); g.addColorStop(1, 'rgba(200,220,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
  circle(ctx, x, y, r); ctx.fillStyle = '#f6f3e0'; ctx.fill(); circle(ctx, x - r * .3, y - r * .2, r * .2); ctx.fillStyle = '#dcd8c0'; ctx.fill(); circle(ctx, x + r * .35, y + r * .3, r * .14); ctx.fill(); ctx.restore();
}
function drawWorld(ctx, t, cam, M, o = {}) {
  const hz = o.horizon || 1130;
  applyCam(ctx, cam, .08); drawSky(ctx, M.top, M.bot, -1100, hz + 120);
  if (o.stars) { ctx.save(); const R = rng(9); for (let i = 0; i < 60; i++) { const x = R() * 1700 - 300, y = R() * 900 - 200; const a = o.stars * (.5 + .5 * Math.sin(t * 3 + i)); ctx.globalAlpha = clamp(a); circle(ctx, x, y, 2 + R() * 3); ctx.fillStyle = '#fff'; ctx.fill(); } ctx.restore(); }
  if (o.sun) { applyCam(ctx, cam, .1); drawSun(ctx, o.sun[0], o.sun[1], o.sun[2], t, o.sun[3] == null ? 1 : o.sun[3]); }
  if (o.moon) { applyCam(ctx, cam, .1); drawMoon(ctx, o.moon[0], o.moon[1], o.moon[2]); }
  applyCam(ctx, cam, .14);
  const cl = (x, y, s, sd) => { if (o.dark) { ctx.save(); cloudShape(ctx, x, y, s, sd); ctx.lineWidth = s * .05; ctx.strokeStyle = 'rgba(30,40,70,.6)'; ctx.stroke(); ctx.fillStyle = o.dark; ctx.fill(); ctx.restore(); } else drawCloud(ctx, x, y, s, sd, o.cloudA == null ? 1 : o.cloudA); };
  cl(150 + t * 7, 300, 130, 1); cl(780 + t * 5, 190, 100, 2); cl(1100 + t * 6, 460, 80, 3); cl(-120 + t * 6, 540, 90, 4);
  applyCam(ctx, cam, .3); hills(ctx, hz - 40, 130, .0042, 1.2, M.far, 5);
  applyCam(ctx, cam, .55); hills(ctx, hz + 20, 85, .0065, 3.1, M.mid, 5);
  if (!o.noHouses) { drawHouse(ctx, 120, hz - 40, 190, '#ffe3b5', '#e0523f', o.lit); drawHouse(ctx, 420, hz - 62, 150, '#cfe8ff', '#3a6fd1', o.lit); drawHouse(ctx, 930, hz - 48, 210, '#ffd1d9', '#7a4bc4', o.lit); drawHouse(ctx, 1250, hz - 60, 170, '#fff0a8', '#e0523f', o.lit); drawHouse(ctx, -300, hz - 50, 180, '#d8f2c4', '#d1803a', o.lit); }
  applyCam(ctx, cam, 1);
  const g = ctx.createLinearGradient(0, hz - 40, 0, hz + 1300); g.addColorStop(0, M.gnd[0]); g.addColorStop(1, M.gnd[1]);
  ctx.beginPath(); ctx.moveTo(-1700, hz + 1800); ctx.lineTo(-1700, hz - 30); for (let x = -1700; x <= 2800; x += 60) ctx.lineTo(x, hz - 30 + Math.sin(x * .004) * 14); ctx.lineTo(2800, hz + 1800); ctx.closePath(); fillStroke(ctx, g, 6);
  const R = rng(21);
  for (let i = 0; i < 70; i++) {
    const x = -500 + R() * 2100, y = hz + 40 + Math.pow(R(), .8) * 1000, k = .35 + (y - hz) / 700, kind = R();
    if (kind < .55) { for (const a of [-.5, 0, .5]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + a * 14 * k, y - 18 * k, x + a * 24 * k, y - 34 * k); ctx.lineWidth = 4 * k; ctx.strokeStyle = 'rgba(25,100,45,.55)'; ctx.lineCap = 'round'; ctx.stroke(); } }
    else { const cols = ['#ff6b8b', '#ffd23a', '#fff', '#b78bff']; const c = cols[Math.floor(R() * 4)]; const sw = Math.sin(t * 2 + i) * 3 * k; line(ctx, x, y, x + sw, y - 26 * k, 4 * k, '#2f9a3a'); for (let p = 0; p < 5; p++) { circle(ctx, x + sw + Math.cos(p * 1.256) * 8 * k, y - 28 * k + Math.sin(p * 1.256) * 8 * k, 6.5 * k); ctx.fillStyle = c; ctx.fill(); } circle(ctx, x + sw, y - 28 * k, 5 * k); ctx.fillStyle = '#ffb300'; ctx.fill(); }
  }
}
// ---------- props ----------
function drawSeed(ctx, x, y, s, rot = 0, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a;
  ctx.beginPath(); ctx.moveTo(0, -s); ctx.quadraticCurveTo(s * .95, -s * .1, 0, s * .75); ctx.quadraticCurveTo(-s * .95, -s * .1, 0, -s); fillStroke(ctx, '#9a5f2a', s * .13);
  ctx.beginPath(); ctx.ellipse(-s * .25, -s * .2, s * .16, s * .34, .3, 0, TAU); ctx.fillStyle = 'rgba(255,215,150,.65)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -s * .85); ctx.quadraticCurveTo(s * .15, 0, 0, s * .6); ctx.lineWidth = s * .06; ctx.strokeStyle = 'rgba(60,25,5,.5)'; ctx.stroke();
  ctx.restore();
}
function drawHole(ctx, x, y, w, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(a, a);
  ellipse(ctx, 0, 0, w * 1.1, w * .3); fillStroke(ctx, '#a8703c', 8);
  ellipse(ctx, 0, 6, w * .92, w * .22); ctx.fillStyle = '#3d210f'; ctx.fill(); ctx.restore();
}
function drawMound(ctx, x, y, w, g = 1, shake = 0) {
  if (g <= 0) return; ctx.save(); ctx.translate(x + shake, y); ctx.scale(1, g);
  ctx.beginPath(); ctx.moveTo(-w, 0); ctx.bezierCurveTo(-w * .7, -w * .5, w * .7, -w * .5, w, 0); ctx.quadraticCurveTo(0, w * .14, -w, 0); fillStroke(ctx, '#a06a36', 8);
  ctx.save(); ctx.beginPath(); ctx.moveTo(-w, 0); ctx.bezierCurveTo(-w * .7, -w * .5, w * .7, -w * .5, w, 0); ctx.quadraticCurveTo(0, w * .14, -w, 0); ctx.clip();
  ctx.fillStyle = 'rgba(60,25,5,.28)'; ctx.fillRect(w * .15, -w, w, w * 1.2); ctx.fillStyle = 'rgba(255,210,150,.3)'; ellipse(ctx, -w * .3, -w * .22, w * .28, w * .08, -.3); ctx.fill();
  const R = rng(5); for (let i = 0; i < 9; i++) { circle(ctx, (R() - .5) * w * 1.5, -R() * w * .3, 4 + R() * 5); ctx.fillStyle = 'rgba(70,35,10,.5)'; ctx.fill(); } ctx.restore(); ctx.restore();
}
function drawCan(ctx, x, y, s, tilt = 0, flip = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(flip, 1); ctx.rotate(tilt); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(.1, -.2); ctx.lineTo(.62, -.62); ctx.lineWidth = .1; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = .05; ctx.strokeStyle = '#7fb6ff'; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(-.38, -.4, .24, .3, 0, -1.6, 1.6, true); ctx.lineWidth = .09; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = .045; ctx.strokeStyle = '#2f7bf0'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-.3, -.78); ctx.lineTo(.2, -.78); ctx.lineTo(.26, -.02); ctx.lineTo(-.34, -.02); ctx.closePath(); fillStroke(ctx, '#3d8bff', .045);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(0,20,90,.25)'; ctx.fillRect(.02, -.9, .4, 1); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-.24, -.74, .06, .7); ctx.restore();
  ctx.beginPath(); ctx.ellipse(.7, -.7, .06, .17, -.6, 0, TAU); fillStroke(ctx, '#2f7bf0', .035);
  ctx.restore();
  const c = Math.cos(tilt), sn = Math.sin(tilt), lx = .72 * s, ly = -.7 * s;
  return [x + flip * (c * lx - sn * ly), y + sn * lx + c * ly];
}
function waterDrops(ctx, tx, ty, flip, t, groundY, n = 9, a = 1) {
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < n; i++) {
    const ph = (t * 1.9 + i / n) % 1, x = tx + flip * (ph * 55 + i % 3 * 6), y = ty + (groundY - ty) * ph * ph;
    ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.quadraticCurveTo(x + 9, y + 2, x, y + 9); ctx.quadraticCurveTo(x - 9, y + 2, x, y - 14); fillStroke(ctx, '#8fd8ff', 3); }
  ctx.restore();
}
function drawSprout(ctx, x, y, s, g, t = 0) {
  if (g <= 0) return; const h = s * g, sw = Math.sin(t * 3) * 4 * g;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw, y - h * .5, x + sw * 1.5, y - h); ctx.lineWidth = s * .12; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = s * .06; ctx.strokeStyle = '#3cc24a'; ctx.stroke();
  for (const side of [-1, 1]) { ctx.save(); ctx.translate(x + sw * 1.5, y - h); ctx.rotate(side * (.9 - g * .15)); ctx.scale(g, g);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(side * s * .5, -s * .45, side * s * .1, -s * .6); ctx.quadraticCurveTo(-side * s * .05, -s * .3, 0, 0); fillStroke(ctx, side > 0 ? '#58d65c' : '#3cc24a', s * .06);
    ctx.beginPath(); ctx.moveTo(0, -s * .04); ctx.quadraticCurveTo(side * s * .2, -s * .25, side * s * .1, -s * .5); ctx.lineWidth = s * .02; ctx.strokeStyle = 'rgba(0,80,20,.4)'; ctx.stroke(); ctx.restore(); }
}
function drawApple(ctx, x, y, r, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(a, a);
  circle(ctx, r * 1.7, r * 1.7, r * 1.3); ctx.restore(); ctx.save(); ctx.translate(x, y); ctx.scale(a, a);
  const g = ctx.createRadialGradient(0, 0, r * .3, 0, 0, r * 2.4); g.addColorStop(0, 'rgba(255,230,120,.55)'); g.addColorStop(1, 'rgba(255,230,120,0)'); ctx.fillStyle = g; ctx.fillRect(-r * 2.4, -r * 2.4, r * 4.8, r * 4.8);
  circle(ctx, 0, 0, r); fillStroke(ctx, '#ffc61f', r * .16);
  ctx.save(); circle(ctx, 0, 0, r); ctx.clip(); ctx.fillStyle = 'rgba(200,110,0,.35)'; ctx.fillRect(r * .1, -r, r, r * 2); ctx.restore();
  ellipse(ctx, -r * .35, -r * .35, r * .22, r * .12, -.6); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill();
  line(ctx, 0, -r, r * .15, -r * 1.35, r * .14, INK); ellipse(ctx, r * .4, -r * 1.25, r * .3, r * .14, -.4); fillStroke(ctx, '#3cc24a', r * .08);
  ctx.restore();
}
const APPLES = [[-.5, -.05], [.02, -.52], [.5, -.02], [-.14, .2], [.32, .36], [-.38, .36], [.0, -.12], [.26, -.3], [-.3, -.32]];
function drawTree(ctx, x, y, s, g, t = 0, fr = 0, glow = 0) {
  if (g <= 0) return; const h = s * g, sw = Math.sin(t * 1.7) * 6 * g, bw = s * .12 * Math.min(1, g + .35);
  const top = [x + sw, y - h];
  const trunk = () => { ctx.beginPath(); ctx.moveTo(x - bw, y + 8); ctx.quadraticCurveTo(x - bw * .5, y - h * .5, top[0] - bw * .5, top[1]); ctx.lineTo(top[0] + bw * .5, top[1]); ctx.quadraticCurveTo(x + bw * .5, y - h * .5, x + bw, y + 8); ctx.closePath(); };
  trunk(); fillStroke(ctx, '#9a6234', s * .014);
  ctx.save(); trunk(); ctx.clip(); ctx.fillStyle = 'rgba(70,30,5,.3)'; ctx.fillRect(x + bw * .1, y - h - 5, bw * 2, h + 40); for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(70,30,5,.22)'; ctx.fillRect(x - bw * .5 + (i % 3) * bw * .3, y - h * (.15 + i * .13), bw * .1, h * .09); } ctx.restore();
  trunk(); ctx.lineWidth = s * .014; ctx.strokeStyle = INK; ctx.stroke();
  const R = s * .46 * Math.pow(g, .85), cx = top[0], cy = top[1] - R * .18;
  const blobs = [[-.62, .12, .6], [0, -.38, .78], [.62, .1, .6], [-.25, .3, .62], [.3, .32, .58], [-.4, -.15, .6], [.4, -.18, .6]];
  if (glow > 0) { const gr = ctx.createRadialGradient(cx, cy, R * .3, cx, cy, R * 2.2); gr.addColorStop(0, `rgba(255,235,140,${.5 * glow})`); gr.addColorStop(1, 'rgba(255,235,140,0)'); ctx.fillStyle = gr; ctx.fillRect(cx - R * 2.3, cy - R * 2.3, R * 4.6, R * 4.6); }
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(sw * .002);
  ctx.beginPath(); blobs.forEach(([bx, by, br]) => { ctx.moveTo(bx * R + br * R, by * R); ctx.arc(bx * R, by * R, br * R, 0, TAU); }); ctx.lineWidth = s * .03; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke(); ctx.fillStyle = '#35b24a'; ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(10,80,30,.35)'; ctx.fillRect(-R * 2, R * .25, R * 4, R * 2); ctx.restore();
  blobs.forEach(([bx, by, br]) => { ellipse(ctx, bx * R - br * R * .28, by * R - br * R * .32, br * R * .34, br * R * .18, -.5); ctx.fillStyle = 'rgba(190,255,150,.32)'; ctx.fill(); });
  APPLES.forEach(([ax, ay], i) => { const a = clamp(fr - i, 0, 1); if (a > 0) drawApple(ctx, ax * R * 1.15, ay * R * 1.1, s * .05, backOut(a)); });
  ctx.restore();
}
function rain(ctx, t, a = 1, speed = 2600, dens = 170) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a * .75; ctx.lineCap = 'round'; ctx.strokeStyle = '#d8ebff'; ctx.lineWidth = 5; ctx.beginPath();
  const R = rng(33);
  for (let i = 0; i < dens; i++) { const x0 = R() * 1500 - 200, ph = (R() + t * speed / 2400) % 1, len = 50 + R() * 60; const y = -150 + ph * 2200, x = x0 - ph * 340; ctx.moveTo(x, y); ctx.lineTo(x - len * .2, y + len); }
  ctx.stroke(); ctx.restore();
}
function bubble(ctx, x, y, str, size, tx, ty, k = 1, col = '#fff') {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(backOut(clamp(k)), backOut(clamp(k)));
  ctx.font = `700 ${size}px Poppins, NotoDeva, sans-serif`; const w = ctx.measureText(str).width + size * 1.0, h = size * 1.7;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.moveTo(tx - 24 - x, h / 2 - 4); ctx.lineTo(tx - x, ty - y); ctx.lineTo(tx + 26 - x, h / 2 - 4);
  fillStroke(ctx, col, 7, '#221c22');
  ctx.beginPath(); ctx.roundRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, h / 2); ctx.fillStyle = col; ctx.fill();
  text(ctx, str, 0, 3, size, '#221c22'); ctx.restore();
}
function soil(ctx, x, y, t0, t, n = 10, seed = 3, power = 160) {
  const R = rng(seed); const dt = t - t0; if (dt < 0 || dt > 1.1) return;
  for (let i = 0; i < n; i++) { const vx = (R() - .35) * power * 1.6, vy = -(R() * power * 3 + power), px = x + vx * dt, py = y + vy * dt + 1800 * dt * dt; const r = 6 + R() * 9; circle(ctx, px, py, r * (1 - dt * .5)); ctx.fillStyle = i % 2 ? '#7a4a22' : '#a06a36'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
}
function heart(ctx, x, y, s, a = 1, rot = 0) {
  if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a; ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, .35); ctx.bezierCurveTo(-1.1, -.3, -.5, -1, 0, -.4); ctx.bezierCurveTo(.5, -1, 1.1, -.3, 0, .35); fillStroke(ctx, '#ff4d7a', .12);
  ellipse(ctx, -.4, -.4, .14, .08, -.5); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill(); ctx.restore();
}
