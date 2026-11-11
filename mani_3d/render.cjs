const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs');
(async () => {
  const [,, f0, f1, out] = process.argv; const FPS = 24;
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => fs.appendFileSync('out/errors.log', e.message + '\n'));
  await p.goto('http://localhost:8765/anim.html'); await p.waitForFunction('window.DONE===true', null, { timeout: 300000 });
  const t0 = Date.now();
  for (let i = +f0; i < +f1; i++) {
    const d = await p.evaluate(x => window.renderAt(x, 0.95), i / FPS);
    const buf = Buffer.from(d.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 48 === 0) fs.writeFileSync(`out/progress_${f0}.txt`, `${i} ${f1} ${((Date.now() - t0) / 1000 / (i - f0 + 1)).toFixed(2)}s/frame\n`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  fs.writeFileSync(`out/progress_${f0}.txt`, `DONE ${f1}\n`);
})();
