# Revisão

Faça antes de renderizar e depois do render.

## Como olhar

- `node tools/folha.mjs <nome> 1,3,5,...`: pelo menos 2 instantes por plano. Abra a folha com Read.
- Depois do render: `node tools/folha.mjs <nome>` mostra 1 frame por segundo.
- Para ver um movimento: `ffmpeg -ss <s> -t 2 -i <video> -vf "fps=5,scale=160:-2,tile=10x1" folha.jpg`.

## O que procurar

| Problema | Correção |
| --- | --- |
| Personagem todo creme, sem rosto | A câmera estava atrás dele: chame `face(s.camera)` depois de `aim` (o motor já chama update duas vezes) |
| Personagem cortado na borda | Mova o personagem ou recue a câmera. A 5 m cabem 1,7 m de largura |
| Algo da piada fora do quadro | Traga para perto do herói |
| Cena estourada de luz | Baixe emissivas e a luz principal; `bloomT: 1` |
| Céu lavado | Neblina mais fraca; céu mais escuro no topo; nebulosa com opacidade baixa |
| Bloco preto | NaN num shader ou textura faltando |
| Cena vazia | Mais objetos, multidão, luzes pequenas, primeiro plano desfocado |
| Rosto atrás da legenda | Suba o rosto ou baixe a câmera |
| Texto da placa repete a legenda | Mostre o número ou o contexto, não a frase falada |

Só renderize quando a folha estiver no nível das imagens de `referencia/frames/`.
