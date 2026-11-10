# Motor 3D

O projeto tem `src/motor/` (não mexa) e `src/cenas.js` (você escreve). Unidades em metros. O personagem tem cerca de 1,75 m.

## Uma cena

```js
import * as THREE from 'three';
import { makeShot, aim, keys, smooth, lerp, clamp, rng } from './motor/core.js';
import { makeChar, canvasTex } from './motor/char.js';
import { box, std, cut, glowSprite, dissolve, building, street, lamp, tree, car, skyline, sky, pointer, softBlob } from './motor/kit.js';
import { crowd, dish, saucer, phone, notif, stars, nebula, smoke, earthTex, probe, brickTex, cobbleTex, flagTex, uT } from './motor/kit2.js';

export function minhaCena(t0, t1) {
  const s = makeShot(t0, t1, '#141228', 40);   // cor de fundo e FOV vertical
  const c = s.scene;
  // ... monte o mundo uma vez aqui ...
  s.update = (t, u) => {                       // t = tempo do filme, u = tempo dentro da cena
    uT.value = t;                              // se usar crowd()
    aim(s.camera, [x, y, z], [alvoX, alvoY, alvoZ], roll);
    return { focus: 6, range: 3, blur: 14, bloom: .3, bloomT: 1, vig: .45, exposure: 1, sat: 1, tint: '#ffffff' };
  };
  return s;
}
export const CENAS = [[minhaCena, 0, 5.4], [outraCena, 5.4, 9.0]];
```

`update` é chamado duas vezes por frame e precisa depender só de `t` e `u` (nada de estado acumulado).

## Retorno de update

| Chave | Efeito |
| --- | --- |
| `focus`, `range`, `blur` | Distância em foco, profundidade de campo e desfoque máximo em px |
| `bloom`, `bloomT`, `bloomR` | Força, limiar e raio do brilho |
| `vig`, `exposure`, `sat`, `tint`, `flash` | Vinheta, exposição, saturação, tom e clarão branco |

## Ajudantes de tempo (core.js)

`keys([[t, valor], ...], u)` interpola valores ou arrays com suavização. `smooth(a, b, x)` vai de 0 a 1 entre a e b. `lerp`, `clamp`, `rng(seed)` (aleatório com semente).

## Personagem (char.js)

```js
const p = makeChar({ outfit: 'hero', hair: 'long', hairc: '#6B3A22', hairhi: '#8B5230', lash: true, glow: .2, glasses: true, hat: hatTopTex });
p.place(x, z, y, escala); c.add(p.root); p.tint('#FFF2E2');   // tint = luz do ambiente
// em update:
p.face(s.camera);                       // sempre de frente para a câmera
p.eye('happy');                         // open look lookl down wide small happy shut flat smug sad angry heart
p.pose({ armL: [ombro, cotovelo], armR: [...], legL: [quadril, joelho], legR: [...], head, lean, bob, squash });
p.walk(t, velocidade, amplitude);       // caminhada de frente
p.cheer(t, fase);                       // braços para cima, pulando
```

- Outfits: `hero`, `terno`, `terno2`, `terno3`, `jaleco`, `avental`, `rosa`, `amarelo`, `verde`, `azul`, `laranja`, `roxo`.
- Cabelos: `long`, `bun`, `afro`, `bob`, `old` (cabelo branco dos lados).
- Ângulos em graus. Ombro positivo abre o braço para fora. Cotovelo negativo dobra para dentro (mão no peito, segurando algo).
- Os pés ficam em y = 0. Na calçada de `street()`, use y = .14.
- Para esconder as pernas de alguém sentado, ponha um móvel na frente.

## Mundo (kit.js e kit2.js)

| Função | O que faz |
| --- | --- |
| `street(cena, noite)` | Rua com asfalto, calçadas e meio-fio, ao longo de z negativo |
| `building(seed, { x, z, w, d, floors, side, night, lit, shop: { name, bg, fg, awning, font, size } })` | Prédio com fachada, janelas acesas, loja, letreiro e toldo |
| `lamp`, `tree`, `car` | Poste com luz, árvore, carro |
| `sky(cena, z, w, h, stops)`, `skyline(...)`, `stars`, `nebula` | Céu, cidade ao fundo, estrelas, nebulosa |
| `box`, `std`, `cut`, `glowSprite`, `softBlob` | Caixa, material, recorte pintado, brilho, sombra suave |
| `dissolve(cena, {...})` | Partículas teal subindo (algo sumindo). Chame o retorno com `u` |
| `crowd(cena, [[x, z, y, rotY], ...], { raised, jump, tint })` | Multidão instanciada |
| `dish`, `saucer`, `probe`, `phone(desenho)`, `notif`, `earthTex`, `smoke`, `brickTex`, `cobbleTex`, `flagTex` | Antena, disco voador, sonda, celular com tela, notificação, Terra, fumaça e texturas |

Textura pintada: `canvasTex(w, h, (ctx) => { ... })`. Use para letreiros, cartazes, telas, pisos, comida.

## Armadilhas

- **Transparência desfoca:** objetos com `blend: true` não escrevem profundidade e ficam desfocados. O que precisa ficar nítido usa `cut()` sem `blend`, escondendo com `visible` em vez de opacidade.
- **Espaço:** a câmera corta em 400 m. Para estrelas e planetas distantes, use `s.camera.far = 2400; s.camera.updateProjectionMatrix()`.
- **Brilho em excesso:** muitas emissivas fortes estouram a imagem. Janelas e letreiros entre .5 e 1; lâmpadas entre 2 e 6.
- **Shader com `pow()`:** proteja com `max(..., 0.)`; um NaN vira um bloco preto.
- **Quadro vertical estreito:** confira se o objeto da piada está dentro do quadro.
- **Multidão atrás da câmera:** pessoas entre a câmera e o assunto tampam tudo. Deixe esse espaço livre.

## Exemplos completos

`exemplos/vida-inteligente/shots_a.js` e `shots_b.js`: sala com celular, antenas, pânico com disco, praça com multidão, sala de controle, cúpula, churrasco, espaço e terraço.
`exemplos/animais/shots_*.js`: quarto com coleira, amanhecer com contador em LED, terraço, mercado, campo de flores, cemitério, pomar, plantações, fachada com janelas e terraço final.
