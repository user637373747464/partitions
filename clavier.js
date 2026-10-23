/* clavier.js — un clavier de piano à l'écran (touchable) pour les leçons et les exercices. */
(function (racine) {
  'use strict';
  const NOIRES = { 1: 1, 3: 1, 6: 1, 8: 1, 10: 1 };
  const NOMS = ['do', 'ré', 'mi', 'fa', 'sol', 'la', 'si'];
  const idxBlanche = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
  const nomFr = (m) => NOMS[idxBlanche[((m % 12) + 12) % 12]];
  const octFr = (m) => Math.floor(m / 12) - 2;
  const parse = (x) => (typeof x === 'number' ? x : racine.Portee.midi(x));

  /* opt : { de, a, noms: 'do'|'tous'|false, marques: {midi: 'm'|'ok'|'non'}, surClic(midi), son: true } */
  function creer(el, opt) {
    const de = parse(opt.de || 'c3'), a = parse(opt.a || 'c5');
    const W = 22, H = 104, WB = 13, HB = 64;
    const blanches = []; for (let m = de; m <= a; m++) if (!NOIRES[((m % 12) + 12) % 12]) blanches.push(m);
    const xBlanche = new Map(blanches.map((m, i) => [m, i * W]));
    const largeur = blanches.length * W;
    let marques = Object.assign({}, opt.marques || {});
    const toucheCls = (m, base) => base + (marques[m] ? ' ' + marques[m] : '');
    function dessiner() {
      let s = '<svg viewBox="-1 -1 ' + (largeur + 2) + ' ' + (H + 2) + '" preserveAspectRatio="xMidYMid meet">';
      blanches.forEach((m) => { s += '<rect class="' + toucheCls(m, 'b') + '" data-m="' + m + '" x="' + xBlanche.get(m) + '" y="0" width="' + W + '" height="' + H + '" rx="2"/>'; });
      for (let m = de; m <= a; m++) {
        if (!NOIRES[((m % 12) + 12) % 12]) continue;
        const prev = xBlanche.get(m - 1); if (prev === undefined) continue;
        s += '<rect class="' + toucheCls(m, 'n') + '" data-m="' + m + '" x="' + (prev + W - WB / 2) + '" y="0" width="' + WB + '" height="' + HB + '" rx="2"/>';
      }
      if (opt.noms) blanches.forEach((m) => {
        const c = ((m % 12) + 12) % 12;
        if (opt.noms === 'tous') s += '<text x="' + (xBlanche.get(m) + W / 2) + '" y="' + (H - 8) + '">' + nomFr(m) + (c === 0 ? '<tspan font-size="7" dy="2">' + octFr(m) + '</tspan>' : '') + '</text>';
        else if (c === 0) s += '<text x="' + (xBlanche.get(m) + W / 2) + '" y="' + (H - 8) + '">do<tspan font-size="7" dy="2">' + octFr(m) + '</tspan></text>';
      });
      s += '</svg>';
      el.innerHTML = s;
    }
    el.classList.add('clav'); dessiner();
    const flash = (m) => { const r = el.querySelector('[data-m="' + m + '"]'); if (r) { r.classList.add('joue'); setTimeout(() => r.classList.remove('joue'), 260); } };
    el.addEventListener('pointerdown', (e) => {
      const r = e.target.closest && e.target.closest('[data-m]'); if (!r) return;
      e.preventDefault();
      const m = +r.getAttribute('data-m');
      if (opt.son !== false && racine.Son) racine.Son.note(m, 1.4, 0.85);
      flash(m);
      opt.surClic && opt.surClic(m);
    });
    return { marquer(map) { marques = Object.assign({}, map || {}); dessiner(); }, flash, dessiner };
  }
  racine.Clavier = { creer, nomFr, octFr };
})(typeof self !== 'undefined' ? self : this);
