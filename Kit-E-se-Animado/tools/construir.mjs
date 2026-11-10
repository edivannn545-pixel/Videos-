// Monta o 3D e as legendas e roda a verificação. Rode: node tools/construir.mjs <nome>
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { KIT, projeto, npx } from './comum.mjs';
import { gerarUI } from './legendas.mjs';
const P = projeto(process.argv[2]);
const require = createRequire(path.join(KIT, 'package.json'));
const esbuild = require('esbuild');
const out = path.join(P, 'assets', 'js', 'film.js');
try { esbuild.buildSync({ entryPoints: [path.join(P, 'src', 'main.js')], bundle: true, minify: true, format: 'iife', outfile: out, logLevel: 'error', nodePaths: [path.join(KIT, 'node_modules')] }); }
catch (e) { console.error('Erro no código das cenas (veja acima).'); process.exit(1); }
// o HyperFrames exige determinismo: troca as chamadas de relógio e acaso do three.js
let s = fs.readFileSync(out, 'utf8');
s = 'var __srv=1;function __sr(){__srv=(__srv*16807)%2147483647;return __srv/2147483647}function __noRaf(){return 0}function __noCaf(){}\n' + s.replaceAll('Math.random()', '__sr()').replaceAll('performance.now()', '0').replaceAll('requestAnimationFrame', '__noRaf').replaceAll('cancelAnimationFrame', '__noCaf');
fs.writeFileSync(out, s);
const n = gerarUI(P);
console.log(`✓ 3D montado · ✓ ${n} legendas`);
if (process.argv.includes('--sem-check')) process.exit(0);
const r = npx(['check', '--json'], { cwd: P, quiet: true, allowFail: true });
try { const d = JSON.parse(r.stdout); const e = ['lint', 'runtime', 'layout', 'craft'].map(k => [k, d[k]?.errorCount || 0, d[k]?.warningCount || 0]); console.log(d.ok ? '✓ verificação sem erros' : '✗ verificação com erros'); for (const [k, a, b] of e) if (a || b) { console.log(`  ${k}: ${a} erro(s), ${b} aviso(s)`); for (const f of (d[k].findings || []).slice(0, 6)) console.log(`   - ${f.code} ${f.time ?? ''} ${(f.message || '').slice(0, 140)}`); } if (!d.ok) process.exit(1); }
catch { console.log(r.stdout?.slice(0, 2000)); }
