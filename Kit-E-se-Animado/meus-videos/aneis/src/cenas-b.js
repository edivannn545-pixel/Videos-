import * as THREE from 'three';
import { makeShot, aim, keys, smooth, lerp, clamp, rng } from './motor/core.js';
import { makeChar, canvasTex } from './motor/char.js';
import { box, std, cut, glowSprite, building, street, lamp, tree, car, skyline, sky } from './motor/kit.js';
import { crowd, uT, stars, smoke, earthTex, cobbleTex } from './motor/kit2.js';
import { woodFloor, tileFloor, wallMat, beam, naMao } from './comum.js';
import { skyAnel, terraComAnel, ringTex } from './anel.js';
import { quartoJanela } from './cenas-a.js';

/** 6. Lançar foguete vira loteria — 36.55 a 38.5 */
export function shotFoguete(t0, t1) { const s = makeShot(t0, t1, '#E8966A', 38), c = s.scene; c.fog = new THREE.FogExp2('#F1A97C', .01);
  skyAnel(c, -160, 520, 380, [[0, '#3D3360'], [.45, '#8A5A86'], [.75, '#E8956B'], [1, '#F7CF98']], { cx: 512, cy: 1250, rx: 340, ry: 709, band: 90, col: [255, 244, 228], a: .9, glow: .3 });
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), std('#6A5A5A')); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; c.add(gr);
  const rk = new THREE.Group(); const bodyT = canvasTex(256, 512, (x) => { x.fillStyle = '#F4F0E6'; x.fillRect(0, 0, 256, 512); x.fillStyle = '#2E3648'; x.fillRect(0, 300, 256, 18); x.fillStyle = '#C9472F'; x.font = "900 60px Fraunces"; x.save(); x.translate(150, 250); x.rotate(-Math.PI / 2); x.fillText('BRASIL', -100, 0); x.restore(); });
  const b = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, 12, 32), new THREE.MeshStandardMaterial({ map: bodyT })); b.position.y = 7; b.castShadow = true; rk.add(b); const nose = new THREE.Mesh(new THREE.ConeGeometry(.9, 2.4, 32), std('#C9472F')); nose.position.y = 14.2; rk.add(nose); for (let k = 0; k < 4; k++) { const f = box(.1, 2, 1.4, '#C9472F', Math.cos(k * 1.57) * 1, 1.8, Math.sin(k * 1.57) * 1); f.rotation.y = -k * 1.57; rk.add(f); }
  rk.position.set(2.5, 0, -12); c.add(rk);
  for (let k = 0; k < 8; k++) { c.add(box(.15, 16, .15, '#C9922E', 4.6, 8, -12.6 + (k % 2) * 1.2)); } for (let k = 0; k < 10; k++) c.add(box(1.4, .1, .1, '#C9922E', 4.6, k * 1.7, -12));
  const fum = smoke(c, 40, [2.5, .4, -12], { spread: 3, rise: 1.2, size: 4, col: '#E8E2DA', life: 3 });
  const placa = canvasTex(512, 256, (x) => { x.fillStyle = '#10162b'; x.fillRect(0, 0, 512, 256); x.fillStyle = '#F2C94C'; x.font = "700 120px 'IBM Plex Mono'"; x.textAlign = 'center'; x.fillText('T-10', 256, 165); }); const pm = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshBasicMaterial({ map: placa })); pm.position.set(-2.2, 3.6, -6); c.add(pm); c.add(box(.1, 3, .1, '#2a2a30', -2.2, 1.5, -6));
  const hero = makeChar({ outfit: 'jaleco', glow: .2, glasses: true }); hero.place(-.4, 1.2); c.add(hero.root); hero.tint('#FFE0C8');
  c.add(new THREE.HemisphereLight('#E6C8E6', '#7a4a3a', 1.0)); const sun = new THREE.DirectionalLight('#FFB070', 2.4); sun.position.set(-10, 8, 6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 20, bottom: -6, far: 60 }); c.add(sun);
  s.update = (t, u) => { fum(u); hero.face(s.camera); hero.pose({ armL: [40, -150], armR: [40, -150], head: Math.sin(u * 12) * 2 }); hero.eye(u < .8 ? 'look' : 'shut');
    const e = smooth(0, 1.95, u); aim(s.camera, [lerp(-1.0, -.8, e), lerp(1.4, 1.3, e), lerp(5.2, 4.6, e)], [lerp(.4, .6, e), lerp(3.2, 3.6, e), -8], .01);
    return { focus: lerp(3.9, 3.4, e), range: 2.0, blur: 14, bloom: .3, bloomT: .9, vig: .45, exposure: 1 }; };
  return s; }

/** 7. Chuva de meteoros sob o anel — 38.5 a 43.7 */
export function shotMeteoros(t0, t1) { const s = makeShot(t0, t1, '#141228', 40), c = s.scene; c.fog = new THREE.FogExp2('#2A2240', .012);
  skyAnel(c, -170, 520, 400, [[0, '#060820'], [.5, '#1A1A4A'], [.85, '#4A2E5E'], [1, '#7A4A6A']], { cx: 512, cy: 1250, rx: 340, ry: 709, band: 90, col: [236, 240, 255], a: 1, glow: .5 });
  const cb = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshStandardMaterial({ map: cobbleTex('#6A5E70', 14, 14), roughness: .9 })); cb.rotation.x = -Math.PI / 2; cb.receiveShadow = true; c.add(cb);
  skyline(c, -120, 400, 120, ['#2F2748', '#3B2F54', '#4A3A5E'], true, 6);
  const igreja = new THREE.Group(); igreja.add(box(6, 6, 4, '#E9E2D2', 0, 3, 0)); igreja.add(box(1.6, 4, 1.6, '#E9E2D2', -2, 8, 1)); igreja.add(box(1.6, 4, 1.6, '#E9E2D2', 2, 8, 1)); const dr = box(1.4, 2.6, .1, '#6E4A32', 0, 1.3, 2.02); igreja.add(dr); for (const x of [-2, 2]) { const w = box(.6, .8, .05, new THREE.MeshStandardMaterial({ color: '#FFD27A', emissive: '#FFB860', emissiveIntensity: 1 }), x, 7.8, 1.82); igreja.add(w); } igreja.position.set(0, 0, -16); c.add(igreja);
  for (let k = 0; k < 4; k++) { lamp(c, 4.5, -3 - k * 6, -1, true, 3); lamp(c, -4.5, -6 - k * 6, 1, true, 3); }
  const R = rng(6), spots = []; for (let i = 0; i < 70; i++) { const x = (R() - .5) * 12, z = -2 - R() * 10; if (Math.abs(x) < .9 && z > -3.5) continue; spots.push([x, z, 0, Math.PI]); } crowd(c, spots, { raised: .6, jump: .04, seed: 4, tint: '#C8C0E0' });
  const hero = makeChar({ outfit: 'hero', glow: .22 }); hero.place(0, 1.0); c.add(hero.root); hero.tint('#D9D2E4');
  const met = []; const mt = canvasTex(256, 32, (x) => { const g = x.createLinearGradient(0, 0, 256, 0); g.addColorStop(0, '#ffffff00'); g.addColorStop(.85, '#FFE6C0cc'); g.addColorStop(1, '#ffffff'); x.fillStyle = g; x.fillRect(0, 8, 256, 16); });
  for (let i = 0; i < 16; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(10, .5), new THREE.MeshBasicMaterial({ map: mt, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); m.renderOrder = 5; c.add(m); met.push({ m, at: .2 + i * .3 + R() * .2, x: (R() - .5) * 40, y: 16 + R() * 10, z: -36 - R() * 14, a: -.5 - R() * .3 }); }
  c.add(new THREE.HemisphereLight('#7E7AB8', '#2a1f28', .8)); const moon = new THREE.DirectionalLight('#DCE4FF', 1.0); moon.position.set(-4, 20, 6); moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, far: 60 }); c.add(moon);
  s.update = (t, u) => { uT.value = t; met.forEach(p => { const k = (u - p.at) / 1.2; p.m.visible = k > 0 && k < 1; if (p.m.visible) { p.m.position.set(p.x + k * 22 * Math.cos(p.a), p.y + k * 22 * Math.sin(p.a), p.z); p.m.rotation.z = p.a; p.m.material.opacity = Math.sin(k * Math.PI); } });
    hero.face(s.camera); hero.pose({ armL: [8, 6], armR: [lerp(8, 120, smooth(.8, 1.1, u)), 20], head: 10 }); hero.eye(u < .8 ? 'look' : 'wide');
    const e = smooth(0, 5.2, u); aim(s.camera, [lerp(.4, .1, e), lerp(1.2, 1.0, e), lerp(4.6, 5.2, e)], [0, lerp(2.4, 5.5, e), -12], -.01);
    return { focus: lerp(3.7, 4.3, e), range: 2.4, blur: 13, bloom: .5, bloomT: .8, vig: .5, exposure: 1 }; };
  return s; }

/** 8a. Talvez já tenha acontecido: a Terra antiga, sem gente — 43.7 a 46.8 */
export function shotAntiga(t0, t1) { const s = makeShot(t0, t1, '#B89A70', 40), c = s.scene; c.fog = new THREE.FogExp2('#C8A880', .012);
  skyAnel(c, -160, 520, 380, [[0, '#5A4A3A'], [.5, '#A8865E'], [1, '#E8CFA0']], { cx: 512, cy: 1250, rx: 340, ry: 709, band: 90, col: [255, 240, 210], a: .85, glow: .3, tilt: .05 });
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(400, 200), new THREE.MeshStandardMaterial({ color: '#5A6A6A', roughness: .2, metalness: .4 })); sea.rotation.x = -Math.PI / 2; sea.position.set(0, .02, -110); c.add(sea);
  const rk = new THREE.Mesh(new THREE.PlaneGeometry(80, 30), new THREE.MeshStandardMaterial({ color: '#7A6A5A', roughness: 1 })); rk.rotation.x = -Math.PI / 2; rk.position.z = -5; rk.receiveShadow = true; c.add(rk);
  const R = rng(3); for (let i = 0; i < 40; i++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(.3 + R() * 1.2, 0), new THREE.MeshStandardMaterial({ color: ['#6A5A4A', '#7E6E5C', '#5A4E42'][i % 3], flatShading: true, roughness: 1 })); r.position.set((R() - .5) * 30, 0, -2 - R() * 16); r.scale.y = .5 + R() * .6; r.rotation.y = R() * 6; r.castShadow = r.receiveShadow = true; c.add(r); }
  for (let i = 0; i < 12; i++) { const st = new THREE.Mesh(new THREE.CylinderGeometry(.35, .5, .5, 14), std('#8A7A5A')); st.position.set(-4 + (i % 4) * 2.2 + R() * .5, .2, 1 - Math.floor(i / 4) * 1.6); st.castShadow = true; c.add(st); }
  c.add(new THREE.HemisphereLight('#F2DCB0', '#5a4a3a', 1.0)); const sun = new THREE.DirectionalLight('#FFE0A8', 2.2); sun.position.set(-12, 10, -20); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, far: 70 }); c.add(sun);
  s.update = (t, u) => { const e = smooth(0, 3.1, u); aim(s.camera, [lerp(0, .3, e), lerp(1.2, 2.2, e), lerp(5, 2.6, e)], [0, lerp(2.0, 4.5, e), -20], -.01);
    return { focus: 12, range: 16, blur: 10, bloom: .3, bloomT: .9, vig: .5, exposure: 1, sat: .75, tint: '#FFF0DC' }; };
  return s; }

/** 8b. Laboratório: 21 crateras perto do Equador — 46.8 a 55.5 */
export function shotLab(t0, t1) { const s = makeShot(t0, t1, '#1A2236', 38), c = s.scene; c.fog = new THREE.FogExp2('#243048', .03);
  c.add(tileFloor(14, 14, '#2E3648', '#283040', 1));
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(14, 5), wallMat('#2E4A5E', '#28425A', '#365A6E', 5, 2)); wall.position.set(0, 2.5, -2.6); wall.receiveShadow = true; c.add(wall);
  const mapa = canvasTex(1024, 512, (x) => { x.fillStyle = '#0E2236'; x.fillRect(0, 0, 1024, 512); x.strokeStyle = '#36AEA2'; x.lineWidth = 2; for (let i = 0; i <= 12; i++) { x.beginPath(); x.moveTo(i * 85, 0); x.lineTo(i * 85, 512); x.stroke(); } for (let k = 0; k <= 6; k++) { x.beginPath(); x.moveTo(0, k * 85); x.lineTo(1024, k * 85); x.stroke(); } x.strokeStyle = '#F2C94C'; x.lineWidth = 5; x.beginPath(); x.moveTo(0, 256); x.lineTo(1024, 256); x.stroke(); x.fillStyle = '#F2C94C'; x.font = "700 30px 'IBM Plex Mono'"; x.fillText('EQUADOR', 20, 245); x.fillStyle = '#4A6A5A'; for (const [a, b, r] of [[200, 330, 80], [420, 160, 110], [640, 380, 70], [820, 220, 90]]) { x.beginPath(); x.ellipse(a, b, r * 1.4, r, 0, 0, 7); x.fill(); } }); const mm = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.8), new THREE.MeshStandardMaterial({ map: mapa, emissiveMap: mapa, emissive: new THREE.Color(.5, .5, .5) })); mm.position.set(-.4, 2.5, -2.55); c.add(mm);
  // globo na mesa com 21 pontos vermelhos perto do Equador
  c.add(box(2.4, .08, 1.0, '#6E727A', .2, .9, -.9)); c.add(box(.08, .88, .08, '#3a3e46', -.9, .44, -.5)); c.add(box(.08, .88, .08, '#3a3e46', 1.3, .44, -.5));
  const globo = new THREE.Group(); const gs = new THREE.Mesh(new THREE.SphereGeometry(.32, 48, 32), new THREE.MeshStandardMaterial({ map: earthTex(), roughness: .6 })); globo.add(gs); const R = rng(21); const pts = []; for (let i = 0; i < 21; i++) { const lat = (R() - .5) * .9, lon = R() * 6.28; const p = new THREE.Mesh(new THREE.SphereGeometry(.018, 10, 8), new THREE.MeshBasicMaterial({ color: '#FF3A2A' })); p.position.set(Math.cos(lat) * Math.cos(lon) * .325, Math.sin(lat) * .325, Math.cos(lat) * Math.sin(lon) * .325); globo.add(p); pts.push({ p, at: 1.9 + i * .06 }); } const eq = new THREE.Mesh(new THREE.TorusGeometry(.33, .004, 6, 64), new THREE.MeshBasicMaterial({ color: '#F2C94C' })); eq.rotation.x = Math.PI / 2; globo.add(eq);
  globo.position.set(.75, 1.32, -.9); globo.rotation.z = .41; c.add(globo); c.add(box(.06, .1, .06, '#C9922E', .75, .99, -.9)); const gg = glowSprite('#FF6A5A', .9, 0); gg.position.set(.75, 1.32, -.8); c.add(gg);
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(.12, 0), new THREE.MeshStandardMaterial({ color: '#6A5A4A', flatShading: true })); rock.position.set(-.4, 1.02, -.8); c.add(rock); const lupa = new THREE.Mesh(new THREE.TorusGeometry(.08, .012, 8, 24), std('#2a2a30')); lupa.position.set(-.15, 1.0, -.7); lupa.rotation.x = 1.4; c.add(lupa);
  const cien = makeChar({ outfit: 'jaleco', hair: 'bun', hairc: '#3a2418', lash: true, glasses: true, glow: .1 }); cien.place(-.3, -1.6); c.add(cien.root); cien.tint('#EEF2FA');
  const cien2 = makeChar({ outfit: 'jaleco', hair: 'old', glasses: true }); cien2.place(-1.5, -1.9); c.add(cien2.root); cien2.tint('#EEF2FA');
  c.add(new THREE.HemisphereLight('#C8D6E6', '#1a2030', .7)); const key = new THREE.SpotLight('#FFF0DC', 40, 12, .6, .4, 1.2); key.position.set(1, 4.5, 2.5); key.target.position.set(0, 1, -1); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); c.add(key, key.target);
  beam(c, .8, 2.4, -.8, 1.0, 4.4, -.3, .1);
  s.update = (t, u) => { globo.rotation.y = u * .25; pts.forEach(q => { q.p.visible = u > q.at; q.p.scale.setScalar(u > q.at ? 1 + Math.max(0, .4 - (u - q.at)) * 2 : 1); }); gg.material.opacity = u > 1.9 ? .35 + .1 * Math.sin(u * 4) : 0;
    cien.face(s.camera); cien2.face(s.camera); cien.pose({ armL: [8, 6], armR: [lerp(8, 70, smooth(1.6, 1.9, u)), lerp(6, -30, smooth(1.6, 1.9, u))], head: 4 }); cien.eye(u < 1.8 ? 'look' : u < 3.8 ? 'wide' : 'smug'); cien2.pose({ armL: [30, -130], armR: [30, -130] }); cien2.eye(u < 3.8 ? 'lookl' : 'wide');
    const e = smooth(0, 6.2, u), z = smooth(6.4, 7.6, u); aim(s.camera, [lerp(-.6, -.2, e) + z * .7, lerp(1.6, 1.55, e) - z * .1, lerp(4.4, 3.8, e) - z * 2.0], [lerp(-.2, .1, e) + z * .6, lerp(1.6, 1.5, e) - z * .2, -1.2 + z * .3], .01);
    return { focus: lerp(4.2, 3.6, e) - z * 2.2, range: lerp(2.2, 1.0, z), blur: 14, bloom: .3, bloomT: .9, vig: .5, exposure: 1 }; };
  return s; }

/** 9. A hipótese: a Terra antiga com um anel — 55.5 a 59.6 */
export function shotAnelAntigo(t0, t1) { const s = makeShot(t0, t1, '#02030A', 34), c = s.scene; s.camera.far = 2400; s.camera.updateProjectionMatrix(); stars(c, 3000, 900, 2);
  const T = terraComAnel(c, 10, 18); T.terra.material.map = canvasTex(1024, 512, (x) => { x.fillStyle = '#2A4A7A'; x.fillRect(0, 0, 1024, 512); const R = rng(5); x.fillStyle = '#8A7A5A'; for (let i = 0; i < 14; i++) { x.beginPath(); x.ellipse(R() * 1024, 120 + R() * 300, 40 + R() * 110, 20 + R() * 50, R() * 3, 0, 7); x.fill(); } x.fillStyle = '#ffffff22'; for (let i = 0; i < 60; i++) { x.beginPath(); x.ellipse(R() * 1024, R() * 512, 30 + R() * 80, 6 + R() * 10, 0, 0, 7); x.fill(); } });
  const sun = new THREE.DirectionalLight('#FFF0D8', 3.0); sun.position.set(50, 18, 30); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 200 }); c.add(sun); c.add(new THREE.AmbientLight('#20283a', .5));
  const R = rng(7); const deb = []; for (let i = 0; i < 160; i++) { const m = new THREE.Mesh(new THREE.DodecahedronGeometry(.08 + R() * .25, 0), new THREE.MeshStandardMaterial({ color: '#8A7A6A', flatShading: true })); c.add(m); deb.push({ m, a: R() * 6.28, r: 16 + R() * 10, y: (R() - .5) * .6, sp: .25 + R() * .3 }); }
  const rad = 18 * Math.PI / 180;
  s.update = (t, u) => { const form = smooth(0, 2.4, u); T.anel.material.opacity = form; T.anel.visible = form > .02; deb.forEach(d => { const a = d.a + u * d.sp; const p = new THREE.Vector3(Math.cos(a) * d.r, d.y * (1 - form) * 6, Math.sin(a) * d.r); p.applyAxisAngle(new THREE.Vector3(0, 0, 1), rad); d.m.position.copy(p); d.m.rotation.set(u, u * .7, 0); d.m.visible = form < .95; });
    const e = smooth(0, 4.1, u); aim(s.camera, [lerp(28, 46, e), lerp(20, 26, e), lerp(32, 44, e)], [0, -1, 0], 0);
    return { focus: 60, range: 50, blur: 6, bloom: .5, bloomT: .8, vig: .5, exposure: 1, sat: .85, tint: '#FFF4E6' }; };
  return s; }

/** 10. A janela de novo: agora você fecha a cortina pra dormir — 59.6 ao fim */
export function shotCortina(t0, t1) { const s = makeShot(t0, t1, '#141A3A', 38), c = s.scene; c.fog = new THREE.FogExp2('#1A2040', .01);
  const q = quartoJanela(c, true);
  skyAnel(c, -9, 26, 20, [[0, '#070B22'], [.6, '#141E4A'], [1, '#2A3A6E']], { cx: 512, cy: 1150, rx: 260, ry: 450, band: 70, col: [240, 244, 255], a: 1, glow: .7, tilt: -.1 }, (x) => { x.fillStyle = '#20284A'; for (let i = 0; i < 30; i++) { const w = 20 + (i * 37 % 40), h = 60 + (i * 53 % 160); x.fillRect(i * 36, 1024 - h - 330, w, h + 330); x.fillStyle = '#FFD27A'; for (let k = 0; k < 6; k++) x.fillRect(i * 36 + 6, 1024 - h - 300 + k * 30, 6, 8); x.fillStyle = '#20284A'; } }, .35);
  c.add(new THREE.HemisphereLight('#5A66A8', '#1a1a30', .6)); const ringL = new THREE.SpotLight('#DCE4FF', 90, 14, .5, .4, 1.1); ringL.position.set(.4, 4.2, -6); ringL.target.position.set(0, 0, .5); ringL.castShadow = true; ringL.shadow.mapSize.set(2048, 2048); c.add(ringL, ringL.target);
  const bm = beam(c, 0, 1.4, -1.2, 1.8, 3.6, 0, .22, '#DCE4FF'); const wg = glowSprite('#DCE4FF', 3.4, .5); wg.position.set(0, 1.85, -2.7); c.add(wg);
  const hero = makeChar({ outfit: 'azul', glow: .16 }); hero.place(.15, -1.25); c.add(hero.root); hero.tint('#E6ECFF');
  const touca = cut(canvasTex(256, 200, (x) => { x.fillStyle = '#7A3A6A'; x.beginPath(); x.ellipse(128, 150, 120, 110, 0, Math.PI, 0); x.fill(); x.fillStyle = '#F2C94C'; for (let i = 0; i < 6; i++) { x.beginPath(); x.arc(40 + i * 36, 100 + (i % 2) * 20, 8, 0, 7); x.fill(); } }), .62, .48, {}); touca.position.set(0, .3, .02); hero.head.add(touca);
  s.update = (t, u) => { const k = smooth(1.6, 3.4, u); q.setCortina(k); ringL.intensity = 90 * (1 - k * .93); bm.material.opacity = .22 * (1 - k); wg.material.opacity = .5 * (1 - k);
    hero.face(s.camera); const pull = smooth(1.3, 1.6, u) * (1 - smooth(3.6, 4.0, u)); hero.pose({ armL: [lerp(8, 120, pull), lerp(6, 10, pull)], armR: [lerp(8, 120, pull), lerp(6, 10, pull)], head: u > 4 ? -6 : 0 }); hero.eye(u < 1.2 ? 'flat' : u < 3.6 ? 'angry' : u < 4.6 ? 'happy' : 'shut');
    const e = smooth(0, 7.5, u); aim(s.camera, [lerp(.3, .1, e), lerp(1.35, 1.4, e), lerp(3.4, 2.7, e)], [.1, lerp(1.6, 1.5, e), -2.6], .01);
    return { focus: lerp(4.4, 3.8, e), range: 1.8, blur: 14, bloom: lerp(.45, .25, k), bloomT: .85, vig: lerp(.45, .65, k), exposure: lerp(1, .8, k) }; };
  return s; }
