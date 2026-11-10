// sets/rua.js — bairro (dia/entardecer/noite), telhado, mercado e jardim macro.
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const GYr = () => E.H * V(0.82, 0.7);
export function rua(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = GYr(), CX = E.W / 2, noite = o.mood === 'night';
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); if (noite) { FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, E.H], count: 160 }); FX.moon(g, CX + 520, GY - 760, 40); } else FX.sun(g, CX + 560, GY - 520, 60, '#fff3dc', M.key, 5); FX.clouds(g, { y: GY - 900, h: 200, color: '#ffffff', a: noite ? 0.04 : 0.12, seed: 5 }); });
  layer(g, cam, 0.3, (g) => FX.skyline(g, { x: -E.W, y: GY - 330, w: E.W * 3, minH: 120, maxH: 420, color: mix(M.sky[1], M.dark, 0.7), windowColor: alpha(M.practical, 0.55), lit: noite ? 0.35 : 0.12, seed: 9 }));
  layer(g, cam, 0.6, (g) => { const r = rng(o.seed ?? 3); let x = -E.W * 0.9; let i = 0; while (x < E.W * 1.9) { const w = 260 + r() * 200, h = 380 + r() * 360; FX.facade(g, { x, y: GY - 40, w, h, color: shade(M.wall, -0.15 - r() * 0.25), win: M.practical, dark: shade(M.dark, -0.1), cols: Math.round(w / 90), rows: Math.round(h / 140), lit: noite ? 0.55 : 0.18, seed: 20 + i, door: i % 2 === 0 }); x += w + 20; i++; }
    o.fundo?.(g, GY, M); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 40, 0, GY + 400, [shade(M.road, 0.1), shade(M.dark, -0.2)]); g.fillRect(-E.W, GY - 40, E.W * 3, E.H * 2); g.fillStyle = shade(M.floor, 0.05); g.fillRect(-E.W, GY - 40, E.W * 3, 22); FX.floorLines(g, GY, GY + 400, 'rgba(0,0,0,.22)', 0.09);
    for (const x of [-700, 0, 700, 1400, 2100]) { FX.lampPost(g, CX + x - 300, GY - 30, 360, { light: M.practical, on: noite || o.lampOn, a: 0.2 }); FX.tree(g, CX + x + 40, GY - 30, 1.2, shade(M.grass, -0.45)); } });
  return { GY, CX, M };
}
// borda de telhado com cidade lá embaixo
export function telhado(g, t, cam, o = {}) { const M = mood(o.mood || 'dusk'), GY = GYr(), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, CX - 420, GY - 260, 70, '#fff3dc', M.key, 6); FX.clouds(g, { y: GY - 800, h: 220, color: '#ffe7c7', a: 0.14, seed: 2 }); });
  layer(g, cam, 0.25, (g) => FX.skyline(g, { x: -E.W, y: GY + 60, w: E.W * 3, minH: 160, maxH: 520, color: mix(M.sky[1], M.dark, 0.75), windowColor: alpha(M.practical, 0.6), lit: 0.25, seed: 7 }));
  layer(g, cam, 0.9, (g) => { g.fillStyle = shade(M.wall, -0.45); g.fillRect(-E.W, GY, E.W * 3, E.H); g.fillStyle = shade(M.wall, -0.3); g.fillRect(-E.W, GY - 14, E.W * 3, 18); for (let x = -E.W; x < E.W * 2; x += 90) seg(g, [[x, GY - 10], [x, GY - 110]], 6, shade(M.dark, 0.05)); seg(g, [[-E.W, GY - 110], [E.W * 2, GY - 110]], 6, shade(M.dark, 0.05)); });
  return { GY, CX, M }; }
// corredor de mercado; estoque 0..1
export function mercado(g, t, cam, o = {}) { const M = mood('interiorCool'), GY = E.H * 0.86, CX = E.W / 2, est = o.estoque ?? 1;
  layer(g, cam, 0.4, (g) => { backdrop(g, [shade(M.wall, -0.1), shade(M.wall, -0.4)]); for (let i = 0; i < 8; i++) { const y = 40 + i * 6; g.fillStyle = 'rgba(230,240,255,.5)'; rr(g, CX - 400 + i * 20 - 400, y, 1600, 10, 4); g.fill(); } glow(g, CX, 60, 700, '#e6f0ff', 0.25); });
  const cols = ['#c9472f', '#f2c94c', '#3fb950', '#3a6ea5', '#d2728a', '#e8843e', '#f4f0e4'];
  for (const side of [-1, 1]) layer(g, cam, 0.8, (g) => { const r = rng(side + 5); for (let lv = 0; lv < 5; lv++) { const y = GY - 120 - lv * 150; const x0 = side < 0 ? -E.W : CX + 240, x1 = side < 0 ? CX - 240 : E.W * 2; g.fillStyle = '#c8ccd4'; g.fillRect(x0, y, x1 - x0, 14); for (let x = x0; x < x1; x += 46) { if (r() < est) { rr(g, x, y - 90 - r() * 30, 38, 90 + r() * 30, 4); g.fillStyle = cols[Math.floor(r() * cols.length)]; g.fill(); } } } });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY - 200, 0, E.H, ['#9aa2ae', '#5a6270']); poly(g, [[CX - 240, GY - 200], [CX + 240, GY - 200], [E.W * 1.5, E.H + 200], [-E.W * 0.5, E.H + 200]], '#7a828e'); });
  return { GY, CX, M }; }
// chão de jardim visto de pertinho (formiga)
export function jardim(g, t, cam, o = {}) { const M = mood(o.mood || 'golden'), GY = E.H * 0.78, CX = E.W / 2;
  layer(g, cam, 0.15, (g) => { backdrop(g, M.sky); FX.sun(g, CX + 500, GY - 380, 80, '#fff3dc', M.key, 6); });
  layer(g, cam, 0.35, (g) => { const r = rng(4); for (let i = 0; i < 60; i++) { const x = -E.W + r() * E.W * 3, h = 300 + r() * 400; g.fillStyle = alpha(shade(M.grass, -0.3), 0.6); poly(g, [[x, GY], [x + 30, GY], [x + 15 + (r() - 0.5) * 80, GY - h]], alpha(shade(M.grass, -0.35), 0.7)); } });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, E.H, [shade('#6a4a32', -0.1), '#2a1c14']); g.fillRect(-E.W, GY, E.W * 3, E.H); const r = rng(8); for (let i = 0; i < 80; i++) circle(g, -E.W + r() * E.W * 3, GY + 10 + r() * 300, 3 + r() * 10, alpha('#8a6a4a', 0.5)); });
  return { GY, CX, M }; }
