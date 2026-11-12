// ---------- props for "Remote Control Chaos" ----------
function drawRemote(ctx, x, y, s, glow = 0, rot = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  if (glow > 0) { const g = ctx.createRadialGradient(0, 0, s * .1, 0, 0, s * 2.2); g.addColorStop(0, `rgba(255,236,130,${.75 * glow})`); g.addColorStop(1, 'rgba(255,236,130,0)'); ctx.fillStyle = g; ctx.fillRect(-s * 2.2, -s * 2.2, s * 4.4, s * 4.4); }
  ctx.scale(s, s);
  line(ctx, -.18, -.62, -.28, -.95, .06, INK); circle(ctx, -.28, -.97, .06); fillStroke(ctx, '#ffd23a', .035);
  rrP(ctx, -.3, -.62, .6, 1.25, .16); fillStroke(ctx, '#2f3445', .06);
  ctx.save(); rrP(ctx, -.3, -.62, .6, 1.25, .16); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(-.3, -.62, .18, 1.3); ctx.restore();
  circle(ctx, 0, -.28, .2); fillStroke(ctx, '#ff4d4d', .045); ellipse(ctx, -.06, -.34, .06, .035, -.5); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fill();
  circle(ctx, -.14, .16, .09); fillStroke(ctx, '#3fd47a', .035); circle(ctx, .14, .16, .09); fillStroke(ctx, '#4aa8ff', .035); circle(ctx, 0, .38, .09); fillStroke(ctx, '#ffd23a', .035);
  ctx.restore();
}
function batteryHUD(ctx, pct, t, a = 1) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
  const low = pct <= 20, blink = low ? (Math.sin(t * 14) > 0 ? 1 : .35) : 1, col = pct > 50 ? '#3fd47a' : pct > 20 ? '#ffd23a' : '#ff3d3d';
  ctx.translate(540, 280); ctx.globalAlpha = a * blink;
  rrP(ctx, -170, -70, 300, 140, 26); fillStroke(ctx, 'rgba(20,20,30,.75)', 10, '#fff'); rrP(ctx, 130, -28, 26, 56, 8); fillStroke(ctx, '#fff', 4, '#fff');
  rrP(ctx, -150, -50, Math.max(14, 260 * pct / 100), 100, 14); ctx.fillStyle = col; ctx.fill();
  text(ctx, pct + '%', 0, 4, 66, '#fff', '#111', 12, 'Poppins', 700); ctx.restore();
}
function freezeFX(ctx, a, t) {
  if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = `rgba(110,150,235,${.22 * a})`; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(540, 960, 500, 540, 960, 1300); g.addColorStop(0, 'rgba(120,170,255,0)'); g.addColorStop(1, `rgba(40,70,160,${.45 * a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = a * .95; rrP(ctx, 900, 90, 130, 130, 30); ctx.fillStyle = 'rgba(15,20,40,.8)'; ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(934, 120, 22, 70); ctx.fillRect(974, 120, 22, 70);
  ctx.restore();
}
function drawBusBig(ctx, x, y, s, t, speed = 0, xs = 1, dir = -1) {   // dir -1: bus faces LEFT, 1: faces RIGHT; xs<1 = shorter cartoon bus; origin = bottom centre
  ctx.save(); ctx.translate(x, y); ctx.scale(s * xs * (dir === 1 ? -1 : 1), s);
  if (speed > 0) for (let i = 0; i < 5; i++) { const yy = -250 + i * 55, l = 140 + (i % 3) * 70; line(ctx, 380 + 40, yy, 380 + 40 + l * speed, yy, 10, 'rgba(255,255,255,.7)'); }
  rrP(ctx, -380, -300, 760, 270, 36); fillStroke(ctx, '#ffb703', 10);
  ctx.save(); rrP(ctx, -380, -300, 760, 270, 36); ctx.clip(); ctx.fillStyle = 'rgba(160,80,0,.25)'; ctx.fillRect(-380, -90, 760, 80); ctx.fillStyle = '#d62828'; ctx.fillRect(-380, -150, 760, 18); ctx.restore();
  for (let i = 0; i < 4; i++) { rrP(ctx, -330 + i * 130, -270, 100, 90, 14); fillStroke(ctx, '#bfe4ff', 7); }
  rrP(ctx, -358, -270, 20, 20, 4); rrP(ctx, 200, -270, 150, 120, 16); fillStroke(ctx, '#bfe4ff', 7);
  circle(ctx, -394, -100, 22); fillStroke(ctx, '#fff3a8', 6);
  for (const wx of [-230, 240]) { circle(ctx, wx, -26, 62); fillStroke(ctx, '#232733', 9); circle(ctx, wx, -26, 26); ctx.fillStyle = '#c0c6d4'; ctx.fill(); ctx.save(); ctx.translate(wx, -26); ctx.rotate(t * 9 * (speed > 0 ? 1 : 0)); line(ctx, -26, 0, 26, 0, 6, '#6b7280'); line(ctx, 0, -26, 0, 26, 6, '#6b7280'); ctx.restore(); }
  ctx.restore();
}
function drawClassroom(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .5); ctx.fillStyle = '#cfe8d0'; ctx.fillRect(-1400, -1400, 4000, 4400);
  applyCam(ctx, cam, .85);
  rrP(ctx, 120, 300, 840, 460, 18); fillStroke(ctx, '#2f5d4a', 14); ctx.strokeStyle = '#9b6a3a'; ctx.lineWidth = 16; rrP(ctx, 120, 300, 840, 460, 18); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '700 86px Poppins, NotoDeva, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(o.board || 'होमवर्क', 540, 470); ctx.font = '700 56px Poppins'; ctx.fillText('2 + 2 = ?', 540, 580);
  circle(ctx, 960, 180, 70); fillStroke(ctx, '#fff', 8); line(ctx, 960, 180, 960, 130, 8, INK); line(ctx, 960, 180, 995, 190, 8, INK);
  applyCam(ctx, cam, 1); ctx.fillStyle = '#c98e5a'; ctx.fillRect(-1600, 1400, 4400, 1500); ctx.beginPath(); ctx.moveTo(-1600, 1400); ctx.lineTo(2800, 1400); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = 'rgba(80,40,10,.15)'; for (let i = 0; i < 8; i++) ctx.fillRect(-1600, 1440 + i * 70, 4400, 5);
}
function drawDesk(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rrP(ctx, -170, -200, 340, 30, 10); fillStroke(ctx, '#b9773f', 6); line(ctx, -140, -170, -140, 0, 14, INK); line(ctx, -140, -170, -140, 0, 7, '#8a5530'); line(ctx, 140, -170, 140, 0, 14, INK); line(ctx, 140, -170, 140, 0, 7, '#8a5530'); ctx.restore(); }
function drawCricketField(ctx, t, cam, o = {}) {
  BG(ctx, t, cam, { M: MOODS.day, sun: [880, 300, 80, .9], noHouses: true });
  applyCam(ctx, cam, 1); ctx.beginPath(); ctx.moveTo(300, 1180); ctx.lineTo(780, 1180); ctx.lineTo(1100, 2000); ctx.lineTo(-20, 2000); ctx.closePath(); fillStroke(ctx, '#e3c58a', 8);
  ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(110, 1700); ctx.lineTo(970, 1700); ctx.stroke();
  for (const dx of [-26, 0, 26]) line(ctx, 540 + dx, 1250, 540 + dx, 1170, 8, '#e8c04a');
  const R = rng(14); for (let i = 0; i < 26; i++) { const cx = -100 + i * 52, cy = 1060 + R() * 28; circle(ctx, cx, cy, 20); fillStroke(ctx, ['#e0523f', '#3a6fd1', '#ffd23a', '#7a4bc4'][i % 4], 4); }
}
function drawBat(ctx, x, y, s, ang) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s); line(ctx, 0, 0, 0, -50, 16, INK); line(ctx, 0, 0, 0, -50, 8, '#8a5530'); rrP(ctx, -22, -260, 44, 210, 14); fillStroke(ctx, '#e8c58a', 7); ctx.restore(); }
function drawBall(ctx, x, y, r, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); circle(ctx, 0, 0, r); fillStroke(ctx, '#d62828', r * .16); ctx.beginPath(); ctx.arc(0, 0, r * .62, -.6, .6); ctx.lineWidth = r * .1; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * .62, Math.PI - .6, Math.PI + .6); ctx.stroke(); ctx.restore(); }
function clownMakeup(ctx, x, y, s, k = 1) {   // x,y = character feet; adds wig + red nose + painted smile on the head
  const hx = x, hy = y - .765 * s, r = .19 * s; if (k <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(1, k * 2);
  [['#ff5a5a', -1, -.15], ['#ffd23a', 1, -.15], ['#4aa8ff', -1, .08], ['#5fd36a', 1, .08]].forEach(([c, sx, oy]) => { circle(ctx, hx + sx * r * 1.0, hy + oy * r - r * .5, r * .5); fillStroke(ctx, c, r * .07); });
  circle(ctx, hx, hy + r * .12, r * .26); fillStroke(ctx, '#ff2d2d', r * .06); ellipse(ctx, hx - r * .08, hy + r * .06, r * .07, r * .04, -.5); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill(); ctx.restore();
}

function drawStool(ctx, x, y, h) { ctx.save(); ctx.translate(x, y); rrP(ctx, -h * .6, -h, h * 1.2, h * .18, h * .06); fillStroke(ctx, '#c98e5a', 6); line(ctx, -h * .45, -h * .82, -h * .5, 0, 10, INK); line(ctx, -h * .45, -h * .82, -h * .5, 0, 5, '#8a5530'); line(ctx, h * .45, -h * .82, h * .5, 0, 10, INK); line(ctx, h * .45, -h * .82, h * .5, 0, 5, '#8a5530'); ctx.restore(); }
function bannerText(ctx, l1, l2, y1 = 250, y2 = 380, k = 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(k); rrP(ctx, 60, y1 - 90, 960, y2 - y1 + 180, 40); ctx.fillStyle = 'rgba(20,20,40,.78)'; ctx.fill(); text(ctx, l1, 540, y1, 100, '#fff', '#111', 14, 'Poppins', 700); text(ctx, l2, 540, y2, 90, '#ffe14d', '#111', 14, 'Poppins', 700); ctx.restore(); }
