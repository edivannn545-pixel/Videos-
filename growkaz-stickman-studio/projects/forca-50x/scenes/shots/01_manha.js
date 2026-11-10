// 01_manha.js — s001–s009: o despertador, a força nova, a formiga, o preço.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, seg, circle, ring, rr, glow, alpha, shade, linGrad, backdrop, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { sala, cama, mesinha, despertador, quadro, vaso } from '../sets/casa.js';
import { rua, telhado, jardim } from '../sets/rua.js';
import { formiga, folha, carro, mao, capa } from '../sets/props.js';
import { VOCE, AMIGO } from '../cast.js';

const quarto = (g, t, cam, o = {}) => sala(g, t, cam, { mood: o.mood || 'golden', noite: o.noite, janela: { x: -330, w: 520, h: 440 }, persiana: true, fundo: (g, GY, M) => { quadro(g, E.W / 2 + 330, GY - 520, 220, 160, '#3a6ea5', M); vaso(g, E.W / 2 + 760, GY - 70, 1.2); } });
export { quarto };
const deitado = { ...POSES.lie };

// s001 — "Você acorda, desliga o despertador…"
registerShot('s001', { draw(g, t, info) {
  const cam = { z: 1.02 + 0.05 * ease.inOut(t / info.dur), x: 40 * t };
  const { GY, M } = quarto(g, t, cam);
  layer(g, cam, 1, (g) => { const cx = E.W / 2 - 80; cama(g, cx - 120, GY, M, { w: 560, cor: '#4a5a9a' }); const top = mesinha(g, cx + 600, GY, M);
    const sh = shake(t, 6, 18); despertador(g, cx + 600 + sh[0], top + sh[1], 1.3); FX.rings(g, cx + 600, top - 50, t, { count: 3, r0: 40, r1: 150, color: '#ffd27a', a: 0.6 });
    const reach = ease.out(prog(t, 0.9, 1.5)); const p = { ...POSES.sit, eF: [lerp(16, 40, reach), lerp(-110, -150, reach)], hF: [lerp(38, 80, reach), lerp(-84, -150, reach)] };
    drawFigure(g, { x: cx + 330, y: GY, s: 1.35, facing: 1, pose: breathe(p, t), outfit: VOCE, expr: t < 0.9 ? 'sleepy' : 'neutral', rim: { color: M.rim, dir: [-1, -0.3] } }); });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 }); FX.godRays(g, E.W / 2 - 330, GY - 600, { color: M.key, a: 0.12 });
} });

// s002 — "e ele vira pó na sua mão." insert
registerShot('s002', { draw(g, t, info) {
  blurLayer(g, 14, (g) => quarto(g, t, { z: 1.6, x: 300, y: -100 })); veil(g, '#120a10', 0.35);
  const M = mood('golden'), hit = 0.45; const k = ease.out(prog(t, 0, hit)); const q = prog(t, hit, hit + 1.6);
  const [sx, sy] = t > hit ? shake(t, 14 * (1 - prog(t, hit, hit + 0.6)), 30) : [0, 0]; g.save(); g.translate(sx, sy);
  rr(g, E.W * 0.2, E.H * 0.74, E.W * 0.6, 60, 10); g.fillStyle = shade(M.dark, 0.2); g.fill();
  despertador(g, E.W / 2, E.H * 0.74, 3.4, ease.out(q), t);
  mao(g, lerp(E.W * 0.95, E.W * 0.5 + 40, k), lerp(E.H * 0.2, E.H * 0.5, k), 1.6, t > hit, VOCE.color, M.rim);
  g.restore();
  if (t > hit) { FX.rings(g, E.W / 2, E.H * 0.6, t - hit, { count: 3, r0: 60, r1: 500, speed: 1.4, color: '#fff3e0', a: 0.6 * (1 - prog(t, hit, hit + 1.2)) }); FX.dust(g, t, { count: 120, color: '#ffcf9a', a: 0.6 * (1 - prog(t, hit + 0.5, 3)), area: [E.W * 0.3, E.H * 0.4, E.W * 0.4, E.H * 0.4], speed: 40 }); }
} });

// s003 — "Durante a noite, seu corpo mudou." bigFace chocado olhando as mãos
registerShot('s003', { draw(g, t, info) {
  blurLayer(g, 14, (g) => quarto(g, t, { z: 1.4, x: -200, y: -80 })); veil(g, '#120a10', 0.4);
  const M = mood('golden'); const r = V(300, 330) * (1 + 0.04 * t);
  bigFace(g, E.W / 2, E.H * 0.62, r, { outfit: VOCE, expr: t < 1.5 ? 'surprised' : 'shocked', look: [0, 0.6], rimColor: M.rim, rimSide: -1, blink: (t % 3.1) > 3.0 });
  FX.sparkle(g, E.W / 2 - 420, E.H * 0.4, 30 + 10 * Math.sin(t * 5), S().ui.good, 0.7); FX.sparkle(g, E.W / 2 + 440, E.H * 0.3, 24 + 8 * Math.sin(t * 6), S().ui.good, 0.6);
} });

// s004 — "Agora você é cinquenta vezes mais forte..." poder + 50X
registerShot('s004', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.08 * ease.inOut(t / info.dur), y: -10 * t };
  const { GY, M } = quarto(g, t, cam);
  layer(g, cam, 1, (g) => { const x = E.W / 2; glow(g, x, GY - 220, 420 + 40 * Math.sin(t * 4), S().ui.good, 0.35);
    drawFigure(g, { x, y: GY, s: 1.7, facing: 1, outfit: VOCE, pose: breathe(posesAt(t, [[0, 'stand'], [0.6, 'cheer']]), t), expr: t < 0.6 ? 'surprised' : 'joy', rim: { color: S().ui.good, dir: [0, -1], w: 6 } });
    FX.rings(g, x, GY - 200, t, { count: 4, r0: 80, r1: 600, color: S().ui.good, a: 0.4, speed: 1.2 }); });
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.55, count: 50, a: 0.18, color: S().ui.good });
  const a = ease.outBack(prog(t, 0.5, 0.9)); g.save(); g.translate(E.W / 2, E.H * 0.2); g.scale(a, a); text(g, '50X MAIS FORTE', 0, 0, { size: 110, color: S().ui.gold, glow: 30, glowColor: 'rgba(255,200,60,.8)', spacing: 4 }); g.restore();
  FX.dust(g, t, { count: 60, color: '#e8ffd0', a: 0.4 });
} });

// s005 — "Algumas formigas carregam até 50x o próprio peso." macro
registerShot('s005', { draw(g, t, info) {
  const cam = { z: 1.05 + 0.06 * ease.inOut(t / info.dur), x: -60 + 30 * t };
  const { GY, M } = jardim(g, t, cam);
  layer(g, cam, 1, (g) => { const x = E.W * 0.42 + t * 40; formiga(g, x, GY, 2.2, t, { andar: true, rim: M.rim, carga: (g, yb) => folha(g, -10, yb - 110, 1.4, -0.15) }); });
  blurLayer(g, 10, (g) => { for (let i = 0; i < 6; i++) { g.fillStyle = alpha('#2f5a2a', 0.9); g.beginPath(); g.ellipse(E.W * 0.08 + i * 60, E.H * 0.95, 30, 260, -0.2 + i * 0.08, 0, 7); g.fill(); } }, cam, 1.6);
  const a = ease.out(prog(t, 2.0, 2.4)); UI.readout(g, { label: 'CARREGA ATÉ', value: '50x O PESO', x: E.W / 2, y: E.H * 0.16, align: 'center', a, size: 80 });
  FX.dust(g, t, { count: 50, color: '#ffe8c0', a: 0.4 });
} });

// s006 — "Agora, a formiga é você." você erguendo um carro
registerShot('s006', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur), x: -20 * t };
  const { GY, M } = rua(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => { const x = E.W / 2; const up = ease.out(prog(t, 0.1, 0.7)); const p = posesAt(t, [[0, 'crouch'], [0.45, 'cheer']]);
    drawFigure(g, { x: x - 520, y: GY, s: 1.1, facing: 1, outfit: AMIGO, pose: breathe(POSES.handsOnHead, t, 1, 3), expr: 'shocked', rim: { color: M.rim, dir: [1, -0.5] } });
    for (const [dx, s2] of [[460, 1.0], [600, 0.95]]) drawFigure(g, { x: x + dx, y: GY, s: s2, facing: -1, pose: breathe(POSES.handsOnHead, t, 1, dx), expr: 'surprised', rim: { color: M.rim, dir: [1, -0.5] } });
    drawFigure(g, { x, y: GY, s: 1.5, facing: 1, outfit: VOCE, pose: breathe(p, t), expr: t < 0.5 ? 'determined' : 'joy', rim: { color: M.rim, dir: [1, -0.5] } });
    carro(g, x + 10, lerp(GY - 2, GY - 330, up), 1.2, Math.sin(t * 2) * 0.03, '#c9472f'); });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 }); FX.lensStreak(g, E.W * 0.7, E.H * 0.3, E.W * 1.2, '#ffe0b0', 0.15);
} });

// s007 — "Parece o sonho de qualquer um." herói de capa no telhado
registerShot('s007', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur), x: 30 * t };
  const { GY, M } = telhado(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => { const x = E.W / 2 + 120; capa(g, x, GY, 1.6, t, '#c9472f', 1.2); drawFigure(g, { x, y: GY, s: 1.6, facing: 1, outfit: VOCE, pose: breathe({ ...POSES.stand, eF: [24, -132], hF: [6, -110], eB: [-24, -132], hB: [-6, -110] }, t), expr: 'smirk', rim: { color: M.rim, dir: [-1, -0.4] } }); });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
} });

// s008 — "Mas a força tem um preço." bigFace: sorriso vira preocupação
registerShot('s008', { draw(g, t, info) {
  blurLayer(g, 14, (g) => telhado(g, t, { z: 1.5, x: 120, y: -60 }, { mood: 'golden' })); veil(g, '#120a10', 0.35 + 0.25 * prog(t, 0.6, 1.4));
  const M = mood('golden'); bigFace(g, E.W / 2, E.H * 0.62, V(310, 330) * (1 + 0.03 * t), { outfit: VOCE, expr: t < 0.8 ? 'smile' : 'worried', look: [t < 0.8 ? 0 : -0.5, 0.2], rimColor: M.rim, rimSide: -1 });
} });

// s009 — "E esse preço não aparece nos filmes." cinema
registerShot('s009', { draw(g, t, info) {
  const cam = { z: 1.02 + 0.05 * ease.inOut(t / info.dur), x: -20 * t }; const M = mood('night');
  layer(g, cam, 0.4, (g) => { backdrop(g, [shade(M.dark, -0.4), shade(M.dark, -0.6)]); const sx = E.W / 2 - 560, sy = 90, sw = 1120, sh = 520;
    g.fillStyle = linGrad(g, 0, sy, 0, sy + sh, ['#3a6ea5', '#1a2a4a']); g.fillRect(sx, sy, sw, sh); glow(g, E.W / 2, sy + sh / 2, 900, '#9fc6ff', 0.25);
    FX.skyline(g, { x: sx, y: sy + sh, w: sw, minH: 60, maxH: 200, color: '#0c1424', windowColor: alpha('#ffd27a', 0.6), lit: 0.3, seed: 3 });
    const hx = sx + sw * (0.2 + 0.5 * ease.inOut(t / info.dur)), hy = sy + sh * 0.35; capa(g, hx, hy + 120, 0.9, t, '#c9472f', 1.5); drawFigure(g, { x: hx, y: hy + 120, s: 0.9, rot: 0.5, pose: POSES.dive, outfit: { top: 'suit', color: '#2a3a6a' }, expr: 'smirk', shadow: false, rim: { color: '#ffffff', dir: [0, -1] } });
    FX.lightCone(g, E.W / 2, -60, { angle: Math.PI / 2, spread: 0.35, len: 700, color: '#cfe0ff', a: 0.12 }); });
  layer(g, cam, 1, (g) => { const GY = E.H * 0.98; for (let i = -6; i <= 6; i++) { const x = E.W / 2 + i * 150, s = 1.1; if (i === 1) drawFigure(g, { x, y: GY + 40, s: 1.7, facing: -1, outfit: VOCE, pose: POSES.sit, expr: 'worried', rim: { color: '#9fc6ff', dir: [0, -1] }, shadow: false }); else circle(g, x, GY - 210 * s, 26 * s * 1.25, S().ink); rr(g, x - 70, GY - 150, 140, 160, 20); g.fillStyle = '#4a1a24'; g.fill(); } });
} });
