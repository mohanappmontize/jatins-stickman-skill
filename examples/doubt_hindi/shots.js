// ---------- "The Doubt" (Hindi voice, English captions): two stickmen, a self-punch paradox. Style classic_light (grey studio). ----------
useStyle('classic_grey');
const C = (base, ...ex) => Object.assign({}, base, ...ex);
const handheld = (t, a = 3) => shake(t * .35, a, 1, 2);
const stOf = i => i === 0 ? 0 : SENT[i][0];
const HW = (i, k) => { const w = WORDS_HI.filter(x => x.line === i); return w[Math.min(k, w.length - 1)].s - SENT[i][0]; };   // Hindi word start, sentence-relative
const SHOTS = [];
function shot(i, tr, fn) { const start = stOf(i), end = i < SENT.length - 1 ? SENT[i + 1][0] : VO_END + .9; SHOTS.push({ start, end, tr, draw(ctx, lt, t) { fn(ctx, lt, t, end - start); } }); }
const XA = 300, XB = 780, GY = 1760, S = 900, BLUE = '#2f6fe0', ORG = '#ff8a1f', RED = '#e0392f';
const CAMZ = (x, t, z = 1, y = 1250, a = 2, sh = 0) => { const hh = handheld(t, a + sh); return { x: x + hh[0], y: y + hh[1], z, r: 0 }; };
const SC = (cam, wx, wy) => [540 + (wx - cam.x) * cam.z, 960 + (wy - cam.y) * cam.z];
const FA = o => C({ x: XA, y: GY, s: S, flip: 1, id: 'A' }, o);
const FB = o => C({ x: XB, y: GY, s: S, flip: -1, hat: 'cap', hatCol: RED, id: 'B' }, o);
const mouthT = (lt, a, b) => (lt > a && lt < b && Math.sin(lt * 18) > -.1) ? 'o' : 'flat';
const cheek = (x, fl, s) => [x + fl * .11 * s, GY - .76 * s];
const lbl = (ctx, cam, wx, wy, str, col, k, sz = 84) => { if (k <= 0) return; const [x, y] = SC(cam, wx, wy); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.rotate(-.06); const sc = backOut(clamp(k)); ctx.scale(sc, sc); ctx.font = `800 ${sz}px Nunito, sans-serif`; const w = ctx.measureText(str).width + 60; ctx.beginPath(); ctx.roundRect(-w / 2, -sz * .75, w, sz * 1.5, sz * .35); fillStroke(ctx, col, 8, '#111'); text(ctx, str, 0, 6, sz, '#fff', '#111', 0, 'Nunito', 800); ctx.restore(); };
const painHUD = (ctx, pct, t) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const x = 700, y = 330, w = 320, h = 54, sh = pct > .9 ? Math.sin(t * 50) * 4 : 0; ctx.translate(x + sh, y); text(ctx, 'PAIN', -w / 2 + 50, -52, 44, '#111', '#fff', 8, 'Nunito', 800); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2 + 20, w, h, 16); fillStroke(ctx, '#fff', 6, '#111'); ctx.beginPath(); ctx.roundRect(-w / 2 + 6, -h / 2 + 26, Math.max(0, (w - 12) * pct), h - 12, 10); ctx.fillStyle = pct > .6 ? RED : pct > .25 ? ORG : '#3fc24f'; ctx.fill(); ctx.restore(); };
const qm = (ctx, x, y, s, a = 1, rot = 0) => { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); text(ctx, '?', 0, 0, s, ORG, '#111', 16, 'Nunito', 800); ctx.restore(); };
const stars = (ctx, x, y, r, t, n = 4, a = 1) => { for (let i = 0; i < n; i++) { const an = t * 5 + i * TAU / n; star5(ctx, x + Math.cos(an) * r, y + Math.sin(an) * r * .35, 26, an, '#ffd23a'); } };
const dots = (ctx, cam, wx, wy, n, k) => { const [x, y] = SC(cam, wx, wy); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); text(ctx, '...'.slice(0, Math.max(1, Math.min(3, n))), x, y, 110, '#111', '#fff', 14, 'Nunito', 800); ctx.restore(); };
const sweatDrop = (ctx, x, y, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.moveTo(x, y - 30); ctx.quadraticCurveTo(x + 24, y + 6, x, y + 26); ctx.quadraticCurveTo(x - 24, y + 6, x, y - 30); fillStroke(ctx, '#8fd3ff', 5); ctx.restore(); };
// arm helper: self-punch path (hand target in body units, R arm)
const punchPath = (p, soft) => p < .5 ? [lerp(.14, soft ? .30 : .36, p / .5), lerp(-.4, soft ? -.62 : -.55, p / .5)] : [lerp(soft ? .30 : .36, .105, easeOut((p - .5) / .5)), lerp(soft ? -.62 : -.55, -.76, easeOut((p - .5) / .5))];

// 0 — HOOK: A (no cap) raises a finger, B (cap) turns to him
shot(0, 'whip', (ctx, lt, t, D) => {
  const cam = CAMZ(540, t, 1 + lt * .03, 1250, 3); BG(ctx, t, cam, {});
  const k = easeOut(inv(.5, .8, lt));
  drawStick(ctx, FB({ arms: { L: [.3, -.1], R: [.3, -.1] }, face: { eyes: 'normal', look: [-1, 0], mouth: 'flat' }, bob: Math.sin(t * 3) * .004 }));
  drawStick(ctx, FA({ arms: { L: [.3, -.1], R: [2.65, .3] }, face: { eyes: 'normal', look: [1, 0], mouth: mouthT(lt, .05, 2.6) }, headTilt: .05, bob: Math.sin(t * 3) * .004 }));
  qm(ctx, XA + 90, GY - 1.12 * S - (1 - k) * 80, 190 * k, k, .15);
});
// 1 — B answers (zoom on B)
shot(1, 'cut', (ctx, lt, t, D) => {
  const cam = CAMZ(XB - 80, t, 1.22, 1250, 2); BG(ctx, t, cam, {});
  drawStick(ctx, FA({ arms: { L: [.3, -.1], R: [2.65, .3] }, face: { eyes: 'normal', look: [1, 0], mouth: 'flat' } }));
  const sh = Math.sin(lt * 9) * .05;
  drawStick(ctx, FB({ arms: { L: { ik: [-.22, -.5], bend: 1 }, R: { ik: [.22, -.5], bend: -1 } }, headTilt: .08 + sh, face: { eyes: 'normal', look: [-1, 0], mouth: mouthT(lt, .15, 1.6) }, bob: Math.abs(Math.sin(lt * 6)) * -.01 }));
});
// 2 — A mimes the punch: fist taps own cheek, wince
shot(2, 'cut', (ctx, lt, t, D) => {
  const cam = CAMZ(XA + 40, t, 1.22, 1250, 2); BG(ctx, t, cam, {});
  drawStick(ctx, FB({ face: { eyes: 'normal', look: [-1, 0], mouth: 'flat' } }));
  const pun = (lt * 1.1) % 1, wince = lt > HW(2, 4);
  drawStick(ctx, FA({ arms: { L: [.3, -.1], R: { ik: punchPath(pun, true), bend: -1 } }, headTilt: wince ? -.12 : 0, face: wince ? { eyes: 'squint', mouth: 'frown' } : { eyes: 'normal', look: [1, 0], mouth: mouthT(lt, .05, HW(2, 3)) } }));
  if (pun > .48 && pun < .62) { const [cx, cy] = SC(cam, ...cheek(XA, 1, S)); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); burst(ctx, cx + 30, cy, 50, 8, '#ffe14d', 4); ctx.restore(); }
});
// 3 — "weak or strong?" A weighs it with two hands
shot(3, 'cut', (ctx, lt, t, D) => {
  const cam = CAMZ(XA + 120, t, 1.12, 1250, 2); BG(ctx, t, cam, {});
  drawStick(ctx, FB({ face: { eyes: 'normal', look: [-1, 0], mouth: 'flat' } }));
  const sw = Math.sin(lt * 3.2) * .5;
  drawStick(ctx, FA({ arms: { L: { ik: [-.24, -.52 + sw * .22], bend: 1 }, R: { ik: [.3, -.52 - sw * .22], bend: -1 } }, headTilt: sw * .06, face: { eyes: 'normal', look: [1, -.3], mouth: mouthT(lt, .05, HW(3, 5) + .7) } }));
  lbl(ctx, cam, XA - 190, GY - 1.3 * S, 'WEAK?', BLUE, easeOut(inv(HW(3, 2), HW(3, 2) + .2, lt)), 92);
  lbl(ctx, cam, XA + 330, GY - 1.3 * S, 'STRONG?', ORG, easeOut(inv(HW(3, 5), HW(3, 5) + .2, lt)), 92);
});
// 4 — B thinks, hand on chin, "let me test it"
shot(4, 'cut', (ctx, lt, t, D) => {
  const cam = CAMZ(540, t, 1.05, 1250, 2); BG(ctx, t, cam, {});
  drawStick(ctx, FA({ face: { eyes: 'normal', look: [1, 0], mouth: 'flat' } }));
  const think = inv(0, .6, lt);
  drawStick(ctx, FB({ arms: { L: [.3, -.1], R: { ik: [lerp(.2, .09, think), lerp(-.4, -.6, think)], bend: -1 } }, headTilt: think * -.08, face: lt > 1.4 ? { eyes: 'happy', mouth: mouthT(lt, 1.35, D - .2) } : { eyes: 'normal', look: [-.4, -.9], mouth: 'flat' } }));
  const [hx, hy] = SC(cam, XB, GY - 1.2 * S); if (lt < 1.4) dots(ctx, cam, XB, GY - 1.3 * S, Math.floor(inv(.1, 1.2, lt) * 3.99), 1);
});
// 5 — soft punch: nothing happens (pain meter ~0)
shot(5, 'cut', (ctx, lt, t, D) => {
  const cam = CAMZ(XB - 60, t, 1.22, 1250, 2); BG(ctx, t, cam, {});
  drawStick(ctx, FA({ face: { eyes: 'normal', look: [1, 0], mouth: 'flat' } }));
  const hit = HW(5, 2), p = inv(hit - .55, hit + .1, lt), tap = lt > hit + .05;
  drawStick(ctx, FB({ arms: { L: [.3, -.1], R: lt < hit - .55 ? [.3, -.1] : { ik: punchPath(p, true), bend: -1 } }, lean: p > .5 && p < 1 ? -.02 : 0, headTilt: tap && lt < hit + .35 ? .03 : 0, face: tap ? { eyes: 'normal', look: [0, 0], mouth: lt > HW(5, 3) ? 'smile' : 'flat' } : { eyes: 'squint', mouth: 'flat' } }));
  if (lt > hit + .05 && lt < hit + .4) { const [cx, cy] = SC(cam, ...cheek(XB, -1, S)); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); text(ctx, 'tap', cx - 120, cy - 50, 70, '#111', '#fff', 10, 'Nunito', 800); ctx.restore(); }
  painHUD(ctx, tap ? .04 : 0, t);
});
// 6 — hard punch: OUCH, hop, hold the cheek
shot(6, 'cut', (ctx, lt, t, D) => {
  const hit = HW(6, 3) + .1, imp = lt > hit, since = lt - hit, cam = CAMZ(XB - 60, t, 1.22 + (imp ? .04 : 0), 1250, 2, imp && since < .6 ? 14 : 0); BG(ctx, t, cam, {});
  drawStick(ctx, FA({ arms: { L: [.8, -.3], R: [.8, -.3] }, face: { eyes: imp ? 'wide' : 'normal', look: [1, 0], mouth: imp ? 'o' : 'flat' } }));
  const p = inv(hit - .5, hit, lt), hop = imp && since < .7 ? Math.abs(Math.sin(since * 8)) * .06 * Math.max(0, 1 - since) : 0;
  const arms = imp ? { L: [.3, -.1], R: { ik: [.1, -.74], bend: -1 } } : { L: [.3, -.1], R: lt < hit - .5 ? [.3, -.1] : { ik: punchPath(p, false), bend: -1 } };
  drawStick(ctx, FB({ arms, lean: imp ? Math.min(.12, since * 1.2) : -.1 * p, headTilt: imp ? .22 * Math.max(0, 1 - since * 2.5) : 0, bob: -hop, face: imp ? { eyes: 'x', mouth: 'o' } : { eyes: 'squint', mouth: 'flat' } }));
  if (imp && since < .5) { const [cx, cy] = SC(cam, ...cheek(XB, -1, S)); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); burst(ctx, cx - 40, cy, 140 * easeOut(inv(0, .15, since)), 12, '#ffe14d', 6); ctx.restore(); }
  if (imp) { const [sx, sy] = SC(cam, XB, GY - .97 * S); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); stars(ctx, sx, sy - 20, 150, t, 4); const k = backOut(inv(0, .25, since)); ctx.translate(560, 860); ctx.rotate(-.1); ctx.scale(k, k); text(ctx, 'OUCH!', 0, 0, 150, RED, '#fff', 22, 'Nunito', 800); ctx.restore(); }
  painHUD(ctx, imp ? Math.min(1, .15 + since * 4) : .05, t);
});
// 7 — A points: "so you're weak?"
shot(7, 'cut', (ctx, lt, t, D) => {
  const cam = CAMZ(540, t, 1.04, 1250, 2); BG(ctx, t, cam, {});
  drawStick(ctx, FB({ arms: { L: [.3, -.1], R: { ik: [.1, -.74], bend: -1 } }, lean: .1, face: { eyes: 'x', mouth: 'o' } }));
  const pt = easeOut(inv(.1, .5, lt));
  drawStick(ctx, FA({ arms: { L: [.3, -.1], R: { ik: [lerp(.2, .55, pt), lerp(-.4, -.62, pt)], bend: -1 } }, headTilt: -.05, face: { eyes: 'normal', look: [1, 0], mouth: lt > HW(7, 1) && lt < D - .3 ? mouthT(lt, 0, 9) : 'smile' } }));
  lbl(ctx, cam, XB - 40, GY - 1.28 * S, 'WEAK?', BLUE, easeOut(inv(HW(7, 2), HW(7, 2) + .2, lt)), 92);
});
// 8 — B flexes: "I hit that hard, I'm strong!"
shot(8, 'whip', (ctx, lt, t, D) => {
  const cam = CAMZ(XB - 70, t, 1.2, 1250, 2); BG(ctx, t, cam, {});
  drawStick(ctx, FA({ arms: { L: [.8, -.3], R: [.8, -.3] }, face: { eyes: 'wide', look: [1, 0], mouth: 'o' } }));
  const f = easeOut(inv(.2, .6, lt)), pump = Math.sin(lt * 7) * .03 * f;
  drawStick(ctx, FB({ arms: { L: { ik: [-lerp(.2, .3, f), lerp(-.4, -.8 + pump, f)], bend: -1 }, R: { ik: [lerp(.2, .3, f), lerp(-.4, -.8 + pump, f)], bend: 1 } }, lean: -.03 * f, bob: Math.sin(lt * 7) * -.006, face: { eyes: 'happy', mouth: 'grin' } }));
  const k = easeOut(inv(HW(8, 4), HW(8, 4) + .2, lt)); 
  lbl(ctx, cam, XB - 50, GY - 1.3 * S, 'STRONG!', ORG, k, 100); for (let i = 0; i < 4; i++) sparkle(ctx, XB - 40 + Math.cos(t * 2 + i * 1.6) * 330, GY - 1.0 * S + Math.sin(t * 2.3 + i) * 220, 30, .5 + .5 * Math.sin(t * 6 + i));
});
// 9 — A confused: "then why did it hurt?"
shot(9, 'cut', (ctx, lt, t, D) => {
  const cam = CAMZ(XA + 120, t, 1.12, 1250, 2); BG(ctx, t, cam, {});
  drawStick(ctx, FB({ arms: { L: { ik: [-.3, -.8], bend: -1 }, R: { ik: [.3, -.8], bend: 1 } }, face: { eyes: 'happy', mouth: 'grin' }, bob: Math.sin(lt * 5) * -.005 }));
  const scr = Math.sin(lt * 14) * .03;
  drawStick(ctx, FA({ arms: { L: [.3, -.1], R: { ik: [.1 + scr, -.92], bend: -1 } }, headTilt: -.1, face: { eyes: 'normal', look: [0, -.8], mouth: lt > HW(9, 3) ? mouthT(lt, 0, 9) : 'flat' } }));
  for (let i = 0; i < 3; i++) { const a = easeOut(inv(.3 + i * .3, .6 + i * .3, lt)); qm(ctx, XA - 140 + i * 150, GY - 1.28 * S - i % 2 * 50 + Math.sin(t * 4 + i) * 12, 150 * a, a, (i - 1) * .2); }
});
// 10 — B's brain crashes: head wobbles, smoke, ERROR
shot(10, 'whip', (ctx, lt, t, D) => {
  const cr = HW(10, 2), cam = CAMZ(XB - 70, t, 1.15, 1250, 2, lt > cr ? 6 : 0); BG(ctx, t, cam, {});
  drawStick(ctx, FA({ arms: { L: [.8, -.3], R: [.8, -.3] }, face: { eyes: 'wide', look: [1, 0], mouth: 'o' } }));
  const bad = lt > cr, sh = bad ? Math.sin(lt * 26) * .14 : Math.sin(lt * 6) * .03;
  drawStick(ctx, FB({ arms: bad ? { L: [1.9 + Math.sin(lt * 20) * .3, .2], R: [1.9 - Math.sin(lt * 20) * .3, .2] } : { L: [.3, -.1], R: [.3, -.1] }, headTilt: sh, x: XB + (bad ? Math.sin(lt * 40) * 6 : 0), face: bad ? { eyes: Math.sin(lt * 12) > 0 ? 'x' : 'wide', mouth: 'o' } : { eyes: 'normal', look: [0, -.6], mouth: 'flat' } }));
  if (bad) { for (let i = 0; i < 4; i++) puff(ctx, XB - 40 + Math.sin(t * 3 + i) * 40, GY - 1.15 * S - 60 - ((lt * 150 + i * 90) % 360), 40 + i * 12, t, '#7a808c', 3 + i, .8 - ((lt * 150 + i * 90) % 360) / 450); const k = backOut(inv(cr, cr + .25, lt)); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(690, 300); ctx.scale(k, k); ctx.beginPath(); ctx.roundRect(-250, -70, 500, 140, 18); fillStroke(ctx, '#fff', 7, '#111'); ctx.fillStyle = RED; ctx.fillRect(-243, -63, 486, 40); text(ctx, 'BRAIN.EXE', 0, -43, 34, '#fff', '#111', 0, 'Nunito', 800); text(ctx, 'ERROR 404', 0, 24, 62, '#111', '#fff', 0, 'Nunito', 800); ctx.restore(); }
});
// 11 — "Wait, you tell me!": B storms over and slugs A
shot(11, 'whip', (ctx, lt, t, D) => {
  const ax = 230, bx0 = 800, bx1 = 590, mv = easeOut(inv(.05, 1.25, lt)), bx = lerp(bx0, bx1, mv), hit = D - .25, wind = inv(1.2, hit, lt), imp = lt > hit;
  const cam = CAMZ(410, t, 1.0 + inv(.5, D, lt) * .08, 1250, 2, imp ? 12 : 0); BG(ctx, t, cam, {});
  drawStick(ctx, FA({ x: ax, arms: { L: [.8, -.3], R: [.8, -.3] }, lean: imp ? -.14 : 0, headTilt: imp ? -.25 : 0, face: imp ? { eyes: 'x', mouth: 'o' } : { eyes: 'wide', look: [1, 0], mouth: 'o' } }));
  const w = walker(bx0, bx, S, {});
  drawStick(ctx, FB(mv < 1 ? C(w, { x: bx, flip: -1, face: { eyes: 'normal', browAng: .3, mouth: mouthT(lt, .05, 1.5), look: [-1, 0] } }) : { x: bx, arms: { L: [.3, -.1], R: { ik: [lerp(.2, imp ? .66 : .6, wind) * 1.0, lerp(-.4, -.6, wind)], bend: -1 } }, lean: lerp(0, imp ? .12 : -.06, wind), face: { eyes: 'normal', look: [-1, 0], mouth: 'flat', browAng: .35 } }));
  if (imp) { const [cx, cy] = SC(cam, ...cheek(ax, 1, S)); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); burst(ctx, cx + 20, cy, 130 * easeOut(inv(hit, hit + .15, lt)), 12, '#ffe14d', 6); ctx.restore(); }
});
// 12 — A dizzy, white flag: "Ouch! Doubt cancelled!"
shot(12, 'cut', (ctx, lt, t, D) => {
  const cam = CAMZ(430, t, 1.0, 1250, 2, lt < .5 ? 8 : 0); BG(ctx, t, cam, {});
  const k = easeOut(inv(0, .6, lt)), ax = 230 - (1 - k) * 60 - 0, flag = inv(HW(12, 1) - .2, HW(12, 1) + .3, lt);
  drawStick(ctx, FB({ x: 590, arms: { L: [.3, -.1], R: [.3, -.1] }, face: { eyes: 'happy', mouth: 'grin' }, bob: Math.abs(Math.sin(lt * 5)) * -.008 }));
  drawStick(ctx, FA({ x: ax, lean: lerp(-.14, 0, k), headTilt: lerp(-.25, Math.sin(lt * 4) * .05, k), arms: flag > 0 ? { L: [.3, -.1], R: [2.65, .3] } : { L: [.3, -.1], R: [.3, -.1] }, prop: (c, kk, hp) => { if (kk === 'R' && flag > 0) { c.save(); c.translate(hp[0], hp[1]); c.rotate(Math.sin(t * 8) * .1); line(c, 0, 0, 0, -.5, .016, INK); c.beginPath(); c.moveTo(0, -.5); c.lineTo(.3, -.45 + Math.sin(t * 9) * .02); c.lineTo(0, -.34); c.closePath(); fillStroke(c, '#fff', .012); c.restore(); } }, face: { eyes: lt < 1.2 ? 'x' : 'squint', mouth: lt > HW(12, 0) ? mouthT(lt, 0, D - .8) : 'o' } }));
  const [sx, sy] = SC(cam, ax, GY - .97 * S); if (lt < D - .7) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); stars(ctx, sx, sy - 40, 140, t, 4, 1 - inv(D - 1.1, D - .7, lt)); ctx.restore(); }
  const st = backOut(inv(HW(12, 1), HW(12, 1) + .3, lt)); if (st > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(540, 520); ctx.rotate(-.1); ctx.scale(st, st); ctx.beginPath(); ctx.roundRect(-330, -80, 660, 160, 20); fillStroke(ctx, '#fff', 10, '#3fa35b'); text(ctx, 'DOUBT: CANCELLED', 0, 6, 62, '#3fa35b', '#fff', 0, 'Nunito', 800); ctx.restore(); }
});
