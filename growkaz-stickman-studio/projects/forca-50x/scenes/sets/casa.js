// sets/casa.js — interiores: quarto, banheiro, cozinha, laboratório, cinema, escritório do Galileu.
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, radGrad, glow, alpha, shade, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const GYi = () => E.H * V(0.8, 0.68);
function ceuJanela(M, noite) { return (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h);
  if (noite) { FX.stars(g, 0, { area: [x, y, w, h * 0.6], count: 40 }); FX.moon(g, x + w * 0.7, y + h * 0.28, 26); }
  else FX.sun(g, x + w * 0.62, y + h * 0.62, 34, '#fff3dc', M.key, 3);
  FX.skyline(g, { x: x - 40, y: y + h * 0.78, w: w + 80, minH: 30, maxH: h * 0.35, color: shade(M.dark, 0.1), windowColor: alpha(M.practical, 0.6), lit: noite ? 0.35 : 0.08, seed: 4 }); }; }

// quarto/sala genérico: parede, janela grande, piso. o = { mood, noite, janela: {x, w, h}, piso: 'madeira'|'azulejo', fundo(g, GY, M) }
export function sala(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = GYi(), CX = E.W / 2, noite = !!o.noite;
  const wall = shade(o.parede || M.wall, -0.25), wallD = shade(o.parede || M.wall, -0.55);
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -200, 0, GY, [shade(wall, 0.05), wall, wallD]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    g.fillStyle = shade(wall, -0.15); g.fillRect(-E.W, GY - 70, E.W * 3, 70); g.fillStyle = 'rgba(255,240,220,.08)'; g.fillRect(-E.W, GY - 70, E.W * 3, 4);
    const j = o.janela; if (j !== false) { const jw = j?.w ?? 520, jh = j?.h ?? 420, jx = CX + (j?.x ?? 260) - jw / 2, jy = GY - 120 - jh;
      FX.windowFrame(g, { x: jx, y: jy, w: jw, h: jh, cols: 2, rows: 2, frame: wallD, bar: 12, blinds: o.persiana ? 30 : 0 }, ceuJanela(M, noite));
      glow(g, jx + jw / 2, jy + jh / 2, jw * 0.9, noite ? M.rim : M.key, noite ? 0.16 : 0.28);
      rr(g, jx - 24, jy + jh, jw + 48, 18, 4); g.fillStyle = wallD; g.fill(); }
    o.fundo?.(g, GY, M, wall, wallD);
  });
  layer(g, cam, 0.9, (g) => {
    const f = o.piso === 'azulejo' ? shade(M.floor, 0.05) : shade(M.floor, -0.1);
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [f, shade(M.dark, -0.2)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    if (o.piso === 'azulejo') { g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; for (let x = -E.W; x < E.W * 2; x += 90) { g.beginPath(); g.moveTo(CX + (x - CX) * 0.4, GY); g.lineTo(CX + (x - CX) * 2.2, E.H + 200); g.stroke(); } }
    FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.22)', 0.08);
    if (o.janela !== false) FX.pool(g, CX + (o.janela?.x ?? 260) - 60, GY + 70, 380, 60, noite ? M.rim : M.key, noite ? 0.12 : 0.2);
  });
  return { GY, CX, M };
}

// mobília
export function cama(g, x, GY, M, o = {}) { const w = o.w ?? 520; g.fillStyle = shade(M.dark, 0.05); g.fillRect(x, GY - 110, w, 110); g.fillRect(x - 14, GY - 250, 30, 250);
  rr(g, x + 6, GY - 150, w - 6, 56, 18); g.fillStyle = o.cor || '#4a5a9a'; g.fill(); rr(g, x + 20, GY - 178, 130, 40, 16); g.fillStyle = '#e8e4f4'; g.fill(); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x + 6, GY - 150, w - 6, 6); }
export function mesinha(g, x, GY, M) { g.fillStyle = shade(M.dark, 0.12); g.fillRect(x - 60, GY - 150, 120, 150); g.fillStyle = shade(M.dark, 0.25); g.fillRect(x - 70, GY - 160, 140, 14); return GY - 160; }
export function despertador(g, x, y, s = 1, quebrado = 0, t = 0) { g.save(); g.translate(x, y); g.scale(s, s);
  if (quebrado < 1) { g.globalAlpha *= 1 - quebrado; rr(g, -46, -70, 92, 66, 14); g.fillStyle = '#c9472f'; g.fill(); rr(g, -36, -60, 72, 40, 8); g.fillStyle = '#16121c'; g.fill(); g.fillStyle = '#ff6a4a'; g.font = '700 26px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('7:00', 0, -40); for (const sx of [-1, 1]) { circle(g, sx * 30, -78, 12, '#e8c94a'); seg(g, [[sx * 30, -6], [sx * 40, 4]], 6, '#16121c'); } g.globalAlpha = 1; }
  if (quebrado > 0) { const r = (i) => ((i * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < 26; i++) { const a = r(i) * 6.28, d = quebrado * (12 + r(i + 7) * 40); circle(g, Math.cos(a) * d * 1.6, -6 - Math.abs(Math.sin(a)) * d * 0.4 + quebrado * 4, 3 + r(i + 3) * 6, i % 3 ? '#c9472f' : '#3a3038'); } }
  g.restore(); }
export function geladeira(g, x, GY, M, aberta = 0, cheia = 1) { const w = 230, h = 460; g.fillStyle = '#d8dde4'; g.fillRect(x - w / 2, GY - h, w, h); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x - w / 2, GY - h * 0.62, w, 6); seg(g, [[x + w / 2 - 26, GY - h + 40], [x + w / 2 - 26, GY - h * 0.7]], 8, '#9aa2ac');
  if (aberta > 0) { g.fillStyle = '#fff8e0'; g.fillRect(x - w / 2 + 10, GY - h + 10, (w - 20) * aberta, h * 0.6); glow(g, x, GY - h * 0.7, 260, '#fff4d0', 0.55 * aberta); for (let k = 0; k < 3; k++) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x - w / 2 + 10, GY - h + 100 + k * 80, (w - 20) * aberta, 5); if (cheia > 0) for (let i = 0; i < 4; i++) if ((i + k) % 4 < cheia * 4) { rr(g, x - w / 2 + 22 + i * 48, GY - h + 50 + k * 80, 36, 48, 6); g.fillStyle = ['#c9472f', '#f2c94c', '#3fb950', '#3a6ea5'][(i + k) % 4]; g.fill(); } } } }
export function bancada(g, x, w, GY, M) { FX.counter(g, { x, y: GY, w, h: 300, color: shade(M.dark, 0.1), top: shade(M.wall, 0.1), doors: Math.round(w / 140) }); }
export function espelho(g, x, y, w, h, M, conteudo) { rr(g, x - 10, y - 10, w + 20, h + 20, 16); g.fillStyle = shade(M.dark, 0.2); g.fill(); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = linGrad(g, x, y, x + w, y + h, [shade(M.wall, 0.2), shade(M.wall, -0.2)]); g.fillRect(x, y, w, h); conteudo?.(g); g.fillStyle = 'rgba(255,255,255,.08)'; poly(g, [[x + w * 0.1, y], [x + w * 0.3, y], [x + w * 0.05, y + h], [x - w * 0.15, y + h]], 'rgba(255,255,255,.08)'); g.restore(); }
export function pia(g, x, GY, M, semTorneira = 0) { g.fillStyle = '#e8ecf0'; rr(g, x - 150, GY - 330, 300, 60, 14); g.fill(); g.fillStyle = shade(M.dark, 0.15); g.fillRect(x - 40, GY - 270, 80, 270); if (!semTorneira) { seg(g, [[x, GY - 330], [x, GY - 390], [x + 46, GY - 390], [x + 46, GY - 370]], 12, '#b8c0c8'); circle(g, x - 40, GY - 352, 12, '#b8c0c8'); } }
export function vaso(g, x, GY, s = 1) { g.fillStyle = '#c9563e'; rr(g, x - 34 * s, GY - 80 * s, 68 * s, 80 * s, 10 * s); g.fill(); for (let i = 0; i < 7; i++) { const a = -2.4 + i * 0.3; g.fillStyle = i % 2 ? '#2f6a3a' : '#3f8a4a'; g.beginPath(); g.ellipse(x + Math.cos(a) * 60 * s, GY - 90 * s + Math.sin(a) * 70 * s, 16 * s, 46 * s, a + 1.57, 0, 7); g.fill(); } }
export function quadro(g, x, y, w, h, cor, M) { rr(g, x - 8, y - 8, w + 16, h + 16, 6); g.fillStyle = shade(M.dark, 0.1); g.fill(); g.fillStyle = cor; g.fillRect(x, y, w, h); circle(g, x + w * 0.6, y + h * 0.4, h * 0.2, '#f2c94c'); poly(g, [[x, y + h], [x + w * 0.4, y + h * 0.45], [x + w * 0.7, y + h]], 'rgba(0,0,0,.3)'); }
