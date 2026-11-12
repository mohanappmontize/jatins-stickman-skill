// ---------- पासवर्ड की दौड़: Studio Tech, Hindi, mixed cast (grandpa human + bunny animal + runaway locked tablet) ----------
useStyle('studio_tech');
const C = (base, ...ex) => Object.assign({}, base, ...ex);
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const Aw = (i, k) => WORDS.filter(w => w.line === i)[k].s - SENT[i][0];
const stOf = i => i === 0 ? 0 : SENT[i][0];
const SHOTS = [];
function shot(i, tr, fn) { const start = stOf(i), end = i < SENT.length - 1 ? SENT[i + 1][0] : VO_END + .9; SHOTS.push({ start, end, tr, draw(ctx, lt, t) { fn(ctx, lt, t, k => Aw(i, k), end - start); } }); }
const CAM = (x, t, a = 3, z = 1, y = 960) => { const hh = handheld(t, a); return { x: x + hh[0], y: y + hh[1], z, r: 0 }; };
const SC = (cam, wx, wy) => [540 + (wx - cam.x) * cam.z, 960 + (wy - cam.y) * cam.z];
const GP = (...o) => C({ human: 'grandpa' }, ...o);
const BN = (...o) => C({ species: 'bunny' }, ...o);
const RUN = humanGait('grandpa', { stride: .13, lift: .1, lean: .12, armSwing: .9 });
const STU = makeStage({ name: 'studio', yFar: 1150, yNear: 1900, pxmFar: 300, pxmNear: 560, horizon: 1000,
  places: { left: [220, 1700, 1], mid: [540, 1720], right: [900, 1700, -1] },
  draw(ctx, t, cam, o = {}) { BG(ctx, t, cam, {}); } });
const bunS = y => STU.px(y, .6) / 1.2, gpS = y => STU.adult(y);
const headOf = (name, x, y, s, lean = 0) => { const h = HUMANS[name], hr = h.kid ? .2 : .155, T = h.kid ? .27 : .32, LL = h.kid ? .115 : .185, hy = (-2 * LL - T - hr - (h.kid ? .035 : .045)); return [x - hy * Math.sin(lean) * s, y + hy * Math.cos(lean) * s, hr * s]; };

// ---- props ----
function padlock(ctx, x, y, r, col = '#ffd23a', rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.beginPath(); ctx.arc(0, -r * .3, r * .55, Math.PI, 0); ctx.lineWidth = r * .34; ctx.strokeStyle = INK; ctx.lineCap = 'butt'; ctx.stroke(); ctx.lineWidth = r * .18; ctx.strokeStyle = '#d5dde8'; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-r * .85, -r * .3, r * 1.7, r * 1.35, r * .22); fillStroke(ctx, col, r * .14);
  circle(ctx, 0, r * .3, r * .17); ctx.fillStyle = INK; ctx.fill(); ctx.fillRect(-r * .06, r * .3, r * .12, r * .38);
  ctx.restore();
}
function bunnyFace(ctx, cx, cy, r) {
  ctx.save(); ctx.translate(cx, cy);
  for (const sd of [-1, 1]) { ctx.save(); ctx.rotate(sd * .15); ellipse(ctx, sd * r * .45, -r * 1.25, r * .28, r * .7); fillStroke(ctx, '#fffafc', r * .06, '#6a4a5a'); ellipse(ctx, sd * r * .45, -r * 1.25, r * .13, r * .5); ctx.fillStyle = '#ffb0c8'; ctx.fill(); ctx.restore(); }
  ellipse(ctx, 0, 0, r, r * .9); fillStroke(ctx, '#fffafc', r * .06, '#6a4a5a');
  for (const sd of [-1, 1]) { circle(ctx, sd * r * .38, -r * .08, r * .1); ctx.fillStyle = '#2a2230'; ctx.fill(); circle(ctx, sd * r * .35, -r * .12, r * .035); ctx.fillStyle = '#fff'; ctx.fill(); ellipse(ctx, sd * r * .62, r * .25, r * .16, r * .09); ctx.fillStyle = '#ffb0c8'; ctx.fill(); }
  ellipse(ctx, 0, r * .12, r * .11, r * .075); ctx.fillStyle = '#ff8fb0'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, r * .2); ctx.lineTo(0, r * .3); ctx.moveTo(-r * .16, r * .38); ctx.quadraticCurveTo(0, r * .5, r * .16, r * .38); ctx.lineWidth = r * .04; ctx.strokeStyle = '#6a4a5a'; ctx.stroke();
  ctx.restore();
}
const SLOTS = [[-.55, -.3, -.8, -.9], [.55, -.2, .9, -.6], [-.55, .28, -.9, .5], [.55, .32, .8, .8], [0, -.62, .1, -1]];
// tablet with little legs/arms/eyes. x,y = feet centre on the ground, h = screen height.
// o: run (distance travelled -> leg cycle), screen 'lock'|'wrong'|'photo'|'open', locks [progress..], lockFly 0..1, angry, legs:false, t, flip
function drawTablet(ctx, x, y, h, o = {}) {
  const t = o.t || 0, fl = o.flip || 1, run = o.run, scr = o.screen || 'lock', hasLegs = o.legs !== false;
  const ph = run != null ? run / (h * .7) * TAU : 0, bob = run != null ? Math.abs(Math.sin(ph)) * .07 * h : 0;
  const LL = hasLegs ? h * .3 : 0, bw = h * .72, cy = -LL - h * .5, shk = o.shake ? Math.sin(t * 60) * h * .012 : 0;
  ctx.save(); ctx.translate(x + shk, y - bob); ctx.scale(fl, 1);
  if (o.shadow !== false && hasLegs) { ctx.save(); ctx.translate(0, bob); ellipse(ctx, 0, 0, h * .42, h * .06); ctx.fillStyle = 'rgba(40,50,80,.18)'; ctx.fill(); ctx.restore(); }
  if (hasLegs) for (const k of [-1, 1]) {
    const p = ph + (k > 0 ? 0 : Math.PI), hx = k * bw * .22, fx = hx + (run != null ? Math.sin(p) * h * .17 : 0), fy = run != null ? -Math.max(0, Math.cos(p)) * h * .1 + bob : 0;
    line(ctx, hx, -LL, fx, fy, h * .075, INK); ellipse(ctx, fx + h * .04, fy, h * .1, h * .05); fillStroke(ctx, '#e0392f', h * .02);
  }
  for (const k of [-1, 1]) { const p = ph + (k > 0 ? Math.PI : 0), ay = cy + h * .05, sw = run != null ? Math.sin(p) * h * .14 : 0; line(ctx, k * bw / 2, ay, k * (bw / 2 + h * .13), ay + h * .12 + sw, h * .06, INK); circle(ctx, k * (bw / 2 + h * .13), ay + h * .12 + sw, h * .05); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = h * .02; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.beginPath(); ctx.roundRect(-bw / 2, cy - h / 2, bw, h, h * .08); fillStroke(ctx, '#3a4152', h * .028);
  const sx = -bw / 2 + h * .05, sy = cy - h / 2 + h * .06, sw2 = bw - h * .1, sh = h - h * .12;
  ctx.save(); ctx.beginPath(); ctx.roundRect(sx, sy, sw2, sh, h * .04); ctx.clip();
  ctx.fillStyle = scr === 'wrong' ? (Math.sin(t * 22) > 0 ? '#d3162a' : '#8e0d18') : scr === 'photo' ? '#ffe3ee' : scr === 'open' ? '#e9f7ff' : '#0d2b52'; ctx.fillRect(sx, sy, sw2, sh);
  if (scr === 'lock') { const g = ctx.createRadialGradient(0, cy, 0, 0, cy, h * .5); g.addColorStop(0, 'rgba(90,220,255,.35)'); g.addColorStop(1, 'rgba(90,220,255,0)'); ctx.fillStyle = g; ctx.fillRect(sx, sy, sw2, sh); }
  if (scr === 'lock' || scr === 'wrong') {
    for (const k of [-1, 1]) { const ex = k * bw * .2, ey = cy - h * .24; circle(ctx, ex, ey, h * .085); ctx.fillStyle = '#fff'; ctx.fill(); circle(ctx, ex + h * .03, ey + h * .01, h * .04); ctx.fillStyle = INK; ctx.fill(); if (o.angry || scr === 'wrong') line(ctx, ex - k * h * .1, ey - h * .11 - k * h * .035, ex + k * h * .09, ey - h * .1 + k * h * .035, h * .035, '#fff'); }
    if (scr === 'lock') padlock(ctx, 0, cy + h * .08, h * .17 * (1 + .06 * Math.sin(t * 8)));
    else { line(ctx, -h * .15, cy + h * .02, h * .15, cy + h * .3, h * .085, '#fff'); line(ctx, h * .15, cy + h * .02, -h * .15, cy + h * .3, h * .085, '#fff'); }
  } else if (scr === 'photo') { bunnyFace(ctx, 0, cy + h * .08, h * .22); for (let i = 0; i < 3; i++) heart(ctx, (i - 1) * h * .2, cy - h * .36 - Math.abs(i - 1) * h * .03, h * .07, 1, (i - 1) * .3); }
  ctx.restore();
  ctx.beginPath(); ctx.roundRect(sx, sy, sw2, sh, h * .04); ctx.lineWidth = h * .015; ctx.strokeStyle = INK; ctx.stroke();
  if (o.locks) o.locks.forEach((p, i) => {
    if (i >= SLOTS.length || p <= 0) return; const S = SLOTS[i], fly = o.lockFly || 0;
    let lx = S[0] * h * .8 + S[2] * fly * h * 2.2, ly = cy + S[1] * h + S[3] * fly * h * 2.2 + fly * fly * h * 2.6, a = 1 - clamp((fly - .55) / .45);
    ly -= Math.pow(1 - clamp(p), 2) * h * 1.6; if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; line(ctx, S[0] * h * .55, cy + S[1] * h * .8, lx, ly, h * .03, '#8795a8'); padlock(ctx, lx, ly + h * .05, h * .12, '#ffd23a', Math.sin(t * 7 + i) * .15 * (1 - fly) + fly * (i - 2) * 4); ctx.restore();
  });
  ctx.restore();
}
function wrongPanel(ctx, x, y, w, h, t, i, k = 1, a = .85) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y - 14 - Math.sin(t * 2 + i) * 9); ctx.scale(k, k); ctx.globalAlpha = a;
  const g = ctx.createLinearGradient(0, -h, w, 0); g.addColorStop(0, 'rgba(255,90,90,.85)'); g.addColorStop(1, 'rgba(200,30,60,.7)');
  ctx.beginPath(); ctx.roundRect(-w / 2, -h, w, h, 22); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.stroke();
  line(ctx, -w * .17, -h * .78, w * .17, -h * .5, w * .08, '#fff'); line(ctx, w * .17, -h * .78, -w * .17, -h * .5, w * .08, '#fff'); text(ctx, 'गलत', 0, -h * .24, w * .22, '#fff', INK, 8, 'NotoDeva', 700);
  ctx.restore();
}
function bub(ctx, cam, wx, wy, str, size, k, dx = 0, dy = -230, lo = 330, hi = 750) {
  if (k <= 0) return; const [sx, sy] = SC(cam, wx, wy); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  bubble(ctx, clamp(sx + dx, lo, hi), sy + dy, str, size, sx, sy - 20, k); ctx.restore();
}
function speedLines(ctx, t, a) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a * .6; for (let i = 0; i < 9; i++) { const y = 820 + i * 110 + (i % 3) * 20, x = 1500 - ((t * 3000 + i * 377) % 1900); line(ctx, x, y, x + 220 + (i % 3) * 90, y, 8, '#9fb4cf'); } ctx.restore(); }
const dust = (ctx, x, y, t, n = 3, sc = 1, a = 1) => { for (let i = 0; i < n; i++) puff(ctx, x - 60 * sc - i * 75 * sc, y - 18 - i * 6, (26 + i * 12) * sc, t, '#e4e8f0', 3 + i, (.8 - i * .22) * a); };

// 0 — HOOK: the locked tablet sprints across the studio floor; grandpa far behind, hands up, then chases
shot(0, 'whip', (ctx, lt, t, A, D) => {
  const cam = CAM(540, t, 3, 1 + lt * .012), e = Math.max(0, lt - 2.7), tab = 250 + lt * 300 + e * e * 900, ty = 1790, th = STU.px(ty, .7);
  STU.draw(ctx, t, cam, {});
  const gs = gpS(1480), gx = 190 + Math.max(0, lt - 3.0) * 380, moving = lt > 3.0;
  drawActor(ctx, GP(moving ? walker(190, gx, gs, RUN) : { arms: { L: [2.5, .3], R: [2.5, .3] }, face: { eyes: 'wide', mouth: 'o', browUp: 1 } }, { x: gx, y: 1480, s: gs, flip: 1, id: 'grandpa', face: moving ? { eyes: 'wide', mouth: 'o', browAng: -.3 } : { eyes: 'wide', mouth: 'o', browUp: 1 } }));
  dust(ctx, tab, ty, t, 3, 1.3);
  drawTablet(ctx, tab, ty, th, { run: tab, screen: 'lock', angry: 1, t, flip: 1 });
  if (lt > A(3) && lt < A(3) + .6) { const k = inv(A(3), A(3) + .3, lt); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - inv(A(3) + .3, A(3) + .6, lt); burst(ctx, 540, 520, 200 * k, 11, '#ff5a5a', 4); padlock(ctx, 540, 520, 130 * k); ctx.restore(); }
});
// 1 — bunny hops after it, leaps to grab, slips off, shouts "password!"
shot(1, 'whip', (ctx, lt, t, A, D) => {
  const v = 330, tab = 700 + v * lt + Math.pow(Math.max(0, lt - 2.0), 2) * 130, cam = CAM(640 + v * lt, t, 3), ty = 1790, th = STU.px(ty, .7);
  STU.draw(ctx, t, cam, {});
  const gap = lt < 2.0 ? lerp(430, 185, easeOut(inv(0, 2.0, lt))) : lt < 2.5 ? lerp(185, 100, inv(2.0, 2.5, lt)) : lerp(100, 420, easeOut(inv(2.5, 3.5, lt)));
  const bs = bunS(1810), bx = tab - gap, leap = lt > 2.0 && lt < 2.5 ? Math.sin(inv(2.0, 2.5, lt) * Math.PI) * 150 : 0;
  drawActor(ctx, BN(walker(0, bx, bs, TOON_GAIT), { x: bx, y: 1810 - leap, s: bs, flip: 1, cropOK: 1, talk: lt > A(8) ? Math.abs(Math.sin(lt * 16)) : 0, face: { eyes: lt > 2.6 ? 'wide' : 'normal', mouth: lt > A(8) ? 'o' : 'smile', look: [1, 0] }, id: 'bunny' }));
  dust(ctx, tab, ty, t, 3, 1.3);
  drawTablet(ctx, tab, ty, th, { run: tab, screen: 'lock', angry: 1, t, flip: 1 });
  bub(ctx, cam, bx, 1810 - bs * .62, 'पासवर्ड बताओ!', 62, easeOut(inv(A(9) - .05, A(9) + .2, lt)), -60, -250, 330, 740);
});
// 2 — grandpa runs (big, near) and shouts 1234; tablet and bunny far ahead
shot(2, 'cut', (ctx, lt, t, A, D) => {
  const gx = 300 + 300 * lt, cam = CAM(gx + 230, t, 3), gy = 1780, gs = gpS(gy);
  STU.draw(ctx, t, cam, {});
  const tx = gx + 650, ty = 1480, th = STU.px(ty, .7); dust(ctx, tx, ty, t, 3, .8);
  drawTablet(ctx, tx, ty, th, { run: tx, screen: 'lock', angry: 1, t, flip: 1 });
  const bs = bunS(1530), bx = gx + 430; drawActor(ctx, BN(walker(0, bx, bs, TOON_GAIT), { x: bx, y: 1530, s: bs, flip: 1, id: 'bunny', cropOK: 1 }));
  const sp = lt > A(2) - .1 && lt < A(2) + 1.4;
  drawActor(ctx, GP(walker(0, gx, gs, RUN), { x: gx, y: gy, s: gs, flip: 1, talk: sp ? Math.abs(Math.sin(lt * 14)) : 0, face: { eyes: 'normal', browAng: -.3, mouth: sp ? 'o' : 'flat' }, id: 'grandpa' }));
  const [hx, hy, hr] = headOf('grandpa', gx, gy, gs, .12); bub(ctx, cam, hx + 40, hy - hr, '१ २ ३ ४!', 100, easeOut(inv(A(2), A(2) + .25, lt)), 120, -190, 350, 760);
});
// 3 — tablet speeds up (close), screen turns red: WRONG
shot(3, 'whip', (ctx, lt, t, A, D) => {
  const sp = A(2), tab = 800 + 300 * lt + (lt > sp ? 90 * Math.pow(lt - sp, 2) : 0), cam = CAM(tab - 60, t, 4, 1.02), ty = 1850, th = STU.px(ty, .9);
  STU.draw(ctx, t, cam, {});
  const bs = bunS(1880), gap = 380 + (lt > sp ? (lt - sp) * 120 : 0), bx = tab - gap;
  drawActor(ctx, BN(walker(0, bx, bs, TOON_GAIT), { x: bx, y: 1880, s: bs, flip: 1, face: { eyes: 'wide', mouth: 'o', look: [1, 0] }, id: 'bunny', cropOK: 1 }));
  const k = inv(A(8) - .1, A(8) + .2, lt); wrongPanel(ctx, tab + 330, 1430, 380, 460, t, 0, backOut(k));
  dust(ctx, tab, ty, t, 3, 1.5);
  drawTablet(ctx, tab, ty, th, { run: tab, screen: lt > A(7) ? 'wrong' : 'lock', angry: 1, t, flip: 1 });
  if (lt > sp) speedLines(ctx, t, inv(sp, sp + .3, lt));
});
// 4 — both chase (grandpa near, bunny just ahead, tablet far)
shot(4, 'cut', (ctx, lt, t, A, D) => {
  const gx = 300 + 420 * lt, cam = CAM(gx + 200, t, 4), gy = 1650, gs = gpS(gy);
  STU.draw(ctx, t, cam, {});
  const tx = gx + 560, ty = 1420, th = STU.px(ty, .7); dust(ctx, tx, ty, t, 3, .8);
  drawTablet(ctx, tx, ty, th, { run: tx, screen: 'lock', angry: 1, t, flip: 1 });
  const bs = bunS(1750), bx = gx + 340; drawActor(ctx, BN(walker(0, bx, bs, TOON_GAIT), { x: bx, y: 1750, s: bs, flip: 1, id: 'bunny', cropOK: 1 }));
  drawActor(ctx, GP(walker(0, gx, gs, RUN), { x: gx, y: gy, s: gs, flip: 1, face: { eyes: 'normal', browAng: -.35, mouth: 'o' }, id: 'grandpa' }));
  speedLines(ctx, t, .35);
});
// 5 — grandpa shouts his birthday: wrong again
shot(5, 'whip', (ctx, lt, t, A, D) => {
  const gx = 300 + 330 * lt, cam = CAM(gx + 330, t, 3), gy = 1760, gs = gpS(gy), tx = gx + 620, ty = 1740, th = STU.px(ty, .55);
  STU.draw(ctx, t, cam, {});
  dust(ctx, tx, ty, t, 3, 1);
  const wr = lt > A(6);
  if (wr) wrongPanel(ctx, tx, ty - th * 1.4, 260, 330, t, 1, backOut(inv(A(6), A(6) + .2, lt)));
  drawTablet(ctx, tx, ty, th, { run: tx, screen: wr ? 'wrong' : 'lock', angry: 1, t, flip: 1 });
  const bs = bunS(1800), bx = gx + 380; drawActor(ctx, BN(walker(0, bx, bs, TOON_GAIT), { x: bx, y: 1800, s: bs, flip: 1, id: 'bunny', cropOK: 1 }));
  const sp = lt > A(3) - .2 && lt < A(5);
  drawActor(ctx, GP(walker(0, gx, gs, RUN), { x: gx, y: gy, s: gs, flip: 1, talk: sp ? Math.abs(Math.sin(lt * 14)) : 0, face: { eyes: 'normal', browAng: -.3, mouth: sp ? 'o' : 'flat' }, id: 'grandpa' }));
  const [hx, hy, hr] = headOf('grandpa', gx, gy, gs, .12); bub(ctx, cam, hx + 40, hy - hr, '१२-०३-१९५२', 66, easeOut(inv(A(3), A(3) + .25, lt)) * (1 - inv(A(5) + .2, A(5) + .5, lt)), 120, -190, 360, 740);
});
// 6 — every mistake adds a padlock; the tablet gets slower and sweatier
shot(6, 'cut', (ctx, lt, t, A, D) => {
  const T = [.5, 1.4, 2.25, 2.7], lk = T.map(ti => clamp(inv(ti, ti + .35, lt))), cnt = T.filter(ti => lt > ti).length;
  const tab = 700 + 300 * lt - 40 * T.reduce((s, ti) => s + Math.max(0, lt - ti), 0), cam = CAM(tab - 60, t, 3, 1.02), ty = 1830, th = STU.px(ty, .85);
  STU.draw(ctx, t, cam, {});
  const flash = T.some(ti => lt > ti + .3 && lt < ti + .55);
  dust(ctx, tab, ty, t, 2, 1.4, .8);
  drawTablet(ctx, tab, ty, th, { run: tab, screen: flash ? 'wrong' : 'lock', angry: 1, locks: lk, t, flip: 1 });
  if (cnt >= 2) sweat(ctx, tab - 90, ty - th * 1.2, 40, inv(1.5, 1.9, lt)); if (cnt >= 3) sweat(ctx, tab + 120, ty - th * 1.1, 34, inv(2.3, 2.6, lt));
  if (lt > 2.9) { const ex = lt - 2.9, gx = cam.x - 760 + ex * 320, gy = 1800, gs = gpS(gy); drawActor(ctx, GP(walker(0, gx, gs, RUN), { x: gx, y: gy, s: gs, flip: 1, cropOK: 1, face: { eyes: 'normal', browAng: -.3, mouth: 'o' }, id: 'grandpa' })); const bs = bunS(1840), bx = gx + 300; drawActor(ctx, BN(walker(0, bx, bs, TOON_GAIT), { x: bx, y: 1840, s: bs, flip: 1, cropOK: 1, id: 'bunny' })); }
});
// 7 — the path fills with red WRONG panels; tablet trapped behind them; chasers skid in
const PAN = [[750, 480], [900, 420], [1030, 500], [840, 440], [960, 400]];
shot(7, 'cut', (ctx, lt, t, A, D) => {
  const cam = CAM(540, t, 1.5, 1);
  STU.draw(ctx, t, cam, {});
  drawTablet(ctx, 900, 1620, STU.px(1620, .7), { screen: 'lock', angry: 1, locks: [1, 1, 1, 1], shake: 1, t, flip: -1 });
  sweat(ctx, 830, 1330, 34, .8);
  const mv = clamp(inv(0, 2.3, lt)), gx = lerp(-250, 410, easeOut(mv)), bx = lerp(-480, 110, easeOut(mv)), gs = gpS(1800), bs = bunS(1860), still = lt > 2.3;
  const T = [A(2), A(4), A(5), A(6), A(7)];
  PAN.forEach(([px, ph], i) => wrongPanel(ctx, px, 1790 + (i % 2) * 20, 300, ph, t, i, backOut(inv(T[i] - .1, T[i] + .2, lt)), .55));
  drawActor(ctx, BN(still ? { legs: { L: [.1, -.04], R: [.1, -.04] }, view: 'front' } : walker(-480, bx, bs, TOON_GAIT), { x: bx, y: 1860, s: bs, flip: 1, face: { eyes: 'wide', mouth: 'o', look: [1, 0] }, id: 'bunny', cropOK: !still }));
  drawActor(ctx, GP(still ? { arms: { L: [.5, -.4], R: [.5, -.4] }, lean: .08, bob: Math.sin(lt * 12) * .01 } : walker(-250, gx, gs, RUN), { x: gx, y: 1800, s: gs, flip: 1, face: { eyes: 'wide', mouth: 'o', browUp: 1 }, id: 'grandpa', cropOK: !still }));
});
// 8 — bunny turns to grandpa and asks "who do you love most?"; grandpa thinks
shot(8, 'cut', (ctx, lt, t, A, D) => {
  const cam = CAM(lerp(540, 430, easeOut(inv(0, D, lt))), t, 1, lerp(1, 1.08, inv(0, D, lt)));
  STU.draw(ctx, t, cam, {});
  drawTablet(ctx, 900, 1620, STU.px(1620, .7), { screen: 'lock', angry: 0, locks: [1, 1, 1, 1], shake: 1, t, flip: -1 });
  PAN.forEach(([px, ph], i) => wrongPanel(ctx, px, 1790 + (i % 2) * 20, 300, ph, t, i, 1, .5));
  const bs = bunS(1860), gs = gpS(1800), ask = lt > A(4), th = lt > A(9);
  drawActor(ctx, BN({ view: 'front', legs: { L: [.1, -.04], R: [.1, -.04] }, headTilt: -.08, talk: ask && lt < A(10) + .5 ? Math.abs(Math.sin(lt * 15)) : 0, arms: { L: [.35, -.15], R: ask ? [2.4, .2] : [.35, -.15] } }, { x: 120, y: 1860, s: bs, flip: 1, face: { eyes: 'normal', mouth: 'smile', look: [.9, -.7] }, id: 'bunny' }));
  drawActor(ctx, GP({ view: '3q', arms: th ? { L: [.5, -.2], R: { ik: [.18, -.62], bend: 1 } } : { L: [.5, -.4], R: [.5, -.4] }, headTilt: th ? -.1 : 0 }, { x: 330, y: 1800, s: gs, flip: -1, face: { eyes: 'normal', look: th ? [-.7, -.8] : [-1, 0], mouth: 'flat', browAng: th ? .15 : -.2 }, id: 'grandpa' }));
  bub(ctx, cam, 120, 1860 - bs * .85, 'दादाजी…', 60, easeOut(inv(A(5) - .05, A(5) + .2, lt)) * (1 - inv(A(7) - .1, A(7), lt)), 80, -150, 280, 760);
  bub(ctx, cam, 120, 1860 - bs * .85, 'सबसे प्यारा कौन है?', 54, easeOut(inv(A(7), A(7) + .25, lt)), 220, -150, 380, 700);
  if (th) { const [hx, hy, hr] = headOf("grandpa", 420, 1800, gs, 0), [sx, sy] = SC(cam, hx, hy - hr * 1.5); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const n = Math.floor(inv(A(9), A(10) + .6, lt) * 3.99); text(ctx, '...'.slice(0, Math.max(1, n)), sx, sy - 40, 90, '#13204a', '#fff', 12, 'Poppins', 700); ctx.restore(); }
});
// 9 — grandpa smiles and says "Bunny!"
shot(9, 'cut', (ctx, lt, t, A, D) => {
  const cam = CAM(520, t, 1, 1.1 + lt * .01, 1000);
  STU.draw(ctx, t, cam, {});
  const gs = gpS(1800), bs = bunS(1830), say = lt > A(4), pop = easeOut(inv(A(4), A(4) + .3, lt));
  drawActor(ctx, GP({ view: '3q', arms: { L: [.5, -.3], R: say ? [.9, -.5] : [.5, -.3] }, talk: say && lt < A(4) + .8 ? Math.abs(Math.sin(lt * 14)) : 0, headTilt: .05 }, { x: 330, y: 1800, s: gs, flip: 1, face: { eyes: lt > A(1) ? 'happy' : 'normal', mouth: lt > A(1) ? 'smile' : 'flat', browUp: .5 }, id: 'grandpa' }));
  drawActor(ctx, BN({ view: 'front', legs: { L: [.1, -.04], R: [.1, -.04] }, headTilt: say ? .08 : 0, arms: say ? { L: [2.5, .3], R: [2.5, .3] } : { L: [.35, -.15], R: [.35, -.15] }, bob: say ? -Math.abs(Math.sin(lt * 10)) * .03 : 0 }, { x: 720, y: 1830, s: bs, flip: -1, face: { eyes: say ? 'happy' : 'normal', mouth: say ? 'grin' : 'smile', look: [-.8, -.6] }, id: 'bunny' }));
  const [hx, hy, hr] = headOf('grandpa', 330, 1800, gs, 0); bub(ctx, cam, hx + 30, hy - hr, 'बनी!', 130, pop, 120, -210, 380, 700);
  if (say) for (let i = 0; i < 4; i++) { const k = ((lt - A(4)) * .7 + i * .25) % 1; heart(ctx, 720 + Math.sin(i * 2 + lt * 3) * 120, 1830 - bs * 1.2 - k * 360, 60 - i * 6, 1 - k, Math.sin(i + lt * 2) * .3); }
});
// 10 — locks burst off, the screen opens: Bunny's photo
shot(10, 'whip', (ctx, lt, t, A, D) => {
  const cam = CAM(540, t, 2, 1 + lt * .01), br = A(1), op = A(9) - .1, ty = 1830, th = STU.px(ty, 1.0);
  STU.draw(ctx, t, cam, {});
  const fly = clamp(inv(br, br + 1.1, lt)), jump = lt > op ? Math.abs(Math.sin((lt - op) * 8)) * 40 : 0;
  drawTablet(ctx, 540, ty - jump, th, { screen: lt > op + .15 ? 'photo' : 'lock', locks: [1, 1, 1, 1], lockFly: fly, shake: fly < .05 && lt > br - .3, angry: 0, t, flip: 1 });
  if (lt > br && lt < br + .5) burst(ctx, 540, ty - th * .8, 250 * inv(br, br + .25, lt), 13, '#ffe14d', 7);
  if (lt > op) { const k = inv(op, op + .5, lt); ctx.save(); ctx.globalAlpha = 1 - k; burst(ctx, 540, ty - th * .8, 420 * k, 13, '#fff7b0', 9); ctx.restore(); for (let i = 0; i < 8; i++) { const a = t * 1.5 + i * .8, r = 360 + i % 3 * 40; sparkle(ctx, 540 + Math.cos(a) * r, ty - th * .8 + Math.sin(a * 1.2) * r * .6, 36 + i % 3 * 10, .5 + .5 * Math.sin(t * 6 + i)); } }
  const gs = gpS(1700), bs = bunS(1760), happy = lt > op;
  drawActor(ctx, GP({ arms: happy ? { L: [2.5, .3], R: [2.5, .3] } : { L: [.5, -.4], R: [.5, -.4] } }, { x: 150, y: 1700, s: gs, flip: 1, face: happy ? { eyes: 'happy', mouth: 'grin', browUp: 1 } : { eyes: 'wide', mouth: 'o' }, id: 'grandpa', cropOK: 1 }));
  drawActor(ctx, BN({ view: 'front', legs: { L: [.1, -.04], R: [.1, -.04] }, arms: happy ? { L: [2.5, .3], R: [2.5, .3] } : { L: [.35, -.15], R: [.35, -.15] }, bob: happy ? -Math.abs(Math.sin((lt - op) * 8)) * .04 : 0 }, { x: 930, y: 1760, s: bs, flip: -1, face: happy ? { eyes: 'happy', mouth: 'grin' } : { eyes: 'wide', mouth: 'o' }, id: 'bunny' }));
});
// 11 — hug: grandpa holds up the tablet with the photo, bunny beside him; banner: password = Bunny
shot(11, 'cut', (ctx, lt, t, A, D) => {
  const cam = CAM(540, t, 1.5, 1 + lt * .008);
  STU.draw(ctx, t, cam, {});
  const gs = gpS(1820), bs = bunS(1860), gx = 410, bx = 770;
  drawActor(ctx, BN({ view: 'front', legs: { L: [.1, -.04], R: [.1, -.04] }, headTilt: .1, arms: { L: [2.4, .3], R: [.35, -.15] }, bob: -Math.abs(Math.sin(lt * 5)) * .012 }, { x: bx, y: 1860, s: bs, flip: -1, face: { eyes: 'happy', mouth: 'grin' }, id: 'bunny' }));
  drawActor(ctx, GP({ arms: { L: { ik: [.2, -.55], bend: 1 }, R: { ik: [.34, -.4], bend: -1 } }, armLen: 1.1, headTilt: .06, prop: (c, k, hp) => { if (k === 'R') drawTablet(c, hp[0] + .1, hp[1] + .12, .3, { legs: false, screen: 'photo', shadow: false, t, flip: 1 }); } }, { x: gx, y: 1820, s: gs, flip: 1, face: { eyes: 'happy', mouth: 'smile', browUp: 1 }, id: 'grandpa' }));
  for (let i = 0; i < 5; i++) { const k = (lt * .45 + i * .2) % 1; heart(ctx, 560 + Math.sin(i * 2.3 + lt * 2) * 200, 1300 - k * 600, 56 - i * 4, Math.min(1, k * 5) * (1 - k), Math.sin(i + lt) * .3); }
  bannerText(ctx, 'पासवर्ड =', 'बनी', 230, 380, backOut(inv(A(2), A(2) + .4, lt)));
});
