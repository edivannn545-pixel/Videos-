#!/bin/zsh
# tira_frames.sh — monta uma folha com 24 frames seguidos para estudar um movimento.
# Uso: ./tira_frames.sh <pasta_de_frames> <segundo_inicial> <passo_em_frames> <saida.jpg>
# Passo 1 = 24 frames consecutivos (0,8s a 30fps). Passo 3 = 2,4s. Lê da esquerda p/ direita.
set -euo pipefail
ST=$(python3 -c "print(int($2*30)+1)")
ffmpeg -nostdin -y -v error -start_number "$ST" -i "$1/f_%06d.jpg" \
  -vf "select='not(mod(n,$3))',scale=320:-2,tile=6x4:padding=2" -frames:v 1 -q:v 3 "$4"
