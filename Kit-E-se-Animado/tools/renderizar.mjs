// Renderiza o vídeo final e nivela a voz. Rode: node tools/renderizar.mjs <nome>
import fs from 'node:fs';
import path from 'node:path';
import { run, npx, projeto } from './comum.mjs';
const slug = process.argv[2]; const P = projeto(slug);
run('node', [path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), 'construir.mjs'), slug]);
const tmp = path.join(P, '_render.mp4'), fim = path.join(P, `${slug}.mp4`);
console.log('… renderizando (cerca de 2 minutos num Mac com chip M)');
npx(['render', '--output', '_render.mp4', '--quality', 'high'], { cwd: P, quiet: true });
run('ffmpeg', ['-nostdin', '-y', '-v', 'error', '-i', tmp, '-c:v', 'copy', '-af', 'loudnorm=I=-15:TP=-1.5:LRA=9', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', fim]);
fs.rmSync(tmp, { force: true });
console.log(`\n✓ Vídeo pronto: meus-videos/${slug}/${slug}.mp4`);
