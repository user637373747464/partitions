/* exo-theorie.js — les exercices des volumes 2 à 5 : intervalles, gammes, armures, accords, degrés, cadences, modes, mesures, transposition, oreille.
   S'ajoute aux générateurs de exo.js ; les notes et les noms sont calculés par theorie.js. */
(function (racine) {
  'use strict';
  const T = racine.Theorie, P = racine.Portee, E = racine.Exo, GEN = E.GEN;
  const { rnd, pick, melange } = E;
  const N = T.N, nom = T.nomFr, Maj = T.Maj;
  const dernier = {};
  const eviter = (cle, gen) => { let x, k = 0; do { x = gen(); k++; } while (x === null || (dernier[cle] === JSON.stringify(x.cle) && k < 12)); dernier[cle] = JSON.stringify(x.cle); return x.q; };
  const choix = (liste) => liste.map((x) => (typeof x === 'string' ? { l: x, v: x } : x));
  const long_ = (liste) => Math.max(...liste.map((x) => String(x).length)) > 17;
  const ordinal = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const degreFr = (d) => (d === 1 ? '1er' : d + 'e');
  const SEMIS_TXT = { '2m': 1, '2M': 2, '3m': 3, '3M': 4, '4J': 5, '4A': 6, '5d': 6, '5J': 7, '5A': 8, '6m': 8, '6M': 9, '7m': 10, '7M': 11, '8J': 12 };
  const RAPPEL_INT = 'Repères : seconde 1 ou 2 demi-tons · tierce 3 ou 4 · quarte juste 5 · quinte juste 7 · sixte 8 ou 9 · septième 10 ou 11 · octave 12.';
  const midiAleat = (lo, hi) => rnd(lo, hi);

  /* ----- notes au hasard avec une altération possible ----- */
  function baseAleat(o) {
    o = o || {};
    const l = rnd(0, 6), r = Math.random(), a = o.alt ? (r < 0.6 ? 0 : r < 0.8 ? 1 : -1) : 0;
    return N(l, a, o.oct || 4);
  }
  function qualitesDe(num, filtre) {
    const base = [2, 3, 6, 7].includes(num) ? ['M', 'm', 'A', 'd'] : ['J', 'A', 'd'];
    const f = base.filter((q) => !filtre || filtre.includes(q));
    return f.length ? f : base.slice(0, 1);
  }
  function listeChoixInterv(num, q, p) {
    const meme = qualitesDe(num, p.quals).map((x) => [num, x]);
    if (!meme.some(([n2, q2]) => n2 === num && q2 === q)) meme.push([num, q]);
    const voisins = [];
    (p.nums || [2, 3, 4, 5, 6, 7, 8]).forEach((n2) => { if (n2 !== num) qualitesDe(n2, p.quals).slice(0, 2).forEach((q2) => voisins.push([n2, q2])); });
    let liste = meme.slice();
    melange(voisins).slice(0, Math.max(0, 5 - liste.length)).forEach((v) => liste.push(v));
    liste.sort((a, b) => a[0] - b[0] || T.semisDe(a[0], a[1]) - T.semisDe(b[0], b[1]));
    return liste.map(([n2, q2]) => T.nomInterv(n2, q2));
  }

  /* ---------- intervalles qualifiés (lecture) ---------- */
  GEN['interv-q'] = function (p) {
    return eviter('iq', () => {
      const nums = p.nums || [2, 3, 4, 5, 6, 7, 8];
      const num = pick(nums), q = pick(qualitesDe(num, p.quals));
      const a = baseAleat({ alt: p.alt !== false });
      const b = T.monter(a, num, q);
      if (Math.abs(b.a) > 1 || T.midi(b) > 84 || T.midi(a) < 58) return null;
      const desc = Math.random() < (p.desc || 0), harm = Math.random() < (p.harm || 0);
      const bas = a, haut = b;
      const ech = T.Ecr(0);
      const s = harm ? T.acc([bas, haut], 'h') : (desc ? T.sc([haut, bas], 'q') : T.sc([bas, haut], 'q'));
      const bonne = T.nomInterv(num, q), ch = listeChoixInterv(num, q, p);
      const semis = T.semisDe(num, q);
      return { cle: [T.str(a), num, q, desc, harm], q: { comp: 'intervalles-q', consigne: 'Quel est cet intervalle ?', portee: { clef: 'sol', s }, mode: 'choix', choix: choix(ch), bonne, long: long_(ch), son: [T.midi(bas), T.midi(haut)], seq: harm ? [[T.midi(bas), T.midi(haut)]] : (desc ? [[T.midi(haut)], [T.midi(bas)]] : [[T.midi(bas)], [T.midi(haut)]]), sonSuite: true,
        expl: 'De ' + nom(bas) + ' à ' + nom(haut) + ' : on compte ' + num + ' lettres (' + Array.from({ length: num }, (_, i) => T.NOMS[(a.l + i) % 7]).join(', ') + ') → une <b>' + T.NUM_FR[num] + '</b>. Elle contient ' + semis + ' demi-ton' + (semis > 1 ? 's' : '') + ' : c’est une <b>' + bonne + '</b>.<br><span class="sous">' + RAPPEL_INT + '</span>' } };
    });
  };

  /* ---------- intervalles : trouver la note au clavier ---------- */
  GEN['interv-touche'] = function (p) {
    return eviter('it', () => {
      const nums = p.nums || [2, 3, 4, 5, 6, 7, 8];
      const num = pick(nums), q = pick(qualitesDe(num, p.quals));
      const dessous = Math.random() < (p.desc || 0);
      const a = baseAleat({ alt: p.alt !== false, oct: dessous ? 5 : 4 });
      const b = dessous ? T.descendre(a, num, q) : T.monter(a, num, q);
      if (Math.abs(b.a) > 1 || T.midi(b) > 83 || T.midi(b) < 60 || T.midi(a) < 60 || T.midi(a) > 83) return null;
      const nomI = T.nomInterv(num, q);
      return { cle: [T.str(a), num, q, dessous], q: { comp: 'intervalles-q', consigne: 'Touche la note située une <b>' + nomI + '</b> ' + (dessous ? 'au-dessous' : 'au-dessus') + ' de <b>' + nom(a, true) + '</b>.', portee: { clef: 'sol', s: T.sc([a], 'q') }, mode: 'touche', bonne: T.midi(b), clavier: { de: 60, a: 84, noms: 'do' }, son: [T.midi(a)],
        expl: 'On ' + (dessous ? 'descend' : 'monte') + ' de ' + num + ' lettres à partir de ' + T.NOMS[a.l] + ' → la note s’appelle <b>' + nom(b) + '</b> ; ' + nomI + ' = ' + T.semisDe(num, q) + ' demi-tons. <span class="sous">' + RAPPEL_INT + '</span>' } };
    });
  };

  /* ---------- intervalles : à l'oreille ---------- */
  GEN['interv-ecoute'] = function (p) {
    return eviter('ie', () => {
      const liste = p.liste || [[2, 'm'], [2, 'M'], [3, 'm'], [3, 'M'], [4, 'J'], [5, 'J'], [8, 'J']];
      const [num, q] = pick(liste), semis = T.semisDe(num, q);
      const harm = Math.random() < (p.harm || 0), desc = !harm && Math.random() < (p.desc || 0);
      const m1 = rnd(55, 72), m2 = m1 + semis;
      const noms = liste.map(([n2, q2]) => T.nomInterv(n2, q2));
      const seq = harm ? [[m1, m2]] : (desc ? [[m2], [m1]] : [[m1], [m2]]);
      return { cle: [num, q, m1, harm, desc], q: { comp: 'oreille-int', consigne: 'Écoute cet intervalle (' + (harm ? 'deux notes ensemble' : desc ? 'deux notes, en descendant' : 'deux notes, en montant') + '). Lequel est-ce ?', mode: 'choix', choix: choix(noms), bonne: T.nomInterv(num, q), long: long_(noms), son: [m1, m2], seq, sonSuite: true, auto: true,
        expl: 'C’était une <b>' + T.nomInterv(num, q) + '</b> (' + semis + ' demi-ton' + (semis > 1 ? 's' : '') + '). Astuce : associe chaque intervalle à une mélodie que tu connais.' } };
    });
  };

  /* ---------- gammes ---------- */
  const TYPE_NOM = { maj: 'majeure', min: 'mineure naturelle', harm: 'mineure harmonique', mel: 'mineure mélodique' };
  function tonique(mode, max) {
    const m = max == null ? 7 : max;
    return T.tonDe(rnd(-m, m), mode === 'maj' ? 'maj' : 'min', 4);
  }
  function autresNotes(n, k) {
    const cand = [];
    [0, 1, -1].forEach((dl) => [0, 1, -1].forEach((da) => {
      const l = (n.l + dl + 7) % 7, a = (dl === 0 ? n.a + da : da);
      if (Math.abs(a) > 1 || (dl === 0 && da === 0)) return;
      if (l === n.l && a === n.a) return;
      cand.push(nom({ l, a, o: 4 }));
    }));
    return melange([...new Set(cand)].filter((x) => x !== nom(n))).slice(0, k);
  }
  GEN['gamme-degre'] = function (p) {
    return eviter('gd', () => {
      const types = p.types || ['maj'], type = pick(types);
      const t = tonique(type === 'maj' ? 'maj' : 'min', p.max);
      const g = T.gamme(t, type), deg = pick(p.degres || [2, 3, 4, 5, 6, 7]);
      const bonne = nom(g[deg - 1]);
      const ch = melange([bonne].concat(autresNotes(g[deg - 1], 3)));
      return { cle: [T.str(t), type, deg], q: { comp: 'gammes', consigne: 'Dans la gamme de <b>' + Maj(t) + ' ' + TYPE_NOM[type] + '</b>, quelle est la note du <b>' + degreFr(deg) + ' degré</b> ?', mode: 'choix', choix: choix(ch), bonne,
        expl: 'La gamme de ' + Maj(t) + ' ' + TYPE_NOM[type] + ' : <b>' + g.slice(0, 7).map((n) => nom(n)).join(' – ') + '</b>. Le ' + degreFr(deg) + ' degré est <b>' + bonne + '</b>.' } };
    });
  };
  GEN['gamme-reco'] = function (p) {
    return eviter('gr', () => {
      const types = p.types || ['maj', 'min'], type = pick(types);
      const t = tonique(type === 'maj' ? 'maj' : 'min', p.max);
      const g = T.gamme(t, type);
      if (g.some((n) => Math.abs(n.a) > 1)) return null;
      const bonne = Maj(t) + ' ' + TYPE_NOM[type];
      const autres = [];
      types.forEach((ty) => { if (ty !== type) autres.push(Maj(t) + ' ' + TYPE_NOM[ty]); });
      const voisine = T.tonDe(rnd(-(p.max == null ? 5 : p.max), p.max == null ? 5 : p.max), type === 'maj' ? 'maj' : 'min', 4);
      if (T.nomFr(voisine) !== T.nomFr(t)) autres.push(Maj(voisine) + ' ' + TYPE_NOM[type]);
      const rel = T.relative(t, type === 'maj' ? 'maj' : 'min');
      autres.push(Maj(rel) + ' ' + TYPE_NOM[type === 'maj' ? 'min' : 'maj']);
      const ch = melange([bonne].concat(melange([...new Set(autres)].filter((x) => x !== bonne)).slice(0, 3)));
      return { cle: [T.str(t), type], q: { comp: 'gammes', consigne: 'Quelle est cette gamme ? <span class="sous">(écoute-la aussi)</span>', portee: { clef: 'sol', s: T.gammeScore(t, type, { d: 'q' }), mes: null }, mode: 'choix', choix: choix(ch), bonne, long: true, son: g.map(T.midi), seq: g.map((n) => [T.midi(n)]), pas: 380, sonSuite: true,
        expl: 'Elle commence et finit sur <b>' + nom(t) + '</b>. Écart entre les degrés : ' + T.FORMULES[type].map((x) => (x === 1 ? '½' : x === 2 ? '1' : '1½')).join(' – ') + ' (en tons) : c’est la gamme <b>' + bonne + '</b>.' } };
    });
  };
  GEN['gamme-ecoute'] = function (p) {
    return eviter('ge', () => {
      const types = p.types || ['maj', 'min'], type = pick(types);
      const t = N(rnd(0, 6), 0, 4), g = T.gamme(t, type);
      const noms = types.map((x) => 'gamme ' + TYPE_NOM[x]);
      return { cle: [T.str(t), type], q: { comp: 'oreille-gam', consigne: 'Écoute cette gamme. Est-elle…', mode: 'choix', choix: choix(noms), bonne: 'gamme ' + TYPE_NOM[type], long: true, son: g.map(T.midi), seq: g.map((n) => [T.midi(n)]), pas: 420, sonSuite: true, auto: true,
        expl: 'C’était une <b>gamme ' + TYPE_NOM[type] + '</b>.' + (type === 'maj' ? ' Elle sonne « claire » : la tierce est majeure et la sensible monte vers la tonique.' : type === 'min' ? ' Elle sonne « sombre » : la tierce est mineure.' : type === 'harm' ? ' On entend un grand saut entre le 6e et le 7e degré (1½ ton).' : ' À la montée, 6e et 7e degrés sont relevés.') } };
    });
  };

  /* ---------- armures, relatives, cercle ---------- */
  function nbTxt(n) { return n === 0 ? 'aucune altération' : Math.abs(n) + (n > 0 ? ' dièse' : ' bémol') + (Math.abs(n) > 1 ? 's' : ''); }
  GEN['armure-combien'] = function (p) {
    return eviter('ac', () => {
      const mode = p.mode === 'les-deux' ? pick(['maj', 'min']) : (p.mode || 'maj'), max = p.max == null ? 7 : p.max;
      const n = rnd(-max, max), t = T.tonDe(n, mode, 4);
      const bonne = nbTxt(n), ch = [bonne];
      while (ch.length < 4) { const x = nbTxt(Math.max(-7, Math.min(7, n + pick([-2, -1, 1, 2, -3, 3])))); if (!ch.includes(x)) ch.push(x); }
      return { cle: [n, mode], q: { comp: 'armures', consigne: 'Combien d’altérations à l’armure de <b>' + Maj(t) + (mode === 'min' ? ' mineur' : ' majeur') + '</b> ?', mode: 'choix', choix: choix(melange(ch)), bonne,
        expl: Maj(t) + (mode === 'min' ? ' mineur' : ' majeur') + ' : <b>' + bonne + '</b>' + (n !== 0 ? ' (' + T.alterationsArmure(n).join(', ') + ').' : '.') } };
    });
  };
  GEN['armure-notes'] = function (p) {
    return eviter('an2', () => {
      const mode = p.mode === 'les-deux' ? pick(['maj', 'min']) : (p.mode || 'maj'), max = p.max == null ? 7 : p.max;
      const n = rnd(1, max) * (Math.random() < 0.5 ? 1 : -1), t = T.tonDe(n, mode, 4);
      const lst = (k) => T.alterationsArmure(k).map((x) => x.replace(/^./, (c) => T.NOMS[T.LET.indexOf(c)])).join(' – ');
      const bonne = lst(n), ch = [bonne];
      [n + (n > 0 ? 1 : -1), n - (n > 0 ? 1 : -1), -n].forEach((k) => { if (k !== 0 && Math.abs(k) <= 7) { const x = lst(k); if (!ch.includes(x)) ch.push(x); } });
      while (ch.length < 4) { const x = lst(pick([-4, -3, -2, -1, 1, 2, 3, 4])); if (!ch.includes(x)) ch.push(x); }
      return { cle: [n, mode], q: { comp: 'armures', consigne: 'Quelles notes sont altérées dans <b>' + Maj(t) + (mode === 'min' ? ' mineur' : ' majeur') + '</b> ?', mode: 'choix', choix: choix(melange([bonne].concat(melange(ch.filter((x) => x !== bonne)).slice(0, 3)))), bonne, long: true,
        expl: 'Armure de ' + Maj(t) + (mode === 'min' ? ' mineur' : ' majeur') + ' : ' + nbTxt(n) + ' → <b>' + bonne + '</b>. Dièses : fa do sol ré la mi si ; bémols : si mi la ré sol do fa.' } };
    });
  };
  GEN['relative'] = function (p) {
    return eviter('rl', () => {
      const mode = p.mode === 'les-deux' ? pick(['maj', 'min']) : (p.mode || 'maj'), max = p.max == null ? 7 : p.max;
      const n = rnd(-max, max), t = T.tonDe(n, mode, 4), r = T.relative(t, mode);
      const cible = mode === 'maj' ? 'mineur' : 'majeur';
      const bonne = Maj(r) + ' ' + cible, ch = [bonne];
      const autreN = Math.max(-7, Math.min(7, n + pick([-1, 1, 2, -2, 3])));
      [Maj(t) + ' ' + cible, Maj(T.tonDe(autreN, mode === 'maj' ? 'min' : 'maj', 4)) + ' ' + cible, Maj(T.monter(t, 3, 'M')) + ' ' + cible, Maj(T.descendre(t, 2, 'M')) + ' ' + cible].forEach((x) => { if (!ch.includes(x) && ch.length < 4) ch.push(x); });
      let g = 0; while (ch.length < 4 && g++ < 20) { const x = Maj(T.tonDe(rnd(-6, 6), mode === 'maj' ? 'min' : 'maj', 4)) + ' ' + cible; if (!ch.includes(x)) ch.push(x); }
      return { cle: [n, mode], q: { comp: 'relatives', consigne: 'Quelle est la relative ' + (mode === 'maj' ? 'mineure' : 'majeure') + ' de <b>' + Maj(t) + (mode === 'maj' ? ' majeur' : ' mineur') + '</b> ?', mode: 'choix', choix: choix(melange(ch)), bonne,
        expl: 'Les relatives partagent la même armure. De ' + nom(t) + ' ' + (mode === 'maj' ? 'majeur, on descend d’une tierce mineure (3 demi-tons)' : 'mineur, on monte d’une tierce mineure (3 demi-tons)') + ' → <b>' + bonne + '</b>.' } };
    });
  };
  GEN['cercle'] = function (p) {
    return eviter('ce', () => {
      const sens = pick(p.sens || ['haut', 'bas']), max = p.max == null ? 5 : p.max;
      const n = rnd(-max, max); if (sens === 'haut' && n >= 7) return null; if (sens === 'bas' && n <= -7) return null;
      const t = T.tonDe(n, 'maj', 4), r = T.tonDe(n + (sens === 'haut' ? 1 : -1), 'maj', 4);
      const bonne = Maj(r) + ' majeur', ch = [bonne];
      [n + (sens === 'haut' ? -1 : 1), n + (sens === 'haut' ? 2 : -2), n + (sens === 'haut' ? 3 : -3), n + 4].forEach((k) => { if (Math.abs(k) <= 7 && k !== n + (sens === 'haut' ? 1 : -1) && ch.length < 4) { const x = Maj(T.tonDe(k, 'maj', 4)) + ' majeur'; if (!ch.includes(x)) ch.push(x); } });
      return { cle: [n, sens], q: { comp: 'cercle', consigne: sens === 'haut' ? 'Une quinte <b>au-dessus</b> de <b>' + Maj(t) + ' majeur</b>, quelle est la tonalité voisine (un dièse de plus) ?' : 'Une quinte <b>au-dessous</b> de <b>' + Maj(t) + ' majeur</b>, quelle est la tonalité voisine (un bémol de plus) ?', mode: 'choix', choix: choix(melange(ch)), bonne,
        expl: (sens === 'haut' ? 'On monte de 5 notes (' + Array.from({ length: 5 }, (_, i) => T.NOMS[(t.l + i) % 7]).join(', ') + ') : ' : 'On descend de 5 notes : ') + '<b>' + bonne + '</b>, qui a ' + nbTxt(n + (sens === 'haut' ? 1 : -1)) + '.' } };
    });
  };

  /* ---------- accords ---------- */
  const TRIADES = ['M', 'm', 'dim', 'aug'];
  const SEPT = ['7', 'maj7', 'm7', 'm7b5', 'dim7'];
  function racineAleat(p) { return baseAleat({ alt: p && p.alt !== false }); }
  GEN['accord-type'] = function (p) {
    return eviter('at', () => {
      const types = p.types || TRIADES, ty = pick(types), r = racineAleat(p);
      const notes = T.accord(r, ty);
      if (notes.some((n) => Math.abs(n.a) > 1 && !p.doubles) || T.midi(notes[notes.length - 1]) > 86) return null;
      const bonne = T.ACCORD_NOMS[ty], noms = types.map((x) => T.ACCORD_NOMS[x]);
      return { cle: [T.str(r), ty], q: { comp: 'accords', consigne: 'Cet accord a pour fondamentale <b>' + nom(r) + '</b>. Quelle est sa nature ?', portee: { clef: 'sol', s: T.acc(notes, 'h') }, mode: 'choix', choix: choix(noms), bonne, long: long_(noms), son: notes.map(T.midi), seq: [notes.map(T.midi)], sonSuite: true,
        expl: 'Depuis ' + nom(r) + ' : ' + T.ACCORDS[ty].map(([num, q]) => T.nomInterv(num, q)).join(', ') + ' → accord <b>' + bonne + '</b> (' + T.symboleAccord(r, ty) + ').' } };
    });
  };
  GEN['accord-ecoute'] = function (p) {
    return eviter('ae', () => {
      const types = p.types || ['M', 'm'], ty = pick(types), base = rnd(52, 64);
      const r = N(0, 0, 4); const midis = [0].concat(T.ACCORDS[ty].map(([num, q]) => T.semisDe(num, q))).map((x) => base + x);
      const noms = types.map((x) => T.ACCORD_NOMS[x]);
      return { cle: [ty, base], q: { comp: 'oreille-acc', consigne: 'Écoute cet accord (d’abord note par note, puis ensemble). Il est…', mode: 'choix', choix: choix(noms), bonne: T.ACCORD_NOMS[ty], long: long_(noms), son: midis, seq: midis.map((m) => [m]).concat([midis]), pas: 520, sonSuite: true, auto: true,
        expl: 'C’était un accord <b>' + T.ACCORD_NOMS[ty] + '</b>' + ({ M: ' : sonorité franche, joyeuse.', m: ' : sonorité plus sombre.', dim: ' : sonorité tendue, instable.', aug: ' : sonorité étrange, suspendue.', '7': ' : sonorité qui « demande » une suite.', maj7: ' : sonorité douce, rêveuse.', m7: ' : sonorité mineure, veloutée.', m7b5: ' : sonorité sombre et tendue.', dim7: ' : sonorité très tendue, symétrique.' }[ty] || '.') } };
    });
  };
  GEN['accord-epeler'] = function (p) {
    return eviter('ap', () => {
      const types = p.types || TRIADES, ty = pick(types), r = racineAleat(p);
      const notes = T.accord(r, ty);
      if (notes.some((n) => Math.abs(n.a) > 1)) return null;
      const aff = (ns) => ns.map((n) => nom(n)).join(' – ');
      const bonne = aff(notes), ch = [bonne];
      types.concat(['M', 'm', 'dim']).forEach((t2) => { if (t2 === ty) return; const ns = T.accord(r, t2); if (ns.every((n) => Math.abs(n.a) <= 1)) { const x = aff(ns); if (!ch.includes(x) && ch.length < 4) ch.push(x); } });
      if (ch.length < 4) { const bad = notes.slice(); bad[1] = N((notes[1].l + 1) % 7, 0, 4); const x = aff(bad); if (!ch.includes(x)) ch.push(x); }
      return { cle: [T.str(r), ty], q: { comp: 'accords', consigne: 'Quelles sont les notes de l’accord de <b>' + T.nomAccord(r, ty) + '</b> ?', mode: 'choix', choix: choix(melange(ch)), bonne, long: true,
        expl: T.nomAccord(r, ty) + ' = ' + T.ACCORDS[ty].map(([num, q]) => T.nomInterv(num, q)).join(' + ') + ' au-dessus de la fondamentale : <b>' + bonne + '</b>.' } };
    });
  };
  const POS = ['position fondamentale', '1er renversement', '2e renversement', '3e renversement'];
  GEN['accord-renv'] = function (p) {
    return eviter('ar2', () => {
      const types = p.types || ['M', 'm'], ty = pick(types), r = racineAleat(p);
      const notes = T.accord(r, ty), k = rnd(0, notes.length - 1);
      if (notes.some((n) => Math.abs(n.a) > 1)) return null;
      const v = T.renverser(notes.map((n) => ({ l: n.l, a: n.a, o: 4 })), k);
      const basse = v[0];
      if (T.midi(v[v.length - 1]) > 88) return null;
      const bonne = POS[k], ch = POS.slice(0, notes.length);
      const rolesNom = ['la fondamentale', 'la tierce', 'la quinte', 'la septième'];
      return { cle: [T.str(r), ty, k], q: { comp: 'renversements', consigne: 'Dans quelle position est cet accord de <b>' + T.nomAccord(r, ty) + '</b> ?', portee: { clef: 'sol', s: T.acc(v, 'h') }, mode: 'choix', choix: choix(ch), bonne, long: true, son: v.map(T.midi), seq: [v.map(T.midi)], sonSuite: true,
        expl: 'La note la plus grave est <b>' + nom(basse) + '</b>, c’est ' + rolesNom[k] + ' de l’accord : <b>' + bonne + '</b>.' } };
    });
  };
  GEN['accord-degre'] = function (p) {
    return eviter('ad', () => {
      const mode = p.mode === 'les-deux' ? pick(['maj', 'min']) : (p.mode || 'maj'), max = p.max == null ? 3 : p.max;
      const n = rnd(-max, max), t = T.tonDe(n, mode, 4), sept = !!p.sept;
      const ac = T.accordsTonalite(t, mode, sept), degs = p.degres || [1, 2, 3, 4, 5, 6, 7];
      const d = pick(degs), a = ac[d - 1];
      const sens = pick(p.sens || ['accord', 'degre']);
      const tonTxt = Maj(t) + (mode === 'min' ? ' mineur' : ' majeur');
      const exp = 'Dans ' + tonTxt + ', les accords sont : ' + ac.map((x) => x.romain + ' ' + Maj(x.racine)).join(' · ') + '.';
      if (sens === 'accord') {
        const bonne = a.nom, ch = [bonne];
        ac.forEach((x) => { if (!ch.includes(x.nom)) ch.push(x.nom); });
        const final = [bonne].concat(melange(ch.filter((x) => x !== bonne)).slice(0, 3));
        return { cle: [n, mode, d, 'a'], q: { comp: 'degres', consigne: 'En <b>' + tonTxt + '</b>, quel est l’accord du <b>' + degreFr(d) + ' degré</b> (' + a.romain + ') ?', mode: 'choix', choix: choix(melange(final)), bonne, long: true, son: a.notes.map(T.midi), seq: [a.notes.map(T.midi)], sonSuite: true, expl: exp } };
      }
      const bonne = a.romain, ch = ac.map((x) => x.romain); const final = [bonne].concat(melange(ch.filter((x) => x !== bonne)).slice(0, 3));
      return { cle: [n, mode, d, 'r'], q: { comp: 'degres', consigne: 'En <b>' + tonTxt + '</b>, l’accord de <b>' + a.nom + '</b> est sur quel degré ?', mode: 'choix', choix: choix(melange(final)), bonne, long: false, son: a.notes.map(T.midi), seq: [a.notes.map(T.midi)], sonSuite: true, expl: exp } };
    });
  };
  const CADENCES = {
    parfaite: { nom: 'cadence parfaite', suites: [[1, 5, 1], [4, 5, 1], [2, 5, 1]], expl: 'V → I : la tension de la dominante se résout sur la tonique. C’est la « ponctuation finale ».' },
    plagale: { nom: 'cadence plagale', suites: [[1, 4, 1], [5, 4, 1]], expl: 'IV → I : fin douce, « amen » des chorals.' },
    demi: { nom: 'demi-cadence', suites: [[1, 4, 5], [1, 2, 5], [1, 5, 5]], expl: 'La phrase s’arrête sur V : c’est une virgule, on attend la suite.' },
    rompue: { nom: 'cadence rompue', suites: [[1, 5, 6], [4, 5, 6], [2, 5, 6]], expl: 'V → VI : on attendait I, la musique « dévie » sur le 6e degré.' },
  };
  GEN['cadence'] = function (p) {
    return eviter('cd', () => {
      const types = p.types || ['parfaite', 'plagale', 'demi'], ty = pick(types), c = CADENCES[ty];
      const mode = p.mode === 'les-deux' ? pick(['maj', 'min']) : (p.mode || 'maj'), max = p.max == null ? 3 : p.max;
      const t = T.tonDe(rnd(-max, max), mode, 4), suite = pick(c.suites);
      if (mode === 'min' && suite.includes(6) && false) return null;
      const pr = T.progression(t, mode, suite, { d: 'h' });
      const noms = types.map((x) => CADENCES[x].nom);
      return { cle: [T.str(t), ty, suite.join()], q: { comp: 'cadences', consigne: 'Voici les accords de la fin d’une phrase en <b>' + Maj(t) + (mode === 'min' ? ' mineur' : ' majeur') + '</b> (' + pr.romains.join(' – ') + '). Quelle cadence est-ce ?', portee: { clef: 'piano', haut: pr.haut, bas: pr.bas, arm: pr.arm }, mode: 'choix', choix: choix(noms), bonne: c.nom, long: long_(noms),
        son: [60], seq: pr.accords.map((a, i) => voicingMidis(pr, i)), pas: 900, sonSuite: true,
        expl: 'Enchaînement <b>' + pr.romains.join(' → ') + '</b> : <b>' + c.nom + '</b>. ' + c.expl } };
    });
  };
  // midi d'un accord de la progression (main droite + basse) pour l'écoute
  function voicingMidis(pr, i) {
    const hautToks = pr.haut.split(' '), basToks = pr.bas.split(' ');
    const rd = (tk) => tk.split(':')[0].split('+').map((h) => P.midi(h.replace(/^([a-g])n/, '$1')));
    const al = (tk) => tk;
    return rd(basToks[i]).concat(rd(hautToks[i]));
  }
  GEN['cadence-ecoute'] = function (p) {
    return eviter('cde', () => {
      const types = p.types || ['parfaite', 'plagale', 'demi', 'rompue'], ty = pick(types), c = CADENCES[ty];
      const t = T.tonDe(rnd(-2, 3), 'maj', 4), suite = pick(c.suites);
      const pr = T.progression(t, 'maj', suite, { d: 'h' });
      const noms = types.map((x) => CADENCES[x].nom);
      const seq = pr.accords.map((a, i) => voicingMidis(pr, i));
      return { cle: [T.str(t), ty, suite.join()], q: { comp: 'oreille-cad', consigne: 'Écoute la fin de cette phrase. Quelle cadence entends-tu ?', mode: 'choix', choix: choix(noms), bonne: c.nom, long: long_(noms), son: seq[0], seq, pas: 950, sonSuite: true, auto: true,
        expl: 'C’était <b>' + pr.romains.join(' → ') + '</b> : <b>' + c.nom + '</b>. ' + c.expl } };
    });
  };

  /* ---------- modes ---------- */
  const MODE_CARAC = { ionien: 'c’est la gamme majeure', dorien: 'mineur avec une 6te majeure', phrygien: 'mineur avec une 2de mineure', lydien: 'majeur avec une 4te augmentée', mixolydien: 'majeur avec une 7e mineure', eolien: 'c’est la gamme mineure naturelle', locrien: 'mineur avec une 2de mineure et une 5te diminuée' };
  GEN['mode-reco'] = function (p) {
    return eviter('mo', () => {
      const modes = p.modes || ['dorien', 'phrygien', 'lydien', 'mixolydien'], m = pick(modes);
      const t = N(rnd(0, 6), pick([0, 0, 0, 1, -1]), 4), g = T.gamme(t, m);
      if (g.some((n) => Math.abs(n.a) > 1)) return null;
      const noms = modes.map((x) => T.MODES_NOMS[x]);
      return { cle: [T.str(t), m], q: { comp: 'modes', consigne: 'Cette gamme commence sur <b>' + nom(t) + '</b>. De quel mode s’agit-il ?', portee: { clef: 'sol', s: T.gammeScore(t, m, { d: 'q' }) }, mode: 'choix', choix: choix(noms), bonne: T.MODES_NOMS[m], son: g.map(T.midi), seq: g.map((n) => [T.midi(n)]), pas: 380, sonSuite: true,
        expl: 'Comparé à la gamme majeure de ' + nom(t) + ', ce mode est : <b>' + MODE_CARAC[m] + '</b> → mode <b>' + T.MODES_NOMS[m] + '</b>.' } };
    });
  };
  GEN['mode-ecoute'] = function (p) {
    return eviter('moe', () => {
      const modes = p.modes || ['dorien', 'phrygien', 'lydien', 'mixolydien'], m = pick(modes), t = N(rnd(0, 6), 0, 4), g = T.gamme(t, m);
      const noms = modes.map((x) => T.MODES_NOMS[x]);
      return { cle: [T.str(t), m], q: { comp: 'modes', consigne: 'Écoute cette gamme. Quel mode est-ce ?', mode: 'choix', choix: choix(noms), bonne: T.MODES_NOMS[m], son: g.map(T.midi), seq: g.map((n) => [T.midi(n)]), pas: 420, sonSuite: true, auto: true,
        expl: 'C’était le mode <b>' + T.MODES_NOMS[m] + '</b> : ' + MODE_CARAC[m] + '.' } };
    });
  };

  /* ---------- mesures et rythme ---------- */
  const MES_NOMS = { '2/4': 'simple à 2 temps', '3/4': 'simple à 3 temps', '4/4': 'simple à 4 temps', '2/2': 'simple à 2 temps', '3/2': 'simple à 3 temps', '3/8': 'simple à 3 temps', '6/8': 'composée à 2 temps', '9/8': 'composée à 3 temps', '12/8': 'composée à 4 temps', '6/4': 'composée à 2 temps', '9/4': 'composée à 3 temps' };
  GEN['mesure-type'] = function (p) {
    return eviter('mt', () => {
      const mes = pick(p.mesures || ['2/4', '3/4', '4/4', '6/8', '9/8', '12/8']), bonne = MES_NOMS[mes];
      const ch = ['simple à 2 temps', 'simple à 3 temps', 'simple à 4 temps', 'composée à 2 temps', 'composée à 3 temps', 'composée à 4 temps'];
      const [a, b] = mes.split('/').map(Number);
      const unite = { 2: 'blanche', 4: 'noire', 8: 'croche' }[b];
      return { cle: [mes], q: { comp: 'mesures', consigne: 'Cette mesure est…', portee: { clef: 'sol', mes, s: '' }, mode: 'choix', choix: choix(ch), bonne, long: true,
        expl: mes + ' : ' + a + ' ' + unite + (a > 1 ? 's' : '') + ' par mesure. ' + (bonne.startsWith('composée') ? 'Le temps est une <b>' + (b === 8 ? 'noire pointée' : 'blanche pointée') + '</b> (divisible par 3) : mesure <b>' + bonne + '</b>.' : 'Le temps se divise en 2 : mesure <b>' + bonne + '</b>.') } };
    });
  };
  const fmtT = (x) => { const e = Math.floor(x), r = x - e; const f = r === 0.5 ? '½' : r === 0.25 ? '¼' : r === 0.75 ? '¾' : ''; return (e ? e + (f ? ' ' : '') : '') + f + ' temps'; };
  const VAL = { w: 96, h: 48, q: 24, e: 12, s: 6 };
  const NOM_VAL = { 96: 'ronde', 144: 'ronde pointée', 48: 'blanche', 72: 'blanche pointée', 24: 'noire', 36: 'noire pointée', 12: 'croche', 18: 'croche pointée', 6: 'double-croche' };
  const NOM_SIL = { 96: 'pause', 48: 'demi-pause', 72: 'demi-pause pointée', 24: 'soupir', 36: 'soupir pointé', 12: 'demi-soupir', 18: 'demi-soupir pointé', 6: 'quart de soupir' };
  const TOK_VAL = { 96: 'w', 144: 'w.', 48: 'h', 72: 'h.', 24: 'q', 36: 'q.', 12: 'e', 18: 'e.', 6: 's' };
  GEN['mesure-manque'] = function (p) {
    return eviter('mm', () => {
      const mes = pick(p.mesures || ['4/4', '3/4', '2/4']), [a, b] = mes.split('/').map(Number), tot = a * 96 / b;
      const dispo = (p.valeurs || [96, 48, 72, 24, 36, 12]).filter((x) => x <= tot);
      const manque = pick(dispo.filter((x) => x <= tot));
      const sil = !!p.silences && Math.random() < 0.5;
      let reste = tot - manque; const seq = [];
      let g = 0;
      while (reste > 0 && g++ < 40) { const ok = dispo.filter((x) => x <= reste && (reste - x === 0 || reste - x >= 12)); if (!ok.length) return null; const d = pick(ok); seq.push(d); reste -= d; }
      if (reste !== 0 || !seq.length) return null;
      const noms = sil ? NOM_SIL : NOM_VAL;
      const toks = seq.map((d) => 'b4:' + TOK_VAL[d]);
      const bonne = noms[manque], ch = dispo.map((x) => noms[x]).filter((x) => x);
      const chu = [...new Set(ch)];
      const aff = bonne ? chu : chu;
      return { cle: [mes, seq.join(), manque], q: { comp: 'mesures', consigne: 'À <b>' + mes + '</b>, ' + (sil ? 'quel silence' : 'quelle note') + ' complète cette mesure ?', portee: { clef: 'sol', mes, s: toks.join(' ') }, mode: 'choix', choix: choix(melange([bonne].concat(melange(aff.filter((x) => x !== bonne)).slice(0, 4)))), bonne, long: true,
        expl: 'Une mesure à ' + mes + ' vaut ' + fmtT(tot / 24) + ' (noire = 1). Les notes écrites en font ' + fmtT((tot - manque) / 24) + ' : il en manque ' + fmtT(manque / 24) + ' → <b>' + bonne + '</b>.' } };
    });
  };

  /* ---------- transposition ---------- */
  GEN['transpose'] = function (p) {
    return eviter('tr', () => {
      const max = p.max == null ? 4 : p.max, n1 = rnd(-max, max); let n2 = rnd(-max, max); if (n2 === n1) return null;
      const t1 = T.tonDe(n1, 'maj', 4), t2 = T.tonDe(n2, 'maj', 4), g1 = T.gamme(t1, 'maj'), g2 = T.gamme(t2, 'maj');
      const d = pick([2, 3, 4, 5, 6, 7]);
      const bonne = nom(g2[d - 1]), ch = [bonne].concat(autresNotes(g2[d - 1], 3));
      return { cle: [n1, n2, d], q: { comp: 'transposition', consigne: 'On transpose de <b>' + Maj(t1) + ' majeur</b> à <b>' + Maj(t2) + ' majeur</b>. La note <b>' + nom(g1[d - 1]) + '</b> (' + degreFr(d) + ' degré) devient…', mode: 'choix', choix: choix(melange(ch)), bonne,
        expl: 'On garde le <b>même degré</b> : le ' + degreFr(d) + ' degré de ' + Maj(t2) + ' majeur est <b>' + bonne + '</b>. (Gamme de ' + Maj(t2) + ' : ' + g2.slice(0, 7).map((n) => nom(n)).join(' ') + '.)' } };
    });
  };

  /* ---------- clé d'ut ---------- */
  const CLEF_UT = { bas: 24 };       // marche de la ligne du bas en clé d'ut 3e ligne (fa 3)
  GEN['note-nom-ut'] = function (p) {
    return eviter('nu', () => {
      const lo = 24 + (p.lo != null ? p.lo : -2), hi = 24 + (p.hi != null ? p.hi : 10);
      const st = rnd(lo, hi), l = ((st % 7) + 7) % 7, o = Math.floor(st / 7), n = N(l, 0, o);
      return { cle: [st], q: { comp: 'lecture-ut', consigne: 'Clé d’ut 3e ligne (clé d’alto). Quel est le nom de cette note ?', portee: { clef: 'ut', s: T.str(n) + ':q', etire: false }, mode: 'choix', choix: choix(T.NOMS.slice()), bonne: T.NOMS[l], son: [T.midi(n)],
        expl: 'La clé d’ut indique où se trouve le <b>do central</b> : ici, sur la <b>3e ligne</b>. À partir de là, on compte : la note est un <b>' + T.NOMS[l] + '</b>.' } };
    });
  };

  racine.ExoTheorie = { CADENCES, MES_NOMS };
})(typeof self !== 'undefined' ? self : this);
