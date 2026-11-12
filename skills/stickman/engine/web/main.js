// ---------- compositor: shots, transitions, captions, grade ----------
const canvas = document.getElementById('c'); canvas.width = W; canvas.height = H;
const out = canvas.getContext('2d');
const buf = document.createElement('canvas'); buf.width = W; buf.height = H; const bctx = buf.getContext('2d');
const WARP = window.WARP || null;
function warpMap(x, from, to) { const A = WARP.anchors; if (x <= A[0][from]) return x - A[0][from] + A[0][to]; for (let i = 0; i < A.length - 1; i++) if (x <= A[i + 1][from]) { const k = (x - A[i][from]) / (A[i + 1][from] - A[i][from]); return A[i][to] + k * (A[i + 1][to] - A[i][to]); } const L = A[A.length - 1]; return x - L[from] + L[to]; }
const toOld = t => WARP ? warpMap(t, 1, 0) : t, toNew = t => WARP ? warpMap(t, 0, 1) : t;
const DUR = WARP ? WARP.new_end + 0.6 : SHOTS[SHOTS.length - 1].end;
window.SHOT_SPANS = SHOTS.map((s, i) => [toNew(s.start), i === SHOTS.length - 1 ? DUR : toNew(s.end)]);
const TOTAL_FRAMES = Math.round(DUR * FPS);

const crtBuf = document.createElement('canvas'); crtBuf.width = 270; crtBuf.height = 480;
// grain tiles
const grains = [];
for (let k = 0; k < 4; k++) { const g = document.createElement('canvas'); g.width = g.height = 256; const gc = g.getContext('2d'); const id = gc.createImageData(256, 256); const R = rng(k + 11); for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (R() - .5) * 120; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } gc.putImageData(id, 0, 0); grains.push(g); }

// captions: word chunks (pop style) or semantic phrases (B-styles), configured by the style pack
const capCfg = () => styleDef().cap || { mode: 'word', font: 'Poppins', size: 70, fill: '#fff', stroke: '#111', sw: 13, y: 1345, lower: true };
const CHUNKS = (() => {
  const cfg = capCfg(), ch = []; let cur = null;
  if (cfg.mode === 'phrase') {
    WORDS.forEach((w, i) => { const prev = WORDS[i - 1]; const brk = !cur || (prev && (prev.ph !== w.ph || prev.line !== w.line)) || cur.words.length >= (cfg.max || 6) || (cur.text + ' ' + w.w).length > (cfg.maxChars || 34);
      if (brk) { cur = { words: [w], text: w.w, s: w.s, e: w.e }; ch.push(cur); } else { cur.words.push(w); cur.text += ' ' + w.w; cur.e = w.e; } });
    for (let i = ch.length - 1; i > 0; i--) { const c = ch[i], p = ch[i - 1]; if (c.words.length <= 2 && c.words[0].line === p.words[0].line && p.words.length + c.words.length <= 9) { p.words.push(...c.words); p.text += ' ' + c.text; p.e = c.e; ch.splice(i, 1); } }
    ch.forEach((c, i) => { const n = ch[i + 1]; c.e = n && n.s - c.e < .6 ? n.s : c.e + .35; });
  } else {
    WORDS.forEach((w, i) => { const prev = WORDS[i - 1];
      const brk = !cur || cur.words.length >= 2 || (cur.text + ' ' + w.w).length > 13 || (prev && prev.ph !== w.ph) || (prev && prev.line !== w.line);
      if (brk) { cur = { words: [w], text: w.w, s: w.s, e: w.e }; ch.push(cur); } else { cur.words.push(w); cur.text += ' ' + w.w; cur.e = w.e; } });
    ch.forEach((c, i) => { const n = ch[i + 1]; c.e = n && n.s - c.e < .5 ? n.s : c.e + .25; });
  }
  return ch;
})();
const capText = (s, cfg) => { let r = s.replace(/[-–—]/g, ' ').replace(/[^\p{L}\p{M}\p{N}%'?! ]/gu, '').replace(/\s+/g, ' ').trim(); return cfg.upper ? r.toUpperCase() : (cfg.lower ? r.toLowerCase().replace(/[?!']/g, '') : r); };
function drawCaption(ctx, t) {
  const cfg = capCfg(); const c = CHUNKS.find(c => t >= c.s && t < c.e); if (!c) return;
  const k = clamp((t - c.s) / .1), sc = cfg.mode === 'word' ? .82 + .18 * backOut(k) : 1;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = cfg.mode === 'word' ? 1 : clamp((t - c.s) / .12) * clamp((c.e - t) / .12);
  const str = capText(c.text, cfg); let size = cfg.size;
  ctx.font = `${cfg.weight || 700} ${size}px ${cfg.font}, NotoDeva, sans-serif`; const maxW = cfg.left ? 560 : 940;
  let lines = [str];
  if (ctx.measureText(str).width > maxW) { if (cfg.left || cfg.multi) { const ws = str.split(' '); lines = ['']; ws.forEach(w => { const tryL = (lines[lines.length - 1] + ' ' + w).trim(); if (ctx.measureText(tryL).width > maxW && lines[lines.length - 1]) lines.push(w); else lines[lines.length - 1] = tryL; }); lines = lines.slice(0, 3); } else { size = Math.floor(size * maxW / ctx.measureText(str).width); } }
  const x = cfg.left ? 70 : 540; ctx.translate(x, cfg.y - (lines.length - 1) * size * .55); ctx.scale(sc, sc);
  lines.forEach((ln, i) => { const y = i * size * 1.15; ctx.font = `${cfg.weight || 700} ${size}px ${cfg.font}, NotoDeva, sans-serif`; const w = ctx.measureText(ln).width;
    if (cfg.label) { ctx.fillStyle = cfg.label; ctx.strokeStyle = 'rgba(40,30,20,.35)'; ctx.lineWidth = 3; const lx = cfg.left ? -20 : -w / 2 - 28; ctx.beginPath(); ctx.roundRect(lx, y - size * .72, w + 56 + (cfg.left ? -8 : 0), size * 1.44, size * .35); ctx.fill(); ctx.stroke(); }
    if (cfg.stroke && cfg.mode === 'word') { ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 5; text(ctx, ln, 0, y, size, cfg.fill, cfg.stroke, cfg.sw, cfg.font, cfg.weight || 700, cfg.left ? 'left' : 'center'); ctx.shadowColor = 'transparent'; }
    text(ctx, ln, 0, y, size, cfg.fill, cfg.stroke || cfg.fill, cfg.stroke ? 0 : 0, cfg.font, cfg.weight || 700, cfg.left ? 'left' : 'center'); if (cfg.stroke && cfg.mode !== 'word') { ctx.font = `${cfg.weight || 700} ${size}px ${cfg.font}, NotoDeva, sans-serif`; ctx.textAlign = cfg.left ? 'left' : 'center'; ctx.lineWidth = cfg.sw || 8; ctx.strokeStyle = cfg.stroke; ctx.lineJoin = 'round'; ctx.strokeText(ln, 0, y); ctx.fillStyle = cfg.fill; ctx.fillText(ln, 0, y); } });
  ctx.restore();
}
function renderShot(ctx, i, t) {
  const s = SHOTS[i];
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  ctx.save(); s.draw(ctx, t - s.start, t); ctx.restore();
}
function blit(src, dx, blur) {
  // horizontal motion blur by averaging shifted copies
  const n = blur > 2 ? 9 : 1;
  out.save(); out.setTransform(1, 0, 0, 1, 0, 0);
  for (let k = 0; k < n; k++) { const off = n > 1 ? (k / (n - 1) - .5) * blur : 0; out.globalAlpha = 1 / (k + 1); const x = dx + off; out.drawImage(src, x, 0); if (x > 0) out.drawImage(src, x - W, 0); if (x < 0) out.drawImage(src, x + W, 0); }
  out.restore();
}
function renderFrame(f) {
  const tNew = f / FPS; const t = Math.min(toOld(tNew), SHOTS[SHOTS.length - 1].end - 1e-3);
  let i = SHOTS.findIndex(s => t >= s.start && t < s.end); if (i < 0) i = SHOTS.length - 1;
  const s = SHOTS[i];
  const WT = .2; // whip half-length (6 frames)
  out.setTransform(1, 0, 0, 1, 0, 0); out.fillStyle = '#000'; out.fillRect(0, 0, W, H);
  let dx = 0, blur = 0, done = false;
  // outgoing whip
  if (s.tr === 'whip' && i < SHOTS.length - 1 && t > s.end - WT) { const p = easeIn((t - (s.end - WT)) / WT); dx = -p * 420; blur = p * 260; }
  const prev = SHOTS[i - 1];
  if (prev && prev.tr === 'whip' && t < s.start + WT) { const p = 1 - easeOut((t - s.start) / WT); dx = p * 420; blur = p * 260; }
  renderShot(bctx, i, t);
  blit(buf, dx, blur);
  // finish by style: grade (vignette+grain) | crt (analog TV) | none
  const fin = styleDef().finish || 'grade';
  if (fin === 'grade') { out.save(); out.setTransform(1, 0, 0, 1, 0, 0);
    const g = out.createRadialGradient(540, 900, 500, 540, 960, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,5,20,.32)'); out.fillStyle = g; out.fillRect(0, 0, W, H);
    out.globalCompositeOperation = 'overlay'; out.globalAlpha = .07; const gr = grains[f % 4]; const pat = out.createPattern(gr, 'repeat'); out.fillStyle = pat; out.translate((f * 37) % 256, (f * 91) % 256); out.fillRect(-256, -256, W + 512, H + 512); out.restore(); }
  else if (fin === 'crt') { out.save(); out.setTransform(1, 0, 0, 1, 0, 0);
    const sm = crtBuf.getContext('2d'); sm.clearRect(0, 0, 270, 480); sm.drawImage(canvas, 0, 0, 270, 480); out.globalCompositeOperation = 'lighter'; out.globalAlpha = .22; out.imageSmoothingEnabled = true; out.drawImage(crtBuf, 0, 0, W, H);
    out.globalCompositeOperation = 'source-over'; out.globalAlpha = .22; out.fillStyle = '#000'; for (let y = (f % 2) * 2; y < H; y += 4) out.fillRect(0, y, W, 1.6);
    out.globalAlpha = 1; const g = out.createRadialGradient(540, 960, 450, 540, 960, 1300); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); out.fillStyle = g; out.fillRect(0, 0, W, H);
    const fl = Math.sin(f * 1.7) * .015 + ((f % 97) < 2 ? .06 : 0); out.fillStyle = `rgba(255,255,255,${Math.max(0, fl)})`; out.fillRect(0, 0, W, H);
    if ((f % 131) < 3) { const yy = (f * 53) % H; out.globalAlpha = .5; out.drawImage(canvas, 0, yy, W, 40, 14, yy, W, 40); } out.restore(); }
  drawCaption(out, tNew);
}
window.renderFrame = renderFrame; window.TOTAL_FRAMES = TOTAL_FRAMES; window.DUR = DUR;
window.grab = (q = .93) => canvas.toDataURL('image/jpeg', q);
