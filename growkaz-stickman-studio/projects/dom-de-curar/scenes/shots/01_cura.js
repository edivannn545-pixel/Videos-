// 01_cura.js — Shorts 9:16. Regra de câmera: começa aberta e aproxima devagar, sem cortar o corpo do personagem.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, linGrad, backdrop, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { sala, cama, mesinha, vaso, quadro } from '../sets/casa.js';
import { rua } from '../sets/rua.js';
import { mao } from '../sets/props.js';
import { VOCE, AVO, MAE, PAI, CRIANCA, DOC, ENF } from '../cast.js';

const CURA = '#7dffa8';
// câmera: aproxima de z0 a z1 ao longo da cena (com leve deriva lateral)
const push = (t, dur, z0 = 1.0, z1 = 1.12, x0 = 0, x1 = 0, y = -170) => { const k = ease.inOut(clamp(t / dur)); return { z: lerp(z0, z1, k), x: lerp(x0, x1, k), y }; };
const brilho = (g, x, y, t, k = 1) => { if (k <= 0) return; glow(g, x, y, 260 * k, CURA, 0.55 * k); FX.rings(g, x, y, t, { count: 3, r0: 30, r1: 320 * k, color: CURA, a: 0.6 * k, speed: 1.3 }); FX.sparkle(g, x + 40, y - 60, 30 * k, '#ffffff', 0.8 * k); FX.sparkle(g, x - 70, y + 20, 22 * k, CURA, 0.8 * k); };
const big = (g, label, value, y, a = 1, color, size = 110) => UI.readout(g, { label, value, x: E.W / 2, y, align: 'center', a, size, color });
const titulo = (g, str, y, a = 1, size = 96, color) => { const s = 0.85 + 0.15 * ease.outBack(clamp(a)); g.save(); g.translate(E.W / 2, y); g.scale(s, s); text(g, str, 0, 0, { size, color: color || S().ui.gold, glow: 26, glowColor: alpha(color || S().ui.gold, 0.7), spacing: 3, alpha: clamp(a) }); g.restore(); };

// hospital: quarto frio com janela, monitor cardíaco
const hospital = (g, t, cam, o = {}) => sala(g, t, cam, { mood: 'interiorCool', parede: '#3e5a6e', noite: o.noite, janela: { x: o.jx ?? 190, w: 300, h: 380 }, fundo: (g, GY, M) => {
  FX.screen(g, { x: E.W / 2 - 430, y: GY - 760, w: 230, h: 160, bg: '#081018', glowC: CURA, a: 0.3 }, (g, x, y, w, h) => { g.strokeStyle = o.monitor || CURA; g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 60; i++) { const u = i / 60, ph = (u * 3 + t * 1.5) % 1; const yy = y + h / 2 - (ph > 0.45 && ph < 0.5 ? 50 : ph > 0.5 && ph < 0.55 ? -30 : 0); i ? g.lineTo(x + u * w, yy) : g.moveTo(x + u * w, yy); } g.stroke(); });
  seg(g, [[E.W / 2 - 520, GY - 260], [E.W / 2 - 520, GY - 900]], 6, '#9aa6b2'); rr(g, E.W / 2 - 560, GY - 880, 70, 110, 14); g.fillStyle = 'rgba(200,230,255,.5)'; g.fill(); } });
// avô na cama, recostado
function avoNaCama(g, x, GY, M, t, o = {}) { cama(g, x - 240, GY, M, { w: 480, cor: '#dfe8f0' }); drawFigure(g, { x: x - 90, y: GY - 120, s: 1.75, facing: 1, outfit: o.outfit || AVO, pose: breathe(POSES.sitBack, t, 0.6), expr: o.expr || 'sad', rim: { color: M.rim, dir: [1, -0.6] }, shadow: false, blink: (t % 3.3) > 3.2 });
  rr(g, x - 110, GY - 175, 350, 60, 20); g.fillStyle = '#b8c8e0'; g.fill(); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(x - 150, GY - 175, 410, 6); }

registerShot('c01', { draw(g, t, info) { const cam = push(t, info.dur, 0.92, 1.0, -40, 20); const { GY, M } = hospital(g, t, cam);
  layer(g, cam, 1, (g) => { avoNaCama(g, E.W / 2 + 140, GY, M, t); const x = lerp(E.W / 2 - 420, E.W / 2 - 300, ease.out(t / info.dur)); drawFigure(g, { x, y: GY, s: 2.0, facing: 1, outfit: VOCE, pose: walkPose(t * 6.28 * 0.9), expr: 'worried', rim: { color: M.rim, dir: [1, -0.6] } }); });
  FX.dust(g, t, { count: 30, color: '#e6f4ff', a: 0.3 });
} });
registerShot('c02', { draw(g, t, info) { blurLayer(g, 14, (g) => hospital(g, t, { z: 1.5, y: -200 })); veil(g, '#08101a', 0.35); const M = mood('interiorCool'); const k = ease.out(prog(t, 0, 0.5)); const z = 1 + 0.06 * t;
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  mao(g, E.W / 2 + 40, E.H * 0.5, 1.5, true, AVO.color, M.rim, { lado: -1 }); mao(g, lerp(E.W * 1.1, E.W / 2 + 90, k), E.H * 0.5 + 40, 1.5, true, VOCE.color, M.rim); g.restore();
} });
registerShot('c03', { draw(g, t, info) { blurLayer(g, 14, (g) => hospital(g, t, { z: 1.4, x: 120, y: -120 })); veil(g, '#08101a', 0.4); const M = mood('interiorCool');
  bigFace(g, E.W / 2, E.H * 0.55, 330 * (1 + 0.05 * t), { outfit: AVO, expr: 'cry', look: [0.3, 0.2], rimColor: M.rim, rimSide: -1 });
} });
registerShot('c04', { draw(g, t, info) { blurLayer(g, 14, (g) => hospital(g, t, { z: 1.4, x: 120, y: -120 })); veil(g, '#08101a', 0.35); const M = mood('interiorCool'); const k = ease.out(prog(t, 0.3, 0.8));
  bigFace(g, E.W / 2, E.H * 0.55, 330 * (1 + 0.05 * t), { outfit: AVO, expr: t < 0.45 ? 'surprised' : 'joy', look: [0, 0], rimColor: CURA, rimSide: -1 });
  brilho(g, E.W / 2, E.H * 0.85, t, k); FX.dust(g, t, { count: 60, color: CURA, a: 0.5 * k, speed: 40 });
} });
registerShot('c05', { draw(g, t, info) { blurLayer(g, 14, (g) => hospital(g, t, { z: 1.5, x: -160, y: -140 })); veil(g, '#08101a', 0.4); const M = mood('interiorCool');
  bigFace(g, E.W / 2, E.H * 0.5, 320 * (1 + 0.06 * t), { outfit: VOCE, expr: 'awe', look: [0, 0.8], rimColor: CURA, rimSide: 1 });
  brilho(g, E.W / 2 - 150, E.H * 0.9, t, 0.8); brilho(g, E.W / 2 + 160, E.H * 0.9, t + 0.3, 0.8);
} });
registerShot('c06', { draw(g, t, info) { const cam = push(t, info.dur, 0.95, 1.08, 0, 20); const { GY, M } = rua(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 1, (g) => { const toque = ease.out(prog(t, 0.6, 1.0)); drawFigure(g, { x: E.W / 2 + 190, y: GY, s: 2.0, facing: -1, pose: breathe(toque > 0.5 ? POSES.cheer : POSES.sad, t, 1, 4), outfit: { top: 'jersey', color: '#c9472f', number: '7' }, expr: toque > 0.5 ? 'joy' : 'sad', rim: { color: M.rim, dir: [-1, -0.5] } });
    drawFigure(g, { x: E.W / 2 - 200, y: GY, s: 2.0, facing: 1, outfit: VOCE, pose: breathe(posesAt(t, [[0, 'stand'], [0.5, 'reach']]), t), expr: 'smile', rim: { color: CURA, dir: [1, -0.5] } }); brilho(g, E.W / 2 + 90, GY - 390, t, toque); });
  titulo(g, 'O DOM DE CURAR', E.H * 0.18, prog(t, 0.2, 0.6));
} });
const casa = (g, t, cam) => sala(g, t, cam, { mood: 'interiorWarm', janela: { x: 0, w: 380, h: 360 }, fundo: (g, GY, M) => { quadro(g, E.W / 2 - 420, GY - 600, 140, 110, '#c9563e', M); vaso(g, E.W / 2 + 400, GY - 70, 1.1); } });
registerShot('c07', { draw(g, t, info) { const cam = push(t, info.dur, 0.88, 0.98, 0, 0); const { GY, M } = casa(g, t, cam);
  layer(g, cam, 1, (g) => { const k1 = ease.out(prog(t, 0.5, 0.9)), k2 = ease.out(prog(t, 1.2, 1.6));
    drawFigure(g, { x: E.W / 2 - 300, y: GY, s: 1.6, facing: 1, outfit: MAE, pose: breathe(k1 > 0.5 ? POSES.cheer : POSES.facepalm, t, 1, 2), expr: k1 > 0.5 ? 'joy' : 'sad', rim: { color: M.rim, dir: [0, -1] } });
    drawFigure(g, { x: E.W / 2 + 300, y: GY, s: 1.6, facing: -1, outfit: PAI, pose: breathe(k2 > 0.5 ? POSES.wave : POSES.crouch, t, 1, 3), expr: k2 > 0.5 ? 'happy' : 'worried', rim: { color: M.rim, dir: [0, -1] } });
    const x = lerp(E.W / 2 - 120, E.W / 2 + 110, ease.inOut(prog(t, 0.9, 1.3))); drawFigure(g, { x, y: GY + 40, s: 1.7, facing: t < 1.0 ? -1 : 1, outfit: VOCE, pose: breathe(POSES.reach, t), expr: 'smile', rim: { color: CURA, dir: [0, -1] } });
    brilho(g, E.W / 2 - 270, GY - 340, t, k1 * (1 - prog(t, 1.4, 2))); brilho(g, E.W / 2 + 270, GY - 260, t, k2); });
  UI.badge(g, { str: 'DIA 1', size: 70, x: E.W - 70, y: 200 });
} });
registerShot('c08', { draw(g, t, info) { const cam = push(t, info.dur, 0.92, 1.05, -80, 60); const { GY, M } = rua(g, t, cam, { mood: 'golden', seed: 5 });
  layer(g, cam, 1, (g) => { FX.door(g, { x: E.W / 2 - 520, y: GY - 30, w: 150, h: 320, color: shade(M.wall, -0.3), open: 0.5, light: M.practical });
    const fila = [{ top: 'tshirt', color: '#c9472f' }, { top: 'dress', color: '#8a5ad6' }, { top: 'suit', color: '#2e3442' }, { top: 'tracksuit', color: '#e8843e' }, { top: 'tshirt', color: '#3a6ea5' }, { top: 'jersey', color: '#f2c21a' }];
    fila.forEach((of, i) => drawFigure(g, { x: E.W / 2 - 300 + i * 125, y: GY - 10 + i * 18, s: 1.25 + i * 0.08, facing: -1, outfit: of, pose: breathe(i % 3 === 0 ? POSES.crossArms : i % 3 === 1 ? POSES.phone : POSES.stand, t, 1, i), expr: i % 2 ? 'worried' : 'neutral', rim: { color: M.rim, dir: [1, -0.4] }, prop: i % 3 === 1 ? 'phone' : null })); });
  UI.badge(g, { str: 'DIA 2', size: 70, x: E.W - 70, y: 200 });
} });
registerShot('c09', { draw(g, t, info) { const cam = push(t, info.dur, 1.2, 0.72, 0, 0, -80); const { GY, M } = rua(g, t, cam, { mood: 'golden', seed: 8 });
  layer(g, cam, 1, (g) => { const r = rng(5); for (let row = 0; row < 3; row++) for (let i = 0; i < 26; i++) { const x = -E.W * 0.6 + i * 95 + row * 40, y = GY - row * 70; drawFigure(g, { x, y, s: 0.75 - row * 0.1, facing: -1, pose: breathe(POSES.stand, t, 1, i + row * 30), expr: 'neutral', rim: { color: M.rim, dir: [1, -0.4] }, dim: row * 0.15 }); } });
  UI.badge(g, { str: 'DIA 3', size: 70, x: E.W - 70, y: 200 }); titulo(g, 'A FILA DOBRA O QUARTEIRÃO', E.H * 0.82, prog(t, 0.6, 1.0), 54, S().ui.cream);
} });
registerShot('c10', { draw(g, t, info) { const M = mood('void'); backdrop(g, M.sky); FX.stars(g, t, { count: 120, area: [0, 0, E.W, E.H] }); const z = 1 + 0.05 * t; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  circle(g, E.W / 2, E.H * 0.55, 330, '#1e3a5a'); glow(g, E.W / 2, E.H * 0.55, 500, '#7fb6ff', 0.25); g.fillStyle = '#2f6a4a'; for (const [a, b, r] of [[-120, -80, 120], [90, 60, 140], [-40, 170, 80]]) { g.beginPath(); g.ellipse(E.W / 2 + a, E.H * 0.55 + b, r, r * 0.7, 0.4, 0, 7); g.fill(); } g.restore();
  const v = Math.round(150000 * ease.out(prog(t, 0.2, 1.3))); big(g, 'TODO DIA', '+' + v.toLocaleString('pt-BR'), E.H * 0.18, 1, S().ui.accent, 120);
} });
registerShot('c11', { draw(g, t, info) { const cam = push(t, info.dur, 1.0, 1.1); const M = mood('storm');
  layer(g, cam, 0.2, (g) => backdrop(g, M.sky)); FX.rain(g, t, { count: 260, a: 0.3 });
  layer(g, cam, 1, (g) => { const GY = E.H * 0.7, r = rng(3); for (let i = 0; i < 40; i++) { const x = (i % 8) * 140 + 60 + (Math.floor(i / 8) % 2) * 70, y = GY - Math.floor(i / 8) * 90, k = prog(t, r() * 2.6, r() * 2.6 + 0.6); drawFigure(g, { x, y, s: 0.7, facing: 1, pose: POSES.stand, expr: 'sad', alpha: 1 - k * 0.85, rim: { color: '#9fb8ff', dir: [0, -1] }, dim: 0.3 }); } });
  big(g, 'PESSOAS MORREM', 'POR DIA', E.H * 0.18, 1, S().ui.cream, 90); FX.fog(g, E.H * 0.6, 400, '#8aa0c8', 0.3);
} });
registerShot('c12', { draw(g, t, info) { const cam = push(t, info.dur, 0.92, 1.02, 40, -40); const { GY, M } = hospital(g, t, cam, { jx: 220 });
  layer(g, cam, 1, (g) => { const ciclo = t % 0.9, k = ease.out(prog(ciclo, 0.2, 0.5)); const n = Math.floor(t / 0.9);
    drawFigure(g, { x: E.W / 2 + 190, y: GY, s: 1.85, facing: -1, outfit: { top: ['tshirt', 'dress', 'suit'][n % 3], color: ['#c9472f', '#8a5ad6', '#e8843e'][n % 3] }, pose: breathe(k > 0.5 ? POSES.cheer : POSES.sad, t, 1, n), expr: k > 0.5 ? 'joy' : 'sad', rim: { color: M.rim, dir: [-1, -0.5] } });
    drawFigure(g, { x: E.W / 2 - 200, y: GY, s: 1.9, facing: 1, outfit: VOCE, pose: breathe(POSES.reach, t), expr: 'determined', rim: { color: CURA, dir: [1, -0.5] } }); brilho(g, E.W / 2 + 90, GY - 380, t, k); });
  FX.clock(g, E.W / 2, E.H * 0.11, 100, t * 8, {}); big(g, '', '1 POR MINUTO', E.H * 0.2, 1, S().ui.gold, 84);
} });
registerShot('c13', { draw(g, t, info) { const cam = push(t, info.dur, 0.95, 1.05); const { GY, M } = hospital(g, t, cam, { noite: true, jx: 0 }); veil(g, '#050810', 0.35);
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2, y: GY, s: 2.1, facing: 1, outfit: VOCE, pose: breathe({ ...POSES.sad, hF: [20, -200], eF: [24, -160] }, t), expr: 'sleepy', rim: { color: M.rim, dir: [0, -1] } }));
  UI.badge(g, { str: '3:00', size: 80, x: E.W - 70, y: 200, color: S().ui.accent });
} });
registerShot('c14', { draw(g, t, info) { UI.blueprint(g); const ui = S().ui; const z = 1 + 0.06 * t; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  for (let i = 0; i < 100; i++) { const c = i % 10, r = Math.floor(i / 10); const x = 120 + c * 93, y = E.H * 0.3 + r * 115; const lit = i === 44 && t > 0.9; UI.lineFigure(g, { x, y: y + 80, s: 0.35, pose: POSES.stand, color: lit ? CURA : alpha(ui.blueprint, 0.45) }); if (lit) glow(g, x, y + 40, 90, CURA, 0.7); } g.restore();
  big(g, 'VOCÊ SALVA', 'MENOS DE 1 EM 100', E.H * 0.16, ease.out(prog(t, 1.6, 2.0)), ui.accent, 80);
} });
registerShot('c15', { draw(g, t, info) { blurLayer(g, 14, (g) => hospital(g, t, { z: 1.4, y: -120 })); veil(g, '#08101a', 0.45); const M = mood('interiorCool');
  bigFace(g, E.W / 2, E.H * 0.52, 330 * (1 + 0.07 * t), { outfit: VOCE, expr: 'scared', look: [Math.sin(t * 3) * 0.6, 0], rimColor: M.rim, rimSide: -1 });
} });
function duasCamas(g, t, cam, escolha = 0) { const { GY, M } = hospital(g, t, cam, { jx: 0, monitor: escolha > 0.5 ? '#ff6a5a' : CURA });
  layer(g, cam, 1, (g) => { const esq = E.W / 2 - 300, dir = E.W / 2 + 300;
    cama(g, esq - 150, GY, M, { w: 330, cor: '#dfe8f0' }); drawFigure(g, { x: esq - 40, y: GY - 115, s: 1.55, facing: 1, outfit: CRIANCA, pose: breathe(escolha > 0.5 ? POSES.cheer : POSES.sitBack, t, 0.6, 1), expr: escolha > 0.5 ? 'joy' : 'sad', rim: { color: M.rim, dir: [1, -0.6] }, shadow: false });
    cama(g, dir - 180, GY, M, { w: 330, cor: '#dfe8f0' }); drawFigure(g, { x: dir + 30, y: GY - 115, s: 1.6, facing: -1, outfit: AVO, pose: breathe(POSES.sitBack, t, 0.6, 2), expr: 'sad', rim: { color: M.rim, dir: [-1, -0.6] }, shadow: false, dim: escolha * 0.5 });
    drawFigure(g, { x: E.W / 2, y: GY + 130, s: 1.9, facing: escolha > 0.3 ? -1 : (Math.sin(t * 2.5) > 0 ? 1 : -1), outfit: VOCE, pose: breathe(escolha > 0.3 ? POSES.reach : POSES.think, t), expr: escolha > 0.3 ? 'determined' : 'confused', rim: { color: CURA, dir: [0, -1] } });
    if (escolha > 0) brilho(g, esq, GY - 300, t, escolha); });
  return { GY, M }; }
registerShot('c16', { draw(g, t, info) { const cam = push(t, info.dur, 0.9, 1.0, -60 * Math.sin(t * 1.2), 0); duasCamas(g, t, cam, 0);
  titulo(g, 'QUEM PRIMEIRO?', E.H * 0.17, prog(t, 0.1, 0.5), 100); for (const [x, ph] of [[E.W * 0.2, 0], [E.W * 0.8, 1.2]]) text(g, '?', x, E.H * 0.36 + Math.sin(t * 4 + ph) * 16, { size: 120, color: S().ui.cream, alpha: 0.8 });
} });
registerShot('c17', { draw(g, t, info) { const cam = push(t, info.dur, 0.92, 1.04, -30, -90); const k = ease.out(prog(t, 0.5, 1.1)); duasCamas(g, t, cam, k); veil(g, '#050810', 0.25 * prog(t, 1.2, 2.5));
  titulo(g, 'CADA SIM É UM NÃO', E.H * 0.17, prog(t, 0.3, 0.7), 80, S().ui.cream);
} });
const clinica = (g, t, cam) => sala(g, t, cam, { mood: 'golden', parede: '#6a5a4a', janela: { x: 0, w: 420, h: 420 }, fundo: (g, GY, M) => { rr(g, E.W / 2 - 480, GY - 640, 200, 90, 10); g.fillStyle = '#e8f0f4'; g.fill(); g.fillStyle = '#3fb950'; g.fillRect(E.W / 2 - 400, GY - 625, 30, 60); g.fillRect(E.W / 2 - 415, GY - 610, 60, 30); } });
registerShot('c18', { draw(g, t, info) { const cam = push(t, info.dur, 0.85, 0.97, 0, 30); const { GY, M } = clinica(g, t, cam);
  layer(g, cam, 1, (g) => { const eq = [[DOC, -330, 'explain'], [ENF, -110, 'wave'], [{ top: 'labcoat', head: 'curly', headColor: '#2a1b18' }, 110, 'cheer'], [{ top: 'labcoat', head: 'bun', headColor: '#d9b65a' }, 330, 'point']];
    eq.forEach(([of, dx, p], i) => { const k = ease.out(prog(t, 0.1 + i * 0.25, 0.5 + i * 0.25)); drawFigure(g, { x: E.W / 2 + dx * 0.95, y: GY + (i % 2) * 50, s: 1.5 + (i % 2) * 0.15, facing: dx < 0 ? 1 : -1, outfit: of, pose: breathe(POSES[p], t, 1, i), expr: 'happy', alpha: k, rim: { color: M.rim, dir: [0, -1] } }); }); });
  titulo(g, 'MAS…', E.H * 0.17, prog(t, 0.0, 0.4), 110); FX.godRays(g, E.W / 2, E.H * 0.25, { color: M.key, a: 0.12 }); FX.dust(g, t, { count: 40, color: '#ffe8c0', a: 0.4 });
} });
function seringa(g, x, y, s, t) { g.save(); g.translate(x, y); g.rotate(-0.5); g.scale(s, s); rr(g, -150, -26, 260, 52, 12); g.fillStyle = 'rgba(220,240,255,.85)'; g.fill(); rr(g, -140, -18, 180, 36, 8); g.fillStyle = CURA; g.fill(); seg(g, [[110, 0], [210, 0]], 6, '#d8dde4'); seg(g, [[-150, 0], [-230, 0]], 18, '#9aa6b2'); seg(g, [[-230, -40], [-230, 40]], 14, '#9aa6b2'); for (let i = 0; i < 5; i++) seg(g, [[-100 + i * 40, -26], [-100 + i * 40, -10]], 3, '#5a6a7a'); glow(g, 0, 0, 200, CURA, 0.35); g.restore(); }
registerShot('c19', { draw(g, t, info) { const cam = push(t, info.dur, 0.9, 1.0); const { GY, M } = clinica(g, t, cam);
  layer(g, cam, 1, (g) => { for (let i = 0; i < 5; i++) { const k = ease.out(prog(t, 0.2 + i * 0.3, 0.5 + i * 0.3)); drawFigure(g, { x: E.W / 2 - 400 + i * 200, y: GY + (i % 2) * 40, s: 1.35, facing: 1, outfit: { top: ['tshirt', 'dress', 'suit', 'tracksuit', 'jersey'][i], color: ['#c9472f', '#8a5ad6', '#2e3442', '#e8843e', '#3a6ea5'][i] }, pose: breathe(k > 0.5 ? { ...POSES.stand, eF: [30, -150], hF: [62, -150] } : POSES.stand, t, 1, i), expr: k > 0.5 ? 'smile' : 'neutral', rim: { color: M.rim, dir: [0, -1] } }); if (k > 0.5) FX.sparkle(g, E.W / 2 - 320 + i * 200, GY - 200, 24, CURA, 0.8); } });
  seringa(g, E.W / 2, E.H * 0.3, 1.2 + 0.05 * t, t); titulo(g, 'VACINAS', E.H * 0.13, prog(t, 0.1, 0.5), 110, CURA);
} });
registerShot('c20', { draw(g, t, info) { const M = mood('void'); backdrop(g, M.sky); FX.stars(g, t, { count: 100, area: [0, 0, E.W, E.H] }); const ui = S().ui;
  const v = Math.round(154 * ease.out(prog(t, 0.2, 1.6))); glow(g, E.W / 2, E.H * 0.45, 600, CURA, 0.18); text(g, 'PELO MENOS', E.W / 2, E.H * 0.3, { size: 54, color: ui.cream, font: FONTS.ui, weight: 900 });
  text(g, v + ' MILHÕES', E.W / 2, E.H * 0.4, { size: 140, color: CURA, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(CURA, 0.6) }); text(g, 'DE VIDAS SALVAS', E.W / 2, E.H * 0.49, { size: 62, color: ui.cream, font: FONTS.ui, weight: 900 });
  const a = ease.out(prog(t, 1.4, 1.9)); text(g, 'EM 50 ANOS', E.W / 2, E.H * 0.62, { size: 96, color: ui.gold, font: FONTS.ui, weight: 900, alpha: a, glow: 20, glowColor: alpha(ui.gold, 0.6) });
  for (let i = 0; i < 40; i++) { const x = (i * 97) % E.W, y = E.H * 0.75 + (i % 4) * 70; const k = prog(t, i * 0.04, i * 0.04 + 0.3); UI.lineFigure(g, { x, y: y + 50, s: 0.28, pose: POSES.cheer, color: alpha(CURA, k * 0.8) }); }
} });
registerShot('c21', { draw(g, t, info) { UI.blueprint(g); const ui = S().ui; const cx = E.W / 2, cy = E.H * 0.33; FX.clock(g, cx, cy, 200, t * 6, {});
  const n = Math.min(6, Math.floor(prog(t, 0.2, 1.6) * 6.99)); for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3, x = cx + Math.cos(a) * 330, y = cy + Math.sin(a) * 330 + 60; UI.lineFigure(g, { x, y, s: 0.5, pose: i < n ? POSES.cheer : POSES.stand, color: i < n ? CURA : alpha(ui.blueprint, 0.4) }); if (i < n) glow(g, x, y - 60, 80, CURA, 0.6); }
  big(g, '', '6 POR MINUTO', E.H * 0.7, ease.out(prog(t, 0.3, 0.7)), CURA, 100); text(g, 'TODO MINUTO, POR 50 ANOS', E.W / 2, E.H * 0.8, { size: 44, color: ui.cream, font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 1.2, 1.6)) });
} });
registerShot('c22', { draw(g, t, info) { blurLayer(g, 14, (g) => hospital(g, t, { z: 1.4, y: -120 })); veil(g, '#08101a', 0.4); const M = mood('interiorCool');
  bigFace(g, E.W / 2, E.H * 0.52, 320 * (1 + 0.08 * t), { outfit: VOCE, expr: 'smile', look: [0, 0], rimColor: CURA, rimSide: -1 });
} });
registerShot('c23', { draw(g, t, info) { const ui = S().ui; g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0a1620', '#10243a', '#163a2a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W / 2, E.H * 0.8, 700, CURA, 0.2);
  const a = ease.out(prog(t, 0.1, 0.6)); text(g, 'E você?', E.W / 2, E.H * 0.2, { size: 90, font: FONTS.serif, weight: 900, italic: true, color: ui.cream, alpha: a }); text(g, 'Quem curaria', E.W / 2, E.H * 0.3, { size: 100, font: FONTS.serif, weight: 900, italic: true, color: CURA, alpha: a, glow: 20, glowColor: alpha(CURA, 0.5) }); text(g, 'primeiro?', E.W / 2, E.H * 0.37, { size: 100, font: FONTS.serif, weight: 900, italic: true, color: CURA, alpha: a, glow: 20, glowColor: alpha(CURA, 0.5) });
  UI.bubble(g, E.W / 2, E.H * 0.47, { w: 150, h: 80 }); text(g, 'COMENTE', E.W / 2, E.H * 0.52, { size: 40, color: ui.cream, font: FONTS.ui, weight: 900, alpha: a });
  const cast = [MAE, AVO, VOCE, CRIANCA, PAI], y0 = E.H * 0.82; cast.forEach((of, i) => { const k = ease.out(prog(t, 0.3 + i * 0.1, 0.7 + i * 0.1)); drawFigure(g, { x: E.W / 2 + (i - 2) * 190, y: y0 + (1 - k) * 40, s: i === 2 ? 1.3 : 1.05, facing: 1, outfit: of, pose: i === 2 ? breathe(POSES.wave, t) : breathe(POSES.relaxed, t, 1, i), expr: 'smile', alpha: k, rim: { color: CURA, dir: [0, -1] } }); });
} });
