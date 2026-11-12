// ---------- HUMAN CARTOON KIT: code-drawn 2D people (kids, adults, elders). Same pose API as drawStick/drawToon. ----------
// drawHuman(ctx, {human:'chintu', x,y,s,flip,lean,bob,arms,legs,face,talk,prop,hat,hatCol,t}); walking: walker(x0,x,s,humanGait('chintu'))
// Add a person = a data entry in HUMANS. Fields: skin, hair {style,col}, shirt, pants, shoes, kid(0|1), skirt, glasses, mustache, beard, sleeve('short'|'long'), cheek.
const HUMANS = {
  chintu: { skin: '#f2c48d', hair: { style: 'short', col: '#2a1e1a' }, shirt: '#ffd23a', pants: '#3a6fd1', shoes: '#e0392f', kid: 1, sleeve: 'short', cheek: '#ff9a8a' },
  mira: { skin: '#f0bb8a', hair: { style: 'ponytail', col: '#3a2418' }, shirt: '#ff6b6b', pants: '#ff6b6b', skirt: 1, shoes: '#fff', kid: 1, sleeve: 'short', cheek: '#ff9a8a' },
  teacher: { skin: '#e8b98a', hair: { style: 'short', col: '#2a2a2e' }, shirt: '#7a4bc4', pants: '#4a4f5c', shoes: '#2a2a2e', kid: 0, sleeve: 'long', mustache: 1, glasses: 1, cheek: null },
  woman: { skin: '#e8b08a', hair: { style: 'bob', col: '#5a2e1a' }, shirt: '#2fa3a3', pants: '#4a4f5c', shoes: '#2a2a2e', kid: 0, sleeve: 'long', cheek: '#ff9a8a' },
  grandpa: { skin: '#e8b98a', hair: { style: 'bald', col: '#e8e8ea' }, shirt: '#8a6a3a', pants: '#5a4a3a', shoes: '#3a2a1a', kid: 0, sleeve: 'long', mustache: 1, glasses: 1, cheek: null, beard: 0 },
  grandma: { skin: '#eab592', hair: { style: 'bun', col: '#e8e8ea' }, shirt: '#b78bff', pants: '#b78bff', skirt: 1, shoes: '#3a2a1a', kid: 0, sleeve: 'long', glasses: 1, cheek: '#ff9a8a' },
  boy2: { skin: '#a8714a', hair: { style: 'spiky', col: '#1a1210' }, shirt: '#3fc24f', pants: '#2a2f45', shoes: '#fff', kid: 1, sleeve: 'short', cheek: '#e8805a' },
  catboy: { skin: '#f4a640', animal: 'cat', hair: { style: 'none', col: '#d9822a' }, shirt: '#4aa8ff', pants: '#3a4a6a', shoes: '#fff', kid: 1, sleeve: 'short', cheek: '#ff9a8a' },
  pandadad: { skin: '#fbfbfb', animal: 'panda', hair: { style: 'none', col: '#2a2a33' }, shirt: '#e0392f', pants: '#2a2a33', shoes: '#2a2a33', kid: 0, sleeve: 'long', cheek: '#ffb0b8' },
  bunnygirl: { skin: '#fffafc', animal: 'bunny', hair: { style: 'none', col: '#ffb0c8' }, shirt: '#b78bff', pants: '#ff8fb0', skirt: 1, shoes: '#fff', kid: 1, sleeve: 'short', cheek: '#ffb0c8' },
  bearman: { skin: '#b9803f', animal: 'bear', hair: { style: 'none', col: '#7a4a1f' }, shirt: '#3fa35b', pants: '#4a4f5c', shoes: '#3a2a22', kid: 0, sleeve: 'long', cheek: '#ff9a8a' },
  girl2: { skin: '#8a5a3a', hair: { style: 'bun', col: '#1a1210' }, shirt: '#4aa8ff', pants: '#ffd23a', skirt: 1, shoes: '#e0392f', kid: 1, sleeve: 'short', cheek: '#e8805a' },
};
const humanGait = (name, extra) => { const h = HUMANS[name] || HUMANS.chintu; return Object.assign(h.kid ? { legL: .115, hipX: .06, stride: .075, lift: .06 } : { legL: .185, hipX: .06, stride: .1, lift: .075 }, extra || {}); };
function drawHuman(ctx, o) {
  if (o.view === '3q') o = Object.assign({}, o, { face: Object.assign({ turn: 1.6 }, o.face || {}) });
  if (window.__BOXES) __BOXES.push({ x: o.x, y: o.y, s: o.s || 400, id: o.id || '', cropOK: !!(o.closeup || o.cropOK) });
  const sp = (o.human && o.human.skin) ? o.human : (HUMANS[o.human || 'chintu']), s = o.s || 400, flip = o.flip || 1, kid = sp.kid;
  const LL = kid ? .115 : .185, T = kid ? .27 : .32, hipY = -2 * LL, shY = hipY - T, hr = kid ? .2 : .155, hx = 0, hy = shY - hr - (kid ? .035 : .045), tw = (kid ? .26 : .27) * (o.view === '3q' ? .8 : 1), sh = kid ? .15 : .16, HX = .06;
  const L = '#3a2a22', tt = o.t || 0, f = o.face || {}, turn = f.turn || 0, lw = .015;
  ctx.save(); ctx.translate(o.x, o.y); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.shadow !== false) { ctx.save(); ctx.scale(s, s); ellipse(ctx, 0, 0, .22, .03); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill(); ctx.restore(); }
  ctx.scale(s * flip, s * (o.squash || 1)); ctx.rotate(o.lean || 0); ctx.translate(0, o.bob || 0);
  const legs = o.legs || { L: [.08, -.03], R: [.08, -.03] }, arms = o.arms || { L: [.3, -.1], R: [.3, -.1] };
  const hair = sp.hair || {};
  // hair behind head (ponytail / bun / bob back)
  const headC = () => { ctx.beginPath(); ctx.ellipse(hx, hy, hr, hr * 1.02, 0, 0, TAU); };
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(o.headTilt || 0); ctx.translate(-hx, -hy);
  if (hair.style === 'ponytail') { ctx.beginPath(); ctx.moveTo(-hr * .8, hy - hr * .3); ctx.quadraticCurveTo(-hr * 1.9, hy + hr * .3 + Math.sin(tt * 3) * .02, -hr * 1.2, hy + hr * 1.5); ctx.quadraticCurveTo(-hr * 1.0, hy + hr * .5, -hr * .6, hy + hr * .1); ctx.closePath(); fillStroke(ctx, hair.col, lw, L); }
  if (hair.style === 'bob') { ctx.beginPath(); ctx.roundRect(-hr * 1.1, hy - hr * .6, hr * 2.2, hr * 1.9, hr * .6); fillStroke(ctx, hair.col, lw, L); }
  ctx.restore();
  // legs (pants or skin under skirt)
  for (const [k, side] of [['L', -1], ['R', 1]]) { const [a1, a2] = legs[k]; const p = limbPts(side * HX, hipY, side, a1, a2, LL, LL); const col = sp.skirt ? sp.skin : sp.pants; toonLimb(ctx, p, kid ? .07 : .075, col, L); ellipse(ctx, p[2][0] + side * .025, p[2][1] + .008, .06, .033); fillStroke(ctx, sp.shoes, lw, L); }
  // torso (shirt) + skirt
  const tors = () => { ctx.beginPath(); ctx.roundRect(-tw / 2, shY - .02, tw, T + .06, tw * .35); };
  tors(); fillStroke(ctx, sp.shirt, lw * 1.2, L); ctx.save(); tors(); ctx.clip(); ctx.fillStyle = 'rgba(30,10,60,.14)'; ctx.fillRect(tw * .12, shY - .1, tw, T + .2); ctx.restore();
  if (sp.skirt) { ctx.beginPath(); ctx.moveTo(-tw * .5, hipY - .07); ctx.lineTo(tw * .5, hipY - .07); ctx.lineTo(tw * .85, hipY + LL * .9); ctx.lineTo(-tw * .85, hipY + LL * .9); ctx.closePath(); fillStroke(ctx, sp.pants, lw * 1.2, L); ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(30,10,60,.14)'; ctx.fillRect(tw * .1, hipY - .1, tw, LL * 2); ctx.restore(); }
  else { ctx.beginPath(); ctx.moveTo(-tw * .5, hipY - .05); ctx.lineTo(tw * .5, hipY - .05); ctx.lineTo(tw * .5, hipY + .02); ctx.lineTo(-tw * .5, hipY + .02); ctx.closePath(); ctx.fillStyle = sp.pants; ctx.fill(); }
  // neck
  rrP(ctx, -.035, shY - .06, .07, .09, .02); fillStroke(ctx, sp.skin, lw, L);
  // arms
  for (const [k, side] of [['L', -1], ['R', 1]]) {
    const al = o.armLen || 1; let a1, a2; const l1 = (kid ? .105 : .14) * al, l2 = (kid ? .1 : .13) * al;
    if (arms[k].ik) [a1, a2] = ik(side, side * sh, shY + .03, arms[k].ik[0], arms[k].ik[1], l1, l2, arms[k].bend || 1); else [a1, a2] = arms[k];
    const p = limbPts(side * sh, shY + .03, side, a1, a2, l1, l2);
    if (o.propBehind) o.propBehind(ctx, k, p[2], p[3], side);
    toonLimb(ctx, [p[0], p[1], p[1]], .07, sp.shirt, L); toonLimb(ctx, [p[1], p[1], p[2]], .055, sp.sleeve === 'long' ? sp.shirt : sp.skin, L); circle(ctx, p[2][0], p[2][1], .042); fillStroke(ctx, sp.skin, lw, L);
    if (o.prop) o.prop(ctx, k, p[2], p[3], side);
  }
  // head
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(o.headTilt || 0); ctx.translate(-hx, -hy);
  for (const side of [-1, 1]) { circle(ctx, side * hr * .98, hy + hr * .08, hr * .2); fillStroke(ctx, sp.skin, lw, L); }
  if (sp.animal) { const an = TOON_SPECIES[sp.animal]; for (const side of [-1, 1]) { ctx.save(); ctx.translate(side * hr * .7, hy - hr * .85);
    if (an.earType === 'round') { circle(ctx, 0, -hr * .1, hr * .42); fillStroke(ctx, an.ear, lw, L); }
    else if (an.earType === 'point') { ctx.beginPath(); ctx.moveTo(-hr * .4, hr * .1); ctx.lineTo(side * hr * .05, -hr * .75); ctx.lineTo(hr * .4, hr * .1); ctx.closePath(); fillStroke(ctx, an.ear, lw, L); ctx.beginPath(); ctx.moveTo(-hr * .2, hr * .05); ctx.lineTo(side * hr * .03, -hr * .45); ctx.lineTo(hr * .2, hr * .05); ctx.closePath(); ctx.fillStyle = an.cheek; ctx.fill(); }
    else if (an.earType === 'long') { ctx.rotate(side * .15); ellipse(ctx, 0, -hr * .7, hr * .3, hr * .95); fillStroke(ctx, an.ear, lw, L); ellipse(ctx, 0, -hr * .7, hr * .15, hr * .7); ctx.fillStyle = an.cheek; ctx.fill(); }
    ctx.restore(); } }
  headC(); fillStroke(ctx, sp.skin, lw * 1.2, L);
  if (sp.animal && TOON_SPECIES[sp.animal].patch) for (const side of [-1, 1]) { ctx.save(); ctx.translate(side * hr * .42, hy + hr * .05); ctx.rotate(side * -.35); ellipse(ctx, 0, 0, hr * .27, hr * .36); ctx.fillStyle = TOON_SPECIES[sp.animal].patch; ctx.fill(); ctx.restore(); } ctx.save(); headC(); ctx.clip(); ctx.fillStyle = 'rgba(80,30,20,.1)'; ctx.fillRect(hr * .3, hy - hr, hr, hr * 2); ctx.restore();
  // hair front
  const hc = hair.col, st = hair.style;
  if (st === 'short' || st === 'ponytail' || st === 'bob' || st === 'bun' || st === 'spiky') {
    ctx.beginPath(); ctx.moveTo(-hr * 1.03, hy - hr * .05); ctx.bezierCurveTo(-hr * 1.1, hy - hr * 1.25, hr * 1.1, hy - hr * 1.25, hr * 1.03, hy - hr * .05);
    if (st === 'bob') ctx.quadraticCurveTo(hr * .6, hy - hr * .45, 0, hy - hr * .55), ctx.quadraticCurveTo(-hr * .6, hy - hr * .45, -hr * 1.03, hy - hr * .05); else ctx.quadraticCurveTo(hr * .5, hy - hr * .5 + (st === 'spiky' ? 0 : .02), -hr * .1, hy - hr * .62), ctx.quadraticCurveTo(-hr * .75, hy - hr * .4, -hr * 1.03, hy - hr * .05);
    ctx.closePath(); fillStroke(ctx, hc, lw, L);
    if (st === 'spiky') for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * hr * .35 - hr * .17, hy - hr * .95); ctx.lineTo(i * hr * .35, hy - hr * 1.5); ctx.lineTo(i * hr * .35 + hr * .17, hy - hr * .95); ctx.closePath(); fillStroke(ctx, hc, lw, L); }
    if (st === 'bun') { circle(ctx, 0, hy - hr * 1.25, hr * .38); fillStroke(ctx, hc, lw, L); }
  } else if (st === 'bald') { for (const side of [-1, 1]) { ctx.beginPath(); ctx.ellipse(side * hr * .92, hy - hr * .1, hr * .16, hr * .3, side * .2, 0, TAU); fillStroke(ctx, hc, lw, L); } }
  // face
  const ex = hr * .42, ey = hy + hr * .05, look = f.look || [0, 0], bl = f.blink || 0, kind = f.eyes || 'normal';
  if (sp.cheek) for (const side of [-1, 1]) { ellipse(ctx, side * hr * .55 + turn * .04, hy + hr * .42, hr * .2, hr * .11); ctx.fillStyle = sp.cheek; ctx.globalAlpha *= .75; ctx.fill(); ctx.globalAlpha /= .75; }
  for (const side of [-1, 1]) {
    const x = side * ex + turn * .05, k = (side < 0 && f.eyesL) ? f.eyesL : (side > 0 && f.eyesR) ? f.eyesR : kind;
    if (k === 'happy') { ctx.beginPath(); ctx.arc(x, ey + .012, hr * .2, Math.PI * 1.08, Math.PI * 1.92); ctx.lineWidth = .018; ctx.strokeStyle = L; ctx.lineCap = 'round'; ctx.stroke(); }
    else if (k === 'squint') line(ctx, x - hr * .2, ey, x + hr * .2, ey, .018, L);
    else if (k === 'x') { line(ctx, x - hr * .17, ey - hr * .17, x + hr * .17, ey + hr * .17, .018, L); line(ctx, x + hr * .17, ey - hr * .17, x - hr * .17, ey + hr * .17, .018, L); }
    else { const rr = (k === 'wide' ? .26 : .2) * hr; ellipse(ctx, x, ey, rr, rr * 1.15 * (1 - bl * .9)); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = .012; ctx.strokeStyle = L; ctx.stroke(); circle(ctx, x + look[0] * rr * .4, ey + look[1] * rr * .4, rr * .55); ctx.fillStyle = L; ctx.fill(); circle(ctx, x + look[0] * rr * .4 - rr * .18, ey + look[1] * rr * .4 - rr * .2, rr * .17); ctx.fillStyle = '#fff'; ctx.fill(); }
    if (f.browAng != null || f.browUp != null || sp.glasses) { ctx.save(); ctx.translate(x, ey - hr * .38 - (f.browUp || 0) * .03); ctx.rotate(side * -(f.browAng || 0)); line(ctx, -hr * .2, 0, hr * .2, 0, .02, hair.col === '#e8e8ea' ? '#9a9aa0' : (hair.col || L)); ctx.restore(); }
  }
  ctx.beginPath(); ctx.moveTo(turn * .05, hy + hr * .15); ctx.quadraticCurveTo(hr * .12 + turn * .05, hy + hr * .32, turn * .05 - hr * .02, hy + hr * .34); ctx.lineWidth = .014; ctx.strokeStyle = 'rgba(90,40,20,.7)'; ctx.stroke();
  const mx = turn * .05, my = hy + hr * .62, m = f.mouth || 'smile', talk = o.talk || 0;
  if (sp.mustache) { ctx.beginPath(); ctx.moveTo(mx - hr * .3, my - hr * .12); ctx.quadraticCurveTo(mx, my - hr * .32, mx + hr * .3, my - hr * .12); ctx.quadraticCurveTo(mx, my - hr * .02, mx - hr * .3, my - hr * .12); fillStroke(ctx, hair.col === '#e8e8ea' ? '#cfcfd4' : (hair.col || '#333'), lw * .8, L); }
  if (talk > .02) { ellipse(ctx, mx, my + hr * .08 + talk * .012, hr * .22, hr * .06 + talk * .05); fillStroke(ctx, '#7a2630', .012, L); }
  else if (m === 'smile') { ctx.beginPath(); ctx.arc(mx, my - hr * .1, hr * .24, .35, Math.PI - .35); ctx.lineWidth = .016; ctx.strokeStyle = L; ctx.lineCap = 'round'; ctx.stroke(); }
  else if (m === 'grin') { ctx.beginPath(); ctx.moveTo(mx - hr * .3, my - hr * .05); ctx.quadraticCurveTo(mx, my + hr * .5, mx + hr * .3, my - hr * .05); ctx.closePath(); fillStroke(ctx, '#7a2630', .012, L); ctx.save(); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(mx - hr * .3, my - hr * .06, hr * .6, hr * .12); ctx.restore(); }
  else if (m === 'o') { ellipse(ctx, mx, my + hr * .08, hr * .11, hr * .15); fillStroke(ctx, '#7a2630', .01, L); }
  else if (m === 'frown') { ctx.beginPath(); ctx.arc(mx, my + hr * .22, hr * .22, Math.PI + .5, -.5); ctx.lineWidth = .016; ctx.strokeStyle = L; ctx.stroke(); }
  else if (m === 'flat') line(ctx, mx - hr * .2, my + hr * .05, mx + hr * .2, my + hr * .05, .016, L);
  else if (m === 'smirk') { ctx.beginPath(); ctx.moveTo(mx - hr * .22, my + hr * .04); ctx.quadraticCurveTo(mx + hr * .05, my + hr * .14, mx + hr * .26, my - hr * .1); ctx.lineWidth = .016; ctx.strokeStyle = L; ctx.stroke(); }
  if (sp.animal) { const an = TOON_SPECIES[sp.animal]; ellipse(ctx, mx, hy + hr * .36, hr * .42, hr * .3); fillStroke(ctx, an.muzzle, lw * .8, L); ellipse(ctx, mx, hy + hr * .22, hr * .13, hr * .09); ctx.fillStyle = an.nose; ctx.fill(); if (an.tail || sp.animal === 'cat') for (const side of [-1, 1]) for (const dy of [-.04, .06]) line(ctx, side * hr * .38, hy + hr * (.3 + dy * 2), side * hr * .9, hy + hr * (.25 + dy * 4), .008, L); }
  if (sp.beard) { ctx.beginPath(); ctx.moveTo(-hr * .7, hy + hr * .3); ctx.quadraticCurveTo(0, hy + hr * 1.5, hr * .7, hy + hr * .3); ctx.quadraticCurveTo(0, hy + hr * .75, -hr * .7, hy + hr * .3); fillStroke(ctx, hair.col, lw, L); }
  if (sp.glasses) for (const side of [-1, 1]) { circle(ctx, side * ex + turn * .05, ey, hr * .34); ctx.lineWidth = .014; ctx.strokeStyle = '#2a2a33'; ctx.stroke(); } if (sp.glasses) line(ctx, -ex + hr * .3, ey, ex - hr * .3, ey, .012, '#2a2a33');
  // hats (scaled to head)
  const hs = hr / .19;
  if (o.hat === 'beanie') { ctx.save(); ctx.translate(hx, hy); ctx.scale(hs, hs); ctx.translate(-hx, -hy); drawBeanie(ctx, hx, hy, .19, o.hatCol || '#7a4bc4', .013); ctx.restore(); }
  else if (o.hat === 'cap') { ctx.save(); ctx.translate(hx, hy); ctx.scale(hs, hs); ctx.translate(-hx, -hy); drawCap(ctx, hx, hy, .19, o.hatCol || '#e0392f', .013); ctx.restore(); }
  ctx.restore(); ctx.restore();
}

// ======== SIDE VIEW (profile) for humans: natural walk/run, talking in profile. Forward = +x in local coords, flip handles left/right ========
function gaitSide(dist, s, o = {}) {   // returns {legs:{L,R}, arms:{L,R}, bob, lean} for a profile body (both hips at x=0, 'side'=+1)
  const kid = o.kid, LL = o.legL || (kid ? .115 : .185), S = o.stride || (kid ? .08 : .1), lift = o.lift || (kid ? .06 : .08), R = 2 * LL * .996, hipY = -2 * LL;
  const ph = (Math.abs(dist) / (4 * S * s)) % 1;
  const foot = p => p < .5 ? [lerp(S, -S, p / .5), 0] : [lerp(-S, S, ease((p - .5) / .5)), Math.sin((p - .5) / .5 * Math.PI) * lift];
  const fA = foot(ph), fB = foot((ph + .5) % 1);
  let need = 0; for (const f of [fA, fB]) { if (f[1] > .001) continue; need = Math.max(need, 2 * LL - Math.sqrt(Math.max(0, R * R - f[0] * f[0]))); }
  const bob = need;
  const leg = f => { let best = null; for (const bend of [1, -1]) { const [a1, a2] = ik(1, 0, hipY, f[0], -bob - f[1], LL, LL, bend); const p = limbPts(0, hipY, 1, a1, a2, LL, LL); if (!best || p[1][0] > best.k) best = { k: p[1][0], a: [a1, a2] }; } return best.a; };
  const A = o.armSwing == null ? .55 : o.armSwing, sw = Math.sin(ph * TAU);
  const arm = k => [A * k, -(.2 + .5 * Math.max(0, k))];
  return { legsS: { near: leg(fA), far: leg(fB) }, armsS: { near: arm(-sw), far: arm(sw) }, bob, lean: o.lean == null ? .06 : o.lean, phase: ph };
}
function drawHumanSide(ctx, o) {
  if (window.__BOXES) __BOXES.push({ x: o.x, y: o.y, s: o.s || 400, id: o.id || '', cropOK: !!(o.closeup || o.cropOK) });
  const sp = (o.human && o.human.skin) ? o.human : (HUMANS[o.human || 'chintu']), s = o.s || 400, flip = o.flip || 1, kid = sp.kid;
  const LL = kid ? .115 : .185, T = kid ? .27 : .32, hr = kid ? .2 : .155, hipY = -2 * LL, shY = hipY - T, hx = .02, hy = shY - hr - (kid ? .035 : .045), tw = (kid ? .26 : .27) * .62, L = '#3a2a22', lw = .015, f = o.face || {}, tt = o.t || 0, talk = o.talk || 0, hair = sp.hair || {};
  const g = o.__gd != null ? gaitSide(o.__gd, s, Object.assign({ kid }, o.__go || {})) : null;
  const legs = g ? g.legsS : (o.legsS || { near: [.05, -.02], far: [-.05, -.02] }), arms = g ? g.armsS : (o.armsS || { near: [.15, -.25], far: [-.1, -.25] });
  const bob = o.bob != null ? o.bob : (g ? g.bob : 0), lean = o.lean != null ? o.lean : (g ? g.lean : 0);
  ctx.save(); ctx.translate(o.x, o.y); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.shadow !== false) { ctx.save(); ctx.scale(s, s); ellipse(ctx, 0, 0, .2, .028); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill(); ctx.restore(); }
  ctx.scale(s * flip, s * (o.squash || 1)); ctx.rotate(lean); ctx.translate(0, bob);
  const darker = c => hmix(c, '#000000', .22);
  const leg = (a, far) => { const p = limbPts(0, hipY, 1, a[0], a[1], LL, LL), col = sp.skirt ? sp.skin : sp.pants; toonLimb(ctx, p, kid ? .07 : .075, far ? darker(col) : col, L); ellipse(ctx, p[2][0] + .035, p[2][1] + .008, .075, .034); fillStroke(ctx, far ? darker(sp.shoes) : sp.shoes, lw, L); };
  const arm = (a, far) => { const l1 = kid ? .105 : .14, l2 = kid ? .1 : .13, p = limbPts(0, shY + .03, 1, a[0], a[1], l1, l2); if (o.propBehind && far) o.propBehind(ctx, 'L', p[2], p[3], 1); toonLimb(ctx, [p[0], p[1], p[1]], .07, far ? darker(sp.shirt) : sp.shirt, L); toonLimb(ctx, [p[1], p[1], p[2]], .055, sp.sleeve === 'long' ? (far ? darker(sp.shirt) : sp.shirt) : (far ? darker(sp.skin) : sp.skin), L); circle(ctx, p[2][0], p[2][1], .042); fillStroke(ctx, far ? darker(sp.skin) : sp.skin, lw, L); if (o.prop && !far) o.prop(ctx, 'R', p[2], p[3], 1); };
  // hair behind
  if (hair.style === 'ponytail') { ctx.beginPath(); ctx.moveTo(hx - hr * .7, hy - hr * .3); ctx.quadraticCurveTo(hx - hr * 1.8, hy + hr * .1 + Math.sin(tt * 3 + (g ? g.phase * 6 : 0)) * .03, hx - hr * 1.2, hy + hr * 1.5); ctx.quadraticCurveTo(hx - hr * .9, hy + hr * .6, hx - hr * .5, hy + hr * .1); ctx.closePath(); fillStroke(ctx, hair.col, lw, L); }
  arm(arms.far, true); leg(legs.far, true);
  const tors = () => { ctx.beginPath(); ctx.roundRect(-tw / 2, shY - .02, tw, T + .06, tw * .4); };
  tors(); fillStroke(ctx, sp.shirt, lw * 1.2, L); ctx.save(); tors(); ctx.clip(); ctx.fillStyle = 'rgba(30,10,60,.12)'; ctx.fillRect(0, shY - .1, tw, T + .2); ctx.restore();
  if (sp.skirt) { ctx.beginPath(); ctx.moveTo(-tw * .5, hipY - .07); ctx.lineTo(tw * .5, hipY - .07); ctx.lineTo(tw * 1.1, hipY + LL * .9); ctx.lineTo(-tw * 1.1, hipY + LL * .9); ctx.closePath(); fillStroke(ctx, sp.pants, lw * 1.2, L); } else { ctx.fillStyle = sp.pants; ctx.fillRect(-tw / 2, hipY - .05, tw, .08); }
  leg(legs.near, false);
  rrP(ctx, hx - .03, shY - .06, .06, .09, .02); fillStroke(ctx, sp.skin, lw, L);
  arm(arms.near, false);
  // head in profile (faces +x)
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(o.headTilt || 0); ctx.translate(-hx, -hy);
  const head = () => { ctx.beginPath(); ctx.ellipse(hx, hy, hr, hr * 1.02, 0, 0, TAU); };
  head(); fillStroke(ctx, sp.skin, lw * 1.2, L);
  circle(ctx, hx - hr * .12, hy + hr * .12, hr * .2); fillStroke(ctx, sp.skin, lw, L); circle(ctx, hx - hr * .12, hy + hr * .12, hr * .08); ctx.fillStyle = 'rgba(120,60,40,.4)'; ctx.fill();   // ear
  ctx.beginPath(); ctx.moveTo(hx + hr * .98, hy + hr * .08); ctx.quadraticCurveTo(hx + hr * 1.3, hy + hr * .3, hx + hr * .92, hy + hr * .4); ctx.lineWidth = lw; ctx.strokeStyle = L; ctx.fillStyle = sp.skin; ctx.fill(); ctx.stroke();   // nose
  const st = hair.style, hc = hair.col;
  if (st && st !== 'none' && st !== 'bald') { ctx.beginPath(); ctx.moveTo(hx + hr * .95, hy - hr * .25); ctx.bezierCurveTo(hx + hr * .9, hy - hr * 1.3, hx - hr * 1.2, hy - hr * 1.25, hx - hr * 1.0, hy + hr * (st === 'bob' ? .9 : .2)); ctx.quadraticCurveTo(hx - hr * .5, hy - hr * .1, hx + hr * .1, hy - hr * .55); ctx.quadraticCurveTo(hx + hr * .6, hy - hr * .5, hx + hr * .95, hy - hr * .25); ctx.closePath(); fillStroke(ctx, hc, lw, L);
    if (st === 'spiky') for (let i = -2; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(hx + i * hr * .35 - hr * .17, hy - hr * .95); ctx.lineTo(hx + i * hr * .35, hy - hr * 1.5); ctx.lineTo(hx + i * hr * .35 + hr * .17, hy - hr * .95); ctx.closePath(); fillStroke(ctx, hc, lw, L); }
    if (st === 'bun') { circle(ctx, hx - hr * .3, hy - hr * 1.25, hr * .38); fillStroke(ctx, hc, lw, L); } }
  const ex = hx + hr * .45, ey = hy + hr * .02, bl = f.blink || 0, k = f.eyes || 'normal', look = f.look || [1, 0];
  if (k === 'happy') { ctx.beginPath(); ctx.arc(ex, ey + .012, hr * .2, Math.PI * 1.08, Math.PI * 1.92); ctx.lineWidth = .018; ctx.strokeStyle = L; ctx.lineCap = 'round'; ctx.stroke(); }
  else if (k === 'squint') line(ctx, ex - hr * .2, ey, ex + hr * .2, ey, .018, L);
  else if (k === 'x') { line(ctx, ex - hr * .17, ey - hr * .17, ex + hr * .17, ey + hr * .17, .018, L); line(ctx, ex + hr * .17, ey - hr * .17, ex - hr * .17, ey + hr * .17, .018, L); }
  else { const rr = (k === 'wide' ? .26 : .2) * hr; ellipse(ctx, ex, ey, rr * .85, rr * 1.15 * (1 - bl * .9)); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = .012; ctx.strokeStyle = L; ctx.stroke(); circle(ctx, ex + rr * .3 + look[0] * rr * .1, ey + look[1] * rr * .3, rr * .5); ctx.fillStyle = L; ctx.fill(); }
  ctx.save(); ctx.translate(ex, ey - hr * .38 - (f.browUp || 0) * .03); ctx.rotate(-(f.browAng || 0)); line(ctx, -hr * .2, 0, hr * .2, 0, .02, hc === '#e8e8ea' ? '#9a9aa0' : (hc || L)); ctx.restore();
  if (sp.cheek) { ellipse(ctx, hx + hr * .3, hy + hr * .45, hr * .2, hr * .11); ctx.fillStyle = sp.cheek; ctx.globalAlpha *= .75; ctx.fill(); ctx.globalAlpha /= .75; }
  const mx = hx + hr * .62, my = hy + hr * .62, m = f.mouth || 'smile';
  if (sp.mustache) { ctx.beginPath(); ctx.ellipse(hx + hr * .82, hy + hr * .5, hr * .22, hr * .08, -.3, 0, TAU); fillStroke(ctx, hair.col === '#e8e8ea' ? '#cfcfd4' : (hair.col || '#333'), lw * .8, L); }
  if (talk > .02) { ellipse(ctx, mx, my + hr * .06 + talk * .012, hr * .17, hr * .05 + talk * .045); fillStroke(ctx, '#7a2630', .012, L); }
  else if (m === 'smile') { ctx.beginPath(); ctx.arc(mx, my - hr * .08, hr * .2, .3, Math.PI * .8); ctx.lineWidth = .016; ctx.strokeStyle = L; ctx.lineCap = 'round'; ctx.stroke(); }
  else if (m === 'grin') { ctx.beginPath(); ctx.moveTo(mx - hr * .2, my - hr * .02); ctx.quadraticCurveTo(mx + hr * .05, my + hr * .45, mx + hr * .3, my - hr * .05); ctx.closePath(); fillStroke(ctx, '#7a2630', .012, L); }
  else if (m === 'o') { ellipse(ctx, mx + hr * .05, my + hr * .06, hr * .1, hr * .14); fillStroke(ctx, '#7a2630', .01, L); }
  else if (m === 'frown') { ctx.beginPath(); ctx.arc(mx, my + hr * .2, hr * .2, Math.PI + .5, -.5); ctx.lineWidth = .016; ctx.strokeStyle = L; ctx.stroke(); }
  else line(ctx, mx - hr * .15, my + hr * .05, mx + hr * .25, my + hr * .05, .016, L);
  if (sp.glasses) { circle(ctx, ex + hr * .02, ey, hr * .34); ctx.lineWidth = .014; ctx.strokeStyle = '#2a2a33'; ctx.stroke(); line(ctx, ex - hr * .32, ey, hx - hr * .12, hy + hr * .05, .012, '#2a2a33'); }
  const hs = hr / .19;
  if (o.hat === 'beanie') { ctx.save(); ctx.translate(hx, hy); ctx.scale(hs, hs); ctx.translate(-hx, -hy); drawBeanie(ctx, hx, hy, .19, o.hatCol || '#7a4bc4', .013); ctx.restore(); }
  else if (o.hat === 'cap') { ctx.save(); ctx.translate(hx, hy); ctx.scale(hs, hs); ctx.translate(-hx, -hy); drawCap(ctx, hx, hy, .19, o.hatCol || '#e0392f', .013); ctx.restore(); }
  ctx.restore(); ctx.restore();
}
