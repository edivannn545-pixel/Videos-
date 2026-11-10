// Gera folhas de frames para revisar. Rode: node tools/folha.mjs <nome> [segundos separados por vírgula]
// Sem segundos: 1 frame por segundo do vídeo renderizado. Com segundos: snapshot do projeto naqueles instantes.
import fs from 'node:fs';
import path from 'node:path';
import { run, npx, projeto } from './comum.mjs';
const [slug, at] = process.argv.slice(2); const P = projeto(slug);
if (at) { const r = npx(['snapshot', '--at', at], { cwd: P, quiet: true }); const m = r.stdout.match(/[^\s]*contact-sheet[^\s]*\.jpg/g) || []; console.log(m.join('\n')); }
else { const v = path.join(P, `${slug}.mp4`); if (!fs.existsSync(v)) { console.error('Renderize antes, ou passe os segundos.'); process.exit(1); } const o = path.join(P, 'revisao.jpg'); run('ffmpeg', ['-nostdin', '-y', '-v', 'error', '-i', v, '-vf', 'fps=1,scale=180:-2,tile=11x5:padding=2', '-frames:v', '1', '-q:v', '3', o]); console.log(o); }
