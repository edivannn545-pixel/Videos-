// Céu com o arco dos anéis e a Terra com anéis vista do espaço.
import * as THREE from 'three';
import { canvasTex } from './motor/char.js';
import { rng } from './motor/core.js';
import { earthTex } from './motor/kit2.js';

// desenha o arco dos anéis no céu: elipse parcial com faixas e divisões
export function drawArco(x, W, H, o = {}) { const { cx = W / 2, cy = H * 1.05, rx = W * .9, ry = H * .78, band = H * .12, col = [255, 248, 232], a = .9, glow = .25, tilt = 0 } = o;
  x.save(); x.translate(cx, cy); x.rotate(tilt);
  if (glow > 0) { x.strokeStyle = `rgba(${col.join(',')},${glow * .35})`; x.lineWidth = band * 2.2; x.filter = `blur(${band * .5}px)`; x.beginPath(); x.ellipse(0, 0, rx + band / 2, ry + band / 2, 0, Math.PI, 0); x.stroke(); x.filter = 'none'; }
  const faixas = [[0, .18, .55], [.18, .46, .95], [.46, .5, .08], [.5, .82, .8], [.82, .86, .15], [.86, 1, .45]];
  for (const [p0, p1, al] of faixas) { const r0 = p0 * band, r1 = p1 * band; x.strokeStyle = `rgba(${col.join(',')},${al * a})`; x.lineWidth = r1 - r0 + .5; x.beginPath(); x.ellipse(0, 0, rx + (r0 + r1) / 2, ry + (r0 + r1) / 2, 0, Math.PI, 0); x.stroke(); }
  const R = rng(4); for (let i = 0; i < 40; i++) { const r = R() * band; x.strokeStyle = `rgba(255,255,255,${R() * .12})`; x.lineWidth = 1 + R() * 2; x.beginPath(); x.ellipse(0, 0, rx + r, ry + r, 0, Math.PI, 0); x.stroke(); }
  x.restore(); }

export function skyAnel(scene, z, w, h, stops, arco = {}, extra, yf = .12) { const t = canvasTex(1024, 1024, (x) => { const g = x.createLinearGradient(0, 0, 0, 1024); stops.forEach(([a, b]) => g.addColorStop(a, b)); x.fillStyle = g; x.fillRect(0, 0, 1024, 1024); if (extra) extra(x); drawArco(x, 1024, 1024, arco); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, fog: false, depthWrite: false })); m.position.set(0, h * yf, z); scene.add(m); return m; }

// textura radial dos anéis (para RingGeometry; a UV é planar, então desenhamos círculos)
export function ringTex(inner = .5) { return canvasTex(1024, 1024, (x) => { x.clearRect(0, 0, 1024, 1024); const c = 512; const R = rng(9);
  for (let r = inner * 512; r < 512; r += 1) { const k = (r / 512 - inner) / (1 - inner); let a = .25 + .6 * Math.sin(k * Math.PI) ** .6; if (k > .55 && k < .6) a = .06; if (k > .86 && k < .88) a = .12; a *= .8 + R() * .25; const tone = 220 + Math.floor(30 * Math.sin(k * 20)); x.strokeStyle = `rgba(${tone},${tone - 8},${tone - 22},${Math.min(1, a)})`; x.lineWidth = 1.6; x.beginPath(); x.arc(c, c, r, 0, 7); x.stroke(); } }); }

// Terra com anéis no plano do Equador. Devolve { g, terra, anel }
export function terraComAnel(scene, R = 10, tilt = 23.4) { const g = new THREE.Group(); const terra = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 64), new THREE.MeshStandardMaterial({ map: earthTex(), roughness: .8 })); terra.receiveShadow = true; terra.castShadow = true; g.add(terra);
  const atm = new THREE.Mesh(new THREE.SphereGeometry(R * 1.025, 64, 48), new THREE.MeshBasicMaterial({ color: '#7FB6FF', transparent: true, opacity: .14, side: THREE.BackSide })); g.add(atm);
  const inner = 1.35, outer = 2.6; const tex = ringTex(inner / outer); const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: .05, side: THREE.DoubleSide, roughness: .9, emissive: '#B8B2A6', emissiveMap: tex }); const geo = new THREE.RingGeometry(R * inner, R * outer, 256, 4);
  const anel = new THREE.Mesh(geo, mat); anel.rotation.x = -Math.PI / 2; anel.castShadow = true; anel.receiveShadow = true; anel.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: .35 }); g.add(anel);
  g.rotation.z = tilt * Math.PI / 180; scene.add(g); return { g, terra, anel }; }
