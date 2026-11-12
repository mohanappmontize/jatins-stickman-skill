// ---------- extra props for "The Lost Umbrella" ----------
function drawUmbrella(ctx, x, y, s, tilt = 0, c1 = '#ff4d6d', c2 = '#ffd23a', open = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -.5); ctx.lineTo(0, .15); ctx.quadraticCurveTo(0, .3, -.12, .27); ctx.lineWidth = .09; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = .045; ctx.strokeStyle = '#6a4a35'; ctx.stroke();
  const R = .78 * open, cy = -.52, n = 5;
  const canopy = () => { ctx.beginPath(); ctx.moveTo(-R, cy); ctx.bezierCurveTo(-R, cy - R * 1.25, R, cy - R * 1.25, R, cy); for (let i = n - 1; i >= 0; i--) { const x0 = -R + (i + 1) * 2 * R / n, x1 = -R + i * 2 * R / n; ctx.quadraticCurveTo((x0 + x1) / 2, cy + .14, x1, cy); } ctx.closePath(); };
  canopy(); ctx.fillStyle = c1; ctx.fill();
  ctx.save(); canopy(); ctx.clip(); ctx.fillStyle = c2;
  for (let i = 1; i < n; i += 2) { const a = -R + i * 2 * R / n, b = -R + (i + 1) * 2 * R / n; ctx.beginPath(); ctx.moveTo(0, cy - R * .95); ctx.lineTo(a, cy + .2); ctx.lineTo(b, cy + .2); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.fillRect(R * .25, cy - R * 1.3, R, R * 1.6); ctx.restore();
  canopy(); ctx.lineWidth = .05; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, cy - R * .95); ctx.lineTo(0, cy - R * .95 - .12); ctx.lineWidth = .05; ctx.stroke();
  ctx.restore();
}
function drawBusStop(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -.9, -1.5, 1.8, .16, .04); fillStroke(ctx, '#d94a4a', .04);
  for (const px of [-.8, .8]) { rrect(ctx, px - .04, -1.35, .08, 1.35, .02); fillStroke(ctx, '#6c7a89', .035); }
  rrect(ctx, -.7, -.5, 1.4, .1, .03); fillStroke(ctx, '#b7773c', .035); rrect(ctx, -.6, -.4, .08, .4, .02); fillStroke(ctx, '#6c7a89', .03); rrect(ctx, .52, -.4, .08, .4, .02); fillStroke(ctx, '#6c7a89', .03);
  rrect(ctx, .4, -1.9, .5, .4, .06); fillStroke(ctx, '#2f7bf0', .04); text(ctx, 'BUS', .65, -1.7, .2, '#fff', INK, 0);
  line(ctx, .65, -1.5, .65, -1.5, .03); ctx.restore();
}
function drawFlood(ctx, level, t, a = .82, x0 = -1700, x1 = 2800) {
  ctx.save();
  const wave = (off, amp) => { ctx.beginPath(); ctx.moveTo(x0, level + 2200); for (let x = x0; x <= x1; x += 40) ctx.lineTo(x, level + Math.sin(x * .011 + t * 3 + off) * amp + Math.sin(x * .027 - t * 2 + off) * amp * .5); ctx.lineTo(x1, level + 2200); ctx.closePath(); };
  const g = ctx.createLinearGradient(0, level, 0, level + 700); g.addColorStop(0, `rgba(120,180,225,${a})`); g.addColorStop(1, `rgba(35,80,140,${a})`);
  wave(0, 14); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.globalAlpha = .55; ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (let i = 0; i < 14; i++) { const x = x0 + (i * 337 + t * 120) % (x1 - x0), y = level + 60 + (i * 91) % 400; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 40, y - 14, x + 80, y); ctx.stroke(); }
  ctx.restore();
}
function drawBoat(ctx, x, y, s, t, flip = 1) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2.4) * 8); ctx.rotate(Math.sin(t * 1.9) * .04); ctx.scale(s * flip, s);
  ctx.beginPath(); ctx.moveTo(-1.2, -.35); ctx.lineTo(1.3, -.35); ctx.quadraticCurveTo(1.15, .2, .8, .3); ctx.lineTo(-.9, .3); ctx.quadraticCurveTo(-1.15, .2, -1.2, -.35); ctx.closePath(); fillStroke(ctx, '#e0523f', .05);
  ctx.save(); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(-1.3, -.2, 2.7, .08); ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(.2, -.4, 1.2, .8); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-1.2, -.35); ctx.lineTo(1.3, -.35); ctx.lineWidth = .06; ctx.strokeStyle = INK; ctx.stroke();
  rrect(ctx, -.95, -.95, .8, .6, .06); fillStroke(ctx, '#fff3df', .05); rrect(ctx, -.8, -.82, .22, .22, .03); fillStroke(ctx, '#9fd6ff', .04);
  ctx.beginPath(); ctx.moveTo(-1.05, -.95); ctx.lineTo(-.55, -1.18); ctx.lineTo(-.05, -.95); ctx.closePath(); fillStroke(ctx, '#2f63c9', .05);
  line(ctx, -.55, -1.18, -.55, -1.6, .05, INK); ctx.beginPath(); ctx.moveTo(-.55, -1.6); ctx.lineTo(-.15, -1.5); ctx.lineTo(-.55, -1.4); ctx.closePath(); fillStroke(ctx, '#ffd23a', .04);
  ctx.restore();
}
function drawRainbow(ctx, cx, cy, r, a = 1) {
  ctx.save(); ctx.globalAlpha = a; const cols = ['#ff5a5a', '#ffa84a', '#ffe14d', '#5fd36a', '#4aa8ff', '#8a6bff']; ctx.lineCap = 'butt';
  cols.forEach((c, i) => { ctx.beginPath(); ctx.arc(cx, cy, r - i * 34, Math.PI, 0); ctx.lineWidth = 36; ctx.strokeStyle = c; ctx.stroke(); }); ctx.restore();
}
function lamp(ctx, x, y, s, on = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); line(ctx, 0, 0, 0, -1.5, .1, INK); line(ctx, 0, 0, 0, -1.5, .05, '#4a5568'); line(ctx, 0, -1.5, .25, -1.5, .1, INK); line(ctx, 0, -1.5, .25, -1.5, .05, '#4a5568');
  if (on) { const g = ctx.createRadialGradient(.3, -1.4, .05, .3, -1.4, .9); g.addColorStop(0, 'rgba(255,230,140,.7)'); g.addColorStop(1, 'rgba(255,230,140,0)'); ctx.fillStyle = g; ctx.fillRect(-.7, -2.4, 2, 2); }
  circle(ctx, .3, -1.42, .12); fillStroke(ctx, on ? '#ffe58a' : '#bbb', .04); ctx.restore();
}
