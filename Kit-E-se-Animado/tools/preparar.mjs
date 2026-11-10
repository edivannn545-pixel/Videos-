// Confere o computador e instala o que o kit precisa. Rode: node tools/preparar.mjs [--instalar]
// Sem --instalar, só confere. Com --instalar, instala o ffmpeg que faltar (Homebrew no Mac, winget no Windows).
import fs from 'node:fs';
import path from 'node:path';
import { run, npx, KIT } from './comum.mjs';
const instalar = process.argv.includes('--instalar');
const MAC = process.platform === 'darwin', WIN = process.platform === 'win32';
const ok = (m) => console.log('  ✓ ' + m), falta = (m) => console.log('  ✗ ' + m);
const tem = (cmd, arg = '-version') => run(cmd, [arg], { quiet: true, allowFail: true }).status === 0;
let problemas = 0;
const [maj] = process.versions.node.split('.').map(Number);
maj >= 18 ? ok(`Node ${process.versions.node}`) : (falta(`Node ${process.versions.node}: precisa ser 18 ou mais novo`), problemas++);
if (!tem('ffmpeg') || !tem('ffprobe')) {
  if (instalar && MAC && tem('brew', '--version')) { console.log('  … instalando ffmpeg pelo Homebrew'); run('brew', ['install', 'ffmpeg'], { allowFail: true }); }
  else if (instalar && WIN && tem('winget', '--version')) { console.log('  … instalando ffmpeg pelo winget'); run('winget', ['install', '--id', 'Gyan.FFmpeg', '-e', '--accept-source-agreements', '--accept-package-agreements'], { allowFail: true }); }
}
if (tem('ffmpeg') && tem('ffprobe')) ok('ffmpeg e ffprobe');
else { problemas++; falta('ffmpeg não encontrado');
  if (WIN && instalar) console.log('    Se acabou de instalar: feche e abra o app do Claude, para o Windows achar o ffmpeg.');
  else if (MAC && !tem('brew', '--version')) console.log('    Falta o Homebrew. A pessoa precisa colar no Terminal (pede a senha do Mac):\n    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
  else if (!instalar) console.log('    Rode de novo com --instalar, depois de pedir permissão à pessoa.'); }
if (!fs.existsSync(path.join(KIT, 'node_modules', 'three'))) { console.log('  … instalando three e esbuild'); run(WIN ? 'npm.cmd' : 'npm', ['install', '--no-audit', '--no-fund', '--silent'], { allowFail: true }); }
fs.existsSync(path.join(KIT, 'node_modules', 'three')) ? ok('three 0.170.0 e esbuild') : (falta('three e esbuild não instalaram (confira a internet e rode de novo)'), problemas++);
console.log('  … conferindo o HyperFrames (a primeira vez baixa o navegador de render)');
const d = npx(['doctor'], { quiet: true, allowFail: true });
d.status === 0 ? ok('HyperFrames 0.9.16') : (falta('HyperFrames: veja a saída de `npx hyperframes@0.9.16 doctor`'), console.log(d.stdout || '', d.stderr || ''), problemas++);
console.log(problemas ? `\n${problemas} item(ns) para resolver.` : '\nTudo pronto.');
process.exit(problemas ? 1 : 0);
