#!/bin/zsh
# assistir_video.sh — "assiste" um vídeo frame a frame para análise pelo Claude.
#
# Uso:  ./assistir_video.sh "video.mp4" [pasta_saida] [limiar_corte]
#
# Gera em <pasta_saida>:
#   frames/f_000001.jpg ...   TODOS os frames a 30fps (nome = nº do frame; t = (n-1)/30)
#   cortes.txt                tempo (s) de cada corte detectado
#   movimento.csv             frame, t, diferença para o frame anterior (0-1), brilho, saturação
#   cenas/cena_NNN.jpg        folha de cada cena: 12 frames distribuídos entre início e fim
#   visao_geral/geral_NN.jpg  folhas 6x5 com 1 frame a cada 2s (cada folha = 60s; leitura da esquerda p/ direita)
#   audio.wav                 áudio 16kHz mono, pronto para transcrição
set -euo pipefail

VIDEO="${1:?informe o caminho do vídeo}"
OUT="${2:-./assistido}"
LIMIAR="${3:-0.30}"
FPS=30

mkdir -p "$OUT/frames" "$OUT/cenas" "$OUT/visao_geral"

echo "1/5 Extraindo todos os frames a ${FPS}fps..."
[ -e "$OUT/frames/f_000001.jpg" ] || ffmpeg -nostdin -y -v error -i "$VIDEO" -vf "fps=$FPS" -q:v 3 "$OUT/frames/f_%06d.jpg"
TOTAL=$(ls "$OUT/frames" | wc -l | tr -d ' ')
echo "    $TOTAL frames"

echo "2/5 Medindo movimento, brilho e saturação de cada frame..."
ffmpeg -nostdin -v error -i "$VIDEO" \
  -vf "fps=$FPS,scale=320:-2,signalstats,metadata=print:file=$OUT/.stats.txt" -an -f null -
ffmpeg -nostdin -v error -i "$VIDEO" \
  -vf "fps=$FPS,scale=320:-2,select='gte(scene,0)',metadata=print:file=$OUT/.scene.txt" -an -f null -
paste -d' ' \
  <(grep -E 'lavfi.signalstats.YAVG=' "$OUT/.stats.txt" | cut -d= -f2) \
  <(grep -E 'lavfi.signalstats.SATAVG=' "$OUT/.stats.txt" | cut -d= -f2) \
  <(grep -E 'lavfi.scene_score=' "$OUT/.scene.txt" | cut -d= -f2) \
  | awk -v fps=$FPS 'BEGIN{print "frame,t,diff,brilho,saturacao"}
      {printf "%d,%.3f,%.4f,%.1f,%.1f\n", NR, (NR-1)/fps, $3, $1, $2}' > "$OUT/movimento.csv"
rm -f "$OUT/.stats.txt" "$OUT/.scene.txt"

echo "3/5 Detectando cortes (limiar $LIMIAR)..."
awk -F, -v l="$LIMIAR" 'NR>2 && $3>=l {print $2}' "$OUT/movimento.csv" > "$OUT/cortes.txt"
echo "    $(wc -l < "$OUT/cortes.txt" | tr -d ' ') cortes"

echo "4/5 Montando folhas por cena e visão geral..."
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
ffmpeg -nostdin -y -v error -i "$VIDEO" -vf \
  "fps=1/2,scale=320:-2,tile=6x5:padding=3" \
  -q:v 3 "$OUT/visao_geral/geral_%02d.jpg"

i=0; ini=0
for fim in $(cat "$OUT/cortes.txt") "$DUR"; do
  i=$((i+1))
  d=$(echo "$fim - $ini" | bc -l)
  # 12 frames igualmente espaçados dentro da cena = lê o movimento, não só a pose
  r=$(echo "12 / ($d + 0.001)" | bc -l)
  n=$(printf '%03d' $i)
  ffmpeg -nostdin -y -v error -ss "$ini" -t "$d" -i "$VIDEO" -vf \
    "fps=$r,scale=320:-2,tile=4x3:padding=3" -frames:v 1 -q:v 3 "$OUT/cenas/cena_$n.jpg" 2>/dev/null || true
  ini=$fim
done

echo "5/5 Extraindo áudio..."
ffmpeg -nostdin -y -v error -i "$VIDEO" -vn -ac 1 -ar 16000 "$OUT/audio.wav"

echo "Pronto: $OUT"
