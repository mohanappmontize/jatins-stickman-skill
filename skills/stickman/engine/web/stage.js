// ---------- STAGES: scene layouts by code. Named places, depth->scale rule, real-world object sizes ----------
// Usage: const S = STAGES.cricket;  const p = S.at('crease');  drawActor(ctx, CH({x:p.x, y:p.y, s:S.kid(p.y), ...}));  drawBusBig(ctx, x, y, S.busScale(y), ...)
// Rule: every actor/prop size comes from S.px(y, meters) so sizes stay consistent; every position comes from a named place (S.at(name)).
const REAL = { kid: 1.25, adult: 1.72, bus: 2.2, bin: .85, desk: .72, door: 2.0, board: 1.3, stumps: .72, car: 1.5, tree: 4 };   // metres
function makeStage(def) {
  const S = Object.assign({}, def);
  S.px = (y, m) => { const k = clamp((y - S.yFar) / (S.yNear - S.yFar)); return m * lerp(S.pxmFar, S.pxmNear, k); };           // pixel height of an m-metre object standing at ground y
  S.kid = y => S.px(y, REAL.kid) / .94; S.adult = y => S.px(y, REAL.adult) / 1.045;                                           // character scale `s` for drawStick/human (their total height ~ .94s / 1.045s)
  S.busScale = y => S.px(y, REAL.bus) / 300; S.scaleOf = (y, m, unit) => S.px(y, m) / unit;
  S.at = name => { const p = S.places[name]; if (!p) throw new Error('no place ' + name + ' in ' + S.name); return { x: p[0], y: p[1], face: p[2] || 1 }; };
  return S;
}
const STAGES = {
  // portrait cricket ground, camera behind the batting end. pitch is a trapezoid from bowler end (far, y=1180) to batting end (near, y=1900)
  cricket: makeStage({ name: 'cricket', yFar: 1150, yNear: 1900, pxmFar: 120, pxmNear: 640, horizon: 1130,
    places: { crease: [330, 1800, 1], stumps: [470, 1850], bowler: [610, 1230, -1], bowlerRun: [610, 1300, -1], slip: [760, 1340, -1], midwicket: [940, 1270, -1], boundaryL: [120, 1250, 1], boundaryR: [960, 1250, -1], umpire: [700, 1190, -1], crowd: [540, 1070] },
    draw(ctx, t, cam, o = {}) { BG(ctx, t, cam, { M: o.M || MOODS.day, sun: [880, 300, 80, .9], noHouses: true }); applyCam(ctx, cam, 1);
      ctx.beginPath(); ctx.moveTo(470, 1170); ctx.lineTo(610, 1170); ctx.lineTo(900, 2000); ctx.lineTo(180, 2000); ctx.closePath(); fillStroke(ctx, '#e3c58a', 8);
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(290, 1750); ctx.lineTo(790, 1750); ctx.moveTo(500, 1190); ctx.lineTo(580, 1190); ctx.stroke();
      const sp = STAGES.cricket.px(1850, REAL.stumps), sx = 470, sy = 1850; for (const dx of [-.12, 0, .12]) line(ctx, sx + dx * sp, sy, sx + dx * sp, sy - sp, 9, '#f1d27a'); line(ctx, sx - .15 * sp, sy - sp, sx + .15 * sp, sy - sp, 7, '#f1d27a');
      const sp2 = STAGES.cricket.px(1190, REAL.stumps); for (const dx of [-.12, 0, .12]) line(ctx, 540 + dx * sp2, 1190, 540 + dx * sp2, 1190 - sp2, 4, '#f1d27a');
      const R = rng(14); for (let i = 0; i < 40; i++) { const cx = -60 + i * 33, cy = 1080 + R() * 22, c = ['#e0523f', '#3a6fd1', '#ffd23a', '#7a4bc4'][i % 4]; ctx.beginPath(); ctx.arc(cx, cy, 11, 0, TAU); ctx.fillStyle = c; ctx.fill(); line(ctx, cx, cy + 10, cx, cy + 34, 10, c); } } }),
  // classroom: board on the back wall, desk row, teacher spot beside the board, door on the right wall
  classroom: makeStage({ name: 'classroom', yFar: 1400, yNear: 1900, pxmFar: 330, pxmNear: 560, horizon: 1400,
    places: { teacher: [260, 1780, 1], board: [540, 1400], desk1: [730, 1700, -1], desk2: [560, 1700, -1], seat1: [730, 1640, -1], seat2: [520, 1640, -1], door: [1000, 1700], front: [420, 1850, 1], wall: [100, 1700] },
    draw(ctx, t, cam, o = {}) { drawClassroom(ctx, t, cam, o); } }),
  // street with a bus lane: sidewalk/grass band, road band. bus always in the road, people on the grass edge or crossing
  street: makeStage({ name: 'street', yFar: 1300, yNear: 1900, pxmFar: 330, pxmNear: 520, horizon: 1130,
    places: { kerb: [300, 1700, 1], road: [540, 1780, 1], roadFar: [700, 1650, -1], busStop: [850, 1700], bin: [760, 1720], left: [150, 1720, 1], right: [930, 1720, -1] },
    draw(ctx, t, cam, o = {}) { BG(ctx, t, cam, { M: o.M || MOODS.day, sun: o.sun || [200, 260, 80, .8] }); applyCam(ctx, cam, 1); if (o.road !== false) { ctx.fillStyle = '#6f7a90'; ctx.fillRect(-1600, 1560, 4400, 600); ctx.fillStyle = 'rgba(255,255,255,.7)'; for (let x = -200; x < 1500; x += 180) ctx.fillRect(x + (o.roadShift || 0) % 180, 1840, 90, 12); } } }),
};
// frame guard used by render.js stills: returns list of problems for the actor boxes recorded in __BOXES
function stageChecks(boxes, W, H) {
  const out = [];
  boxes.forEach((b, i) => { const l = b.x - b.s * .26, r = b.x + b.s * .26, top = b.y - b.s * 1.0; if (!b.cropOK && (l < -10 || r > W + 10)) out.push(`CROP actor #${i}(${b.id || b.x | 0}) is cut by the ${l < -10 ? 'left' : 'right'} frame edge (x=${b.x | 0}, s=${b.s | 0})`); if (!b.cropOK && top < -30 && b.s < 1500) out.push(`CROP actor #${i}(${b.id || b.x | 0}) head leaves the top of the frame`); });
  return out;
}
