/* contenu/outils.js — petites fonctions pour écrire les leçons plus vite (Contenu.o). */
(function (racine) {
  'use strict';
  const T = racine.Theorie;
  const o = {
    p: (x) => ({ t: 'p', x }),
    h: (x) => ({ t: 'h', x }),
    def: (tag, x) => ({ t: 'def', tag: 'Définition · ' + tag, x }),
    rem: (tag, x) => ({ t: 'rem', tag, x }),
    ex: (x, tag) => (tag ? { t: 'ex', tag, x } : { t: 'ex', x }),
    liste: (...x) => ({ t: 'liste', x }),
    num: (...x) => ({ t: 'liste', x, num: true }),
    tab: (entete, lignes) => ({ t: 'tableau', entete, lignes }),
    // score : s = chaîne de notes ; opt = { clef, mes, arm, bpm, leg, haut, bas, noms, ecoute }
    sc: (s, leg, opt) => Object.assign({ t: 'score', clef: 'sol', s, legende: leg }, opt || {}),
    piano: (haut, bas, leg, opt) => Object.assign({ t: 'score', clef: 'piano', haut, bas, legende: leg }, opt || {}),
    ry: (titre, s, mes, bpm, consigne, opt) => Object.assign({ t: 'rythme', titre, s, mes, bpm, consigne }, opt || {}),
    // qcm : liste de [question, [choix], indexBonne, explication, portee?]
    qcm: (titre, qs) => ({ t: 'qcm', titre, questions: qs.map(([q, choix, bonne, expl, portee]) => (portee ? { q, choix, bonne, expl, portee } : { q, choix, bonne, expl })) }),
    exo: (gen, params, n, titre) => ({ t: 'exo', gen, params: params || {}, n: n || 8, titre: titre || 'Exercice' }),
    clav: (de, a, opt) => Object.assign({ t: 'clavier', de, a }, opt || {}),
    son: (notes, noms, legende) => ({ t: 'son', notes, noms, legende }),
    // cartes : liste de [question, réponse, portee?]
    cartes: (cat, paires) => paires.map(([q, r, p]) => (p ? { cat, q, r, p } : { cat, q, r })),
    video: (titre, rech) => ({ titre, rech }),
    // intervalles : suite de [base, nombre, qualité] écrite en partition (mode 'm' mélodique, 'h' harmonique, 'd' mélodique descendant)
    ivs: (liste, mode, d) => {
      const T = racine.Theorie, e = T.Ecr(0), dur = d || (mode === 'h' ? 'w' : 'h'), out = [];
      liste.forEach(([a, num, q], i) => {
        const x = typeof a === 'string' ? T.parse(a) : a, y = mode === 'd' ? T.descendre(x, num, q) : T.monter(x, num, q);
        if (i) { out.push('|'); e.barre(); }
        if (mode === 'h') out.push(e.accord([x, y], dur));
        else if (mode === 'd') out.push(e.note(x, dur), e.note(y, dur));
        else out.push(e.note(x, dur), e.note(y, dur));
      });
      return out.join(' ') + ' |]';
    },
    // accords : suite de [fondamentale, type, renversement?] écrite en partition, un accord par mesure (durée d, ronde par défaut)
    acs: (liste, d, parMesure) => {
      const T = racine.Theorie, e = T.Ecr(0), dur = d || 'w', out = []; const k = parMesure || 1;
      liste.forEach(([r, ty, inv], i) => {
        const base = T.accord(typeof r === 'string' ? T.parse(r) : r, ty).map((n) => ({ l: n.l, a: n.a, o: n.o }));
        const notes = inv ? T.renverser(base, inv) : base;
        if (i && i % k === 0) { out.push('|'); e.barre(); }
        out.push(e.accord(notes, dur));
      });
      return out.join(' ') + ' |]';
    },
    // leçon
    L: (id, titre, duree, objectifs, blocs, extra) => Object.assign({ id, titre, duree, objectifs, blocs, videos: [], mix: [], cartes: [] }, extra || {}),
  };
  // aides pour les gammes (volumes 2 à 5)
  const T0 = racine.Theorie;
  o.G = {
    DOIGTES_MIN: {
      a: ['1 2 3 1 2 3 4 5', '5 4 3 2 1 3 2 1'], e: ['1 2 3 1 2 3 4 5', '5 4 3 2 1 3 2 1'], d: ['1 2 3 1 2 3 4 5', '5 4 3 2 1 3 2 1'], g: ['1 2 3 1 2 3 4 5', '5 4 3 2 1 3 2 1'], c: ['1 2 3 1 2 3 4 5', '5 4 3 2 1 3 2 1'],
      b: ['1 2 3 1 2 3 4 5', '4 3 2 1 4 3 2 1'], f: ['1 2 3 4 1 2 3 4', '5 4 3 2 1 3 2 1'], 'f#': ['3 4 1 2 3 1 2 3', '4 3 2 1 3 2 1 4'], 'c#': ['3 4 1 2 3 1 2 3', '3 2 1 4 3 2 1 3'],
    },
    NOT: { g: 'sol', d: 'ré', a: 'la', e: 'mi', b: 'si', 'f#': 'fa dièse', 'c#': 'do dièse', 'g#': 'sol dièse', 'd#': 'ré dièse', f: 'fa', bb: 'si bémol', eb: 'mi bémol', ab: 'la bémol', c: 'do' },
    OCT_BAS: { c: 3, d: 3, e: 3, f: 3, g: 2, a: 2, b: 2 },
    cap: (x) => x.replace(/^./, (c) => c.toUpperCase()),
    bar: (s, n) => { const out = []; let k = 0; s.split(' ').forEach((t) => { if (t[0] !== '@' && t[0] !== '^') { if (k > 0 && k % n === 0) out.push('|'); k++; } out.push(t); }); return out.join(' ') + ' |]'; },
    etiqs: (txt) => txt.split(' '),
    noms7: (ton, type) => T0.gamme(ton, type).slice(0, 7).map((n) => T0.nomFr(n)).join(' – '),
  };
  // progression en partition piano (accords à la main droite, basse à la main gauche) avec barres de mesure
  o.G.prog = (t, mode, degs, leg, opt) => {
    opt = opt || {};
    const d = opt.d || 'h', bpb = { '4/4': 4, '6/4': 6, '3/4': 3, '2/4': 2 }[opt.mes || '4/4'], per = Math.max(1, Math.round(bpb / ({ w: 4, h: 2, q: 1 }[d])));
    const pr = T0.progression(t, mode, degs, { d, sept: !!opt.sept });
    const cut = (s) => { const k = s.split(' '), out = []; k.forEach((x, i) => { if (i && i % per === 0) out.push('|'); out.push(x); }); return out.join(' ') + ' |]'; };
    return o.piano(cut(pr.haut), cut(pr.bas), leg + (opt.sansRomains ? '' : ' (' + pr.romains.join(' – ') + ')'), { mes: opt.mes || '4/4', arm: pr.arm });
  };
  o.G.tableTonalites = (tons, mode, sept) => {
    const cols = tons.map((t) => T0.accordsTonalite(t, mode, !!sept));
    return cols[0].map((a, i) => [a.romain].concat(cols.map((c) => c[i].nom)));
  };
  racine.Contenu.o = o;
})(typeof self !== 'undefined' ? self : this);
