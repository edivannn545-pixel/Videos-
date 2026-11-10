import * as THREE from 'three';
import { makeShot, aim, keys, smooth, lerp, clamp, rng } from './motor/core.js';
import { makeChar, canvasTex } from './motor/char.js';
import { box, std, cut, glowSprite, building, street, lamp, tree, car, skyline, sky } from './motor/kit.js';
import { crowd, uT, stars, probe } from './motor/kit2.js';
import { woodFloor, tileFloor, wallMat, beam, naMao } from './comum.js';
import { skyAnel, terraComAnel, drawArco } from './anel.js';

// quarto com janela grande na parede do fundo; o céu lá fora vem de skyFn(c)
export function quartoJanela(c, noite) {
  c.add(woodFloor(12, 12, '#6D4A33'));
  const wm = wallMat(noite ? '#2F3B66' : '#3F6A8A', noite ? '#28325A' : '#38607E', noite ? '#3A4674' : '#4A7898', 3, 1);
  const W = 1.8, H = 1.9, Y = 1.85; // abertura da janela
  const wl = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), wm); wl.position.set(-W / 2 - 2.5, 2.5, -2.6); c.add(wl); const wr = wl.clone(); wr.position.x = W / 2 + 2.5; c.add(wr);
  const wt = new THREE.Mesh(new THREE.PlaneGeometry(W, 5 - (Y + H / 2)), wm); wt.position.set(0, (Y + H / 2) + (5 - (Y + H / 2)) / 2, -2.6); c.add(wt); const wb = new THREE.Mesh(new THREE.PlaneGeometry(W, Y - H / 2), wm); wb.position.set(0, (Y - H / 2) / 2, -2.6); c.add(wb);
  for (const m of [wl, wr, wt, wb]) m.receiveShadow = true;
  c.add(box(W + .2, .08, .3, '#F4EEE2', 0, Y - H / 2, -2.5)); c.add(box(W + .2, .08, .12, '#F4EEE2', 0, Y + H / 2, -2.58)); c.add(box(.08, H, .12, '#F4EEE2', -W / 2, Y, -2.58)); c.add(box(.08, H, .12, '#F4EEE2', W / 2, Y, -2.58)); c.add(box(.05, H, .06, '#F4EEE2', 0, Y, -2.6)); c.add(box(W, .05, .06, '#F4EEE2', 0, Y + .2, -2.6));
  c.add(box(12, .9, .06, '#E9E2D2', 0, .45, -2.55));
  // vaso na janela, quadro, cama, mesinha com abajur
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(.1, .08, .18, 16), std('#C9563E')); pot.position.set(.6, Y - H / 2 + .13, -2.45); c.add(pot); for (let i = 0; i < 5; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(.08, 8, 6), std('#55934F')); l.scale.set(.6, 1.6, .3); l.position.set(.6 + Math.sin(i * 2) * .07, Y - H / 2 + .32 + (i % 2) * .06, -2.45); l.rotation.z = Math.sin(i * 2) * .5; c.add(l); }
  const fr = canvasTex(300, 240, (x) => { x.fillStyle = '#3B2A1E'; x.fillRect(0, 0, 300, 240); x.fillStyle = '#E9C46A'; x.fillRect(16, 16, 268, 208); x.fillStyle = '#C9563E'; x.beginPath(); x.arc(150, 120, 60, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 8; x.beginPath(); x.ellipse(150, 120, 110, 24, -.3, 0, 7); x.stroke(); }); const f2 = new THREE.Mesh(new THREE.PlaneGeometry(.6, .48), new THREE.MeshStandardMaterial({ map: fr })); f2.position.set(-1.9, 2.3, -2.55); c.add(f2);
  c.add(box(2.0, .34, 2.3, '#5A3722', -2.5, .3, -1.2)); c.add(box(1.9, .24, 2.2, '#F2ECDF', -2.5, .56, -1.2)); const blk = canvasTex(256, 256, (x) => { x.fillStyle = '#3F5688'; x.fillRect(0, 0, 256, 256); x.fillStyle = '#F2C94C'; for (let i = 0; i < 8; i++) for (let k = 0; k < 8; k++) if ((i * 3 + k) % 5 === 0) { x.beginPath(); x.arc(i * 32 + 16, k * 32 + 16, 5, 0, 7); x.fill(); } }); c.add(box(1.92, .3, 1.4, new THREE.MeshStandardMaterial({ map: blk }), -2.5, .7, -.7));
  c.add(box(.6, .7, .5, '#6E4A32', 1.9, .35, -2.1)); const shade = new THREE.Mesh(new THREE.CylinderGeometry(.13, .22, .28, 20), new THREE.MeshStandardMaterial({ color: '#F6DDA4', emissive: '#FFC67A', emissiveIntensity: noite ? 1 : .4 })); shade.position.set(1.9, 1.05, -2.1); c.add(shade);
  // cortinas (duas metades que deslizam)
  const ct = canvasTex(256, 512, (x) => { x.fillStyle = '#C9563E'; x.fillRect(0, 0, 256, 512); for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#B44A34' : '#D6684E'; x.fillRect(i * 32, 0, 32, 512); } x.fillStyle = '#F2C94C'; for (let k = 0; k < 10; k++) x.fillRect(0, 40 + k * 50, 256, 4); });
  const cl = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 2.3), new THREE.MeshStandardMaterial({ map: ct, side: THREE.DoubleSide })); cl.castShadow = true; const cr = cl.clone(); c.add(cl, cr); c.add(box(W + 1.4, .05, .05, '#2a2a30', 0, Y + H / 2 + .2, -2.4));
  const setCortina = (k) => { cl.position.set(lerp(-W / 2 - .45, -.5, k), Y - .1, -2.42); cr.position.set(lerp(W / 2 + .45, .5, k), Y - .1, -2.41); };
  setCortina(0); return { setCortina, Y, W, H };
}

/** 1. Você abre a janela: o céu cortado ao meio — 0 a 4.55 */
export function shotJanela(t0, t1) { const s = makeShot(t0, t1, '#9CCBE4', 38), c = s.scene; c.fog = new THREE.FogExp2('#C8DCE8', .01);
  const q = quartoJanela(c, false);
  skyAnel(c, -9, 26, 20, [[0, '#4F86C6'], [.6, '#9CCBE4'], [1, '#F6E6D0']], { cx: 512, cy: 1150, rx: 260, ry: 450, band: 70, col: [255, 252, 244], a: .95, glow: .35, tilt: -.1 }, (x) => { x.fillStyle = '#8FA6BC'; for (let i = 0; i < 30; i++) { const w = 20 + (i * 37 % 40), h = 60 + (i * 53 % 160); x.fillRect(i * 36, 1024 - h - 330, w, h + 330); } }, .35);
  c.add(new THREE.HemisphereLight('#E6F0FF', '#6a4a40', 1.0)); const sun = new THREE.DirectionalLight('#FFF0D8', 2.2); sun.position.set(1, 4, -8); sun.target.position.set(0, 0, 0); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, far: 30 }); c.add(sun, sun.target);
  beam(c, 0, 1.3, -1.2, 1.6, 3.6, 0, .12);
  const hero = makeChar({ outfit: 'hero', glow: .16 }); hero.place(.1, -1.3); c.add(hero.root); hero.tint('#FFF4E6');
  s.update = (t, u) => { const k = 1 - smooth(.2, 1.3, u); q.setCortina(k); const op = smooth(.2, 1.0, u); hero.pose({ armL: [lerp(150, 10, op), lerp(20, 6, op)], armR: [lerp(150, 10, op), lerp(20, 6, op)], head: u > 1.4 ? 8 : 0 }); hero.face(s.camera); hero.eye(u < 1.3 ? 'shut' : u < 2.0 ? 'open' : 'wide');
    const e = smooth(0, 4.55, u); aim(s.camera, [lerp(.4, .2, e), lerp(1.4, 1.3, e), lerp(2.2, 3.0, e)], [.1, lerp(1.5, 2.0, e), -2.6], .01);
    return { focus: lerp(3.4, 4.3, e), range: 2.0, blur: 13, bloom: .3, bloomT: .9, vig: .42, exposure: 1 }; };
  return s; }

/** 2. Daqui do Brasil: o arco no céu do norte — 4.55 a 9.35 */
export function shotCidade(t0, t1) { const s = makeShot(t0, t1, '#E8966A', 40), c = s.scene; c.fog = new THREE.FogExp2('#F1A97C', .008);
  skyAnel(c, -160, 520, 380, [[0, '#3D3360'], [.45, '#8A5A86'], [.75, '#E8956B'], [1, '#F7CF98']], { cx: 512, cy: 1250, rx: 340, ry: 709, band: 90, col: [255, 244, 228], a: .95, glow: .35 });
  skyline(c, -150, 400, 130, ['#7A5272', '#6B4868', '#5A3E5E'], false, 5);
  const fl = tileFloor(20, 20, '#8A7A86', '#7E6E7A', 1); c.add(fl);
  c.add(box(20, .9, .2, '#A8909C', 0, .45, -4)); for (let k = 0; k < 30; k++) c.add(box(.05, .6, .05, '#2a2a30', -10 + k * .7, 1.2, -4));
  for (let k = 0; k < 4; k++) { const caixa = box(1.2, 1.0, 1.0, '#D9D2C2', -4 + k * 2.6, .5, -6.5); c.add(caixa); }
  const cristo = canvasTex(256, 512, (x) => { x.fillStyle = '#5A3E5E'; x.beginPath(); x.moveTo(0, 512); x.quadraticCurveTo(128, 120, 256, 512); x.fill(); x.fillRect(122, 40, 12, 120); x.fillRect(70, 70, 116, 12); x.beginPath(); x.arc(128, 34, 12, 0, 7); x.fill(); }); const cm = new THREE.Mesh(new THREE.PlaneGeometry(40, 80), new THREE.MeshBasicMaterial({ map: cristo, transparent: true, fog: false })); cm.position.set(-60, 30, -140); c.add(cm);
  const fio = []; for (let k = 0; k < 16; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(.05, 10, 8), new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#FFD27A', emissiveIntensity: 3 })); b.position.set(-3.5 + k * .45, 2.7 - Math.sin(k / 15 * Math.PI) * .4, -2.5); c.add(b); }
  const R = rng(3), spots = []; for (let i = 0; i < 26; i++) { const x = (R() - .5) * 9, z = -1 - R() * 2.6; if (Math.abs(x) < .8 && z > -2) continue; spots.push([x, z, 0, Math.PI]); } crowd(c, spots, { raised: .55, jump: .05, seed: 3, tint: '#FFD8C0' });
  const hero = makeChar({ outfit: 'hero', glow: .2 }); hero.place(0, .6); c.add(hero.root); hero.tint('#FFE0C8');
  c.add(new THREE.HemisphereLight('#E6C8E6', '#7a4a3a', 1.0)); const sun = new THREE.DirectionalLight('#FFB070', 2.2); sun.position.set(10, 8, -20); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, far: 60 }); c.add(sun);
  s.update = (t, u) => { uT.value = t; hero.face(s.camera); hero.pose({ armL: [8, 6], armR: [lerp(8, 140, smooth(1.5, 1.9, u)), 10], head: 10 }); hero.eye(u < 1.5 ? 'wide' : 'happy');
    const e = smooth(0, 4.8, u); aim(s.camera, [lerp(.5, .2, e), lerp(1.3, 1.1, e), lerp(3.4, 4.2, e)], [0, lerp(2.2, 5.5, e), -10], -.01);
    return { focus: lerp(2.9, 3.6, e), range: 2.4, blur: 13, bloom: .36, bloomT: .88, vig: .42, exposure: 1 }; };
  return s; }

/** 3. Praia à noite: os anéis brilham — 9.35 a 15.95 */
export function shotPraia(t0, t1) { const s = makeShot(t0, t1, '#141A3A', 40), c = s.scene; c.fog = new THREE.FogExp2('#202A50', .01);
  skyAnel(c, -160, 520, 380, [[0, '#070B22'], [.5, '#141E4A'], [1, '#2A3A6E']], { cx: 512, cy: 1250, rx: 340, ry: 709, band: 90, col: [236, 240, 255], a: 1, glow: .6 }, (x) => { const R = rng(2); for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(255,255,255,${R() * .6})`; x.fillRect(R() * 1024, R() * 700, 2, 2); } });
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(400, 200), new THREE.MeshStandardMaterial({ color: '#1A2A5A', roughness: .15, metalness: .6 })); sea.rotation.x = -Math.PI / 2; sea.position.set(0, .01, -110); c.add(sea);
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshStandardMaterial({ map: (() => { const t = canvasTex(256, 256, (x) => { x.fillStyle = '#B9A48A'; x.fillRect(0, 0, 256, 256); const R = rng(5); for (let i = 0; i < 2000; i++) { x.fillStyle = `rgba(${R() < .5 ? '255,255,255' : '0,0,0'},${R() * .08})`; x.fillRect(R() * 256, R() * 256, 2, 2); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 5); return t; })(), roughness: 1 })); sand.rotation.x = -Math.PI / 2; sand.position.z = -5; sand.receiveShadow = true; c.add(sand);
  const reflex = glowSprite('#DDE6FF', 30, .25); reflex.position.set(0, .5, -60); c.add(reflex);
  // guarda-sol, cadeiras, coqueiro
  const um = new THREE.Mesh(new THREE.ConeGeometry(1.3, .5, 12, 1, true), new THREE.MeshStandardMaterial({ map: canvasTex(256, 64, (x) => { for (let i = 0; i < 12; i++) { x.fillStyle = i % 2 ? '#F6F1E4' : '#D94F58'; x.fillRect(i * 22, 0, 22, 64); } }), side: THREE.DoubleSide })); um.position.set(1.4, 2.2, -1.2); um.castShadow = true; c.add(um); c.add(box(.05, 2.2, .05, '#E9E2D2', 1.4, 1.1, -1.2));
  for (const [x, col] of [[.9, '#36AEA2'], [2.0, '#F2C94C']]) { const ch = box(.55, .06, 1.2, col, x, .35, -1.0); ch.rotation.x = -.3; c.add(ch); c.add(box(.5, .35, .05, '#6E4A32', x, .17, -.5)); }
  const tronco = new THREE.Mesh(new THREE.CylinderGeometry(.12, .2, 5, 10), std('#6E4A32')); tronco.position.set(-2.6, 2.5, -3); tronco.rotation.z = -.15; c.add(tronco); for (let i = 0; i < 7; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.6, 10, 6), std('#2E5F3A')); f.scale.set(2.4, .25, .6); f.position.set(-2.25 + Math.cos(i) * .9, 5.0, -3 + Math.sin(i) * .9); f.rotation.y = i; f.rotation.z = -.4; c.add(f); }
  const R = rng(8), spots = []; for (let i = 0; i < 40; i++) spots.push([(R() - .5) * 20, -4 - R() * 10, 0, Math.PI]); crowd(c, spots, { raised: .3, jump: .02, seed: 9, tint: '#B8C4E8' });
  const hero = makeChar({ outfit: 'hero', glow: .2 }); hero.place(.1, .3); c.add(hero.root); hero.tint('#D8E0FF');
  const oculos = cut(canvasTex(256, 96, (x) => { x.fillStyle = '#111'; x.strokeStyle = '#E9ECF2'; x.lineWidth = 6; x.beginPath(); x.ellipse(70, 48, 52, 32, 0, 0, 7); x.ellipse(186, 48, 52, 32, 0, 0, 7); x.fill(); x.stroke(); x.fillStyle = '#E9ECF2'; x.fillRect(118, 40, 20, 8); }), .42, .16, {}); oculos.position.set(0, .02, .01); hero.head.add(oculos);
  c.add(new THREE.HemisphereLight('#8A9AE0', '#1a1a30', .8)); const ringL = new THREE.DirectionalLight('#DCE4FF', 1.6); ringL.position.set(2, 10, -8); ringL.castShadow = true; ringL.shadow.mapSize.set(2048, 2048); Object.assign(ringL.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, far: 40 }); c.add(ringL);
  s.update = (t, u) => { uT.value = t; hero.face(s.camera); const off = smooth(4.6, 4.9, u); oculos.visible = u < 4.0; hero.pose({ armL: [lerp(30, 8, off), lerp(-130, 6, off)], armR: [lerp(30, 8, off), lerp(-130, 6, off)], head: u < 4.6 ? 4 : -2 }); hero.eye(u < 4.0 ? 'happy' : u < 4.6 ? 'smug' : 'look');
    const e = smooth(0, 6.6, u); aim(s.camera, [lerp(-.6, .2, e), lerp(1.2, 1.4, e), lerp(4.6, 3.4, e)], [.1, lerp(2.4, 1.5, e), -4], .012);
    return { focus: lerp(4.4, 3.2, e), range: 2.2, blur: 13, bloom: .5, bloomT: .8, vig: .5, exposure: 1 }; };
  return s; }

/** 4a. Espaço: a sombra dos anéis sobre metade da Terra — 15.95 a 21.8 */
export function shotSombra(t0, t1) { const s = makeShot(t0, t1, '#02030A', 34), c = s.scene; s.camera.far = 2400; s.camera.updateProjectionMatrix(); stars(c, 3000, 900, 4);
  const T = terraComAnel(c, 10, 23.4);
  const sun = new THREE.DirectionalLight('#FFF4E0', 3.2); sun.position.set(60, 14, 20); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 200 }); sun.shadow.bias = -.0004; c.add(sun); c.add(new THREE.AmbientLight('#20283a', .5));
  const sunG = glowSprite('#FFF2D0', 140, .8); sunG.position.set(600, 140, 200); c.add(sunG);
  s.update = (t, u) => { T.terra.rotation.y = u * .05; const e = smooth(0, 5.85, u); const a = lerp(.2, .75, e); aim(s.camera, [Math.sin(a) * lerp(58, 46, e), lerp(26, 20, e), Math.cos(a) * lerp(58, 46, e)], [0, lerp(-1, -3, e), 0], 0);
    return { focus: 50, range: 40, blur: 6, bloom: .5, bloomT: .8, vig: .5, exposure: 1 }; };
  return s; }

/** 4b. Inverno escuro na rua: frio, sombra do anel no céu — 21.8 a 28.75 */
export function shotInverno(t0, t1) { const s = makeShot(t0, t1, '#2A3452', 40), c = s.scene; c.fog = new THREE.FogExp2('#3A4A6A', .02);
  skyAnel(c, -170, 460, 340, [[0, '#1A2240'], [.5, '#3A4A70'], [1, '#6A7A9A']], { cx: 512, cy: 1250, rx: 340, ry: 709, band: 90, col: [120, 130, 160], a: .9, glow: 0 }, (x) => { x.fillStyle = 'rgba(10,14,30,.55)'; x.fillRect(0, 0, 1024, 600); });
  skyline(c, -150, 400, 170, ['#2F3A58', '#3A4664', '#4A5672'], true, 6); street(c, true);
  c.add(new THREE.HemisphereLight('#7A8AB8', '#1a2030', .7)); const key = new THREE.DirectionalLight('#9FB0D8', .6); key.position.set(-10, 20, 8); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, far: 70 }); c.add(key);
  const shops = [{ name: 'PADARIA', bg: '#7A5532', awning: '#3E7A5C' }, { name: 'CAFÉ', bg: '#8F4A2F', fg: '#FFE3C8', awning: '#D94F58', font: 'Caveat', size: 120 }, { name: 'FARMÁCIA', bg: '#2F8F7C', font: 'Inter', size: 100 }, { name: 'LIVROS', bg: '#3F5688' }];
  let z = 6, i = 0; while (z > -80) { const d = 7 + (i * 37 % 5); c.add(building(300 + i, { x: 13, z: z - d / 2, w: 8, d, floors: 4 + i % 3, side: -1, night: true, shop: shops[i % 4] })); c.add(building(400 + i, { x: -13, z: z - d / 2, w: 8, d, floors: 5 + i % 3, side: 1, night: true, shop: shops[(i + 2) % 4] })); z -= d; i++; }
  for (let k = 0; k < 6; k++) { lamp(c, 5, -4 - k * 12, -1, true, 4); tree(c, 5.2, -9 - k * 12, 1.05, ['#2E3F3A', '#3A4E44', '#4A5E50', '#6A7A6A'], k); } car(c, -3.1, -8, '#27425A', -1);
  const cachecol = () => canvasTex(256, 96, (x) => { x.fillStyle = '#D94F58'; x.fillRect(0, 20, 256, 56); x.fillStyle = '#F2C94C'; for (let i = 0; i < 8; i++) x.fillRect(i * 32, 20, 10, 56); });
  const hero = makeChar({ outfit: 'hero', glow: .16 }); hero.place(5.9, .6, .14); c.add(hero.root); hero.tint('#C8D4F0'); const cc = cut(cachecol(), .5, .19, {}); cc.position.set(0, 1.2, .03); hero.body.add(cc); const gorro = cut(canvasTex(256, 200, (x) => { x.fillStyle = '#3F78A8'; x.beginPath(); x.ellipse(128, 150, 120, 110, 0, Math.PI, 0); x.fill(); x.fillStyle = '#F6F1E4'; x.fillRect(8, 140, 240, 40); x.beginPath(); x.arc(128, 30, 26, 0, 7); x.fill(); }), .62, .48, {}); gorro.position.set(0, .3, .02); hero.head.add(gorro);
  const viz = makeChar({ outfit: 'amarelo', hair: 'afro', hairc: '#2a1b18', lash: true }); viz.place(7.3, -2.4, .14); c.add(viz.root); viz.tint('#C8D4F0');
  const vapor = []; for (let i = 0; i < 6; i++) { const m = glowSprite('#E6ECF6', .35, 0); c.add(m); vapor.push(m); }
  s.update = (t, u) => { hero.face(s.camera); viz.face(s.camera); const tr = Math.sin(u * 40) * 1.2; hero.pose({ armL: [30, -130], armR: [30, -130], head: tr * .6, lean: tr * .3, squash: -.015 }); hero.eye(u < 1.8 ? 'look' : u < 4.5 ? 'sad' : 'flat'); viz.pose({ armL: [30, -130], armR: [30, -130], head: Math.sin(u * 37) * 1.0 }); viz.eye('shut');
    vapor.forEach((m, i) => { const k = ((u * .7 + i / 6) % 1); const hp = new THREE.Vector3(); hero.head.getWorldPosition(hp); m.position.set(hp.x + .12 + k * .2, hp.y - .05 + k * .4, hp.z + .2); m.material.opacity = Math.sin(k * Math.PI) * .35; m.scale.setScalar(.2 + k * .5); });
    const e = smooth(0, 6.95, u); aim(s.camera, [lerp(4.2, 4.6, e), lerp(1.3, 1.8, e), lerp(4.6, 5.6, e)], [lerp(5.9, 6.2, e), lerp(1.5, 2.6, e), -3], -.01);
    return { focus: lerp(4.4, 5.3, e), range: 2.6, blur: 12, bloom: .32, bloomT: .9, vig: .55, exposure: .92, sat: .75, tint: '#DCE6FF' }; };
  return s; }

/** 5. Os pedaços do anel e o satélite furado — 28.75 a 36.55 */
export function shotSatelite(t0, t1) { const s = makeShot(t0, t1, '#02030A', 40), c = s.scene; s.camera.far = 2400; s.camera.updateProjectionMatrix(); stars(c, 2600, 900, 7);
  const R = rng(4), N = 2600, geo = new THREE.IcosahedronGeometry(1, 0), mat = new THREE.MeshStandardMaterial({ roughness: .8, flatShading: true }); const im = new THREE.InstancedMesh(geo, mat, N); const d = new THREE.Object3D(), col = new THREE.Color(); const data = [];
  for (let i = 0; i < N; i++) { const x = (R() - .5) * 120, y = (R() - .5) * 2.4 * (1 + Math.abs(x) * .01), z = -R() * 140 + 10, sc = .03 + R() ** 3 * .9; data.push({ x, y, z, sc, rx: R() * 6, ry: R() * 6, sp: .2 + R() }); im.setColorAt(i, col.set(R() < .7 ? '#DCD6CC' : R() < .5 ? '#A89A8A' : '#F2F4F8')); }
  im.castShadow = true; im.receiveShadow = true; c.add(im);
  const sat = probe(); sat.position.set(0, 1.2, 4); sat.scale.setScalar(.6); c.add(sat);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(.12, 16), new THREE.MeshBasicMaterial({ color: '#000' })); c.add(hole);
  const spark = glowSprite('#FFE6B0', 3, 0); c.add(spark); const streak = new THREE.Mesh(new THREE.PlaneGeometry(4, .04), new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); c.add(streak);
  const deb = []; for (let i = 0; i < 24; i++) { const m = new THREE.Mesh(new THREE.TetrahedronGeometry(.04 + R() * .05), std('#C9CFD6', { metalness: .6 })); m.visible = false; c.add(m); deb.push({ m, v: [(R() - .5) * 2, (R() - .3) * 2, (R() - .5) * 2] }); }
  const sun = new THREE.DirectionalLight('#FFF4E0', 3); sun.position.set(30, 20, 20); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 120 }); c.add(sun); c.add(new THREE.AmbientLight('#303a50', .6));
  const terra = new THREE.Mesh(new THREE.SphereGeometry(300, 64, 48), new THREE.MeshStandardMaterial({ color: '#2E5FA8', roughness: .7 })); terra.position.set(-200, -330, -400); c.add(terra);
  const HIT = 5.55;
  s.update = (t, u) => { for (let i = 0; i < N; i++) { const p = data[i]; d.position.set(p.x - u * .6 * p.sp, p.y, p.z); d.rotation.set(p.rx + u * p.sp, p.ry + u * p.sp * .7, 0); d.scale.setScalar(p.sc); d.updateMatrix(); im.setMatrixAt(i, d.matrix); } im.instanceMatrix.needsUpdate = true;
    sat.rotation.set(.2, u * .08 + .6, .1); sat.position.set(lerp(-.4, .4, u / 7.8), 1.2, 4);
    const hp = new THREE.Vector3(.18, .1, .15); sat.localToWorld(hp); hole.position.copy(hp); hole.lookAt(s.camera.position); hole.visible = u > HIT;
    const k = (u - HIT + .25) / .25; streak.visible = k > 0 && k < 1.2; if (streak.visible) { streak.position.set(hp.x + (1 - k) * 6, hp.y + (1 - k) * 1.5, hp.z); streak.lookAt(s.camera.position); streak.rotation.z = .24; streak.material.opacity = 1 - Math.max(0, k - 1); }
    const f = u - HIT; spark.position.copy(hp); spark.material.opacity = f > 0 ? Math.max(0, 1 - f * 2.5) : 0; spark.scale.setScalar(1 + Math.max(0, f) * 4);
    deb.forEach(dd => { dd.m.visible = f > 0; if (f > 0) { dd.m.position.set(hp.x + dd.v[0] * f * .8, hp.y + dd.v[1] * f * .8, hp.z + dd.v[2] * f * .8); dd.m.rotation.set(f * 5, f * 4, 0); } });
    const e = smooth(0, 7.8, u), sh = f > 0 && f < .5 ? Math.sin(f * 60) * .04 * (1 - f * 2) : 0; aim(s.camera, [lerp(-1.5, 1.0, e) + sh, lerp(2.6, 2.0, e) + sh, lerp(11, 8.6, e)], [lerp(-.6, .2, e), lerp(.6, 1.1, e), lerp(-6, 2, e)], -.06);
    return { focus: lerp(9, 4.6, e), range: lerp(14, 3, e), blur: 13, bloom: .45, bloomT: .8, vig: .5, exposure: 1, flash: f > 0 ? Math.max(0, .5 - f * 2) : 0 }; };
  return s; }
