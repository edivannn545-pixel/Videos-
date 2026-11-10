---
name: e-se-animado
description: Cria vídeos verticais (Reels, Shorts, TikTok) de 45 a 60 segundos no estilo "E se...?" do vídeo de referência, com bonequinhos 2D de cabeça preta dentro de cenários 3D com luz de cinema, profundidade e sombras. São duas etapas separadas, uma por vez. Quando a pessoa manda um tema, entregue o roteiro e pare. Quando ela manda o arquivo de voz, crie o vídeo. Use também na primeira mensagem nesta pasta ("oi", "começar") e para ajustar um vídeo já feito.
---

# E se animado

São **duas etapas separadas**, e a pessoa faz uma coisa entre elas:

1. **A pessoa manda o tema → você entrega o roteiro e para.**
2. A pessoa grava a voz (ela mesma ou no ElevenLabs). **Isso é com ela.**
3. **A pessoa manda o arquivo de voz → você cria o vídeo.**

**Você nunca gera voz**: nada de sintetizador, `say`, TTS ou voz de IA. Nunca cria o vídeo sem o arquivo de voz da pessoa e nunca emenda o roteiro com o vídeo. Se ela mandar um áudio sem ter pedido roteiro, vá direto para a etapa do vídeo.

Fale em português simples. A pessoa provavelmente nunca programou.

## Primeira mensagem nesta pasta: preparar o computador

Faça na primeira mensagem, antes de qualquer outra coisa, e de novo sempre que uma ferramenta falhar por falta de programa. Diga à pessoa o que vai instalar e peça um "pode" antes de instalar.

1. **Node** (roda as ferramentas do kit). Rode `node -v`. Precisa ser 18 ou mais novo.
   - **Mac:** se `brew -v` funcionar, instale com `brew install node`. Se não tiver Homebrew, peça à pessoa para abrir o app **Terminal**, colar a linha abaixo e digitar a senha do Mac (não aparece nada enquanto digita). Ela avisa quando terminar e você continua com `brew install node`.
     ```
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```
     No fim, o instalador mostra duas ou três linhas começando com `echo` ou `eval`: peça para ela colar essas linhas também.
   - **Windows:** `winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements`. Depois a pessoa fecha e abre o app do Claude, para o Windows achar o Node.
   - **Outra opção, em qualquer sistema:** a pessoa baixa o instalador LTS em nodejs.org e clica em Avançar até o fim.
2. **Git** (só no Windows, se o app pedir): `winget install --id Git.Git -e`, ou o instalador em git-scm.com. Depois, fecha e abre o app.
3. **O resto:** rode `node tools/preparar.mjs --instalar`. Ele instala o ffmpeg (Homebrew ou winget), o three.js e o esbuild, e baixa o navegador de render do HyperFrames. A primeira vez leva alguns minutos.
4. Se aparecer `✗`, resolva o item como a mensagem diz e rode de novo, até sair "Tudo pronto." Não continue antes disso.
5. Explique em 3 linhas: "Me mande um tema. Eu te devolvo o roteiro. Você grava a voz e me manda o arquivo, e eu faço o vídeo."

Nunca peça a senha da pessoa no chat nem rode `sudo`: o que pede senha, ela digita no Terminal.

## Etapa 1: tema → roteiro

Leia `references/roteiro.md` e siga à risca.

- O vídeo final tem de 45 a 60 s. O roteiro tem de 115 a 155 palavras; mire em 130 (uns 50 s).
- A primeira frase já é a situação estranha acontecendo.
- Pesquise na internet todo dado real antes de usar.
- Entregue o texto num bloco de código, pronto para gravar, com a duração estimada e o que conferir nos dados. Salve em `meus-roteiros/<nome>.md`, com as fontes.
- **Termine assim:** "Grave a voz lendo esse texto, ou gere no ElevenLabs, e me mande o arquivo de áudio." E pare. Não crie projeto, cenas nem áudio.

## Etapa 2: voz → vídeo

Só comece com o arquivo de voz da pessoa em mãos.

1. **Estilo primeiro.** Leia `references/estilo.md` inteiro e abra com Read **pelo menos 12 imagens** de `referencia/frames/` e `referencia/mais-frames/`, mais 2 de `referencia/movimento/`. É esse visual que a pessoa quer, exatamente.
2. **Projeto:** `node tools/novo-video.mjs <nome> <caminho-do-audio>`. O comando converte, transcreve e mede a voz. O vídeo dura a voz mais 1,8 s. Se a voz tiver menos de 40 s ou mais de 62 s, avise a pessoa, mas siga.
3. **Plano de cenas:** leia `references/motor.md` e `PALAVRAS.txt`. Escreva para você mesmo uma lista de 9 a 13 planos longos (4 a 6 s cada), cada um começando numa palavra: tempo, lugar, ação, luz, câmera e qual frame da referência ele imita.
4. **Primeira cena:** escreva só o primeiro plano em `src/cenas.js`, rode `node tools/construir.mjs <nome>` e `node tools/folha.mjs <nome> 0.5,2,4`. Ponha a folha ao lado do frame da referência que ela imita e liste as diferenças de luz, profundidade, sombra, detalhe e personagem. Corrija até ficar no mesmo nível.
5. **Todas as cenas:** escreva os outros planos (`src/cenas-*.js` se ficar grande) e liste todos em `CENAS`. Os exemplos em `exemplos/*/shots_*.js` mostram como cada tipo de cena foi feito: adapte em vez de começar do zero. Preencha `ui.json` (palavras em destaque, placas com números reais).
6. **Revisão:** siga `references/revisao.md`. No mínimo 2 instantes por plano, comparando sempre com a referência. Corrija e repita.
7. **Render:** `node tools/renderizar.mjs <nome>`. Depois `node tools/folha.mjs <nome>` e olhe a folha do vídeo pronto.
8. **Entrega:** diga onde está o MP4 (`meus-videos/<nome>/<nome>.mp4`), o que você conferiu e o que não conferiu (você não ouve o áudio).

## Ajustes

A pessoa pede em português ("tira essa frase", "deixa essa cena mais lenta"). Mude só o que foi pedido, reconstrua, olhe o trecho e renderize de novo.

## Regras que não mudam

- O visual é o da referência: **bonequinho 2D recortado dentro de cenário 3D de verdade**, com luz de cinema, profundidade de campo, sombras projetadas e muitos detalhes. Nada de cenário plano ou de motion graphics genérico.
- **Planos longos.** Várias palavras rápidas da voz cabem numa só ação. Nunca corte por palavra.
- **Só a voz da pessoa**, sem música e sem efeitos, salvo pedido.
- **Sem frases irônicas escritas na tela.** O humor fica na narração e nas imagens.
- Texto e rostos entre 168 e 1330 px de altura.
- Só números verdadeiros nas placas, com fonte.
