/* contenu/core.js — le registre du cours : volumes, chapitres, leçons. Chaque fichier de contenu appelle Contenu.chapitre(...). */
(function (racine) {
  'use strict';
  const volumes = [
    { id: 'v1', titre: 'Volume 1 — Les bases', sous: 'Le son, le clavier, la portée, les clés, les durées, la mesure, les altérations.', chapitres: [] },
    { id: 'v2', titre: 'Volume 2 — Rythme et gammes', sous: 'Rythmes avancés, syncopes, gammes majeures, tonalités, cercle des quintes.', plan: 'subdivisions, triolets, syncopes, mesures composées, gamme majeure, armures, tonalités.', chapitres: [] },
    { id: 'v3', titre: 'Volume 3 — Intervalles et modes mineurs', sous: 'Intervalles qualifiés, gammes mineures, modes, transposition.', plan: 'majeur, mineur, juste, augmenté, diminué ; trois formes du mineur ; modes ; transposer.', chapitres: [] },
    { id: 'v4', titre: 'Volume 4 — Accords et harmonie', sous: 'Triades, septièmes, renversements, degrés, cadences, enchaînements.', plan: 'accords de trois et quatre sons, renversements, fonctions tonales, cadences.', chapitres: [] },
    { id: 'v5', titre: 'Volume 5 — Forme et analyse', sous: 'Phrases, formes, modulations, analyse de partitions réelles.', plan: 'phrase et période, formes binaire/ternaire/sonate, modulation, analyse.', chapitres: [] },
  ];
  let cache = null;
  const Contenu = {
    volumes, rythmes: [], ressources: [],
    chapitre(volumeId, ch) { const v = volumes.find((x) => x.id === volumeId); ch.lecons.forEach((l) => { l.volumeId = volumeId; l.chapitreTitre = ch.titre; }); v.chapitres.push(ch); cache = null; },
    toutesLecons() {
      if (cache) return cache;
      cache = [];
      volumes.forEach((v) => { let n = 0; v.chapitres.forEach((c) => c.lecons.forEach((l) => { l.num = ++n; cache.push(l); })); });
      return cache;
    },
    exoMix(faites) {
      const out = [];
      Contenu.toutesLecons().forEach((l) => { if (faites.has(l.id) && l.mix) l.mix.forEach((m) => out.push(m)); });
      return out.length ? out : [{ gen: 'note-nom', params: { clef: 'sol', lo: 'e4', hi: 'g5' } }, { gen: 'nom-clavier', params: { lo: 'c4', hi: 'b4' } }];
    },
  };
  racine.Contenu = Contenu;
})(typeof self !== 'undefined' ? self : this);
