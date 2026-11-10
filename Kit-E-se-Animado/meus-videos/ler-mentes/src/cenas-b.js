import * as THREE from 'three';
import { makeShot, aim, keys, smooth, lerp, clamp, rng } from './motor/core.js';
import { makeChar, canvasTex } from './motor/char.js';
import { box, std, cut, glowSprite, building, street, lamp, tree, car, skyline, sky } from './motor/kit.js';
import { crowd, uT, stars } from './motor/kit2.js';
import { woodFloor, tileFloor, wallMat, beam, naMao } from './comum.js';
import { balao, animaBalao, ICONES } from './balao.js';

/** 5. Rua de dia: cada um pensa em outra coisa — 20.75 a 28.55 */
export function shotRua(t0, t1) { const s = makeShot(t0, t1, '#BCE3EE', 40), c = s.scene; c.fog = new THREE.FogExp2('#F6E6D0', .012);
  sky(c, -170, 460, 340, [[0, '#6FB2DA'], [.6, '#BFE0EC'], [1, '#FBE9D0']]); skyline(c, -150, 400, 170, ['#B9C6D6', '#A9B8CC', '#9AAAC2'], false, 4); street(c, false);
  c.add(new THREE.HemisphereLight('#E6F0FF', '#8a6a50', 1.15)); const sun = new THREE.DirectionalLight('#FFE6BE', 2.4); sun.position.set(-18, 16, 8); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, far: 80 }); sun.shadow.bias = -.0005; c.add(sun);
  const shops = [{ name: 'LANCHES', bg: '#C9472F', fg: '#FFE7B8', awning: '#F2C94C', font: 'Fraunces', size: 120 }, { name: 'FARMÁCIA', bg: '#2F8F7C', font: 'Inter', size: 100 }, { name: 'A ROSA', bg: '#B04463', awning: '#EFEDE0' }, { name: 'LIVROS', bg: '#3F5688' }, { name: 'BANCA', bg: '#7A5532', awning: '#3E7A5C' }];
  let z = 6, i = 0; while (z > -70) { const d = 7 + (i * 37 % 5); c.add(building(500 + i, { x: 13, z: z - d / 2, w: 8, d, floors: 3 + i % 3, side: -1, night: false, shop: shops[i % 5] })); c.add(building(600 + i, { x: -13, z: z - d / 2, w: 8, d, floors: 4 + (i * 2) % 3, side: 1, night: false, shop: shops[(i + 2) % 5] })); z -= d; i++; }
  const pal = ['#3E5F3A', '#4F7A44', '#6E9A50', '#C9CC72']; for (let k = 0; k < 6; k++) { lamp(c, 5, -12 - k * 12, -1, false); tree(c, 5.2, -9 - k * 12, 1.05, pal, k); tree(c, -5.2, -5 - k * 12, 1.05, pal, k + 1); } car(c, -3.1, -6, '#27425A', -1, false); car(c, 3.1, -16, '#D7A83E', 1, false);
  // pessoas trabalhando, pensando em outra coisa
  const gente = [['avental', 'bun', 6.4, -.5, 'praia'], ['terno', null, 7.6, -2.6, 'cama'], ['amarelo', 'afro', 6.0, -4.6, 'pizza'], ['azul', 'bob', 7.4, -6.8, 'gato'], ['jaleco', 'old', 6.2, -9, 'carro'], ['verde', 'long', 7.3, -11, 'musica']].map(([o, h, x, zz, ic], k) => { const p = makeChar({ outfit: o, hair: h, hairc: '#3a2418', lash: k % 2 === 0 }); p.place(x, zz, .14); c.add(p.root); p.tint('#FFF6EA'); const b = balao({ icon: ic }, .62); c.add(b); return { p, b, at: .4 + k * .5, x, zz }; });
  // balcão de lanche na calçada
  c.add(box(1.4, 1.0, .6, '#E9E2D2', 6.4, .64, .3)); c.add(box(1.5, .06, .7, '#C9472F', 6.4, 1.16, .3)); const vas = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, .22, 16), std('#F2C94C')); vas.position.set(6.1, 1.3, .3); c.add(vas);
  const hero = makeChar({ outfit: 'hero', glow: .14 }); hero.place(5.4, 2.6, .14); c.add(hero.root); hero.tint('#FFF4E6');
  s.update = (t, u) => { gente.forEach((g, k) => { g.p.face(s.camera); if (k === 0) g.p.pose({ armL: [20, -80], armR: [20, -80] }); else if (k === 1) g.p.pose({ armL: [8, 6], armR: [24, -100], head: 6 }); else g.p.walk(u + k, .7, .6); g.p.eye(k === 1 ? 'shut' : 'flat'); animaBalao(g.b, u, g.at, 999, s.camera, [g.x - .15, 2.45, g.zz]); });
    hero.face(s.camera); hero.walk(u, .6, .6); hero.root.position.z = 2.6 - u * .25; hero.eye(u < 3 ? 'look' : 'lookl');
    const e = smooth(0, 7.8, u); aim(s.camera, [lerp(3.4, 3.8, e), lerp(1.5, 1.9, e), lerp(6.4, 4.2, e)], [lerp(6.4, 6.8, e), lerp(1.6, 1.9, e), lerp(-1.5, -5, e)], -.01);
    return { focus: lerp(5, 7, e), range: 4, blur: 12, bloom: .22, bloomT: 1, vig: .38, exposure: 1.02 }; };
  return s; }

/** 6. Almoço de domingo — 28.55 a 37.1 */
export function shotAlmoco(t0, t1) { const s = makeShot(t0, t1, '#E8966A', 38), c = s.scene; c.fog = new THREE.FogExp2('#E8B88A', .03);
  c.add(woodFloor(12, 12, '#7A5232'));
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat('#E9C46A', '#E2BA5E', '#F2D48A', 5, 2)); wall.position.set(0, 2.5, -2.6); wall.receiveShadow = true; c.add(wall);
  for (const [x, y, col] of [[-1.6, 2.4, '#C9563E'], [-.6, 2.6, '#36AEA2'], [.9, 2.4, '#7A3A6A']]) { const fr = canvasTex(256, 300, (k) => { k.fillStyle = '#3B2A1E'; k.fillRect(0, 0, 256, 300); k.fillStyle = '#F6EBD6'; k.fillRect(16, 16, 224, 268); k.fillStyle = col; k.beginPath(); k.arc(128, 120, 50, 0, 7); k.fill(); k.fillRect(70, 170, 116, 100); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(.5, .6), new THREE.MeshStandardMaterial({ map: fr })); m.position.set(x, y, -2.58); c.add(m); }
  const clock = canvasTex(256, 256, (x) => { x.fillStyle = '#F6F1E4'; x.beginPath(); x.arc(128, 128, 120, 0, 7); x.fill(); x.strokeStyle = '#6E4A32'; x.lineWidth = 12; x.stroke(); x.lineCap = 'round'; x.strokeStyle = '#2E3648'; x.beginPath(); x.moveTo(128, 128); x.lineTo(128, 40); x.moveTo(128, 128); x.lineTo(128, 190); x.stroke(); }); const ck = new THREE.Mesh(new THREE.CircleGeometry(.28, 32), new THREE.MeshStandardMaterial({ map: clock })); ck.position.set(1.9, 2.8, -2.58); c.add(ck);
  // mesa com toalha xadrez e comida
  const tt = canvasTex(256, 256, (x) => { x.fillStyle = '#F6F1E4'; x.fillRect(0, 0, 256, 256); x.fillStyle = '#C9472F99'; for (let i = 0; i < 8; i++) { x.fillRect(i * 32, 0, 16, 256); x.fillRect(0, i * 32, 256, 16); } }); tt.wrapS = tt.wrapT = THREE.RepeatWrapping; tt.repeat.set(3, 2);
  const mesa = new THREE.Mesh(new THREE.BoxGeometry(3.0, .9, 1.1), new THREE.MeshStandardMaterial({ map: tt })); mesa.position.set(0, .45, -.4); mesa.castShadow = mesa.receiveShadow = true; c.add(mesa);
  const frango = new THREE.Mesh(new THREE.SphereGeometry(.22, 20, 14), std('#C8813E', { roughness: .5 })); frango.scale.set(1.3, .8, 1); frango.position.set(0, 1.05, -.4); c.add(frango); const prato = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .03, 32), std('#F6F1E4')); prato.position.set(0, .92, -.4); c.add(prato);
  for (const [x, col] of [[-.8, '#F6F1E4'], [.8, '#3E7A44'], [-1.25, '#E8843E'], [1.25, '#F2C94C']]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(.14, .1, .1, 20), std('#E9E2D2')); b.position.set(x, .95, -.3); c.add(b); const f = new THREE.Mesh(new THREE.SphereGeometry(.12, 14, 10), std(col)); f.scale.y = .4; f.position.set(x, 1.0, -.3); c.add(f); }
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .26, 16), std('#E8843E', { transparent: true, opacity: .8 })); jar.position.set(.45, 1.03, -.1); c.add(jar);
  // família atrás da mesa
  const fam = [['rosa', 'old', -.78, '#d9d9d9', 'tesoura', 4.5], ['terno2', null, -.26, null, 'pasta', 5.65], ['amarelo', 'bun', .26, '#3a2418', 'partido', 7.3], ['verde', 'afro', .78, '#2a1b18', 'interrog', 7.0]].map(([o, h, x, hc, ic, at], k) => { const p = makeChar({ outfit: o, hair: h, hairc: hc || '#3a2418', lash: k % 2 === 0, glasses: k === 0 }); p.place(x, -1.25, -.15); c.add(p.root); p.tint('#FFE9D2'); const b = balao({ icon: ic }, .58); c.add(b); return { p, b, at, x }; });
  const hero = makeChar({ outfit: 'hero', glow: .14 }); hero.place(0, .55, -.45); c.add(hero.root); hero.tint('#FFE9D2');
  c.add(new THREE.HemisphereLight('#FFE2BE', '#6a3a22', .9)); const sun = new THREE.SpotLight('#FFD39A', 50, 14, .8, .4, 1.2); sun.position.set(-3, 5, 3); sun.target.position.set(0, 1, -1); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); c.add(sun, sun.target);
  const lustre = new THREE.Mesh(new THREE.ConeGeometry(.4, .3, 24, 1, true), std('#C9922E', { side: THREE.DoubleSide, emissive: '#5a3a08' })); lustre.position.set(0, 2.9, -.4); c.add(lustre); const lg = glowSprite('#FFD27A', 1.6, .5); lg.position.set(0, 2.75, -.4); c.add(lg); const ll = new THREE.PointLight('#FFD27A', 4, 5); ll.position.set(0, 2.6, -.4); c.add(ll);
  beam(c, -.8, 2.3, -.8, 1.2, 4.4, .55, .12);
  s.update = (t, u) => { fam.forEach((f, k) => { f.p.face(s.camera); f.p.pose({ armL: [20, -70], armR: [20, -70], head: Math.sin(u * 1.5 + k) * 3 }); f.p.eye(u > f.at ? (k === 2 ? 'sad' : 'smug') : 'happy'); animaBalao(f.b, u, f.at, 999, s.camera, [f.x, 2.25 + (k % 2) * .4, -1.25]); });
    hero.face(s.camera); hero.pose({ armL: [20, -60], armR: [20, -60], head: u > 4.5 ? -6 : 0, squash: u > 7.3 ? -.02 : 0 }); hero.eye(u < 2.3 ? 'happy' : u < 4.5 ? 'look' : u < 6.0 ? 'small' : u < 7.3 ? 'down' : 'sad');
    const e = smooth(0, 8.55, u); aim(s.camera, [lerp(.4, -.1, e), lerp(1.75, 1.85, e), lerp(6.0, 5.2, e)], [lerp(.1, 0, e), lerp(1.8, 1.95, e), -.8], .01);
    return { focus: lerp(5.8, 5.1, e), range: 2.6, blur: 13, bloom: .3, bloomT: .92, vig: .45, exposure: 1 }; };
  return s; }

/** 7. Tampando os ouvidos: o barulho vem de dentro — 37.1 a 42.7 */
export function shotOuvidos(t0, t1) { const s = makeShot(t0, t1, '#2A0F12', 40), c = s.scene; c.fog = new THREE.FogExp2('#4A1A1C', .04);
  c.add(woodFloor(12, 12, '#4A2A22'));
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat('#5A2A30', '#4E2228', '#6A3238', 5, 2)); wall.position.set(0, 2.5, -2.2); wall.receiveShadow = true; c.add(wall);
  const hero = makeChar({ outfit: 'hero', glow: .25 }); hero.place(0, 0); c.add(hero.root); hero.tint('#FFC8C0');
  const R = rng(8); const roda = []; for (let i = 0; i < 26; i++) { const m = balao({ icon: ICONES[(i * 5) % ICONES.length] }, .4 + R() * .15); c.add(m); roda.push({ m, a: R() * 6.28, r: 1.15 + R() * .7, y: 1.2 + R() * 1.4, sp: (.4 + R() * .6) * (i % 2 ? 1 : -1), at: R() * 1.2 }); }
  c.add(new THREE.HemisphereLight('#FF8A7A', '#2a0a0a', .7)); const key = new THREE.SpotLight('#FF6A5A', 40, 10, .5, .5, 1.2); key.position.set(0, 4.5, 2); key.target.position.set(0, 1, 0); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); c.add(key, key.target); const back = new THREE.PointLight('#FFB070', 6, 6); back.position.set(0, 2, -1.5); c.add(back);
  s.update = (t, u) => { hero.face(s.camera); const cov = smooth(.1, .4, u); hero.pose({ armL: [lerp(8, 105, cov), lerp(6, 125, cov)], armR: [lerp(8, 105, cov), lerp(6, 125, cov)], head: Math.sin(u * 9) * 3 * cov, squash: -.02 * cov }); hero.eye(u < .3 ? 'wide' : u < 2 ? 'shut' : u < 3.5 ? 'angry' : 'shut');
    const e = smooth(0, 5.6, u); aim(s.camera, [Math.sin(u * .6) * .3, lerp(1.6, 1.5, e), lerp(3.6, 2.8, e)], [0, 1.65, 0], Math.sin(u * .9) * .03);
    roda.forEach(b => { const k = u - b.at; b.m.visible = k > 0; if (k > 0) { const a = b.a + u * b.sp * (1 + u * .15); b.m.position.set(Math.cos(a) * b.r, b.y + Math.sin(u * 2 + b.a) * .1, Math.sin(a) * b.r * .6); b.m.quaternion.copy(s.camera.quaternion); b.m.scale.setScalar(Math.min(1, k * 6)); } });
    return { focus: lerp(3.6, 2.8, e), range: 1.0, blur: 16, bloom: .35, bloomT: .85, vig: .65, exposure: 1, sat: 1.05 }; };
  return s; }

/** 8. Ônibus lotado — 42.7 a 49.65 */
export function shotOnibus(t0, t1) { const s = makeShot(t0, t1, '#C9D2DC', 42), c = s.scene; c.fog = new THREE.FogExp2('#D8DEE4', .04);
  const L = 12; c.add(tileFloor(2.6, L, '#5A5E66', '#52565E', 1).translateY(0)); c.children[c.children.length - 1].position.z = -L / 2 + 2;
  c.add(box(2.6, .06, L, '#E9ECEF', 0, 2.4, -L / 2 + 2, false)); for (let i = 0; i < 6; i++) { const lt = box(.3, .03, 1.2, new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#F4F8FF', emissiveIntensity: 1.4 }), 0, 2.36, 1 - i * 2, false); c.add(lt); }
  const outside = canvasTex(2048, 256, (x) => { const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#9FC8E8'); g.addColorStop(1, '#E8E2D0'); x.fillStyle = g; x.fillRect(0, 0, 2048, 256); for (let i = 0; i < 60; i++) { x.fillStyle = ['#C9563E', '#E9C46A', '#36AEA2', '#8A9AB4', '#B04463'][i % 5]; const h = 80 + (i * 37 % 140); x.fillRect(i * 34, 256 - h, 32, h); x.fillStyle = '#F6F1E4'; for (let a = 16; a < h - 10; a += 26) x.fillRect(i * 34 + 8, 256 - h + a, 8, 12); } }); outside.wrapS = THREE.RepeatWrapping; outside.repeat.set(3, 1);
  for (const sx of [-1, 1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(L, 1.0), new THREE.MeshBasicMaterial({ map: outside })); w.rotation.y = -sx * Math.PI / 2; w.position.set(sx * 1.32, 1.6, -L / 2 + 2); c.add(w); c.add(box(.06, .9, L, '#E9ECEF', sx * 1.3, .55, -L / 2 + 2)); c.add(box(.06, .3, L, '#E9ECEF', sx * 1.3, 2.25, -L / 2 + 2)); for (let i = 0; i < 7; i++) c.add(box(.07, 1.0, .07, '#C9CFD6', sx * 1.28, 1.6, 1.8 - i * 1.7)); }
  for (let i = 0; i < 6; i++) for (const sx of [-1, 1]) { c.add(box(.9, .45, .5, '#2F6FA0', sx * .78, .45, .8 - i * 1.5)); c.add(box(.9, .6, .1, '#2F6FA0', sx * .78, .95, .58 - i * 1.5)); }
  for (let i = 0; i < 7; i++) c.add(box(.05, 2.4, .05, '#F2C94C', (i % 2 ? .25 : -.25), 1.2, 1.5 - i * 1.4)); c.add(box(.04, .04, L, '#F2C94C', .3, 2.05, -L / 2 + 2)); c.add(box(.04, .04, L, '#F2C94C', -.3, 2.05, -L / 2 + 2));
  const R = rng(4), spots = []; for (let i = 0; i < 6; i++) for (const sx of [-1, 1]) { spots.push([sx * .62, .62 - i * 1.5, -.42, Math.PI]); spots.push([sx * .95, .62 - i * 1.5, -.42, Math.PI]); } for (let k = 0; k < 22; k++) spots.push([(R() - .5) * .7, -.6 - R() * 8, 0, Math.PI * (R() < .7 ? 1 : 0)]);
  crowd(c, spots, { raised: .2, jump: .01, seed: 8, tint: '#F2F4F8' });
  const R2 = rng(9); const bs = spots.map((p, k) => { const m = balao({ icon: ICONES[(k * 3) % ICONES.length] }, .4); c.add(m); return { m, p, at: .3 + R2() * 2.4 }; });
  const hero = makeChar({ outfit: 'hero', glow: .16 }); hero.place(.18, 1.3); c.add(hero.root); hero.tint('#F2F4F8');
  c.add(new THREE.HemisphereLight('#F4F8FF', '#6a6a72', 1.1)); const sun = new THREE.DirectionalLight('#FFF0D8', 1.4); sun.position.set(-4, 5, 2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 8, bottom: -8, far: 20 }); c.add(sun);
  s.update = (t, u) => { uT.value = t; outside.offset.x = u * .06; hero.face(s.camera); hero.pose({ armL: [8, 6], armR: [150, 10], head: Math.sin(u * 3) * 2 }); hero.eye(u < 2 ? 'look' : u < 4 ? 'wide' : 'flat');
    const e = smooth(0, 6.95, u); aim(s.camera, [lerp(-.1, -.15, e), lerp(2.0, 2.2, e), lerp(3.6, 4.4, e)], [0, lerp(1.6, 1.4, e), -4], .01 + Math.sin(u * 4) * .004);
    bs.forEach(b => animaBalao(b.m, u, b.at, 999, s.camera, [b.p[0], 2.0 + (b.p[2] < 0 ? -.4 : 0), b.p[1]]));
    return { focus: lerp(2.2, 3.0, e), range: 2.0, blur: 13, bloom: .24, bloomT: 1, vig: .42, exposure: 1 }; };
  return s; }

/** 9. Terraço à noite: a paz de não saber — 49.65 a 55.9 */
export function shotTerraco(t0, t1) { const s = makeShot(t0, t1, '#1E1E4A', 38), c = s.scene; c.fog = new THREE.FogExp2('#6A4A76', .0065);
  sky(c, -170, 460, 340, [[0, '#0E1030'], [.5, '#2A2252'], [.8, '#6A3C6A'], [1, '#C0708A']]); stars(c, 1200, 300, 3); skyline(c, -120, 400, 150, ['#3B2F54', '#4A3A5E', '#5A4468'], true, 8);
  const fl = tileFloor(16, 16, '#6E6470', '#645A66', 1); c.add(fl);
  c.add(box(16, .9, .2, '#8A7A86', 0, .45, -3)); for (let k = 0; k < 20; k++) c.add(box(.05, .6, .05, '#2a2a30', -7 + k * .7, 1.2, -3));
  const fio = []; for (let k = 0; k < 14; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(.05, 10, 8), new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#FFD27A', emissiveIntensity: 3 })); b.position.set(-3 + k * .45, 2.6 - Math.sin(k / 13 * Math.PI) * .4, -1.6); c.add(b); const g = glowSprite('#FFD27A', .5, .6); g.position.copy(b.position); c.add(g); }
  for (const x of [-3.1, 3.1]) c.add(box(.06, 2.7, .06, '#2a2a30', x, 1.35, -1.6));
  const bench = box(1.6, .1, .5, '#8A5A36', 0, .48, -.4); c.add(bench); c.add(box(1.6, .5, .08, '#8A5A36', 0, .8, -.65)); c.add(box(.08, .45, .4, '#3a2a20', -.7, .22, -.4)); c.add(box(.08, .45, .4, '#3a2a20', .7, .22, -.4));
  const plant = new THREE.Mesh(new THREE.CylinderGeometry(.25, .2, .45, 18), std('#C9563E')); plant.position.set(1.6, .22, -.8); c.add(plant); for (let i = 0; i < 8; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(.24, 10, 8), std(i % 2 ? '#2E5F3A' : '#3E7A44')); l.scale.set(.6, 1.6, .3); l.position.set(1.6 + Math.sin(i * 2.1) * .22, .85 + (i % 3) * .15, -.8 + Math.cos(i * 2.1) * .15); l.rotation.z = Math.sin(i * 2.1) * .5; c.add(l); }
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(.05, .045, .11, 16), std('#36AEA2')); mug.position.set(.55, .6, -.35); c.add(mug);
  // balões da cidade se apagando ao longe
  const R = rng(12); const far = []; for (let i = 0; i < 40; i++) { const m = balao({ icon: ICONES[i % ICONES.length] }, 5); m.position.set((R() - .5) * 50, 6 + R() * 14, -30 - R() * 30); c.add(m); far.push({ m, off: .6 + R() * 3.6 }); }
  const hero = makeChar({ outfit: 'hero', glow: .2 }); hero.place(-.25, -.35, -.38); c.add(hero.root); hero.tint('#D9D2E4');
  c.add(new THREE.HemisphereLight('#6E6AA8', '#2a1f28', .8)); const moon = new THREE.DirectionalLight('#A9A8E8', .8); moon.position.set(-8, 14, 6); moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, far: 40 }); c.add(moon); const warm = new THREE.PointLight('#FFC88A', 3, 5); warm.position.set(0, 2.4, -1.4); c.add(warm);
  s.update = (t, u) => { far.forEach(f => { f.m.quaternion.copy(s.camera.quaternion); const k = smooth(f.off, f.off + .5, u); f.m.scale.setScalar(Math.max(.001, 1 - k)); f.m.visible = k < 1; });
    hero.face(s.camera); hero.pose({ armL: [20, -60], armR: [20, -60], legL: [0, 0], legR: [0, 0], head: lerp(6, -2, smooth(1, 4, u)) }); hero.eye(u < 1.8 ? 'look' : u < 4 ? 'shut' : 'happy');
    const e = smooth(0, 6.25, u); aim(s.camera, [lerp(.6, .2, e), lerp(1.3, 1.5, e), lerp(3.2, 4.2, e)], [lerp(-.1, -.2, e), lerp(1.4, 2.2, e), -3], -.01);
    return { focus: lerp(3.3, 4.4, e), range: 2.0, blur: 14, bloom: .4, bloomT: .85, vig: .5, exposure: .95 }; };
  return s; }
