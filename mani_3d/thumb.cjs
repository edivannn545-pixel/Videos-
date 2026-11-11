const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const [,, out, json] = process.argv;
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('err:', e.message));
  await p.goto('http://localhost:8765/anim.html?sh=4096'); await p.waitForFunction('window.DONE===true', null, { timeout: 180000 });
  const list = JSON.parse(json);
  for (let i = 0; i < list.length; i++) { const d = await p.evaluate(o => { Object.assign(window.TH, o); return window.renderAt(1000.5, 0.95); }, list[i]);
    fs.writeFileSync(`${out}_${i}.jpg`, Buffer.from(d.split(',')[1], 'base64')); console.log(i); }
  await b.close();
})();
