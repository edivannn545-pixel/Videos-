import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
const geoCache = new Map(), matCache = new Map();
export function mat(color, o = {}) {
  const k = color + JSON.stringify(o);
  if (!matCache.has(k)) {
    const m = o.glass
      ? new THREE.MeshPhysicalMaterial({ color, roughness: 0.15, transmission: 0.55, thickness: 2, transparent: true, opacity: 0.88, emissive: color, emissiveIntensity: 0.18, clearcoat: 1 })
      : new THREE.MeshStandardMaterial({ color, roughness: o.rough ?? 0.62, metalness: o.metal ?? 0, emissive: o.glow ? color : 0x000000, emissiveIntensity: o.glow ?? 0 });
    matCache.set(k, m);
  }
  return matCache.get(k);
}
function geo(w, h, d, r) {
  const k = [w, h, d, r].join(',');
  if (!geoCache.has(k)) geoCache.set(k, r > 0 ? new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2 - 0.01, h / 2 - 0.01, d / 2 - 0.01)) : new THREE.BoxGeometry(w, h, d));
  return geoCache.get(k);
}
// box centred at (x,y,z) with size (w,h,d)
export function B(parent, x, y, z, w, h, d, color, o = {}) {
  const m = new THREE.Mesh(geo(w, h, d, o.r ?? 0.14), mat(color, o));
  m.position.set(x, y, z); m.castShadow = o.shadow ?? true; m.receiveShadow = true;
  if (o.rot) m.rotation.set(...o.rot);
  parent.add(m); return m;
}
export function pivot(parent, x, y, z, name) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.name = name || ''; parent.add(g); return g;
}
export function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

// ---------- face on a head whose front plane is at z=fz, centre height cy
export function face(head, { fz, cy = 4, eyes = 'dot', mouth = 'smile', blush = true, eyeColor = 0x2a1a14, skin }) {
  const z = fz + 0.06;
  if (eyes === 'dot') { for (const s of [-1, 1]) B(head, s * 1.55, cy + 0.35, z, 0.85, 1.25, 0.18, eyeColor, { r: 0.08, shadow: false }); }
  if (eyes === 'happy') { // closed ^ ^ eyes
    for (const s of [-1, 1]) { B(head, s * 1.55 - 0.45, cy + 0.2, z, 0.5, 0.45, 0.18, eyeColor, { r: 0.05, shadow: false }); B(head, s * 1.55, cy + 0.55, z, 0.55, 0.45, 0.18, eyeColor, { r: 0.05, shadow: false }); B(head, s * 1.55 + 0.45, cy + 0.2, z, 0.5, 0.45, 0.18, eyeColor, { r: 0.05, shadow: false }); }
  }
  if (mouth === 'smile') { B(head, -0.7, cy - 1.35, z, 0.55, 0.4, 0.18, 0x5a2318, { r: .05, shadow: false }); B(head, 0, cy - 1.6, z, 1.0, 0.4, 0.18, 0x5a2318, { r: .05, shadow: false }); B(head, 0.7, cy - 1.35, z, 0.55, 0.4, 0.18, 0x5a2318, { r: .05, shadow: false }); }
  if (mouth === 'open') { B(head, 0, cy - 1.5, z, 1.3, 0.9, 0.18, 0x5a1a1a, { r: .1, shadow: false }); }
  if (blush) for (const s of [-1, 1]) B(head, s * 2.55, cy - 0.7, z - 0.02, 1.1, 0.55, 0.16, 0xf28a8a, { r: .1, shadow: false });
}

// ---------- generic chibi humanoid with animatable pivots
export function humanoid(o) {
  const root = new THREE.Group();
  const P = {};
  const legH = o.legH ?? 4.6, bodyH = o.bodyH ?? 5.6, hipY = legH + 0.9;
  // legs
  for (const [s, n] of [[-1, 'legL'], [1, 'legR']]) {
    const L = P[n] = pivot(root, s * 1.35, hipY, 0, n);
    B(L, 0, -legH / 2 + 0.2, 0, 2.4, legH, 2.5, o.pants);
    B(L, 0, -hipY + 0.6, 0.35, 2.7, 1.2, 3.2, o.shoe ?? 0x3a2a22);
    if (o.sole) B(L, 0, -hipY + 0.12, 0.35, 2.75, 0.3, 3.25, o.sole);
  }
  // body
  const body = P.body = pivot(root, 0, hipY, 0, 'body');
  B(body, 0, bodyH / 2, 0, 6.0, bodyH, 3.6, o.shirt);
  // arms
  for (const [s, n] of [[-1, 'armL'], [1, 'armR']]) {
    const A = P[n] = pivot(body, s * 3.95, bodyH - 0.7, 0, n);
    B(A, 0, -2.1, 0, 1.9, 4.4, 2.1, o.sleeve ?? o.shirt);
    B(A, 0, -4.7, 0, 1.75, 1.6, 1.85, o.skin);
    P[n + 'Hand'] = pivot(A, 0, -4.9, 0.3, n + 'Hand');
  }
  // head
  const head = P.head = pivot(body, 0, bodyH, 0, 'head');
  B(head, 0, 0.4, 0, 2.2, 1.0, 2.0, o.skin);
  B(head, 0, 4.4, 0, 8.0, 7.6, 7.2, o.skin, { r: 0.35 });
  if (!o.noFace) face(head, { fz: 3.6, cy: 4.0, eyes: o.eyes ?? 'dot', mouth: o.mouth ?? 'smile' });
  root.userData.parts = P;
  return root;
}
