# Análise: "What if You're The Last Guy on Earth?"

Base do `PROMPT_MASTER.md`. Vídeo: 1280×720, 30 fps, 8min14s, 14.821 frames.

## O que foi medido e o que foi estimado

| Origem | Itens |
| --- | --- |
| Medido em todos os frames | cortes, diferença entre frames, brilho, saturação |
| Medido na transcrição e no áudio | palavras por minuto, loudness (−17,3 LUFS; LRA 3,7 LU), espectrograma |
| Amostrado em frames-chave | cores (hex com precisão aproximada, por causa da compressão) |
| Visto por mim | ~540 frames: 247 da visão geral (1 a cada 2 s) e 288 em 12 tiras de movimento |
| Estimado a olho | durações de animação em tiras com passo maior que 1 frame, proporções do personagem, fontes (o nome original é desconhecido; indiquei fontes parecidas) |
| Não verificado | trilha e efeitos: analisei o espectrograma, mas não ouvi o som |

## Ritmo

- 54 planos separados por corte seco (limiar 0,30). Mediana 2,17 s, média 9,15 s: rajadas rápidas e planos longos com a câmera viajando.
- Os maiores trechos sem corte seco têm 90 s (6:44 ao fim), 45 s (4:30 a 5:15) e 34 s (2:29 a 3:03). Eles têm fusões e travessias internas, que não contam como corte, então o número real de mudanças visuais é maior.
- 79% dos frames mudam menos de 0,005 em relação ao anterior: a imagem se move devagar a maior parte do tempo, com picos curtos.
- Cortes por minuto: 15, 4, 5, 9, 15, 3, 2, 0, 0. O início e a virada cômica são os trechos mais cortados, e o final desacelera até quase parar.
- Voz: 1.022 palavras, cerca de 124 por minuto, com muitas pausas.

## Estrutura (tempos aproximados)

| Tempo | % | Trecho | O que acontece |
| --- | ---: | --- | --- |
| 0:00–1:10 | 14 | Abertura | 9:41 PM. Homens somem em gestos banais (a frase "So anyway, I wa—" fica sem fim). Contador cai a 1. VOCÊ dorme sonhando. O mundo grita. Título em LED. |
| 1:10–2:35 | 17 | Cap. 1: The Morning After | Cartazes de desaparecidos. Influencer: "Best day ever", e a luz dela apaga. Dominó: energia, caminhões, navios, líderes. Boa notícia: hospitais. Muro: sem bebês, 100 anos até zero. "A não ser que..." |
| 2:35–4:05 | 18 | Cap. 2: The Last Bachelor | Terno e rosa. Perseguição. Disfarce de mulher, polícia acena, salto quebra, é preso. Fama: camisetas, estátua de ouro, "Hope". |
| 4:05–4:44 | 8 | A escolha | Bunker, general, "a escolha é sua". Corte para "alguns meses depois": VIP na piscina. |
| 4:44–5:43 | 12 | Cap. 4: Supply & Demand | 100 milhões por dia parece muito, não é. Sultão do Marrocos, "appointments", 5,5 milhões de anos. Solução: FIV. |
| 5:43–7:19 | 19 | Cap. 5: The Next Generation | Ano 1, "It's a boy", contador sobe a 2. Porém: todos são meios-irmãos. Gênghis Khan. 1942 → hoje. Luzes voltam. Ano 18. Estádio. Só lembra 4 nomes. Reboot 100%. |
| 7:19–8:02 | 9 | Epílogo | 50 anos depois: estátuas, Dia dos Pais. Terraço. Repete a pergunta inicial. Última piada: a espreguiçadeira. |
| 8:02–8:14 | 2 | Tela final | Praia, bebês empilhados, espaços para próximos vídeos. |

Não encontrei uma placa do "capítulo 3" nas amostras, então esse trecho ficou sem nome.

## Achados que mudam o resultado

- **As portas de capítulo são de banheiro.** Feminino, masculino, depois o masculino vira altar com velas, maternidade e unissex no epílogo. O objeto muda junto com a história. No prompt isso virou a regra de "gags que mudam de estado".
- **O desaparecimento fica fora do personagem.** O impacto vem do que sobra: a coleira cai, o cachorro segue e senta.
- **O protagonista é "você".** Em segunda pessoa e levemente humilhado, o que aproxima a plateia sem exigir que ela conheça ninguém.
- **Só o herói ganha brilho na borda.** Fora dele e dos números-chave, a imagem é fosca.
- **Os fatos têm cenário próprio.** Cada estatística vira um mundo, nunca um slide: 96% ganha um eletricista na rua ao amanhecer.
- **O visual parece 3D de verdade.** Prédios, caminhões e câmera em arco sugerem um pipeline 3D com aparência vetorial. Reproduzir isso em HTML é o maior risco técnico, e por isso o prompt tem um portão de estilo antes do resto.

## Arquivos

- `assistir_video.sh`: extrai todos os frames, cortes, métricas, folhas de cena e áudio.
- `tira_frames.sh`: monta uma folha de 24 frames para estudar um movimento.
- `referencia/frames/`: 28 frames-chave em tamanho original.
- `referencia/movimento/`: 8 tiras de movimento.
- `referencia/transcricao_original.csv`: transcrição automática, com erros (ex.: "Keep Brenda" no lugar de "Cue Brenda", provavelmente).
