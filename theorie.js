/* theorie.js — le moteur de théorie musicale : notes orthographiées, intervalles qualifiés, gammes, modes, accords, degrés, armures, transposition.
   Les leçons des volumes 2 à 5 et les exercices s'appuient dessus : les tableaux et les extraits de partition sont calculés, pas recopiés à la main.
   Une note = { l: 0..6 (do ré mi fa sol la si), a: altération (-2..2), o: octave scientifique (do central = do4) }. */
(function (racine) {
  'use strict';
  const LET = 'cdefgab';
  const BASE = [0, 2, 4, 5, 7, 9, 11];
  const NOMS = ['do', 'ré', 'mi', 'fa', 'sol', 'la', 'si'];
  const ALT_TXT = { '-2': '♭♭', '-1': '♭', '0': '', '1': '♯', '2': '♯♯' };
  const ALT_STR = { '-2': 'bb', '-1': 'b', '0': '', '1': '#', '2': '##' };
  const ALT_PARSE = { '#': 1, '##': 2, x: 2, b: -1, bb: -2, n: 0 };

  /* ---------- notes ---------- */
  function N(l, a, o) {                                    // crée une note en reportant les débordements de lettre sur l'octave
    const k = Math.floor(l / 7);
    return { l: l - 7 * k, a: a || 0, o: o + k };
  }
  function parse(t) {
    if (typeof t !== 'string') return t;
    const m = /^([a-g])(##|bb|#|b|n|x)?(-?\d)$/.exec(t);
    if (!m) throw new Error('note illisible : ' + t);
    return { l: LET.indexOf(m[1]), a: m[2] === undefined ? 0 : ALT_PARSE[m[2]], o: +m[3] };
  }
  const str = (n) => LET[n.l] + ALT_STR[n.a] + n.o;
  const midi = (n) => 12 * (n.o + 1) + BASE[n.l] + n.a;
  const pas = (n) => n.o * 7 + n.l;                        // « marche » sur la portée
  const nomFr = (n, avecOct) => NOMS[n.l] + ALT_TXT[n.a] + (avecOct ? ' ' + (n.o - 1) : '');   // octave à la française (do central = do 3)
  const Maj = (n) => nomFr(n).replace(/^./, (c) => c.toUpperCase());
  const lettreEn = (n) => LET[n.l].toUpperCase() + ({ '-2': '♭♭', '-1': '♭', '0': '', '1': '♯', '2': '𝄪' })[n.a];
  const egal = (x, y) => x.l === y.l && x.a === y.a && x.o === y.o;
  const sansOct = (n) => ({ l: n.l, a: n.a, o: 0 });
  const memeNom = (x, y) => x.l === y.l && x.a === y.a;
  const noteDe = (l, a, o) => N(l, a, o);

  /* ---------- intervalles ---------- */
  const MAJ_SEMIS = [0, 2, 4, 5, 7, 9, 11];                // 1re à 7e dans la gamme majeure
  const JUSTE_NUM = { 0: true, 3: true, 4: true };         // 1re, 4te, 5te (indices 0, 3, 4)
  function semisBase(num) { const k = num - 1; return 12 * Math.floor(k / 7) + MAJ_SEMIS[k % 7]; }
  const estJuste = (num) => JUSTE_NUM[(num - 1) % 7] === true;
  function semisDe(num, q) {                               // q : 'J' 'M' 'm' 'A' 'd' 'AA' 'dd'
    let s = semisBase(num);
    if (estJuste(num)) s += { J: 0, A: 1, d: -1, AA: 2, dd: -2 }[q];
    else s += { M: 0, m: -1, A: 1, d: -2, AA: 2, dd: -3 }[q];
    return s;
  }
  function qualiteDe(num, semis) {
    const d = semis - semisBase(num);
    if (estJuste(num)) return { 0: 'J', 1: 'A', '-1': 'd', 2: 'AA', '-2': 'dd' }[d] || null;
    return { 0: 'M', '-1': 'm', 1: 'A', '-2': 'd', 2: 'AA', '-3': 'dd' }[d] || null;
  }
  const NUM_FR = ['', 'unisson', 'seconde', 'tierce', 'quarte', 'quinte', 'sixte', 'septième', 'octave', 'neuvième', 'dixième', 'onzième', 'douzième', 'treizième'];
  const QUAL_FR = { J: 'juste', M: 'majeur', m: 'mineur', A: 'augmenté', d: 'diminué', AA: 'doublement augmenté', dd: 'doublement diminué' };
  const QUAL_F = { J: 'juste', M: 'majeure', m: 'mineure', A: 'augmentée', d: 'diminuée', AA: 'doublement augmentée', dd: 'doublement diminuée' };
  function nomInterv(num, q) {                             // « tierce majeure », « quinte juste »…
    if (num === 1) return q === 'J' ? 'unisson' : 'unisson ' + (q === 'A' ? 'augmenté' : q === 'd' ? 'diminué' : QUAL_FR[q]);
    return (NUM_FR[num] || (num + 'e')) + ' ' + QUAL_F[q];
  }
  const ABREV = { J: 'J', M: 'M', m: 'm', A: '+', d: '°', AA: '++', dd: '°°' };
  const abrevInterv = (num, q) => num + ABREV[q];
  function intervalle(a, b) {                              // de a vers b (b au-dessus de a)
    a = parse(a); b = parse(b);
    const num = pas(b) - pas(a) + 1, semis = midi(b) - midi(a);
    return { num, semis, q: qualiteDe(num, semis), nom: nomInterv(num, qualiteDe(num, semis)) };
  }
  function monter(n, num, q) {                             // la note située à l'intervalle (num, q) au-dessus de n
    n = parse(n);
    const cible = pas(n) + (num - 1), l = ((cible % 7) + 7) % 7, o = Math.floor(cible / 7);
    const m = midi(n) + semisDe(num, q);
    const a = m - (12 * (o + 1) + BASE[l]);
    return { l, a, o };
  }
  function descendre(n, num, q) {                          // la note située à l'intervalle (num, q) en dessous de n
    n = parse(n);
    const cible = pas(n) - (num - 1), l = ((cible % 7) + 7) % 7, o = Math.floor(cible / 7);
    const m = midi(n) - semisDe(num, q);
    const a = m - (12 * (o + 1) + BASE[l]);
    return { l, a, o };
  }
  function renverseInterv(num, q) {                        // renversement d'un intervalle simple : 3M → 6m, 5J → 4J…
    return { num: 9 - num, q: { J: 'J', M: 'm', m: 'M', A: 'd', d: 'A', AA: 'dd', dd: 'AA' }[q] };
  }

  /* ---------- gammes et modes ---------- */
  const FORMULES = {
    maj: [2, 2, 1, 2, 2, 2, 1],
    min: [2, 1, 2, 2, 1, 2, 2],
    harm: [2, 1, 2, 2, 1, 3, 1],
    mel: [2, 1, 2, 2, 2, 2, 1],
    ionien: [2, 2, 1, 2, 2, 2, 1],
    dorien: [2, 1, 2, 2, 2, 1, 2],
    phrygien: [1, 2, 2, 2, 1, 2, 2],
    lydien: [2, 2, 2, 1, 2, 2, 1],
    mixolydien: [2, 2, 1, 2, 2, 1, 2],
    eolien: [2, 1, 2, 2, 1, 2, 2],
    locrien: [1, 2, 2, 1, 2, 2, 2],
  };
  function gamme(tonique, type) {                          // 8 notes, de la tonique à son octave
    const t = parse(tonique), f = FORMULES[type || 'maj'];
    const out = [t]; let m = midi(t);
    for (let k = 1; k <= 7; k++) {
      m += f[k - 1];
      const cible = pas(t) + k, l = ((cible % 7) + 7) % 7, o = Math.floor(cible / 7);
      out.push({ l, a: m - (12 * (o + 1) + BASE[l]), o });
    }
    return out;
  }
  const NOMS_DEGRES = ['tonique', 'sus-tonique', 'médiante', 'sous-dominante', 'dominante', 'sus-dominante', 'sensible'];
  function nomDegre(deg, notes) {                          // deg : 1..7 ; la 7e est « sensible » si elle est à un demi-ton de la tonique
    if (deg === 7 && notes && midi(notes[7]) - midi(notes[6]) !== 1) return 'sous-tonique';
    return NOMS_DEGRES[deg - 1];
  }
  const ROMAIN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const MODES_NOMS = { ionien: 'ionien', dorien: 'dorien', phrygien: 'phrygien', lydien: 'lydien', mixolydien: 'mixolydien', eolien: 'éolien', locrien: 'locrien' };
  const MODES_ORDRE = ['ionien', 'dorien', 'phrygien', 'lydien', 'mixolydien', 'eolien', 'locrien'];

  /* ---------- armures ---------- */
  function nbAlterations(tonique, type) {                  // + dièses, − bémols ; null si l'armure théorique dépasse 7 altérations
    const g = gamme(tonique, type || 'maj').slice(0, 7);
    let s = 0, doubles = false;
    g.forEach((n) => { s += n.a; if (Math.abs(n.a) > 1) doubles = true; });
    if (doubles || Math.abs(s) > 7) return null;
    return s;
  }
  const ORDRE_DIESES = ['f', 'c', 'g', 'd', 'a', 'e', 'b'];
  const ORDRE_BEMOLS = ['b', 'e', 'a', 'd', 'g', 'c', 'f'];
  function alterationsArmure(n) { return n > 0 ? ORDRE_DIESES.slice(0, n).map((x) => x + '♯') : ORDRE_BEMOLS.slice(0, -n).map((x) => x + '♭'); }
  // tonalités de la gamme majeure ordonnées selon le cercle des quintes (−7 à +7)
  const TON_MAJ = { '-7': 'cb', '-6': 'gb', '-5': 'db', '-4': 'ab', '-3': 'eb', '-2': 'bb', '-1': 'f', '0': 'c', '1': 'g', '2': 'd', '3': 'a', '4': 'e', '5': 'b', '6': 'f#', '7': 'c#' };
  const TON_MIN = { '-7': 'ab', '-6': 'eb', '-5': 'bb', '-4': 'f', '-3': 'c', '-2': 'g', '-1': 'd', '0': 'a', '1': 'e', '2': 'b', '3': 'f#', '4': 'c#', '5': 'g#', '6': 'd#', '7': 'a#' };
  const tonDe = (n, mode, oct) => parse(((mode === 'min' ? TON_MIN : TON_MAJ)[n]) + (oct == null ? 4 : oct));
  function relative(tonique, mode) {                       // relative mineure d'une tonalité majeure, relative majeure d'une mineure
    const t = parse(tonique);
    return mode === 'min' ? monter(t, 3, 'm') : descendre(t, 3, 'm');
  }
  function homonyme(tonique) { return tonique; }

  /* ---------- accords ---------- */
  const ACCORDS = {
    M: [[3, 'M'], [5, 'J']],
    m: [[3, 'm'], [5, 'J']],
    dim: [[3, 'm'], [5, 'd']],
    aug: [[3, 'M'], [5, 'A']],
    sus2: [[2, 'M'], [5, 'J']],
    sus4: [[4, 'J'], [5, 'J']],
    '7': [[3, 'M'], [5, 'J'], [7, 'm']],
    maj7: [[3, 'M'], [5, 'J'], [7, 'M']],
    m7: [[3, 'm'], [5, 'J'], [7, 'm']],
    m7b5: [[3, 'm'], [5, 'd'], [7, 'm']],
    dim7: [[3, 'm'], [5, 'd'], [7, 'd']],
    mmaj7: [[3, 'm'], [5, 'J'], [7, 'M']],
    '6': [[3, 'M'], [5, 'J'], [6, 'M']],
    '9': [[3, 'M'], [5, 'J'], [7, 'm'], [9, 'M']],
  };
  const ACCORD_NOMS = { M: 'majeur', m: 'mineur', dim: 'diminué', aug: 'augmenté', sus2: 'sus2', sus4: 'sus4', '7': 'septième de dominante', maj7: 'septième majeure', m7: 'mineur septième', m7b5: 'demi-diminué', dim7: 'septième diminuée', mmaj7: 'mineur, septième majeure', '6': 'sixte ajoutée', '9': 'neuvième de dominante' };
  const ACCORD_SYMB = { M: '', m: 'm', dim: '°', aug: '+', sus2: 'sus2', sus4: 'sus4', '7': '7', maj7: 'Δ7', m7: 'm7', m7b5: 'ø', dim7: '°7', mmaj7: 'm(Δ7)', '6': '6', '9': '9' };
  function accord(racine_, type) {                         // notes de l'accord en position fondamentale
    const r = parse(racine_);
    return [r].concat(ACCORDS[type].map(([num, q]) => monter(r, num, q)));
  }
  function nomAccord(racine_, type) { const r = parse(racine_); return Maj(r) + ' ' + ACCORD_NOMS[type]; }
  function symboleAccord(racine_, type) { const r = parse(racine_); return lettreEn(r) + ACCORD_SYMB[type]; }
  function renverser(notes, k) {                           // k = 0 (fondamental), 1, 2, 3
    const o = notes.slice();
    for (let i = 0; i < k; i++) { const n = o.shift(); o.push({ l: n.l, a: n.a, o: n.o + 1 }); }
    return o;
  }
  function typeDe(notes) {                                 // reconnaît un accord de trois ou quatre sons (position fondamentale, notes triées)
    const r = notes[0];
    const iv = notes.slice(1).map((n) => { const x = intervalle(r, n); return x.num + x.q; });
    for (const [t, spec] of Object.entries(ACCORDS)) {
      if (['sus2', 'sus4', '6', '9'].includes(t)) continue;
      if (spec.length === iv.length && spec.every(([num, q], i) => iv[i] === num + q)) return t;
    }
    return null;
  }
  // accords construits sur chaque degré d'une gamme (triades ou septièmes), avec leur qualité et leur chiffrage
  function accordsDeGamme(tonique, type, sept) {
    const g = gamme(tonique, type), s = g.slice(0, 7);
    const out = [];
    for (let i = 0; i < 7; i++) {
      const racine_ = s[i], tierce = s[(i + 2) % 7], quinte = s[(i + 4) % 7], septieme = s[(i + 6) % 7];
      const mont = (n, ref) => { let x = { l: n.l, a: n.a, o: ref.o }; while (midi(x) < midi(ref)) x = { l: x.l, a: x.a, o: x.o + 1 }; return x; };
      const t3 = mont(tierce, racine_), t5 = mont(quinte, t3), t7 = mont(septieme, t5);
      const notes = sept ? [racine_, t3, t5, t7] : [racine_, t3, t5];
      const typ = typeDe(notes);
      const maj = typ === 'M' || typ === 'aug' || typ === '7' || typ === 'maj7';
      let rom = ROMAIN[i];
      if (!maj) rom = rom.toLowerCase();
      if (typ === 'dim') rom += '°';
      if (typ === 'aug') rom += '+';
      if (typ === 'm7b5') rom += 'ø';
      if (typ === 'dim7') rom += '°';
      if (sept && typ === 'maj7') rom += 'Δ';
      if (sept && !['m7b5', 'dim7'].includes(typ)) rom += '7';
      if (sept && typ === 'dim7') rom += '7';
      if (sept && typ === 'm7b5') rom += '7';
      out.push({ deg: i + 1, notes, type: typ, romain: rom, nom: nomAccord(racine_, typ), racine: racine_ });
    }
    return out;
  }

  /* ---------- écriture pour portee.js ---------- */
  // Portee.js retient les altérations dans la mesure et applique l'armure : on écrit donc explicitement un bécarre quand il faut.
  function Ecr(arm) {
    const armA = {}; const n0 = arm || 0;
    if (n0 > 0) for (let i = 0; i < n0; i++) armA[ORDRE_DIESES[i]] = 1;
    if (n0 < 0) for (let i = 0; i < -n0; i++) armA[ORDRE_BEMOLS[i]] = -1;
    let etat = {};
    const hauteur = (n) => {
      const cle = LET[n.l] + n.o, courant = etat[cle] !== undefined ? etat[cle] : (armA[LET[n.l]] || 0);
      etat[cle] = n.a;
      if (n.a === 0) return LET[n.l] + (courant !== 0 ? 'n' : '') + n.o;
      return LET[n.l] + ALT_STR[n.a] + n.o;
    };
    return { note: (n, d, suf) => hauteur(n) + ':' + d + (suf || ''), accord: (ns, d, suf) => ns.map(hauteur).join('+') + ':' + d + (suf || ''), barre() { etat = {}; } };
  }
  const str2 = (n) => str(n);
  const sc = (notes, d, arm) => { const e = Ecr(arm); return notes.map((n) => e.note(n, d)).join(' '); };
  const acc = (notes, d, arm) => Ecr(arm).accord(notes, d);
  // une gamme montante (et descendante si demandé) à l'octave, avec une étiquette sous chaque note si on en donne
  function gammeScore(tonique, type, opt) {
    opt = opt || {};
    const g = gamme(tonique, type), d = opt.d || 'q', e = Ecr(opt.arm);
    let s = g.map((n, i) => e.note(n, d) + (opt.etiq && opt.etiq[i] ? ' @' + opt.etiq[i] : '')).join(' ');
    if (opt.desc) s += ' ' + (opt.descNotes || g.slice(0, 7).reverse()).map((n) => e.note(n, d)).join(' ');
    return s;
  }
  // coupe une suite de jetons en mesures de n jetons
  function mesures(jetons, n) {
    const out = [];
    for (let i = 0; i < jetons.length; i += n) out.push(jetons.slice(i, i + n).join(' '));
    return out.join(' | ') + ' |]';
  }
  // accords « naturels » d'une tonalité : majeure ; mineure avec V majeur et vii° (sensible) comme en harmonie classique
  function accordsTonalite(tonique, mode, sept) {
    if (mode !== 'min') return accordsDeGamme(tonique, 'maj', sept);
    const nat = accordsDeGamme(tonique, 'min', sept), har = accordsDeGamme(tonique, 'harm', sept);
    nat[4] = har[4]; nat[6] = har[6];
    return nat;
  }
  // enchaînement d'accords : main droite (position la plus proche du précédent), basse main gauche
  function progression(tonique, mode, degres, opt) {
    opt = opt || {};
    const ac = accordsTonalite(tonique, mode, !!opt.sept);
    const arm = opt.arm != null ? opt.arm : (nbAlterations(tonique, mode === 'min' ? 'min' : 'maj') || 0);
    const duree = opt.d || 'h', eh = Ecr(arm), eb = Ecr(arm);
    let prev = null; const haut = [], bas = [], romains = [], accords = [];
    degres.forEach((dg) => {
      const a = ac[dg - 1];
      const base = a.notes.map((n) => ({ l: n.l, a: n.a, o: 4 }));
      let meilleur = null, mscore = 1e9;
      for (let inv = 0; inv < base.length; inv++) {
        for (let dec = 0; dec < 2; dec++) {
          const v = renverser(base, inv).map((n) => ({ l: n.l, a: n.a, o: n.o + dec })).sort((x, y) => midi(x) - midi(y));
          const sm = v.map(midi);
          if (sm[0] < 60 || sm[sm.length - 1] > 79) continue;
          const sc_ = prev ? prev.reduce((s, m) => s + Math.min(...sm.map((x) => Math.abs(x - m))), 0) + Math.abs(sm[0] - prev[0]) : Math.abs(sm[0] - 64) + Math.abs(sm[sm.length - 1] - 71);
          if (sc_ < mscore) { mscore = sc_; meilleur = { v, sm }; }
        }
      }
      prev = meilleur.sm;
      haut.push(eh.accord(meilleur.v, duree));
      let b = { l: a.notes[0].l, a: a.notes[0].a, o: 2 };
      if (midi(b) < 40) b = { l: b.l, a: b.a, o: 3 };
      bas.push(eb.note(b, duree));
      romains.push(a.romain); accords.push(a);
    });
    return { haut: haut.join(' '), bas: bas.join(' '), romains, accords, arm };
  }

  racine.Theorie = {
    LET, NOMS, N, parse, str, midi, pas, nomFr, Maj, lettreEn, egal, memeNom, sansOct, noteDe,
    semisDe, qualiteDe, nomInterv, abrevInterv, intervalle, monter, descendre, renverseInterv, NUM_FR, QUAL_FR,
    FORMULES, gamme, nomDegre, NOMS_DEGRES, ROMAIN, MODES_NOMS, MODES_ORDRE,
    nbAlterations, alterationsArmure, TON_MAJ, TON_MIN, tonDe, relative,
    ACCORDS, ACCORD_NOMS, ACCORD_SYMB, accord, nomAccord, symboleAccord, renverser, typeDe, accordsDeGamme,
    Ecr, sc, acc, gammeScore, mesures, progression, accordsTonalite,
  };
})(typeof self !== 'undefined' ? self : this);
