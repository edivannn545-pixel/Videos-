// 03_pulo.js — s024–s041: o pulo, a queda, os tendões.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, linGrad, backdrop, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { sala } from '../sets/casa.js';
import { rua, telhado } from '../sets/rua.js';
import { cratera, pedrinhas } from '../sets/props.js';
import { banheiro } from './02_casa.js';
import { VOCE, DOC } from '../cast.js';

const big = (g, label, value, x, y, a = 1, color) => UI.readout(g, { label, value, x, y, align: 'center', a, size: 92, color });
const ceu = (g, t, cam, o = {}) => { const M = mood(o.mood || 'golden'), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, CX + 500, E.H * 0.45, 70, '#fff3dc', M.key, 6); FX.clouds(g, { y: E.H * 0.1, h: 260, color: '#ffffff', a: 0.16, seed: 4 }); });
  layer(g, cam, 0.3, (g) => FX.skyline(g, { x: -E.W, y: E.H * 1.02 + (o.chao || 0), w: E.W * 3, minH: 120, maxH: 380, color: mix2(M), windowColor: alpha(M.practical, 0.6), lit: 0.2, seed: 6 }));
  return { M, CX }; };
const mix2 = (M) => shade(M.dark, 0.15);

registerShot('s024', { draw(g, t, info) { const cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur), x: -20 * t };
  const { GY, M } = rua(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2, y: GY, s: 1.4, facing: 1, outfit: VOCE, pose: breathe(posesAt(t, [[0, 'stand'], [1.4, 'crouch']]), t), expr: t < 1.4 ? 'smirk' : 'determined', rim: { color: M.rim, dir: [1, -0.5] } }));
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
} });
registerShot('s025', { draw(g, t, info) { const cam = { z: 1.0, x: 0, y: -ease.in(prog(t, 0.2, 2.0)) * 500 };
  const { GY, M } = rua(g, t, cam, { mood: 'golden' }); const up = ease.in(prog(t, 0.2, 1.6));
  layer(g, cam, 1, (g) => { cratera(g, E.W / 2, GY, 110, ease.out(prog(t, 0.2, 0.4))); const y = GY - up * 1600;
    drawFigure(g, { x: E.W / 2, y, s: 1.4, facing: 1, outfit: VOCE, pose: t < 0.2 ? POSES.crouch : POSES.jump, expr: 'joy', rim: { color: M.rim, dir: [1, -0.5] }, trail: t > 0.2 ? { count: 5, dx: 0, dy: 60, a: 0.3 } : null, shadow: t < 0.25 });
    if (t > 0.2) { FX.rings(g, E.W / 2, GY, t - 0.2, { count: 2, r0: 60, r1: 500, color: '#ffe8c0', a: 0.6 * (1 - prog(t, 0.2, 1)) }); pedrinhas(g, E.W / 2, GY, t - 0.2, { n: 30 }); } });
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.2, count: 50, a: 0.3 * prog(t, 0.3, 0.8) });
} });
registerShot('s026', { draw(g, t, info) { UI.blueprint(g); const ui = S().ui; const GY = E.H * 0.82, h = 40 * 3.2 * Math.max(0, Math.sin(Math.min(1, prog(t, 0.5, 1.6)) * Math.PI));
  seg(g, [[E.W * 0.2, GY], [E.W * 0.8, GY]], 3, UI.bpStroke()); UI.lineFigure(g, { x: E.W / 2, y: GY - h, s: 2.4, pose: h > 5 ? POSES.jump : POSES.stand, color: alpha(ui.blueprint, 0.95) });
  UI.dimension(g, t, { x1: E.W / 2 + 160, y1: GY, x2: E.W / 2 + 160, y2: GY - 128, str: '40 cm', start: 1.2 });
  big(g, 'PESSOA COMUM:', '40 CM', E.W / 2, E.H * 0.16, ease.out(prog(t, 0.2, 0.5)));
} });
registerShot('s027', { draw(g, t, info) { UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(); const GY = E.H * 0.94, fh = 72, X = E.W * 0.6;
  for (let i = 0; i < 10; i++) { g.strokeStyle = c; g.lineWidth = 3; g.strokeRect(X - 140, GY - (i + 1) * fh, 280, fh); for (let k = 0; k < 3; k++) g.strokeRect(X - 110 + k * 80, GY - (i + 1) * fh + 20, 40, 40); }
  const k = ease.out(prog(t, 0.4, 2.6)), y = GY - k * 10.4 * fh; UI.lineFigure(g, { x: E.W * 0.4, y: Math.max(y, 300), s: 0.95, pose: POSES.jump, color: ui.good }); for (let i = 1; i <= 4; i++) seg(g, [[E.W * 0.36, y + i * 30], [E.W * 0.36, y + i * 30 + 20]], 3, alpha(ui.good, 0.5 - i * 0.1));
  const andares = Math.min(10, Math.floor(k * 10.4)); text(g, andares + (andares === 1 ? ' ANDAR' : ' ANDARES'), E.W * 0.2, E.H * 0.2, { size: 80, color: ui.gold, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(ui.gold, 0.6) });
  UI.badge(g, { str: '50x FORÇA', a: 1 });
} });
registerShot('s028', { kind: '3d',
  init(T) { const M = mood('golden'); const st = T.stage({ mood: 'golden', fov: 38, fog: [30, 140], keyPos: [-20, 30, 10], keyIntensity: 2.6, ambient: 1.2 });
    st.add(T.ground(300, 300, M.road, T.tiles(M.road, 30, [30, 30])));
    let s = 3; for (let ix = -6; ix <= 6; ix++) for (let iz = -6; iz <= 2; iz++) { if (Math.abs(ix) < 1) continue; const h = 6 + ((ix * 7 + iz * 13 + 40) % 9) * 2.2; const b = T.building(7, h, 7, { color: ['#5a3a34', '#4a3646', '#3d3360', '#6b4a3a'][(ix + iz + 8) % 4], win: M.practical, lit: 0.3, seed: s++ }); b.position.set(ix * 11, 0, iz * 11); st.add(b); }
    for (let i = -8; i <= 8; i++) st.add(T.tree3D(4, i * 9, 1.1, '#2a3a2a'), T.tree3D(-4, i * 9 + 4, 1.1, '#2a3a2a'));
    const voce = T.figure3D(VOCE, { rim: M.rim, pose: POSES.jump }); voce.position.set(0, 30, 0); voce.scale.setScalar(1.6); st.add(voce);
    return { stage: st, voce }; },
  draw(s, t, info, T) { s.voce.position.y = 30 + Math.sin(t * 1.2) * 0.3; T.orbit(s.stage.camera, t, { target: [0, 31, 0], radius: 9, height: [33, 34.5], from: -0.9, to: 0.6, dur: info.dur }); },
  overlay(g, t, info) { UI.badge(g, { str: '10 ANDARES', a: ease.out(prog(t, 0.3, 0.7)) }); FX.dust(g, t, { count: 30, color: '#ffe8c0', a: 0.3 }); } });
registerShot('s029', { draw(g, t, info) { const cam = { z: 1.0 + 0.04 * t, x: 20 * t }; const { M } = ceu(g, t, cam, { chao: 120 });
  layer(g, cam, 0.6, (g) => FX.skyline(g, { x: -E.W, y: E.H * 1.05, w: E.W * 3, minH: 80, maxH: 260, color: shade(M.dark, 0.05), windowColor: alpha(M.practical, 0.7), lit: 0.3, seed: 11 }));
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.5, y: E.H * 0.5, s: 1.0, facing: 1, outfit: VOCE, pose: { ...POSES.jump }, expr: 'awe', rim: { color: M.rim, dir: [1, -0.3] }, shadow: false }));
  FX.lensStreak(g, E.W / 2 + 500, E.H * 0.45, E.W * 1.2, '#ffe0b0', 0.2); FX.dust(g, t, { count: 30, color: '#ffffff', a: 0.25 });
} });
registerShot('s030', { draw(g, t, info) { blurLayer(g, 12, (g) => ceu(g, t, { z: 1.2, x: 100 })); veil(g, '#120a10', 0.2); const M = mood('golden');
  bigFace(g, E.W / 2, E.H * 0.6, V(300, 320) * (1 + 0.04 * t), { outfit: VOCE, expr: t < 1.0 ? 'joy' : 'scared', look: [0, t < 1.0 ? -0.4 : 0.8], rimColor: M.rim, rimSide: 1, tilt: Math.sin(t) * 0.05 });
} });
registerShot('s031', { draw(g, t, info) { const cam = { z: 1.0, y: t * 300 }; const { M } = ceu(g, t, cam, { chao: -200 + t * 300 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2, y: E.H * 0.5 + t * 300, s: 1.3, facing: 1, rot: Math.PI + Math.sin(t * 4) * 0.3, outfit: VOCE, pose: POSES.fall, expr: 'scared', rim: { color: M.rim, dir: [1, -0.3] }, shadow: false, trail: { count: 5, dx: 0, dy: -70, a: 0.3 } }));
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.5, count: 70, a: 0.35 });
} });
registerShot('s032', { draw(g, t, info) { const hit = 4.4; const f = prog(t, 0, hit); const cam = { z: 1.0 + 0.1 * f, y: 0 };
  if (t < hit) { const { M } = ceu(g, t, cam, { chao: -300 + ease.in(f) * 500 }); layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2, y: E.H * 0.55, s: 1.3, facing: 1, rot: Math.PI + Math.sin(t * 5) * 0.4, outfit: VOCE, pose: POSES.fall, expr: 'scared', rim: { color: M.rim, dir: [1, -0.3] }, shadow: false, trail: { count: 5, dx: 0, dy: -70, a: 0.3 } })); FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.5, count: 80, a: 0.35 });
    const v = Math.round(98 * ease.out(prog(t, 0.3, 3.6))); UI.meter(g, t, { x: E.W * 0.2, y: E.H * 0.86, w: E.W * 0.6, label: 'VELOCIDADE', start: 0.3, speed: 0.25 }); big(g, '', v + ' KM/H', E.W / 2, E.H * 0.16, 1, S().ui.accent); }
  else { const { GY, M } = rua(g, t, { z: 1.1 }, { mood: 'golden' }); const [sx, sy] = shake(t, 30 * (1 - prog(t, hit, hit + 0.6)), 30); g.save(); g.translate(sx, sy); cratera(g, E.W / 2, GY, 260, 1); drawFigure(g, { x: E.W / 2, y: GY + 10, s: 1.4, facing: 1, pose: POSES.crouch, outfit: VOCE, expr: 'shocked', rim: { color: M.rim, dir: [1, -0.5] } }); pedrinhas(g, E.W / 2, GY, t - hit, { n: 50 }); g.restore(); g.fillStyle = `rgba(255,255,255,${1 - prog(t, hit, hit + 0.25)})`; g.fillRect(0, 0, E.W, E.H); }
} });
registerShot('s033', { draw(g, t, info) { const cam = { z: 1.05 + 0.04 * ease.inOut(t / info.dur), x: 20 * t };
  const { GY, M } = rua(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => { cratera(g, E.W / 2, GY, 260, 1); drawFigure(g, { x: E.W / 2, y: GY + 10, s: 1.4, facing: 1, pose: breathe(POSES.sitBack, t), outfit: VOCE, expr: t < 1.5 ? 'confused' : 'worried', rim: { color: M.rim, dir: [1, -0.5] }, shadow: false });
    for (const [dx, f] of [[-560, 1], [520, -1], [640, -1]]) drawFigure(g, { x: E.W / 2 + dx, y: GY, s: 1.0, facing: f, pose: breathe(POSES.handsOnHead, t, 1, dx), expr: 'shocked', rim: { color: M.rim, dir: [1, -0.5] } }); });
  FX.fog(g, E.H * 0.6, 300, '#c8a080', 0.3 * (1 - t / info.dur)); FX.dust(g, t, { count: 80, color: '#d8b890', a: 0.4, speed: 6 });
} });
// laboratório
export const lab = (g, t, cam) => sala(g, t, cam, { mood: 'interiorCool', parede: '#3a4a6a', janela: false, fundo: (g, GY, M) => { FX.screen(g, { x: E.W / 2 + 120, y: GY - 700, w: 520, h: 420, bg: '#0e1a2a', glowC: '#9fd8ff', a: 0.35 }, (g, x, y, w, h) => { UI.lineFigure(g, { x: x + w / 2, y: y + h - 30, s: 1.4, pose: POSES.stand, color: '#cfeaff' }); }); for (let i = 0; i < 4; i++) { rr(g, E.W / 2 - 820 + i * 90, GY - 520, 60, 200, 6); g.fillStyle = ['#3fb950', '#3a6ea5', '#f2c94c', '#c9472f'][i]; g.fill(); } } });
registerShot('s034', { draw(g, t, info) { const cam = { z: 1.0 + 0.05 * ease.inOut(t / info.dur), x: -20 * t }; const { GY, M } = lab(g, t, cam);
  layer(g, cam, 1, (g) => { rr(g, E.W / 2 - 620, GY - 160, 420, 40, 10); g.fillStyle = '#d8dde4'; g.fill(); drawFigure(g, { x: E.W / 2 - 420, y: GY, s: 1.4, facing: 1, outfit: VOCE, pose: breathe(POSES.sit, t), expr: 'worried', rim: { color: M.rim, dir: [1, -1] }, shadow: false });
    drawFigure(g, { x: E.W / 2 - 60, y: GY, s: 1.45, facing: 1, outfit: DOC, pose: breathe(posesAt(t, [[0, 'stand'], [0.6, 'point']]), t, 1, 2), expr: 'thinking', rim: { color: M.rim, dir: [1, -1] } }); });
  FX.dust(g, t, { count: 30, color: '#cfeaff', a: 0.3 });
} });
// perna em planta: músculo (dourado), osso e tendão (azul). força 0..1, alerta 0..1
function perna(g, x, y, s, forca, alerta, t) { const ui = S().ui, c = UI.bpStroke(); g.save(); g.translate(x, y); g.scale(s, s);
  const osso = (x0, y0, x1, y1, w) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.strokeStyle = ui.bpBg; g.lineWidth = w - 8; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
  osso(-10, -560, 0, -300, 46); osso(0, -280, 10, -40, 40); g.strokeStyle = c; g.lineWidth = 4; g.beginPath(); g.arc(0, -290, 30, 0, 7); g.stroke();
  g.beginPath(); g.moveTo(-10, -20); g.lineTo(-40, 10); g.lineTo(180, 20); g.lineTo(150, -20); g.closePath(); g.stroke();
  const mw = 36 + 70 * forca; g.fillStyle = alpha(ui.gold, 0.25 + 0.45 * forca); g.beginPath(); g.ellipse(-50 - forca * 20, -200, mw, 110 + 20 * forca, 0.08, 0, 7); g.fill(); g.strokeStyle = ui.gold; g.lineWidth = 4; g.stroke();
  g.fillStyle = alpha(ui.gold, 0.2 + 0.4 * forca); g.beginPath(); g.ellipse(-20, -450, mw * 0.9, 100, 0, 0, 7); g.fill(); g.stroke();
  const tc = alerta > 0 ? (Math.floor(t * 8) % 2 ? ui.accent : '#ffffff') : ui.blueprint; const stretch = alerta * 8 * Math.sin(t * 30); seg(g, [[-50 - forca * 20, -90], [-40 + stretch, -10]], 10 + 6 * alerta, tc); g.restore(); }
registerShot('s035', { draw(g, t, info) { UI.blueprint(g); const f = ease.out(prog(t, 0.2, 1.0)); perna(g, E.W / 2, E.H * 0.95, 1.45, f, 0, t);
  UI.callout(g, t, { at: [E.W / 2 + 40, E.H * 0.5], to: [E.W / 2 + 420, E.H * 0.3], str: 'MÚSCULO 50x', start: 0.2, color: S().ui.gold });
  UI.callout(g, t, { at: [E.W / 2 + 10, E.H * 0.72], to: [E.W / 2 - 520, E.H * 0.6], str: 'OSSO E TENDÃO: IGUAIS', start: 1.0, color: S().ui.blueprint });
} });
registerShot('s036', { draw(g, t, info) { UI.blueprint(g); perna(g, E.W / 2 - 100, E.H * 0.97, 1.6 + 0.05 * t, 0.3, 0, t);
  UI.callout(g, t, { at: [E.W / 2 - 170, E.H * 0.85], to: [E.W / 2 + 280, E.H * 0.55], str: 'TENDÃO DE AQUILES', start: 0.4, color: S().ui.gold });
  text(g, 'O MAIS FORTE DO CORPO', E.W / 2 + 280, E.H * 0.62, { size: 34, color: S().ui.cream, font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 1.4, 1.8)) });
} });
registerShot('s037', { draw(g, t, info) { UI.blueprint(g); const ui = S().ui; const GY = E.H * 0.8; seg(g, [[0, GY], [E.W, GY]], 3, UI.bpStroke());
  UI.lineFigure(g, { x: E.W * 0.3 + ((t * 300) % 400), y: GY, s: 2.0, pose: walkPose(t * 6.28 * 1.6, { run: true }), color: alpha(ui.blueprint, 0.95) });
  big(g, 'CORRENDO:', '12x O PESO', E.W * 0.62, E.H * 0.3, ease.out(prog(t, 0.6, 1.0)));
} });
registerShot('s038', { draw(g, t, info) { UI.blueprint(g); const ui = S().ui; const v = lerp(12, 50, ease.inOut(prog(t, 0.4, 3.2))); const al = prog(t, 2.6, 3.2);
  perna(g, E.W * 0.3, E.H * 0.97, 1.5, v / 50, al, t);
  const cx = E.W * 0.68, cy = E.H * 0.55, R = 220; g.strokeStyle = UI.bpStroke(); g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, R, Math.PI, Math.PI * 2); g.stroke(); g.strokeStyle = ui.accent; g.lineWidth = 16; g.beginPath(); g.arc(cx, cy, R, Math.PI + Math.PI * (14 / 50), Math.PI * 2); g.stroke();
  const a = Math.PI + Math.PI * (v / 50); seg(g, [[cx, cy], [cx + Math.cos(a) * (R - 20), cy + Math.sin(a) * (R - 20)]], 8, ui.gold); circle(g, cx, cy, 14, ui.gold);
  text(g, 'LIMITE', cx + R * Math.cos(Math.PI * 1.28) - 20, cy - R - 30, { size: 34, color: ui.accent, font: FONTS.ui, weight: 900 });
  big(g, 'FORÇA NO TENDÃO:', Math.round(v) + 'x', cx, E.H * 0.8, 1, v > 14 ? ui.accent : ui.gold);
  if (al > 0) { const [sx, sy] = shake(t, 6); g.save(); g.translate(sx, sy); UI.badge(g, { str: 'PERIGO', color: ui.accent }); g.restore(); }
} });
registerShot('s039', { draw(g, t, info) { const cam = { z: 1.2 + 0.05 * ease.inOut(t / info.dur), x: -120, y: -100 };
  const { GY, M } = banheiro(g, t, cam, { mood: 'night', reflexo: (g) => drawFigure(g, { x: E.W / 2 + 40, y: E.H * 0.8 - 300, s: 1.1, facing: -1, outfit: VOCE, pose: POSES.stand, expr: 'angry', shadow: false }) });
  veil(g, '#0a0e20', 0.3); layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - 300, y: GY, s: 1.6, facing: 1, outfit: VOCE, pose: breathe(POSES.stand, t), expr: 'worried', rim: { color: '#9fc6ff', dir: [1, -1] } }));
} });
registerShot('s040', { draw(g, t, info) { blurLayer(g, 14, (g) => banheiro(g, t, { z: 1.4, y: -100 }, { mood: 'night' })); veil(g, '#0a0e20', 0.5);
  bigFace(g, E.W / 2, E.H * 0.62, V(320, 340) * (1 + 0.06 * t), { outfit: VOCE, expr: 'angry', look: [0, 0], rimColor: '#ff6a5a', rimSide: 1 }); glow(g, E.W / 2, E.H * 0.6, 700, '#ff3a2a', 0.12);
} });
registerShot('s041', { draw(g, t, info) { const cam = { z: 1.2 + 0.06 * ease.inOut(t / info.dur), x: 200, y: -150 }; const { GY, M } = lab(g, t, cam);
  layer(g, cam, 0.5, (g) => { const k = prog(t, 0.9, 2.0); g.strokeStyle = S().ui.accent; g.lineWidth = 5; const x0 = E.W / 2 + 380, y0 = GY - 560; for (let i = 0; i < 6 * k; i++) { g.beginPath(); g.moveTo(x0, y0 + i * 30); g.lineTo(x0 + 40 * Math.sin(i * 2), y0 + i * 30 + 40); g.lineTo(x0 - 20, y0 + i * 30 + 70); g.stroke(); } });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - 100, y: GY, s: 1.5, facing: 1, outfit: DOC, pose: breathe(POSES.point, t, 1, 2), expr: 'worried', rim: { color: M.rim, dir: [1, -1] } }));
  FX.dust(g, t, { count: 30, color: '#cfeaff', a: 0.3 });
} });
