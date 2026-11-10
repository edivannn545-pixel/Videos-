// Funções compartilhadas pelas ferramentas do kit.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
export const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SKILL = path.join(KIT, '.claude', 'skills', 'e-se-animado');
export const HF = 'hyperframes@0.9.16';
export const W = 1080, H = 1920;
const WIN = process.platform === 'win32';
export function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: opts.quiet ? 'pipe' : 'inherit', encoding: 'utf8', shell: WIN, cwd: opts.cwd || KIT, maxBuffer: 1 << 28 });
  if (r.status !== 0 && !opts.allowFail) { console.error(`\nFalhou: ${cmd} ${args.join(' ')}\n${r.stderr || ''}`); process.exit(r.status || 1); }
  return r;
}
export const npx = (args, opts) => run(WIN ? 'npx.cmd' : 'npx', ['--yes', HF, ...args], opts);
export function projeto(slug) {
  if (!slug) { console.error('Informe o nome do vídeo. Ex.: node tools/construir.mjs meu-video'); process.exit(1); }
  const p = path.join(KIT, 'meus-videos', slug);
  if (!fs.existsSync(p)) { console.error(`Não achei meus-videos/${slug}`); process.exit(1); }
  return p;
}
export function duracaoAudio(arquivo) {
  const r = run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arquivo], { quiet: true });
  return parseFloat(r.stdout.trim());
}
