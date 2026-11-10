# Comece aqui: E se animado

Este kit cria vídeos verticais de 45 a 60 segundos no estilo "E se...?": bonequinhos 2D dentro de cenários 3D com luz de cinema. Funciona em duas etapas: você manda um tema e recebe o roteiro; depois grava a voz, manda o arquivo e recebe o vídeo pronto.

> **Use a aba Code do app do Claude para computador.** Numa conversa comum o kit não funciona.

## O que tem nesta pasta

```
Kit-E-se-Animado/
  COMECE-AQUI.md   este guia
  meus-roteiros/   seus roteiros, com as fontes dos dados
  meus-videos/     seus vídeos (um projeto por vídeo)
  tools/           ferramentas que o Claude usa (não precisa mexer)
  CLAUDE.md        instruções para o Claude (não precisa mexer)
  .claude/         a skill, o motor 3D e os exemplos (pasta oculta)
```

## Passo 1. Instalar (uma vez)

1. Instale o **app do Claude para computador** (claude.ai/download) e entre na sua conta.
2. Descompacte este kit em Documentos (no Windows, em `C:\Kit-E-se-Animado`, fora do OneDrive).
3. No app do Claude, abra a aba **Code** e escolha a pasta `Kit-E-se-Animado`.
4. Escreva **oi**. O Claude confere o computador e instala o que faltar (Node, ffmpeg e o motor de vídeo). Ele pede sua permissão antes de instalar. A primeira vez demora alguns minutos.
   - **No Mac**, se faltar o Homebrew, ele te passa uma linha para colar no app **Terminal**. Lá o Mac pede sua senha. Você digita (nada aparece na tela) e aperta Enter.
   - **No Windows**, depois de instalar alguma coisa, feche e abra o app do Claude quando ele pedir.

## Passo 2. Peça o roteiro

Escreva o tema, por exemplo: **"roteiro: e se a internet acabasse por um dia?"**.
O Claude pesquisa os dados e devolve um texto de 45 a 60 segundos, pronto para gravar, e salva as fontes em `meus-roteiros/`. Ele para aí e espera a sua voz.

## Passo 3. Grave ou gere a voz (é com você)

- **Sua voz:** grave no gravador do celular ou do computador, num lugar silencioso.
- **Voz de IA:** cole o texto no ElevenLabs e baixe o MP3. Confira as regras do plano que você usar, principalmente para uso comercial.

## Passo 4. Mande o áudio

Arraste o arquivo para a conversa e escreva **"anima esse áudio"**.
O Claude mostra a primeira cena para conferir o visual, monta as outras, revisa e entrega o MP4 em `meus-videos/<nome>/`.

## Passo 5. Ajuste e poste

Peça mudanças em português: "deixa essa cena mais lenta", "troca a cor do céu", "tira essa placa".
O vídeo sai só com a voz: coloque a música no app em que for postar.

## Bom saber

- Um vídeo usa bastante do seu limite do Claude. Planos maiores aguentam mais vídeos por dia.
- O Claude confere tudo por imagens, mas não ouve o áudio: assista antes de postar.
- Se a conversa for interrompida, escreva: "continue o vídeo <nome> de onde parou".

Versão do kit: 1.2.0.
