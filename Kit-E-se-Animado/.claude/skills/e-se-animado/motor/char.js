// Personagem em recorte vetorial com rig, no estilo da referência: contorno creme, halo, mangas segmentadas, luvas com dedos.
import * as THREE from 'three';
const PX = 1 / 420; // px de arte → unidade do mundo (altura ~1.75)
const cache = new Map();
function tex(key, w, h, draw) {
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas'); c.width = w * 2; c.height = h * 2; const x = c.getContext('2d'); x.scale(2, 2); x.lineJoin = 'round'; x.lineCap = 'round'; draw(x, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.generateMipmaps = true; t.premultiplyAlpha = false; cache.set(key, t); return t;
}
const P = (s) => new Path2D(s);
function outlined(x, shape, fill) { x.save(); x.fillStyle = fill; x.fill(shape); x.restore(); }
function grad(x, x0, y0, x1, y1, ...st) { const g = x.createLinearGradient(x0, y0, x1, y1); st.forEach((c, i) => g.addColorStop(i / (st.length - 1), c)); return g; }
export const OUT = {
  hero: { a: '#43C4B4', b: '#27998C', c: '#1F7C72', s: '#6FDCCB', kind: 'hoodie', cuff: '#2A9F93' },
  jaleco: { a: '#F6F4EE', b: '#D9D6CE', c: '#B9B6AE', s: '#FFFFFF', kind: 'coat', cuff: '#E9E6DE', pants: '#2E3648' },
  terno2: { a: '#3C4C72', b: '#2A3756', c: '#1E2842', s: '#6D80A8', kind: 'suit', cuff: '#F2EFE8' },
  terno3: { a: '#6A3A44', b: '#4C2830', c: '#381D23', s: '#8F5A66', kind: 'suit', cuff: '#F2EFE8' },
  avental: { a: '#D2483A', b: '#AE3429', c: '#8A261D', s: '#EF7E70', kind: 'hoodie', cuff: '#8A261D' },
  terno: { a: '#2E3442', b: '#1C2029', c: '#14171e', s: '#566072', kind: 'suit', cuff: '#F2EFE8' },
  rosa: { a: '#F08AA0', b: '#D66A86', c: '#B44F6C', s: '#F9B6C4', kind: 'dress', cuff: '#111', belt: '#EFC04F', flora: '#FFF3DA' },
  amarelo: { a: '#F7CC58', b: '#E3A92F', c: '#C78F22', s: '#FFE596', kind: 'blouse', cuff: '#111', pants: '#59607a' },
  verde: { a: '#8EAE86', b: '#6F9068', c: '#58744f', s: '#B6CFAE', kind: 'dress', cuff: '#111', belt: '#EFC04F', flora: '#FFF8E6' },
  azul: { a: '#6F97C4', b: '#4C729F', c: '#3A5A82', s: '#A3C2E0', kind: 'blouse', cuff: '#111', pants: '#3a3f55' },
  laranja: { a: '#F2A766', b: '#DD8A45', c: '#BC6F2E', s: '#FBCB9B', kind: 'hoodie', cuff: '#BC6F2E' },
  roxo: { a: '#A98AD0', b: '#8667B0', c: '#6D5093', s: '#CDB6E6', kind: 'dress', cuff: '#111', belt: '#F2F0E6', flora: '#F6E4FF' },
};
function torsoTex(o, name) { return tex('torso_' + name, 300, 320, (x) => { x.translate(150, 20);
  if (o.kind === 'hoodie') {
    const body = P('M-92 34 Q-60 2 0 -2 Q60 2 92 34 Q106 130 104 262 L-104 262 Q-106 130 -92 34Z');
    outlined(x, body, grad(x, -100, 0, 100, 260, o.a, o.b));
    x.fillStyle = o.c; x.globalAlpha = .30; x.fill(P('M60 20 Q100 40 104 262 L52 262 Q70 150 60 20Z')); x.globalAlpha = 1;
    x.fillStyle = o.b; x.fill(P('M-70 26 Q0 92 70 26 Q84 44 72 70 Q0 118 -72 70 Q-84 44 -70 26Z'));
    x.fillStyle = o.c; x.fill(P('M-44 22 Q0 -4 44 22 Q30 62 0 66 Q-30 62 -44 22Z'));
    x.strokeStyle = '#F4F4EE'; x.lineWidth = 5; x.beginPath(); x.moveTo(-18, 66); x.lineTo(-20, 126); x.moveTo(18, 66); x.lineTo(20, 126); x.stroke();
    x.fillStyle = '#F4F4EE'; x.beginPath(); x.arc(-20, 130, 4.5, 0, 7); x.arc(20, 130, 4.5, 0, 7); x.fill();
    x.fillStyle = o.b; x.strokeStyle = o.c; x.lineWidth = 3.5; const p = P('M-62 164 L62 164 L78 240 L-78 240Z'); x.fill(p); x.stroke(p);
    x.fillStyle = o.c; x.fillRect(-104, 240, 208, 24); x.strokeStyle = o.b; x.lineWidth = 2.5; for (let i = -100; i < 104; i += 10) { x.beginPath(); x.moveTo(i, 242); x.lineTo(i, 263); x.stroke(); }
  } else if (o.kind === 'suit') {
    outlined(x, P('M-92 26 Q-46 4 0 4 Q46 4 92 26 Q104 130 100 280 L-100 280 Q-104 130 -92 26Z'), grad(x, -100, 0, 100, 280, o.a, o.b));
    x.strokeStyle = '#ffffff10'; x.lineWidth = 2; for (let i = -92; i < 96; i += 13) { x.beginPath(); x.moveTo(i, 30); x.lineTo(i, 280); x.stroke(); }
    x.fillStyle = '#F4F2EA'; x.fill(P('M-34 6 L34 6 L10 138 L-10 138Z'));
    x.fillStyle = '#39AE9F'; x.fill(P('M-13 16 L13 16 L8 30 L18 116 L0 138 L-18 116 L-8 30Z')); x.strokeStyle = '#8FDCCF'; x.lineWidth = 2; for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-10, 52 + i * 20); x.lineTo(10, 44 + i * 20); x.stroke(); }
    x.fillStyle = o.c; x.fill(P('M-34 6 L-58 22 L-46 66 L-8 146 L-12 150 L-34 6Z')); x.fill(P('M34 6 L58 22 L46 66 L8 146 L12 150 L34 6Z'));
    x.fillStyle = '#39AE9F'; x.fill(P('M-70 86 L-34 86 L-46 70 L-58 70Z')); x.fillStyle = '#0d0f14'; x.beginPath(); x.arc(0, 176, 7, 0, 7); x.arc(0, 216, 7, 0, 7); x.fill();
  } else if (o.kind === 'coat') {
    outlined(x, P('M-88 26 Q-44 4 0 4 Q44 4 88 26 Q100 150 104 292 L-104 292 Q-100 150 -88 26Z'), grad(x, -100, 0, 100, 290, o.a, o.b));
    x.fillStyle = '#39AE9F'; x.fill(P('M-30 6 L30 6 L12 118 L-12 118Z')); x.fillStyle = '#20273a'; x.fillRect(-13, 16, 26, 100); x.fillStyle = o.c; x.fill(P('M-30 6 L-54 24 L-30 78 L-6 128 L-12 134Z')); x.fill(P('M30 6 L54 24 L30 78 L6 128 L12 134Z'));
    x.strokeStyle = o.c; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 130); x.lineTo(0, 292); x.stroke(); x.strokeRect(-76, 188, 54, 46); x.strokeRect(22, 188, 54, 46); x.fillStyle = '#3F6FB0'; x.fillRect(44, 182, 5, 26); x.fillStyle = '#C9361F'; x.fillRect(56, 182, 5, 22);
  } else if (o.kind === 'dress') {
    outlined(x, P('M-62 14 Q-30 26 0 26 Q30 26 62 14 Q78 40 58 96 L54 118 L-54 118 L-58 96 Q-78 40 -62 14Z'), grad(x, -60, 0, 60, 120, o.a, o.b));
    outlined(x, P('M-52 118 L52 118 Q90 190 116 292 Q0 312 -116 292 Q-90 190 -52 118Z'), grad(x, -100, 120, 100, 300, o.a, o.b));
    x.fillStyle = o.belt; x.fillRect(-58, 104, 116, 20);
    let s = 7; const R = () => (s = (s * 16807) % 2147483647) / 2147483647;
    x.fillStyle = o.flora; for (let i = 0; i < 34; i++) { const yy = 34 + R() * 250, wd = yy < 118 ? 52 : 52 + (yy - 118) * .36, xx = (R() * 2 - 1) * wd; if (yy > 100 && yy < 128) continue; for (let k = 0; k < 5; k++) { x.beginPath(); x.arc(xx + Math.cos(k * 1.256) * 5, yy + Math.sin(k * 1.256) * 5, 3.2, 0, 7); x.fill(); } }
  } else {
    outlined(x, P('M-74 18 Q-30 30 0 30 Q30 30 74 18 Q88 110 74 196 L-74 196 Q-88 110 -74 18Z'), grad(x, -70, 0, 70, 200, o.a, o.b));
    x.fillStyle = '#0a0a12'; x.fill(P('M-22 26 L22 26 L0 64Z')); outlined(x, P('M-68 196 L68 196 L74 276 L-74 276Z'), o.pants || '#555', null);
    x.fillStyle = o.belt || o.c; x.fillRect(-70, 192, 140, 12);
  }
}); }
function sleeveTex(o, name, part) { return tex('sl_' + name + part, 90, 170, (x) => { x.translate(45, 10);
  if (o.kind === 'dress' || o.kind === 'blouse') {
    if (part === 'u') { outlined(x, P('M-26 -2 Q0 -16 26 -2 Q32 34 22 54 Q0 62 -22 54 Q-32 34 -26 -2Z'), grad(x, -26, 0, 26, 50, o.a, o.b)); x.fillStyle = '#17161e'; x.fillRect(-7, 48, 14, 100); } else { outlined(x, P('M-8 -4 L8 -4 L8 136 L-8 136Z'), '#17161e', o.kind ? '#FFE9C8' : null, 3); x.fillStyle = '#3a3a48'; x.fillRect(-2, 0, 3, 130); }
    return; }
  const L = 134, a = part === 'u' ? 27 : 23, b = part === 'u' ? 23 : 18; outlined(x, P(`M${-a} 4 Q0 -22 ${a} 4 L${b} ${L} Q0 ${L + 16} ${-b} ${L}Z`), grad(x, -a, 0, a, 0, o.a, o.b));
  x.fillStyle = o.s; x.globalAlpha = .5; x.fill(P(`M${-a + 8} 10 L${-a + 16} 6 L${-b + 13} ${L - 6} L${-b + 6} ${L - 4}Z`)); x.globalAlpha = 1;
  if (part === 'f') { x.fillStyle = o.cuff; x.fill(P(`M-20 ${L - 14} Q0 ${L - 4} 20 ${L - 14} L19 ${L + 6} Q0 ${L + 16} -19 ${L + 6}Z`)); }
}); }
function handTex() { return tex('hand', 90, 100, (x) => { x.translate(45, 14);
  const h = P('M-20 0 Q-30 22 -26 44 L-22 72 Q-16 80 -11 70 L-10 50 L-6 78 Q0 86 5 76 L5 50 L12 72 Q18 78 22 68 L18 40 L32 44 Q40 38 32 28 L18 8 Q2 -6 -20 0Z');
  outlined(x, h, grad(x, -20, 0, 20, 70, '#34343F', '#1C1C25'), '#FFE9C8', 4); x.strokeStyle = '#4a4a58'; x.lineWidth = 2; x.beginPath(); x.moveTo(-12, 18); x.quadraticCurveTo(0, 8, 12, 16); x.stroke(); }); }
function legTex(k) { return tex('leg' + k, 50, 160, (x) => { x.translate(25, 6); x.fillStyle = '#191922'; x.beginPath(); x.roundRect(-9, -6, 18, 158, 9); x.fill(); x.fillStyle = '#46465a'; x.fillRect(-2.5, 2, 3, 140); }); }
function footTex() { return tex('foot', 80, 40, (x) => { x.translate(26, 6); outlined(x, P('M-13 -2 L13 -2 Q40 6 42 22 L-14 22Z'), '#20202A', '#FFE9C8', 3); x.fillStyle = '#E8E4DA'; x.fillRect(-14, 19, 56, 5); }); }
function headTex(shape = 'round') { return tex('head' + shape, 300, 300, (x) => { x.translate(150, 150); const c = new Path2D(); c.arc(0, 0, 118, 0, 7);
  const g = x.createRadialGradient(10, -46, 2, 0, 0, 122); g.addColorStop(0, '#2C2E44'); g.addColorStop(.42, '#14141F'); g.addColorStop(1, '#08080E'); x.fillStyle = g; x.fill(c);
  x.save(); x.clip(c); x.globalAlpha = .1; x.fillStyle = '#9fa4d8'; x.beginPath(); x.ellipse(-4, -98, 70, 16, 0, 0, 7); x.fill(); x.restore(); }); }
const EYE = { open(x, s) { x.fillStyle = '#F6EFE6'; x.beginPath(); x.ellipse(0, 0, 18, 27, s * .06, 0, 7); x.fill(); },
  look(x, s) { x.fillStyle = '#F6EFE6'; x.beginPath(); x.ellipse(11, 0, 18, 26, 0, 0, 7); x.fill(); },
  lookl(x, s) { x.fillStyle = '#F6EFE6'; x.beginPath(); x.ellipse(-11, 0, 18, 26, 0, 0, 7); x.fill(); },
  down(x, s) { x.fillStyle = '#F6EFE6'; x.beginPath(); x.ellipse(0, 16, 18, 22, 0, 0, 7); x.fill(); },
  wide(x, s) { x.fillStyle = '#F6EFE6'; x.beginPath(); x.ellipse(0, -2, 23, 33, 0, 0, 7); x.fill(); },
  small(x, s) { x.fillStyle = '#F6EFE6'; x.beginPath(); x.ellipse(0, 0, 10, 14, 0, 0, 7); x.fill(); },
  happy(x, s) { x.strokeStyle = '#F6EFE6'; x.lineWidth = 8.5; x.beginPath(); x.moveTo(-22, 8); x.quadraticCurveTo(0, -24, 22, 8); x.stroke(); },
  shut(x, s) { x.strokeStyle = '#F6EFE6'; x.lineWidth = 8.5; x.beginPath(); x.moveTo(-22, -6); x.quadraticCurveTo(0, 18, 22, -6); x.stroke(); },
  flat(x, s) { x.strokeStyle = '#F6EFE6'; x.lineWidth = 8.5; x.beginPath(); x.moveTo(-22, 2); x.lineTo(22, 2); x.stroke(); },
  smug(x, s) { x.fillStyle = '#F6EFE6'; x.beginPath(); x.moveTo(-22, -6); x.lineTo(22, -6); x.quadraticCurveTo(20, 24, 0, 24); x.quadraticCurveTo(-20, 24, -22, -6); x.fill(); },
  sad(x, s) { x.fillStyle = '#F6EFE6'; x.beginPath(); x.moveTo(-19 , s > 0 ? -14 : 2); x.lineTo(19, s > 0 ? 2 : -14); x.quadraticCurveTo(20, 26, 0, 26); x.quadraticCurveTo(-20, 26, -19, s > 0 ? -14 : 2); x.fill(); },
  angry(x, s) { x.fillStyle = '#F6EFE6'; x.beginPath(); x.moveTo(-19, s > 0 ? 6 : -14); x.lineTo(19, s > 0 ? -14 : 6); x.quadraticCurveTo(20, 26, 0, 26); x.quadraticCurveTo(-20, 26, -19, s > 0 ? 6 : -14); x.fill(); },
  heart(x, s) { x.fillStyle = '#F0728C'; x.beginPath(); x.moveTo(0, 22); x.bezierCurveTo(-34, -2, -18, -30, 0, -10); x.bezierCurveTo(18, -30, 34, -2, 0, 22); x.fill(); },
};
function eyeTex(state, lash) { return tex('eye_' + state + (lash ? 'L' : ''), 300, 300, (x) => { x.translate(150, 150); [-1, 1].forEach(s => { x.save(); x.translate(s * 42, 0); EYE[state](x, s); if (lash) { x.strokeStyle = '#F6EFE6'; x.lineWidth = 3.5; [0, 1, 2].forEach(i => { x.beginPath(); x.moveTo(s * (8 + i * 6), -22 + i * 3); x.quadraticCurveTo(s * (16 + i * 7), -34 + i * 2, s * (26 + i * 6), -36 + i * 5); x.stroke(); }); } x.restore(); });
  if (lash) { x.fillStyle = '#E8667F55'; [-1, 1].forEach(s => { x.beginPath(); x.ellipse(s * 48, 40, 26, 13, 0, 0, 7); x.fill(); }); } }); }
function hairTex(kind, col, hi) { return tex('hair_' + kind + col, 420, 500, (x) => { x.translate(210, 170);
  if (kind === 'long') { const p = P('M-130 -24 Q-136 -146 0 -152 Q136 -146 130 -24 Q150 120 128 250 Q0 276 -128 250 Q-150 120 -130 -24Z'); outlined(x, p, grad(x, -120, -150, 120, 250, col, hi ? hi : col)); x.strokeStyle = '#ffffff30'; x.lineWidth = 7; [[-90, -100, -118, 180], [-60, -128, -70, 40], [86, -100, 112, 200], [54, -130, 70, 60], [10, -146, 20, -110]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a * 1.25, (b + d) / 2, c, d); x.stroke(); }); }
  if (kind === 'bun') { const c = new Path2D(); c.arc(0, -152, 46, 0, 7); outlined(x, c, col); const p = P('M-126 -24 Q-128 -128 0 -132 Q128 -128 126 -24 Q124 14 114 34 Q90 -40 0 -60 Q-90 -40 -114 34 Q-124 14 -126 -24Z'); outlined(x, p, col); x.strokeStyle = '#ffffff33'; x.lineWidth = 6; x.beginPath(); x.moveTo(-60, -112); x.quadraticCurveTo(-10, -128, 40, -112); x.stroke(); }
  if (kind === 'afro') { const r = (a, b, s) => { const c = new Path2D(); c.arc(a, b, s, 0, 7); outlined(x, c, col); }; [[-118, -20, 52], [-104, -82, 56], [-58, -130, 58], [0, -148, 60], [58, -130, 58], [104, -82, 56], [118, -20, 52], [-118, 40, 44], [118, 40, 44]].forEach(a => r(...a)); x.strokeStyle = '#ffffff22'; x.lineWidth = 4; [[-70, -120], [-10, -140], [60, -118], [100, -70], [-100, -66]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 26, 3.6, 5.4); x.stroke(); }); }
  if (kind === 'bob') { const p = P('M-128 -20 Q-132 -146 0 -150 Q132 -146 128 -20 Q130 74 104 104 L-104 104 Q-130 74 -128 -20Z'); outlined(x, p, grad(x, 0, -150, 0, 100, col, hi || col)); x.strokeStyle = '#ffffff30'; x.lineWidth = 6; [[-80, -110, -112, 70], [78, -112, 110, 70], [0, -142, 4, -110]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a * 1.22, (b + d) / 2, c, d); x.stroke(); }); }
  if (kind === 'old') { [[-1], [1]].forEach(([s]) => { [[118, -30, 40], [132, 18, 44], [112, 62, 34], [92, -66, 30]].forEach(([a, b, r]) => { const c = new Path2D(); c.arc(s * a, b, r, 0, 7); outlined(x, c, '#E9E9EF'); }); }); }
}); }
const matFor = (map, extra = {}) => { const m = new THREE.MeshBasicMaterial({ map, alphaTest: .5, alphaToCoverage: true, side: THREE.DoubleSide, ...extra }); return m; };
const depthFor = new Map();
const rimCache = new Map(); const rims = [];
function rimOf(map) { if (rimCache.has(map)) return rimCache.get(map); const src = map.image, c = document.createElement('canvas'); c.width = src.width; c.height = src.height; const x = c.getContext('2d'); const r = 7; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; x.drawImage(src, Math.cos(a) * r, Math.sin(a) * r); } x.globalCompositeOperation = 'source-in'; x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, c.width, c.height); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; rimCache.set(map, t); return t; }
function quad(map, w, h, ax, ay, z = 0, mats, nolo = false) {
  const g = new THREE.PlaneGeometry(w * PX, h * PX); g.translate((w / 2 - ax) * PX, (ay - h / 2) * PX, 0);
  const m = matFor(map); mats.push(m); const mesh = new THREE.Mesh(g, m); mesh.position.z = z; mesh.castShadow = true;
  if (!nolo) { const lm = matFor(rimOf(map), { color: '#FFE9C8' }); rims.push(lm); const r = new THREE.Mesh(g, lm); r.position.z = -.045 - z; mesh.add(r); }
  let d = depthFor.get(map); if (!d) { d = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map, alphaTest: .5, side: THREE.DoubleSide }); depthFor.set(map, d); } mesh.customDepthMaterial = d; return mesh;
}
function blobTex() { return tex('blob', 128, 128, (x) => { const g = x.createRadialGradient(64, 64, 2, 64, 64, 62); g.addColorStop(0, '#000000AA'); g.addColorStop(.55, '#00000055'); g.addColorStop(1, '#00000000'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); }); }
function haloTex() { return tex('halo', 256, 512, (x) => { const g = x.createRadialGradient(128, 256, 10, 128, 256, 128); g.addColorStop(0, '#FFE6C0'); g.addColorStop(.62, '#FFE6C066'); g.addColorStop(1, '#FFE6C000'); x.save(); x.translate(0, 0); x.scale(1, 2); x.translate(0, -128); x.fillStyle = g; x.fillRect(0, 128 - 128, 256, 512); x.restore(); }); }

/** Cria personagem. opts: outfit, hair, hairc, hairhi, lash, glow, glasses, hat */
export function makeChar(opts = {}) {
  const o = OUT[opts.outfit || 'hero'], name = opts.outfit || 'hero';
  const root = new THREE.Group(), mats = [], body = new THREE.Group(); root.add(body);
  const hip = 316, shoulderY = hip + 262; // px acima do chão
  const legs = {}, arms = {};
  for (const [k, sx, zz] of [['L', -1, -.012], ['R', 1, -.010]]) {
    const th = new THREE.Group(); th.position.set(sx * 34 * PX, hip * PX, zz); const shin = new THREE.Group(); shin.position.y = -142 * PX;
    th.add(quad(legTex(1), 50, 160, 25, 6, 0, mats)); shin.add(quad(legTex(1), 50, 160, 25, 6, 0, mats)); const foot = quad(footTex(), 80, 40, 26, 6, .001, mats); foot.position.y = -142 * PX; if (sx < 0) { foot.scale.x = -1; } shin.add(foot); th.add(shin); body.add(th); legs[k] = { th, shin };
  }
  const torso = quad(torsoTex(o, name), 300, 320, 150, 20, 0, mats); torso.position.y = (shoulderY + 4) * PX; body.add(torso);
  for (const [k, sx, zz] of [['L', -1, -.006], ['R', 1, .006]]) {
    const u = new THREE.Group(); u.position.set(sx * (o.kind === 'dress' ? 66 : 84) * PX, (shoulderY - 24) * PX, zz); const f = new THREE.Group(); f.position.y = -124 * PX;
    u.add(quad(sleeveTex(o, name, 'u'), 90, 170, 45, 10, 0, mats)); f.add(quad(sleeveTex(o, name, 'f'), 90, 170, 45, 10, .001, mats));
    const h = quad(handTex(), 90, 100, 45, 14, .002, mats); h.position.y = -128 * PX; h.scale.set(sx > 0 ? -.8 : .8, .8, 1); f.add(h); u.add(f); body.add(u); arms[k] = { u, f, hand: h };
  }
  const head = new THREE.Group(); head.position.set(0, (shoulderY + 104) * PX, .02); body.add(head);
  if (opts.hair) { const hb = quad(hairTex(opts.hair, opts.hairc || '#4a2c1a', opts.hairhi), 420, 500, 210, 170, -.03, mats); head.add(hb); }
  head.add(quad(headTex(), 300, 300, 150, 150, 0, mats));
  if (opts.hair && opts.hair !== 'old' && opts.hair !== 'afro') { const f = quad(tex('fringe_' + opts.hair + (opts.hairc || ''), 300, 300, (x) => { x.translate(150, 150); const c = opts.hairc || '#4a2c1a'; x.fillStyle = c; x.fill(P(opts.hair === 'bun' ? 'M-122 -18 Q-120 -122 0 -124 Q120 -122 122 -18 Q70 -78 0 -84 Q-70 -78 -122 -18Z' : 'M-124 12 Q-126 -124 0 -126 Q126 -124 124 12 Q106 -44 44 -66 Q0 -76 -44 -66 Q-106 -44 -124 12Z')); x.strokeStyle = '#ffffff2c'; x.lineWidth = 5; x.beginPath(); x.moveTo(-70, -92); x.quadraticCurveTo(-10, -114, 54, -96); x.stroke(); }), 300, 300, 150, 150, .003, mats, true); head.add(f); }
  if (opts.lash) { const er = quad(tex('earring', 300, 300, (x) => { x.translate(150, 150); [-1, 1].forEach(s => { x.strokeStyle = '#F2C94C'; x.lineWidth = 6; x.beginPath(); x.arc(s * 124, 58, 15, 0, 7); x.stroke(); }); }), 300, 300, 150, 150, .004, mats, true); er.castShadow = false; head.add(er); }
  const eyes = {}; for (const s of Object.keys(EYE)) { const m = quad(eyeTex(s, opts.lash), 300, 300, 150, 150, .002, mats, true); m.castShadow = false; m.visible = s === 'open'; head.add(m); eyes[s] = m; }
  if (opts.glasses) { const g = quad(tex('glasses', 300, 300, (x) => { x.translate(150, 150); x.strokeStyle = '#E4E6EC'; x.lineWidth = 7; x.beginPath(); x.arc(-42, 0, 36, 0, 7); x.stroke(); x.beginPath(); x.arc(42, 0, 36, 0, 7); x.stroke(); x.beginPath(); x.moveTo(-6, 0); x.lineTo(6, 0); x.stroke(); }), 300, 300, 150, 150, .004, mats, true); g.castShadow = false; head.add(g); }
  if (opts.hat) { const g = quad(opts.hat(tex), 300, 300, 150, 150, .006, mats); head.add(g); }
  // sombra de contato e halo do herói
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(1.0, .4), new THREE.MeshBasicMaterial({ map: blobTex(), transparent: true, depthWrite: false })); blob.rotation.x = -Math.PI / 2; blob.position.y = .012; root.add(blob);
  let halo = null; if (opts.glow) { halo = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 3.0), new THREE.MeshBasicMaterial({ map: haloTex(), transparent: true, depthWrite: false, opacity: opts.glow, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })); halo.position.set(0, .95, -.09); body.add(halo); }
  const c = { root, body, head, arms, legs, eyes, mats, torso, tint(col) { mats.forEach(m => m.color.set(col)); }, eye(s) { for (const k in eyes) eyes[k].visible = k === s; }, cheer(t, ph = 0, amp = 1) { const f = t * 6 + ph, s = Math.sin(f); c.pose({ armL: [150 + s * 16 * amp, 18 + s * 10], armR: [150 - s * 16 * amp, 18 - s * 10], bob: Math.abs(Math.sin(f * .5)) * .07 * amp, head: s * 3, legL: [2, 0], legR: [2, 0] }); }, opacity(v) { mats.forEach(m => { m.transparent = v < 1; m.opacity = v; m.alphaTest = v < 1 ? .02 : .5; m.alphaToCoverage = v >= 1; m.depthWrite = v >= 1; }); blob.material.opacity = v; if (halo) halo.material.opacity = (opts.glow || 0) * v; },
    /** pose: ângulos em graus. armL/R: [ombro, cotovelo]; legL/R: [quadril, joelho] */
    pose(p = {}) { const D = Math.PI / 180; const al = p.armL || [6, 4], ar = p.armR || [6, 4], ll = p.legL || [0, 0], lr = p.legR || [0, 0];
      arms.L.u.rotation.z = -al[0] * D; arms.L.f.rotation.z = -al[1] * D; arms.R.u.rotation.z = ar[0] * D; arms.R.f.rotation.z = ar[1] * D;
      legs.L.th.rotation.z = -ll[0] * D; legs.L.shin.rotation.z = -ll[1] * D; legs.R.th.rotation.z = lr[0] * D; legs.R.shin.rotation.z = lr[1] * D;
      head.rotation.z = (p.head || 0) * D; body.rotation.z = (p.lean || 0) * D; body.position.y = p.bob || 0; const sq = p.squash || 0; body.scale.set(1 - sq * .5, 1 + sq, 1); },
    /** caminhada de frente, em função do tempo */
    walk(t, speed = 1, amp = 1) { const f = t * 6.4 * speed, s = Math.sin(f), cs = Math.cos(f); c.pose({ legL: [s * 15 * amp, Math.max(0, -s) * 26 * amp], legR: [-s * 15 * amp, Math.max(0, s) * 26 * amp], armL: [8 - s * 12 * amp, 6], armR: [8 + s * 12 * amp, 6], bob: Math.abs(cs) * .03 * amp, head: s * 2 }); },
    place(x, z, y = 0, sc = 1) { root.position.set(x, y, z); root.scale.setScalar(sc); }, face(cam) { const v = cam.position; root.rotation.y = Math.atan2(v.x - root.position.x, v.z - root.position.z); blob.rotation.z = -root.rotation.y; } };
  c.pose(); return c;
}
export function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); draw(x, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
