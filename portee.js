/* portee.js — dessine des portées en SVG : clés, armures, chiffrage, notes, accords, silences, liaisons, triolets, grande portée de piano.
   Aucune bibliothèque : tout est calculé et dessiné ici.

   Écriture d'un extrait (séparer par des espaces) :
     c4:q            do central, noire          durées : w ronde · h blanche · q noire · e croche · s double · t triple ; point : q.  q..
     f#4:e  bb3:q    dièse # · bémol b · bécarre n · double dièse x · double bémol bb
     c4+e4+g4:h      accord
     r:q             silence
     |  ||  |]       barre · double barre · barre finale
     <3 … >          triolet (aussi <5 <6 <2)
     ~ après la durée : liaison vers la note suivante (c4:q~)     ! : note en évidence       ? : note « mystère » (sans pied ni tête)
     @Texte          texte sous la note      ^Texte : texte au-dessus (accords…)   (« _ » = espace)
   Hauteurs : numérotation scientifique (c4 = do central = « do3 » dans la notation française). */
(function (racine) {
  'use strict';
  const SP = 9;                                   // un espace de portée, en unités du SVG
  const LETTRES = 'cdefgab';
  const BASE = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  const ALT = { '#': 1, '##': 2, x: 2, b: -1, bb: -2, n: 0 };
  const DUREES = { w: 96, h: 48, q: 24, e: 12, s: 6, t: 3 };
  const NOMS_FR = ['do', 'ré', 'mi', 'fa', 'sol', 'la', 'si'];
  const ORDRE_DIESES = ['f', 'c', 'g', 'd', 'a', 'e', 'b'];
  const ORDRE_BEMOLS = ['b', 'e', 'a', 'd', 'g', 'c', 'f'];
  const POS_DIESES = [38, 35, 39, 36, 33, 37, 34];     // marches (écriture en clé de sol)
  const POS_BEMOLS = [34, 37, 33, 36, 32, 35, 31];
  const CLES = { sol: { bas: 30, mid: 34, decal: 0 }, fa: { bas: 18, mid: 22, decal: -14 }, ut: { bas: 24, mid: 28, decal: -7 } };   // marche de la ligne du bas, de la ligne du milieu

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const f1 = (x) => Math.round(x * 100) / 100;

  /* ---------- hauteurs ---------- */
  function parseHauteur(t) {
    const m = /^([a-g])(##|bb|#|b|n|x)?(-?\d)$/.exec(t);
    if (!m) throw new Error('hauteur illisible : ' + t);
    return { lettre: m[1], acc: m[2] === undefined ? null : m[2], oct: +m[3] };
  }
  const marche = (p) => p.oct * 7 + LETTRES.indexOf(p.lettre);
  const midiDe = (p, alt) => 12 * (p.oct + 1) + BASE[p.lettre] + alt;
  // « c4 » → midi 60 ; « f#4 » → 66
  function midi(t) { const p = parseHauteur(t); return midiDe(p, p.acc == null ? 0 : ALT[p.acc]); }
  // nom français d'une hauteur, octave à la française (do central = do3)
  function nomFr(t, sansOctave) {
    const p = typeof t === 'string' ? parseHauteur(t) : t;
    let s = NOMS_FR[LETTRES.indexOf(p.lettre)];
    const a = p.acc == null ? 0 : ALT[p.acc];
    s += a === 1 ? ' dièse' : a === 2 ? ' double dièse' : a === -1 ? ' bémol' : a === -2 ? ' double bémol' : '';
    return sansOctave ? s : s + ' ' + (p.oct - 1);
  }
  const NOMS_NOTES_MIDI = ['do', 'do♯', 'ré', 'ré♯', 'mi', 'fa', 'fa♯', 'sol', 'sol♯', 'la', 'la♯', 'si'];
  const nomMidi = (m) => NOMS_NOTES_MIDI[((m % 12) + 12) % 12] + ' ' + (Math.floor(m / 12) - 2);

  /* ---------- lecture de l'écriture ---------- */
  function armureAlt(n) {                         // altérations de l'armure : { lettre: alt }
    const o = {};
    if (n > 0) for (let i = 0; i < n; i++) o[ORDRE_DIESES[i]] = 1;
    if (n < 0) for (let i = 0; i < -n; i++) o[ORDRE_BEMOLS[i]] = -1;
    return o;
  }
  function battement(mes) {                       // durée d'un temps (en ticks) pour grouper les croches
    if (!mes) return 24;
    const [a, b] = mes.split('/').map(Number);
    const noteBase = 96 / b;
    if (b >= 8 && a % 3 === 0 && a > 3) return noteBase * 3;
    if (b === 8 && a === 3) return noteBase * 3;
    return noteBase;
  }
  const TUP = { 3: 2 / 3, 5: 4 / 5, 6: 4 / 6, 2: 3 / 2, 4: 3 / 4 };

  function lire(txt, clef, arm, mes, compteur) {
    const toks = String(txt || '').trim().split(/\s+/).filter(Boolean);
    const cle = CLES[clef] || CLES.sol;
    const armA = armureAlt(arm || 0);
    let etatMesure = {};                           // altérations vues dans la mesure : "lettre+oct" → alt
    const items = []; let t = 0, tup = null, tupId = 0, tupDeb = -1;
    const bat = battement(mes);
    let attenteTexteBas = null;
    for (let i = 0; i < toks.length; i++) {
      const tk = toks[i];
      if (tk === '|' || tk === '||' || tk === '|]') { items.push({ k: 'bar', t, style: tk }); etatMesure = {}; continue; }
      if (/^<\d$/.test(tk)) { tup = { n: +tk[1], id: ++tupId, r: TUP[+tk[1]] || 2 / 3 }; tupDeb = items.length; continue; }
      if (tk === '>') { if (tup) { const debut = items.slice(tupDeb).filter((x) => x.k !== 'bar'); if (debut.length) debut[0].tupDeb = { n: tup.n, fin: debut[debut.length - 1] }; } tup = null; continue; }
      if (tk === '(' || tk === ')') { items.push({ k: tk === '(' ? 'lieDeb' : 'lieFin', t }); continue; }
      if (tk[0] === '@' || tk[0] === '^') {
        const texte = tk.slice(1).replace(/_/g, ' ');
        const cible = [...items].reverse().find((x) => x.k === 'n' || x.k === 'r');
        if (cible) { if (tk[0] === '@') cible.sous = texte; else cible.dessus = texte; }
        continue;
      }
      const m = /^([^:]+):([whqest])(\.{0,2})([~!?]*)$/.exec(tk);
      if (!m) throw new Error('élément illisible : « ' + tk + ' »');
      let d = DUREES[m[2]]; const pts = m[3].length;
      let dd = d; for (let j = 1; j <= pts; j++) dd += d / Math.pow(2, j);
      if (tup) dd *= tup.r;
      const it = { k: m[1] === 'r' ? 'r' : 'n', t, d: dd, forme: m[2], pts, tie: m[4].includes('~'), mark: m[4].includes('!'), mystere: m[4].includes('?'), idx: compteur.i++, tup: tup ? tup.id : 0, bat };
      if (it.k === 'n') {
        it.p = m[1].split('+').map((h) => {
          const p = parseHauteur(h), st = marche(p), cleMe = p.lettre + p.oct;
          let alt, montre = null;
          if (p.acc !== null) {
            alt = ALT[p.acc];
            const courant = etatMesure[cleMe] !== undefined ? etatMesure[cleMe] : (armA[p.lettre] || 0);
            if (alt !== courant) montre = alt === 0 ? 'n' : alt === 1 ? '#' : alt === 2 ? 'x' : alt === -1 ? 'b' : 'bb';
            etatMesure[cleMe] = alt;
          } else alt = etatMesure[cleMe] !== undefined ? etatMesure[cleMe] : (armA[p.lettre] || 0);
          return { lettre: p.lettre, oct: p.oct, st, alt, montre, midi: midiDe(p, alt), nom: nomFr({ lettre: p.lettre, acc: alt === 1 ? '#' : alt === -1 ? 'b' : alt === 2 ? '##' : alt === -2 ? 'bb' : null, oct: p.oct }) };
        }).sort((a, b) => a.st - b.st || a.midi - b.midi);
      }
      items.push(it); t += dd;
    }
    return { items, fin: t };
  }

  /* ---------- glyphes (unités : espace de portée ; l'axe y descend) ---------- */
  const G = {
    sol: 'M-0.55,2.75 C-0.55,3.3 0.2,3.35 0.3,2.7 C0.4,1.9 0.4,-0.6 0.3,-3.3 C0.25,-4.35 0.95,-4.75 1.05,-3.7 C1.15,-2.7 0.2,-1.8 -0.55,-1.2 C-1.35,-0.5 -1.25,1.15 0.1,1.25 C1.15,1.35 1.45,-0.3 0.8,-0.9 C0.3,-1.3 -0.6,-0.95 -0.5,-0.1 C-0.45,0.45 0.25,0.55 0.35,0.05',
    fa: 'M-0.6,0 C-0.35,-1.0 1.2,-0.95 1.15,0.2 C1.1,1.5 0.3,2.5 -0.95,3.2',
  };
  const aVide = (x, y, rx, ry, rot) => 'M' + f1(x - rx) + ',' + f1(y) + ' a' + rx + ',' + ry + ' 0 1,0 ' + 2 * rx + ',0 a' + rx + ',' + ry + ' 0 1,0 ' + -2 * rx + ',0 Z';

  function tete(x, y, forme, cls) {
    if (forme === 'w') return '<g transform="translate(' + f1(x) + ',' + f1(y) + ') scale(' + SP + ')"><path class="enc ' + cls + '" fill-rule="evenodd" d="' + aVide(0, 0, 0.82, 0.48, 0) + ' ' + '" /><ellipse class="pap" cx="0" cy="0" rx="0.34" ry="0.56" transform="rotate(40)"/></g>';
    if (forme === 'h') return '<g transform="translate(' + f1(x) + ',' + f1(y) + ') scale(' + SP + ')"><g transform="rotate(-24)"><path class="enc ' + cls + '" fill-rule="evenodd" d="' + aVide(0, 0, 0.7, 0.44, 0) + ' ' + aVide(0, 0, 0.5, 0.17, 0).replace('Z', 'Z') + '"/></g></g>';
    return '<g transform="translate(' + f1(x) + ',' + f1(y) + ') scale(' + SP + ')"><ellipse class="enc ' + cls + '" rx="0.7" ry="0.44" transform="rotate(-24)"/></g>';
  }
  const glypheAlt = {
    '#': '<path class="trait" d="M-0.22,-1.2 V1.15 M0.22,-0.95 V1.4"/><path class="trait gros" d="M-0.55,-0.25 L0.55,-0.7 M-0.55,0.7 L0.55,0.25"/>',
    b: '<path class="trait" d="M-0.22,-1.9 V0.45"/><path class="trait fin" d="M-0.22,0.45 C0.7,0.15 0.9,-0.75 -0.22,-0.45"/>',
    n: '<path class="trait" d="M-0.25,-1.3 V0.6 M0.25,-0.6 V1.3"/><path class="trait gros" d="M-0.25,-0.3 L0.25,-0.55 M-0.25,0.65 L0.25,0.4"/>',
    x: '<path class="trait gros" d="M-0.45,-0.45 L0.45,0.45 M-0.45,0.45 L0.45,-0.45"/>',
  };
  glypheAlt.bb = '<g transform="translate(-0.3,0)">' + glypheAlt.b + '</g><g transform="translate(0.35,0)">' + glypheAlt.b + '</g>';
  const largAlt = { '#': 1.15, b: 1.0, n: 1.0, x: 1.1, bb: 1.7 };

  function glypheSilence(forme, x, yTop) {                // yTop = ordonnée de la ligne du haut de la portée
    const o = '<g transform="translate(' + f1(x) + ',' + f1(yTop) + ') scale(' + SP + ')">';
    if (forme === 'w') return o + '<rect class="enc" x="-0.6" y="1" width="1.2" height="0.5"/></g>';
    if (forme === 'h') return o + '<rect class="enc" x="-0.6" y="1.5" width="1.2" height="0.5"/></g>';
    if (forme === 'q') return o + '<path class="trait gros2" d="M0.3,0.55 L-0.3,1.3 L0.3,2.05 L-0.2,2.75 C-0.75,2.8 -0.65,3.55 0.1,3.45"/></g>';
    const n = forme === 'e' ? 1 : forme === 's' ? 2 : 3;
    let s = o;
    for (let i = 0; i < n; i++) { const dy = i * 1.0; s += '<circle class="enc" cx="' + f1(-0.3 - i * 0.12) + '" cy="' + f1(1.3 + dy) + '" r="0.27"/><path class="trait fin" d="M' + f1(-0.3 - i * 0.12) + ',' + f1(1.35 + dy) + ' C0.2,' + f1(1.65 + dy) + ' 0.4,' + f1(1.2 + dy) + ' 0.5,' + f1(0.9 + dy) + '"/>'; }
    s += '<path class="trait fin" d="M0.5,0.9 L' + f1(-0.15 - (n - 1) * 0.12) + ',' + f1(2.6 + (n - 1)) + '"/></g>';
    return s;
  }
  const drapeau = (x, y, haut, n) => {                    // drapeau(x) au bout du pied
    let s = '';
    for (let i = 0; i < n; i++) {
      const dy = i * 0.95 * (haut ? 1 : -1);
      const d = haut ? 'M0,' + f1(0.02 + i * 0.95) + ' C0.15,1.0 1.3,1.45 1.15,3.1 C1.0,2.2 0.45,1.8 0,1.65 Z'.replace(/(\d+\.?\d*),(\d+\.?\d*)/g, (m0, a, b) => a + ',' + b)
        : 'M0,' + f1(-0.02 - i * 0.95) + ' C0.15,-1.0 1.3,-1.45 1.15,-3.1 C1.0,-2.2 0.45,-1.8 0,-1.65 Z';
      s += '<path class="enc" transform="translate(' + f1(x) + ',' + f1(y) + ') scale(' + SP + ')" d="' + d + '"/>';
    }
    return s;
  };

  /* ---------- mise en page ---------- */
  const largeurDe = (g) => 8 + 16 * Math.pow(Math.max(g, 1.5) / 24, 0.55);

  function rendre(spec) {
    const r = mise(spec);
    return '<div class="partition-svgs">' + r.svgs.join('') + '</div>';
  }
  function evenements(spec) { return mise(spec, true).evts; }

  function mise(spec, seulementEvts) {
    const piano = spec.clef === 'piano';
    const compteur = { i: 0 };
    const mes = spec.mes || null;
    const portees = [];
    if (piano) {
      portees.push({ cle: 'sol', ...lire(spec.haut || '', 'sol', spec.arm, mes, compteur) });
      portees.push({ cle: 'fa', ...lire(spec.bas || '', 'fa', spec.arm, mes, compteur) });
    } else {
      const c = spec.clef || 'sol';
      portees.push({ cle: c, ...lire(spec.s || '', c, spec.arm, mes, compteur) });
    }
    // évènements sonores (pour l'écoute et la surbrillance)
    const evts = [];
    portees.forEach((p) => p.items.forEach((it) => {
      if (it.k === 'n') evts.push({ t: it.t, d: it.d, midis: it.p.map((h) => h.midi), idx: it.idx, tie: it.tie });
      else if (it.k === 'r') evts.push({ t: it.t, d: it.d, midis: [], idx: it.idx });
    }));
    evts.sort((a, b) => a.t - b.t);
    // les notes liées sont jouées comme une seule
    for (let i = 0; i < evts.length; i++) {
      const e = evts[i];
      if (e.tie && e.midis.length) {
        const suiv = evts.find((x, j) => j > i && x.midis.length && Math.abs(x.t - (e.t + e.d)) < 1e-6 && x.midis.join() === e.midis.join());
        if (suiv) { suiv.sautee = true; e.d += suiv.d; e.fusion = (e.fusion || []).concat([suiv.idx]); if (suiv.tie) { e.tie = true; } else e.tie = false; }
      }
    }
    const evtsJoues = evts.filter((e) => !e.sautee);
    if (seulementEvts) return { evts: evtsJoues };

    const noms = !!spec.noms;
    const nbP = portees.length;
    // colonnes temporelles
    const temps = new Set();
    portees.forEach((p) => p.items.forEach((it) => { temps.add(f1(it.t)); }));
    portees.forEach((p) => temps.add(f1(p.fin)));
    const T = [...temps].sort((a, b) => a - b);
    const colDe = new Map(T.map((t, i) => [t, i]));
    const col = T.map((t) => ({ t, bar: false, barStyle: null, pad: 0, acc: 0, gap: 0 }));
    portees.forEach((p) => p.items.forEach((it) => {
      const c = col[colDe.get(f1(it.t))];
      if (it.k === 'bar') { c.bar = true; c.barStyle = it.style; }
      if (it.k === 'n') { let a = 0; const decal = []; it.p.forEach((h, j) => { if (h.montre) a = Math.max(a, largAlt[h.montre] || 1); }); c.acc = Math.max(c.acc, a ? a * SP + 2 : 0); if (it.p.length > 1) { let d2 = false; for (let j = 1; j < it.p.length; j++) if (it.p[j].st - it.p[j - 1].st === 1) d2 = true; if (d2) c.pad = Math.max(c.pad, 0.9 * SP); } }
    }));
    for (let i = 0; i < col.length - 1; i++) col[i].gap = col[i + 1].t - col[i].t;
    col[col.length - 1].gap = 0;
    // largeurs
    col.forEach((c, i) => {
      const dernier = i === col.length - 1;
      c.w = dernier ? 0 : largeurDe(c.gap) * (SP / 9);
      c.avant = (c.bar ? 9 : 0) + c.acc;
      c.xRel = 0;
    });
    // coupure en lignes (aux barres de mesure)
    const largeurDispo = (spec.larg || 340);
    const avantCle = 12 + 30 + (spec.arm ? Math.abs(spec.arm) * 8 + 4 : 0) + (mes ? 24 : 0) + (piano ? 12 : 0);
    const systemes = [];
    let debut = 0, largeurCourante = 0, dernierBar = -1;
    const colsBar = col.map((c, i) => (c.bar ? i : -1)).filter((i) => i >= 0);
    for (let i = 0; i < col.length; i++) {
      largeurCourante += col[i].avant + col[i].w;
      const estFinMesure = col[i + 1] && col[i + 1].bar;
      if (estFinMesure) dernierBar = i;
      if (spec.lignes === 1) continue;
      const suivantW = col[i + 1] ? col[i + 1].avant + col[i + 1].w : 0;
      if (dernierBar >= debut && largeurCourante + suivantW + avantCle > largeurDispo && i + 1 < col.length - 1) {
        // couper après la dernière mesure complète
        systemes.push([debut, dernierBar]);
        debut = dernierBar + 1; dernierBar = -1;
        largeurCourante = 0;
        for (let j = debut; j <= i; j++) largeurCourante += col[j].avant + col[j].w;
        if (i >= debut && col[i + 1] && col[i + 1].bar) dernierBar = i;
      }
    }
    systemes.push([debut, col.length - 1]);

    const svgs = [];
    systemes.forEach((sy, si) => svgs.push(dessinerSysteme(spec, portees, col, T, colDe, sy, si, systemes.length, avantCle, largeurDispo, noms, piano, mes)));
    return { svgs, evts: evtsJoues };
  }

  function dessinerSysteme(spec, portees, col, T, colDe, sy, si, nbSys, avantCle, largeurDispo, noms, piano, mes) {
    const gapPortees = 6 * SP;                      // entre le bas de la portée du haut et le haut de celle du bas
    const hautP = portees.map((_, i) => i * (4 * SP + gapPortees));
    const bas = hautP[portees.length - 1] + 4 * SP;
    let etire = !!spec.etire;
    const derniere = si === nbSys - 1;
    // largeur naturelle
    let nat = 0; for (let i = sy[0]; i <= sy[1]; i++) nat += col[i].avant + col[i].w;
    const prefixe = 8 + 26 + (spec.arm ? Math.abs(spec.arm) * 8 + 4 : 0) + (si === 0 && mes ? 26 : 0) + (piano ? 14 : 0);
    const marge = 14;
    let k = 1;
    const disponible = largeurDispo - prefixe - marge;
    if (nbSys > 1 && !derniere || etire) k = Math.max(1, disponible / Math.max(1, nat));
    if (k > 1.9) k = 1.9;
    const parts = []; let minY = -SP * 1.2, maxY = bas + SP * 1.2;
    const touche = (y) => { if (y < minY) minY = y; if (y > maxY) maxY = y; };
    const x0 = 6;
    // positions des colonnes
    const X = new Map(); let x = x0 + prefixe;
    for (let i = sy[0]; i <= sy[1]; i++) {
      const c = col[i];
      X.set(i, { gauche: x, barX: x + 3, note: x + c.avant + 6 });
      x += (c.avant + c.w) * k;
    }
    const xFin = x + (derniere ? 4 : 0) + 4;
    const largeurSvg = Math.max(xFin + marge * 0.4, 120);
    // lignes de portée, clés, armure, chiffrage
    portees.forEach((p, pi) => {
      const y0 = hautP[pi];
      for (let l = 0; l < 5; l++) parts.push('<line class="ligne" x1="' + x0 + '" x2="' + f1(xFin) + '" y1="' + f1(y0 + l * SP) + '" y2="' + f1(y0 + l * SP) + '"/>');
      // clé
      const cle = p.cle;
      const yLigneSol = y0 + 3 * SP, yLigneFa = y0 + 1 * SP;
      if (cle === 'sol') parts.push('<g transform="translate(' + (x0 + 14) + ',' + f1(yLigneSol) + ') scale(' + SP * 0.98 + ')"><path class="trait cle" d="' + G.sol + '"/></g>');
      else if (cle === 'fa') parts.push('<g transform="translate(' + (x0 + 12) + ',' + f1(yLigneFa) + ') scale(' + SP + ')"><circle class="enc" cx="-0.55" cy="0" r="0.36"/><path class="trait cle" d="' + G.fa + '"/><circle class="enc" cx="1.55" cy="-0.5" r="0.21"/><circle class="enc" cx="1.55" cy="0.5" r="0.21"/></g>');
      else if (cle === 'ut') parts.push('<g transform="translate(' + (x0 + 8) + ',' + f1(y0 + 2 * SP) + ') scale(' + SP + ')"><path class="enc" d="M0,-2 H0.3 V2 H0 Z M0.55,-2 H0.7 V2 H0.55 Z"/><path class="trait cle fin" d="M0.8,0 C1.6,-0.9 2.4,-0.3 2.0,-0.9 M0.8,0 C1.6,0.9 2.4,0.3 2.0,0.9"/></g>');
      // armure
      let xa = x0 + 14 + 22;
      const n = spec.arm || 0;
      const cm = CLES[cle], pos = n >= 0 ? POS_DIESES : POS_BEMOLS;
      const nbAlt = Math.abs(n);
      for (let i = 0; i < nbAlt; i++) {
        const st = pos[i] + (cle === 'sol' ? 0 : cle === 'fa' ? -14 : (n > 0 ? -7 + (i === 0 || i === 2 || i === 4 || i === 6 ? 0 : 0) : -7));
        const stAj = cle === 'ut' ? pos[i] - 7 : st;
        const y = y0 + 4 * SP - (stAj - cm.bas) * SP / 2;
        parts.push('<g transform="translate(' + f1(xa + i * 8) + ',' + f1(y) + ') scale(' + SP + ')">' + (n > 0 ? glypheAlt['#'] : glypheAlt.b) + '</g>');
      }
      if (si === 0 && mes) {
        const xm = xa + nbAlt * 8 + 8;
        if (mes === 'C' || mes === '4/4c') parts.push('<g transform="translate(' + f1(xm) + ',' + f1(y0 + 2 * SP) + ') scale(' + SP + ')"><path class="trait gros" d="M0.7,-1.0 C-1.0,-1.6 -1.3,1.6 0.7,1.0"/></g>');
        else {
          const [a, b] = mes.split('/');
          parts.push('<text class="chiffre" x="' + f1(xm) + '" y="' + f1(y0 + 2 * SP - 1) + '" text-anchor="middle" font-size="' + SP * 2.55 + '">' + esc(a) + '</text><text class="chiffre" x="' + f1(xm) + '" y="' + f1(y0 + 4 * SP - 1) + '" text-anchor="middle" font-size="' + SP * 2.55 + '">' + esc(b) + '</text>');
        }
      }
    });
    if (piano) {
      parts.push('<line class="trait" x1="' + x0 + '" x2="' + x0 + '" y1="' + hautP[0] + '" y2="' + f1(bas) + '"/>');
      parts.push('<path class="accolade" d="M' + (x0 - 3) + ',' + hautP[0] + ' C' + (x0 - 9) + ',' + f1(hautP[0] + 2 * SP) + ' ' + (x0 - 7) + ',' + f1((hautP[0] + bas) / 2 - 2) + ' ' + (x0 - 10) + ',' + f1((hautP[0] + bas) / 2) + ' C' + (x0 - 7) + ',' + f1((hautP[0] + bas) / 2 + 2) + ' ' + (x0 - 9) + ',' + f1(bas - 2 * SP) + ' ' + (x0 - 3) + ',' + f1(bas) + '"/>');
    }
    // barres
    for (let i = sy[0]; i <= sy[1]; i++) {
      const c = col[i]; if (!c.bar) continue;
      const bx = X.get(i).barX;
      const st = c.barStyle;
      if (i === sy[0]) continue;
      parts.push('<line class="trait" x1="' + f1(bx) + '" x2="' + f1(bx) + '" y1="' + f1(hautP[0]) + '" y2="' + f1(bas) + '"/>');
      if (st === '||') parts.push('<line class="trait" x1="' + f1(bx + 3) + '" x2="' + f1(bx + 3) + '" y1="' + f1(hautP[0]) + '" y2="' + f1(bas) + '"/>');
      if (st === '|]') parts.push('<line class="trait gros2" x1="' + f1(bx + 4) + '" x2="' + f1(bx + 4) + '" y1="' + f1(hautP[0]) + '" y2="' + f1(bas) + '"/>');
    }
    if (derniere) { const fin = portees.some((p) => p.items.some((it) => it.k === 'bar' && it.style === '|]' && f1(it.t) === T[T.length - 1])); if (!fin && !spec.sansBarreFin) { /* pas de barre finale automatique */ } }
    if (!derniere) parts.push('<line class="trait" x1="' + f1(xFin) + '" x2="' + f1(xFin) + '" y1="' + f1(hautP[0]) + '" y2="' + f1(bas) + '"/>');

    // notes et silences
    portees.forEach((p, pi) => {
      const y0 = hautP[pi], cm = CLES[p.cle];
      const yDe = (st) => y0 + 4 * SP - (st - cm.bas) * SP / 2;
      const items = p.items.filter((it) => (it.k === 'n' || it.k === 'r') && colDe.get(f1(it.t)) >= sy[0] && colDe.get(f1(it.t)) <= sy[1]);
      const geom = new Map();
      // direction des pieds
      items.forEach((it) => {
        const cx = X.get(colDe.get(f1(it.t))).note + 0;
        const x = X.get(colDe.get(f1(it.t))).gauche + col[colDe.get(f1(it.t))].avant * k + (col[colDe.get(f1(it.t))].avant ? 0 : 0) + 6;
        it._x = X.get(colDe.get(f1(it.t))).note;
        if (it.k === 'n') {
          const sts = it.p.map((h) => h.st);
          const haut = Math.max(...sts), basS = Math.min(...sts);
          const loin = Math.abs(haut - cm.mid) >= Math.abs(basS - cm.mid) ? haut : basS;
          it.dirHaut = loin < cm.mid;
          if (p.cle !== 'sol' && p.cle !== 'fa' && p.cle !== 'ut') it.dirHaut = false;
          if (spec.pieds === 'haut') it.dirHaut = true; if (spec.pieds === 'bas') it.dirHaut = false;
        }
      });
      // groupes de ligatures
      const groupes = [];
      let cur = [];
      const fermer = () => { if (cur.length > 1) groupes.push(cur); cur = []; };
      items.forEach((it) => {
        const lig = it.k === 'n' && (it.forme === 'e' || it.forme === 's' || it.forme === 't') && !it.mystere;
        if (!lig) { fermer(); return; }
        if (cur.length) {
          const prev = cur[cur.length - 1];
          const mesureP = Math.floor(f1(prev.t + 1e-6) / (it.bat * 1));
          const mesureI = Math.floor(f1(it.t + 1e-6) / (it.bat * 1));
          const bar = p.items.some((b) => b.k === 'bar' && b.t > prev.t + 1e-6 && b.t <= it.t + 1e-6);
          const contigu = Math.abs(prev.t + prev.d - it.t) < 1e-6;
          if (bar || mesureP !== mesureI || !contigu) fermer();
        }
        cur.push(it);
      });
      fermer();
      const dansGroupe = new Map(); groupes.forEach((g) => g.forEach((it) => dansGroupe.set(it, g)));
      // direction commune dans un groupe
      groupes.forEach((g) => { const h = g.filter((it) => it.dirHaut).length; const dir = h * 2 >= g.length ? true : false; const moy = g.reduce((s, it) => s + (it.p.reduce((a, b2) => a + b2.st, 0) / it.p.length), 0) / g.length; const d2 = moy < cm.mid; g.forEach((it) => { it.dirHaut = d2; }); });

      items.forEach((it) => {
        const x = it._x;
        const cls = it.mark ? 'hi' : '';
        const gid = '<g class="ev' + (it.mark ? ' hi' : '') + '" data-i="' + it.idx + '">';
        if (it.k === 'r') {
          let s = gid + glypheSilence(it.forme, x, y0);
          for (let j = 0; j < it.pts; j++) s += '<circle class="enc" cx="' + f1(x + 0.9 * SP + j * 0.55 * SP) + '" cy="' + f1(y0 + 2.5 * SP - (it.forme === 'q' ? -0.2 * SP : 0.1 * SP)) + '" r="' + f1(0.2 * SP) + '"/>';
          parts.push(s + '</g>');
          if (it.sous) { parts.push('<text class="legende" x="' + f1(x) + '" y="' + f1(bas + 3.2 * SP) + '" text-anchor="middle" font-size="' + f1(SP * 1.05) + '">' + esc(it.sous) + '</text>'); touche(bas + 3.7 * SP); }
          if (it.dessus) { parts.push('<text class="chord" x="' + f1(x) + '" y="' + f1(hautP[0] - 1.6 * SP) + '" text-anchor="middle" font-size="' + f1(SP * 1.3) + '">' + esc(it.dessus) + '</text>'); touche(hautP[0] - 3 * SP); }
          return;
        }
        let s = gid;
        const sts = it.p.map((h) => h.st);
        const ys = it.p.map((h) => yDe(h.st));
        // tête déplacée pour les secondes
        const decalDroite = it.p.map(() => 0);
        for (let j = 1; j < it.p.length; j++) if (it.p[j].st - it.p[j - 1].st === 1 && !decalDroite[j - 1]) decalDroite[j] = it.dirHaut ? 1 : -1;
        if (!it.dirHaut) { /* pieds en bas : la tête déplacée est à gauche du pied → décalage vers la gauche du pied = côté droit visuel inversé */ }
        // lignes supplémentaires
        const haut = Math.max(...sts), basS = Math.min(...sts);
        const stHautLigne = cm.bas + 8, stBasLigne = cm.bas;
        for (let st = stHautLigne + 2; st <= haut; st += 2) { const y = yDe(st); s += '<line class="ligne sup" x1="' + f1(x - 1.35 * SP) + '" x2="' + f1(x + 1.35 * SP) + '" y1="' + f1(y) + '" y2="' + f1(y) + '"/>'; touche(y - SP); }
        for (let st = stBasLigne - 2; st >= basS; st -= 2) { const y = yDe(st); s += '<line class="ligne sup" x1="' + f1(x - 1.35 * SP) + '" x2="' + f1(x + 1.35 * SP) + '" y1="' + f1(y) + '" y2="' + f1(y) + '"/>'; touche(y + SP); }
        if (it.mystere) {
          s += '<text class="chord" x="' + f1(x) + '" y="' + f1(y0 + 2 * SP + 4) + '" text-anchor="middle" font-size="' + SP * 2 + '">?</text></g>';
          parts.push(s); return;
        }
        // altérations
        let xAcc = x - 1.2 * SP;
        const accs = it.p.map((h, j) => ({ h, y: ys[j] })).filter((o) => o.h.montre);
        let derY = null, niveau = 0;
        accs.slice().reverse().forEach((o, j) => {
          if (derY !== null && Math.abs(o.y - derY) < 3 * SP) niveau++; else niveau = 0;
          derY = o.y;
          const w = largAlt[o.h.montre] || 1;
          s += '<g transform="translate(' + f1(x - 1.15 * SP - niveau * 1.25 * SP - (w / 2) * SP * 0.55) + ',' + f1(o.y) + ') scale(' + SP + ')">' + glypheAlt[o.h.montre] + '</g>';
        });
        // têtes
        const forme = it.forme === 'w' ? 'w' : it.forme === 'h' ? 'h' : 'q';
        it.p.forEach((h, j) => {
          const dx = decalDroite[j] * 1.3 * SP * 0.92;
          s += tete(x + dx, ys[j], forme, '');
          for (let d = 0; d < it.pts; d++) {
            const yp = (h.st % 2 === 0) ? ys[j] - SP / 2 : ys[j];
            s += '<circle class="enc" cx="' + f1(x + dx + 1.1 * SP + d * 0.6 * SP) + '" cy="' + f1(yp) + '" r="' + f1(0.2 * SP) + '"/>';
          }
        });
        // pied
        const aPied = it.forme !== 'w';
        const yMax = Math.max(...ys), yMin = Math.min(...ys);
        const g = dansGroupe.get(it);
        if (aPied) {
          const xp = it.dirHaut ? x + 0.66 * SP : x - 0.66 * SP;
          const yDeb = it.dirHaut ? yMax : yMin;
          let yFin;
          if (g) {
            const tousY = g.flatMap((q) => q.p.map((h) => yDe(h.st)));
            const nb = Math.max(...g.map((q) => (q.forme === 's' ? 2 : q.forme === 't' ? 3 : 1)));
            const marge = (3.1 + (nb - 1) * 0.75) * SP;
            yFin = it.dirHaut ? Math.min(...tousY) - marge : Math.max(...tousY) + marge;
            it._yFinGroupe = yFin;
          } else {
            const longueur = 3.4 * SP;
            yFin = it.dirHaut ? yMin - longueur : yMax + longueur;
            if (it.dirHaut && yFin > y0 + 2 * SP) yFin = y0 + 2 * SP;      // le pied rejoint au moins la ligne du milieu
            if (!it.dirHaut && yFin < y0 + 2 * SP) yFin = y0 + 2 * SP;
          }
          it._xp = xp; it._yFin = yFin;
          s += '<line class="pied" x1="' + f1(xp) + '" x2="' + f1(xp) + '" y1="' + f1(yDeb) + '" y2="' + f1(yFin) + '"/>';
          touche(yFin - SP * 0.3); touche(yFin + SP * 0.3);
          if (!g) {
            const nfl = it.forme === 'e' ? 1 : it.forme === 's' ? 2 : it.forme === 't' ? 3 : 0;
            if (nfl) s += drapeau(xp, yFin, !it.dirHaut ? false : true, nfl).replace(/translate\(([\d.\-]+),([\d.\-]+)\)/g, (m0, a, b) => 'translate(' + a + ',' + b + ')');
          }
        }
        s += '</g>';
        parts.push(s);
        // textes
        if (it.sous || noms) {
          const lab = it.sous || it.p.map((h) => NOMS_FR[LETTRES.indexOf(h.lettre)] + (h.alt === 1 ? '♯' : h.alt === -1 ? '♭' : h.alt === 2 ? '𝄪' : h.alt === -2 ? '♭♭' : '')).join(' ');
          parts.push('<text class="legende" x="' + f1(x) + '" y="' + f1(bas + 3.2 * SP + (pi === portees.length - 1 ? 0 : 0)) + '" text-anchor="middle" font-size="' + f1(SP * 1.05) + '">' + esc(lab) + '</text>'); touche(bas + 3.8 * SP);
        }
        if (it.dessus) { parts.push('<text class="chord" x="' + f1(x) + '" y="' + f1(Math.min(hautP[0], minY + SP) - 0.4 * SP) + '" text-anchor="middle" font-size="' + f1(SP * 1.3) + '">' + esc(it.dessus) + '</text>'); touche(hautP[0] - 3.2 * SP); }
      });
      // ligatures
      groupes.forEach((g) => {
        const a = g[0], b = g[g.length - 1];
        const haut = a.dirHaut;
        const xa = a._xp, xb = b._xp, yb = a._yFinGroupe;
        const ep = 0.5 * SP;
        const sens = haut ? 1 : -1;
        const barre = (xs, xe, niv) => { const yy = yb + sens * niv * 0.78 * SP; return '<polygon class="enc" points="' + f1(xs) + ',' + f1(yy) + ' ' + f1(xe) + ',' + f1(yy) + ' ' + f1(xe) + ',' + f1(yy + sens * ep) + ' ' + f1(xs) + ',' + f1(yy + sens * ep) + '"/>'; };
        let s2 = barre(xa - 0.04 * SP, xb + 0.06 * SP, 0);
        const niveau = (q) => (q.forme === 's' ? 2 : q.forme === 't' ? 3 : 1);
        for (let nv = 2; nv <= 3; nv++) {
          let i = 0;
          while (i < g.length) {
            if (niveau(g[i]) >= nv) {
              let j = i; while (j + 1 < g.length && niveau(g[j + 1]) >= nv) j++;
              if (j > i) s2 += barre(g[i]._xp, g[j]._xp + 0.06 * SP, nv - 1);
              else { const sTub = i > 0 ? -1 : 1; const xs = g[i]._xp; s2 += barre(sTub < 0 ? xs - 1.1 * SP : xs, sTub < 0 ? xs : xs + 1.1 * SP, nv - 1); }
              i = j + 1;
            } else i++;
          }
        }
        parts.push(s2); touche(yb - sens * 0 + (haut ? -SP : SP));
      });
      // liaisons de prolongation
      items.forEach((it, i) => {
        if (it.k === 'n' && it.tie) {
          const suiv = p.items.find((q) => q.k === 'n' && q.t >= it.t + it.d - 1e-6 && colDe.get(f1(q.t)) <= sy[1] + 1);
          if (suiv && colDe.get(f1(suiv.t)) <= sy[1]) {
            const x1 = it._x + 0.9 * SP, x2 = suiv._x - 0.9 * SP;
            const dessous = it.dirHaut === false ? false : true;
            const yy = (dessous ? Math.max(...it.p.map((h) => yDe(h.st))) + 0.7 * SP : Math.min(...it.p.map((h) => yDe(h.st))) - 0.7 * SP);
            const cy = yy + (dessous ? 1.3 : -1.3) * SP;
            parts.push('<path class="trait lie" d="M' + f1(x1) + ',' + f1(yy) + ' Q' + f1((x1 + x2) / 2) + ',' + f1(cy) + ' ' + f1(x2) + ',' + f1(yy) + '"/>'); touche(cy + (dessous ? SP : -SP));
          } else if (suiv === undefined) { /* liaison vers la ligne suivante : ignorée */ }
        }
      });
      // liaisons de phrasé ( … )
      const ld = p.items.filter((q) => q.k === 'lieDeb'), lf = p.items.filter((q) => q.k === 'lieFin');
      ld.forEach((d, i) => {
        const f = lf[i]; if (!f) return;
        const ns = p.items.filter((q) => q.k === 'n' && q.t >= d.t - 1e-6 && q.t < f.t + 1e-6 && colDe.get(f1(q.t)) >= sy[0] && colDe.get(f1(q.t)) <= sy[1]);
        if (ns.length < 2) return;
        const a = ns[0], b = ns[ns.length - 1];
        const dessous = a.dirHaut !== false;
        const ysN = ns.map((q) => q.p.map((h) => yDe(h.st))).flat();
        const yy = dessous ? Math.max(...ysN) + 1.2 * SP : Math.min(...ysN) - 1.2 * SP;
        const cy = yy + (dessous ? 1.6 : -1.6) * SP;
        parts.push('<path class="trait lie" d="M' + f1(a._x) + ',' + f1(yy) + ' Q' + f1((a._x + b._x) / 2) + ',' + f1(cy) + ' ' + f1(b._x) + ',' + f1(yy) + '"/>'); touche(cy + (dessous ? SP : -SP));
      });
      // triolets
      p.items.forEach((it) => {
        if (it.tupDeb && colDe.get(f1(it.t)) >= sy[0] && colDe.get(f1(it.tupDeb.fin.t)) <= sy[1]) {
          const a = it, b = it.tupDeb.fin;
          const ds = a.dirHaut === false && b.dirHaut === false;
          const toutes = p.items.filter((q) => q.k === 'n' && q.t >= a.t - 1e-6 && q.t <= b.t + 1e-6);
          const ysN = toutes.flatMap((q) => q.p.map((h) => yDe(h.st)).concat(q._yFin !== undefined ? [q._yFin] : []));
          const dessus = !(toutes.every((q) => q.dirHaut === false) && toutes.length);
          const yy = dessus ? Math.min(...ysN) - 1.1 * SP : Math.max(...ysN) + 1.1 * SP;
          const xa = (a._x) - 0.6 * SP, xb = (b._x) + 0.9 * SP;
          parts.push('<path class="trait fin" d="M' + f1(xa) + ',' + f1(yy + (dessus ? 0.6 : -0.6) * SP) + ' V' + f1(yy) + ' H' + f1((xa + xb) / 2 - 0.9 * SP) + ' M' + f1((xa + xb) / 2 + 0.9 * SP) + ',' + f1(yy) + ' H' + f1(xb) + ' V' + f1(yy + (dessus ? 0.6 : -0.6) * SP) + '"/><text class="chord" x="' + f1((xa + xb) / 2) + '" y="' + f1(yy + 0.45 * SP) + '" text-anchor="middle" font-size="' + f1(SP * 1.15) + '" font-style="italic">' + a.tupDeb.n + '</text>');
          touche(yy + (dessus ? -SP : SP));
        }
      });
    });
    const vbY = Math.floor(minY - 4), vbH = Math.ceil(maxY - minY + 8);
    const echelle = spec.echelle || 1;
    return '<svg class="portee" xmlns="http://www.w3.org/2000/svg" viewBox="0 ' + vbY + ' ' + f1(largeurSvg) + ' ' + vbH + '" style="width:' + f1(Math.min(100, (largeurSvg / largeurDispo) * 100 * echelle)) + '%;max-width:' + f1(largeurSvg * 1.25 * echelle) + 'px" role="img" aria-label="' + esc(spec.titre || 'Extrait de partition') + '">' + parts.join('') + '</svg>';
  }

  racine.Portee = { rendre, evenements, midi, nomFr, nomMidi, parseHauteur, NOMS_FR, SP, armureAlt, LETTRES, ORDRE_DIESES, ORDRE_BEMOLS };
})(typeof self !== 'undefined' ? self : this);
