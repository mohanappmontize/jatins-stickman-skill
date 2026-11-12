// ---------- TOON CHARACTER KIT: code-drawn 2D mascots (panda, bear, cat, bunny, robot...) ----------
// drawToon(ctx, o) uses the SAME pose API as drawStick: {x,y,s,flip,lean,bob,arms,legs,face,prop,hat}. Merge gaitPose with TOON_GAIT.
// Species are data: add a new one in TOON_SPECIES. Face: {eyes,look,blink,mouth,brow,browAng}, plus o.talk (0..1) = mouth opening while speaking.
const TOON_SPECIES = {
  panda: { fur: '#fbfbfb', limb: '#2a2a33', ear: '#2a2a33', earType: 'round', patch: '#2a2a33', nose: '#2a2a33', belly: '#fbfbfb', cheek: '#ffb0b8', muzzle: '#fbfbfb', line: '#2a2a33' },
  bear: { fur: '#b9803f', limb: '#a06a2e', ear: '#a06a2e', earType: 'round', patch: null, nose: '#3a2418', belly: '#e8c795', cheek: '#ff9a8a', muzzle: '#e8c795', line: '#3a2418' },
  cat: { fur: '#f4a640', limb: '#f4a640', ear: '#f4a640', earType: 'point', patch: null, nose: '#e0607a', belly: '#fff3dc', cheek: '#ff9a8a', muzzle: '#fff3dc', line: '#4a2a14', stripes: '#d9822a', tail: true },
  bunny: { fur: '#fffafc', limb: '#fffafc', ear: '#fffafc', earType: 'long', patch: null, nose: '#ff8fb0', belly: '#ffe3ee', cheek: '#ffb0c8', muzzle: '#ffe3ee', line: '#6a4a5a', tail: true },
  robot: { fur: '#9fb4c8', limb: '#6f8499', ear: '#6f8499', earType: 'antenna', patch: null, nose: '#ffd23a', belly: '#d0dce8', cheek: null, muzzle: '#d0dce8', line: '#1f2a36', square: true },
};
const TOON_GAIT = { legL: .085, hipX: .09, stride: .075, lift: .055 };
function toonLimb(ctx, pts, w, col, line) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[1][0], pts[1][1]); ctx.lineTo(pts[2][0], pts[2][1]); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = w + .02; ctx.strokeStyle = line; ctx.stroke(); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke(); }
function drawToon(ctx, o) {
  if (o.view === 'side' || (o.__gd != null && o.view !== 'front' && o.view !== 'upright')) return drawAnimalSide(ctx, o);
  if (window.__BOXES) __BOXES.push({ x: o.x, y: o.y, s: o.s || 400, id: o.id || '', cropOK: !!(o.closeup || o.cropOK) });
  const sp = o.species && o.species.fur ? o.species : (TOON_SPECIES[o.species || 'panda']), s = o.s || 400, flip = o.flip || 1, LL = .085, HX = .09, hipY = -.16, shY = -.5, shX = .17;
  const L = sp.line, tt = o.t || 0;
  ctx.save(); ctx.translate(o.x, o.y); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.shadow !== false) { ctx.save(); ctx.scale(s, s); ellipse(ctx, 0, 0, .24, .035); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill(); ctx.restore(); }
  ctx.scale(s * flip, s * (o.squash || 1)); ctx.rotate(o.lean || 0); ctx.translate(0, o.bob || 0);
  const lw = .016, legs = o.legs || { L: [.1, -.04], R: [.1, -.04] }, arms = o.arms || { L: [.35, -.15], R: [.35, -.15] };
  // tail
  if (sp.tail) { circle(ctx, -.2, -.22, .07); fillStroke(ctx, sp.belly, lw, L); }
  // legs
  for (const [k, side] of [['L', -1], ['R', 1]]) { const [a1, a2] = legs[k]; const p = limbPts(side * HX, hipY, side, a1, a2, LL, LL); toonLimb(ctx, p, .085, sp.limb, L); ellipse(ctx, p[2][0] + side * .02, p[2][1] + .004, .062, .036); fillStroke(ctx, sp.limb, lw, L); }
  // body
  const body = () => { ctx.beginPath(); if (sp.square) ctx.roundRect(-.2, -.66, .4, .5, .08); else ctx.ellipse(0, -.4, .23, .28, 0, 0, TAU); };
  body(); fillStroke(ctx, sp.fur, lw * 1.2, L);
  ctx.save(); body(); ctx.clip(); ctx.fillStyle = 'rgba(40,20,60,.13)'; ctx.fillRect(.06, -.8, .3, .8);
  if (!sp.square) { ellipse(ctx, 0, -.33, .15, .18); ctx.fillStyle = sp.belly; ctx.fill(); }
  if (sp.stripes) { ctx.fillStyle = sp.stripes; for (let i = 0; i < 3; i++) ctx.fillRect(-.3, -.55 + i * .09, .09, .035), ctx.fillRect(.21, -.55 + i * .09, .09, .035); }
  if (sp.square) { rrP(ctx, -.1, -.5, .2, .16, .03); ctx.fillStyle = '#273544'; ctx.fill(); for (let i = 0; i < 3; i++) { circle(ctx, -.05 + i * .05, -.42, .014); ctx.fillStyle = ['#ff5a5a', '#ffd23a', '#5fd36a'][i]; ctx.fill(); } }
  ctx.restore(); body(); ctx.lineWidth = lw * 1.2; ctx.strokeStyle = L; ctx.stroke();
  // arms
  for (const [k, side] of [['L', -1], ['R', 1]]) {
    const al = o.armLen || 1; let a1, a2;
    if (arms[k].ik) [a1, a2] = ik(side, side * shX, shY, arms[k].ik[0], arms[k].ik[1], .11 * al, .105 * al, arms[k].bend || 1); else [a1, a2] = arms[k];
    const p = limbPts(side * shX, shY, side, a1, a2, .11 * al, .105 * al);
    if (o.propBehind) o.propBehind(ctx, k, p[2], p[3], side);
    toonLimb(ctx, p, .068, sp.limb, L); circle(ctx, p[2][0], p[2][1], .05); fillStroke(ctx, sp.limb, lw, L);
    if (o.prop) o.prop(ctx, k, p[2], p[3], side);
  }
  // head
  const hx = 0, hy = -.78, hr = .27, f = o.face || {}, turn = f.turn || 0;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(o.headTilt || 0); ctx.translate(-hx, -hy);
  // ears
  const ear = (side) => { ctx.save(); ctx.translate(side * .19, hy - .2);
    if (sp.earType === 'round') { circle(ctx, 0, -.03, .09); fillStroke(ctx, sp.ear, lw, L); if (sp.earIn) { circle(ctx, 0, -.03, .045); ctx.fillStyle = sp.earIn; ctx.fill(); } }
    else if (sp.earType === 'point') { ctx.beginPath(); ctx.moveTo(-.1, .03); ctx.lineTo(side * .02, -.17); ctx.lineTo(.1, .03); ctx.closePath(); fillStroke(ctx, sp.ear, lw, L); ctx.beginPath(); ctx.moveTo(-.05, .02); ctx.lineTo(side * .01, -.1); ctx.lineTo(.05, .02); ctx.closePath(); ctx.fillStyle = sp.cheek || '#fbb'; ctx.fill(); }
    else if (sp.earType === 'long') { ctx.rotate(side * .18 + Math.sin(tt * 2 + side) * .03); ellipse(ctx, 0, -.18, .07, .21); fillStroke(ctx, sp.ear, lw, L); ellipse(ctx, 0, -.18, .035, .15); ctx.fillStyle = sp.cheek; ctx.fill(); }
    else if (sp.earType === 'antenna') { line(ctx, 0, .02, side * .02, -.17, .02, L); circle(ctx, side * .02, -.19, .04); fillStroke(ctx, '#ff5a5a', lw, L); }
    ctx.restore(); };
  ear(-1); ear(1);
  const head = () => { ctx.beginPath(); if (sp.square) ctx.roundRect(-.26, hy - .24, .52, .47, .1); else ctx.ellipse(hx, hy, hr, hr * .93, 0, 0, TAU); };
  head(); fillStroke(ctx, sp.fur, lw * 1.2, L);
  ctx.save(); head(); ctx.clip(); ctx.fillStyle = 'rgba(40,20,60,.1)'; ctx.fillRect(.09, hy - .3, .3, .6); ctx.restore();
  if (sp.cheek) for (const side of [-1, 1]) { ellipse(ctx, hx + side * .17 + turn * .04, hy + .07, .05, .03); ctx.fillStyle = sp.cheek; ctx.globalAlpha *= .8; ctx.fill(); ctx.globalAlpha /= .8; }
  // face
  const ex = .105, ey = hy - .02, look = f.look || [0, 0], bl = f.blink || 0, kind = f.eyes || 'normal';
  for (const side of [-1, 1]) {
    const x = hx + side * ex + turn * .05;
    if (sp.patch) { ctx.save(); ctx.translate(x, ey + .005); ctx.rotate(side * -.35); ellipse(ctx, 0, 0, .062, .082); ctx.fillStyle = sp.patch; ctx.fill(); ctx.restore(); }
    const k = (side < 0 && f.eyesL) ? f.eyesL : (side > 0 && f.eyesR) ? f.eyesR : kind, pc = sp.patch || sp.square ? '#fff' : L, bg = sp.patch ? '#fff' : L;
    if (k === 'happy') { ctx.beginPath(); ctx.arc(x, ey + .012, .035, Math.PI * 1.08, Math.PI * 1.92); ctx.lineWidth = .02; ctx.strokeStyle = sp.patch ? '#fff' : L; ctx.lineCap = 'round'; ctx.stroke(); }
    else if (k === 'squint') { line(ctx, x - .03, ey, x + .03, ey, .02, sp.patch ? '#fff' : L); }
    else if (k === 'x') { const c = sp.patch ? '#fff' : L; line(ctx, x - .03, ey - .03, x + .03, ey + .03, .02, c); line(ctx, x + .03, ey - .03, x - .03, ey + .03, .02, c); }
    else { const rr = k === 'wide' ? .042 : .032; if (sp.patch) { ellipse(ctx, x, ey, rr, rr * (1 - bl * .9)); ctx.fillStyle = '#fff'; ctx.fill(); circle(ctx, x + look[0] * .014, ey + look[1] * .014, rr * .52); ctx.fillStyle = L; ctx.fill(); circle(ctx, x + look[0] * .014 - .008, ey - .008, rr * .17); ctx.fillStyle = '#fff'; ctx.fill(); }
      else { ellipse(ctx, x, ey, rr * 1.0, rr * 1.25 * (1 - bl * .9)); ctx.fillStyle = L; ctx.fill(); circle(ctx, x + look[0] * .01 - .008, ey - .012, rr * .32); ctx.fillStyle = '#fff'; ctx.fill(); } }
    if (f.brow !== false && (f.browAng != null || f.browUp)) { ctx.save(); ctx.translate(x, ey - .085 - (f.browUp || 0) * .03); ctx.rotate(side * (f.browAng || 0) * -1); line(ctx, -.035, 0, .035, 0, .018, sp.patch ? '#2a2a33' : L); ctx.restore(); }
  }
  // snout / mouth
  const mx = hx + turn * .05, my = hy + .09, m = f.mouth || 'smile', talk = o.talk || 0;
  ellipse(ctx, mx, my - .01, .095, .068); fillStroke(ctx, sp.muzzle, lw * .8, sp.patch ? '#d8d8d8' : L);
  ctx.beginPath(); ctx.ellipse(mx, my - .045, .03, .02, 0, 0, TAU); ctx.fillStyle = sp.nose; ctx.fill();
  const lc = L;
  if (talk > .02) { ellipse(ctx, mx, my + .02 + talk * .012, .038 + talk * .006, .012 + talk * .035); fillStroke(ctx, '#7a2630', lw * .8, lc); ellipse(ctx, mx, my + .03 + talk * .02, .02, .008 + talk * .008); ctx.fillStyle = '#e8707a'; ctx.fill(); }
  else if (m === 'smile') { ctx.beginPath(); ctx.arc(mx, my - .02, .04, .35, Math.PI - .35); ctx.lineWidth = .014; ctx.strokeStyle = lc; ctx.lineCap = 'round'; ctx.stroke(); }
  else if (m === 'grin') { ctx.beginPath(); ctx.moveTo(mx - .055, my - .02); ctx.quadraticCurveTo(mx, my + .07, mx + .055, my - .02); ctx.closePath(); fillStroke(ctx, '#7a2630', .012, lc); }
  else if (m === 'o') { ellipse(ctx, mx, my + .02, .02, .028); fillStroke(ctx, '#7a2630', .01, lc); }
  else if (m === 'frown') { ctx.beginPath(); ctx.arc(mx, my + .045, .035, Math.PI + .5, -.5); ctx.lineWidth = .014; ctx.strokeStyle = lc; ctx.stroke(); }
  else if (m === 'flat') line(ctx, mx - .03, my + .015, mx + .03, my + .015, .014, lc);
  // hat
  if (o.hat === 'beanie') { ctx.save(); ctx.translate(hx, hy); ctx.scale(.27 / .19, .27 / .19); ctx.translate(-hx, -hy); drawBeanie(ctx, hx, hy, .19, o.hatCol || '#7a4bc4', .013); ctx.restore(); }
  else if (o.hat === 'cap') { ctx.save(); ctx.translate(hx, hy); ctx.scale(.27 / .19, .27 / .19); ctx.translate(-hx, -hy); drawCap(ctx, hx, hy, .19, o.hatCol || '#e0392f', .013); ctx.restore(); }
  else if (o.hat === 'tuft') { ctx.save(); ctx.translate(hx, hy - .02); ctx.scale(1.3, 1.3); drawTuft(ctx, 0, 0, .19, o.hatCol || '#3fc24f', .013); ctx.restore(); }
  ctx.restore(); ctx.restore();
}
const TOON = (species, extra) => Object.assign({ toon: true, species }, extra || {});
// one call for any actor: stickman or toon
function drawActor(ctx, o) { return o.human ? ((o.view === 'side' || (o.__gd != null && o.view !== 'front')) ? drawHumanSide(ctx, o) : drawHuman(ctx, o)) : (o.toon || o.species) ? drawToon(ctx, o) : drawStick(ctx, o); }
// depth-sort a list of actor option objects (further back = smaller y drawn first), so nobody is drawn through a nearer actor
function drawCast(ctx, list) { list.slice().sort((a, b) => (a.y || 0) - (b.y || 0)).forEach(o => drawActor(ctx, o)); }

// ======== ANIMAL SIDE VIEW: species-correct locomotion (quadruped walk / trot, bunny hop, stiff robot). Forward = +x, flip handles direction ========
const TOON_SIDE = {   // gait: walk (lateral-sequence quadruped), trot (diagonal pairs), hop, robot
  panda: { gait: 'walk', body: [.3, .22], bodyY: .3, head: .17, legL: .105, stride: .08, duty: .65, tail: 'stub', shoulder: 1, legCol: 'limb' },
  bear: { gait: 'walk', body: [.3, .22], bodyY: .3, head: .16, legL: .105, stride: .085, duty: .65, tail: 'stub', legCol: 'fur' },
  cat: { gait: 'trot', body: [.28, .15], bodyY: .27, head: .15, legL: .095, stride: .1, duty: .5, tail: 'cat', legCol: 'fur' },
  bunny: { gait: 'hop', body: [.2, .17], bodyY: .27, head: .14, legL: .08, tail: 'ball', legCol: 'fur' },
  robot: { gait: 'robot', legCol: 'limb' },
};
function drawAnimalSide(ctx, o) {
  if (window.__BOXES) __BOXES.push({ x: o.x, y: o.y, s: o.s || 400, id: o.id || '', cropOK: !!(o.closeup || o.cropOK) });
  const sp = o.species && o.species.fur ? o.species : TOON_SPECIES[o.species || 'panda'], key = typeof o.species === 'string' ? o.species : 'panda', D = TOON_SIDE[key] || TOON_SIDE.panda;
  const s = o.s || 400, flip = o.flip || 1, L = sp.line, lw = .016, f = o.face || {}, tt = o.t || 0, talk = o.talk || 0, dist = o.__gd != null ? o.__gd : null;
  if (D.gait === 'robot') return drawRobotSide(ctx, o, sp, s, flip, dist);
  const bx = D.body[0], by = D.body[1], hipY = -(D.bodyY - by * .35), LL = D.legL, S = D.stride || .09, duty = D.duty || .5, R = 2 * LL * .98;
  const moving = dist != null, ph = moving ? (dist / (2 * S * s / duty)) % 1 : 0;
  let bob = 0, pitch = 0, squash = 1, hopY = 0;
  const hips = { F: [bx * .62, -D.bodyY + by * .35], H: [-bx * .62, -D.bodyY + by * .35] };   // shoulder / hip joints
  const feet = {};
  const legPose = (name, phase, hop) => {
    const [jx, jy] = hips[name[0] === 'F' ? 'F' : 'H'];
    let fx, fy;
    if (hop) { const k = hop; fx = k[0]; fy = k[1]; }
    else if (phase < duty) { fx = lerp(S, -S, phase / duty); fy = 0; } else { const u = (phase - duty) / (1 - duty); fx = lerp(-S, S, ease(u)); fy = Math.sin(u * Math.PI) * LL * .55; }
    const ty = hop ? -hop[1] * 0 + fy : fy;
    return [jx, jy, jx + fx, -fy, name[0] === 'F'];
  };
  let legsP = [];
  if (D.gait === 'hop') {
    const hp = moving ? (dist / (.55 * s)) % 1 : 0;
    const air = hp > .18 && hp < .78, u = clamp((hp - .18) / .6);
    hopY = air ? -Math.sin(u * Math.PI) * .26 : 0; squash = hp < .18 ? 1 - .14 * Math.sin(hp / .18 * Math.PI) : hp > .78 ? 1 - .12 * Math.sin((hp - .78) / .22 * Math.PI) : 1.04; pitch = air ? lerp(-.35, .35, u) : 0;
    const hindX = air ? lerp(-.22, .08, u) : -.04, hindY = air ? lerp(.1, .0, u) : 0, frX = air ? lerp(.16, .05, u) : .1, frY = air ? lerp(.04, 0, u) : 0;
    legsP = [['H', hips.H[0], hips.H[1], hips.H[0] + hindX - .03, -hindY, false, true], ['F', hips.F[0], hips.F[1], hips.F[0] + frX - .02, -frY, true, true], ['H', hips.H[0], hips.H[1], hips.H[0] + hindX, -hindY, false, false], ['F', hips.F[0], hips.F[1], hips.F[0] + frX, -frY, true, false]];
  } else {
    const off = D.gait === 'trot' ? { FL: 0, HR: 0, FR: .5, HL: .5 } : { FL: 0, HR: .25, FR: .5, HL: .75 };
    legsP = ['HL', 'FL', 'HR', 'FR'].map(n => { const p = legPose(n, ((moving ? ph : 0) + off[n]) % 1); const far = n[1] === 'L'; return [n, p[0], p[1], p[2], p[3], p[4], far]; });
    if (!moving) legsP = ['HL', 'FL', 'HR', 'FR'].map(n => [n, ...(() => { const j = hips[n[0] === 'F' ? 'F' : 'H']; return [j[0], j[1], j[0] + (n[1] === 'L' ? -.02 : .03), 0, n[0] === 'F']; })(), n[1] === 'L']);
    bob = moving ? Math.abs(Math.sin(ph * TAU * (D.gait === 'trot' ? 2 : 2))) * -.012 : 0;
  }
  const lowest = 0;
  ctx.save(); ctx.translate(o.x, o.y); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.shadow !== false) { ctx.save(); ctx.scale(s, s); ellipse(ctx, 0, 0, bx * 1.1, .03); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill(); ctx.restore(); }
  ctx.scale(s * flip, s * (o.squash || 1)); ctx.translate(0, hopY + bob); ctx.translate(0, 0); ctx.rotate(pitch * 0 + (o.lean || 0)); ctx.scale(1, squash);
  const legCol = D.legCol === 'limb' ? sp.limb : sp.fur, farCol = hmix(legCol, '#000000', .22);
  const drawLeg = (jx, jy, fx, fy, front, far) => {
    let best = null; for (const bend of [1, -1]) { const [a1, a2] = ik(1, jx, jy, fx, fy, LL, LL, bend); const p = limbPts(jx, jy, 1, a1, a2, LL, LL); const k = p[1][0]; if (!best || (front ? k < best.k : k > best.k)) best = { k, p }; }
    toonLimb(ctx, best.p, .08, far ? farCol : legCol, L); ellipse(ctx, best.p[2][0] + .02, best.p[2][1] + .004, .06, .034); fillStroke(ctx, far ? farCol : legCol, lw, L);
  };
  const tailEnd = () => { if (D.tail === 'cat') { ctx.beginPath(); const w = Math.sin(tt * 4) * .05; ctx.moveTo(-bx * .85, -D.bodyY - .02); ctx.bezierCurveTo(-bx * 1.5, -D.bodyY - .05, -bx * 1.4 + w, -D.bodyY - .4, -bx * 1.1 + w, -D.bodyY - .46); ctx.lineWidth = .075; ctx.lineCap = 'round'; ctx.strokeStyle = L; ctx.stroke(); ctx.lineWidth = .05; ctx.strokeStyle = sp.fur; ctx.stroke(); } else if (D.tail === 'ball') { circle(ctx, -bx * .95, -D.bodyY + .02, .07); fillStroke(ctx, '#fff', lw, L); } else { circle(ctx, -bx * .95, -D.bodyY, .055); fillStroke(ctx, sp.fur, lw, L); } };
  const far = legsP.filter(l => l[6]), near = legsP.filter(l => !l[6]);
  far.forEach(l => drawLeg(l[1], l[2], l[3], l[4], l[5], true)); tailEnd();
  ctx.save(); ctx.translate(0, 0); ctx.rotate(pitch);
  const body = () => { ctx.beginPath(); ctx.ellipse(0, -D.bodyY, bx, by, 0, 0, TAU); };
  body(); fillStroke(ctx, sp.fur, lw * 1.2, L); ctx.save(); body(); ctx.clip(); ctx.fillStyle = 'rgba(40,20,60,.12)'; ctx.fillRect(-bx, -D.bodyY, bx * 2, by); ellipse(ctx, .02, -D.bodyY + by * .55, bx * .7, by * .45); ctx.fillStyle = sp.belly; ctx.fill();
  if (sp.stripes) { ctx.fillStyle = sp.stripes; for (let i = -2; i <= 2; i++) ctx.fillRect(i * .1 - .02, -D.bodyY - by, .04, by * .9); }
  if (D.shoulder) { ctx.fillStyle = sp.patch; ctx.fillRect(bx * .25, -D.bodyY - by, .12, by * 2); }
  ctx.restore(); body(); ctx.lineWidth = lw * 1.2; ctx.strokeStyle = L; ctx.stroke();
  near.forEach(l => drawLeg(l[1], l[2], l[3], l[4], l[5], false));
  // head (profile)
  const hr = D.head, hx = bx * .82, hy = -D.bodyY - by * .55;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(o.headTilt || 0 + (hopY < 0 ? -.12 : 0)); ctx.translate(-hx, -hy);
  const ear = () => { ctx.save(); ctx.translate(hx - hr * .25, hy - hr * .85);
    if (sp.earType === 'round') { circle(ctx, 0, 0, hr * .42); fillStroke(ctx, sp.ear, lw, L); }
    else if (sp.earType === 'point') { ctx.beginPath(); ctx.moveTo(-hr * .38, hr * .15); ctx.lineTo(hr * .05, -hr * .75); ctx.lineTo(hr * .42, hr * .15); ctx.closePath(); fillStroke(ctx, sp.ear, lw, L); }
    else if (sp.earType === 'long') { const fl = key === 'bunny' ? (hopY < 0 ? -.9 : -.3 + Math.sin(tt * 3) * .05) : 0; ctx.rotate(fl - .3); ellipse(ctx, 0, -hr * .8, hr * .3, hr * 1.0); fillStroke(ctx, sp.ear, lw, L); ellipse(ctx, 0, -hr * .8, hr * .14, hr * .75); ctx.fillStyle = sp.cheek; ctx.fill(); } ctx.restore(); };
  ear();
  ctx.beginPath(); ctx.ellipse(hx, hy, hr, hr * .95, 0, 0, TAU); fillStroke(ctx, sp.fur, lw * 1.2, L);
  ellipse(ctx, hx + hr * .72, hy + hr * .28, hr * .5, hr * .36); fillStroke(ctx, sp.muzzle, lw * .8, L); circle(ctx, hx + hr * 1.12, hy + hr * .12, hr * .13); ctx.fillStyle = sp.nose; ctx.fill();
  if (sp.patch) { ctx.save(); ctx.translate(hx + hr * .38, hy - hr * .05); ctx.rotate(.5); ellipse(ctx, 0, 0, hr * .22, hr * .32); ctx.fillStyle = sp.patch; ctx.fill(); ctx.restore(); }
  const ex = hx + hr * .42, ey = hy - hr * .05, k = f.eyes || 'normal';
  if (k === 'happy') { ctx.beginPath(); ctx.arc(ex, ey + .01, hr * .2, Math.PI * 1.08, Math.PI * 1.92); ctx.lineWidth = .018; ctx.strokeStyle = sp.patch ? '#fff' : L; ctx.stroke(); }
  else if (k === 'x') { const c = sp.patch ? '#fff' : L; line(ctx, ex - hr * .15, ey - hr * .15, ex + hr * .15, ey + hr * .15, .016, c); line(ctx, ex + hr * .15, ey - hr * .15, ex - hr * .15, ey + hr * .15, .016, c); }
  else { const rr = hr * (k === 'wide' ? .26 : .2); ellipse(ctx, ex, ey, rr, rr * (1 - (f.blink || 0) * .9)); ctx.fillStyle = sp.patch ? '#fff' : L; ctx.fill(); if (sp.patch) { circle(ctx, ex + rr * .3, ey, rr * .55); ctx.fillStyle = L; ctx.fill(); } else { circle(ctx, ex - rr * .3, ey - rr * .3, rr * .3); ctx.fillStyle = '#fff'; ctx.fill(); } }
  if (sp.cheek) { ellipse(ctx, hx + hr * .1, hy + hr * .35, hr * .2, hr * .11); ctx.fillStyle = sp.cheek; ctx.globalAlpha *= .8; ctx.fill(); ctx.globalAlpha /= .8; }
  const mx = hx + hr * .78, my = hy + hr * .5, m = f.mouth || 'smile';
  if (talk > .02) { ellipse(ctx, mx, my + talk * .012, hr * .22, hr * .05 + talk * hr * .22); fillStroke(ctx, '#7a2630', .01, L); }
  else if (m === 'smile' || m === 'grin') { ctx.beginPath(); ctx.arc(mx - hr * .05, my - hr * .12, hr * .22, .3, Math.PI * .75); ctx.lineWidth = .014; ctx.strokeStyle = L; ctx.lineCap = 'round'; ctx.stroke(); }
  else if (m === 'o') { ellipse(ctx, mx, my, hr * .1, hr * .13); fillStroke(ctx, '#7a2630', .01, L); } else line(ctx, mx - hr * .15, my, mx + hr * .15, my, .014, L);
  if (key === 'cat') for (const dy of [-.04, .06]) { line(ctx, hx + hr * .9, hy + hr * (.2 + dy * 3), hx + hr * 1.6, hy + hr * (.12 + dy * 6), .007, L); }
  if (o.hat === 'beanie') { ctx.save(); ctx.translate(hx, hy); ctx.scale(hr / .19, hr / .19); ctx.translate(-hx, -hy); drawBeanie(ctx, hx, hy, .19, o.hatCol || '#7a4bc4', .013); ctx.restore(); }
  ctx.restore(); ctx.restore(); ctx.restore();
}
function drawRobotSide(ctx, o, sp, s, flip, dist) {
  const L = sp.line, lw = .016, f = o.face || {}, ph = dist != null ? (dist / (4 * .07 * s)) % 1 : 0, sw = dist != null ? Math.sin(ph * TAU) : 0, a = .3 * sw, bob = dist != null ? (.34 * (1 - Math.cos(.3 * Math.abs(Math.sin(ph * TAU)))) ) * -1 + .0 : 0;
  ctx.save(); ctx.translate(o.x, o.y); if (o.shadow !== false) { ctx.save(); ctx.scale(s, s); ellipse(ctx, 0, 0, .2, .03); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill(); ctx.restore(); }
  ctx.scale(s * flip, s); ctx.translate(0, bob * 0 + (dist != null ? .34 * (1 - Math.cos(.3)) * .0 : 0));
  const limb = (x, y, ang, len, w, col) => { const ex = x + Math.sin(ang) * len, ey = y + Math.cos(ang) * len; toonLimb(ctx, [[x, y], [ex, ey], [ex, ey]], w, col, L); return [ex, ey]; };
  const farCol = hmix(sp.limb, '#000000', .25);
  const lf = limb(0, -.34, -a, .33, .085, farCol); rrP(ctx, lf[0] - .02, lf[1] - .03, .12, .05, .02); fillStroke(ctx, farCol, lw, L); limb(0, -.62, a * 1.3, .26, .06, farCol);
  rrP(ctx, -.13, -.68, .26, .36, .05); fillStroke(ctx, sp.fur, lw * 1.2, L); rrP(ctx, -.06, -.58, .12, .1, .02); ctx.fillStyle = '#273544'; ctx.fill();
  const ln = limb(0, -.34, a, .33, .085, sp.limb); rrP(ctx, ln[0] - .02, ln[1] - .03, .12, .05, .02); fillStroke(ctx, sp.limb, lw, L); limb(0, -.62, -a * 1.3, .26, .06, sp.limb);
  rrP(ctx, -.03, -.74, .06, .07, .01); fillStroke(ctx, sp.limb, lw, L);
  rrP(ctx, -.13, -.99, .27, .25, .06); fillStroke(ctx, sp.fur, lw * 1.2, L); const ex = .06, ey = -.88, k = f.eyes || 'normal';
  if (k === 'happy') { ctx.beginPath(); ctx.arc(ex, ey + .01, .03, Math.PI * 1.08, Math.PI * 1.92); ctx.lineWidth = .016; ctx.strokeStyle = L; ctx.stroke(); } else { ellipse(ctx, ex, ey, .028, .034); ctx.fillStyle = L; ctx.fill(); }
  const tk = o.talk || 0; if (tk > .02) { ellipse(ctx, .08, -.8, .035, .01 + tk * .03); ctx.fillStyle = '#7a2630'; ctx.fill(); } else line(ctx, .04, -.8, .11, -.8, .012, L);
  line(ctx, 0, -.99, 0, -1.07, .015, L); circle(ctx, 0, -1.09, .03); fillStroke(ctx, '#ff5a5a', lw, L);
  ctx.restore();
}
