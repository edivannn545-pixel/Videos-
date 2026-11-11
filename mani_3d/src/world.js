import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { rng } from './vox.js';

// ---------- instanced batches (thousands of cubes, few draw calls)
const KINDS = {
  std:   () => new THREE.MeshStandardMaterial({ roughness: 0.7 }),
  flat:  () => new THREE.MeshStandardMaterial({ roughness: 0.9 }),
  glow:  () => new THREE.MeshStandardMaterial({ roughness: 0.4, emissive: 0xffffff, emissiveIntensity: 0.0 }),
  water: () => new THREE.MeshPhysicalMaterial({ roughness: 0.08, metalness: 0.0, transparent: true, opacity: 0.82, clearcoat: 1 }),
};
export class Batch {
  constructor() { this.items = { std: [], flat: [], glow: [], water: [] }; }
  add(kind, x, y, z, w, h, d, color, ry = 0) { this.items[kind].push([x, y, z, w, h, d, color, ry]); }
  // box sitting on y (bottom at y)
  box(x, y, z, w, h, d, color, kind = 'std', ry = 0) { this.add(kind, x, y + h / 2, z, w, h, d, color, ry); }
  build(scene) {
    const meshes = {};
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), c = new THREE.Color();
    for (const k in this.items) {
      const L = this.items[k]; if (!L.length) continue;
      const geo = k === 'flat' ? new THREE.BoxGeometry(1, 1, 1) : new RoundedBoxGeometry(1, 1, 1, 2, 0.12);
      const mat = KINDS[k]();
      const im = new THREE.InstancedMesh(geo, mat, L.length);
      L.forEach(([x, y, z, w, h, d, col, ry], i) => {
        e.set(0, ry, 0); q.setFromEuler(e); m4.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(w, h, d));
        im.setMatrixAt(i, m4); im.setColorAt(i, c.set(col));
      });
      im.castShadow = k !== 'flat' && k !== 'water'; im.receiveShadow = true;
      scene.add(im); meshes[k] = im;
    }
    return meshes;
  }
}
const pick = (R, a) => a[Math.floor(R() * a.length)];

// ---------- props
export function tree(b, R, x, z, type, s = 1) {
  const y0 = groundH(x, z);
  if (type === 'pine') {
    b.box(x, y0, z, 2.4 * s, 6 * s, 2.4 * s, 0x7a4f2e);
    const G = [0x2f8f4e, 0x3aa35a, 0x247a40];
    for (let k = 0; k < 5; k++) { const w = (13 - k * 2.4) * s; b.box(x, y0 + (5 + k * 3.4) * s, z, w, 3.4 * s, w, pick(R, G)); }
    b.box(x, y0 + 22 * s, z, 2 * s, 2.5 * s, 2 * s, 0x3aa35a); return;
  }
  const h = (9 + R() * 4) * s;
  b.box(x, y0, z, 2.6 * s, h, 2.6 * s, 0x8a5a34);
  b.box(x + 2 * s, y0 + h * 0.55, z, 3 * s, 1.2 * s, 1.2 * s, 0x8a5a34);
  const P = { green: [0x4cc25a, 0x5fd16a, 0x3fae4f, 0x7bdc6a], pink: [0xff9ac8, 0xffb3d6, 0xf57fb5, 0xffc9e2], orange: [0xffa53a, 0xffbf47, 0xf28a2e, 0xffd25a], mint: [0x6fe0b8, 0x52cfa3, 0x8ff0cc] }[type];
  const cy = y0 + h + 3 * s;
  for (let i = 0; i < 26; i++) {
    let u, v, w; do { u = R() * 2 - 1; v = R() * 2 - 1; w = R() * 2 - 1; } while (u * u + v * v + w * w > 1);
    const sz = (3.2 + R() * 2.4) * s; b.add('std', x + u * 6 * s, cy + v * 4.2 * s, z + w * 6 * s, sz, sz, sz, pick(R, P));
  }
  if (type === 'green' && R() < 0.5) for (let i = 0; i < 5; i++) b.add('std', x + (R() * 2 - 1) * 6 * s, cy + (R() * 2 - 1) * 3 * s, z + 6 * s, 1.1, 1.1, 1.1, pick(R, [0xff4a4a, 0xffd23a]));
}
export function bush(b, R, x, z, s = 1) { const y0 = groundH(x, z); const C = [0x3fae4f, 0x55c464, 0x2f9a45]; for (let i = 0; i < 6; i++) { const sz = (2.4 + R() * 1.8) * s; b.add('std', x + (R() * 2 - 1) * 2.6 * s, y0 + sz / 2 + R() * 1.4 * s, z + (R() * 2 - 1) * 2.6 * s, sz, sz, sz, pick(R, C)); }
  if (R() < 0.6) for (let i = 0; i < 4; i++) b.add('std', x + (R() * 2 - 1) * 2.8 * s, y0 + 3.4 * s, z + (R() * 2 - 1) * 2.8 * s, 0.9, 0.9, 0.9, pick(R, [0xff5fa2, 0xffffff, 0xffd23a, 0xb57bff])); }
export function flower(b, R, x, z) { const y0 = groundH(x, z); b.box(x, y0, z, 0.35, 1.6, 0.35, 0x3e9b44, 'flat'); const c = pick(R, [0xff4f7b, 0xffd23a, 0xffffff, 0xb57bff, 0xff8a3d, 0x5ad1ff]);
  for (const [dx, dz] of [[0.55, 0], [-0.55, 0], [0, 0.55], [0, -0.55]]) b.add('std', x + dx, y0 + 1.9, z + dz, 0.6, 0.45, 0.6, c); b.add('std', x, y0 + 2.0, z, 0.5, 0.5, 0.5, 0xffe15a); }
export function mushroom(b, x, z) { const y0 = groundH(x, z); b.box(x, y0, z, 1, 1.6, 1, 0xf3ead7); b.box(x, y0 + 1.6, z, 2.6, 1, 2.6, 0xe8433a); b.add('std', x + 0.6, y0 + 2.7, z + 0.6, 0.5, 0.2, 0.5, 0xffffff); b.add('std', x - 0.7, y0 + 2.7, z - 0.2, 0.4, 0.2, 0.4, 0xffffff); }
export function lamp(b, x, z) { const y0 = groundH(x, z); b.box(x, y0, z, 1.8, 0.8, 1.8, 0x2d2f3a); b.box(x, y0, z, 0.8, 15, 0.8, 0x2d2f3a); b.box(x, y0 + 15, z, 2.6, 0.6, 2.6, 0x2d2f3a); b.box(x, y0 + 15.6, z, 2.0, 2.4, 2.0, 0xffe7a0, 'glow'); b.box(x, y0 + 18, z, 2.8, 0.7, 2.8, 0x2d2f3a); }
export function bench(b, x, z, ry) { const y0 = groundH(x, z); const c = Math.cos(ry), s = Math.sin(ry);
  const P = (dx, dy, dz, w, h, d, col) => b.add('std', x + dx * c + dz * s, y0 + dy, z - dx * s + dz * c, w, h, d, col, ry);
  P(0, 2.6, 0, 8, 0.6, 2.6, 0xc8783a); P(0, 4.6, -1.2, 8, 2.2, 0.5, 0xc8783a); for (const k of [-3.2, 3.2]) P(k, 1.2, 0, 0.6, 2.4, 2.4, 0x2d2f3a); }
export function fence(b, x0, z0, x1, z1, col = 0xffffff) { const n = Math.ceil(Math.hypot(x1 - x0, z1 - z0) / 3); const ry = Math.atan2(-(z1 - z0), x1 - x0);
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, z = z0 + (z1 - z0) * i / n; b.box(x, groundH(x, z), z, 0.9, 4, 0.9, col); }
  const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, L = Math.hypot(x1 - x0, z1 - z0); for (const y of [1.4, 3]) b.add('std', mx, groundH(mx, mz) + y, mz, L, 0.5, 0.4, col, ry); }

export function house(b, R, x, z, ry, o = {}) {
  const W = o.w ?? (20 + Math.floor(R() * 3) * 3), D = o.d ?? 18, H = o.h ?? (14 + Math.floor(R() * 3) * 4);
  const wall = o.wall ?? pick(R, [0xffb3c7, 0xa8e6cf, 0xfff1a8, 0xa8d8ff, 0xd7b8ff, 0xffd0a8, 0xffffff]);
  const roof = o.roof ?? pick(R, [0xe84a5f, 0x2a9d8f, 0x7b4fc9, 0xf2862e, 0x3b6fd6, 0xd6267f]);
  const c = Math.cos(ry), s = Math.sin(ry), y0 = groundH(x, z);
  const P = (dx, dy, dz, w, h, d, col, k = 'std') => b.add(k, x + dx * c + dz * s, y0 + dy, z - dx * s + dz * c, w, h, d, col, ry);
  P(0, 0.6, 0, W + 1.4, 1.2, D + 1.4, 0xbfb6a8);
  P(0, 1.2 + H / 2, 0, W, H, D, wall);
  for (const sx of [-1, 1]) P(sx * (W / 2 - 0.4), 1.2 + H / 2, D / 2 + 0.1, 1.2, H, 1.2, 0xffffff);
  // roof: stepped
  const steps = 5;
  for (let k = 0; k < steps; k++) { const ww = W + 2.4 - k * (W / steps) * 0.95; P(0, 1.2 + H + k * 2.0 + 1.0, 0, ww, 2.0, D + 2.4, k % 2 ? roof : shade(roof, 0.88)); }
  P(W * 0.25, 1.2 + H + 6, -D * 0.2, 2.6, 7, 2.6, 0x9a5a3a);
  // door
  P(0, 1.2 + 4.2, D / 2 + 0.15, 4.4, 8.4, 0.5, pick(R, [0x8a4f2a, 0x3b6fd6, 0xe84a5f, 0x2a9d8f]));
  P(1.3, 1.2 + 4.2, D / 2 + 0.5, 0.5, 0.5, 0.4, 0xffd23a);
  P(0, 1.2 + 9.0, D / 2 + 0.6, 6.0, 0.6, 1.6, shade(roof, 1.0));
  // windows front + side
  const rows = H >= 18 ? 2 : 1;
  for (let r = 0; r < rows; r++) for (const sx of [-1, 1]) {
    const wy = 1.2 + (rows == 1 ? H * 0.55 : 6 + r * 8.5), wx = sx * W * 0.3;
    if (rows == 2 && r == 0 && Math.abs(wx) < 4) continue;
    P(wx, wy, D / 2 + 0.2, 4.6, 4.6, 0.4, 0xffffff); P(wx, wy, D / 2 + 0.35, 3.6, 3.6, 0.3, 0x9fd8ff, 'glow');
    P(wx, wy, D / 2 + 0.5, 0.4, 3.6, 0.2, 0xffffff); P(wx, wy - 3.0, D / 2 + 1.0, 5.2, 1.2, 1.4, 0x8a5a34);
    for (let f = 0; f < 4; f++) P(wx - 1.8 + f * 1.2, wy - 2.1, D / 2 + 1.0, 0.9, 0.9, 0.9, pick(R, [0xff4f7b, 0xffd23a, 0xb57bff, 0xff8a3d]));
  }
  for (const sx of [-1, 1]) { const sw = 1.2 + H * 0.55; P(sx * (W / 2 + 0.2), sw, 0, 0.4, 4.4, 4.4, 0xffffff); P(sx * (W / 2 + 0.35), sw, 0, 0.3, 3.4, 3.4, 0x9fd8ff, 'glow'); }
  return { W, D, H, y0 };
}
export function shade(hex, f) { const c = new THREE.Color(hex); c.multiplyScalar(f); return c.getHex(); }

// ---------- terrain height (hill + gentle undulation)
export const HILL = { x: -150, z: -120, r: 70, h: 44 };
export function groundH(x, z) {
  const d = Math.hypot(x - HILL.x, z - HILL.z);
  if (d < HILL.r) { const t = 1 - d / HILL.r; return Math.round((HILL.h * Math.pow(t, 0.8)) / 2) * 2; }
  return 0;
}

export function buildWorld(scene, opt = {}) {
  const b = new Batch(); const R = rng(opt.seed ?? 42);
  const G = [0x6fd36b, 0x7ddc72, 0x63c95f, 0x86e07a, 0x5bc05a];
  const T = 4;
  for (let x = -300; x < 300; x += T) for (let z = -300; z < 220; z += T) {
    const cx = x + T / 2, cz = z + T / 2, gh = groundH(cx, cz), rp = Math.hypot(cx, cz);
    let col = pick(R, G), k = 'flat';
    if (rp < 34) col = ((Math.floor(cx / T) + Math.floor(cz / T)) & 1) ? 0xffe0e8 : 0xfff6e3;      // plaza tiles
    else if (rp < 46) col = pick(R, [0xd9cbb4, 0xcfc0a6, 0xe3d6c0]);                                  // ring road
    else if (Math.abs(cx) < 6 && cz > 40) col = pick(R, [0xd9cbb4, 0xcfc0a6]);                          // road to front
    else if (Math.abs(cz + 185) < 4) col = 0x9b8f80;                                                    // rail bed
    b.add(k, cx, gh - 1 + (rp > 46 && gh == 0 ? (R() < 0.15 ? 0.25 : 0) : 0), cz, T, 2 + (gh > 0 ? gh : 0) * 0 + 0.0, T, col);
    if (gh > 0) { // hill column
      b.add('flat', cx, gh / 2 - 1, cz, T, gh, T, shade(col, 0.82));
    }
  }
  // fountain
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; b.add('std', Math.cos(a) * 10, 1.4, Math.sin(a) * 10, 4.4, 2.8, 2.6, 0xf3efe6, -a); }
  b.add('water', 0, 1.6, 0, 18, 1.4, 18, 0x4fc3ff); b.box(0, 0, 0, 3.6, 8, 3.6, 0xf3efe6); b.box(0, 8, 0, 7, 1.2, 7, 0xf3efe6); b.add('water', 0, 9.6, 0, 5.6, 1, 5.6, 0x4fc3ff); b.box(0, 9.2, 0, 1.6, 4, 1.6, 0xf3efe6); b.add('water', 0, 13.6, 0, 1.4, 1.4, 1.4, 0x9fe3ff);
  // flower beds in plaza
  for (const [fx, fz] of [[-22, -22], [22, -22], [-22, 22], [22, 22]]) { b.box(fx, 0, fz, 12, 1.4, 12, 0xa0703f); for (let i = 0; i < 22; i++) flower(b, R, fx + (R() * 2 - 1) * 5, fz + (R() * 2 - 1) * 5); if (fz < 0) tree(b, R, fx, fz, pick(R, ['pink', 'orange', 'mint']), 0.7); else bush(b, R, fx, fz, 0.8); }
  for (const [lx, lz] of [[-30, 0], [30, 0], [0, -30], [-21, -21], [21, -21], [-21, 21], [21, 21]]) lamp(b, lx, lz);
  for (const a of [0.3, 1.2, 2.0, 2.9, 3.7, 4.6, 5.4]) bench(b, Math.cos(a) * 28, Math.sin(a) * 28, -a + Math.PI / 2);
  // bunting between lamp posts
  const L = [[-21, -21], [0, -30], [21, -21], [30, 0], [21, 21]];
  const flagC = [0xff4f7b, 0xffd23a, 0x4fc3ff, 0x6fd36b, 0xb57bff, 0xff8a3d];
  for (let i = 0; i < L.length - 1; i++) { const [x0, z0] = L[i], [x1, z1] = L[i + 1]; for (let k = 1; k < 10; k++) { const t = k / 10, sag = Math.sin(t * Math.PI) * 3; b.add('std', x0 + (x1 - x0) * t, 16 - sag, z0 + (z1 - z0) * t, 1.4, 1.8, 0.3, flagC[(i * 10 + k) % 6], Math.atan2(-(z1 - z0), x1 - x0)); } }
  // houses around the ring (gap toward camera)
  const ring = [];
  for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.06 - i * (Math.PI * 1.12 / 8); ring.push(a); }
  ring.forEach((a, i) => { const x = Math.cos(a) * 76, z = Math.sin(a) * 76 - 4; if (Math.hypot(x - HILL.x, z - HILL.z) < HILL.r + 14) return; house(b, R, x, z, -a - Math.PI / 2); });
  for (const [x, z, ry] of [[-70, 40, Math.PI / 2 - 0.3], [70, 40, -Math.PI / 2 + 0.3], [-95, 75, Math.PI / 2], [95, 80, -Math.PI / 2], [-40, 95, Math.PI * 0.9], [40, 100, -Math.PI * 0.9]]) house(b, R, x, z, ry);
  // Cromo's house with fence and gate
  const ch = house(b, R, -58, 70, Math.PI / 2 - 0.2, { wall: 0xa8d8ff, roof: 0xd6267f, w: 22, h: 16 });
  fence(b, -42, 56, -42, 64); fence(b, -42, 76, -42, 86);
  // trees, bushes, flowers, mushrooms all around
  for (let i = 0; i < 220; i++) {
    const x = (R() * 2 - 1) * 250, z = -250 + R() * 440, rp = Math.hypot(x, z);
    if (rp < 52 || Math.abs(z + 185) < 12 || (Math.abs(x) < 10 && z > 40)) continue;
    if (rp > 58 && rp < 88 && z < 30) continue; // keep house ring clear
    const r = R();
    if (r < 0.45) tree(b, R, x, z, pick(R, ['green', 'green', 'pink', 'orange', 'mint', 'pine']), 0.8 + R() * 0.5);
    else if (r < 0.75) bush(b, R, x, z, 0.8 + R() * 0.6);
    else if (r < 0.92) for (let k = 0; k < 6; k++) flower(b, R, x + (R() * 2 - 1) * 4, z + (R() * 2 - 1) * 4);
    else mushroom(b, x, z);
  }
  // hill top: big tree + bench (where they fly the kite)
  tree(b, R, HILL.x - 22, HILL.z + 26, 'pink', 1.4); tree(b, R, HILL.x - 26, HILL.z - 18, 'green', 1.3); bench(b, HILL.x - 4, HILL.z + 14, -0.8);
  for (let i = 0; i < 40; i++) flower(b, R, HILL.x + (R() * 2 - 1) * 26, HILL.z + (R() * 2 - 1) * 26);
  // pond
  const PX = 110, PZ = 60;
  for (let x = -18; x <= 18; x += 3) for (let z = -12; z <= 12; z += 3) if ((x * x) / 324 + (z * z) / 144 < 1) b.add('water', PX + x, -0.2, PZ + z, 3, 1.2, 3, 0x3fb6f0);
  for (const [x, z] of [[-6, 2], [5, -4], [9, 5]]) b.add('std', PX + x, 0.5, PZ + z, 2.6, 0.3, 2.6, 0x3e9b44);
  // railway + station
  for (let x = -260; x < 260; x += 3) b.box(x, 0, -185, 1.2, 0.5, 9, 0x7a5a3a);
  for (const dz of [-3, 3]) b.add('std', 0, 0.9, -185 + dz, 520, 0.6, 0.6, 0x8c8f99);
  b.box(130, 0, -172, 70, 3, 12, 0xd9d4cc); b.box(130, 3, -167, 70, 0.4, 2, 0xffd23a);
  for (const px of [100, 115, 130, 145, 160]) b.box(px, 3, -170, 1.2, 14, 1.2, 0x3b6fd6);
  for (let k = 0; k < 14; k++) b.box(98 + k * 5, 17, -172, 5, 1.4, 14, k % 2 ? 0xff4f7b : 0xffffff);
  b.box(130, 3, -158, 26, 12, 8, 0xfff1a8); b.box(130, 15, -158, 30, 2, 11, 0x2a9d8f); b.box(130, 9.5, -153.8, 7, 4, 0.4, 0xffffff); b.box(130, 10, -153.6, 5.6, 2.8, 0.3, 0x3b6fd6, 'glow');
  // distant mountains
  for (let i = 0; i < 26; i++) { const a = Math.PI * (1.02 + i / 25 * 0.96), r = 470 + R() * 60, x = Math.cos(a) * r, z = Math.sin(a) * r * 0.9 - 30, hgt = 50 + R() * 60;
    const C = pick(R, [0x7fb7a8, 0x8fa8d8, 0x9c8fd0, 0x7cc0b0]);
    for (let k = 0; k < 7; k++) { const w = (70 - k * 9) * (0.8 + R() * 0.3); b.box(x, k * hgt / 7, z, w, hgt / 7, w, k >= 5 ? 0xffffff : shade(C, 1 - k * 0.03)); } }
  // clouds
  for (let i = 0; i < 18; i++) { const x = (R() * 2 - 1) * 280, z = -280 + R() * 200, y = 110 + R() * 60;
    for (let k = 0; k < 9; k++) { const s = 8 + R() * 10; b.add('std', x + (R() * 2 - 1) * 16, y + R() * 6, z + (R() * 2 - 1) * 8, s, s * 0.7, s, pick(R, [0xffffff, 0xf4f6ff, 0xeef3ff])); } }
  balloon(b, 60, 120, -120, [0xff4f7b, 0xffd23a]); balloon(b, -40, 140, -200, [0x4fc3ff, 0xffffff]); balloon(b, 190, 105, -40, [0x6fd36b, 0xff8a3d]); balloon(b, -220, 125, 20, [0xb57bff, 0xffd23a]);
  const meshes = b.build(scene);
  scene.userData.world = { meshes };
  return meshes;
}

// ---------- birds (animated groups)
export function bird(color = 0xff6f6f) {
  const g = new THREE.Group(), m = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 });
  const bx = (w, h, d, c, x = 0, y = 0, z = 0, p = g) => { const o = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, 0.15), m(c)); o.position.set(x, y, z); o.castShadow = true; p.add(o); return o; };
  bx(1.6, 1.4, 2.6, color); bx(1.3, 1.3, 1.3, color, 0, 0.7, 1.3); bx(0.5, 0.4, 0.8, 0xffb02e, 0, 0.6, 2.2);
  bx(0.25, 0.3, 0.1, 0x111111, 0.45, 0.9, 1.95); bx(0.25, 0.3, 0.1, 0x111111, -0.45, 0.9, 1.95); bx(1.0, 0.3, 1.2, shade(color, 0.8), 0, 0.2, -1.7);
  const wl = new THREE.Group(); wl.position.set(-0.8, 0.4, 0); g.add(wl); bx(2.4, 0.3, 1.6, shade(color, 0.85), -1.2, 0, 0, wl);
  const wr = new THREE.Group(); wr.position.set(0.8, 0.4, 0); g.add(wr); bx(2.4, 0.3, 1.6, shade(color, 0.85), 1.2, 0, 0, wr);
  g.userData.wings = [wl, wr]; return g;
}
export function flap(bd, t, speed = 14) { const a = Math.sin(t * speed) * 0.7; bd.userData.wings[0].rotation.z = a; bd.userData.wings[1].rotation.z = -a; }

// ---------- sky + lighting presets
export function sky(scene, top, mid, bottom) {
  const geo = new THREE.SphereGeometry(900, 32, 16); const cols = []; const p = geo.attributes.position; const c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { const y = p.getY(i) / 900; if (y > 0.25) c.set(mid).lerp(new THREE.Color(top), Math.min(1, (y - 0.25) / 0.6)); else c.set(bottom).lerp(new THREE.Color(mid), Math.max(0, (y + 0.1) / 0.35)); cols.push(c.r, c.g, c.b); }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  const s = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false })); scene.add(s); return s;
}
export const TIME = {
  day:    { sky: [0x2f8cff, 0x7cc4ff, 0xd2efff], hemi: [0xffffff, 0x8fbf7a, 1.5], sun: [0xfff3dd, 2.6, [120, 200, 140]], glow: 0, fog: 0xcfe9ff },
  sunset: { sky: [0x6a5ae0, 0xff7aa8, 0xffc070], hemi: [0xffd2b8, 0xa08ac0, 1.6], sun: [0xffb070, 2.6, [220, 90, 160]], glow: 0.6, fog: 0xffb08a },
  night:  { sky: [0x0a0f3a, 0x23307a, 0x4a4aa0], hemi: [0x8a9aff, 0x2a2a5a, 1.0], sun: [0xb8c8ff, 1.3, [100, 200, 160]], glow: 1.8, fog: 0x23307a },
  morning:{ sky: [0x7ec4ff, 0xffd9c2, 0xfff2d6], hemi: [0xfff0e0, 0x9ac08a, 1.4], sun: [0xffe2b8, 2.4, [200, 90, 60]], glow: 0, fog: 0xffe6d6 },
  storm:  { sky: [0x3a3f55, 0x6a6f88, 0x8a8fa6], hemi: [0xb0b8d0, 0x50586a, 1.0], sun: [0xc8d0ff, 0.9, [60, 200, 80]], glow: 0.6, fog: 0x6a6f88 },
};
export function setupLights(scene, name, focus = new THREE.Vector3()) {
  const T = TIME[name];
  sky(scene, ...T.sky);
  scene.fog = new THREE.Fog(T.fog, 300, 1000);
  scene.add(new THREE.HemisphereLight(T.hemi[0], T.hemi[1], T.hemi[2]));
  const d = new THREE.DirectionalLight(T.sun[0], T.sun[1]); d.position.set(...T.sun[2]).add(focus); d.target.position.copy(focus); scene.add(d.target);
  d.castShadow = true; d.shadow.mapSize.set(4096, 4096); Object.assign(d.shadow.camera, { left: -140, right: 140, top: 140, bottom: -140, near: 1, far: 800 }); d.shadow.bias = -0.0005; d.shadow.normalBias = 0.4; scene.add(d);
  const w = scene.userData.world; if (w && w.meshes.glow) w.meshes.glow.material.emissiveIntensity = T.glow;
  return T;
}
export function stars(scene, n = 260) { const g0=new THREE.Group(); const R0 = rng(5); const m=new THREE.MeshBasicMaterial({color:0xfff6d0,fog:false});
  const geo=new THREE.BoxGeometry(1,1,1); for(let i=0;i<n;i++){const a=R0()*Math.PI*2,e=0.12+R0()*1.2,d=780; const o=new THREE.Mesh(geo,m); const sz=2+R0()*4; o.scale.setScalar(sz); o.position.set(Math.cos(a)*Math.cos(e)*d,Math.sin(e)*d,Math.sin(a)*Math.cos(e)*d); o.rotation.set(R0(),R0(),R0()); g0.add(o);} 
  const moon=new THREE.Mesh(new THREE.BoxGeometry(60,60,60),new THREE.MeshBasicMaterial({color:0xfff3c4,fog:false})); moon.position.set(-500,420,-560); moon.rotation.set(0.3,0.5,0.2); g0.add(moon); scene.add(g0); return g0; }
export function starsOld(scene, n = 600) { const g = new THREE.BufferGeometry(); const P = []; const R = rng(5); for (let i = 0; i < n; i++) { const a = R() * Math.PI * 2, e = 0.15 + R() * 1.3; P.push(Math.cos(a) * Math.cos(e) * 850, Math.sin(e) * 850, Math.sin(a) * Math.cos(e) * 850); }
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); const s = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 3.2, sizeAttenuation: false, fog: false })); scene.add(s); return s; }

export function train(scene, x, z) {
  const b = new Batch(); const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const W = (dx, w, col) => { // wheels
    for (const sz of [-4.2, 4.2]) for (const k of [-w / 3, w / 3]) b.add('std', dx + k, 2.4, sz, 3.6, 3.6, 1.2, 0x2b2b30); };
  // locomotive
  b.box(0, 3, 0, 26, 3, 9, 0x2b2b30); b.box(-3, 6, 0, 16, 7, 7.5, 0xe8433a); b.box(8, 6, 0, 9, 11, 9, 0xe8433a); b.box(8, 17, 0, 10.5, 1.4, 10.5, 0x2b2b30);
  for (const sz of [-4.6, 4.6]) b.box(8, 10, sz, 5, 4, 0.4, 0x9fd8ff, 'glow');
  b.box(-8, 13, 0, 3, 6, 3, 0x2b2b30); b.box(-8, 19, 0, 4.4, 1.6, 4.4, 0x2b2b30); b.box(-11.2, 6, 0, 1.2, 4.4, 4.4, 0xffd23a); b.box(-12, 7.5, 0, 0.6, 2, 2, 0xfff6c0, 'glow');
  for (const k of [-6, -1, 4]) b.box(k - 3, 6, 0, 0.8, 7.6, 8, 0xffd23a);
  W(0, 26);
  const wc = [0x3b6fd6, 0xffd23a, 0x2fb7a8, 0xd6267f];
  wc.forEach((c, i) => { const dx = 30 + i * 27; b.box(dx, 3, 0, 25, 2, 9, 0x2b2b30); b.box(dx, 5, 0, 24, 10, 9.4, c); b.box(dx, 15, 0, 25.5, 1.4, 10.4, 0xffffff);
    for (const sz of [-4.8, 4.8]) for (const k of [-7, 0, 7]) { b.box(dx + k, 8.5, sz, 4.4, 4, 0.4, 0xffffff); b.box(dx + k, 9, sz * 1.01, 3.4, 3, 0.3, 0x9fd8ff, 'glow'); }
    W(dx, 25); });
  b.build(g); return g;
}
export function balloon(b, x, y, z, cols) {
  for (let k = 0; k < 7; k++) { const w = [8, 12, 14, 14, 12, 9, 5][k]; b.add('std', x, y + k * 2.6, z, w, 2.6, w, cols[k % cols.length]); }
  for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) b.add('std', x + dx, y - 3.5, z + dz, 0.3, 5, 0.3, 0x5a3a20);
  b.add('std', x, y - 7, z, 5, 3, 5, 0xa0703f);
}
