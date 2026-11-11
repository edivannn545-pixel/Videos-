const { chromium } = require('playwright');
(async () => { const [,, q, ...times] = process.argv;
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => console.log('err', e.message));
  await p.goto('http://localhost:8765/anim.html?' + q); await p.waitForFunction('window.DONE===true', null, { timeout: 180000 });
  for (const t of times) { const t0 = Date.now(); await p.evaluate(i => window.renderFrame(i), Math.round(+t * 30)); const L = await p.evaluate(() => window.LAST); console.log(q, t, 'total', Date.now() - t0, 'render', Math.round(L.render), 'enc', Math.round(L.enc), 'calls', L.calls, 'tris', L.tris); }
  await b.close(); })();
