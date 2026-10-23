/* audio.js — un petit piano synthétique (WebAudio), un métronome, et la lecture d'extraits de partition. Tout est fabriqué dans l'appli : rien à télécharger, ça marche hors ligne. */
(function (racine) {
  'use strict';
  let ctx = null, sortie = null, actif = true, courant = null;
  const tmr = [];
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* tant pis */ }

  function init() {
    if (!ctx) {
      const C = racine.AudioContext || racine.webkitAudioContext; if (!C) return false;
      ctx = new C();
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.25;
      const g = ctx.createGain(); g.gain.value = 0.55;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6200; lp.Q.value = 0.4;
      lp.connect(comp); comp.connect(g); g.connect(ctx.destination); sortie = lp;
    }
    if (ctx.state !== 'running') ctx.resume();
    return true;
  }
  const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const AMPS = [1, 0.62, 0.4, 0.26, 0.17, 0.11, 0.07, 0.045];

  // une note de piano : sons partiels qui s'éteignent à des vitesses différentes (les aigus plus vite), petit « choc » de marteau au début
  function note(m, dur, vel, quand, bus) {
    if (!actif || !init()) return;
    const t0 = quand == null ? ctx.currentTime + 0.01 : quand;
    const f0 = freq(m), v = vel == null ? 0.8 : vel, d = dur == null ? 1.6 : dur;
    const tauBase = Math.max(0.5, Math.min(4.5, 3.4 * Math.pow(261 / f0, 0.55)));
    const dest = bus || sortie;
    const ng = ctx.createGain(); ng.gain.setValueAtTime(1, t0);
    const fin = t0 + d;
    ng.gain.setTargetAtTime(0, fin, 0.07);
    ng.connect(dest);
    const stop = fin + 0.7;
    for (let k = 1; k <= AMPS.length; k++) {
      const f = f0 * k * Math.sqrt(1 + 0.0004 * k * k);
      if (f > 11000) break;
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const gk = ctx.createGain(), a = AMPS[k - 1] * v * 0.32 / (1 + (m < 40 ? 0 : 0));
      gk.gain.setValueAtTime(0, t0); gk.gain.linearRampToValueAtTime(a, t0 + 0.004);
      gk.gain.setTargetAtTime(a * 0.0, t0 + 0.004, tauBase / (1 + 0.55 * (k - 1)));
      o.connect(gk); gk.connect(ng); o.start(t0); o.stop(stop);
    }
    // marteau
    const n = Math.floor(ctx.sampleRate * 0.018), buf = ctx.createBuffer(1, n, ctx.sampleRate), dd = buf.getChannelData(0);
    for (let i = 0; i < n; i++) dd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    const s = ctx.createBufferSource(); s.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = Math.min(4000, f0 * 3); bp.Q.value = 0.8;
    const gh = ctx.createGain(); gh.gain.value = 0.18 * v;
    s.connect(bp); bp.connect(gh); gh.connect(ng); s.start(t0);
  }
  function accord(ms, dur, vel, quand, bus) { ms.forEach((m) => note(m, dur, vel, quand, bus)); }

  function clic(accent, quand) {
    if (!init()) return;
    const t0 = quand == null ? ctx.currentTime : quand;
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = accent ? 1760 : 1175;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(accent ? 0.5 : 0.34, t0 + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
    o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + 0.07);
  }

  function arreter() {
    tmr.splice(0).forEach(clearTimeout);
    if (courant) { try { courant.bus.gain.cancelScheduledValues(0); courant.bus.gain.setTargetAtTime(0, ctx.currentTime, 0.03); } catch (e) { /* rien */ } const c = courant; courant = null; c.fin && c.fin(); }
  }
  // joue des évènements { t (ticks, 24 = noire), d, midis, idx } ; onEv(idx|null) pour la surbrillance
  function jouer(evts, opt) {
    opt = opt || {};
    if (!init()) return null;
    arreter();
    const bpm = opt.bpm || 80, sec = (t) => (t / 24) * 60 / bpm;
    const bus = ctx.createGain(); bus.gain.value = 1; bus.connect(sortie);
    const t0 = ctx.currentTime + 0.08;
    let fin = 0;
    evts.forEach((e) => {
      const ts = t0 + sec(e.t), ds = Math.max(0.1, sec(e.d) * 0.97);
      if (e.midis.length) accord(e.midis, Math.min(ds, 6), 0.8, ts, bus);
      fin = Math.max(fin, sec(e.t + e.d));
      if (opt.onEv) {
        const on = setTimeout(() => opt.onEv(e.idx, e.fusion), Math.max(0, (ts - ctx.currentTime) * 1000));
        tmr.push(on);
      }
    });
    const fini = setTimeout(() => { if (courant && courant.bus === bus) { courant = null; } opt.onEv && opt.onEv(null); opt.onFin && opt.onFin(); }, (fin + 0.25) * 1000 + 100);
    tmr.push(fini);
    courant = { bus, fin: () => { opt.onEv && opt.onEv(null); opt.onFin && opt.onFin(); } };
    return { duree: fin };
  }
  const maintenant = () => (ctx ? ctx.currentTime : 0);
  racine.Son = { init, note, accord, clic, jouer, arreter, maintenant, get ctx() { return ctx; }, activer(v) { actif = !!v; if (!v) arreter(); }, get actif() { return actif; } };
})(typeof self !== 'undefined' ? self : this);
