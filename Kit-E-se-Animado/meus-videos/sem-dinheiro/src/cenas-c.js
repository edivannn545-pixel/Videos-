import * as THREE from 'three';
import { makeShot, aim, keys, smooth, lerp, clamp, rng } from './motor/core.js';
import { makeChar, canvasTex } from './motor/char.js';
import { box, std, cut, glowSprite, dissolve, building, skyline, sky, lamp, tree } from './motor/kit.js';
import { crowd, uT, cobbleTex } from './motor/kit2.js';
import { quarto, walletTex, billTex, blinds, beam, naMao, tileFloor } from './comum.js';

/** 9. Cofre: um montinho de papel e um paredão de números — 51.0 a 57.5 */
export function shotTela(t0, t1) { const s = makeShot(t0, t1, '#070B18', 40), c = s.scene; c.fog = new THREE.FogExp2('#0B1226', .03);
  const fl = tileFloor(30, 30, '#1C2436', '#161D2C', 2); c.add(fl);
  // paredão de telas
  const sc = document.createElement('canvas'); sc.width = 1024; sc.height = 1024; const sx = sc.getContext('2d'); const st = new THREE.CanvasTexture(sc); st.colorSpace = THREE.SRGBColorSpace; const R0 = rng(4); const rows = []; for (let i = 0; i < 26; i++) rows.push({ v: Math.floor(R0() * 1e9), d: R0() < .5 ? 1 : -1, x: R0() * 600 });
  let lastF = -1; const paint = (f) => { if (f === lastF) return; lastF = f; sx.fillStyle = '#06101E'; sx.fillRect(0, 0, 1024, 1024); sx.font = "600 34px 'IBM Plex Mono'"; rows.forEach((r, i) => { const v = r.v + r.d * f * 137911 * (i + 1); sx.fillStyle = i % 5 === 0 ? '#F2C94C' : i % 3 ? '#4FE0C8' : '#7FB6FF'; sx.fillText('R$ ' + Math.abs(v).toLocaleString('pt-BR') + ',' + String(Math.abs(v) % 100).padStart(2, '0'), 30 + (i % 2) * 520, 40 + i * 38); }); st.needsUpdate = true; }; paint(0);
  for (let i = 0; i < 5; i++) for (let k = 0; k < 4; k++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.5), new THREE.MeshBasicMaterial({ map: st, color: new THREE.Color().setHSL(.5, .3, .75 + ((i + k) % 3) * .08) })); m.position.set(-4.8 + i * 2.4, .95 + k * 1.6, -5); c.add(m); c.add(box(2.38, 1.58, .1, '#1A1E28', -4.8 + i * 2.4, .95 + k * 1.6, -5.07, false)); }
  const wl = new THREE.PointLight('#4FE0C8', 30, 14, 1.2); wl.position.set(0, 3, -3.5); c.add(wl); const wg = glowSprite('#4FE0C8', 14, .18); wg.position.set(0, 3.2, -4.8); c.add(wg);
  // pedestal com o montinho de notas (os ~10% de papel)
  c.add(box(.7, 1.0, .7, '#2A3246', 0, .5, -.6)); c.add(box(.8, .06, .8, '#8A6A2A', 0, 1.03, -.6)); const bt = billTex(); for (let k = 0; k < 7; k++) { const m = cut(bt, .34, .16, {}); m.rotation.x = -Math.PI / 2; m.rotation.z = (k % 3 - 1) * .2; m.position.set(0, 1.07 + k * .012, -.6); c.add(m); }
  const spot = new THREE.SpotLight('#FFE6B8', 14, 8, .25, .4, 1.2); spot.position.set(0, 5, -.3); spot.target.position.set(0, 1, -.6); spot.castShadow = true; c.add(spot, spot.target); beam(c, 0, 3.0, -.6, .9, 4.2, 0, .14);
  // vidro desfocado na frente (grades do cofre)
  for (let i = -3; i <= 3; i++) c.add(box(.06, 5, .06, '#C9A65A', i * .55 + .2, 2.5, 3.0));
  const hero = makeChar({ outfit: 'hero', glow: .18 }); hero.place(-.8, .6); c.add(hero.root); hero.tint('#CFF2EC');
  c.add(new THREE.HemisphereLight('#3A5A8A', '#0a0a14', .5));
  s.update = (t, u) => { paint(Math.floor(u * 8)); hero.face(s.camera); const up = smooth(3.5, 4.0, u); hero.pose({ armL: [8, 6], armR: [lerp(8, 50, up), lerp(6, -60, up)], head: up * 6 }); hero.eye(u < 1.2 ? 'down' : u < 3.5 ? 'look' : 'wide');
    const e = smooth(0, 6.5, u); aim(s.camera, [lerp(.3, -.2, e), lerp(1.6, 1.7, e), lerp(3.0, 6.6, e)], [lerp(0, -.2, e), lerp(1.1, 2.0, e), lerp(-.6, -2.5, e)], -.01);
    return { focus: lerp(3.6, 6.4, e), range: lerp(1.0, 4.0, e), blur: 16, bloom: .5, bloomT: .7, bloomR: .8, vig: .55, exposure: 1 }; };
  return s; }

/** 10. A praça: todo mundo combinou de acreditar — 57.5 a 62.3 */
export function shotIdeia(t0, t1) { const s = makeShot(t0, t1, '#F1C39A', 40), c = s.scene; c.fog = new THREE.FogExp2('#F7CFA4', .0065);
  sky(c, -170, 460, 340, [[0, '#4C4A8E'], [.45, '#C07A9A'], [.75, '#F6A27A'], [1, '#FCD9A0']]); skyline(c, -140, 400, 150, ['#9A6A8A', '#8A5E82', '#7A527A'], false, 7);
  const cb = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshStandardMaterial({ map: cobbleTex('#B59A84', 14, 14), roughness: .9 })); cb.rotation.x = -Math.PI / 2; cb.receiveShadow = true; c.add(cb);
  let z = 6, i = 0; while (z > -40) { const d = 7 + (i * 37 % 5); c.add(building(700 + i, { x: 17, z: z - d / 2, w: 8, d, floors: 3 + i % 3, side: -1, night: false })); c.add(building(800 + i, { x: -17, z: z - d / 2, w: 8, d, floors: 4 + i % 2, side: 1, night: false })); z -= d; i++; }
  for (let k = 0; k < 4; k++) { lamp(c, 9, -2 - k * 9, -1, true, 3); lamp(c, -9, -6 - k * 9, 1, true, 3); }
  // moeda gigante flutuando, feita de luz
  const coinT = canvasTex(512, 512, (x) => { const g = x.createRadialGradient(220, 200, 20, 256, 256, 256); g.addColorStop(0, '#FFF2B8'); g.addColorStop(.7, '#EAB43E'); g.addColorStop(1, '#B47A1E'); x.fillStyle = g; x.beginPath(); x.arc(256, 256, 250, 0, 7); x.fill(); x.strokeStyle = '#A86E1A'; x.lineWidth = 14; x.beginPath(); x.arc(256, 256, 210, 0, 7); x.stroke(); x.fillStyle = '#A86E1A'; x.font = "900 230px Fraunces"; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('R$', 256, 270); });
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, .4, 64), [std('#C9922E', { metalness: .6, roughness: .3, emissive: '#5a3a08' }), new THREE.MeshStandardMaterial({ map: coinT, emissiveMap: coinT, emissive: new THREE.Color(.7, .6, .4), metalness: .3, roughness: .4 }), new THREE.MeshStandardMaterial({ map: coinT })]); coin.rotation.x = Math.PI / 2; coin.position.set(0, 9, -18); c.add(coin); const cg = glowSprite('#FFD27A', 16, .55); cg.position.set(0, 9, -17.6); c.add(cg); const cl = new THREE.PointLight('#FFD27A', 60, 30, 1.2); cl.position.set(0, 8, -15); c.add(cl);
  const sp = dissolve(c, { pos: [0, 9, -17.6], spread: 3, rise: 3, t0: 3.2, dur: 1.6, n: 260, size: .12, color: '#FFE6A0', seed: 3 });
  const R = rng(11), spots = []; for (let k = 0; k < 900; k++) { const x = (R() - .5) * 24, zz = 4 - R() ** 1.1 * 22; if (Math.abs(x) < 1.2 && zz > 1) continue; spots.push([x, zz, 0, Math.PI]); } crowd(c, spots, { raised: .65, jump: .14, seed: 4, tint: '#FFE6D2' });
  const hero = makeChar({ outfit: 'hero', glow: .2 }); hero.place(.2, .6); c.add(hero.root); hero.tint('#FFEEDC');
  c.add(new THREE.HemisphereLight('#E6C8E6', '#7a4a3a', 1.0)); const sun = new THREE.DirectionalLight('#FFB070', 2.2); sun.position.set(10, 9, -30); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, far: 80 }); c.add(sun);
  s.update = (t, u) => { uT.value = t; sp(u); coin.rotation.z = Math.sin(u * .8) * .15; const fade = smooth(3.2, 4.4, u); coin.scale.setScalar(1 - fade * .9); cg.material.opacity = .55 * (1 - fade); cl.intensity = 60 * (1 - fade);
    hero.face(s.camera); hero.pose({ armL: [8, 6], armR: [lerp(8, 140, smooth(.6, 1.0, u)), 20], head: 8 }); hero.eye(u < 3.4 ? 'happy' : 'wide');
    const e = smooth(0, 4.8, u); aim(s.camera, [lerp(.8, .4, e), lerp(1.5, 1.2, e), lerp(5.4, 4.4, e)], [lerp(.2, 0, e), lerp(3.2, 4.6, e), -18], -.01);
    return { focus: lerp(4.8, 3.8, e), range: 2.6, blur: 13, bloom: .4, bloomT: .85, vig: .4, exposure: 1.0 }; };
  return s; }

/** 11. De volta ao quarto: a carteira agora guarda sardinha — 62.3 ao fim */
export function shotFinal(t0, t1) { const s = makeShot(t0, t1, '#1E2038', 38), c = s.scene; c.fog = new THREE.FogExp2('#2a2438', .012);
  quarto(c); c.add(new THREE.HemisphereLight('#8E9AD0', '#3a2a22', .95)); blinds(c, 6.5, 4.2, 2.5, -.4, 0, -.6, '#FFC98A', 20); beam(c, 1.6, 2.1, .6, 1.2, 4.6, -.9, .1);
  const hero = makeChar({ outfit: 'hero', glow: .16 }); hero.place(.6, -.6); c.add(hero.root); hero.tint('#E9E3DA');
  const wal = cut(walletTex(true), .6, .445, { shadow: true }); naMao(hero, 'L', wal, -175, .05);
  const sh = glowSprite('#FFF2C8', .9, 0); sh.position.set(0, -175 / 420, .08); hero.arms.L.f.add(sh);
  s.update = (t, u) => { const up = smooth(.2, .7, u); const aL = [lerp(8, 34, up), lerp(6, -112, up)]; hero.pose({ armL: aL, armR: [lerp(8, 60, smooth(1.6, 2.0, u)), lerp(6, -110, smooth(1.6, 2.0, u))], head: u > 2.6 ? -6 : 0 }); wal.rotation.z = (aL[0] + aL[1]) * Math.PI / 180; sh.material.opacity = smooth(.6, 1.0, u) * (.5 + .1 * Math.sin(u * 8));
    hero.face(s.camera); hero.eye(u < 1.0 ? 'down' : u < 2.6 ? 'happy' : 'smug');
    const e = smooth(0, 5.2, u); aim(s.camera, [lerp(1.2, .85, e), lerp(1.25, 1.2, e), lerp(3.6, 2.6, e)], [.6, lerp(1.1, 1.15, e), -.6], .012);
    return { focus: lerp(4.3, 3.2, e), range: 1.4, blur: 16, bloom: .26, bloomT: .95, vig: .5, exposure: 1 }; };
  return s; }
