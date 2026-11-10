import * as THREE from 'three';
import { makeShot, aim, keys, smooth, lerp, clamp, rng } from './motor/core.js';
import { makeChar, canvasTex } from './motor/char.js';
import { box, std, cut, glowSprite, dissolve, building, street, lamp, tree, car, skyline, sky, softBlob } from './motor/kit.js';
import { crowd, uT, brickTex } from './motor/kit2.js';
import { woodFloor, tileFloor, wallMat, contaTex, latas, beam, naMao } from './comum.js';

const shoeTex = (col = '#3A2A20') => canvasTex(256, 160, (x) => { x.fillStyle = col; x.beginPath(); x.moveTo(20, 120); x.lineTo(20, 40); x.quadraticCurveTo(30, 20, 80, 30); x.lineTo(120, 70); x.quadraticCurveTo(220, 70, 238, 110); x.lineTo(238, 128); x.lineTo(20, 128); x.fill(); x.fillStyle = '#EDE6D8'; x.fillRect(16, 126, 226, 18); x.strokeStyle = '#E9C99A'; x.lineWidth = 4; for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(70 + i * 12, 46 + i * 7); x.lineTo(96 + i * 12, 40 + i * 7); x.stroke(); } });

/** 5. Balcão da padaria: sapato por seis pães — 20.95 a 27.4 */
export function shotBalcao(t0, t1) { const s = makeShot(t0, t1, '#3A2418', 38), c = s.scene; c.fog = new THREE.FogExp2('#5A3A28', .03);
  c.add(woodFloor(12, 12, '#7A5232'));
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat('#B5552E', '#A84C28', '#C8693E', 5, 2)); wall.position.set(0, 2.5, -2.6); wall.receiveShadow = true; c.add(wall);
  // prateleiras de pão na parede
  const R = rng(5); for (let lv = 0; lv < 3; lv++) { c.add(box(4.6, .06, .45, '#6E4A32', -.2, 1.3 + lv * .55, -2.35)); for (let k = 0; k < 14; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(.13, 14, 10), std(['#C8813E', '#D6974A', '#B06A2E'][Math.floor(R() * 3)])); b.scale.set(1.2, .7, .9); b.position.set(-2.3 + k * .31, 1.42 + lv * .55, -2.3); b.castShadow = true; c.add(b); } }
  const plaq = canvasTex(512, 160, (x) => { x.fillStyle = '#2A1A10'; x.fillRect(0, 0, 512, 160); x.fillStyle = '#FFE7B8'; x.font = "700 92px Caveat"; x.textAlign = 'center'; x.fillText('Pão quentinho', 256, 104); }); const pq = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .5), new THREE.MeshStandardMaterial({ map: plaq, emissiveMap: plaq, emissive: new THREE.Color(.3, .25, .2) })); pq.position.set(-.2, 3.25, -2.55); c.add(pq);
  // balcão com vitrine
  c.add(box(3.4, 1.0, .8, '#E9DCC4', 0, .5, -.7)); c.add(box(3.5, .06, .9, '#6E4A32', 0, 1.03, -.7)); const glass = new THREE.Mesh(new THREE.BoxGeometry(3.3, .5, .7), new THREE.MeshStandardMaterial({ color: '#CFE8F0', transparent: true, opacity: .25, roughness: .1 })); glass.position.set(0, .7, -.5); c.add(glass);
  for (let k = 0; k < 8; k++) { const b = new THREE.Mesh(new THREE.CapsuleGeometry(.06, .2, 6, 10), std('#D8A050')); b.rotation.z = 1.57; b.position.set(-1.3 + k * .36, .58, -.5); c.add(b); }
  const caixa = box(.5, .3, .4, '#3F5688', 1.2, 1.2, -.8); c.add(caixa);
  // seis pães no balcão
  const paes = []; for (let k = 0; k < 6; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(.1, 14, 10), std('#C8813E')); b.scale.set(1.3, .8, 1); b.position.set(-.45 + (k % 3) * .22, 1.12, -.55 + Math.floor(k / 3) * .2); b.castShadow = true; c.add(b); paes.push(b); }
  // pilha de sapatos que outros já tentaram trocar
  const shoes = []; const cols = ['#3A2A20', '#8A2F2F', '#2F4F7A', '#D9D2C2', '#2E2E36', '#B5803E']; for (let k = 0; k < 22; k++) { const m = cut(shoeTex(cols[k % 6]), .34, .21, { shadow: true }); m.position.set(1.15 + (R() - .5) * .8, .12 + Math.floor(k / 6) * .13 + R() * .05, .05 + (R() - .5) * .4); m.rotation.set(0, (R() - .5) * 1.2, (R() - .5) * .6); c.add(m); shoes.push(m); }
  const plq2 = canvasTex(400, 200, (x) => { x.fillStyle = '#F6F1E4'; x.fillRect(0, 0, 400, 200); x.fillStyle = '#C9472F'; x.font = "700 80px Caveat"; x.textAlign = 'center'; x.fillText('Chega de', 200, 86); x.fillText('sapato!', 200, 170); }); const p2 = new THREE.Mesh(new THREE.PlaneGeometry(.6, .3), new THREE.MeshStandardMaterial({ map: plq2 })); p2.position.set(1.15, 1.0, .25); c.add(p2); c.add(box(.03, .9, .03, '#6E4A32', 1.15, .5, .24));
  // luzes
  c.add(new THREE.HemisphereLight('#FFE2BE', '#4a2a1a', .8)); const key = new THREE.SpotLight('#FFD39A', 40, 14, .7, .4, 1.2); key.position.set(-2, 4.5, 2.5); key.target.position.set(0, 1, -1); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); c.add(key, key.target);
  for (const x of [-1.4, 0, 1.4]) { const b = new THREE.Mesh(new THREE.SphereGeometry(.12, 16, 12), new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#FFC67A', emissiveIntensity: 3 })); b.position.set(x, 3.6, -.4); c.add(b); c.add(box(.01, 1.2, .01, '#222', x, 4.3, -.4, false)); const g = glowSprite('#FFC67A', 1.2, .5); g.position.set(x, 3.6, -.3); c.add(g); }
  beam(c, -.8, 2.4, -.4, 1.0, 4.4, -.5, .1);
  const padeiro = makeChar({ outfit: 'avental', hair: 'old' }); padeiro.place(.35, -1.35); c.add(padeiro.root); padeiro.tint('#FFE9D2');
  const chef = cut(canvasTex(256, 256, (x) => { x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(70, 110, 56, 0, 7); x.arc(128, 80, 66, 0, 7); x.arc(186, 110, 56, 0, 7); x.fill(); x.fillRect(64, 120, 128, 110); }), .62, .62, { shadow: true }); chef.position.set(0, .62, .01); padeiro.head.add(chef);
  const hero = makeChar({ outfit: 'hero', glow: .14 }); hero.place(-.6, .55); c.add(hero.root); hero.tint('#FFEEDC');
  const shoe = cut(shoeTex('#2E2E36'), .34, .21, { shadow: true }); naMao(hero, 'R', shoe, -170, .06);
  // vaso desfocado na frente
  const vs = new THREE.Mesh(new THREE.CylinderGeometry(.18, .14, .34, 18), std('#36AEA2')); vs.position.set(-1.25, 1.2, 2.1); c.add(vs); for (let i = 0; i < 5; i++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.09, 10, 8), std(['#F2C94C', '#D94F58', '#F6F1E4'][i % 3], { emissive: '#331a00' })); f.position.set(-1.25 + Math.sin(i * 1.3) * .14, 1.55 + (i % 2) * .12, 2.1 + Math.cos(i * 1.3) * .1); c.add(f); }
  s.update = (t, u) => {
    const off = smooth(1.0, 1.4, u); const aR = [lerp(8, 70, off), lerp(6, -40, off)]; hero.pose({ armL: [8, 6], armR: aR, head: off * -4, lean: off * -3 }); shoe.rotation.z = -(aR[0] + aR[1]) * Math.PI / 180; hero.face(s.camera);
    hero.eye(u < 3.4 ? 'happy' : u < 4.2 ? 'look' : 'sad');
    padeiro.face(s.camera); const no = u > 4.05 && u < 5.6 ? Math.sin((u - 4.05) * 14) * 9 : 0; const pt = smooth(5.4, 5.7, u); padeiro.pose({ head: no, armL: [lerp(8, 70, pt), lerp(6, 40, pt)], armR: [8, 6] }); padeiro.eye(u < 3.2 ? 'open' : u < 5.4 ? 'flat' : 'lookl');
    paes.forEach((b, k) => { b.visible = u < 3.3 + k * .08 || u > 3.3; b.scale.setScalar(u > 3.3 && u < 3.55 ? 1.12 : 1).multiply(new THREE.Vector3(1.3, .8, 1)); });
    const e = smooth(0, 6.45, u), pan = smooth(5.3, 6.4, u); aim(s.camera, [lerp(-.1, .1, e) + pan * .3, lerp(1.5, 1.45, e), lerp(5.6, 4.9, e)], [lerp(-.05, .1, e) + pan * .5, 1.15, -1.0], .01);
    return { focus: lerp(5.0, 4.4, e), range: 2.2, blur: 15, bloom: .3, bloomT: .95, vig: .5, exposure: 1 }; };
  return s; }

function caminhao(c, x, z, rot, col = '#E9E6DE', logo = 'ENTREGAS') { const g = new THREE.Group(); const tex = canvasTex(512, 200, (k) => { k.fillStyle = col; k.fillRect(0, 0, 512, 200); k.fillStyle = '#C9472F'; k.fillRect(0, 150, 512, 22); k.fillStyle = '#2E3648'; k.font = "900 70px Fraunces"; k.textAlign = 'center'; k.fillText(logo, 256, 110); }); const cargo = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.4, 5.2), [new THREE.MeshStandardMaterial({ map: tex }), new THREE.MeshStandardMaterial({ map: tex }), std(col), std(col), std('#D6D2C6'), std('#D6D2C6')]); cargo.position.set(0, 1.9, -.6); cargo.castShadow = cargo.receiveShadow = true; g.add(cargo);
  g.add(box(2.2, 1.7, 1.6, '#C9472F', 0, 1.45, 2.8)); g.add(box(2.0, .7, .05, '#9FC6D8', 0, 1.85, 3.61)); g.add(box(2.3, .4, 6.8, '#2a2a30', 0, .55, .2)); for (const [a, b] of [[-1.05, 2.6], [1.05, 2.6], [-1.05, -1.4], [1.05, -1.4], [-1.05, -2.4], [1.05, -2.4]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .3, 18), std('#18181e')); w.rotation.z = 1.57; w.position.set(a, .42, b); w.castShadow = true; g.add(w); }
  for (const sx of [-.8, .8]) { const h = new THREE.Mesh(new THREE.CircleGeometry(.12, 16), new THREE.MeshBasicMaterial({ color: '#FFF4D0' })); h.position.set(sx, 1.0, 3.61); g.add(h); }
  g.position.set(x, 0, z); g.rotation.y = rot; c.add(g); return g; }

/** 6. Pátio dos caminhões ao entardecer: ninguém trabalha — 27.4 a 34.5 */
export function shotCaminhoes(t0, t1) { const s = makeShot(t0, t1, '#E8966A', 40), c = s.scene; c.fog = new THREE.FogExp2('#F1A97C', .016);
  sky(c, -170, 460, 340, [[0, '#4A4A8A'], [.45, '#B7709A'], [.75, '#F09A72'], [1, '#FBD08E']]); skyline(c, -150, 400, 120, ['#8A5F7A', '#7A5272', '#6B4868'], false, 9);
  const asph = canvasTex(512, 512, (x) => { x.fillStyle = '#5B5660'; x.fillRect(0, 0, 512, 512); const R = rng(3); for (let i = 0; i < 3000; i++) { x.fillStyle = `rgba(${R() < .5 ? '255,255,255' : '0,0,0'},${R() * .08})`; x.fillRect(R() * 512, R() * 512, 2, 2); } x.fillStyle = '#E9D27A'; for (let i = 0; i < 4; i++) x.fillRect(i * 128 + 60, 0, 8, 512); }); asph.wrapS = asph.wrapT = THREE.RepeatWrapping; asph.repeat.set(4, 4); const gr = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ map: asph, roughness: .9 })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; gr.position.z = -10; c.add(gr);
  // galpão ao fundo
  c.add(box(40, 7, 6, '#B9A28A', 0, 3.5, -24)); for (let i = 0; i < 8; i++) { c.add(box(3, 4, .2, '#7A6A5A', -14 + i * 4, 2, -20.9)); } const sg = canvasTex(1024, 160, (x) => { x.fillStyle = '#2E3648'; x.fillRect(0, 0, 1024, 160); x.fillStyle = '#F2C94C'; x.font = "900 100px Fraunces"; x.textAlign = 'center'; x.fillText('CENTRAL DE CARGAS', 512, 118); }); const sgm = new THREE.Mesh(new THREE.PlaneGeometry(14, 2.2), new THREE.MeshStandardMaterial({ map: sg, emissiveMap: sg, emissive: new THREE.Color(.4, .4, .4) })); sgm.position.set(0, 6.0, -20.8); c.add(sgm);
  const cols = ['#E9E6DE', '#DCE6EE', '#F2E6C8', '#E9E6DE', '#E6D8E6', '#E9E6DE']; for (let i = 0; i < 6; i++) caminhao(c, -9 + i * 3.6, -12, 0, cols[i], ['ENTREGAS', 'FRUTAS', 'LEITE', 'PÃO', 'CARNES', 'BEBIDAS'][i]);
  const tr = caminhao(c, 4.5, -4.5, -.5, '#E9E6DE', 'MERCADO');
  // relógio de ponto
  const rel = canvasTex(256, 256, (x) => { x.fillStyle = '#F6F1E4'; x.beginPath(); x.arc(128, 128, 120, 0, 7); x.fill(); x.strokeStyle = '#2E3648'; x.lineWidth = 10; x.stroke(); x.lineCap = 'round'; x.beginPath(); x.moveTo(128, 128); x.lineTo(128, 50); x.moveTo(128, 128); x.lineTo(180, 128); x.stroke(); }); const rm = new THREE.Mesh(new THREE.CircleGeometry(.8, 32), new THREE.MeshStandardMaterial({ map: rel })); rm.position.set(-6, 5.2, -20.8); c.add(rm);
  // cones e pallets
  for (let i = 0; i < 5; i++) { const cn = new THREE.Mesh(new THREE.ConeGeometry(.18, .5, 14), std('#E8843E')); cn.position.set(-3 + i * 1.3, .25, -6); cn.castShadow = true; c.add(cn); }
  for (let i = 0; i < 3; i++) { c.add(box(1.2, .15, 1.0, '#B5803E', -4 + i * .2, .08 + i * .15, -3.5)); } c.add(box(1.0, .9, .9, '#C8A070', -4.0, .9, -3.5));
  // trabalhador com o envelope do salário (que some), motorista deitado na cabine
  const worker = makeChar({ outfit: 'laranja', hair: 'bob', hairc: '#2a1b18', lash: true }); worker.place(-1.1, 1.4); c.add(worker.root); worker.tint('#FFE6D0');
  const env = cut(contaTex('SALÁRIO', 'R$ 2.400', '#3F8A52'), .3, .4, { blend: true }); naMao(worker, 'R', env, -175, .06);
  const envP = dissolve(c, { pos: [-.85, 1.0, 1.6], spread: .2, rise: 1.6, t0: 2.0, dur: 1.2, n: 80, size: .035, seed: 9, color: '#FFF1C8' });
  const driver = makeChar({ outfit: 'azul', hair: 'afro', hairc: '#1a1210' }); driver.place(2.4, -.7, .0); c.add(driver.root); driver.tint('#FFE6D0');
  const cap = cut(canvasTex(256, 160, (x) => { x.fillStyle = '#C9472F'; x.beginPath(); x.ellipse(128, 100, 110, 60, 0, Math.PI, 0); x.fill(); x.fillRect(128, 92, 128, 18); }), .5, .32, {}); cap.position.set(0, .2, .02); driver.head.add(cap);
  const gang = crowd(c, [[-7, -7, 0, .2], [-6.2, -7.4, 0, -.1], [6.5, -8, 0, .3], [7.3, -7.6, 0, -.2]], { tint: '#FFE0C8', jump: 0 });
  c.add(new THREE.HemisphereLight('#C9B8E6', '#7a4a3a', 1.0)); const sun = new THREE.DirectionalLight('#FFB070', 2.6); sun.position.set(14, 8, -26); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, far: 80 }); sun.shadow.bias = -.0005; c.add(sun);
  const sunG = glowSprite('#FFC88A', 30, .5); sunG.position.set(14, 6, -40); c.add(sunG);
  s.update = (t, u) => { uT.value = t; envP(u); const g = smooth(2.0, 2.6, u); env.material.opacity = 1 - g; env.visible = g < .99;
    worker.face(s.camera); const shr = smooth(3.0, 3.4, u); const aR = [lerp(30, 70, shr), lerp(-100, 50, shr)]; env.rotation.z = -(aR[0] + aR[1]) * Math.PI / 180; worker.pose({ armL: [lerp(8, 70, shr), lerp(6, 50, shr)], armR: aR, head: shr * 8 }); worker.eye(u < 2.0 ? 'happy' : u < 3.0 ? 'wide' : 'flat');
    // motorista recostado no para-choque, braços cruzados, dormindo
    driver.face(s.camera); driver.pose({ armL: [30, -130], armR: [30, -130], lean: -4, head: -8 }); driver.eye(u < 5.8 ? 'shut' : 'flat');
    const e = smooth(0, 7.1, u); aim(s.camera, [lerp(-1.6, .6, e), lerp(1.4, 1.6, e), lerp(4.8, 6.4, e)], [lerp(-1.0, 1.9, e), lerp(1.3, 1.2, e), lerp(1.2, -1.2, e)], -.012);
    return { focus: lerp(3.5, 7.4, e), range: lerp(1.6, 4, e), blur: 14, bloom: .3, bloomT: .9, vig: .42, exposure: 1.0 }; };
  return s; }

/** 7. Mercado esvaziando — 34.5 a 41.25 */
export function shotMercado(t0, t1) { const s = makeShot(t0, t1, '#ECECE4', 44), c = s.scene; c.fog = new THREE.FogExp2('#E6E2D6', .02);
  const R = rng(14); const colors = ['#C64236', '#EABA42', '#36AEA2', '#4A86C7', '#D2728A', '#E8843E', '#F4F0E4', '#3F8A52', '#7A3248'];
  const fl = tileFloor(9, 70, '#D6D3C9', '#C8C5BA', 2); fl.position.set(0, 0, -25); c.add(fl);
  c.add(box(9, .1, 70, '#EFEEE6', 0, 5.6, -25, false)); for (let i = 0; i < 12; i++) { const m = new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#FFF6DE', emissiveIntensity: 1.6 }); c.add(box(1, .06, 2.6, m, 0, 5.52, 4 - i * 5.6, false)); if (i < 5) { const pl = new THREE.PointLight('#FFF3D8', 8, 11, 1.5); pl.position.set(0, 5, 4 - i * 5.6); c.add(pl); } }
  const items = 1100, im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: .75 }), items); let n = 0; const dummy = new THREE.Object3D(), col = new THREE.Color(); const mats = [], gone = [];
  for (const side of [-1, 1]) { const X = side * 3.1; c.add(box(.7, 4.8, 70, '#8F96A3', X + side * .55, 2.4, -25)); for (let lv = 0; lv < 5; lv++) { const y = .42 + lv * .86; c.add(box(1.2, .05, 70, '#DDE0E4', X, y, -25)); c.add(box(.05, .1, 70, '#F7F7F2', X - side * .6, y + .03, -25)); }
    for (let k = 0; k < 14; k++) c.add(box(.06, 4.7, .06, '#A4A9B2', X - side * .58, 2.35, 8 - k * 5.4));
    for (let lv = 0; lv < 5; lv++) for (let z = 8; z > -60;) { const w = .3 + R() * .5, h = .34 + R() * .4; if (R() < .93 && n < items) { dummy.position.set(X + side * .05, .42 + lv * .86 + h / 2 + .03, z); dummy.scale.set(.85, h, w); dummy.updateMatrix(); im.setMatrixAt(n, dummy.matrix); mats.push(dummy.matrix.clone()); gone.push(.6 + R() * 5.2 * (lv === 1 || lv === 2 ? .7 : 1)); im.setColorAt(n, col.set(colors[Math.floor(R() * colors.length)])); n++; } z -= w + .03; } }
  im.count = n; im.castShadow = true; im.receiveShadow = true; c.add(im); const zero = new THREE.Matrix4().makeScale(0, 0, 0);
  const signs = [['FRUTAS', 2.6, '#3F8A52'], ['LEITE', -6, '#3A5F8F'], ['PÃO', -15, '#8A6C2A']]; signs.forEach(([w, z, b]) => { const t = canvasTex(640, 200, (x) => { x.fillStyle = b; x.fillRect(0, 0, 640, 200); x.strokeStyle = '#FFF4DC'; x.lineWidth = 8; x.strokeRect(12, 12, 616, 176); x.fillStyle = '#FFF4DC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 118px Fraunces'; x.fillText(w, 320, 106); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(2.6, .82), new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: new THREE.Color(.28, .28, .28) })); m.position.set(0, 3.95, z); c.add(m); for (const sx of [-1, 1]) c.add(box(.02, 1.3, .02, '#777', sx * 1.1, 4.95, z, false)); });
  // placa "DIA" pendurada que muda
  const dc = document.createElement('canvas'); dc.width = 512; dc.height = 180; const dx = dc.getContext('2d'); const dt = new THREE.CanvasTexture(dc); dt.colorSpace = THREE.SRGBColorSpace; let lastD = 0; const paintD = (d) => { if (d === lastD) return; lastD = d; dx.fillStyle = '#F2C94C'; dx.fillRect(0, 0, 512, 180); dx.strokeStyle = '#2A2A30'; dx.lineWidth = 8; dx.strokeRect(6, 6, 500, 168); dx.fillStyle = '#2A2A30'; dx.font = "700 100px 'IBM Plex Mono'"; dx.textAlign = 'center'; dx.fillText('DIA ' + d, 256, 125); dt.needsUpdate = true; }; paintD(1); const dm = new THREE.Mesh(new THREE.PlaneGeometry(1.5, .53), new THREE.MeshBasicMaterial({ map: dt })); dm.position.set(0, 3.15, 1.2); c.add(dm); for (const sx of [-1, 1]) c.add(box(.02, 2.4, .02, '#777', sx * .6, 4.4, 1.2, false));
  const hero = makeChar({ outfit: 'hero', glow: .12 }); hero.place(.25, -.2); c.add(hero.root); hero.tint('#FFFFFF');
  const cart = new THREE.Group(); const wire = new THREE.MeshStandardMaterial({ color: '#EEF1F4', roughness: .35, metalness: .2 }); [[.84, .05, .06, 0, .78, .42], [.84, .05, .06, 0, .78, -.42], [.06, .05, .86, .42, .78, 0], [.06, .05, .86, -.42, .78, 0], [.84, .05, .06, 0, .36, .42], [.84, .05, .06, 0, .36, -.42], [.06, .05, .86, .42, .36, 0], [.06, .05, .86, -.42, .36, 0]].forEach(a => cart.add(box(a[0], a[1], a[2], wire, a[3], a[4], a[5]))); for (const [a, b] of [[-.42, -.42], [.42, -.42], [-.42, .42], [.42, .42]]) cart.add(box(.04, .7, .04, wire, a, .42, b)); cart.add(box(.9, .05, .05, '#2F7F73', 0, 1.0, -.52)); cart.scale.setScalar(.74); cart.position.set(.25, 0, -.95); c.add(cart);
  c.add(new THREE.HemisphereLight('#FFFFFF', '#B9B3A6', .85)); const key = new THREE.DirectionalLight('#FFF6E0', .7); key.position.set(1, 8, 6); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -6, right: 6, top: 10, bottom: -10, far: 30 }); key.shadow.radius = 5; c.add(key);
  s.update = (t, u) => { for (let i = 0; i < n; i++) im.setMatrixAt(i, u > gone[i] ? zero : mats[i]); im.instanceMatrix.needsUpdate = true; paintD(u < 2.2 ? 1 : u < 4.2 ? 2 : 3);
    hero.face(s.camera); hero.walk(u, .5, .7); hero.arms.L.u.rotation.z = -.22; hero.arms.R.u.rotation.z = .22; hero.arms.L.f.rotation.z = .5; hero.arms.R.f.rotation.z = -.5; const z = -1.0 + u * .3; hero.root.position.z = z; cart.position.z = z + .72; hero.eye(u < 2.5 ? 'look' : u < 4.5 ? 'down' : 'sad');
    const e = smooth(0, 6.75, u); aim(s.camera, [lerp(.2, .1, e), lerp(1.5, 1.4, e), lerp(6.2, 4.0, e)], [.05, lerp(1.9, 1.5, e), -8], -.01);
    return { focus: lerp(6.2, 3.6, e), range: 4.5, blur: 11, bloom: .24, bloomT: 1, vig: .4, exposure: 1 }; };
  return s; }

/** 8a. Prisão vista de fora, depois o pátio — 41.25 a 47.6 */
export function shotPrisao(t0, t1) { const s = makeShot(t0, t1, '#9CB4C8', 40), c = s.scene; c.fog = new THREE.FogExp2('#C9D2D8', .012);
  sky(c, -170, 460, 340, [[0, '#5E7FA8'], [.6, '#A9BED0'], [1, '#E6E0D0']]);
  const conc = canvasTex(512, 512, (x) => { x.fillStyle = '#9A9890'; x.fillRect(0, 0, 512, 512); const R = rng(2); for (let i = 0; i < 2500; i++) { x.fillStyle = `rgba(${R() < .5 ? '255,255,255' : '0,0,0'},${R() * .07})`; x.fillRect(R() * 512, R() * 512, 3, 3); } x.fillStyle = '#86847C'; for (let i = 0; i < 8; i++) x.fillRect(0, i * 64, 512, 3); }); conc.wrapS = conc.wrapT = THREE.RepeatWrapping; conc.repeat.set(8, 1);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ map: (() => { const t = canvasTex(256, 256, (x) => { x.fillStyle = '#B7A88E'; x.fillRect(0, 0, 256, 256); const R = rng(6); for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(80,60,40,${R() * .15})`; x.fillRect(R() * 256, R() * 256, 3, 3); } x.strokeStyle = '#F4F0E6'; x.lineWidth = 4; x.strokeRect(40, 40, 176, 176); }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(12, 12); return t; })(), roughness: 1 })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; c.add(gr);
  // muro com arame, torres e prédio
  const wallM = new THREE.MeshStandardMaterial({ map: conc, roughness: .95 }); const w1 = new THREE.Mesh(new THREE.BoxGeometry(40, 5, .6), wallM); w1.position.set(0, 2.5, -9); w1.castShadow = w1.receiveShadow = true; c.add(w1);
  for (let i = -20; i < 20; i += .5) { const r = new THREE.Mesh(new THREE.TorusGeometry(.25, .02, 6, 16), std('#C8CCD2', { metalness: .7, roughness: .3 })); r.position.set(i, 5.25, -9); c.add(r); }
  for (const x of [-12, 12]) { c.add(box(1.0, 9, 1.0, '#8A877E', x, 4.5, -9.4)); c.add(box(2.6, 1.6, 2.6, '#6E6B62', x, 9.8, -9.4)); c.add(box(2.9, .2, 2.9, '#4A4842', x, 10.7, -9.4)); const sl = glowSprite('#FFF4D0', 2.4, .6); sl.position.set(x, 9.6, -8); c.add(sl); }
  const blds = new THREE.Mesh(new THREE.BoxGeometry(26, 9, 8), new THREE.MeshStandardMaterial({ map: conc, color: '#C8C4B8' })); blds.position.set(0, 4.5, -20); c.add(blds); for (let r = 0; r < 3; r++) for (let k = 0; k < 14; k++) c.add(box(.5, .9, .1, '#2A2A30', -11 + k * 1.7, 2.4 + r * 2.4, -15.95));
  const sg = canvasTex(1024, 180, (x) => { x.fillStyle = '#2E3648'; x.fillRect(0, 0, 1024, 180); x.fillStyle = '#F4F0E6'; x.font = "900 96px Fraunces"; x.textAlign = 'center'; x.fillText('PENITENCIÁRIA', 512, 125); }); const sgm = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.4), new THREE.MeshStandardMaterial({ map: sg })); sgm.position.set(0, 7.8, -15.9); c.add(sgm);
  // bandeira dos EUA no mastro
  const fl = canvasTex(380, 200, (x) => { for (let i = 0; i < 13; i++) { x.fillStyle = i % 2 ? '#F4F0E6' : '#B8333A'; x.fillRect(0, i * 200 / 13, 380, 200 / 13 + 1); } x.fillStyle = '#2E3A6E'; x.fillRect(0, 0, 160, 108); x.fillStyle = '#fff'; for (let a = 0; a < 5; a++) for (let b = 0; b < 6; b++) { x.beginPath(); x.arc(14 + b * 26, 12 + a * 21, 3.5, 0, 7); x.fill(); } }); const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.0, 12, 1), new THREE.MeshStandardMaterial({ map: fl, side: THREE.DoubleSide })); flag.position.set(6.95, 10.2, -16); c.add(flag); c.add(box(.08, 11, .08, '#D6D6D6', 6, 5.5, -16));
  // pátio: presos de laranja (cerca na frente da câmera)
  const presos = []; const spots = [[-3, -4], [-1.6, -5.6], [2.6, -4.6], [4, -6], [.6, -3.2], [-4.6, -6.4]]; spots.forEach(([x, z], k) => { const p = makeChar({ outfit: 'laranja', hair: ['bob', 'afro', 'old', undefined, 'long', 'afro'][k], hairc: '#2a1b18' }); p.place(x, z); c.add(p.root); p.tint('#FFF0E2'); presos.push(p); });
  c.add(box(1.4, .8, .6, '#6E6B62', 2.4, .4, -3.6));
  // cerca de arame perto da câmera
  const mesh = canvasTex(256, 256, (x) => { x.clearRect(0, 0, 256, 256); x.strokeStyle = '#B8BCC2'; x.lineWidth = 4; for (let i = -256; i < 512; i += 32) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 256, 256); x.stroke(); x.beginPath(); x.moveTo(i + 256, 0); x.lineTo(i, 256); x.stroke(); } }); mesh.wrapS = mesh.wrapT = THREE.RepeatWrapping; mesh.repeat.set(3, 2); const fence = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), new THREE.MeshStandardMaterial({ map: mesh, transparent: true, alphaTest: .3, side: THREE.DoubleSide, metalness: .5, roughness: .4 })); fence.position.set(4.2, 2, 2.4); c.add(fence); for (let i = 1.2; i <= 7.2; i += 3) c.add(box(.08, 4, .08, '#8A8E94', i, 2, 2.4));
  c.add(new THREE.HemisphereLight('#DCE6F2', '#8a7a62', 1.1)); const sun = new THREE.DirectionalLight('#FFE6C2', 2.4); sun.position.set(-12, 16, 10); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, far: 80 }); sun.shadow.bias = -.0005; c.add(sun);
  s.update = (t, u) => { const fpos = flag.geometry.attributes.position; for (let i = 0; i < fpos.count; i++) { const x = fpos.getX(i); fpos.setZ(i, Math.sin(x * 3 + t * 5) * .08 * (x + .95)); } fpos.needsUpdate = true;
    presos.forEach((p, k) => { p.face(s.camera); if (k === 2) p.pose({ armL: [8, 6], armR: [40, -110], head: 4 }); else if (k === 4) p.pose({ armL: [40, -110], armR: [8, 6], head: -4 }); else p.pose({ armL: [30, -130], armR: [30, -130], head: Math.sin(t + k) * 3 }); p.eye(k === 2 || k === 4 ? 'smug' : 'look'); });
    const e = smooth(0, 6.35, u); aim(s.camera, [lerp(.4, .8, e), lerp(7.5, 1.5, e), lerp(9, 4.6, e)], [lerp(0, 1.2, e), lerp(6.5, 1.2, e), lerp(-15, -4, e)], -.01);
    return { focus: lerp(24, 8.4, e), range: lerp(14, 4, e), blur: 13, bloom: .2, bloomT: 1, vig: .4, exposure: 1, sat: .9, tint: '#FFF4E4' }; };
  return s; }

/** 8b. A troca: latas de peixe na mesa — 47.6 a 51.0 */
export function shotLatas(t0, t1) { const s = makeShot(t0, t1, '#4A4E58', 36), c = s.scene; c.fog = new THREE.FogExp2('#4A4E58', .03);
  const fl = tileFloor(12, 12, '#7A7E86', '#6E727A', 2); c.add(fl);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat('#8FA0A8', '#8597A0', '#9AAAB2', 5, 2)); wall.position.set(0, 2.5, -2.6); wall.receiveShadow = true; c.add(wall);
  for (let i = 0; i < 9; i++) c.add(box(.06, 3.4, .06, '#3A3E46', -2.4 + i * .6, 1.7, -2.0));
  c.add(box(5, .08, .08, '#3A3E46', 0, 3.4, -2.0)); c.add(box(2, .2, .8, '#6E727A', -1.5, .55, -2.3)); c.add(box(2, .1, .7, '#E9E2D2', -1.5, .7, -2.3));
  // mesa
  c.add(box(1.6, .06, .9, '#B9B4A8', 0, .86, 0)); c.add(box(.08, .84, .08, '#55595F', -.7, .42, .38)); c.add(box(.08, .84, .08, '#55595F', .7, .42, .38)); c.add(box(.08, .84, .08, '#55595F', -.7, .42, -.38)); c.add(box(.08, .84, .08, '#55595F', .7, .42, -.38));
  const pilha = latas(9); pilha.children.forEach((m, k) => { const lv = k < 4 ? 0 : k < 7 ? 1 : k < 9 ? 2 : 3; const i = k < 4 ? k : k < 7 ? k - 4 : k - 7; m.position.set(-.38 + i * .13 + lv * .065, .94 + lv * .092, .05); }); c.add(pilha);
  const mov = latas(3, 7); mov.children.forEach((m, k) => m.position.set(.2 + k * .13, .935, .1)); c.add(mov);
  const choc = box(.24, .03, .14, '#7A3A2A', .45, .905, -.15); c.add(choc); const sop = box(.2, .07, .14, '#E9C94A', .2, .93, -.2); c.add(sop);
  const a = makeChar({ outfit: 'laranja', hair: 'afro', hairc: '#1a1210' }); a.place(-.62, -.1); c.add(a.root); a.tint('#FFEEDC');
  const b = makeChar({ outfit: 'laranja', hair: 'bob', hairc: '#6B3A22' }); b.place(.62, -.1); c.add(b.root); b.tint('#FFEEDC');
  c.add(new THREE.HemisphereLight('#C8D6E6', '#3a3a40', .7)); const lamp1 = new THREE.SpotLight('#FFE6B8', 30, 8, .7, .5, 1.3); lamp1.position.set(0, 3.2, .4); lamp1.target.position.set(0, .9, 0); lamp1.castShadow = true; lamp1.shadow.mapSize.set(2048, 2048); c.add(lamp1, lamp1.target); const bulb = new THREE.Mesh(new THREE.ConeGeometry(.3, .25, 20, 1, true), std('#2E3238', { side: THREE.DoubleSide })); bulb.position.set(0, 3.25, .4); c.add(bulb); const bg = glowSprite('#FFE6B8', 1.4, .6); bg.position.set(0, 3.1, .4); c.add(bg);
  beam(c, 0, 2.0, .3, 1.4, 2.6, 0, .1);
  s.update = (t, u) => { const k = smooth(.6, 1.6, u); mov.position.x = lerp(.0, -.55, k); const kk = smooth(1.2, 2.0, u); choc.position.x = lerp(-.6, .45, kk) * -1 + .0; sop.position.x = lerp(-.65, .2, kk) * -1;
    a.face(s.camera); b.face(s.camera); b.pose({ armL: [lerp(40, 20, k), lerp(-90, -40, k)], armR: [8, 6], lean: -k * 3 }); a.pose({ armL: [8, 6], armR: [lerp(8, 50, kk), lerp(6, -80, kk)] }); a.eye(u < 1.6 ? 'look' : 'happy'); b.eye(u < 1.0 ? 'smug' : 'lookl');
    const e = smooth(0, 3.4, u); aim(s.camera, [lerp(.5, .25, e), lerp(1.7, 1.5, e), lerp(4.6, 3.9, e)], [0, lerp(1.05, 1.0, e), 0], .012);
    return { focus: lerp(4.6, 3.9, e), range: 1.4, blur: 16, bloom: .3, bloomT: .9, vig: .55, exposure: 1 }; };
  return s; }
