/* exo.js — les exercices : générateurs de questions (lecture de notes, durées, intervalles, armures…), moteur d'une série, et exercice de rythme à taper. */
(function (racine) {
  'use strict';
  const P = racine.Portee, S = () => racine.Store;
  const NOMS = P.NOMS_FR, LET = 'cdefgab';
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (t) => t[Math.floor(Math.random() * t.length)];
  const melange = (t) => { t = t.slice(); for (let i = t.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [t[i], t[j]] = [t[j], t[i]]; } return t; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pitchDe = (st) => LET[((st % 7) + 7) % 7] + Math.floor(st / 7);
  const stepDe = (h) => { const p = P.parseHauteur(h); return p.oct * 7 + LET.indexOf(p.lettre); };
  const ord = (n) => (n === 1 ? '1re' : n + 'e');
  const BAS = { sol: 30, fa: 18 };
  const nomNote = (lettre) => NOMS[LET.indexOf(lettre)];

  function positionTexte(st, cle) {
    const d = st - BAS[cle];
    if (d >= 0 && d <= 8) return d % 2 === 0 ? 'sur la ' + ord(d / 2 + 1) + ' ligne (on compte depuis le bas)' : 'dans le ' + ord((d + 1) / 2) + ' interligne (on compte depuis le bas)';
    if (d > 8) { const e = d - 8; return e % 2 === 0 ? 'sur la ' + ord(e / 2) + ' ligne supplémentaire au-dessus de la portée' : (e === 1 ? 'juste au-dessus de la portée' : 'au-dessus d’une ligne supplémentaire'); }
    const e = -d; return e % 2 === 0 ? 'sur la ' + ord(e / 2) + ' ligne supplémentaire sous la portée' : (e === 1 ? 'juste sous la portée' : 'sous une ligne supplémentaire');
  }
  const REPERE = { sol: 'La clé de sol s’enroule autour de la 2e ligne : c’est le sol.', fa: 'La clé de fa encadre la 4e ligne : c’est le fa.' };

  /* ---------- générateurs : chacun renvoie une question ---------- */
  const NOMS_DUREE = { w: 'ronde', h: 'blanche', q: 'noire', e: 'croche', s: 'double-croche', t: 'triple-croche' };
  const NOMS_SILENCE = { w: 'pause', h: 'demi-pause', q: 'soupir', e: 'demi-soupir', s: 'quart de soupir', t: 'huitième de soupir' };
  const TEMPS = { w: 4, h: 2, q: 1, e: 0.5, s: 0.25, t: 0.125 };
  const txtTemps = (x) => { const e = Math.floor(x), r = x - e; const f = r === 0.5 ? '½' : r === 0.25 ? '¼' : r === 0.75 ? '¾' : r === 0.125 ? '⅛' : r === 0.375 ? '⅜' : ''; if (!f) return String(x); return (e ? e + ' ' : '') + f; };
  const NOMS_INTERVALLE = ['', 'unisson', 'seconde', 'tierce', 'quarte', 'quinte', 'sixte', 'septième', 'octave'];
  const MAJEURES = { '-7': 'Do♭', '-6': 'Sol♭', '-5': 'Ré♭', '-4': 'La♭', '-3': 'Mi♭', '-2': 'Si♭', '-1': 'Fa', '0': 'Do', '1': 'Sol', '2': 'Ré', '3': 'La', '4': 'Mi', '5': 'Si', '6': 'Fa♯', '7': 'Do♯' };
  const MINEURES = { '-7': 'La♭', '-6': 'Mi♭', '-5': 'Si♭', '-4': 'Fa', '-3': 'Do', '-2': 'Sol', '-1': 'Ré', '0': 'La', '1': 'Mi', '2': 'Si', '3': 'Fa♯', '4': 'Do♯', '5': 'Sol♯', '6': 'Ré♯', '7': 'La♯' };

  function choixNoms() { return NOMS.map((n) => ({ l: n, v: n })); }
  const dernier = {};
  const eviter = (cle, gen) => { let x, k = 0; do { x = gen(); k++; } while (dernier[cle] === JSON.stringify(x.cle) && k < 6); dernier[cle] = JSON.stringify(x.cle); return x.q; };

  const GEN = {
    'note-nom'(p) {
      return eviter('nn', () => {
        const cles = p.clef === 'les-deux' ? ['sol', 'fa'] : [p.clef || 'sol'];
        const cle = pick(cles);
        const lo = p.lo ? stepDe(p.lo) : (cle === 'sol' ? 30 : 18), hi = p.hi ? stepDe(p.hi) : (cle === 'sol' ? 38 : 26);
        let lo2 = lo, hi2 = hi;
        if (p.clef === 'les-deux') { lo2 = cle === 'sol' ? (p.lo ? stepDe(p.lo) : 30) : 18; hi2 = cle === 'sol' ? (p.hi ? stepDe(p.hi) : 38) : 26; }
        const st = rnd(lo2, hi2), h = pitchDe(st), nom = nomNote(LET[st % 7]);
        return { cle: [cle, st], q: { comp: 'lecture-' + cle, consigne: 'Quel est le nom de cette note ?', portee: { clef: cle, s: h + ':q', etire: false }, mode: 'choix', choix: choixNoms(), bonne: nom, son: [P.midi(h)],
          expl: 'C’est un <b>' + nom + '</b> : la note est ' + positionTexte(st, cle) + '. ' + REPERE[cle] } };
      });
    },
    'note-clavier'(p) {
      return eviter('nc', () => {
        const cle = pick(p.clef === 'les-deux' ? ['sol', 'fa'] : [p.clef || 'sol']);
        const lo = p.lo ? stepDe(p.lo) : (cle === 'sol' ? 30 : 18), hi = p.hi ? stepDe(p.hi) : (cle === 'sol' ? 38 : 26);
        const st = rnd(lo, hi), h = pitchDe(st), m = P.midi(h), oct = Math.floor(st / 7);
        return { cle: [cle, st], q: { comp: 'clavier-' + cle, consigne: 'Touche cette note sur le clavier.', portee: { clef: cle, s: h + ':q' }, mode: 'touche', bonne: m, clavier: { de: 12 * oct, a: 12 * (oct + 2), noms: 'do' }, son: [m],
          expl: 'C’est un <b>' + nomNote(LET[st % 7]) + '</b> (' + P.nomFr(h) + '). ' + positionTexte(st, cle).replace(/^./, (c) => c.toUpperCase()) + '.' } };
      });
    },
    'nom-clavier'(p) {
      return eviter('ncl', () => {
        const lo = stepDe(p.lo || 'c4'), hi = stepDe(p.hi || 'b4');
        const st = rnd(lo, hi), h = pitchDe(st), m = P.midi(h), oct = Math.floor(st / 7);
        return { cle: st, q: { comp: 'clavier-nom', consigne: 'Touche : <b>' + P.nomFr(h) + '</b>', mode: 'touche', bonne: m, clavier: { de: 12 * oct, a: 12 * (oct + 2), noms: p.noms === false ? false : 'do' }, son: [m],
          expl: 'Le <b>' + P.nomFr(h) + '</b> est la touche blanche ' + (['juste à gauche du groupe de deux noires', 'entre les deux noires du groupe de deux', 'juste à droite du groupe de deux noires', 'juste à gauche du groupe de trois noires', 'entre la 1re et la 2e noire du groupe de trois', 'entre la 2e et la 3e noire du groupe de trois', 'juste à droite du groupe de trois noires'][LET.indexOf(P.parseHauteur(h).lettre)]) + '.' } };
      });
    },
    'duree'(p) {
      return eviter('du', () => {
        const formes = p.formes || ['w', 'h', 'q', 'e', 's'];
        const f = pick(formes), sil = p.silences ? (p.silences === 'seuls' ? true : Math.random() < 0.45) : false;
        const pts = p.points ? (Math.random() < 0.4 ? 1 : 0) : 0;
        const noms = sil ? NOMS_SILENCE : NOMS_DUREE;
        const nom = noms[f] + (pts ? ' pointée' : '');
        const tous = formes.flatMap((x) => [noms[x]].concat(p.points ? [noms[x] + ' pointée'] : []));
        const s = (sil ? 'r' : 'b4') + ':' + f + '.'.repeat(pts);
        const base = TEMPS[f];
        return { cle: [f, sil, pts], q: { comp: sil ? 'silences' : 'durees', consigne: sil ? 'Quel est le nom de ce silence ?' : 'Quel est le nom de cette note ?', portee: { clef: 'sol', s }, mode: 'choix', choix: tous.map((x) => ({ l: x, v: x })), bonne: nom, son: sil ? null : [P.midi('b4')],
          expl: 'C’est une <b>' + nom + '</b>. ' + (sil ? 'Ce silence' : 'Cette note') + ' dure ' + txtTemps(base * (pts ? 1.5 : 1)) + ' temps (quand la noire vaut 1 temps).' } };
      });
    },
    'valeur'(p) {
      return eviter('va', () => {
        const formes = p.formes || ['w', 'h', 'q', 'e'];
        const f = pick(formes), pts = p.points ? (Math.random() < 0.45 ? 1 : 0) : 0, sil = p.silences ? Math.random() < 0.4 : false;
        const v = TEMPS[f] * (pts ? 1.5 : 1);
        const opts = [...new Set(formes.flatMap((x) => [TEMPS[x]].concat(p.points ? [TEMPS[x] * 1.5] : [])))].sort((a, b) => b - a);
        return { cle: [f, pts, sil], q: { comp: 'valeurs', consigne: 'La noire vaut 1 temps. Combien de temps dure ' + (sil ? 'ce silence' : 'cette note') + ' ?', portee: { clef: 'sol', s: (sil ? 'r' : 'b4') + ':' + f + '.'.repeat(pts) }, mode: 'choix', choix: opts.map((x) => ({ l: txtTemps(x), v: String(x) })), bonne: String(v), son: sil ? null : [P.midi('b4')],
          expl: (sil ? 'Ce silence' : 'Cette note') + ' est une ' + (sil ? NOMS_SILENCE : NOMS_DUREE)[f] + (pts ? ' pointée' : '') + ' : elle dure <b>' + txtTemps(v) + ' temps</b>' + (pts ? ' (le point ajoute la moitié de la valeur : ' + txtTemps(TEMPS[f]) + ' + ' + txtTemps(TEMPS[f] / 2) + ').' : '.') } };
      });
    },
    'alt-nom'(p) {
      return eviter('an', () => {
        const cle = p.clef || 'sol';
        const lo = cle === 'sol' ? 30 : 18, st = rnd(lo, lo + 8), type = pick(p.types || ['#', 'b']);
        const l = LET[st % 7], h = l + type + Math.floor(st / 7), nom = NOMS[LET.indexOf(l)] + (type === '#' ? ' dièse' : ' bémol');
        const autres = [NOMS[LET.indexOf(l)] + (type === '#' ? ' bémol' : ' dièse'), NOMS[LET.indexOf(l)], NOMS[(LET.indexOf(l) + 1) % 7] + (type === '#' ? ' bémol' : ' dièse')];
        const choix = melange([nom, ...autres]).map((x) => ({ l: x, v: x }));
        return { cle: [h], q: { comp: 'alterations', consigne: 'Quelle est cette note ?', portee: { clef: cle, s: h + ':q' }, mode: 'choix', choix, bonne: nom, son: [P.midi(h)],
          expl: 'La note est un ' + NOMS[LET.indexOf(l)] + ' ; le signe ' + (type === '#' ? '♯ (dièse) la monte d’un demi-ton' : '♭ (bémol) la descend d’un demi-ton') + ' : c’est un <b>' + nom + '</b>.' } };
      });
    },
    'alt-signe'() {
      return eviter('as', () => {
        const type = pick(['#', 'b', 'n']);
        const st = rnd(30, 38), l = LET[st % 7];
        const h = l + type + Math.floor(st / 7);
        const r = { '#': 'Elle monte d’un demi-ton', b: 'Elle descend d’un demi-ton', n: 'Elle annule une altération précédente' };
        return { cle: [type], q: { comp: 'alterations', consigne: 'Le signe devant la note modifie son son. Que fait-il ?', portee: { clef: 'sol', s: h + ':q' }, mode: 'choix', choix: Object.values(r).map((x) => ({ l: x, v: x })), bonne: r[type],
          expl: { '#': 'Le <b>dièse ♯</b> monte la note d’un demi-ton.', b: 'Le <b>bémol ♭</b> descend la note d’un demi-ton.', n: 'Le <b>bécarre ♮</b> ramène la note à son état naturel : il annule un dièse ou un bémol.' }[type] } };
      });
    },
    'alt-clavier'(p) {
      return eviter('ac', () => {
        const type = pick(p.types || ['#', 'b']);
        const noires = [['c#', 'db'], ['d#', 'eb'], ['f#', 'gb'], ['g#', 'ab'], ['a#', 'bb']];
        const [d, b] = pick(noires), nom = type === '#' ? d : b;
        const oct = pick(p.octs || [3, 4]);
        const h = nom + oct, m = P.midi(h);
        return { cle: [h], q: { comp: 'alt-clavier', consigne: 'Touche : <b>' + P.nomFr(h) + '</b>', portee: { clef: 'sol', s: h + ':q' }, mode: 'touche', bonne: m, clavier: { de: 12 * oct, a: 12 * (oct + 2), noms: 'do' }, son: [m],
          expl: 'Un ' + (type === '#' ? 'dièse monte' : 'bémol descend') + ' d’un demi-ton : c’est la touche noire ' + (type === '#' ? 'à droite' : 'à gauche') + ' de la touche blanche.' } };
      });
    },
    'intervalle'(p) {
      return eviter('in', () => {
        const maxI = p.max || 8;
        const base = rnd(30, 36), n = rnd(p.min || 1, maxI), st2 = base + (n - 1);
        const desc = Math.random() < (p.desc || 0);
        const a = pitchDe(base), b = pitchDe(st2);
        const s = desc ? b + ':q ' + a + ':q' : a + ':q ' + b + ':q';
        const opts = NOMS_INTERVALLE.slice(p.min || 1, maxI + 1);
        return { cle: [base, n, desc], q: { comp: 'intervalles', consigne: 'Quel est cet intervalle ?', portee: { clef: 'sol', s }, mode: 'choix', choix: opts.map((x) => ({ l: x, v: x })), bonne: NOMS_INTERVALLE[n], son: desc ? [P.midi(b), P.midi(a)] : [P.midi(a), P.midi(b)],
          expl: 'On compte les notes de la première à la dernière, en comptant les deux : ' + (n === 1 ? 'même note' : n + ' notes') + ' → une <b>' + NOMS_INTERVALLE[n] + '</b>.' } };
      });
    },
    'armure'(p) {
      return eviter('ar', () => {
        const mode = p.mode || 'maj', max = p.max || 7;
        const n = rnd(-max, max);
        const tab = mode === 'min' ? MINEURES : MAJEURES;
        const bonne = tab[n];
        const ch = [bonne];
        while (ch.length < 4) { const x = tab[Math.max(-7, Math.min(7, n + pick([-2, -1, 1, 2, 3, -3])))]; if (!ch.includes(x)) ch.push(x); }
        return { cle: [n, mode], q: { comp: 'armures', consigne: 'Quelle est la tonalité ' + (mode === 'min' ? 'mineure' : 'majeure') + ' de cette armure ?', portee: { clef: 'sol', arm: n, s: '' }, mode: 'choix', choix: melange(ch).map((x) => ({ l: x + (mode === 'min' ? ' mineur' : ' majeur'), v: x })), bonne,
          expl: (n === 0 ? 'Aucune altération : ' : Math.abs(n) + (n > 0 ? ' dièse' : ' bémol') + (Math.abs(n) > 1 ? 's' : '') + ' : ') + '<b>' + bonne + (mode === 'min' ? ' mineur' : ' majeur') + '</b>.' } };
      });
    },
    'ecoute-sens'() {
      return eviter('es', () => {
        const a = rnd(55, 76), ecart = pick([1, 2, 3, 4, 5, 7, 9, 12]), up = Math.random() < 0.5, b = up ? a + ecart : a - ecart;
        return { cle: [a, b], q: { comp: 'oreille', consigne: 'Écoute deux notes. La deuxième est…', mode: 'choix', choix: [{ l: 'plus aiguë', v: 'haut' }, { l: 'plus grave', v: 'bas' }], bonne: up ? 'haut' : 'bas', son: [a, b], sonSuite: true, auto: true,
          expl: 'La 2e note est <b>' + (up ? 'plus aiguë' : 'plus grave') + '</b> : plus la fréquence est élevée, plus le son est aigu.' } };
      });
    },
    'qcm'(p) {
      const t = p.questions, i = (p._i = ((p._i == null ? -1 : p._i) + 1) % t.length), x = t[p.ordre ? p.ordre[i] : i];
      return { comp: x.comp || 'theorie', consigne: x.q, portee: x.portee || null, mode: 'choix', choix: x.choix.map((c, j) => ({ l: c, v: String(j) })), bonne: String(x.bonne), expl: x.expl || '', clavier: null, long: true };
    },
  };

  /* ---------- moteur d'une série ---------- */
  const IC_PLAY = '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>';
  function monter(el, cfg) {
    const n = cfg.n || 8;
    let i = 0, ok = 0, repondu = false, enCours = null; const hist = [];
    const gen = typeof cfg.gen === 'function' ? cfg.gen : GEN[cfg.gen];
    const params = cfg.params || {};
    if (cfg.gen === 'qcm' && params.questions) { params.ordre = melange(params.questions.map((_, j) => j)); params._i = -1; }
    const total = cfg.gen === 'qcm' ? Math.min(n, params.questions.length) : n;
    function question() {
      repondu = false;
      const q = enCours = gen(params);
      const pastilles = hist.map((h) => '<i class="' + (h ? 'ok' : 'non') + '"></i>').join('') + Array.from({ length: total - hist.length }, (_, j) => '<i class="' + (j === 0 ? 'on' : '') + '"></i>').join('');
      let h = '<div class="exo"><div class="ent"><span>' + esc(cfg.titre || 'Exercice') + '</span><span>' + (i + 1) + ' / ' + total + '</span></div><div class="pastilles">' + pastilles + '</div>';
      h += '<div class="q">' + q.consigne + '</div>';
      if (q.portee) h += '<div class="fig-q">' + P.rendre(Object.assign({ echelle: 1 }, q.portee)) + '</div>';
      if (q.son) h += '<div style="text-align:center;margin:6px 0"><button class="btn petit" data-act="ecouter">' + (q.sonSuite ? '▶ Écouter' : '♪ Écouter la note') + '</button></div>';
      h += '<div class="zone"></div><div class="retour cache"></div><div class="suite cache"><button class="btn plein" data-act="suite">' + (i + 1 >= total ? 'Voir mon score' : 'Suivant') + '</button></div></div>';
      el.innerHTML = h;
      const zone = el.querySelector('.zone');
      if (q.mode === 'choix') {
        zone.innerHTML = '<div class="choix' + (q.long ? ' col' : '') + '">' + q.choix.map((c, j) => '<button data-v="' + esc(c.v) + '">' + (q.long ? esc(c.l) : esc(c.l)) + '</button>').join('') + '</div>';
        zone.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => repondre(b.getAttribute('data-v'), b)));
      } else {
        el._clav = racine.Clavier.creer(zone, { de: q.clavier.de, a: q.clavier.a, noms: q.clavier.noms, surClic: (m) => { if (!repondu) repondre(m); } });
      }
      const bE = el.querySelector('[data-act=ecouter]');
      if (bE) bE.addEventListener('click', () => ecouter(q));
      el.querySelector('[data-act=suite]').addEventListener('click', suite);
      if (q.auto) setTimeout(() => ecouter(q), 250);
    }
    function ecouter(q) {
      if (!q.son) return;
      if (q.sonSuite || q.son.length > 1) { racine.Son.note(q.son[0], 0.9, 0.85); setTimeout(() => racine.Son.note(q.son[1], 1.1, 0.85), 850); }
      else racine.Son.note(q.son[0], 1.3, 0.85);
    }
    function repondre(v, bouton) {
      if (repondu) return; repondu = true;
      const q = enCours;
      const bon = q.mode === 'choix' ? String(v) === String(q.bonne) : v === q.bonne;
      if (bon) ok++;
      hist.push(bon);
      S() && S().exo(q.comp, bon);
      if (q.mode === 'choix') {
        el.querySelectorAll('.choix button').forEach((b) => { if (b.getAttribute('data-v') === String(q.bonne)) b.classList.add('ok'); else if (b === bouton) b.classList.add('non'); });
      } else {
        const map = {}; map[q.bonne] = 'ok'; if (!bon) map[v] = 'non';
        el._clav.marquer(map);
      }
      const r = el.querySelector('.retour');
      r.className = 'retour ' + (bon ? 'ok' : 'non');
      r.innerHTML = '<b>' + (bon ? 'Juste.' : 'Pas tout à fait.') + '</b> ' + (q.expl || '');
      el.querySelector('.suite').classList.remove('cache');
      if (q.son && q.mode === 'choix' && !q.sonSuite && !bon) ecouter(q);
    }
    function suite() {
      i++;
      if (i >= total) return fin();
      question();
    }
    function fin() {
      const pct = Math.round((ok / total) * 100);
      el.innerHTML = '<div class="exo"><div class="ent"><span>' + esc(cfg.titre || 'Exercice') + '</span><span>terminé</span></div><div class="score"><b>' + ok + ' / ' + total + '</b><span class="sous">' + (pct >= 85 ? 'Très bien : c’est acquis.' : pct >= 60 ? 'Correct. Refais une série pour t’installer dans la lecture.' : 'Relis la leçon, puis recommence : c’est normal au début.') + '</span></div><div class="ligne-btn" style="justify-content:center"><button class="btn" data-act="rejouer">Recommencer</button></div></div>';
      el.querySelector('[data-act=rejouer]').addEventListener('click', () => { i = 0; ok = 0; hist.length = 0; if (cfg.gen === 'qcm') params._i = -1; question(); });
      cfg.onFin && cfg.onFin({ ok, total, pct });
    }
    question();
  }

  /* ---------- rythme à taper ---------- */
  function monterRythme(el, cfg) {
    const mes = cfg.mes || '4/4', bpm = cfg.bpm || 80;
    const spec = { clef: cfg.clef || 'sol', mes, s: cfg.s, arm: 0 };
    const evts = P.evenements(spec);
    const attaques = evts.filter((e) => e.midis.length && !e.fusionnee);
    // les notes liées n'attaquent qu'une fois : evenements() les a déjà fusionnées
    const [num, den] = mes.split('/').map(Number);
    const tickTemps = den === 8 && num % 3 === 0 && num > 3 ? 36 : 96 / den;
    const temps = (t) => (t / 24) * 60 / bpm;                 // ticks → secondes
    const nbTemps = Math.max(1, Math.round((num * 96 / den) / tickTemps));
    const fin = Math.max(...evts.map((e) => e.t + e.d));
    let etat = 'repos', taps = [], t0perf = 0, tFin = null;
    function dessiner(marques) {
      let sp = P.rendre(spec);
      el.innerHTML = '<div class="exo"><div class="ent"><span>' + esc(cfg.titre || 'Rythme') + '</span><span>' + bpm + ' à la noire</span></div><div class="q">' + (cfg.consigne || 'Tape chaque note au bon moment, en suivant le métronome.') + '</div><div class="fig-q">' + sp + '</div>' +
        '<div class="ligne-btn" style="justify-content:center"><button class="btn petit" data-act="ecouter">▶ Écouter le rythme</button><button class="btn petit plein" data-act="go">Commencer (' + nbTemps + ' temps pour se placer)</button></div><button class="tap" data-act="tap">Tape ici</button><div class="retour cache"></div></div>';
      el.querySelector('[data-act=ecouter]').addEventListener('click', ecouter);
      el.querySelector('[data-act=go]').addEventListener('click', commencer);
      const tap = el.querySelector('[data-act=tap]');
      tap.addEventListener('pointerdown', (e) => { e.preventDefault(); if (etat === 'jeu') { taps.push(performance.now() - t0perf); racine.Son.note(76, 0.15, 0.6); } });
    }
    function ecouter() {
      racine.Son.init();
      const t0 = racine.Son.maintenant() + 0.1;
      for (let k = 0; k < Math.ceil(fin / tickTemps); k++) racine.Son.clic(k % nbTemps === 0, t0 + temps(k * tickTemps));
      attaques.forEach((e) => racine.Son.note(76, 0.2, 0.7, t0 + temps(e.t)));
    }
    function commencer() {
      if (etat !== 'repos') return;
      racine.Son.init();
      etat = 'jeu'; taps = [];
      const lat = (S() && S().reglages.latence) || 0;
      const dec = 0.15;
      const cs = racine.Son.maintenant() + dec;
      const comptes = nbTemps;
      for (let k = 0; k < comptes + Math.ceil(fin / tickTemps); k++) racine.Son.clic(k % nbTemps === 0, cs + temps(k * tickTemps));
      const decalage = temps(comptes * tickTemps);
      t0perf = performance.now() + dec * 1000 + decalage * 1000 - lat;
      el.querySelector('[data-act=go]').disabled = true;
      const dureeTot = (dec + decalage + temps(fin)) * 1000 + 500;
      setTimeout(evaluer, dureeTot);
    }
    function evaluer() {
      etat = 'repos';
      let tol = 0.22 * (60 / bpm) * 1000 + 40;                  // tolérance : un peu plus d'un cinquième de temps
      const ts = attaques.map((e) => temps(e.t) * 1000).sort((x, y) => x - y); let gmin = 1e9; for (let k = 1; k < ts.length; k++) gmin = Math.min(gmin, ts[k] - ts[k - 1]);
      if (gmin < 1e9) tol = Math.min(tol, gmin * 0.45);          // jamais plus de la moitié du plus petit écart
      const attendus = attaques.map((e) => ({ e, t: temps(e.t) * 1000, pris: false }));
      let bons = 0, ecarts = [];
      const utilises = new Set();
      attendus.forEach((a) => {
        let mi = -1, md = 1e9;
        taps.forEach((x, j) => { if (!utilises.has(j) && Math.abs(x - a.t) < md) { md = Math.abs(x - a.t); mi = j; } });
        if (mi >= 0 && md <= tol) { utilises.add(mi); a.pris = true; bons++; ecarts.push(taps[mi] - a.t); }
      });
      const en_trop = taps.length - utilises.size;
      const marques = {};
      attendus.forEach((a) => { marques[a.e.idx] = a.pris ? 'ok' : 'non'; });
      dessiner();
      Object.entries(marques).forEach(([idx, c]) => { const g = el.querySelector('.ev[data-i="' + idx + '"]'); if (g) g.classList.add(c); });
      const moy = ecarts.length ? Math.round(ecarts.reduce((a, b) => a + b, 0) / ecarts.length) : 0;
      const r = el.querySelector('.retour'); r.classList.remove('cache');
      const bon = bons === attendus.length && en_trop === 0;
      r.className = 'retour ' + (bon ? 'ok' : 'non');
      r.innerHTML = '<b>' + (bon ? 'Rythme juste.' : bons + ' note' + (bons > 1 ? 's' : '') + ' sur ' + attendus.length + ' bien placée' + (bons > 1 ? 's' : '') + '.') + '</b> ' + (en_trop ? en_trop + ' tape' + (en_trop > 1 ? 's' : '') + ' en trop. ' : '') + (ecarts.length ? (Math.abs(moy) < 30 ? 'Très régulier.' : moy > 0 ? 'Tu as tendance à taper un peu en retard (' + moy + ' ms).' : 'Tu as tendance à taper en avance (' + (-moy) + ' ms).') : '') + ' Les notes en vert sont justes, en rouge manquées.';
      S() && S().exo('rythme', bon);
      cfg.onFin && cfg.onFin({ ok: bons, total: attendus.length, pct: Math.round(bons / Math.max(1, attendus.length) * 100), bon });
    }
    dessiner();
  }

  racine.Exo = { monter, monterRythme, GEN, rnd, pick, melange };
})(typeof self !== 'undefined' ? self : this);
