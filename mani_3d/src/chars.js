import * as THREE from 'three';
import { B, pivot, rng, face, humanoid, mat } from './vox.js';

// scatter cubes inside an ellipsoid (for hair / clouds)
function cloud(parent, { cx, cy, cz, rx, ry, rz, size, colors, seed, n, skip, jitter = 0.5 }) {
  const R = rng(seed);
  for (let i = 0; i < n; i++) {
    let x, y, z, k = 0;
    do { x = (R() * 2 - 1); y = (R() * 2 - 1); z = (R() * 2 - 1); k++; } while (x * x + y * y + z * z > 1 && k < 50);
    const px = cx + x * rx, py = cy + y * ry, pz = cz + z * rz;
    if (skip && skip(px, py, pz)) continue;
    const s = size * (0.8 + R() * jitter);
    B(parent, px, py, pz, s, s, s, colors[Math.floor(R() * colors.length)], { r: 0.22 });
  }
}

// ---------------- CROMO (robot, one wheel)
export function cromo() {
  const root = new THREE.Group(); const P = {};
  const wheel = P.wheel = pivot(root, 0, 2.7, 0, 'wheel');
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.7, 2.4, 14), mat(0x2b2b30)); tire.rotation.z = Math.PI / 2; tire.castShadow = true; wheel.add(tire);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 2.6, 8), mat(0xd6267f)); hub.rotation.z = Math.PI / 2; wheel.add(hub);
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; B(wheel, 0, Math.sin(a) * 2.7, Math.cos(a) * 2.7, 2.5, 0.7, 0.9, 0x1d1d22, { r: 0.1, rot: [-a, 0, 0] }); }
  for (const s of [-1, 1]) { B(root, s * 1.8, 4.2, 0, 0.8, 3.4, 1.6, 0xd6267f); }
  const body = P.body = pivot(root, 0, 5.4, 0, 'body');
  B(body, 0, 0.9, 0, 6.2, 1.8, 4.6, 0xbfc3ca);
  B(body, 0, 3.9, 0, 7.4, 4.6, 5.2, 0xd9dce2);
  for (const s of [-1, 1]) B(body, s * 3.75, 3.9, 0, 0.5, 3.2, 3.6, 0xd6267f);
  B(body, 0, 4.0, 2.64, 4.2, 2.4, 0.2, 0x25282e, { r: 0.12 });
  B(body, 0, 4.0, 2.76, 2.8, 0.8, 0.12, 0x5ee6c8, { glow: 0.6, r: 0.08 });
  for (const [s, n] of [[-1, 'armL'], [1, 'armR']]) {
    const A = P[n] = pivot(body, s * 4.5, 5.2, 0, n);
    B(A, 0, -0.2, 0, 1.6, 1.6, 1.6, 0xd6267f);
    B(A, 0, -2.0, 0, 1.5, 2.6, 1.6, 0xd9dce2);
    B(A, 0, -3.6, 0, 1.4, 1.2, 1.4, 0xd6267f);
    B(A, 0, -4.7, 0.2, 1.7, 1.4, 1.8, 0x5b5f68);
    P[n + 'Hand'] = pivot(A, 0, -5.2, 0.4, n + 'Hand');
  }
  B(body, 0, 6.6, 0, 1.6, 1.0, 1.6, 0x5b5f68);
  const head = P.head = pivot(body, 0, 7.0, 0, 'head');
  B(head, 0, 3.6, 0, 10.0, 7.0, 7.0, 0xdfe2e7, { r: 0.4, metal: 0.25, rough: 0.4 });
  B(head, 0, 3.6, 3.45, 8.2, 5.4, 0.3, 0x1c1f25, { r: 0.25 });
  const scr = P.screen = pivot(head, 0, 3.6, 3.68, 'screen');
  P.eyeL = B(scr, -1.8, 0.7, 0, 1.0, 1.4, 0.1, 0x5ee6c8, { glow: 0.9, r: 0.05, shadow: false });
  P.eyeR = B(scr, 1.8, 0.7, 0, 1.0, 1.4, 0.1, 0x5ee6c8, { glow: 0.9, r: 0.05, shadow: false });
  P.mouth = pivot(scr, 0, -1.2, 0, 'mouth');
  for (const [x, y, w] of [[-1.2, 0.25, 0.6], [0, 0, 1.9], [1.2, 0.25, 0.6]]) B(P.mouth, x, y, 0, w, 0.45, 0.1, 0x5ee6c8, { glow: 0.9, r: 0.04, shadow: false });
  // extra expressions (hidden by default)
  P.happy = pivot(scr, 0, 0, 0, 'happy'); P.happy.visible = false;
  for (const sx of [-1.8, 1.8]) { B(P.happy, sx - 0.55, 0.45, 0, 0.6, 0.45, 0.1, 0x5ee6c8, { glow: 0.9, r: 0.04, shadow: false }); B(P.happy, sx, 0.9, 0, 0.6, 0.45, 0.1, 0x5ee6c8, { glow: 0.9, r: 0.04, shadow: false }); B(P.happy, sx + 0.55, 0.45, 0, 0.6, 0.45, 0.1, 0x5ee6c8, { glow: 0.9, r: 0.04, shadow: false }); }
  P.bigMouth = pivot(scr, 0, -1.2, 0, 'bigMouth'); P.bigMouth.visible = false;
  for (const [x, y, w] of [[-1.7, 0.45, 0.55], [-1.2, 0.0, 0.6], [0, -0.3, 2.0], [1.2, 0.0, 0.6], [1.7, 0.45, 0.55]]) B(P.bigMouth, x, y, 0, w, 0.5, 0.1, 0x5ee6c8, { glow: 0.9, r: 0.04, shadow: false });
  P.blush = pivot(scr, 0, 0, 0, 'blush'); P.blush.visible = false;
  for (const sx of [-3.0, 3.0]) B(P.blush, sx, -0.4, 0, 1.2, 0.55, 0.1, 0xff7aa8, { glow: 0.8, r: 0.05, shadow: false });
  P.tears = []; for (const sx of [-1.8, 1.8]) { const d = B(scr, sx, -0.2, 0.15, 0.55, 0.75, 0.3, 0xd9a520, { metal: 0.8, rough: 0.15, r: 0.15, shadow: false }); d.visible = false; P.tears.push(d); }
  for (const s of [-1, 1]) { B(head, s * 5.15, 3.6, 0, 0.6, 3.2, 3.2, 0xd6267f); B(head, s * 5.35, 3.6, 0, 0.3, 1.6, 1.6, 0x2b2b30); }
  B(head, 0, 7.6, 0, 0.5, 1.6, 0.5, 0x3a3d44); B(head, 0, 8.8, 0, 1.3, 1.3, 1.3, 0xd6267f);
  root.userData.parts = P; return root;
}
export function caixa() { const g = new THREE.Group(); B(g, 0, 0, 0, 5, 4, 4, 0xc9a46a, { r: 0.15 }); B(g, 0, 0, 2.02, 2.2, 2.2, 0.05, 0xa98648, { r: 0.05 }); B(g, 0, 0, 2.04, 1.4, 1.4, 0.05, 0xc9a46a, { r: 0.05 }); B(g, 0, 2.0, 0, 5.05, 0.15, 1, 0xa98648, { r: 0 }); return g; }

// ---------------- VIRA-VENTO (kite boy)
export function viraVento() {
  const root = humanoid({ skin: 0xc98b5e, shirt: 0xf2b632, pants: 0x6b6a2e, shoe: 0x3b3b3b, sole: 0xeeeeee });
  const P = root.userData.parts;
  for (const s of [-1, 1]) B(P.body, s * 1.6, 2.9, 1.85, 0.9, 5.6, 0.2, 0x5a3a20, { r: 0.05 });
  B(P.body, 0, 0.5, 0, 6.2, 0.9, 3.8, 0x5a3a20, { r: 0.08 });
  B(P.body, 2.2, 0.3, 2.0, 1.6, 1.4, 0.6, 0x8a5a30); B(P.body, -2.4, 0.3, 1.9, 1.3, 1.2, 0.5, 0x6f6a3a);
  B(P.body, 0, 5.35, 0.2, 6.6, 1.1, 4.3, 0xf07a1e); B(P.body, 1.6, 4.3, 2.2, 1.4, 1.6, 0.5, 0xf07a1e);
  const h = P.head;
  B(h, 0, 8.3, -0.2, 8.5, 1.6, 7.7, 0x6b3d1f, { r: 0.3 });
  B(h, 0, 5.0, -3.5, 8.3, 6.0, 1.0, 0x6b3d1f);
  for (const s of [-1, 1]) B(h, s * 4.05, 6.3, -0.6, 0.6, 3.6, 6.2, 0x6b3d1f);
  cloud(h, { cx: 0, cy: 9.2, cz: -0.5, rx: 3.6, ry: 0.9, rz: 3.2, size: 1.8, colors: [0x6b3d1f, 0x7d4a26, 0x5a3218], seed: 3, n: 26 });
  B(h, 0, 6.9, 3.75, 8.3, 0.7, 0.3, 0x5a3a20, { r: .05 });
  for (const s of [-1, 1]) { B(h, s * 1.8, 7.0, 3.9, 2.5, 1.9, 0.6, 0x8a5a30, { r: .2 }); B(h, s * 1.8, 7.0, 4.2, 1.7, 1.2, 0.1, 0x55d6e8, { glow: 0.3, r: .1 }); }
  root.userData.parts = P; return root;
}
export function pipa() {
  const g = new THREE.Group(); const S = 0.9;
  const cols = [0xffe14d, 0x4fd6e0, 0xff6fae, 0xffb03a];
  for (let i = -6; i <= 6; i++) for (let j = -8; j <= 8; j++) {
    if (Math.abs(i) / 6 + Math.abs(j) / 8 > 1) continue;
    const q = (i >= 0 ? 0 : 1) + (j >= 0 ? 0 : 2);
    B(g, i * S, j * S, 0, S, S, 0.3, cols[q], { r: 0.05, shadow: false });
  }
  B(g, 0, 0, 0.3, 0.3, 16 * S, 0.3, 0x7a5a3a, { r: 0 }); B(g, 0, 0, 0.3, 12 * S, 0.3, 0.3, 0x7a5a3a, { r: 0 });
  // tail
  for (let k = 0; k < 6; k++) B(g, Math.sin(k) * 0.6, -8 * S - 1 - k * 1.3, 0, 0.8, 0.8, 0.2, cols[k % 4], { r: 0.05 });
  return g;
}

// ---------------- PÉTALA (dancer)
export function petala() {
  const root = humanoid({ skin: 0xb9774f, shirt: 0xd92f95, sleeve: 0xb9774f, pants: 0xb9774f, shoe: 0xf2f2f2, eyes: 'happy' });
  const P = root.userData.parts;
  const R = rng(9);
  for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 14; i++) {
    const a = i / 14 * Math.PI * 2 + ring * 0.2, r = 3.6 + ring * 0.9;
    B(P.body, Math.cos(a) * r, -0.2 - ring * 0.9, Math.sin(a) * r * 0.8, 2.4, 1.3, 1.6, [0xe0379b, 0xf25cb4, 0xc92585][Math.floor(R() * 3)], { rot: [0, -a, 0], r: 0.2 });
  }
  cloud(P.head, { cx: 0, cy: 6.0, cz: -1.0, rx: 6.6, ry: 5.0, rz: 5.4, size: 2.4, colors: [0xe8435a, 0xf05a6e, 0xd8344c, 0xff6f80], seed: 5, n: 160,
    skip: (x, y, z) => (z > 1.5 && Math.abs(x) < 3.5 && y < 7.4) || y < 1.2 });
  for (const [x, z] of [[-1.2, 0], [0, -0.5], [1.2, 0.2], [0.6, 1]]) { B(P.head, x, 11.4, z, 0.3, 1.8, 0.3, 0xe5b33a, { metal: .6 }); B(P.head, x, 12.4, z, 0.8, 0.8, 0.8, 0xffcf4a, { metal: .6, glow: .2 }); }
  return root;
}

// ---------------- FUZUÊ (party drummer)
export function fuzue() {
  const root = humanoid({ skin: 0x7a4a2e, shirt: 0x2fb7a8, pants: 0x222222, shoe: 0x3fb7a0, sole: 0xffffff, eyes: 'happy' });
  const P = root.userData.parts;
  B(P.body, 0, 2.8, 1.85, 2.2, 5.4, 0.2, 0xf4f1e6, { r: .05 });
  for (const L of [P.legL, P.legR]) for (let y = 0; y < 3; y++) for (let x = 0; x < 2; x++) if ((x + y) % 2 == 0) B(L, -0.6 + x * 1.2, -0.6 - y * 1.2, 1.28, 1.15, 1.15, 0.1, 0xffffff, { r: 0.02, shadow: false });
  cloud(P.head, { cx: 0, cy: 6.4, cz: -0.8, rx: 6.2, ry: 4.6, rz: 5.2, size: 2.2, colors: [0xf5b81c, 0xffc93a, 0xe9a514, 0xffd75a], seed: 7, n: 170,
    skip: (x, y, z) => (z > 1.5 && Math.abs(x) < 3.5 && y < 7.2) || y < 1.6 });
  const hat = pivot(P.head, 1.5, 10.2, 0, 'hat'); hat.rotation.z = -0.25;
  for (let k = 0; k < 5; k++) B(hat, 0, k * 0.9, 0, 3.2 - k * 0.6, 0.9, 3.2 - k * 0.6, 0xe94e9a, { r: 0.1 });
  B(hat, 0, 4.9, 0, 1.0, 1.0, 1.0, 0xffd23a); B(hat, 0.9, 0.5, 1.2, 0.5, 0.5, 0.5, 0xffd23a); B(hat, -0.6, 1.4, 1.0, 0.5, 0.5, 0.5, 0x5ee6c8);
  root.userData.parts = P; return root;
}
export function tambor() {
  const g = new THREE.Group();
  const c = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 3.6, 10), mat(0xe94e9a)); c.castShadow = true; g.add(c);
  for (const y of [-1.9, 1.9]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.5, 10), mat(0xffd23a)); r.position.y = y; g.add(r); }
  const top = new THREE.Mesh(new THREE.CylinderGeometry(3.05, 3.05, 0.1, 10), mat(0xf6efe0)); top.position.y = 2.18; g.add(top);
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; B(g, Math.sin(a) * 3.15, 0, Math.cos(a) * 3.15, 1.0, 1.6, 0.3, 0xffd23a, { rot: [0, a, 0], r: 0.05 }); }
  return g;
}
export function baqueta() { const g = new THREE.Group(); B(g, 0, 1.6, 0, 0.45, 3.4, 0.45, 0x6b4a2a, { r: 0.05 }); B(g, 0, 3.5, 0, 1.0, 1.0, 1.0, 0xffd23a); return g; }

// ---------------- GOMA (jelly)
export function goma() {
  const root = new THREE.Group(); const P = {}; const C = 0xff2d6f, o = { glass: true, r: 0.45 };
  for (const [s, n] of [[-1, 'legL'], [1, 'legR']]) { const L = P[n] = pivot(root, s * 1.7, 4.2, 0, n); B(L, 0, -1.4, 0, 2.6, 2.6, 2.6, C, o); B(L, 0, -3.3, 0.4, 2.8, 1.8, 3.0, C, o); }
  const body = P.body = pivot(root, 0, 4.4, 0, 'body');
  B(body, 0, 2.6, 0, 6.6, 5.4, 4.8, C, o);
  for (const [s, n] of [[-1, 'armL'], [1, 'armR']]) { const A = P[n] = pivot(body, s * 4.0, 4.2, 0, n); B(A, s * 0.6, -0.4, 0, 2.4, 2.4, 2.4, C, o); B(A, s * 1.0, -2.6, 0, 2.2, 2.2, 2.2, C, o); P[n + 'Hand'] = pivot(A, s, -3.8, 0.4); }
  const head = P.head = pivot(body, 0, 5.4, 0, 'head');
  B(head, 0, 3.2, 0, 7.4, 6.4, 6.0, C, o);
  B(head, -1.6, 3.8, 3.05, 1.1, 1.4, 0.12, 0x5ee6c8, { glow: 0.8, r: 0.05 }); B(head, 1.6, 3.8, 3.05, 1.1, 1.4, 0.12, 0x5ee6c8, { glow: 0.8, r: 0.05 });
  for (const [x, y, w] of [[-1.1, 2.25, 0.6], [0, 2.0, 1.8], [1.1, 2.25, 0.6]]) B(head, x, y, 3.05, w, 0.45, 0.12, 0x5ee6c8, { glow: 0.8, r: 0.04 });
  P.bits = pivot(root, 0, 0, 0, 'bits');
  for (const [x, y, z, s] of [[-6.5, 12, 1, 1.2], [6.8, 14.5, -1, 1.0], [-5.5, 6, 2, 0.9], [6, 7, 1.5, 0.8]]) B(P.bits, x, y, z, s, s, s, C, { glass: true, r: 0.25 });
  root.userData.parts = P; return root;
}

// ---------------- NIMBO (cloud wizard)
export function nimbo() {
  const root = humanoid({ skin: 0xc98b5e, shirt: 0x7b4fc9, pants: 0x5a3a8a, shoe: 0x4a3a2a });
  const P = root.userData.parts;
  B(root, 0, 3.0, 0, 7.2, 4.4, 4.6, 0x8a5fd6, { r: 0.25 });
  for (const [x, y] of [[-2, 2.2], [1.8, 3.4], [-0.6, 4.2]]) B(root, x, y, 2.32, 0.9, 0.9, 0.1, 0xe8e0ff, { r: .05 });
  B(P.body, 2.6, 1.0, 2.0, 2.4, 2.0, 1.0, 0xc8a46a); B(P.body, 0, 2.8, 1.85, 6.1, 0.5, 0.2, 0x5a3a20, { r: .02, rot: [0, 0, 0.7] });
  const h = P.head;
  B(h, 0, 5.0, -3.4, 8.4, 7.4, 1.2, 0x23264d); for (const s of [-1, 1]) B(h, s * 4.1, 4.2, -0.2, 0.6, 6.4, 7.0, 0x23264d);
  B(h, 0, 7.6, 3.4, 8.4, 1.6, 1.0, 0x23264d); B(h, -2.5, 6.6, 3.7, 2.4, 1.2, 0.6, 0x23264d);
  cloud(h, { cx: 0.5, cy: 10.0, cz: -0.4, rx: 7.8, ry: 2.6, rz: 4.8, size: 3.4, colors: [0xe6e1ff, 0xd5ceff, 0xf1eeff, 0xc7befa], seed: 11, n: 34, jitter: 0.4 });
  root.userData.parts = P; return root;
}
export function cajado() { const g = new THREE.Group(); B(g, 0, 0, 0, 0.6, 16, 0.6, 0x4a2f5a, { r: 0.1 }); return g; }

// ---------------- ESTOPIM (fiery one)
export function estopim() {
  const root = humanoid({ skin: 0xf0b48c, shirt: 0x2fb7a8, pants: 0xd6332b, shoe: 0x2a2a2e });
  const P = root.userData.parts;
  B(P.body, 0, 2.8, 1.85, 2.0, 5.4, 0.2, 0x222222, { r: .05 });
  for (const L of [P.legL, P.legR]) B(L, 0, -2.8, 1.3, 1.4, 1.3, 0.2, 0xf2b632, { r: 0.05 });
  const h = P.head;
  B(h, 0, 4.0, -3.6, 8.6, 8.4, 1.4, 0xc93a22); for (const s of [-1, 1]) { B(h, s * 4.2, 3.2, -0.6, 0.8, 8.0, 6.0, 0xc93a22); B(h, s * 4.5, -0.4, -1.0, 1.6, 2.4, 3.0, 0xb5321c); }
  B(h, 0, 8.7, -0.1, 8.8, 2.0, 7.8, 0x2a2a2e, { r: 0.3 }); B(h, 0, 7.9, 4.6, 8.0, 0.5, 2.8, 0x2a2a2e, { r: 0.15 }); B(h, 0, 8.6, 3.9, 1.4, 1.2, 0.2, 0xd6332b, { r: .05 });
  for (const s of [-1, 1]) { B(h, s * 4.6, 4.6, 0, 1.2, 3.0, 2.8, 0x333338); B(h, s * 5.25, 4.6, 0, 0.2, 1.2, 1.2, 0x2f6bd6, { glow: 0.6, r: .05 }); }
  B(h, 0, 9.85, 0, 9.6, 0.5, 1.0, 0x333338, { r: 0.1 });
  root.userData.parts = P; return root;
}
export function lanterna() {
  const g = new THREE.Group(); B(g, 0, 0, 0, 0.7, 11, 0.7, 0x2a2a2e, { r: 0.1 });
  B(g, 0, 6.6, 0, 3.6, 3.8, 3.2, 0x3a3328, { r: 0.2 }); B(g, 0, 6.6, 0, 2.4, 2.6, 3.4, 0xffd04a, { glow: 1.6, r: 0.1, shadow: false });
  const l = new THREE.PointLight(0xffc040, 40, 20, 2); l.position.set(0, 6.6, 2.5); g.add(l); return g;
}

export function mala() { const g = new THREE.Group(); B(g, 0, 0, 0, 5, 6, 2.6, 0xc8783a, { r: 0.3 }); B(g, 0, 0, 1.35, 5.1, 0.6, 0.2, 0x5a3a20); B(g, 0, 3.4, 0, 2, 0.6, 0.6, 0x5a3a20); return g; }
export function carretel() { const g = new THREE.Group(); B(g, 0, 0, 0, 1.6, 1.6, 1.6, 0xf2f2f2, { r: 0.3 }); B(g, 0, 0, 0, 2.2, 0.4, 2.2, 0x8a5a34); return g; }
