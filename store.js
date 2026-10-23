/* store.js — la progression : leçons terminées, résultats d'exercices, cartes à revoir (répétition espacée), série de jours, réglages. Tout reste dans ton iPhone. */
(function (racine) {
  'use strict';
  const CLE = 'partition-v1';
  let mem = null;
  const jourStr = (d) => { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const vide = () => ({ v: 1, lecons: {}, exos: {}, cartes: {}, jours: {}, videos: {}, reglages: { son: true, theme: 'papier', bpm: 80, latence: 0 }, creation: Date.now() });
  function charger() {
    if (mem) return mem;
    try { const s = localStorage.getItem(CLE); mem = s ? Object.assign(vide(), JSON.parse(s)) : vide(); } catch (e) { mem = vide(); }
    mem.reglages = Object.assign(vide().reglages, mem.reglages || {});
    return mem;
  }
  let tmr = null;
  function sauver() { clearTimeout(tmr); tmr = setTimeout(sauverMaintenant, 200); }
  function sauverMaintenant() { clearTimeout(tmr); try { localStorage.setItem(CLE, JSON.stringify(mem)); } catch (e) { /* mémoire pleine ou bloquée */ } }
  function actif(minutes) { const m = charger(), j = jourStr(); m.jours[j] = (m.jours[j] || 0) + (minutes || 0); sauver(); }

  const INTERV = [0, 1, 2, 5, 11, 25, 60];            // jours entre deux révisions selon la boîte
  const Store = {
    get d() { return charger(); },
    get reglages() { return charger().reglages; },
    reglage(k, v) { charger().reglages[k] = v; sauver(); },
    leconFaite(id) { return !!charger().lecons[id]; },
    finirLecon(id, extra) { const m = charger(); if (!m.lecons[id]) m.lecons[id] = { date: Date.now() }; Object.assign(m.lecons[id], extra || {}); actif(0); sauver(); },
    defaireLecon(id) { delete charger().lecons[id]; sauver(); },
    exo(comp, ok) { const m = charger(), e = m.exos[comp] || (m.exos[comp] = { ok: 0, tot: 0, recent: [] }); e.tot++; if (ok) e.ok++; e.recent.push(ok ? 1 : 0); if (e.recent.length > 30) e.recent.shift(); actif(0.4); },
    ouvertureJour() { actif(0); },
    minutes(n) { actif(n); },
    /* cartes */
    carte(id) { return charger().cartes[id] || null; },
    reponseCarte(id, niveau) {                         // niveau : 'ko' | 'hes' | 'ok'
      const m = charger(), c = m.cartes[id] || (m.cartes[id] = { boite: 0, due: 0, ok: 0, ko: 0 });
      const jour = Math.floor(Date.now() / 86400000);
      if (niveau === 'ko') { c.boite = 0; c.ko++; c.due = jour; }
      else if (niveau === 'hes') { c.boite = Math.max(1, c.boite); c.due = jour + 1; c.ok += 0.5; }
      else { c.boite = Math.min(INTERV.length - 1, c.boite + 1); c.due = jour + INTERV[c.boite]; c.ok++; }
      c.vu = Date.now(); actif(0.3); sauver();
    },
    cartesDues(ids) {
      const m = charger(), jour = Math.floor(Date.now() / 86400000);
      const dues = [], nouvelles = [];
      ids.forEach((id) => { const c = m.cartes[id]; if (!c) nouvelles.push(id); else if (c.due <= jour) dues.push(id); });
      return { dues, nouvelles };
    },
    serie() {                                          // jours consécutifs d'activité (aujourd'hui compte s'il y a de l'activité)
      const m = charger(); let n = 0; const d = new Date();
      if (!m.jours[jourStr(d)]) d.setDate(d.getDate() - 1);
      while (m.jours[jourStr(d)]) { n++; d.setDate(d.getDate() - 1); }
      return n;
    },
    heures() { const m = charger(); return Object.values(m.jours).reduce((a, b) => a + b, 0) / 60; },
    videos(id) { return charger().videos[id] || []; },
    ajouterVideo(id, url) { const m = charger(); (m.videos[id] = m.videos[id] || []).push(url); sauver(); },
    retirerVideo(id, i) { const m = charger(); (m.videos[id] || []).splice(i, 1); sauver(); },
    exporter() { return JSON.stringify(charger()); },
    importer(txt) { const o = JSON.parse(txt); if (!o || typeof o !== 'object' || !o.lecons) throw new Error('fichier invalide'); mem = Object.assign(vide(), o); sauverMaintenant(); },
    effacer() { mem = vide(); sauverMaintenant(); },
    sauverMaintenant, jourStr,
  };
  racine.addEventListener('pagehide', sauverMaintenant);
  racine.addEventListener('visibilitychange', () => { if (document.hidden) sauverMaintenant(); });
  racine.Store = Store;
})(typeof self !== 'undefined' ? self : this);
