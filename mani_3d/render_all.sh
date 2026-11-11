#!/bin/bash
cd /home/user/Videos-/mani_3d
curl -s localhost:8765 >/dev/null || (python3 -m http.server 8765 >/dev/null 2>&1 &)
sleep 1
N=7426
for c in 0 1 2 3; do
  a=$((c*1857)); b=$(((c+1)*1857)); [ $b -gt $N ] && b=$N
  [ -f out/part_$c.mp4 ] && grep -q DONE out/progress_$a.txt 2>/dev/null && continue
  node render.cjs $a $b out/part_$c.mp4 >> out/render.log 2>&1
done
echo ALLDONE >> out/render.log
