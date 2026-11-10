import * as THREE from 'three';
import { makeShot, aim, keys, smooth, lerp, clamp, rng } from './motor/core.js';
import { makeChar, canvasTex } from './motor/char.js';
import { box, std, cut, glowSprite, building, street, lamp, tree, car, skyline, sky } from './motor/kit.js';
import { crowd, uT, cobbleTex } from './motor/kit2.js';
import { woodFloor, tileFloor, wallMat, beam, naMao } from './comum.js';
import { balao, animaBalao, ICONES } from './balao.js';

const D = Math.PI / 180;
const pasta = () => cut(canvasTex(200, 160, (x) => { x.fillStyle = '#5A3420'; x.beginPath(); x.roundRect(10, 40, 180, 110, 12); x.fill(); x.strokeStyle = '#5A3420'; x.lineWidth = 12; x.strokeRect(70, 14, 60, 30); x.fillStyle = '#E9C94A'; x.fillRect(90, 80, 20, 16); }), .36, .29, { shadow: true });

function elevador(c, andar) {
  const steel = canvasTex(256, 512, (x) => { const g = x.createLinearGradient(0, 0, 256, 0); g.addColorStop(0, '#9AA2AC'); g.addColorStop(.5, '#C9CFD6'); g.addColorStop(1, '#8E96A0'); x.fillStyle = g; x.fillRect(0, 0, 256, 512); for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(255,255,255,${Math.random() * .06})`; x.fillRect(Math.random() * 256, 0, 1, 512); } });
  const wood = canvasTex(256, 512, (x) => { x.fillStyle = '#8A5A36'; x.fillRect(0, 0, 256, 512); for (let i = 0; i < 40; i++) { x.strokeStyle = `rgba(40,20,10,${.1 + (i % 3) * .05})`; x.lineWidth = 2; x.beginPath(); x.moveTo(i * 7, 0); x.bezierCurveTo(i * 7 + 10, 200, i * 7 - 8, 340, i * 7 + 4, 512); x.stroke(); } x.fillStyle = '#6E4428'; x.fillRect(0, 250, 256, 10); });
  const fl = tileFloor(2.2, 2.2, '#3A3E46', '#2E3238', .5); c.add(fl);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.7), new THREE.MeshStandardMaterial({ map: steel, roughness: .35, metalness: .4 })); back.position.set(0, 1.35, -1.1); c.add(back);
  for (const sx of [-1, 1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.7), new THREE.MeshStandardMaterial({ map: wood, roughness: .6 })); w.rotation.y = -sx * Math.PI / 2; w.position.set(sx * 1.1, 1.35, 0); w.receiveShadow = true; c.add(w); c.add(box(.04, .06, 2.0, '#D8D2C4', sx * 1.06, .95, 0)); }
  c.add(box(2.2, .06, 2.2, '#2A2A30', 0, 2.7, 0, false)); for (const x of [-.5, .5]) { const l = box(.6, .03, .6, new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#FFF2DC', emissiveIntensity: .9 }), x, 2.66, -.1, false); c.add(l); }
  const pl = new THREE.PointLight('#FFF0D8', 3, 6, 1.4); pl.position.set(0, 2.4, 0); pl.castShadow = true; pl.shadow.mapSize.set(1024, 1024); c.add(pl);
  // painel de botões e visor do andar
  const pn = canvasTex(160, 512, (x) => { x.fillStyle = '#B9C0C8'; x.fillRect(0, 0, 160, 512); x.fillStyle = '#111'; x.fillRect(20, 20, 120, 70); x.fillStyle = '#FF6A3A'; x.font = "700 60px 'IBM Plex Mono'"; x.textAlign = 'center'; x.fillText(andar, 80, 76); for (let i = 0; i < 10; i++) { const a = 50 + (i % 2) * 60, b = 140 + Math.floor(i / 2) * 64; x.fillStyle = i === 7 ? '#FFD27A' : '#E9ECEF'; x.beginPath(); x.arc(a, b, 20, 0, 7); x.fill(); x.fillStyle = '#333'; x.font = "700 20px Inter"; x.fillText(String(i + 1), a, b + 7); } });
  const pm = new THREE.Mesh(new THREE.PlaneGeometry(.26, .8), new THREE.MeshStandardMaterial({ map: pn, emissiveMap: pn, emissive: new THREE.Color(.3, .3, .3) })); pm.rotation.y = -Math.PI / 2; pm.position.set(1.08, 1.35, .6); c.add(pm);
  // espelho/aviso e moldura da porta (primeiro plano)
  const av = canvasTex(256, 180, (x) => { x.fillStyle = '#F6F1E4'; x.fillRect(0, 0, 256, 180); x.fillStyle = '#2E3648'; x.font = "800 30px Inter"; x.textAlign = 'center'; x.fillText('CAPACIDADE', 128, 60); x.font = "900 60px Fraunces"; x.fillText('8', 128, 130); }); const avm = new THREE.Mesh(new THREE.PlaneGeometry(.3, .21), new THREE.MeshStandardMaterial({ map: av })); avm.position.set(.7, 1.9, -1.09); c.add(avm);
  for (const sx of [-1, 1]) c.add(box(.5, 2.8, .2, '#7A828C', sx * 1.25, 1.4, 1.15)); c.add(box(3, .4, .2, '#7A828C', 0, 2.9, 1.15));
  c.add(new THREE.HemisphereLight('#E6ECF2', '#4a3a30', .7));
}

/** 1. Elevador: "de novo esse chato" — 0 a 4.95 */
export function shotElevador(t0, t1) { const s = makeShot(t0, t1, '#2A2A30', 38), c = s.scene; elevador(c, '7');
  const hero = makeChar({ outfit: 'hero', glow: .14 }); hero.place(-.42, -.35); c.add(hero.root); hero.tint('#FFF4E6');
  const viz = makeChar({ outfit: 'terno2', glasses: true }); viz.place(.42, -.45); c.add(viz.root); viz.tint('#FFF4E6'); const pa = pasta(); naMao(viz, 'R', pa, -170, .04);
  const b = balao({ texto: 'De novo|esse chato' }, 1.0); c.add(b); const glow = glowSprite('#7FE6D6', 1.6, 0); c.add(glow);
  s.update = (t, u) => { hero.face(s.camera); viz.face(s.camera);
    hero.pose({ armL: [8, 6], armR: [8, 6], head: u > 3.2 ? 6 : 0 }); hero.eye(u < 1.4 ? 'open' : u < 3.1 ? 'lookl' : u < 3.6 ? 'wide' : 'look');
    viz.pose({ armL: [8, 6], armR: [10, 4], head: -3 }); viz.eye(u < 2.0 ? 'look' : 'flat');
    const e = smooth(0, 4.95, u); aim(s.camera, [lerp(.15, .1, e), lerp(1.5, 1.65, e), lerp(4.2, 3.7, e)], [.05, lerp(1.45, 1.65, e), -.4], .01);
    animaBalao(b, u, 3.1, 999, s.camera, [.3, 2.3, -.4]); glow.position.set(.3, 2.3, -.5); glow.material.opacity = u > 3.1 ? .25 : 0;
    return { focus: lerp(4.4, 3.9, e), range: 1.4, blur: 15, bloom: .3, bloomT: .9, vig: .5, exposure: 1 }; };
  return s; }

/** 10. Elevador no dia seguinte: "bom dia!" — 55.9 ao fim */
export function shotElevadorFim(t0, t1) { const s = makeShot(t0, t1, '#2A2A30', 38), c = s.scene; elevador(c, '7');
  const hero = makeChar({ outfit: 'hero', glow: .18 }); hero.place(-.42, -.35); c.add(hero.root); hero.tint('#FFF4E6');
  const viz = makeChar({ outfit: 'terno2', glasses: true }); viz.place(.42, -.45); c.add(viz.root); viz.tint('#FFF4E6'); const pa = pasta(); naMao(viz, 'R', pa, -170, .04);
  const b = balao({ texto: 'Bom dia!' }, 1.0); c.add(b); const hearts = []; for (let i = 0; i < 6; i++) { const h = balao({ icon: 'coracao' }, .22); c.add(h); hearts.push(h); }
  const pink = new THREE.PointLight('#FF8AB0', 0, 4); pink.position.set(-.4, 1.8, .6); c.add(pink);
  s.update = (t, u) => { hero.face(s.camera); viz.face(s.camera); const love = smooth(6.0, 6.4, u);
    hero.pose({ armL: [lerp(8, 30, love), lerp(6, -120, love)], armR: [lerp(8, 30, love), lerp(6, -120, love)], head: love * 8, bob: love * Math.abs(Math.sin(u * 5)) * .03 }); hero.eye(u < 2.8 ? 'look' : u < 4.1 ? 'lookl' : u < 6.0 ? 'wide' : 'heart');
    viz.pose({ armL: [8, 6], armR: [10, 4], head: u > 4.1 ? 4 : -2 }); viz.eye(u < 4.1 ? 'flat' : 'happy');
    const e = smooth(0, 9.4, u); aim(s.camera, [lerp(.1, 0, e), lerp(1.65, 1.65, e), lerp(3.9, 3.3, e)], [.05, lerp(1.65, 1.75, e), -.4], .01);
    animaBalao(b, u, 4.1, 999, s.camera, [.3, 2.3, -.4]);
    hearts.forEach((h, i) => { const k = (u - 6.1 - i * .25); h.visible = k > 0; if (k > 0) { const f = (k % 2.2) / 2.2; h.position.set(-.42 + Math.sin(i * 2 + k * 2) * .35, 2.0 + f * .9, -.2); h.quaternion.copy(s.camera.quaternion); h.scale.setScalar(Math.min(1, k * 5) * (1 - f * .4)); } });
    pink.intensity = love * 3;
    return { focus: lerp(4.1, 3.5, e), range: 1.4, blur: 15, bloom: .32, bloomT: .9, vig: .5, exposure: 1, tint: love > 0 ? '#FFF0F4' : '#ffffff' }; };
  return s; }

/** 2. A praça à noite: todo mundo pensa — 4.95 a 7.7 */
export function shotPraca(t0, t1) { const s = makeShot(t0, t1, '#141228', 40), c = s.scene; c.fog = new THREE.FogExp2('#2A2240', .016);
  sky(c, -170, 460, 340, [[0, '#0E1030'], [.5, '#2A2252'], [.8, '#5B3460'], [1, '#8A4A6A']]); skyline(c, -150, 400, 170, ['#2F2748', '#3B2F54', '#4A3A5E'], true, 6);
  const cb = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshStandardMaterial({ map: cobbleTex('#6A5E70', 14, 14), roughness: .9 })); cb.rotation.x = -Math.PI / 2; cb.receiveShadow = true; c.add(cb);
  const shops = [{ name: 'LUNA CAFÉ', bg: '#8F4A2F', fg: '#FFE3C8', awning: '#D94F58', font: 'Caveat', size: 120 }, { name: 'CINEMA', bg: '#7A3A6A', fg: '#FFE7B8' }, { name: 'LIVROS', bg: '#3F5688' }, { name: 'FARMÁCIA', bg: '#2F8F7C', font: 'Inter', size: 100 }];
  let z = 6, i = 0; while (z > -50) { const d = 7 + (i * 37 % 5); c.add(building(900 + i, { x: 15, z: z - d / 2, w: 8, d, floors: 4 + i % 3, side: -1, night: true, shop: shops[i % 4] })); c.add(building(950 + i, { x: -15, z: z - d / 2, w: 8, d, floors: 5 + i % 2, side: 1, night: true, shop: shops[(i + 2) % 4] })); z -= d; i++; }
  for (let k = 0; k < 5; k++) { lamp(c, 8, -2 - k * 9, -1, true, 4); lamp(c, -8, -6 - k * 9, 1, true, 4); }
  c.add(new THREE.HemisphereLight('#6E6AA8', '#2a1f28', .8)); const moon = new THREE.DirectionalLight('#A9A8E8', .7); moon.position.set(-14, 26, 10); moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, far: 70 }); c.add(moon);
  const R = rng(5), spots = []; for (let k = 0; k < 160; k++) { const x = (R() - .5) * 13, zz = -1 - R() * 16; if (Math.abs(x) < .8 && zz > -3) continue; spots.push([x, zz, 0, Math.PI * (R() < .5 ? 1 : 0)]); } crowd(c, spots, { raised: .1, jump: .02, seed: 6, tint: '#D9D2E4' });
  const bs = spots.slice(0, 70).map((p, k) => { const m = balao({ icon: ICONES[k % ICONES.length] }, .55); c.add(m); return { m, p, at: .2 + R() * 1.6 }; });
  const hero = makeChar({ outfit: 'hero', glow: .22 }); hero.place(0, 1.0); c.add(hero.root); hero.tint('#D9D2E4');
  const eg = glowSprite('#7FE6D6', .9, 0); hero.head.add(eg); eg.position.z = .05;
  s.update = (t, u) => { uT.value = t; hero.face(s.camera); hero.pose({ armL: [8, 6], armR: [8, 6], head: Math.sin(u * 2) * 4 }); hero.eye(u < .3 ? 'shut' : 'wide'); eg.material.opacity = smooth(0, .4, u) * .7;
    const e = smooth(0, 2.75, u); aim(s.camera, [lerp(.3, .6, e), lerp(1.4, 3.2, e), lerp(4.0, 7.0, e)], [0, lerp(1.5, 1.7, e), -4], -.01);
    bs.forEach(b => animaBalao(b.m, u, b.at, 999, s.camera, [b.p[0], 2.35, b.p[1]]));
    return { focus: lerp(3.0, 6.2, e), range: lerp(1.2, 3.5, e), blur: 13, bloom: .36, bloomT: .9, vig: .5, exposure: .95 }; };
  return s; }

/** 3a. Prova: o professor pensa na resposta — 7.7 a 10.45 */
export function shotProva(t0, t1) { const s = makeShot(t0, t1, '#E8D6B4', 38), c = s.scene; c.fog = new THREE.FogExp2('#EAD8B8', .03);
  c.add(woodFloor(14, 14, '#8A6440'));
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(14, 5), wallMat('#E8C88A', '#E2BE7E', '#F2D6A0', 5, 2)); wall.position.set(0, 2.5, -3); wall.receiveShadow = true; c.add(wall);
  const qt = canvasTex(1024, 512, (x) => { x.fillStyle = '#2F4F3E'; x.fillRect(0, 0, 1024, 512); x.strokeStyle = '#6E4A32'; x.lineWidth = 30; x.strokeRect(0, 0, 1024, 512); x.fillStyle = '#EEF2E6'; x.font = "700 70px Caveat"; x.fillText('PROVA DE MATEMÁTICA', 90, 110); x.font = "700 60px Caveat"; x.fillText('3x + 7 = 22    x = ?', 120, 230); x.fillText('A) 3   B) 5   C) 7', 120, 330); }); const q = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), new THREE.MeshStandardMaterial({ map: qt })); q.position.set(.3, 2.3, -2.95); c.add(q);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) { const x = -1.6 + k * 1.6, z = .4 - r * 1.3; c.add(box(.9, .05, .6, '#C8A070', x, .78, z)); c.add(box(.06, .76, .06, '#5a5a60', x - .38, .38, z + .22)); c.add(box(.06, .76, .06, '#5a5a60', x + .38, .38, z + .22)); const p = box(.3, .005, .4, '#F6F1E4', x, .81, z); c.add(p); }
  const alunos = [[-1.6, -1.0, 'rosa', 'long'], [1.6, -1.0, 'amarelo', 'afro'], [-1.6, -2.3, 'azul', 'bob'], [1.6, -2.3, 'verde', 'bun'], [0, -2.3, 'roxo', 'long']].map(([x, z, o, h]) => { const a = makeChar({ outfit: o, hair: h, hairc: '#3a2418', lash: true }); a.place(x, z + .35, -.35); c.add(a.root); a.tint('#FFF2E0'); return a; });
  const prof = makeChar({ outfit: 'jaleco', hair: 'old', glasses: true }); prof.place(.95, -2.4); c.add(prof.root); prof.tint('#FFF2E0');
  const hero = makeChar({ outfit: 'hero', glow: .14 }); hero.place(0, .75, -.35); c.add(hero.root); hero.tint('#FFF2E0');
  const b = balao({ icon: 'letraB' }, .7); c.add(b);
  c.add(new THREE.HemisphereLight('#FFF2DC', '#9A6A4A', 1.0)); const sun = new THREE.DirectionalLight('#FFE0A8', 2.0); sun.position.set(-5, 6, 4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, far: 30 }); c.add(sun);
  beam(c, -1.0, 2.2, -1, 1.4, 5, .6, .14); beam(c, .2, 2.2, -1.4, .8, 5, .6, .1);
  s.update = (t, u) => { alunos.forEach((a, i) => { a.face(s.camera); a.pose({ armL: [8, 6], armR: [20, -60], head: -6 }); a.eye('down'); }); prof.face(s.camera); prof.pose({ armL: [30, -120], armR: [30, -120] }); prof.eye('look');
    hero.face(s.camera); hero.pose({ armL: [8, 6], armR: [lerp(10, 40, smooth(1.8, 2.1, u)), lerp(-40, -100, smooth(1.8, 2.1, u))], head: u > 1.8 ? 5 : -5 }); hero.eye(u < 1.0 ? 'down' : u < 1.7 ? 'look' : 'smug');
    const e = smooth(0, 2.75, u); aim(s.camera, [lerp(-.3, -.1, e), lerp(1.6, 1.55, e), lerp(4.4, 3.8, e)], [.35, lerp(1.7, 1.8, e), -1.5], .01);
    animaBalao(b, u, .7, 999, s.camera, [.95, 2.5, -2.4]);
    return { focus: lerp(3.8, 3.2, e), range: 2.2, blur: 13, bloom: .26, bloomT: .95, vig: .4, exposure: 1 }; };
  return s; }

/** 3b. Entrevista: a chefe pensa "contratado" — 10.45 a 13.95 */
export function shotEntrevista(t0, t1) { const s = makeShot(t0, t1, '#2A3246', 38), c = s.scene; c.fog = new THREE.FogExp2('#3A4458', .03);
  const carpet = canvasTex(256, 256, (x) => { x.fillStyle = '#3F4A66'; x.fillRect(0, 0, 256, 256); for (let i = 0; i < 1500; i++) { x.fillStyle = `rgba(255,255,255,${Math.random() * .05})`; x.fillRect(Math.random() * 256, Math.random() * 256, 2, 2); } }); carpet.wrapS = carpet.wrapT = THREE.RepeatWrapping; carpet.repeat.set(6, 6); const fl = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshStandardMaterial({ map: carpet })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; c.add(fl);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(14, 5), wallMat('#C9D2DC', '#BFC9D4', '#D6DEE6', 5, 2)); wall.position.set(0, 2.5, -2.6); c.add(wall);
  // janela de vidro com a cidade
  const city = canvasTex(1024, 512, (x) => { const g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#6FA8D8'); g.addColorStop(1, '#F2D6B0'); x.fillStyle = g; x.fillRect(0, 0, 1024, 512); for (let i = 0; i < 30; i++) { x.fillStyle = ['#7A8CA8', '#8A9AB4', '#6E7E9A'][i % 3]; const w = 40 + (i * 37 % 60), h = 120 + (i * 53 % 280); x.fillRect(i * 36, 512 - h, w, h); x.fillStyle = '#FFE6A8'; for (let a = 0; a < h - 20; a += 26) for (let b = 6; b < w - 6; b += 14) if ((a + b + i) % 3) x.fillRect(i * 36 + b, 512 - h + a + 10, 6, 10); } }); const win = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.1), new THREE.MeshBasicMaterial({ map: city })); win.position.set(0, 2.1, -2.58); c.add(win); for (let k = 0; k < 5; k++) c.add(box(.06, 2.1, .06, '#2E3648', -2.1 + k * 1.05, 2.1, -2.55));
  const desk = box(2.2, .08, 1.0, '#6E4A32', 0, .8, -.9); c.add(desk); c.add(box(2.1, .78, .06, '#5A3A26', 0, .4, -.45)); c.add(box(.5, .02, .35, '#F6F1E4', -.4, .85, -.8)); const lap = box(.5, .32, .02, '#2A2A30', .45, 1.0, -1.1); c.add(lap); const mug = new THREE.Mesh(new THREE.CylinderGeometry(.05, .045, .12, 16), std('#C9472F')); mug.position.set(.85, .9, -.7); c.add(mug);
  const plant = new THREE.Mesh(new THREE.CylinderGeometry(.2, .16, .4, 18), std('#E9E2D2')); plant.position.set(-1.8, .2, -2.0); c.add(plant); for (let i = 0; i < 8; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(.22, 10, 8), std(i % 2 ? '#3E7A44' : '#55934F')); l.scale.set(.6, 1.6, .3); l.position.set(-1.8 + Math.sin(i * 2.1) * .2, .75 + (i % 3) * .15, -2 + Math.cos(i * 2.1) * .15); l.rotation.z = Math.sin(i * 2.1) * .5; c.add(l); }
  const chefe = makeChar({ outfit: 'terno3', hair: 'bun', hairc: '#2a1b18', lash: true, glasses: true }); chefe.place(.2, -1.6, -.2); c.add(chefe.root); chefe.tint('#FFF0E2');
  const hero = makeChar({ outfit: 'hero', glow: .14 }); hero.place(-.55, .25, -.3); c.add(hero.root); hero.tint('#FFF0E2');
  const chair = box(.6, .5, .1, '#2E3648', -.55, .75, .5); c.add(chair);
  const b = balao({ icon: 'check' }, .7); c.add(b);
  c.add(new THREE.HemisphereLight('#E6F0FF', '#4a4a5a', 1.0)); const key = new THREE.DirectionalLight('#FFF0DC', 1.6); key.position.set(2, 5, -4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, far: 20 }); c.add(key);
  s.update = (t, u) => { chefe.face(s.camera); chefe.pose({ armL: [30, -110], armR: [30, -110], head: u > 1.4 ? 5 : 0 }); chefe.eye(u < 1.4 ? 'look' : 'happy');
    hero.face(s.camera); const thumb = smooth(1.9, 2.1, u); hero.pose({ armL: [8, 6], armR: [lerp(8, 60, thumb), lerp(6, -110, thumb)], head: thumb * -6 }); hero.eye(u < 1.8 ? 'look' : 'smug');
    const e = smooth(0, 3.5, u); aim(s.camera, [lerp(-.9, -.6, e), lerp(1.5, 1.45, e), lerp(3.4, 2.9, e)], [-.1, 1.5, -1.0], .01);
    animaBalao(b, u, .5, 999, s.camera, [.45, 2.4, -1.6]);
    return { focus: lerp(3.6, 3.2, e), range: 2.2, blur: 14, bloom: .24, bloomT: 1, vig: .45, exposure: 1 }; };
  return s; }

/** 4. Café: a cabeça da amiga solta balões sem parar — 13.95 a 20.75 */
export function shotCafe(t0, t1) { const s = makeShot(t0, t1, '#3A2418', 38), c = s.scene; c.fog = new THREE.FogExp2('#5A3A28', .03);
  c.add(tileFloor(12, 12, '#2E2A2E', '#E9E2D2', 1));
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat('#3F6A5C', '#386052', '#4A7A6A', 5, 2)); wall.position.set(0, 2.5, -2.4); wall.receiveShadow = true; c.add(wall);
  const menu = canvasTex(512, 380, (x) => { x.fillStyle = '#1E1E22'; x.fillRect(0, 0, 512, 380); x.fillStyle = '#F6F1E4'; x.font = "700 64px Caveat"; x.textAlign = 'center'; x.fillText('Cardápio', 256, 70); x.font = "700 44px Caveat"; ['Café ..... 5', 'Pão de queijo ..... 4', 'Bolo ..... 7', 'Suco ..... 8'].forEach((s, i) => x.fillText(s, 256, 140 + i * 60)); }); const mm = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.04), new THREE.MeshStandardMaterial({ map: menu })); mm.position.set(-1.4, 2.4, -2.38); c.add(mm);
  for (const x of [-1, 0, 1]) { const b = new THREE.Mesh(new THREE.SphereGeometry(.1, 16, 12), new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#FFC67A', emissiveIntensity: 3 })); b.position.set(x * 1.2, 3.0, -.6); c.add(b); c.add(box(.01, 1.2, .01, '#222', x * 1.2, 3.6, -.6, false)); const g = glowSprite('#FFC67A', 1.4, .5); g.position.set(x * 1.2, 3.0, -.5); c.add(g); }
  const tb = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .05, 32), std('#E9E2D2')); tb.position.set(0, .78, -.5); tb.castShadow = true; c.add(tb); c.add(box(.06, .76, .06, '#2a2a30', 0, .38, -.5));
  for (const x of [-.18, .18]) { const cup = new THREE.Mesh(new THREE.CylinderGeometry(.06, .05, .09, 16), std('#F6F1E4')); cup.position.set(x, .85, -.45); c.add(cup); const cf = new THREE.Mesh(new THREE.CircleGeometry(.05, 16), std('#5A3420')); cf.rotation.x = -Math.PI / 2; cf.position.set(x, .896, -.45); c.add(cf); }
  const amiga = makeChar({ outfit: 'rosa', hair: 'long', hairc: '#6B3A22', hairhi: '#8B5230', lash: true }); amiga.place(.55, -.75, -.2); c.add(amiga.root); amiga.tint('#FFE9D2');
  const hero = makeChar({ outfit: 'hero', glow: .14 }); hero.place(-.55, -.45, -.2); c.add(hero.root); hero.tint('#FFE9D2');
  const R = rng(3); const fluxo = []; for (let i = 0; i < 40; i++) { const m = balao({ icon: ICONES[(i * 7) % ICONES.length] }, .34 + R() * .12); c.add(m); fluxo.push({ m, at: .3 + i * .14, dx: (R() - .3) * 1.6, sp: .5 + R() * .5 }); }
  c.add(new THREE.HemisphereLight('#FFE2BE', '#4a2a1a', .8)); const key = new THREE.SpotLight('#FFD39A', 30, 12, .7, .4, 1.2); key.position.set(-2, 4.5, 2.5); key.target.position.set(0, 1, -.5); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); c.add(key, key.target);
  beam(c, .8, 2.2, -.8, 1.0, 4.4, -.5, .1);
  // vidro da vitrine desfocado na frente
  const vt = canvasTex(512, 256, (x) => { x.clearRect(0, 0, 512, 256); x.fillStyle = '#F2E2BE'; x.font = "700 120px Caveat"; x.textAlign = 'center'; x.fillText('Café', 256, 160); }); const vm = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .8), new THREE.MeshBasicMaterial({ map: vt, transparent: true, opacity: .6, depthWrite: false })); vm.position.set(-.9, 1.9, 2.0); c.add(vm);
  s.update = (t, u) => { amiga.face(s.camera); amiga.pose({ armL: [8, 6], armR: [30, -120], head: Math.sin(u * 3) * 6 }); amiga.eye(['look', 'happy', 'lookl', 'open'][Math.floor(u * 1.5) % 4]);
    hero.face(s.camera); hero.pose({ armL: [8, 6], armR: [8, 6], head: -6, lean: -2 }); hero.eye(u < 2.0 ? 'look' : u < 4.5 ? 'wide' : 'flat');
    const e = smooth(0, 6.8, u); aim(s.camera, [lerp(-.1, .1, e), lerp(1.5, 1.7, e), lerp(2.8, 3.8, e)], [0, lerp(1.6, 2.1, e), -.6], .01);
    fluxo.forEach(f => { const k = u - f.at; f.m.visible = k > 0; if (k > 0) { f.m.position.set(.55 + f.dx * Math.min(1, k * .4), 2.0 + k * f.sp, -.75 + Math.min(k, 2) * .1); f.m.quaternion.copy(s.camera.quaternion); f.m.scale.setScalar(Math.min(1, k * 6)); } });
    return { focus: lerp(2.6, 3.6, e), range: 1.6, blur: 15, bloom: .3, bloomT: .95, vig: .5, exposure: 1 }; };
  return s; }
