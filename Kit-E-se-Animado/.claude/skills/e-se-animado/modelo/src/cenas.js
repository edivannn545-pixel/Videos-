// As cenas do vídeo. Cada cena é uma função (t0, t1) que devolve um plano 3D.
// Esta cena de exemplo só existe para o projeto compilar; o Claude substitui pelas cenas do roteiro.
import * as THREE from 'three';
import { makeShot, aim, keys, smooth } from './motor/core.js';
import { makeChar } from './motor/char.js';
import { building, street, lamp, tree, car, skyline, sky } from './motor/kit.js';

function ruaNoite(t0, t1) {
  const s = makeShot(t0, t1, '#141228', 40), c = s.scene; c.fog = new THREE.FogExp2('#2A2240', .012);
  sky(c, -170, 460, 340, [[0, '#0E1030'], [.5, '#2A2252'], [.8, '#5B3460'], [1, '#8A4A6A']]); skyline(c, -150, 400, 170, ['#2F2748', '#3B2F54', '#4A3A5E'], true, 6); street(c, true);
  c.add(new THREE.HemisphereLight('#6E6AA8', '#2a1f28', .7)); const moon = new THREE.DirectionalLight('#A9A8E8', .9); moon.position.set(-14, 26, 10); moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, far: 70 }); c.add(moon);
  let z = 4, i = 0; while (z > -90) { const d = 7 + (i * 37 % 5); c.add(building(100 + i, { x: 13, z: z - d / 2, w: 8, d, floors: 4 + i % 3, side: -1, night: true, shop: { name: 'LUNA CAFÉ', bg: '#8F4A2F', fg: '#FFE3C8', awning: '#D94F58' } })); c.add(building(200 + i, { x: -13, z: z - d / 2, w: 8, d, floors: 5 + i % 3, side: 1, night: true })); z -= d; i++; }
  for (let k = 0; k < 6; k++) { lamp(c, 5, -2 - k * 13, -1, k < 4); tree(c, 5.2, -8 - k * 13, 1.05, undefined, k); }
  car(c, -3.1, -7, '#27425A', -1);
  const heroi = makeChar({ outfit: 'hero', glow: .14 }); heroi.place(6.1, -1.8, .14); heroi.tint('#D9D2E4'); c.add(heroi.root);
  s.update = (t, u) => { heroi.walk(t, .9); heroi.face(s.camera); heroi.eye('happy'); aim(s.camera, keys([[0, [4.4, 1.3, 7.2]], [6, [4.7, 1.26, 5.8]]], u), [6.2, 1.85, -4], -.012); return { focus: 6.5, range: 9, blur: 12, bloom: .32, bloomT: 1, vig: .5, exposure: .92 }; };
  return s;
}
export const CENAS = [[ruaNoite, 0, 999]];
