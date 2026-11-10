import * as THREE from 'three';
import { makeShot, aim, keys, smooth, lerp, clamp, rng } from './motor/core.js';
import { makeChar, canvasTex } from './motor/char.js';
import { box, std, cut, glowSprite, dissolve, building, street, lamp, tree, car, skyline, sky, softBlob } from './motor/kit.js';
import { phone } from './motor/kit2.js';
import { quarto, walletTex, mothTex, drawSaldo, billTex, contaTex, blinds, beam, naMao, woodFloor, wallMat } from './comum.js';

/** 1. Quarto de manhã: carteira vazia, saldo zero — 0 a 7.1 */
export function shotQuarto(t0, t1) { const s = makeShot(t0, t1, '#1E2038', 38), c = s.scene; c.fog = new THREE.FogExp2('#2a2438', .012);
  quarto(c);
  c.add(new THREE.HemisphereLight('#8E9AD0', '#3a2a22', .95)); blinds(c, 6.5, 4.2, 2.5, -.4, 0, -.6, '#FFD79A', 20);
  beam(c, 1.6, 2.1, .6, 1.2, 4.6, -.9, .1); beam(c, 1.0, 2.0, .2, .7, 4.6, -.9, .07);
  const hero = makeChar({ outfit: 'hero', glow: .14 }); hero.place(.6, -.6); c.add(hero.root); hero.tint('#E9E3DA');
  const wal = cut(walletTex(false), .52, .385, { shadow: true }); naMao(hero, 'L', wal, -175, .05);
  const ph = phone(drawSaldo, .3, .6); ph.paint(1234.56); naMao(hero, 'R', ph, -175, .05);
  const moth = cut(mothTex(), .32, .25, { shadow: true }); c.add(moth);
  // objeto desfocado na frente: abajur de pé
  c.add(box(.06, 2.2, .06, '#2a2a30', -1.15, 1.1, 2.6)); const sh = new THREE.Mesh(new THREE.CylinderGeometry(.22, .34, .42, 24), new THREE.MeshStandardMaterial({ color: '#E9D3A8', emissive: '#FFC67A', emissiveIntensity: .5 })); sh.position.set(-1.15, 2.2, 2.6); c.add(sh);
  let lastV = -1;
  s.update = (t, u) => {
    // carteira sobe (0.6–1.1), mariposa sai em "Vazia" (2.4); celular a partir de 3.4; zero em 6.2
    const wUp = smooth(.5, 1.1, u), wDown = smooth(3.2, 3.7, u), pUp = smooth(3.4, 4.0, u);
    const aL = [lerp(8, 34, wUp * (1 - wDown)), lerp(6, -112, wUp * (1 - wDown))], aR = [lerp(8, 30, pUp), lerp(6, -108, pUp)];
    hero.pose({ armL: aL, armR: aR, head: u > 6.2 ? 0 : -3, squash: u > 6.2 ? .02 : 0 }); wal.rotation.z = (aL[0] + aL[1]) * Math.PI / 180; ph.rotation.z = -(aR[0] + aR[1]) * Math.PI / 180;
    wal.visible = wDown < .95; ph.visible = pUp > .02;
    const v = u < 5.4 ? 1234.56 : u < 6.15 ? Math.max(0, Math.round(1234.56 * (1 - (u - 5.4) / .75))) : 0; if (v !== lastV) { ph.paint(v); lastV = v; }
    // mariposa voa da carteira
    const m = clamp((u - 2.4) / 2.2); const wp = new THREE.Vector3(); wal.getWorldPosition(wp); moth.visible = u > 2.4 && u < 4.6; moth.position.set(wp.x + m * .9 + Math.sin(m * 9) * .12, wp.y + .05 + m * 1.3, wp.z + .1 + m * .4); moth.scale.x = .4 + .6 * Math.abs(Math.sin(u * 22)); moth.lookAt(s.camera.position);
    hero.face(s.camera);
    hero.eye(u < .5 ? 'open' : u < 2.4 ? 'down' : u < 3.3 ? 'flat' : u < 6.2 ? 'down' : 'wide');
    const e = smooth(0, 7.1, u), z = smooth(6.1, 6.6, u);
    aim(s.camera, [lerp(1.35, 1.0, e), lerp(1.15, 1.2, e) , lerp(4.4, 3.3, e) - z * .5], [.6, lerp(1.0, 1.08, e), -.6], .012);
    return { focus: lerp(5.0, 3.6, e) - z * .5, range: 1.6, blur: 16, bloom: .24, bloomT: 1, vig: .48, exposure: 1 }; };
  return s; }

/** 2. Rua de madrugada: as notas do caixa eletrônico somem — 7.1 a 9.7 */
export function shotBanco(t0, t1) { const s = makeShot(t0, t1, '#141228', 40), c = s.scene; c.fog = new THREE.FogExp2('#2A2240', .014);
  sky(c, -170, 460, 340, [[0, '#0E1030'], [.5, '#2A2252'], [.8, '#5B3460'], [1, '#8A4A6A']]); skyline(c, -150, 400, 170, ['#2F2748', '#3B2F54', '#4A3A5E'], true, 6); street(c, true);
  c.add(new THREE.HemisphereLight('#6E6AA8', '#2a1f28', .7)); const moon = new THREE.DirectionalLight('#A9A8E8', .8); moon.position.set(-14, 26, 10); moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, far: 70 }); c.add(moon);
  const shops = [{ name: 'BANCO', bg: '#2F5F8F', fg: '#EAF2FF', font: 'Fraunces', size: 130 }, { name: 'LOTÉRICA', bg: '#2F8F5C', awning: '#F2C94C' }, { name: 'LUNA CAFÉ', bg: '#8F4A2F', fg: '#FFE3C8', awning: '#D94F58', font: 'Caveat', size: 120 }, { name: 'CÂMBIO', bg: '#7A3A6A' }, { name: 'LIVROS', bg: '#3F5688' }];
  let z = 6, i = 0; while (z > -90) { const d = 7 + (i * 37 % 5); c.add(building(300 + i, { x: 13, z: z - d / 2, w: 8, d, floors: 4 + i % 3, side: -1, night: true, shop: shops[i % 5] })); c.add(building(400 + i, { x: -13, z: z - d / 2, w: 8, d, floors: 5 + i % 3, side: 1, night: true, shop: shops[(i + 2) % 5] })); z -= d; i++; }
  for (let k = 0; k < 6; k++) { lamp(c, 5, -12 - k * 13, -1, k < 5); tree(c, 5.2, -8 - k * 13, 1.05, undefined, k); lamp(c, -5, -8 - k * 13, 1, k < 4); }
  car(c, -3.1, -9, '#27425A', -1); car(c, 3.1, -20, '#8A2F2F', 1);
  // caixa eletrônico na calçada, perto da câmera
  const atm = new THREE.Group(); atm.add(box(1.0, 1.9, .7, '#2C3E5C', 0, .95, 0)); atm.add(box(1.04, .3, .74, '#36AEA2', 0, 1.95, 0)); const scr = new THREE.Mesh(new THREE.PlaneGeometry(.62, .42), new THREE.MeshBasicMaterial({ map: canvasTex(320, 220, (x) => { x.fillStyle = '#7FE6D6'; x.fillRect(0, 0, 320, 220); x.fillStyle = '#0F2A3A'; x.font = "800 40px Inter"; x.textAlign = 'center'; x.fillText('SAQUE', 160, 90); x.font = "700 30px 'IBM Plex Mono'"; x.fillText('R$ ????', 160, 150); }) })); scr.position.set(0, 1.35, .36); atm.add(scr); atm.add(box(.5, .05, .1, '#111', 0, 1.0, .36)); const atmL = new THREE.PointLight('#7FE6D6', 3, 4); atmL.position.set(0, 1.4, 1); atm.add(atmL); const gl = glowSprite('#7FE6D6', 2.2, .4); gl.position.set(0, 1.35, .5); atm.add(gl);
  atm.position.set(6.3, .14, -6); atm.rotation.y = -1.2; c.add(atm);
  // notas voando e virando pó
  const bt = billTex(), R = rng(9), bills = [];
  for (let k = 0; k < 26; k++) { const m = cut(bt, .32, .15, { blend: true }); c.add(m); bills.push({ m, ph: R() * .9, dx: (R() - .5) * 2.4, dy: 1 + R() * 2.4, dz: (R() - .2) * 2, sp: R() * 6 }); }
  const parts = bills.map((b, k) => dissolve(c, { pos: [6.0 + b.dx * .8, 1.6 + b.dy * .8, -5.6 + b.dz * .8], spread: .2, rise: 1.4, t0: .5 + b.ph, dur: 1.1, n: 18, size: .04, seed: 60 + k }));
  s.update = (t, u) => { bills.forEach((b) => { const k = clamp((u - b.ph * .5) / 1.6); b.m.position.set(6.0 + b.dx * k, 1.0 + b.dy * k, -5.7 + b.dz * k); b.m.rotation.set(u * b.sp * .5, u * b.sp, u * .7); b.m.material.opacity = clamp(1 - (u - .5 - b.ph) / .6); }); parts.forEach(p => p(u));
    const e = smooth(0, 2.6, u); aim(s.camera, [lerp(2.6, 2.9, e), lerp(1.3, 1.6, e), lerp(3.4, 2.4, e)], [6.1, lerp(1.9, 2.5, e), -6.2], -.02);
    return { focus: 9.5, range: 2.6, blur: 14, bloom: .36, bloomT: .9, vig: .5, exposure: .95 }; };
  return s; }

/** 3. Cozinha de dia: as contas somem da geladeira, você comemora — 9.7 a 17.3 */
export function shotContas(t0, t1) { const s = makeShot(t0, t1, '#F1D9B4', 38), c = s.scene; c.fog = new THREE.FogExp2('#F3DCC0', .02);
  const tile = canvasTex(256, 256, (x) => { x.fillStyle = '#E9E4D6'; x.fillRect(0, 0, 256, 256); x.fillStyle = '#C6D9D2'; for (let i = 0; i < 4; i++) for (let k = 0; k < 4; k++) if ((i + k) % 2) x.fillRect(i * 64, k * 64, 64, 64); }); tile.wrapS = tile.wrapT = THREE.RepeatWrapping; tile.repeat.set(5, 5);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshStandardMaterial({ map: tile, roughness: .4 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; c.add(fl);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat('#E9B88A', '#E2AE7E', '#F2C9A0', 5, 2)); wall.position.set(0, 2.5, -2.4); wall.receiveShadow = true; c.add(wall);
  const azul = canvasTex(256, 256, (x) => { x.fillStyle = '#F4F1EA'; x.fillRect(0, 0, 256, 256); x.strokeStyle = '#3F78A8'; x.lineWidth = 4; for (let i = 0; i < 4; i++) for (let k = 0; k < 4; k++) { x.strokeRect(i * 64 + 4, k * 64 + 4, 56, 56); x.beginPath(); x.arc(i * 64 + 32, k * 64 + 32, 14, 0, 7); x.stroke(); } }); azul.wrapS = azul.wrapT = THREE.RepeatWrapping; azul.repeat.set(6, 1); const back = new THREE.Mesh(new THREE.PlaneGeometry(6, .9), new THREE.MeshStandardMaterial({ map: azul })); back.position.set(-2.3, 1.4, -2.38); c.add(back);
  // bancada e armários
  c.add(box(4.6, .9, .7, '#3F8A7C', -2.4, .45, -2.0)); c.add(box(4.7, .06, .76, '#EFE8D8', -2.4, .93, -2.0)); for (let i = 0; i < 6; i++) { c.add(box(.66, .7, .02, '#4FA090', -4.3 + i * .76, .45, -1.64)); c.add(box(.14, .03, .03, '#E9C94A', -4.3 + i * .76, .68, -1.62)); }
  for (let i = 0; i < 4; i++) c.add(box(1.0, .8, .4, '#3F8A7C', -4.0 + i * 1.08, 2.6, -2.2));
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .24, 20), std('#C9472F', { roughness: .4 })); pot.position.set(-3.2, 1.08, -2.0); pot.castShadow = true; c.add(pot);
  for (let i = 0; i < 3; i++) { const j = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .24, 16), std(['#F2C94C', '#D2728A', '#7FB58A'][i])); j.position.set(-1.6 + i * .22, 1.08, -2.15); j.castShadow = true; c.add(j); }
  // geladeira com contas presas
  const fr = new THREE.Group(); fr.add(box(1.0, 2.1, .8, '#F2F0EA', 0, 1.05, 0)); fr.add(box(1.02, .02, .82, '#C9C6BE', 0, 1.42, 0)); fr.add(box(.05, .5, .05, '#B9B6AE', .38, 1.8, .42)); fr.add(box(.05, .6, .05, '#B9B6AE', .38, .95, .42)); fr.position.set(1.1, 0, -1.9); c.add(fr);
  const contas = [['ALUGUEL', 'R$ 1.500', '#C9472F', -.22, 1.7, 1.0], ['CARTÃO', 'R$ 2.380', '#3F5688', .2, 1.62, 1.75], ['LUZ', 'R$ 230', '#E8A23E', -.22, 1.05, 2.4], ['ÁGUA', 'R$ 95', '#36AEA2', .2, 1.0, 2.4], ['CELULAR', 'R$ 80', '#7A3A6A', -.05, .55, 2.4]].map(([ti, v, col, x, y, at], k) => { const m = cut(contaTex(ti, v, col), .36, .48, { blend: true }); m.position.set(1.1 + x, y, -1.48); m.rotation.z = (k % 2 ? .08 : -.07); c.add(m); const mg = new THREE.Mesh(new THREE.SphereGeometry(.03, 10, 8), std(['#D94F58', '#F2C94C', '#36AEA2'][k % 3])); mg.position.set(1.1 + x, y + .2, -1.46); c.add(mg); const p = dissolve(c, { pos: [1.1 + x, y, -1.45], spread: .2, rise: 1.6, t0: at, dur: 1.1, n: 70, size: .035, seed: 80 + k, color: '#FFF1C8' }); return { m, mg, at, p }; });
  // janela com sol
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.3), new THREE.MeshBasicMaterial({ color: '#FFF4D8' })); win.position.set(-1.0, 2.4, -2.37); c.add(win); c.add(box(1.7, .08, .1, '#FFFFFF', -1.0, 1.72, -2.33)); c.add(box(.06, 1.3, .06, '#FFFFFF', -1.0, 2.4, -2.33)); const gw = glowSprite('#FFE6B0', 3.4, .5); gw.position.set(-1, 2.4, -2.2); c.add(gw);
  beam(c, -.4, 1.8, -.8, 1.3, 4.2, .7, .12); beam(c, .3, 1.6, -.4, .8, 4.2, .7, .08);
  c.add(new THREE.HemisphereLight('#FFF2DC', '#9A6A4A', 1.0)); const sun = new THREE.DirectionalLight('#FFE0A8', 2.2); sun.position.set(-4, 7, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, far: 30 }); sun.shadow.radius = 4; c.add(sun);
  // planta desfocada na frente
  for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(.22, 10, 8), std(i % 2 ? '#3E7A44' : '#55934F')); l.scale.set(.6, 1.8, .3); l.position.set(-1.2 + Math.sin(i * 2.3) * .3, 1.2 + (i % 3) * .2, 3.2); l.rotation.z = Math.sin(i * 2.3) * .6; c.add(l); }
  const hero = makeChar({ outfit: 'hero', glow: .14 }); hero.place(-.15, -.4); c.add(hero.root); hero.tint('#FFF4E6');
  s.update = (t, u) => { contas.forEach((k) => { const g = smooth(k.at, k.at + .5, u); k.m.material.opacity = 1 - g; k.m.visible = g < .99; k.mg.visible = g < .5; k.p(u); });
    hero.face(s.camera);
    if (u < 1.6) { hero.pose({ armL: [8, 6], armR: [8, 6], head: 4 }); hero.eye(u < 1.0 ? 'look' : 'wide'); }
    else if (u < 5.3) { hero.cheer(u, 0, 1); hero.eye('happy'); }
    else { const f = smooth(5.3, 5.6, u); hero.pose({ armL: [lerp(150, 20, f), lerp(18, 10, f)], armR: [lerp(150, 20, f), lerp(18, 10, f)], head: -4 * f }); hero.eye(u < 6.2 ? 'smug' : 'look'); }
    const e = smooth(0, 7.6, u), push = smooth(5.3, 7.6, u); aim(s.camera, [lerp(-.6, -.2, e), lerp(1.3, 1.25, e), lerp(4.6, 3.9, e) - push * .9], [.4, lerp(1.25, 1.35, push), -1.5], .01);
    return { focus: lerp(5.0, 3.6, push), range: 2.6, blur: 14, bloom: .26, bloomT: .95, vig: .4, exposure: 1.0 }; };
  return s; }

/** 4. A padaria: o padeiro na porta — 17.3 a 20.95 */
export function shotPadaria(t0, t1) { const s = makeShot(t0, t1, '#BCE3EE', 40), c = s.scene; c.fog = new THREE.FogExp2('#F6E6D0', .012);
  sky(c, -170, 460, 340, [[0, '#6FB2DA'], [.6, '#BFE0EC'], [1, '#FBE9D0']]); skyline(c, -150, 400, 170, ['#B9C6D6', '#A9B8CC', '#9AAAC2'], false, 4); street(c, false);
  c.add(new THREE.HemisphereLight('#E6F0FF', '#8a6a50', 1.15)); const sun = new THREE.DirectionalLight('#FFE6BE', 2.4); sun.position.set(-18, 16, 8); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, far: 80 }); sun.shadow.bias = -.0005; c.add(sun);
  const shops = [{ name: 'PADARIA', bg: '#7A5532', fg: '#FFE7B8', awning: '#D9483A', font: 'Fraunces', size: 120 }, { name: 'FARMÁCIA', bg: '#2F8F7C', font: 'Inter', size: 100 }, { name: 'A ROSA', bg: '#B04463', awning: '#EFEDE0' }, { name: 'LIVROS', bg: '#3F5688' }, { name: 'TONY PIZZA', bg: '#8A3226', awning: '#D9483A' }];
  let z = 6, i = 0; while (z > -70) { const d = 7 + (i * 37 % 5); c.add(building(500 + i, { x: 13, z: z - d / 2, w: 8, d, floors: 3 + i % 3, side: -1, night: false, shop: shops[i % 5] })); c.add(building(600 + i, { x: -13, z: z - d / 2, w: 8, d, floors: 4 + (i * 2) % 3, side: 1, night: false, shop: shops[(i + 2) % 5] })); z -= d; i++; }
  const pal = ['#3E5F3A', '#4F7A44', '#6E9A50', '#C9CC72']; for (let k = 0; k < 6; k++) { lamp(c, 5, -12 - k * 12, -1, false); tree(c, 5.2, -9 - k * 12, 1.05, pal, k); tree(c, -5.2, -5 - k * 12, 1.05, pal, k + 1); } car(c, -3.1, -6, '#27425A', -1, false); car(c, 3.1, -16, '#D7A83E', 1, false);
  // vitrine com pães e cesta na calçada
  const paes = canvasTex(512, 256, (x) => { x.fillStyle = '#F6E3C0'; x.fillRect(0, 0, 512, 256); x.fillStyle = '#C8813E'; for (let r = 0; r < 2; r++) for (let k = 0; k < 6; k++) { x.beginPath(); x.ellipse(46 + k * 84, 70 + r * 110, 36, 24, 0, 0, 7); x.fill(); } x.fillStyle = '#E8B26A'; for (let r = 0; r < 2; r++) for (let k = 0; k < 6; k++) { x.fillRect(32 + k * 84, 62 + r * 110, 28, 5); } });
  const vit = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), new THREE.MeshStandardMaterial({ map: paes, emissiveMap: paes, emissive: new THREE.Color(.35, .3, .25) })); vit.rotation.y = -Math.PI / 2; vit.position.set(8.95, 1.4, 1.4); c.add(vit);
  const basket = new THREE.Mesh(new THREE.CylinderGeometry(.42, .32, .32, 20), std('#B5803E')); basket.position.set(7.8, .5, -.6); basket.castShadow = true; c.add(basket); c.add(box(.9, .5, .9, '#6E4A32', 7.8, .25, -.6));
  for (let k = 0; k < 6; k++) { const b = new THREE.Mesh(new THREE.CapsuleGeometry(.07, .5, 6, 12), std('#D6974A')); b.position.set(7.7 + (k % 3) * .1, .85, -.7 + (k > 2 ? .15 : 0)); b.rotation.z = .3 - k * .1; b.castShadow = true; c.add(b); }
  const padeiro = makeChar({ outfit: 'avental', hair: 'old', glasses: false }); padeiro.place(8.2, 1.8, .14); c.add(padeiro.root); padeiro.tint('#FFF6EA');
  const chef = cut(canvasTex(256, 256, (x) => { x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(70, 110, 56, 0, 7); x.arc(128, 80, 66, 0, 7); x.arc(186, 110, 56, 0, 7); x.fill(); x.fillRect(64, 120, 128, 110); x.fillStyle = '#E4E0D6'; x.fillRect(64, 200, 128, 10); }), .62, .62, { shadow: true }); chef.position.set(0, .62, .01); padeiro.head.add(chef);
  const hero = makeChar({ outfit: 'hero', glow: .14 }); c.add(hero.root); hero.tint('#FFF4E6');
  s.update = (t, u) => { const w = smooth(0, 2.4, u); hero.place(lerp(5.4, 6.6, w), lerp(4.4, 1.4, w), .14); if (u < 2.4) hero.walk(u, .9); else hero.pose({ armL: [8, 6], armR: [24, -60], head: 4 }); hero.face(s.camera); hero.eye(u < 2.8 ? 'happy' : 'look');
    padeiro.face(s.camera); const hand = smooth(1.2, 1.5, u); padeiro.pose({ armL: [8, 6], armR: [lerp(8, 60, hand), lerp(6, -100, hand)], head: -3 }); padeiro.eye(u < 2.8 ? 'open' : 'smug');
    const e = smooth(0, 3.65, u); aim(s.camera, [lerp(3.7, 4.0, e), lerp(1.45, 1.35, e), lerp(10.0, 9.0, e)], [7.4, 1.4, 1.4], -.01);
    return { focus: lerp(8.6, 8.0, e), range: 2.8, blur: 13, bloom: .22, bloomT: 1, vig: .38, exposure: 1.02 }; };
  return s; }
