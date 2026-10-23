/* Chaînes et sites utiles (liens de recherche ou pages d'accueil). */
(function () {
  const yt = (q) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
  Contenu.ressources = [
    { nom: 'Solfège pour débutants (recherche)', note: 'Cours de solfège en français, pour partir de zéro.', url: yt('solfège débutant cours complet piano') },
    { nom: 'Lire une partition (recherche)', note: 'Vidéos sur la clé de sol, la clé de fa et la lecture des notes.', url: yt('apprendre à lire une partition clé de sol clé de fa') },
    { nom: 'Rythme et lecture rythmique (recherche)', note: 'Exercices de rythme, mesures, noires, croches, silences.', url: yt('solfège rythmique débutant noire croche silence') },
    { nom: 'Théorie musicale pour pianistes (recherche)', note: 'Gammes, accords, intervalles, harmonie, en français.', url: yt('théorie musicale piano gammes accords intervalles') },
    { nom: 'Music Theory (anglais) — musictheory.net', note: 'Site de référence avec leçons et exercices en anglais. https://www.musictheory.net', url: 'https://www.musictheory.net/lessons' },
    { nom: 'Piano en Ligne (chaîne YouTube)', note: 'Leçons de piano pour débutants en français, d\u2019après la liste de Groupe Réussite. Chaîne à tester.', url: yt('Piano en Ligne chaîne cours de piano débutant') },
    { nom: 'Rousseau (chaîne YouTube, piano)', note: 'Chaîne anglophone très suivie : leçons de piano et de théorie.', url: yt('Rousseau piano lessons music theory') },
    { nom: 'Chaînes de pédagogie en français (recherche)', note: 'Tape « formation musicale » ou « cours de piano gratuit » et choisis le prof qui te parle.', url: yt('formation musicale cours gratuit piano') },
  ];
})();
