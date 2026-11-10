import * as THREE from 'three';
import { makeShot, aim, keys, smooth, rng, lerp, clamp, easeIn } from './motor/core.js';
import { makeChar, canvasTex } from './motor/char.js';
import { box, plane, std, dissolve, cut, softBlob, glowSprite, tree, sky, skyline, pointer, building, street, lamp, car } from './motor/kit.js';
import { beeTex, flowerTex, tombTex, hatTopTex, treeBlossomTex, blossomTex, brushTex, orchidTex, mosquitoTex } from './motor/art.js';

function grassGround(c, w, l, a = '#8FBF5C', b = '#5E9A48') { const t = canvasTex(1024, 1024, (x) => { x.fillStyle = a; x.fillRect(0, 0, 1024, 1024); const R = rng(4); for (let i = 0; i < 9000; i++) { x.strokeStyle = R() < .5 ? b : a; x.globalAlpha = .4; x.lineWidth = 1.6; const px = R() * 1024, py = R() * 1024; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (R() - .5) * 6, py - 8 - R() * 8); x.stroke(); } x.globalAlpha = 1; }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w / 7, l / 7); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l), new THREE.MeshStandardMaterial({ map: t, roughness: 1 })); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; c.add(m); return m; }
function hills(c, z, cols) { const t = canvasTex(1600, 500, (x) => { x.clearRect(0, 0, 1600, 500); cols.forEach((k, i) => { x.fillStyle = k; x.beginPath(); x.moveTo(0, 500); for (let a = 0; a <= 1600; a += 20) x.lineTo(a, 170 + i * 90 + Math.sin(a * .004 + i * 2) * 50 + Math.sin(a * .011 + i) * 18); x.lineTo(1600, 500); x.fill(); }); }); const m = cut(t, 260, 34, { blend: true, fog: false }); m.position.set(0, 13, z); c.add(m); }
const tr = (u) => u;

/** 5. Campo: 9 em 10 — 13.55 a 19.1 */
export function shotMeadow(t0, t1) { const s = makeShot(t0, t1, '#9CCBE4', 38), c = s.scene; c.fog = new THREE.FogExp2('#F6DFB4', .009);
  sky(c, -150, 400, 110, [[0, '#4F9FD2'], [.45, '#9CD0E6'], [.75, '#F4E4C4'], [1, '#FCD9A4']]); hills(c, -120, ['#A9C6B0', '#8FB88E', '#79A86C']); const G = grassGround(c, 120, 90); G.position.z = -25;
  const pal = ['#2F6F4F', '#3F8A5C', '#5FA86C', '#BFD07E']; [[-11, -19], [-18, -30], [18, -36], [13, -22]].forEach(([x, z], i) => tree(c, x, z, 2.1, pal, i));
  c.add(new THREE.HemisphereLight('#DFF0FF', '#6E8A4A', 1.25)); const sun = new THREE.DirectionalLight('#FFDFA8', 3.2); sun.position.set(-11, 7, -9); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -13, right: 13, top: 13, bottom: -13, far: 50 }); sun.shadow.radius = 5; sun.shadow.bias = -.0006; c.add(sun); const hemi = c.children[c.children.length - 2];
  const sunS = glowSprite('#FFF0C4', 26, .75); sunS.position.set(-34, 16, -80); sunS.material.fog = false; c.add(sunS);
  // flores: hastes e cabeças em instâncias
  const cols = ['#E8667F', '#F2A541', '#C25FC4', '#EF5E4A', '#F7D154', '#5FA9E8', '#F27FA8', '#FF8C42']; const groups = cols.map(k => flowerTex(k)); const R = rng(17); const fl = [];
  const stem = canvasTex(64, 256, (x) => { x.clearRect(0, 0, 64, 256); x.strokeStyle = '#3E8A52'; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(32, 256); x.quadraticCurveTo(24, 120, 32, 4); x.stroke(); x.fillStyle = '#4C9A5D'; x.beginPath(); x.ellipse(16, 150, 18, 7, -.6, 0, 7); x.fill(); x.beginPath(); x.ellipse(47, 96, 18, 7, .6, 0, 7); x.fill(); });
  const N = 470; for (let i = 0; i < N; i++) { const x = (R() - .5) * 24, z = 5 - R() * 30; if (Math.abs(x) < .95 && z > -1.2) continue; const h = .75 + R() * .75, gi = Math.floor(R() * cols.length); const g = new THREE.Group(); g.position.set(x, 0, z); const st = cut(stem, .24, h); st.position.y = h / 2; g.add(st); const hd = cut(groups[gi], .46 + R() * .22, .46 + R() * .22); hd.position.set(0, h, .01); g.add(hd); g.scale.setScalar(.92 + R() * .3); c.add(g); fl.push({ g, st, hd, x, z, h, dist: Math.hypot(x, z - .2), lucky: R() < .1, flip: R() < .5 ? -1 : 1, ph: R() * 6, base: new THREE.Color(1, 1, 1) }); }
  // abelhas fantasma
  const bt = beeTex(true), bees = []; const R2 = rng(23); fl.filter(f => !f.lucky && f.dist < 7).slice(0, 34).forEach((f, i) => { const b = cut(bt, .3, .24, { blend: true, add: true }); c.add(b); bees.push({ b, f, t: 1.05 + R2() * .9, ph: R2() * 6, r: .16 + R2() * .18 }); });
  const hero = makeChar({ outfit: 'hero', glow: .22 }); hero.place(0, .3); c.add(hero.root); hero.tint('#FFFFFF');
  s.update = (t, u) => { const cam = s.camera; const wilt = (d) => smooth(0, .55, u - 4.7 - d * .07);
    for (const f of fl) { pointer(f.g, cam); const w = f.lucky ? 0 : wilt(f.dist); const sway = Math.sin(u * 1.4 + f.ph) * .025; f.g.rotation.z = sway + w * f.flip * .9; f.hd.position.y = f.h - w * .05; f.hd.rotation.z = w * f.flip * 1.2; f.hd.scale.setScalar(1 - w * .3); f.hd.material.color.setRGB(1 - w * .35, 1 - w * .45, 1 - w * .55); f.st.material.color.setRGB(1 - w * .1, 1 - w * .35, 1 - w * .55); }
    for (const b of bees) { const on = smooth(b.t, b.t + .15, u) * (1 - smooth(4.55, 4.85, u)); b.b.material.opacity = on * .95; const a = u * 2.4 + b.ph; b.b.position.set(b.f.x + Math.cos(a) * b.r, b.f.h * b.f.g.scale.y + .12 + Math.sin(a * 1.7) * .08, b.f.z + Math.sin(a) * b.r); pointer(b.b, cam); }
    hero.face(cam); const look = smooth(1, 1.3, u); hero.eye(u < .3 ? 'happy' : u < 1.05 ? 'open' : u < 2.6 ? (Math.sin(u * 1.2) > 0 ? 'look' : 'lookl') : u < 4.72 ? 'open' : 'small'); if ((u > 3.3 && u < 3.37)) hero.eye('flat'); const sag = smooth(4.7, 5.2, u); hero.pose({ armL: [8 + Math.sin(u * 1.3) * 1.2, 6], armR: [lerp(8, 36, look * (1 - sag)), lerp(6, 66, look * (1 - sag))], head: Math.sin(u * .9) * 2, bob: Math.sin(u * 2) * .005, squash: -sag * .03 });
    const d = smooth(4.7, 5.5, u); sun.intensity = lerp(3.2, 1, d); hemi.intensity = lerp(1.25, .62, d);
    const a = lerp(-.26, .16, smooth(0, 5.55, u)), R3 = lerp(7.6, 5.7, smooth(0, 5.55, u)), y = lerp(1.05, 1.35, smooth(0, 5.55, u)); aim(cam, [Math.sin(a) * R3, y, .3 + Math.cos(a) * R3], [0, lerp(1.32, 1.5, smooth(0, 5.55, u)), .3], .006);
    return { focus: R3, range: 4.5, blur: 13, bloom: .2, bloomT: 1, vig: .36, exposure: 1.02, sat: lerp(1.06, .72, d) }; };
  return s; }

/** 6. Cemitério na chuva — 19.1 a 22.06 */
export function shotGrave(t0, t1) { const s = makeShot(t0, t1, '#55627A', 36), c = s.scene; c.fog = new THREE.FogExp2('#7A8796', .058);
  sky(c, -100, 300, 200, [[0, '#3f4b63'], [.6, '#6d7a8c'], [1, '#98A3AD']]); const g = grassGround(c, 80, 60, '#55704F', '#3E5A3F'); g.position.z = -15; g.material.roughness = .62;
  c.add(new THREE.HemisphereLight('#B8C4D8', '#3d4a3d', .95)); const key = new THREE.DirectionalLight('#D8E2F0', 1.5); key.position.set(-5, 10, 7); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, far: 30 }); key.shadow.radius = 7; c.add(key);
  const stone = (x, z, title, kind, sc = 1) => { const G = new THREE.Group(); const T = title ? tombTex(title, kind) : null; const shape = new THREE.Shape(); shape.moveTo(-.55, 0); shape.lineTo(-.55, .95); shape.absarc(0, .95, .55, Math.PI, 0, true); shape.lineTo(.55, 0); shape.closePath(); const geo = new THREE.ExtrudeGeometry(shape, { depth: .2, bevelEnabled: true, bevelSize: .025, bevelThickness: .025, bevelSegments: 2, curveSegments: 22 }); const m = new THREE.Mesh(geo, std('#A3AAB2')); m.castShadow = m.receiveShadow = true; G.add(m); if (T) { const f = new THREE.Mesh(new THREE.PlaneGeometry(1.02, 1.28), new THREE.MeshStandardMaterial({ map: T, roughness: .85, transparent: true })); f.position.set(0, .72, .232); G.add(f); } const dirt = box(1.4, .08, 1.7, '#4a3a2c', 0, .04, .9); G.add(dirt); G.add(box(1.5, .14, .36, '#8E959C', 0, .07, .08)); G.position.set(x, 0, z); G.scale.setScalar(sc); c.add(G); return G; };
  stone(-1.65, 0, 'MAÇÃ', 'apple', 1.12); stone(1.75, 0, 'CHOCOLATE', 'choc', 1.12); const R = rng(9); for (let i = 0; i < 22; i++) { stone((R() - .5) * 26, -3 - R() * 16, null, null, .8 + R() * .3); }
  // cerca e árvores secas
  for (let i = -14; i < 15; i++) c.add(box(.05, 1.3, .05, '#20242c', i * .7, .65, -21)); c.add(box(20, .05, .05, '#20242c', 0, 1.2, -21));
  const dead = canvasTex(512, 640, (x) => { x.clearRect(0, 0, 512, 640); x.strokeStyle = '#2c333d'; x.lineCap = 'round'; const br = (a, b, an, l, w) => { if (w < 2) return; const e = a + Math.cos(an) * l, f = b + Math.sin(an) * l; x.lineWidth = w; x.beginPath(); x.moveTo(a, b); x.lineTo(e, f); x.stroke(); br(e, f, an - .5, l * .72, w * .66); br(e, f, an + .42, l * .72, w * .66); }; br(256, 640, -1.57, 170, 26); }); [[-7, -10], [6, -12], [-2.2, -17], [11, -15]].forEach(([x, z]) => { const m = cut(dead, 6, 7.5); m.position.set(x, 3.7, z); c.add(m); });
  const hero = makeChar({ outfit: 'terno', glow: .1, hat: hatTopTex }); hero.place(.05, 1.0); hero.root.scale.setScalar(.92); c.add(hero.root); hero.tint('#EEF1F6');
  const rose = new THREE.Group(); const rt = canvasTex(160, 320, (x) => { x.strokeStyle = '#4C9A5D'; x.lineWidth = 12; x.lineCap = 'round'; x.beginPath(); x.moveTo(80, 90); x.lineTo(80, 310); x.stroke(); x.fillStyle = '#4C9A5D'; x.beginPath(); x.ellipse(112, 190, 28, 12, -.5, 0, 7); x.fill(); x.fillStyle = '#C9301F'; x.beginPath(); x.arc(80, 60, 52, 0, 7); x.fill(); x.fillStyle = '#E5533B'; x.beginPath(); x.arc(70, 50, 28, 0, 7); x.fill(); x.fillStyle = '#F2806A'; x.beginPath(); x.arc(70, 46, 12, 0, 7); x.fill(); }); const rm = cut(rt, .2, .4); rose.add(rm); c.add(rose);
  // chuva
  const N = 900, geo = new THREE.BufferGeometry(), pos = new Float32Array(N * 6), R4 = rng(31), drops = []; for (let i = 0; i < N; i++) drops.push([(R4() - .5) * 16, R4() * 11, 4 - R4() * 14, 5 + R4() * 3]); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const rain = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: '#D8E8F4', transparent: true, opacity: .55, depthWrite: false })); rain.frustumCulled = false; c.add(rain);
  s.update = (t, u) => { for (let i = 0; i < N; i++) { const d = drops[i], y = ((d[1] - u * d[3] * 1.8) % 11 + 11) % 11; pos[i * 6] = d[0] + y * .05; pos[i * 6 + 1] = y; pos[i * 6 + 2] = d[2]; pos[i * 6 + 3] = d[0] + y * .05 - .012; pos[i * 6 + 4] = y - .24; pos[i * 6 + 5] = d[2]; } geo.attributes.position.needsUpdate = true;
    hero.face(s.camera); const lift = smooth(1.55, 1.95, u); hero.pose({ armR: [lerp(8, 62, lift), lerp(6, 8, lift)], armL: [6, 5], head: lerp(-4, 3, smooth(.75, 1.4, u)), bob: Math.sin(u * 3) * .003 }); hero.eye(u < .55 ? 'flat' : u < 1.35 ? 'down' : u < 2.2 ? 'look' : 'sad'); if (u > .5 && u < .57) hero.eye('flat');
    const drop = clamp((u - 2.0) / .5); rose.visible = u > 1.75; rose.position.set(.95, lerp(1.05, .2, drop * drop), 1.3); rm.rotation.z = drop * 1.5; pointer(rose, s.camera);
    const e = smooth(.3, 2.2, u); aim(s.camera, [lerp(-.95, .95, e), 1.25, 9.4 - u * .14], [lerp(-.9, .9, e), 1.45, .3], .006);
    return { focus: 8.8, range: 5, blur: 12, bloom: .16, bloomT: 1, vig: .52, exposure: .98, sat: .8 }; };
  return s; }

/** 7. Pomar: pincel, abelha x você, queda — 22.06 a 27.94 */
export function shotOrchard(t0, t1) { const s = makeShot(t0, t1, '#E5A06E', 38), c = s.scene; c.fog = new THREE.FogExp2('#F6C493', .018);
  sky(c, -150, 400, 110, [[0, '#C9648A'], [.45, '#EE9A78'], [.8, '#FBCE98'], [1, '#FFE8C2']]); hills(c, -120, ['#C99A7E', '#B58C70', '#99825E']); const G = grassGround(c, 120, 80, '#A0B860', '#6E9446'); G.position.z = -22;
  c.add(new THREE.HemisphereLight('#FFE6C8', '#6E7A40', 1.2)); const sun = new THREE.DirectionalLight('#FFC88E', 3.4); sun.position.set(-10, 6, -7); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, far: 50 }); sun.shadow.radius = 5; sun.shadow.bias = -.0005; c.add(sun); const sg = glowSprite('#FFE3AC', 30, .85); sg.position.set(-30, 14, -80); sg.material.fog = false; c.add(sg);
  const T = [treeBlossomTex(1), treeBlossomTex(2), treeBlossomTex(3)]; const R = rng(21); const trunkT = (x, z, h) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.07, .15, h, 10), std('#5a3a2a')); m.position.set(x, h / 2, z); m.castShadow = true; c.add(m); }; const flora = (x, z, sc) => { for (let k = 0; k < 3; k++) { const m = cut(T[(k + Math.abs(Math.floor(x * 3))) % 3], sc, sc, { shadow: true }); m.position.set(x, sc * .62 + 1, z); m.rotation.y = k * 1.05; c.add(m); } trunkT(x, z, 3.2); };
  flora(2.1, -2.4, 5.2); for (let i = 0; i < 16; i++) { const a = (i % 2 ? -1 : 1) * (3.5 + (i >> 1) * 1.9), z = -2 - (i % 4) * 4.6 - R() * 2; flora(a, z, 4.2 + R()); }
  // escada real
  const lad = new THREE.Group(); const lw = std('#D8A868'); for (const x of [-.32, .32]) lad.add(box(.07, 3.5, .07, lw, x, 1.75, 0)); for (let i = 0; i < 9; i++) lad.add(box(.64, .05, .06, std('#C08F52'), 0, .3 + i * .36, 0)); lad.rotation.x = -.18; lad.position.set(0, 0, .55); c.add(lad); c.add(softBlob(1.6, 1, .5)).children; 
  const hero = makeChar({ outfit: 'hero', glow: .24 }); c.add(hero.root); hero.tint('#FFFFFF'); const BH = 1.46; hero.place(.02, .28, BH);
  const brush = new THREE.Group(); const bt = cut(brushTex(), .14, .74); bt.position.y = -.37; brush.add(bt); hero.arms.R.hand.add(brush); brush.position.set(0, -.08, .03); brush.scale.set(1.25, 1.25, 1);
  // flor macro em galho, mais o galho
  const macro = cut(blossomTex(), .5, .5); macro.position.set(1.5, 3.35, 1.0); macro.rotation.y = -.14; c.add(macro); const macroBack = cut(T[0], 3.0, 3.0); macroBack.position.set(2.1, 3.9, .4); c.add(macroBack);
  const bigB = new THREE.Group(); const bb = cut(brushTex(), .09, .48); bb.position.y = -.24; bigB.add(bb); c.add(bigB);
  const pollen = dissolve(c, { pos: [1.5, 3.35, 1.05], spread: .1, rise: .3, t0: 1.6, dur: .7, n: 60, color: '#FFE27A', size: .009, seed: 6 }); const pollen2 = dissolve(c, { pos: [1.5, 3.35, 1.05], spread: .1, rise: .3, t0: 1.95, dur: .7, n: 60, color: '#FFE27A', size: .009, seed: 7 });
  // abelha no flashback, com trilha
  const beeOn = cut(beeTex(false), .07, .055); c.add(beeOn); const pts = [[1.38, 3.24], [1.62, 3.46], [1.4, 3.5], [1.63, 3.24], [1.45, 3.38], [1.6, 3.52]];
  const pet = canvasTex(32, 32, (x) => { x.fillStyle = '#FDE7EC'; x.beginPath(); x.ellipse(16, 16, 14, 8, .4, 0, 7); x.fill(); }); const ptl = []; for (let i = 0; i < 40; i++) { const m = cut(pet, .08, .08, { blend: true }); m.position.set((R() - .5) * 8, R() * 5, -1 + R() * 3.5); c.add(m); ptl.push({ m, x: m.position.x, y: m.position.y, r: R() }); }
  s.update = (t, u) => { const ab = t; for (const p of ptl) { p.m.position.y = ((p.y - u * .35 + 10) % 5); p.m.position.x = p.x + Math.sin(u + p.r * 6) * .25; p.m.rotation.z = u + p.r * 5; pointer(p.m, s.camera); }
    const cam = s.camera; hero.face(cam); hero.root.rotation.y = 0;
    // braço com pincel sobe em "pincel" (23.11 → u 1.05)
    const raise = smooth(.95, 1.25, u); const tired = smooth(4.7, 5.0, u), fall = clamp((u - 5.26) / .42);
    hero.pose({ armL: [lerp(20, 10, tired), 10], armR: [lerp(lerp(30, 148, raise), 30, tired), lerp(18, 26, raise)], head: tired * -4, bob: Math.sin(u * 2) * .004, lean: fall * fall * 92 , squash: -tired * .025 });
    hero.root.position.y = BH - fall * fall * 1.5; hero.root.position.x = .02 + fall * 1.15; hero.eye(u < .3 ? 'open' : u < 1.0 ? 'look' : u < 2.7 ? 'smug' : u < 4.68 ? 'smug' : u < 5.0 ? 'flat' : u < 5.26 ? 'small' : 'wide');
    // câmera: hero → macro → hero
    const inM = smooth(1.35, 2.0, u), outM = smooth(4.5, 4.98, u), mK = inM * (1 - outM);
    const heroP = [.45, 2.0, 8.2], heroQ = [.2, 2.7, 0], macP = [1.51, 3.35, 1.72], macQ = [1.5, 3.36, 1.0]; aim(cam, heroP.map((v, i) => lerp(v, macP[i], mK)), heroQ.map((v, i) => lerp(v, macQ[i], mK)), .006);
    // pincel grande toca as flores em "flor" (1.55) "por" (1.84) "flor" (2.06)
    bigB.visible = mK > .55; const tap = keys([[1.5, .36], [1.62, 0], [1.72, .1], [1.88, 0], [1.96, .12], [2.12, 0], [2.65, .45]], u); bigB.position.set(1.5 + tap * .2, 3.36 + tap * .28, 1.08); bigB.rotation.z = -2.56 + Math.PI * 0; bb.position.y = -.24;
    pollen(u); pollen2(u);
    const seP = smooth(2.71, 2.85, u) * (1 - smooth(4.66, 5.0, u));
    const bu = clamp((u - 2.72) / 1.92) * (pts.length - 1), bi = Math.floor(bu), bf = bu - bi, a = pts[bi], b = pts[Math.min(pts.length - 1, bi + 1)]; beeOn.visible = seP > .5; beeOn.position.set(lerp(a[0], b[0], bf), lerp(a[1], b[1], bf) + Math.sin(bf * Math.PI) * .05, 1.03); pointer(beeOn, cam); beeOn.scale.x = b[0] < a[0] ? -1 : 1;
    return { focus: lerp(7.9, .76, mK), range: lerp(5, .42, mK), blur: lerp(11, 20, mK), bloom: .24, bloomT: 1, vig: .36 + seP * .14, exposure: 1, sat: lerp(1.02, .1, seP), tint: seP > .01 ? `#${new THREE.Color(1, lerp(1, .84, seP), lerp(1, .62, seP)).getHexString()}` : '#ffffff' }; };
  return s; }
