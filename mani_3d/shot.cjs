const { chromium } = require('playwright');
(async()=>{
const [,, page_, out, w='1920', h='1080'] = process.argv;
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
p.on('console', m => console.log('console:', m.text())); p.on('pageerror', e => console.log('err:', e.message));
await p.goto('http://localhost:8765/' + page_);
await p.waitForFunction('window.DONE===true', null, { timeout: 180000 });
await (await p.$('canvas')).screenshot({ path: out });
await b.close();
})();
