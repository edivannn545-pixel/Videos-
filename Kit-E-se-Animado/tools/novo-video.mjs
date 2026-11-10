// Cria um projeto de vídeo a partir de um áudio. Rode: node tools/novo-video.mjs <nome> <caminho-do-audio>
import fs from 'node:fs';
import path from 'node:path';
import { run, npx, KIT, SKILL, duracaoAudio } from './comum.mjs';
const [slug, audio] = process.argv.slice(2);
if (!slug || !audio) { console.error('Uso: node tools/novo-video.mjs <nome> <caminho-do-audio>'); process.exit(1); }
if (!/^[a-z0-9-]+$/.test(slug)) { console.error('Use só letras minúsculas, números e hífen no nome.'); process.exit(1); }
if (!fs.existsSync(audio)) { console.error(`Não achei o áudio: ${audio}`); process.exit(1); }
const P = path.join(KIT, 'meus-videos', slug);
if (fs.existsSync(P)) { console.error(`meus-videos/${slug} já existe.`); process.exit(1); }
fs.cpSync(path.join(SKILL, 'modelo'), P, { recursive: true });
fs.mkdirSync(path.join(P, 'src', 'motor'), { recursive: true });
for (const f of fs.readdirSync(path.join(SKILL, 'motor'))) fs.copyFileSync(path.join(SKILL, 'motor', f), path.join(P, 'src', 'motor', f));
fs.mkdirSync(path.join(P, 'assets', 'audio'), { recursive: true }); fs.mkdirSync(path.join(P, 'assets', 'js'), { recursive: true });
run('ffmpeg', ['-nostdin', '-y', '-v', 'error', '-i', audio, '-ac', '2', '-ar', '48000', '-c:a', 'pcm_s16le', path.join(P, 'assets', 'audio', 'voz.wav')]);
const voz = duracaoAudio(path.join(P, 'assets', 'audio', 'voz.wav'));
const total = Math.round((voz + 1.8) * 10) / 10;
for (const f of ['index.html', 'compositions/film.html', 'meta.json']) { const p = path.join(P, f); fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replaceAll('__TOTAL__', String(total)).replaceAll('__VOZ__', voz.toFixed(3)).replaceAll('__NOME__', slug)); }
const ui = JSON.parse(fs.readFileSync(path.join(P, 'ui.json'), 'utf8')); ui.duracao = total; fs.writeFileSync(path.join(P, 'ui.json'), JSON.stringify(ui, null, 2));
console.log('… transcrevendo a voz em português');
npx(['transcribe', 'assets/audio/voz.wav', '--model', 'small', '--language', 'pt', '--json'], { cwd: P, quiet: true });
const tp = path.join(P, 'assets', 'audio', 'transcript.json'); const d = JSON.parse(fs.readFileSync(tp, 'utf8')); const w = Array.isArray(d) ? d : d.words;
const linhas = w.map(x => `${x.start.toFixed(2)}\t${x.text}`).join('\n'); fs.writeFileSync(path.join(P, 'PALAVRAS.txt'), linhas + '\n');
console.log(`\nProjeto: meus-videos/${slug}\nVoz: ${voz.toFixed(1)} s · vídeo: ${total} s · ${w.length} palavras\nTempos de cada palavra: meus-videos/${slug}/PALAVRAS.txt`);
