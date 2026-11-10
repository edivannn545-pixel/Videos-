import { Stage } from './motor/core.js';
import { uT } from './motor/kit2.js';
import { shotPhone, shotDishes, shotPanic, shotPlaza } from './shots_a.js';
import { shotButton, shotSummit, shotBBQ, shotSpace, shotRoof } from './shots_b.js';
window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
window.__hf.buildReady.film = (async () => {
  await Promise.all(["900 40px Fraunces", "700 40px Caveat", "700 40px Inter", "800 40px Inter", "600 40px Inter", "700 40px 'IBM Plex Mono'", "600 40px 'IBM Plex Mono'"].map(f => document.fonts.load(f))).catch(() => {});
  const st = new Stage(document.getElementById('film3d'));
  [shotPhone(0, 5.37), shotDishes(5.37, 9.0), shotPanic(9.0, 12.27), shotPlaza(12.27, 19.66), shotButton(19.66, 23.34), shotSummit(23.34, 26.0), shotBBQ(26.0, 28.59), shotSpace(28.59, 36.4), shotRoof(36.4, 44.8)].forEach(s => st.add(s));
  window.__film = st; window.addEventListener('hf-seek', (e) => st.render(e.detail.time)); st.render(0);
})();
