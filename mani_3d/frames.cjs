const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const [,, outdir, ...times] = process.argv; fs.mkdirSync(outdir, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('err:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto('http://localhost:8765/anim.html'); await p.waitForFunction('window.DONE===true', null, { timeout: 180000 });
  for (const t of times) { const t0 = Date.now(); const d = await p.evaluate(x => window.renderAt(x), +t);
    fs.writeFileSync(`${outdir}/t_${t}.jpg`, Buffer.from(d.split(',')[1], 'base64')); console.log(t, Date.now() - t0, 'ms'); }
  await b.close();
})();
