// Balões de pensamento e desenhinhos dentro deles.
import * as THREE from 'three';
import { canvasTex } from './motor/char.js';
import { clamp, smooth } from './motor/core.js';

const ICON = {
  pizza: (x) => { x.fillStyle = '#F2C94C'; x.beginPath(); x.moveTo(0, -60); x.lineTo(55, 50); x.lineTo(-55, 50); x.fill(); x.fillStyle = '#C9472F'; [[-10, 0], [15, 25], [-20, 32]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 10, 0, 7); x.fill(); }); x.fillStyle = '#C8813E'; x.fillRect(-58, 44, 116, 14); },
  coracao: (x) => { x.fillStyle = '#E0475A'; x.beginPath(); x.moveTo(0, 50); x.bezierCurveTo(-80, -10, -40, -70, 0, -30); x.bezierCurveTo(40, -70, 80, -10, 0, 50); x.fill(); },
  partido: (x) => { ICON.coracao(x); x.strokeStyle = '#fff'; x.lineWidth = 8; x.beginPath(); x.moveTo(0, -30); x.lineTo(-10, 0); x.lineTo(10, 15); x.lineTo(0, 50); x.stroke(); },
  praia: (x) => { x.fillStyle = '#F2C94C'; x.beginPath(); x.arc(25, -25, 26, 0, 7); x.fill(); x.fillStyle = '#4A9AD0'; x.fillRect(-60, 15, 120, 25); x.fillStyle = '#F2DCA0'; x.fillRect(-60, 38, 120, 18); x.strokeStyle = '#3E7A44'; x.lineWidth = 6; x.beginPath(); x.moveTo(-35, 40); x.quadraticCurveTo(-30, -10, -40, -40); x.stroke(); x.fillStyle = '#55934F'; x.beginPath(); x.ellipse(-40, -42, 30, 10, .3, 0, 7); x.fill(); },
  cama: (x) => { x.fillStyle = '#6E4A32'; x.fillRect(-60, 0, 120, 30); x.fillStyle = '#4A86C7'; x.fillRect(-50, -12, 100, 22); x.fillStyle = '#F6F1E4'; x.fillRect(-55, -26, 34, 18); x.fillStyle = '#2E3648'; x.font = "900 34px Fraunces"; x.fillText('z', 20, -30); x.font = "900 24px Fraunces"; x.fillText('z', 42, -50); },
  dinheiro: (x) => { x.fillStyle = '#7FB58A'; x.fillRect(-60, -30, 120, 60); x.strokeStyle = '#3F7A52'; x.lineWidth = 5; x.strokeRect(-55, -25, 110, 50); x.fillStyle = '#3F7A52'; x.font = "900 36px Fraunces"; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('R$', 0, 2); },
  gato: (x) => { x.fillStyle = '#E8843E'; x.beginPath(); x.arc(0, 5, 40, 0, 7); x.fill(); x.beginPath(); x.moveTo(-36, -10); x.lineTo(-30, -55); x.lineTo(-8, -32); x.fill(); x.beginPath(); x.moveTo(36, -10); x.lineTo(30, -55); x.lineTo(8, -32); x.fill(); x.fillStyle = '#222'; x.beginPath(); x.arc(-14, 0, 5, 0, 7); x.arc(14, 0, 5, 0, 7); x.fill(); },
  carro: (x) => { x.fillStyle = '#C9472F'; x.beginPath(); x.roundRect(-60, -10, 120, 36, 10); x.fill(); x.beginPath(); x.roundRect(-34, -38, 66, 34, 10); x.fill(); x.fillStyle = '#9FC6D8'; x.fillRect(-26, -32, 22, 22); x.fillRect(4, -32, 22, 22); x.fillStyle = '#222'; x.beginPath(); x.arc(-32, 28, 13, 0, 7); x.arc(32, 28, 13, 0, 7); x.fill(); },
  tesoura: (x) => { x.strokeStyle = '#8A8E94'; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(-40, 40); x.lineTo(40, -40); x.moveTo(-40, -40); x.lineTo(40, 40); x.stroke(); x.strokeStyle = '#E0475A'; x.lineWidth = 8; x.beginPath(); x.arc(-44, 44, 14, 0, 7); x.stroke(); x.beginPath(); x.arc(-44, -44, 14, 0, 7); x.stroke(); },
  pasta: (x) => { x.fillStyle = '#6E4A32'; x.beginPath(); x.roundRect(-55, -25, 110, 70, 8); x.fill(); x.strokeStyle = '#6E4A32'; x.lineWidth = 8; x.strokeRect(-18, -42, 36, 18); x.fillStyle = '#E9C94A'; x.fillRect(-8, -2, 16, 12); },
  boleto: (x) => { x.fillStyle = '#F6F1E4'; x.fillRect(-45, -55, 90, 110); x.fillStyle = '#C9472F'; x.fillRect(-45, -55, 90, 22); x.fillStyle = '#2A2A30'; for (let i = 0; i < 16; i++) x.fillRect(-38 + i * 5, 25, i % 3 ? 2 : 4, 24); x.fillStyle = '#8B8578'; for (let i = 0; i < 4; i++) x.fillRect(-36, -24 + i * 11, 60, 5); },
  musica: (x) => { x.fillStyle = '#7A3A6A'; x.beginPath(); x.ellipse(-25, 35, 18, 13, -.3, 0, 7); x.ellipse(28, 25, 18, 13, -.3, 0, 7); x.fill(); x.fillRect(-11, -45, 7, 80); x.fillRect(42, -55, 7, 80); x.fillRect(-11, -55, 60, 14); },
  letraB: (x) => { x.fillStyle = '#3F5688'; x.font = "900 120px Fraunces"; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('B', 0, 8); },
  check: (x) => { x.strokeStyle = '#3F8A52'; x.lineWidth = 18; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(-45, 0); x.lineTo(-12, 35); x.lineTo(50, -40); x.stroke(); },
  frango: (x) => { x.fillStyle = '#C8813E'; x.beginPath(); x.ellipse(-5, 10, 50, 34, 0, 0, 7); x.fill(); x.fillStyle = '#F6F1E4'; x.fillRect(38, -12, 26, 10); x.beginPath(); x.arc(66, -7, 9, 0, 7); x.fill(); },
  interrog: (x) => { x.fillStyle = '#2E3648'; x.font = "900 120px Fraunces"; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('?', 0, 10); },
  raiva: (x) => { x.fillStyle = '#C9472F'; x.font = "900 70px Inter"; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('#@!', 0, 6); },
};
export const ICONES = Object.keys(ICON);

// textura do balão com ícone(s) ou frase manuscrita
export function balaoTex({ icon, icons, texto, cor = '#FFFFFF' }) { return canvasTex(512, 420, (x) => { x.fillStyle = cor; x.strokeStyle = '#2E3648'; x.lineWidth = 8; const puffs = [[256, 170, 150, 110], [130, 170, 80, 70], [380, 170, 80, 70], [200, 90, 80, 60], [320, 95, 80, 60], [200, 245, 80, 55], [320, 245, 80, 55]];
  x.beginPath(); puffs.forEach(([a, b, rx, ry]) => { x.moveTo(a + rx, b); x.ellipse(a, b, rx, ry, 0, 0, 7); }); x.stroke(); x.fill(); x.beginPath(); x.arc(150, 330, 26, 0, 7); x.moveTo(126, 392); x.arc(110, 392, 15, 0, 7); x.stroke(); x.fill();
  x.save(); x.translate(256, 170); if (texto) { x.fillStyle = '#2E3648'; x.font = `700 ${texto.length > 14 ? 64 : 82}px Caveat`; x.textAlign = 'center'; x.textBaseline = 'middle'; const parts = texto.split('|'); parts.forEach((t, i) => x.fillText(t, 0, (i - (parts.length - 1) / 2) * 70)); }
  else if (icons) { icons.forEach((k, i) => { x.save(); x.translate((i - (icons.length - 1) / 2) * 120, 0); x.scale(.85, .85); ICON[k](x); x.restore(); }); }
  else if (icon) { x.scale(1.3, 1.3); ICON[icon](x); } x.restore(); }); }

const cache = {};
export function balao(o, w = .7) { const key = JSON.stringify(o); const t = cache[key] || (cache[key] = balaoTex(o)); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 420 / 512), new THREE.MeshBasicMaterial({ map: t, alphaTest: .5, side: THREE.DoubleSide })); m.renderOrder = 2; return m; }

// anima: pop de escala entre t0 e t0+.18, some em t1; balança suave. Ancorar acima da cabeça.
export function animaBalao(m, u, t0, t1 = 999, cam, base) { const on = u >= t0 && u < t1; m.visible = on; if (!on) return; const k = clamp((u - t0) / .18); const pop = k < 1 ? k * (1.15 - .15 * k) : 1; const out = 1 - smooth(t1 - .15, t1, u); m.scale.setScalar(Math.max(.001, pop * (t1 < 999 ? out : 1))); if (base) m.position.set(base[0], base[1] + Math.sin(u * 2 + base[0]) * .03, base[2]); if (cam) m.quaternion.copy(cam.quaternion); }
