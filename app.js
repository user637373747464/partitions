/* app.js — l'application : accueil, cours, exercices, cartes, progression, réglages. */
(function () {
  'use strict';
  const P = self.Portee, E = self.Exo, S = self.Store, C = self.Contenu, Son = self.Son;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (t) => String(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<i>$2</i>');
  const vue = $('vue'), titreEl = $('titre'), retourBtn = $('retour');
  const plur = (n, a, b) => n + ' ' + (n > 1 ? b : a);

  /* ---------- navigation ---------- */
  const ONGLETS = [
    ['accueil', 'Accueil', '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'],
    ['cours', 'Cours', '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M9 7h6M9 11h6"/>'],
    ['exos', 'S’entraîner', '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>'],
    ['cartes', 'Cartes', '<rect x="3" y="7" width="14" height="12" rx="2"/><path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>'],
    ['plus', 'Plus', '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'],
  ];
  $('onglets').innerHTML = ONGLETS.map(([id, nom, ic]) => '<button data-o="' + id + '" aria-label="' + nom + '"><svg viewBox="0 0 24 24">' + ic + '</svg>' + nom + '</button>').join('');
  let onglet = 'accueil', pile = [];
  const VUES = {};
  function aller(v, args, opt) {
    if (pile.length) pile[pile.length - 1].scroll = vue.scrollTop;
    Son.arreter();
    pile.push({ v, args: args || {} });
    rendre();
  }
  function retour() { if (pile.length <= 1) return; Son.arreter(); pile.pop(); rendre(true); }
  function racineOnglet(o) { onglet = o; pile = [{ v: o, args: {} }]; rendre(); }
  function rendre(restaurer) {
    const cur = pile[pile.length - 1];
    document.querySelectorAll('#onglets button').forEach((b) => b.classList.toggle('on', b.dataset.o === onglet));
    retourBtn.classList.toggle('vide', pile.length <= 1);
    vue.innerHTML = '';
    const r = VUES[cur.v](cur.args) || {};
    titreEl.textContent = r.titre || 'Partition';
    if (r.html != null) vue.innerHTML = r.html;
    r.apres && r.apres(vue);
    vue.scrollTop = restaurer ? (cur.scroll || 0) : 0;
  }
  $('onglets').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { Son.init(); racineOnglet(b.dataset.o); } });
  retourBtn.addEventListener('click', retour);
  let tToast = null;
  function toast(t) { const e = $('toast'); e.textContent = t; e.classList.remove('cache'); clearTimeout(tToast); tToast = setTimeout(() => e.classList.add('cache'), 2200); }
  document.addEventListener('pointerdown', () => Son.init(), { once: true });

  /* ---------- données du cours ---------- */
  const toutes = () => C.toutesLecons();
  const lecon = (id) => toutes().find((l) => l.id === id);
  function prochaine() { return toutes().find((l) => !S.leconFaite(l.id)) || null; }
  function cartesDe(l) { return (l.cartes || []).map((c, i) => Object.assign({ id: l.id + '#' + i, lecon: l.id, volume: l.volumeId }, c)); }
  const toutesCartes = () => toutes().flatMap(cartesDe);
  function cartesEligibles() { return toutesCartes().filter((c) => S.leconFaite(c.lecon)); }   // une carte apparaît quand la leçon est terminée
  const minutesTxt = (m) => (m >= 60 ? Math.floor(m / 60) + ' h ' + String(Math.round(m % 60)).padStart(2, '0') : Math.round(m) + ' min');

  /* ---------- accueil ---------- */
  VUES.accueil = () => {
    const l = prochaine(), t = toutes(), faites = t.filter((x) => S.leconFaite(x.id)).length;
    const cc = cartesEligibles(), ids = cc.map((c) => c.id), { dues, nouvelles } = S.cartesDues(ids);
    const aRevoir = dues.length + Math.min(10, nouvelles.length);
    const totalMin = t.reduce((a, x) => a + (x.duree || 0), 0), faitMin = t.filter((x) => S.leconFaite(x.id)).reduce((a, x) => a + (x.duree || 0), 0);
    let h = '<h2>Partition</h2><p class="sous">Le solfège et la théorie du piano, de zéro.</p>';
    h += '<div class="stat"><div><b>' + S.serie() + '</b><span>jours de suite</span></div><div><b>' + faites + '</b><span>leçons faites</span></div><div><b>' + aRevoir + '</b><span>cartes du jour</span></div></div>';
    if (l) h += '<button class="carte plein" data-go="lecon:' + l.id + '"><b>' + (faites ? 'Continuer' : 'Commencer') + ' : ' + esc(l.titre) + '</b><span>' + esc(l.chapitreTitre) + ' · environ ' + l.duree + ' min</span></button>';
    else h += '<div class="carte"><b>Tout le contenu disponible est terminé.</b><span>Bravo. Les prochains volumes arriveront dans une mise à jour.</span></div>';
    if (aRevoir) h += '<button class="carte" data-go="session-cartes:jour"><b>Réviser les cartes du jour</b><span>' + plur(dues.length, 'carte à revoir', 'cartes à revoir') + (nouvelles.length ? ' + ' + plur(Math.min(10, nouvelles.length), 'nouvelle', 'nouvelles') : '') + '</span></button>';
    h += '<button class="carte" data-go="exo-mix"><b>Série d’exercices rapide</b><span>Dix questions mélangées sur ce que tu as déjà vu.</span></button>';
    h += '<h3>Ta progression</h3><div class="barre"><i style="width:' + (totalMin ? Math.round(faitMin / totalMin * 100) : 0) + '%"></i></div><p class="sous" style="margin-top:6px">' + minutesTxt(faitMin) + ' de cours faits sur ' + minutesTxt(totalMin) + ' disponibles · temps passé dans l’appli : ' + minutesTxt(S.heures() * 60) + '</p>';
    return { titre: 'Accueil', html: h, apres: liens };
  };
  function liens(el) {
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { const [v, a] = b.dataset.go.split(':'); aller(v, a ? { id: a } : {}); }));
  }

  /* ---------- cours ---------- */
  VUES.cours = () => {
    let h = '<h2>Cours</h2><p class="sous">Cinq volumes, du premier son jusqu’à l’analyse d’une partition.</p>';
    C.volumes.forEach((v) => {
      const ls = v.chapitres.flatMap((c) => c.lecons), faites = ls.filter((l) => S.leconFaite(l.id)).length;
      const min = ls.reduce((a, l) => a + (l.duree || 0), 0);
      if (ls.length) h += '<button class="carte" data-go="volume:' + v.id + '"><b>' + esc(v.titre) + '</b><span>' + esc(v.sous) + '</span><span style="margin-top:6px">' + ls.length + ' leçons · environ ' + minutesTxt(min) + ' · ' + faites + ' faite' + (faites > 1 ? 's' : '') + '</span><div class="barre"><i style="width:' + Math.round(faites / ls.length * 100) + '%"></i></div></button>';
      else h += '<div class="carte" style="opacity:.62"><b>' + esc(v.titre) + '</b><span>' + esc(v.sous) + '</span><span style="margin-top:6px">À venir : ' + esc(v.plan || '') + '</span></div>';
    });
    return { titre: 'Cours', html: h, apres: liens };
  };
  VUES.volume = (a) => {
    const v = C.volumes.find((x) => x.id === a.id);
    let h = '<h2>' + esc(v.titre) + '</h2><p class="sous">' + esc(v.sous) + '</p>';
    v.chapitres.forEach((c) => {
      h += '<div class="chap">' + esc(c.titre) + '</div><ul class="liste-l">';
      c.lecons.forEach((l, i) => { h += '<li data-go="lecon:' + l.id + '" class="' + (S.leconFaite(l.id) ? 'fait' : '') + '"><span class="num">' + (S.leconFaite(l.id) ? '✓' : l.num) + '</span><div><b>' + esc(l.titre) + '</b><small>' + l.duree + ' min</small></div></li>'; });
      h += '</ul>';
    });
    return { titre: v.titre, html: h, apres: (el) => el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { const [vv, id] = b.dataset.go.split(':'); aller(vv, { id }); })) };
  };

  /* ---------- une leçon ---------- */
  const IC_ECOUTE = '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>';
  const IC_STOP = '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg>';
  function figure(spec, leg, extra) {
    const ev = P.evenements(spec).filter((e) => e.midis.length);
    return '<div class="fig' + (extra ? ' ' + extra : '') + '" data-score="1">' + (ev.length && spec.ecoute !== false ? '<button class="ecoute" aria-label="Écouter">' + IC_ECOUTE + '</button>' : '') + P.rendre(spec) + (leg ? '<div class="leg">' + fmt(leg) + '</div>' : '') + '</div>';
  }
  function lierFigure(el, spec) {
    const b = el.querySelector('.ecoute'); if (!b) return;
    let joue = false;
    b.addEventListener('click', () => {
      if (joue) { Son.arreter(); return; }
      joue = true; b.innerHTML = IC_STOP;
      const evts = P.evenements(spec);
      Son.jouer(evts, { bpm: spec.bpm || S.reglages.bpm || 80,
        onEv: (idx, fus) => { el.querySelectorAll('.ev.joue').forEach((x) => x.classList.remove('joue')); if (idx != null) { [idx].concat(fus || []).forEach((k) => { const g = el.querySelector('.ev[data-i="' + k + '"]'); if (g) g.classList.add('joue'); }); } },
        onFin: () => { joue = false; b.innerHTML = IC_ECOUTE; el.querySelectorAll('.ev.joue').forEach((x) => x.classList.remove('joue')); } });
    });
  }
  const midiDe = (x) => (typeof x === 'number' ? x : P.midi(x));
  function blocHTML(b, posts, ctxL) {
    switch (b.t) {
      case 'h': return '<h3>' + fmt(b.x) + '</h3>';
      case 'p': return '<p>' + fmt(b.x) + '</p>';
      case 'def': return '<div class="def"><span class="tag">' + esc(b.tag || 'Définition') + '</span><p>' + fmt(b.x) + '</p></div>';
      case 'rem': return '<div class="rem"><span class="tag">' + esc(b.tag || 'À retenir') + '</span><p>' + fmt(b.x) + '</p></div>';
      case 'ex': return '<div class="rem" style="border-color:var(--gris)"><span class="tag" style="color:var(--gris)">' + esc(b.tag || 'Exemple') + '</span><p>' + fmt(b.x) + '</p></div>';
      case 'liste': return (b.num ? '<ol>' : '<ul>') + b.x.map((x) => '<li>' + fmt(x) + '</li>').join('') + (b.num ? '</ol>' : '</ul>');
      case 'tableau': return '<table>' + (b.entete ? '<tr>' + b.entete.map((x) => '<th>' + fmt(x) + '</th>').join('') + '</tr>' : '') + b.lignes.map((r) => '<tr>' + r.map((x) => '<td>' + fmt(x) + '</td>').join('') + '</tr>').join('') + '</table>';
      case 'score': { const id = 'f' + Math.random().toString(36).slice(2, 8); posts.push((el) => { const f = el.querySelector('[data-fid="' + id + '"]'); lierFigure(f, b); }); return figure(b, b.legende).replace('data-score="1"', 'data-fid="' + id + '"'); }
      case 'clavier': { const id = 'k' + Math.random().toString(36).slice(2, 8); posts.push((el) => {
        const f = el.querySelector('[data-kid="' + id + '"]'); const marques = {}; (b.marque || []).forEach((m) => { marques[midiDe(m)] = 'm'; });
        Clavier.creer(f.querySelector('.kb'), { de: b.de, a: b.a, noms: b.noms === undefined ? 'do' : b.noms, marques, surClic: () => {} });
        const g = f.querySelector('[data-jouer]'); if (g) g.addEventListener('click', () => { (b.jouer || []).forEach((m, i) => setTimeout(() => Son.note(midiDe(m), 0.9, 0.85), i * 520)); });
      }); return '<div class="fig" data-kid="' + id + '"><div class="kb"></div>' + (b.jouer ? '<div style="margin-top:8px"><button class="btn petit" data-jouer="1">▶ Écouter</button></div>' : '') + (b.legende ? '<div class="leg">' + fmt(b.legende) + '</div>' : '') + '</div>'; }
      case 'qcm': { const id = 'q' + Math.random().toString(36).slice(2, 8); posts.push((el) => { E.monter(el.querySelector('[data-qid="' + id + '"]'), { gen: 'qcm', params: { questions: b.questions }, n: b.questions.length, titre: b.titre || 'Vérifie ta compréhension', onFin: (r) => ctxL.exoFini(r) }); }); return '<div data-qid="' + id + '"></div>'; }
      case 'exo': { const id = 'e' + Math.random().toString(36).slice(2, 8); posts.push((el) => { E.monter(el.querySelector('[data-eid="' + id + '"]'), { gen: b.gen, params: b.params || {}, n: b.n || 6, titre: b.titre || 'Exercice', onFin: (r) => ctxL.exoFini(r) }); }); return '<div data-eid="' + id + '"></div>'; }
      case 'rythme': { const id = 'r' + Math.random().toString(36).slice(2, 8); posts.push((el) => { E.monterRythme(el.querySelector('[data-rid="' + id + '"]'), { s: b.s, mes: b.mes, bpm: b.bpm || 76, titre: b.titre, consigne: b.consigne, clef: b.clef, onFin: (r) => ctxL.exoFini({ pct: r.pct }) }); }); return '<div data-rid="' + id + '"></div>'; }
      case 'son': { const id = 's' + Math.random().toString(36).slice(2, 8); posts.push((el) => { el.querySelectorAll('[data-sid="' + id + '"] button').forEach((x) => x.addEventListener('click', () => { const m = midiDe(x.dataset.n); Son.note(m, 1.3, 0.85); })); }); return '<div class="sel" data-sid="' + id + '">' + b.notes.map((n) => '<button data-n="' + esc(n) + '">' + esc(b.noms ? b.noms[b.notes.indexOf(n)] : P.nomFr(n)) + '</button>').join('') + '</div>' + (b.legende ? '<p class="sous">' + fmt(b.legende) + '</p>' : ''); }
      case 'video': return '<a class="video" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(b.rech) + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M10 8l6 4-6 4z"/><rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><div><b>' + esc(b.titre || 'Voir des vidéos sur ce sujet') + '</b><span>Recherche YouTube : « ' + esc(b.rech) + ' »</span></div></a>';
      default: return '';
    }
  }
  VUES.lecon = (a) => {
    const l = lecon(a.id);
    const posts = [], ctxL = { exoFini: () => {} };
    let h = '<div class="lecon"><div class="chap">' + esc(l.chapitreTitre) + ' · leçon ' + l.num + '</div><h2>' + esc(l.titre) + '</h2><p class="sous">Environ ' + l.duree + ' minutes' + (l.objectifs ? '' : '') + '</p>';
    if (l.objectifs) h += '<div class="def"><span class="tag">Objectifs</span><ul style="margin:6px 0">' + l.objectifs.map((o) => '<li>' + fmt(o) + '</li>').join('') + '</ul></div>';
    h += l.blocs.map((b) => blocHTML(b, posts, ctxL)).join('');
    if (l.videos && l.videos.length) { h += '<h3>Pour aller plus loin</h3>' + l.videos.map((v) => blocHTML({ t: 'video', rech: v.rech, titre: v.titre }, posts, ctxL)).join(''); }
    h += '<div id="mes-videos"></div><div class="hr"></div>';
    const faite = S.leconFaite(l.id);
    h += '<div class="ligne-btn" style="justify-content:center">' + (faite ? '<button class="btn" data-act="annuler">Leçon terminée ✓ (annuler)</button>' : '<button class="btn plein" data-act="finir">J’ai terminé cette leçon</button>') + '</div>';
    const nxt = (() => { const t = toutes(), i = t.findIndex((x) => x.id === l.id); return t[i + 1] || null; })();
    h += '</div>';
    return { titre: l.titre, html: h, apres: (el) => {
      posts.forEach((f) => f(el));
      const cont = el.querySelector('.lecon');
      el.querySelectorAll('[data-act=finir]').forEach((b) => b.addEventListener('click', () => {
        S.finirLecon(l.id); const nc = (l.cartes || []).length;
        toast('Leçon terminée' + (nc ? ' · ' + plur(nc, 'carte ajoutée', 'cartes ajoutées') + ' à tes révisions' : ''));
        if (nxt) aller('lecon', { id: nxt.id }); else retour();
      }));
      el.querySelectorAll('[data-act=annuler]').forEach((b) => b.addEventListener('click', () => { S.defaireLecon(l.id); rendre(true); }));
      mesVideos(el.querySelector('#mes-videos'), l);
    } };
  };
  function mesVideos(box, l) {
    const dessiner = () => {
      const vs = S.videos(l.id);
      box.innerHTML = '<h3>Mes vidéos</h3>' + (vs.length ? vs.map((u, i) => '<div class="video"><svg viewBox="0 0 24 24"><path d="M10 8l6 4-6 4z"/><rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><a href="' + esc(u) + '" target="_blank" rel="noopener" style="flex:1;min-width:0;color:inherit;text-decoration:none"><b style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(u.replace(/^https?:\/\/(www\.)?/, '')) + '</b></a><button data-i="' + i + '" aria-label="Retirer" style="font-size:20px;color:var(--gris)">×</button></div>').join('') : '<p class="sous">Colle ici le lien d’une vidéo qui t’a aidée.</p>') + '<button class="btn petit" data-act="coller">Coller un lien YouTube</button>';
      box.querySelector('[data-act=coller]').addEventListener('click', async () => {
        let t = '';
        try { t = ((await navigator.clipboard.readText()) || '').trim(); } catch (e) { t = (prompt('Colle ton lien ici') || '').trim(); }
        if (!/^https?:\/\//i.test(t)) { toast('Copie d’abord un lien (https://…)'); return; }
        S.ajouterVideo(l.id, t); dessiner(); toast('Vidéo ajoutée');
      });
      box.querySelectorAll('button[data-i]').forEach((b) => b.addEventListener('click', () => { S.retirerVideo(l.id, +b.dataset.i); dessiner(); }));
    };
    dessiner();
  }

  /* ---------- s'entraîner ---------- */
  const LISTE_EXO = [
    { id: 'nom-sol', titre: 'Lire les notes — clé de sol', sous: 'Reconnaître le nom d’une note sur la portée.', gen: 'note-nom', niveaux: [['Sur la portée (mi à sol)', { clef: 'sol', lo: 'e4', hi: 'g5' }], ['Portée + une note au-dessus/dessous', { clef: 'sol', lo: 'c4', hi: 'b5' }], ['Avec lignes supplémentaires', { clef: 'sol', lo: 'g3', hi: 'e6' }]] },
    { id: 'nom-fa', titre: 'Lire les notes — clé de fa', sous: 'Même exercice pour la main gauche.', gen: 'note-nom', niveaux: [['Sur la portée (sol à la)', { clef: 'fa', lo: 'g2', hi: 'a3' }], ['Portée + une note au-dessus/dessous', { clef: 'fa', lo: 'e2', hi: 'c4' }], ['Avec lignes supplémentaires', { clef: 'fa', lo: 'c2', hi: 'e4' }]] },
    { id: 'nom-2', titre: 'Lire les notes — les deux clés', sous: 'Clé de sol et clé de fa mélangées, comme au piano.', gen: 'note-nom', niveaux: [['Sur les portées', { clef: 'les-deux', lo: 'e4', hi: 'g5' }], ['Étendu', { clef: 'les-deux', lo: 'c4', hi: 'b5' }]] },
    { id: 'clav-sol', titre: 'Trouver la note au clavier', sous: 'Une note est écrite : touche-la sur le clavier.', gen: 'note-clavier', niveaux: [['Clé de sol', { clef: 'sol', lo: 'c4', hi: 'c6' }], ['Clé de fa', { clef: 'fa', lo: 'c2', hi: 'c4' }], ['Les deux clés', { clef: 'les-deux', lo: 'c4', hi: 'c5' }]] },
    { id: 'nom-clav', titre: 'Un nom, une touche', sous: 'On te donne un nom (sol 3, ré 4…), tu touches la bonne touche.', gen: 'nom-clavier', niveaux: [['Autour du do central', { lo: 'c4', hi: 'b4' }], ['Deux octaves', { lo: 'c3', hi: 'b5' }]] },
    { id: 'duree', titre: 'Reconnaître les durées', sous: 'Ronde, blanche, noire, croche…', gen: 'duree', niveaux: [['Ronde à croche', { formes: ['w', 'h', 'q', 'e'] }], ['Avec double-croche', { formes: ['w', 'h', 'q', 'e', 's'] }], ['Avec points', { formes: ['h', 'q', 'e', 's'], points: true }]] },
    { id: 'silences', titre: 'Reconnaître les silences', sous: 'Pause, demi-pause, soupir…', gen: 'duree', niveaux: [['Pause à soupir', { formes: ['w', 'h', 'q'], silences: 'seuls' }], ['Tous les silences', { formes: ['w', 'h', 'q', 'e', 's'], silences: 'seuls' }]] },
    { id: 'valeurs', titre: 'Calculer une durée', sous: 'Combien de temps dure cette note ?', gen: 'valeur', niveaux: [['Notes', { formes: ['w', 'h', 'q', 'e'] }], ['Avec points et silences', { formes: ['w', 'h', 'q', 'e', 's'], points: true, silences: true }]] },
    { id: 'alt', titre: 'Dièses et bémols', sous: 'Nommer une note altérée, ou la trouver sur les touches noires.', gen: 'alt-nom', niveaux: [['Nommer', {}]] },
    { id: 'alt-clav', titre: 'Touches noires', sous: 'Trouve le dièse ou le bémol au clavier.', gen: 'alt-clavier', niveaux: [['Un peu de tout', {}]] },
    { id: 'interv', titre: 'Intervalles (numéro)', sous: 'Seconde, tierce, quarte…', gen: 'intervalle', niveaux: [['Jusqu’à la quinte', { max: 5 }], ['Jusqu’à l’octave', { max: 8 }], ['Montants et descendants', { max: 8, desc: 0.45 }]] },
    { id: 'armures', titre: 'Armures majeures', sous: 'Quelle tonalité correspond à ces dièses ou bémols ?', gen: 'armure', niveaux: [['Jusqu’à 3 altérations', { max: 3 }], ['Toutes', { max: 7 }]] },
    { id: 'armures-min', titre: 'Armures mineures', sous: 'La tonalité mineure relative.', gen: 'armure', niveaux: [['Jusqu’à 3 altérations', { max: 3, mode: 'min' }], ['Toutes', { max: 7, mode: 'min' }]] },
    { id: 'oreille', titre: 'Oreille : plus aigu ou plus grave ?', sous: 'Deux notes, laquelle est la plus haute ?', gen: 'ecoute-sens', niveaux: [['Écouter', {}]] },
  ];
  const COMP_NOMS = { 'lecture-sol': 'Lecture en clé de sol', 'lecture-fa': 'Lecture en clé de fa', 'clavier-sol': 'Clavier : notes en clé de sol', 'clavier-fa': 'Clavier : notes en clé de fa', 'clavier-nom': 'Clavier : noms des notes', durees: 'Durées des notes', silences: 'Silences', valeurs: 'Valeurs et calcul de durées', alterations: 'Dièses et bémols', 'alt-clavier': 'Touches noires', intervalles: 'Intervalles', armures: 'Armures', oreille: 'Oreille', rythme: 'Rythme', theorie: 'Questions de théorie' };
  VUES.exos = () => {
    let h = '<h2>S’entraîner</h2><p class="sous">Séries de dix questions. Choisis ton niveau. Tout est enregistré dans « Progression ».</p>';
    h += '<button class="carte plein" data-go="exo-mix"><b>Série mélangée</b><span>Dix questions variées sur ce que tu as appris.</span></button>';
    h += '<button class="carte" data-go="exo-rythme"><b>Rythme à taper</b><span>Un rythme est écrit, un métronome te guide, tu le tapes sur l’écran.</span></button>';
    LISTE_EXO.forEach((x) => { h += '<button class="carte" data-go="exo:' + x.id + '"><b>' + esc(x.titre) + '</b><span>' + esc(x.sous) + '</span></button>'; });
    return { titre: 'S’entraîner', html: h, apres: liens };
  };
  VUES.exo = (a) => {
    const x = LISTE_EXO.find((y) => y.id === a.id), niv = a.niv != null ? a.niv : null;
    if (niv == null) {
      let h = '<h2>' + esc(x.titre) + '</h2><p class="sous">' + esc(x.sous) + '</p><div class="chap">Niveau</div>' + x.niveaux.map((n, i) => '<button class="carte" data-niv="' + i + '"><b>' + esc(n[0]) + '</b></button>').join('');
      return { titre: x.titre, html: h, apres: (el) => el.querySelectorAll('[data-niv]').forEach((b) => b.addEventListener('click', () => { pile.pop(); aller('exo', { id: a.id, niv: +b.dataset.niv }); })) };
    }
    return { titre: x.titre, html: '<div id="zone-exo"></div>', apres: (el) => E.monter(el.querySelector('#zone-exo'), { gen: x.gen, params: Object.assign({}, x.niveaux[niv][1]), n: 10, titre: x.niveaux[niv][0] }) };
  };
  VUES['exo-mix'] = () => {
    const f = new Set(toutes().filter((l) => S.leconFaite(l.id)).map((l) => l.id));
    const dispo = (id) => (C.exoMix ? C.exoMix(f) : null);
    const gens = C.exoMix(f);
    return { titre: 'Série mélangée', html: '<div id="zone-exo"></div>', apres: (el) => {
      E.monter(el.querySelector('#zone-exo'), { gen: () => { const g = E.pick(gens); const q = E.GEN[g.gen](Object.assign({}, g.params)); return q; }, params: {}, n: 10, titre: 'Série mélangée' });
    } };
  };
  VUES['exo-rythme'] = (a) => {
    const R = C.rythmes || [];
    if (!R.length) return { titre: 'Rythme', html: '<p class="vide">Pas encore de rythmes.</p>' };
    let h = '<h2>Rythme à taper</h2><p class="sous">Choisis une difficulté.</p>';
    if (a.i == null) {
      h += R.map((r, i) => '<button class="carte" data-i="' + i + '"><b>' + esc(r.titre) + '</b><span>' + esc(r.mes) + ' · ' + r.bpm + ' à la noire</span></button>').join('');
      return { titre: 'Rythme à taper', html: h, apres: (el) => el.querySelectorAll('[data-i]').forEach((b) => b.addEventListener('click', () => { pile.pop(); aller('exo-rythme', { i: +b.dataset.i }); })) };
    }
    const r = R[a.i];
    return { titre: r.titre, html: '<div id="zone-exo"></div>', apres: (el) => E.monterRythme(el.querySelector('#zone-exo'), { s: r.s, mes: r.mes, bpm: r.bpm, titre: r.titre }) };
  };

  /* ---------- cartes ---------- */
  VUES.cartes = () => {
    const cc = cartesEligibles(), ids = cc.map((c) => c.id), { dues, nouvelles } = S.cartesDues(ids);
    const toutC = toutesCartes();
    let h = '<h2>Cartes</h2><p class="sous">Les cartes d’une leçon s’ajoutent quand tu la termines. Celles que tu rates reviennent plus souvent.</p>';
    h += '<div class="stat"><div><b>' + dues.length + '</b><span>à revoir</span></div><div><b>' + nouvelles.length + '</b><span>nouvelles</span></div><div><b>' + cc.length + '</b><span>cartes actives</span></div></div>';
    if (dues.length + nouvelles.length) h += '<button class="carte plein" data-go="session-cartes:jour"><b>Réviser maintenant</b><span>' + plur(dues.length, 'carte à revoir', 'cartes à revoir') + ' et jusqu’à 10 nouvelles</span></button>';
    else h += '<div class="carte"><b>Rien à revoir pour l’instant.</b><span>Reviens demain, ou termine une leçon pour débloquer de nouvelles cartes.</span></div>';
    if (cc.length) h += '<button class="carte" data-go="session-cartes:tout"><b>Tout réviser quand même</b><span>Un tour de toutes tes cartes actives, dans le désordre.</span></button>';
    const fautes = cc.filter((c) => (S.carte(c.id) || {}).ko > 0 && (S.carte(c.id) || {}).boite <= 2);
    if (fautes.length) h += '<button class="carte" data-go="session-cartes:fautes"><b>Mes cartes difficiles</b><span>' + plur(fautes.length, 'carte', 'cartes') + ' que tu as ratées et pas encore bien installées</span></button>';
    h += '<p class="sous" style="margin-top:18px">' + toutC.length + ' cartes existent au total dans le cours actuel.</p>';
    return { titre: 'Cartes', html: h, apres: liens };
  };
  VUES['session-cartes'] = (a) => {
    const cc = cartesEligibles(); let file;
    if (a.id === 'tout') file = E.melange(cc.map((c) => c.id));
    else if (a.id === 'fautes') file = E.melange(cc.filter((c) => (S.carte(c.id) || {}).ko > 0 && (S.carte(c.id) || {}).boite <= 2).map((c) => c.id));
    else { const { dues, nouvelles } = S.cartesDues(cc.map((c) => c.id)); file = E.melange(dues).concat(E.melange(nouvelles).slice(0, 10)); }
    const parId = new Map(cc.map((c) => [c.id, c]));
    return { titre: 'Cartes', html: '<div class="cartes" id="cz"></div>', apres: (el) => sessionCartes(el.querySelector('#cz'), file, parId) };
  };
  function faceCarte(c, verso) {
    let h = '<div class="face"><span class="cat">' + esc(c.cat || '') + '</span><div class="t">' + fmt(c.q || '') + '</div>';
    if (c.p) h += '<div style="width:100%">' + P.rendre(c.p) + '</div>';
    if (verso) { h += '<div class="hr" style="width:60%;margin:6px 0"></div><div class="t" style="font-size:20px">' + fmt(c.r || '') + '</div>'; if (c.rp) h += '<div style="width:100%">' + P.rendre(c.rp) + '</div>'; if (c.e) h += '<div class="e">' + fmt(c.e) + '</div>'; }
    return h + '</div>';
  }
  function sessionCartes(el, file, parId) {
    const vus = new Set(); let faits = 0, rates = 0; const total = file.length;
    if (!total) { el.innerHTML = '<p class="vide">Aucune carte pour cette session.</p>'; return; }
    function suivant() {
      if (!file.length) { el.innerHTML = '<div class="face"><div class="t">Session terminée</div><div class="e" style="text-align:center">' + faits + ' carte' + (faits > 1 ? 's' : '') + ' vue' + (faits > 1 ? 's' : '') + (rates ? ', dont ' + rates + ' ratée' + (rates > 1 ? 's' : '') + ' (elles reviendront bientôt).' : '. Parfait.') + '</div></div><div class="ligne-btn" style="justify-content:center"><button class="btn plein" id="ok">Retour</button></div>'; el.querySelector('#ok').addEventListener('click', () => racineOnglet('cartes')); return; }
      const c = parId.get(file[0]); if (!c) { file.shift(); return suivant(); }
      el.innerHTML = '<p class="sous">' + (faits + 1) + ' / ' + Math.max(total, faits + file.length) + '</p>' + faceCarte(c, false) + '<div class="ligne-btn" style="justify-content:center">' + (c.son ? '<button class="btn petit" id="ec">♪ Écouter</button>' : '') + '<button class="btn plein" id="v">Voir la réponse</button></div>';
      const ec = el.querySelector('#ec'); if (ec) ec.addEventListener('click', () => { (c.son || []).forEach((m, i) => setTimeout(() => Son.note(midiDe(m), 1, 0.85), i * 600)); });
      el.querySelector('#v').addEventListener('click', () => {
        el.innerHTML = '<p class="sous">' + (faits + 1) + ' / ' + Math.max(total, faits + file.length) + '</p>' + faceCarte(c, true) + '<div class="notes"><button class="r" data-n="ko">À revoir</button><button data-n="hes">Hésité</button><button class="s" data-n="ok">Je savais</button></div>';
        if (c.son) setTimeout(() => (c.son || []).forEach((m, i) => setTimeout(() => Son.note(midiDe(m), 1, 0.85), i * 600)), 150);
        el.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => {
          const n = b.dataset.n; S.reponseCarte(c.id, n); file.shift(); faits++;
          if (n === 'ko') { rates++; file.splice(Math.min(file.length, 4), 0, c.id); }
          suivant();
        }));
      });
    }
    suivant();
  }

  /* ---------- progression ---------- */
  VUES.progres = () => {
    const d = S.d, t = toutes();
    let h = '<h2>Progression</h2>';
    h += '<div class="stat"><div><b>' + S.serie() + '</b><span>jours de suite</span></div><div><b>' + minutesTxt(S.heures() * 60) + '</b><span>temps passé</span></div><div><b>' + t.filter((l) => S.leconFaite(l.id)).length + '/' + t.length + '</b><span>leçons</span></div></div>';
    h += '<h3>Compétences</h3>';
    const ent = Object.entries(d.exos).filter(([k, v]) => v.tot > 0);
    if (!ent.length) h += '<p class="sous">Fais quelques exercices : tes résultats par compétence apparaîtront ici.</p>';
    ent.sort((a, b) => a[1].ok / a[1].tot - b[1].ok / b[1].tot).forEach(([k, v]) => {
      const r = v.recent.length ? v.recent.reduce((a, b) => a + b, 0) / v.recent.length : v.ok / v.tot;
      h += '<div style="margin:12px 0"><div style="display:flex;justify-content:space-between;font-family:var(--sans);font-size:14px"><span>' + esc(COMP_NOMS[k] || k) + '</span><span style="color:var(--gris)">' + Math.round(r * 100) + ' % (' + v.tot + ' questions)</span></div><div class="barre"><i style="width:' + Math.round(r * 100) + '%"></i></div></div>';
    });
    const cc = Object.values(d.cartes); const maitrisees = cc.filter((c) => c.boite >= 4).length;
    h += '<h3>Cartes</h3><p class="sous">' + cc.length + ' vues · ' + maitrisees + ' bien installées (boîte 4 ou plus).</p>';
    const jours = Object.entries(d.jours).sort().slice(-14);
    if (jours.length) { const mx = Math.max(...jours.map((j) => j[1]), 1); h += '<h3>14 derniers jours</h3><div style="display:flex;align-items:flex-end;gap:4px;height:70px">' + jours.map(([j, m]) => '<div title="' + j + '" style="flex:1;background:var(--encre);height:' + Math.max(4, Math.round(m / mx * 70)) + 'px;border-radius:2px"></div>').join('') + '</div>'; }
    return { titre: 'Progression', html: h };
  };

  /* ---------- plus / réglages / ressources ---------- */
  VUES.plus = () => {
    const h = '<h2>Plus</h2><button class="carte" data-go="progres"><b>Progression</b><span>Compétences, cartes, séries de jours.</span></button><button class="carte" data-go="ressources"><b>Vidéos et chaînes</b><span>Où aller voir d’autres explications.</span></button><button class="carte" data-go="reglages"><b>Réglages</b><span>Son, thème, sauvegarde.</span></button><button class="carte" data-go="apropos"><b>À propos</b><span>Comment l’appli fonctionne, ce qu’il y a dans les volumes.</span></button>';
    return { titre: 'Plus', html: h, apres: liens };
  };
  VUES.ressources = () => {
    let h = '<h2>Vidéos et chaînes</h2><p class="sous">Chaque leçon propose ses propres recherches YouTube. Voici aussi quelques endroits pour compléter : surtout des recherches (elles restent à jour, contrairement à une liste figée), plus deux références. Essaie, et garde les profs qui te parlent.</p>';
    (C.ressources || []).forEach((r) => { h += '<a class="video" href="' + esc(r.url) + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M10 8l6 4-6 4z"/><rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><div><b>' + esc(r.nom) + '</b><span>' + esc(r.note) + '</span></div></a>'; });
    h += '<p class="sous">Astuce : dans chaque leçon, « Coller un lien YouTube » te permet de garder tes vidéos préférées au bon endroit.</p>';
    return { titre: 'Vidéos et chaînes', html: h };
  };
  VUES.reglages = () => {
    const r = S.reglages;
    const sw = (id, nom, sous, on) => '<div class="reg"><div>' + nom + (sous ? '<small>' + sous + '</small>' : '') + '</div><button class="sw' + (on ? ' on' : '') + '" data-sw="' + id + '"><i></i></button></div>';
    let h = '<h2>Réglages</h2>' + sw('son', 'Sons', 'Désactive pour travailler en silence.', r.son) + sw('theme', 'Thème nuit', 'Fond sombre, encre claire.', r.theme === 'nuit');
    h += '<div class="reg"><div>Tempo des exemples<small>Vitesse des extraits écoutés : ' + (r.bpm || 80) + ' à la noire</small></div><div style="display:flex;gap:8px"><button class="btn petit" data-bpm="-10">−</button><button class="btn petit" data-bpm="10">+</button></div></div>';
    h += '<div class="reg"><div>Latence du rythme<small>Si tu tapes juste mais que l’appli dit « en retard » : ' + (r.latence || 0) + ' ms de compensation</small></div><div style="display:flex;gap:8px"><button class="btn petit" data-lat="-20">−</button><button class="btn petit" data-lat="20">+</button></div></div>';
    h += '<h3>Sauvegarde</h3><p class="sous">Ta progression est enregistrée dans l’iPhone. Exporte un fichier de temps en temps pour la garder en sécurité.</p><div class="ligne-btn"><button class="btn" data-act="exp">Exporter</button><button class="btn" data-act="imp">Importer</button></div><input type="file" id="fimp" class="cache" accept=".json,application/json">';
    h += '<h3>Danger</h3><button class="btn" data-act="eff" style="color:var(--non);border-color:var(--non)">Tout effacer</button>';
    return { titre: 'Réglages', html: h, apres: (el) => {
      el.querySelectorAll('[data-sw]').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.sw; if (k === 'son') { S.reglage('son', !S.reglages.son); Son.activer(S.reglages.son); } else { S.reglage('theme', S.reglages.theme === 'nuit' ? 'papier' : 'nuit'); appliquerTheme(); } rendre(true); }));
      el.querySelectorAll('[data-bpm]').forEach((b) => b.addEventListener('click', () => { S.reglage('bpm', Math.max(40, Math.min(160, (S.reglages.bpm || 80) + +b.dataset.bpm))); rendre(true); }));
      el.querySelectorAll('[data-lat]').forEach((b) => b.addEventListener('click', () => { S.reglage('latence', Math.max(-100, Math.min(200, (S.reglages.latence || 0) + +b.dataset.lat))); rendre(true); }));
      el.querySelector('[data-act=exp]').addEventListener('click', () => {
        const blob = new Blob([S.exporter()], { type: 'application/json' }), u = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = u; a.download = 'partition-sauvegarde-' + S.jourStr() + '.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000);
      });
      el.querySelector('[data-act=imp]').addEventListener('click', () => el.querySelector('#fimp').click());
      el.querySelector('#fimp').addEventListener('change', async (e) => { const f = e.target.files[0]; if (!f) return; try { S.importer(await f.text()); appliquerTheme(); toast('Sauvegarde importée'); rendre(true); } catch (x) { toast('Fichier illisible'); } });
      el.querySelector('[data-act=eff]').addEventListener('click', () => { if (confirm('Effacer toute ta progression ?')) { S.effacer(); appliquerTheme(); toast('Tout est effacé'); racineOnglet('accueil'); } });
    } };
  };
  VUES.apropos = () => {
    const v = C.volumes.map((x) => '<li><b>' + esc(x.titre) + '</b> — ' + esc(x.sous) + '</li>').join('');
    return { titre: 'À propos', html: '<h2>À propos</h2><p>Partition est un cours de théorie musicale pour le piano, fait pour une personne qui part de zéro. Tout fonctionne sans Internet, et rien ne quitte ton iPhone.</p><div class="lecon"><ul>' + v + '</ul></div><p>Les portées sont dessinées par l’appli, et le son de piano est fabriqué par l’appli. Les octaves suivent la notation française : le do central s’appelle <b>do 3</b> (c’est le « C4 » des anglophones et du MIDI).</p>' };
  };
  function appliquerTheme() { document.documentElement.setAttribute('data-theme', S.reglages.theme === 'nuit' ? 'nuit' : 'papier'); }

  /* ---------- démarrage ---------- */
  appliquerTheme(); Son.activer(S.reglages.son);
  S.ouvertureJour();
  racineOnglet('accueil');
  setInterval(() => { if (!document.hidden) S.minutes(0.5); }, 30000);
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
  self.PartitionApp = { aller, retour, racineOnglet, VUES, lecon, toutes, pile: () => pile };
})();
