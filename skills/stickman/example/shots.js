// ---------- "The Seed": characters + shots (timed from the voiceover) ----------
const C = (base, extra) => Object.assign({}, base, extra);
const PIP = { cols: ['#ff8a3d', '#fff3e0'], hat: 'tuft', hatCol: '#3fc24f', blush: true, belt: false };
const F1 = { cols: ['#2f63c9', '#f6f1e8'], hat: 'cap', hatCol: '#e0392f' };
const F2 = { cols: PAL.green, hat: 'beanie', hatCol: '#7a4bc4' };
const F3 = { cols: PAL.purple, hat: 'cap', hatCol: '#f2b52a' };
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const walkArms = (t, sp = 9, amp = .6) => ({ L: [.3 - Math.sin(t * sp) * amp, -.3], R: [.3 + Math.sin(t * sp) * amp, -.3] });
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const Wt = (w, l) => { const x = WORDS.find(o => o.w.toLowerCase() === w.toLowerCase() && (l == null || o.line === l)); if (!x) throw new Error('word ' + w); return x.s; };
const stOf = i => i === 0 ? 0 : SENT[i][0];
const SHOTS = [];
function shot(i, tr, fn) {
  const start = stOf(i), end = i < SENT.length - 1 ? SENT[i + 1][0] : VO_END + .9;
  SHOTS.push({ start, end, tr, draw(ctx, lt, t) { fn(ctx, lt, t, (w, l) => Wt(w, l) - start); } });
}
function cycleMood(f) {
  const seg = [[0, 'dawn'], [.14, 'day'], [.45, 'day'], [.58, 'dusk'], [.72, 'night'], [.9, 'night'], [1, 'dawn']];
  for (let i = 0; i < seg.length - 1; i++) if (f <= seg[i + 1][0]) return moodMix(seg[i][1], seg[i + 1][1], inv(seg[i][0], seg[i + 1][0], f));
  return MOODS.dawn;
}
const faceHappy = { eyes: 'happy', mouth: 'teeth', browUp: 1 };

// 0 — hook: Pip proudly shows the seed, then the laughing starts
shot(0, 'whip', (ctx, lt, t, L) => {
  const hh = handheld(t, 3), lau = L('everyone');
  const cam = { x: 540 + hh[0], y: 930 + hh[1] - lt * 8, z: 1 + lt * .04, r: Math.sin(t * .6) * .006 };
  drawWorld(ctx, t, cam, MOODS.day, { sun: [860, 230, 80, .9] });
  applyCam(ctx, cam, 1);
  const k = easeOut(inv(lau, lau + .3, lt)), lf = Math.sin(lt * 20) * .07 * k;
  if (k > 0) {
    drawStick(ctx, C(F1, { x: 150, y: 1900 - (1 - k) * 600, s: 800, flip: 1, lean: -.12 + lf, face: faceHappy, arms: { L: [2.2, .4], R: [.9, -2] }, shadow: false }));
    drawStick(ctx, C(F3, { x: 960, y: 1930 - (1 - k) * 640, s: 860, flip: -1, lean: -.12 - lf, face: faceHappy, arms: { L: [.9, -2], R: [2.4, .3] }, shadow: false }));
  }
  const sad = inv(lau + .25, lau + .6, lt);
  drawStick(ctx, C(PIP, {
    x: 540, y: 2030, s: 1450, bob: Math.sin(t * 3) * .004, headTilt: Math.sin(t * 1.6) * .03 - sad * .07,
    arms: { L: [.3, -.1], R: { ik: [.27, -.8], bend: -1 } }, armLen: 1.25,
    prop: (c, kk, hp) => { if (kk === 'R') { drawSeed(c, hp[0] + .02, hp[1] - .06, .085, -.3); const sa = .5 + .5 * Math.sin(lt * 7); if (sad < .5) sparkle(c, hp[0] + .06, hp[1] - .1, .035 * sa, sa); } },
    face: sad < .5 ? { eyes: 'normal', look: [.8, -.5], mouth: 'grin', browUp: 1 } : { eyes: 'normal', look: [-.3, .6], mouth: 'frown', browAng: .45, browUp: -.3 }, shadow: false,
  }));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (k > 0) { bubble(ctx, 210, 960, 'HA HA!', 60, 150, 1080, easeOut(inv(lau + .05, lau + .3, lt))); bubble(ctx, 880, 900, 'HE HE!', 60, 940, 1050, easeOut(inv(lau + .25, lau + .5, lt))); }
});

// 1 — the friends mock
shot(1, 'cut', (ctx, lt, t, L) => {
  const hh = handheld(t, 4), cam = { x: 540 + hh[0], y: 930 + hh[1], z: 1.03 + lt * .02, r: 0 };
  drawWorld(ctx, t, cam, MOODS.day, { sun: [200, 260, 70, .8] });
  applyCam(ctx, cam, 1);
  const lf = Math.sin(lt * 17) * .06;
  drawStick(ctx, C(PIP, { x: 150, y: 1790, s: 430, face: { eyes: 'normal', look: [.5, 0], mouth: 'frown', browAng: .4 }, headTilt: -.06, arms: { L: [.3, -.1], R: { ik: [.3, -.62], bend: -1 } }, armLen: 1.2, prop: (c, kk, hp) => { if (kk === 'R') drawSeed(c, hp[0] + .01, hp[1] - .03, .06, -.3); } }));
  drawStick(ctx, C(F1, { x: 420, y: 1700, s: 560, flip: -1, lean: lf, face: faceHappy, arms: { L: [1.5, -.1], R: [.9, -2.2] }, legs: { L: [.14, -.04], R: [.14, -.04] }, bob: Math.abs(Math.sin(lt * 9)) * -.01 }));
  drawStick(ctx, C(F2, { x: 660, y: 1730, s: 600, flip: -1, lean: -lf, face: faceHappy, arms: { L: [1.6, -.1], R: [.9, -2.2] }, bob: Math.abs(Math.sin(lt * 9 + 1)) * -.01 }));
  drawStick(ctx, C(F3, { x: 910, y: 1700, s: 560, flip: -1, lean: lf, face: faceHappy, arms: { L: [1.4, -.1], R: [.9, -2.2] }, bob: Math.abs(Math.sin(lt * 9 + 2)) * -.01 }));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  bubble(ctx, 330, 1050, 'Plant that?', 62, 430, 1150, easeOut(inv(.02, .22, lt)));
  bubble(ctx, 690, 900, 'It will never grow!', 56, 720, 1150, easeOut(inv(L('never') - .05, L('never') + .15, lt)));
});

// 2 — dig, drop the seed, cover it
shot(2, 'whip', (ctx, lt, t, L) => {
  const hh = handheld(t, 3), cam = { x: 600 + hh[0], y: 1000 + hh[1], z: 1.12 - lt * .02, r: 0 };
  drawWorld(ctx, t, cam, MOODS.day, { sun: [880, 300, 80, .9] });
  applyCam(ctx, cam, 1);
  const HX = 820, HY = 1705, hole = inv(0, 1.5, lt) * (1 - inv(2.75, 2.95, lt));
  drawHole(ctx, HX, HY, 95, easeOut(hole) * (lt < 2.9 ? 1 : 0));
  const dig = lt < 1.75, px = 400, py = 1690, s = 760;
  const ph = (lt * 1.55) % 1, lift = dig ? Math.max(0, Math.sin(Math.min(1, ph / .62) * Math.PI)) : 0;
  const Hh = [px + s * .52, py - s * (.37 + lift * .12)], Bl = [HX - 30 + lift * -90, HY - 15 - lift * 230];
  const seedStart = [px + s * .38, py - s * .55], dropT = inv(2.15, 2.65, lt);
  const holding = lt >= 1.75 && lt < 2.15;
  drawStick(ctx, C(PIP, {
    x: px, y: py, s, lean: dig ? .1 + lift * .06 : 0, bob: Math.sin(t * 3) * .004,
    arms: dig ? { L: { ik: [(Hh[0] - px) / s - .06, (Hh[1] - py) / s], bend: 1 }, R: { ik: [(Hh[0] - px) / s + .04, (Hh[1] - py) / s + .06], bend: 1 } } : (holding || lt < 2.3 ? { L: [.3, -.1], R: { ik: [.38, -.55], bend: -1 } } : (lt > 3.2 ? { L: [2.5, .3], R: [2.5, .3] } : { L: [.3, -.1], R: [.3, -.1] })),
    legs: lt > 3.2 ? { L: [.2, -.1], R: [.2, -.1] } : undefined,
    armLen: 1.05, prop: (c, kk, hp) => { if (kk === 'R' && holding) drawSeed(c, hp[0] + .01, hp[1] - .04, .055, -.3); },
    face: lt > 3.2 ? { eyes: 'happy', mouth: 'grin', browUp: 1 } : dig ? { eyes: 'normal', look: [.9, .6], mouth: 'flat', browAng: -.25 } : { eyes: 'normal', look: [.9, .5], mouth: 'smile' },
  }));
  if (dig) {
    const Hd = Math.hypot(Bl[0] - Hh[0], Bl[1] - Hh[1]), ux = (Hh[0] - Bl[0]) / Hd, uy = (Hh[1] - Bl[1]) / Hd, tx = Hh[0] + ux * 120, ty = Hh[1] + uy * 120;
    line(ctx, Bl[0], Bl[1], tx, ty, 22, INK); line(ctx, Bl[0], Bl[1], tx, ty, 12, '#c98a4b');
    ctx.save(); ctx.translate(Bl[0], Bl[1]); ctx.rotate(Math.atan2(uy, ux) + Math.PI / 2 + Math.PI); ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(34, 0); ctx.lineTo(26, 90); ctx.quadraticCurveTo(0, 112, -26, 90); ctx.closePath(); fillStroke(ctx, '#cfd8e3', 7); ctx.restore();
    soil(ctx, HX - 60, HY - 30, Math.floor(lt * 1.55) / 1.55 + .62 / 1.55, lt, 9, Math.floor(lt * 1.55) + 4);
  } else if (lt < 2.9) { line(ctx, Bl[0] + 40, Bl[1] + 20, Bl[0] + 40, Bl[1] - 250, 22, INK); line(ctx, Bl[0] + 40, Bl[1] + 20, Bl[0] + 40, Bl[1] - 250, 12, '#c98a4b'); }
  if (lt >= 2.15 && lt < 2.7) { const p = dropT, x = lerp(seedStart[0], HX, p), y = lerp(seedStart[1], HY - 4, p) - Math.sin(p * Math.PI) * 170; drawSeed(ctx, x, y, 38, p * 5); }
  const mg = kf(lt, [[2.7, 0], [3.25, 1, backOut]]);
  drawMound(ctx, HX, HY + 6, 130, mg);
  if (lt > 2.7 && lt < 3.4) { puff(ctx, HX - 60, HY - 40, 70, t, '#c79a6a', 5, 1 - inv(2.7, 3.4, lt)); puff(ctx, HX + 80, HY - 50, 60, t, '#c79a6a', 7, 1 - inv(2.75, 3.4, lt)); }
  if (lt > 3.2) { const a = .5 + .5 * Math.sin(lt * 9); sparkle(ctx, HX + 30, HY - 130, 40 * a, a); }
});

// 3 — day after day (time-lapse)
shot(3, 'cut', (ctx, lt, t, L) => {
  const dur = (SENT[4][0] - SENT[3][0]), f = ((lt / dur) * 2.2) % 1;
  const M = cycleMood(f), night = f > .6 && f < .92;
  const sunV = f < .56, p1 = f / .56, p2 = inv(.5, 1, f);
  const hh = handheld(t, 3), cam = { x: 560 + hh[0], y: 1000 + hh[1], z: 1.1 + lt * .02, r: 0 };
  drawWorld(ctx, t, cam, M, { sun: sunV ? [lerp(60, 1020, p1), 760 - 560 * Math.sin(p1 * Math.PI), 75, 1] : null, moon: !sunV ? [lerp(80, 1000, p2), 760 - 470 * Math.sin(p2 * Math.PI), 62] : null, stars: (f > .62 && f < .95) ? 1 : 0, lit: night ? 1 : 0 });
  applyCam(ctx, cam, 1);
  const MX = 740, MY = 1700, px = 330, py = 1700, s = 640;
  const tilt = .5 + Math.sin(lt * 5) * .05;
  drawMound(ctx, MX, MY + 6, 130, 1);
  const hand = [px + s * .36, py - s * .52];
  drawStick(ctx, C(PIP, { x: px, y: py, s, bob: Math.sin(t * 4) * .004, arms: { L: [.3, -.1], R: { ik: [(hand[0] - px) / s, (hand[1] - py) / s], bend: -1 } }, armLen: 1.05, face: { eyes: 'normal', look: [.9, .6], mouth: 'smile' } }));
  const tip = drawCan(ctx, hand[0] + 40, hand[1] - 8, 150, tilt, 1);
  waterDrops(ctx, tip[0], tip[1], 1, lt, MY - 8, 8);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const day = 1 + Math.floor(inv(0, 1, lt / dur) * 29);
  text(ctx, 'DAY ' + day, 540, 430, 120, '#fff', INK, 20, 'Poppins', 700);
  if (night) { ctx.fillStyle = 'rgba(20,20,70,.15)'; ctx.fillRect(0, 0, W, H); }
});

// 4 — nothing happens
shot(4, 'whip', (ctx, lt, t, L) => {
  const hh = handheld(t, 3), cam = { x: 540 + hh[0], y: 1060 + hh[1], z: 1.02 + lt * .035, r: 0 };
  drawWorld(ctx, t, cam, moodMix('day', 'sad', inv(0, 2.5, lt)), { sun: [880, 300, 70, .7 - lt * .15], cloudA: .9 });
  applyCam(ctx, cam, 1);
  const bl = (lt > 1.05 && lt < 1.17) || (lt > 2.4 && lt < 2.5) ? 1 : 0;
  drawStick(ctx, C(PIP, { x: 540, y: 1790, s: 1000, bob: Math.sin(t * 2) * .004, headTilt: Math.sin(t * 1.2) * .05 + inv(1.8, 2.6, lt) * .08, arms: { L: [.3, -.1], R: [.3, -.1] }, face: { eyes: 'normal', look: [0, .8], blink: bl, mouth: lt < 1.9 ? 'flat' : 'frown', browAng: lt < 1.9 ? 0 : .35, browUp: .3 }, shadow: false }));
  drawMound(ctx, 540, 1810, 420, 1);
  const fx = 540 + Math.cos(t * 4.4) * 250, fy = 1380 + Math.sin(t * 8.8) * 70;
  circle(ctx, fx, fy, 11); ctx.fillStyle = INK; ctx.fill(); const fl = Math.sin(t * 90) * .5 + .5;
  ellipse(ctx, fx - 10, fy - 12 - fl * 5, 13, 7, -.5 + fl * .4); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill(); ellipse(ctx, fx + 10, fy - 12 - fl * 5, 13, 7, .5 - fl * .4); ctx.fill();
  const dots = Math.floor(inv(.9, 1.5, lt) * 3.99);
  if (lt > .9) { ctx.setTransform(1, 0, 0, 1, 0, 0); bubble(ctx, 830, 720, dots >= 3 ? '...' : dots === 2 ? '..' : '.', 78, 720, 900, easeOut(inv(.9, 1.1, lt))); }
  if (lt > 2.2) { applyCam(ctx, cam, 1); sweat(ctx, 540 + 230, 1790 - 1000 * .85, 34, inv(2.2, 2.5, lt)); }
});

// 5 — friends get bored and leave
shot(5, 'whip', (ctx, lt, t, L) => {
  const cam = { x: 540 + handheld(t, 3)[0], y: 980, z: 1.04, r: 0 };
  drawWorld(ctx, t, cam, MOODS.sad, { cloudA: .85, dark: '#aeb6cf' });
  applyCam(ctx, cam, 1);
  drawMound(ctx, 640, 1745, 105, 1);
  const yawn = lt < .95;
  const walk = (base, x0, y, s, delay) => {
    const g = Math.max(0, lt - .95 - delay), x = x0 - g * 560;
    if (yawn) return drawStick(ctx, C(base, { x: x0, y, s, face: { eyes: 'squint', mouth: 'o', browUp: .6 }, headTilt: Math.sin(lt * 5) * .06, arms: { L: [2.6, .3], R: [2.6, .3] }, bob: Math.sin(lt * 4) * .006 }));
    return drawStick(ctx, C(base, { x, y, s, flip: -1, lean: -.05, legs: walkLegs(t, 11), arms: walkArms(t, 11), bob: Math.abs(Math.sin(t * 11)) * -.012, face: { eyes: 'half', mouth: 'flat', look: [-1, 0] } }));
  };
  walk(F3, 230, 1680, 520, .0); walk(F1, 420, 1700, 540, .12); walk(F2, 580, 1670, 500, .22);
  drawStick(ctx, C(PIP, { x: 880, y: 1730, s: 520, flip: -1, headTilt: lt > 1.6 ? 0 : .05, arms: { L: [.3, -.1], R: [.3, -.1] }, face: { eyes: 'normal', look: [-.9, 0], mouth: lt > 1.7 ? 'flat' : 'frown', browAng: lt > 1.7 ? -.25 : .35 } }));
});

// 6 — "But Pip stayed" in the rain
shot(6, 'whip', (ctx, lt, t, L) => {
  const cam = { x: 540 + handheld(t, 4)[0], y: 1000, z: 1 + lt * .06, r: 0 };
  drawWorld(ctx, t, cam, MOODS.rain, { dark: '#5d6a8c', cloudA: 1 });
  applyCam(ctx, cam, 1);
  drawMound(ctx, 330, 1780, 150, 1);
  drawStick(ctx, C(PIP, { x: 620, y: 1930, s: 1000, flip: 1, bob: Math.sin(t * 2) * .004, arms: { L: [.7, -.9], R: [.7, -.9] }, face: { eyes: 'normal', look: [-.6, .1], mouth: 'flat', browAng: -.35 }, shadow: true }));
  rain(ctx, t, 1); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(20,30,70,.18)'; ctx.fillRect(0, 0, W, H);
  if (lt > 1.2) { applyCam(ctx, cam, 1); const a = .5 + .5 * Math.sin(lt * 8); sparkle(ctx, 330, 1590, 38 * a, a * inv(1.2, 1.5, lt)); }
});

// 7 — the sprout
shot(7, 'cut', (ctx, lt, t, L) => {
  const pop = L('pushed'), hh = handheld(t, 3);
  const cam = { x: 560 + hh[0], y: 1180 - lt * 8, z: 1.14 + lt * .02, r: Math.sin(t * .8) * .004 };
  const sunY = lerp(1250, 760, easeOut(inv(0, 3.4, lt)));
  drawWorld(ctx, t, cam, moodMix('dawn', 'gold', inv(pop, pop + 1.2, lt)), { sun: [840, sunY, 100, .95], horizon: 1130 });
  applyCam(ctx, cam, 1);
  const MX = 600, MY = 1640, quake = inv(pop - .9, pop, lt);
  drawMound(ctx, MX, MY, 230, 1, Math.sin(t * 60) * 5 * quake);
  const g = lt > pop ? elastic(inv(pop, pop + 1.0, lt)) : 0;
  drawSprout(ctx, MX, MY - 24, 270, clamp(g, 0, 1.18), t);
  if (lt > pop && lt < pop + .8) { const b = inv(pop, pop + .25, lt), fade = 1 - inv(pop + .3, pop + .8, lt); ctx.save(); ctx.globalAlpha = fade; burst(ctx, MX, MY - 200, 130 * b, 11, '#fff3a8', 4); ctx.restore(); puff(ctx, MX - 140, MY - 20, 60, t, '#c79a6a', 5, fade); puff(ctx, MX + 150, MY - 20, 55, t, '#c79a6a', 8, fade); }
  if (lt > pop + .1) for (let i = 0; i < 6; i++) { const a = i * 1.05 + lt, r = 140 + (lt - pop) * 70 + i * 12; const al = clamp(1 - inv(pop + .4, pop + 1.8, lt)); sparkle(ctx, MX + Math.cos(a) * r, MY - 250 + Math.sin(a * 1.3) * r * .6, 28 + i % 3 * 8, al); }
  const enter = inv(.7, 1.9, lt), px = lerp(-250, 290, easeOut(enter)), amazed = lt > pop - .05;
  const jump = amazed ? Math.abs(Math.sin(clamp(lt - pop, 0, 9) * 6)) * Math.max(0, 1 - (lt - pop) * .7) * .15 : 0;
  drawStick(ctx, C(PIP, { x: px, y: 1770 - jump * 700, s: 740, flip: 1, legs: enter < 1 ? walkLegs(t, 10) : (jump > .01 ? { L: [.3, -.5], R: [.3, -.5] } : undefined), arms: amazed ? { L: [2.6, .3], R: [2.6, .3] } : (enter < 1 ? walkArms(t, 10) : { L: [.3, -.1], R: [.3, -.1] }), face: amazed ? { eyes: lt > pop + 1 ? 'happy' : 'wide', mouth: lt > pop + 1 ? 'grin' : 'o', browUp: 1 } : { eyes: 'normal', look: [.8, 0], mouth: 'smile' } }));
});

// 8 — it grows taller than the houses
shot(8, 'whip', (ctx, lt, t, L) => {
  const gold = L('golden'), hh = handheld(t, 2);
  const g = kf(lt, [[0, .26], [2.4, 1.12, easeOut]]);
  const zc = kf(lt, [[0, 1.12], [2.8, .64]]), yc = kf(lt, [[0, 1350], [2.8, 640]]);
  const cam = { x: 540 + hh[0], y: yc + hh[1], z: zc, r: 0 };
  drawWorld(ctx, t, cam, moodMix('gold', 'day', inv(0, 3, lt)), { sun: [880, 520, 100, .9] });
  applyCam(ctx, cam, 1);
  const fr = clamp((lt - gold) * 2.6, 0, 9.5);
  drawTree(ctx, 540, 1600, 1000, g, t, fr, inv(gold, gold + 1.5, lt));
  drawStick(ctx, C(PIP, { x: 300, y: 1680, s: 400, arms: { L: [2.6, .3], R: [2.6, .3] }, face: { eyes: 'wide', look: [.5, -1], mouth: 'o', browUp: 1 }, headTilt: -.12 }));
  if (fr > 0) for (let i = 0; i < 7; i++) { const a = (t * .9 + i * .9); sparkle(ctx, 540 + Math.cos(a * 1.1 + i) * 380, 600 + Math.sin(a + i) * 300, 34 + i % 3 * 10, (.5 + .5 * Math.sin(t * 5 + i)) * clamp(fr / 2)); }
});

// 9 — sharing
shot(9, 'cut', (ctx, lt, t, L) => {
  const hh = handheld(t, 3), cam = { x: 600 + hh[0], y: 1010, z: 1.0 + lt * .015, r: 0 };
  drawWorld(ctx, t, cam, MOODS.gold, { sun: [880, 420, 90, .9] });
  applyCam(ctx, cam, 1);
  const thrown = [1.25, 1.95, 2.65];
  drawTree(ctx, 140, 1700, 880, 1, t, 9.5 - thrown.filter(x => lt > x).length * .8, .6);
  const fr = [[F1, 700, 1690, 520], [F2, 850, 1710, 540], [F3, 985, 1690, 500]];
  const hand = [470 + 560 * .38, 1700 - 560 * .55];
  fr.forEach(([base, tx, y, s], i) => {
    const arr = inv(.1 + i * .1, 1.2 + i * .1, lt), x = lerp(1400 + i * 120, tx, easeOut(arr)), walking = arr < 1;
    const got = lt > thrown[i] + .5;
    drawStick(ctx, C(base, { x, y, s, flip: -1, legs: walking ? walkLegs(t + i, 13) : undefined, arms: walking ? walkArms(t + i, 13) : (got ? { L: [.6, -1.1], R: [.3, -.1] } : { L: [1.2, -.4], R: [.3, -.1] }), bob: walking ? Math.abs(Math.sin((t + i) * 13)) * -.014 : 0, face: got ? { eyes: 'happy', mouth: 'grin', browUp: 1 } : { eyes: 'wide', mouth: 'smile', look: [-1, 0] } }));
    if (got) { drawApple(ctx, x - s * .2, y - s * .42, 26, 1); heart(ctx, x - 20 + Math.sin(lt * 4 + i) * 12, y - s * 1.12 - (lt - thrown[i] - .5) * 90, 38, 1 - inv(thrown[i] + 1, thrown[i] + 1.6, lt), Math.sin(lt * 3 + i) * .2); }
    if (lt > thrown[i] && lt < thrown[i] + .5) { const p = inv(thrown[i], thrown[i] + .5, lt), tx2 = x - s * .2, ty2 = y - s * .42; drawApple(ctx, lerp(hand[0], tx2, p), lerp(hand[1], ty2, p) - Math.sin(p * Math.PI) * 220, 30, 1); }
  });
  const throwing = thrown.some(x => lt > x - .35 && lt < x + .1), arms = throwing ? { L: [.3, -.1], R: [2.6, .2] } : { L: [.3, -.1], R: { ik: [.38, -.2], bend: -1 } };
  drawStick(ctx, C(PIP, { x: 470, y: 1700, s: 560, arms, bob: Math.sin(t * 5) * .006, face: { eyes: 'happy', mouth: 'grin', browUp: 1 }, headTilt: Math.sin(t * 2) * .05 }));
});

// 10 — end poster
shot(10, 'cut', (ctx, lt, t, L) => {
  const cam = { x: 540 + handheld(t, 1.5)[0], y: 960, z: 1 + lt * .018, r: 0 };
  drawWorld(ctx, t, cam, MOODS.gold, { sun: [200, 330, 90, 1], lit: 0 });
  applyCam(ctx, cam, 1);
  drawTree(ctx, 540, 1770, 850, 1, t, 9.5, 1);
  const row = [[F1, 250, 330], [F2, 400, 340], [PIP, 540, 380], [F3, 700, 340], [C(F2, { hat: 'cap', hatCol: '#3fc24f' }), 850, 320]];
  row.forEach(([base, x, s], i) => { const hop = Math.max(0, Math.sin(t * 3 + i * 1.3)) * .03; drawStick(ctx, C(base, { x, y: 1780, s, bob: -hop, arms: { L: [2.4 + Math.sin(t * 4 + i) * .2, .3], R: [.3, -.1] }, face: { eyes: 'happy', mouth: 'smile', blush: true } })); });
  for (let i = 0; i < 9; i++) { const a = t * .7 + i * .8; sparkle(ctx, 540 + Math.cos(a + i) * 450, 820 + Math.sin(a * 1.2 + i) * 520, 26 + i % 3 * 9, .5 + .5 * Math.sin(t * 4 + i)); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const k = backOut(inv(.1, .6, lt)), k2 = backOut(inv(.4, .9, lt));
  ctx.save(); ctx.translate(540, 300); ctx.scale(k, k); text(ctx, 'Good things', 0, 0, 116, '#fff', INK, 26, 'Poppins', 700); ctx.restore();
  ctx.save(); ctx.translate(540, 430); ctx.scale(k2, k2); text(ctx, 'take time', 0, 0, 116, '#ffe14d', INK, 26, 'Poppins', 700); ctx.restore();
});
