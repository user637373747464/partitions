/* Volume 2 · Chapitre 8 — La tonalité en pratique : reconnaître, transposer, chanter par degrés. */
(function () {
  const { p, h, def, rem, ex, liste, num, tab, sc, piano, ry, qcm, exo, clav, cartes, video, L } = Contenu.o;
  const T = Theorie, nm = (n) => T.nomFr(n), Mj = (n) => T.Maj(n);
  // la mélodie « Ode à la joie » en degrés (1 = tonique)
  const ODE = [3, 3, 4, 5, '|', 5, 4, 3, 2, '|', 1, 1, 2, 3, '|', ['3', 'q.'], ['2', 'e'], ['2', 'h'], '|]'];
  function odeEn(tonique, arm) {
    const g = T.gamme(tonique, 'maj'), e = T.Ecr(arm), out = [];
    ODE.forEach((x) => {
      if (typeof x === 'string') { out.push(x); e.barre(); return; }
      if (Array.isArray(x)) { out.push(e.note(g[+x[0] - 1], x[1])); return; }
      out.push(e.note(g[x - 1], 'q'));
    });
    out.push('|');
    [3, 3, 4, 5, '|', 5, 4, 3, 2, '|', 1, 1, 2, 3, '|', ['2', 'q.'], ['1', 'e'], ['1', 'h'], '|]'].forEach((x) => {
      if (typeof x === 'string') { out.push(x); e.barre(); return; }
      if (Array.isArray(x)) { out.push(e.note(g[+x[0] - 1], x[1])); return; }
      out.push(e.note(g[x - 1], 'q'));
    });
    return out.join(' ').replace('|] |', '|');
  }
  const degres = (ton, seq) => seq.map((d) => nm(T.gamme(ton, 'maj')[d - 1])).join(' – ');

  Contenu.chapitre('v2', {
    id: 'v2c8', titre: 'Chapitre 8 · La tonalité en pratique',
    lecons: [
      L('v2-40-reconnaitre', 'Reconnaître la tonalité d’une mélodie', 35,
        ['Combiner armure, dernière note et altérations accidentelles pour trouver la tonalité.', 'Trouver la tonalité de trois mélodies connues.', 'Choisir entre une tonalité majeure et sa relative mineure.'],
        [
          p('Pour dire dans quelle **tonalité** est un morceau, on mène une petite **enquête** à quatre indices :'),
          num('**L’armure** : elle donne **deux candidats** (une majeure, une mineure relative).', '**La dernière note** de la mélodie (ou de la basse) : elle est presque toujours **la tonique**.', '**Les notes qui reviennent** : la tonique et la dominante sont les piliers.', '**Les altérations accidentelles** : une altération qui revient souvent est une **sensible** (elle révèle la tonique).'),
          h('Mélodie A'),
          sc('c4:q c4:q c4:q d4:q | e4:h d4:h | c4:q e4:q d4:q d4:q | c4:w |]', 'Au clair de la lune : aucune altération à l’armure ; elle commence et finit sur do.', { mes: '4/4' }),
          p('**Armure vide** → do majeur ou la mineur. Dernière note : **do**. Verdict : **do majeur**.'),
          h('Mélodie B'),
          sc(odeEn('d4', 2), 'Ode à la joie (Beethoven) : deux dièses, elle commence sur fa♯ et finit sur ré.', { mes: '4/4', arm: 2, horsMesure: true }),
          p('**Deux dièses** → ré majeur ou si mineur. Dernière note : **ré**. Verdict : **ré majeur**.'),
          h('Mélodie C'),
          sc('d4:e. d4:s | e4:q d4:q g4:q | f4:h d4:e. d4:s | e4:q d4:q a4:q | g4:h d4:e. d4:s | d5:q b4:q g4:q | f4:q e4:q c5:e. c5:s | b4:q g4:q a4:q | g4:h |]', '« Joyeux anniversaire » en sol majeur (un dièse : fa♯). Mesure à 3/4 avec anacrouse.', { mes: '3/4', arm: 1, anacrouse: true }),
          p('**Un dièse** (fa♯) → sol majeur ou mi mineur. Dernière note : **sol**. Notes principales : sol, ré. Verdict : **sol majeur**.'),
          rem('Quand ça se complique', 'Si l’armure n’a que quelques altérations et que le morceau est en **mineur**, la dernière note est la **tonique mineure**. On repère alors la **sensible** : un 7ᵉ degré relevé par une altération accidentelle (par exemple un sol♯ en la mineur). Ce sera l’objet du Volume 3.'),
          qcm('Quelle tonalité ?', [
            ['Armure : fa♯ ; dernière note : sol. Tonalité probable ?', ['sol majeur', 'mi mineur', 'fa♯ majeur', 'ré majeur'], 0, 'Sol est la tonique.'],
            ['Armure : un bémol ; dernière note : ré. Tonalité probable ?', ['fa majeur', 'ré mineur', 'si♭ majeur', 'sol mineur'], 1, 'La relative mineure de fa majeur : ré mineur.'],
            ['Armure : trois dièses ; dernière note : la. Tonalité probable ?', ['la majeur', 'fa♯ mineur', 'mi majeur', 'si mineur'], 0, 'La majeur (3 dièses).'],
            ['Armure : deux bémols ; dernière note : si♭. Tonalité probable ?', ['si♭ majeur', 'sol mineur', 'fa majeur', 'mi♭ majeur'], 0, 'Si♭ majeur.'],
            ['Quel indice est le plus fiable pour reconnaître la tonique ?', ['La première note', 'La dernière note', 'La note la plus aiguë', 'La plus longue'], 1, 'La dernière note, presque toujours la tonique.'],
          ]),
          exo('armure', { max: 6 }, 8, 'Armures'),
        ],
        { videos: [video('Trouver la tonalité d’une partition', 'trouver la tonalité d’une partition armure dernière note'), video('Reconnaître majeur ou mineur', 'reconnaître tonalité majeure ou mineure partition')],
          mix: [{ gen: 'armure', params: { max: 6 } }],
          cartes: cartes('Tonalité', [['Quels indices pour trouver la tonalité d’une mélodie ?', 'L’armure, la dernière note, les notes qui reviennent et les altérations accidentelles.'], ['Quelle note termine presque toujours une mélodie ?', 'La tonique.'], ['Armure d’un dièse, dernière note sol : quelle tonalité ?', 'Sol majeur.'], ['Armure d’un bémol, dernière note ré : quelle tonalité ?', 'Ré mineur.']]) }),

      L('v2-41-transposer', 'Transposer une mélodie', 35,
        ['Définir transposer.', 'Transposer une mélodie par degré ou par intervalle.', 'Adapter l’armure à la nouvelle tonalité.'],
        [
          p('**Transposer**, c’est **jouer ou écrire la même musique plus haut ou plus bas**, en gardant **tous les rapports** entre les notes : seules les hauteurs changent. On transpose par exemple pour **rentrer dans la tessiture d’un chanteur**, ou pour s’exercer dans toutes les tonalités.'),
          def('transposition', '**Transposer**, c’est déplacer **toutes les notes d’un même intervalle** (vers le haut ou vers le bas). L’**armure change** en conséquence, et toutes les altérations accidentelles se déplacent avec les notes.'),
          h('Méthode par les degrés'),
          num('Repère la tonique de la mélodie (par exemple ré).', 'Note **le degré** de chaque note (ré = 1, mi = 2, fa♯ = 3…).', 'Choisis la **nouvelle tonique** (par exemple sol, une quarte plus haut).', 'Écris **le même degré** dans la nouvelle gamme : le degré 3 devient si.'),
          h('Exemple : l’« Ode à la joie » dans trois tonalités'),
          sc(odeEn('d4', 2), 'Ré majeur (original).', { mes: '4/4', arm: 2, horsMesure: true }),
          sc(odeEn('c4', 0), 'Do majeur : une seconde majeure plus bas.', { mes: '4/4', horsMesure: true }),
          sc(odeEn('g4', 1), 'Sol majeur : une quarte plus haut.', { mes: '4/4', arm: 1, horsMesure: true }),
          sc(odeEn('f4', -1), 'Fa majeur : une tierce mineure plus bas, une seconde majeure plus bas que sol…', { mes: '4/4', arm: -1, horsMesure: true }),
          tab(['Tonalité', 'Armure', 'Première note (degré III)'], [['Ré majeur', '2 ♯', 'fa♯'], ['Do majeur', '0', 'mi'], ['Sol majeur', '1 ♯', 'si'], ['Fa majeur', '1 ♭', 'la']]),
          rem('Méthode par intervalle', 'On peut aussi **ajouter le même intervalle à chaque note** : monter d’une quarte juste = chaque note monte de 3 lettres (do → fa, ré → sol…) et de 5 demi-tons. Il faut ensuite **corriger les altérations** avec l’armure de la nouvelle tonalité. La méthode par les degrés est en pratique plus rapide pour les mélodies simples.'),
          h('À quoi ça sert ?'),
          liste('**Aux chanteurs** : on abaisse ou on monte un morceau pour qu’il leur convienne.', '**Aux instruments transpositeurs** (clarinette, saxophone, trompette) dont la note écrite n’est pas celle qui sonne.', '**À l’entraînement** : jouer une même mélodie dans plusieurs tonalités est le meilleur exercice de compréhension des gammes.'),
          qcm('Vérifie', [
            ['Transposer, c’est…', ['changer le rythme', 'déplacer toutes les notes du même intervalle', 'changer la mesure', 'doubler la durée'], 1, 'Même intervalle pour toutes les notes.'],
            ['Dans une transposition, que devient l’armure ?', ['Elle ne change pas', 'Elle est adaptée à la nouvelle tonalité', 'Elle est supprimée', 'Elle devient mineure'], 1, 'Elle correspond à la nouvelle tonalité.'],
            ['En transposant de do majeur à sol majeur, la note mi devient…', ['si', 'sol', 'fa♯', 'la'], 0, 'Degré III de sol : si.'],
            ['Pour quelle raison transpose-t-on un morceau ?', ['Pour l’adapter à une voix ou un instrument', 'Pour le ralentir', 'Pour changer sa durée', 'Pour le rendre plus fort'], 0, 'Adapter à une tessiture.'],
          ]),
          exo('transpose', { max: 3 }, 10, 'Transposer d’une tonalité à une autre'),
          exo('interv-touche', { nums: [2, 3, 4, 5], quals: ['M', 'm', 'J'], alt: false }, 8, 'Trouver une note à un intervalle donné'),
        ],
        { videos: [video('Transposer une mélodie', 'transposer une mélodie solfège piano méthode'), video('Transposition par degrés', 'transposition tonalité par degrés exemple')],
          mix: [{ gen: 'transpose', params: { max: 3 } }],
          cartes: cartes('Tonalité', [['Qu’est-ce que transposer ?', 'Déplacer toutes les notes d’un même intervalle, en changeant l’armure.'], ['Comment transpose-t-on par les degrés ?', 'On garde le même degré dans la nouvelle gamme.'], ['Pourquoi transpose-t-on ?', 'Pour adapter à une voix ou un instrument, ou pour s’entraîner.'], ['En transposant de do à sol, que devient mi ?', 'Si.']]) }),

      L('v2-42-degres-melodie', 'Écrire une mélodie en degrés', 30,
        ['Lire une mélodie écrite en degrés (1 2 3…).', 'La traduire dans n’importe quelle tonalité.', 'Comprendre le « do mobile » et son usage en formation musicale.'],
        [
          p('Une mélodie ne dépend pas d’une tonalité précise : ce qui compte, c’est **le chemin entre les degrés**. On peut donc l’écrire avec des **chiffres** (1 = tonique) et la jouer dans **toutes les tonalités** en remplaçant les chiffres par les notes de la gamme.'),
          sc('c4:q c4:q g4:q g4:q | a4:q a4:q g4:h |]', '« Ah vous dirai-je maman » en do majeur : 1 1 5 5 | 6 6 5-', { mes: '4/4' }),
          tab(['Degrés', '1 1 5 5 | 6 6 5', '4 4 3 3 | 2 2 1'], [['Do majeur', degres('c4', [1, 1, 5, 5, 6, 6, 5]), degres('c4', [4, 4, 3, 3, 2, 2, 1])], ['Sol majeur', degres('g4', [1, 1, 5, 5, 6, 6, 5]), degres('g4', [4, 4, 3, 3, 2, 2, 1])], ['Fa majeur', degres('f4', [1, 1, 5, 5, 6, 6, 5]), degres('f4', [4, 4, 3, 3, 2, 2, 1])], ['Mi♭ majeur', degres('eb4', [1, 1, 5, 5, 6, 6, 5]), degres('eb4', [4, 4, 3, 3, 2, 2, 1])]]),
          def('do mobile', 'Dans la méthode du « **do mobile** » (ou solfège relatif), on chante les **degrés** avec les syllabes do-ré-mi… où **do = la tonique, quelle qu’elle soit**. Elle est utilisée par beaucoup de pédagogues (Kodály) pour **entraîner l’oreille aux relations entre degrés**. Le **do fixe**, lui, garde « do » = la touche do.'),
          rem('À quoi ça te sert', 'Penser **en degrés** te permet d’**entendre une mélodie** et de la **rejouer par cœur** dans une autre tonalité : tu retiens le **dessin**, pas les noms de notes. C’est la base du travail d’oreille des jazzmen et des musiciens populaires.'),
          qcm('Mélodies en degrés', [
            ['La mélodie 1 2 3 1 en sol majeur donne…', ['sol la si sol', 'sol la si do', 'sol si ré sol', 'do ré mi do'], 0, '1 = sol, 2 = la, 3 = si.'],
            ['La mélodie 1 3 5 3 en fa majeur donne…', ['fa la do la', 'fa sol la sol', 'do mi sol mi', 'fa la si♭ la'], 0, '1 = fa, 3 = la, 5 = do.'],
            ['La mélodie 5 5 6 5 en ré majeur donne…', ['la la si la', 'ré ré mi ré', 'sol sol la sol', 'mi mi fa♯ mi'], 0, '5 = la, 6 = si.'],
            ['La mélodie 7 1 en do majeur donne…', ['si do', 'ré mi', 'la si', 'do ré'], 0, '7 = si (sensible).'],
            ['La mélodie 1 4 5 1 en mi♭ majeur donne…', ['mi♭ la♭ si♭ mi♭', 'mi♭ fa sol mi♭', 'mi la si mi', 'mi♭ la si♭ mi♭'], 0, '4 = la♭, 5 = si♭.'],
          ]),
          exo('gamme-degre', { types: ['maj'], max: 6, degres: [2, 3, 4, 5, 6, 7] }, 10, 'Du degré à la note'),
          exo('transpose', { max: 5 }, 8, 'Transposer'),
        ],
        { videos: [video('Do fixe et do mobile', 'do fixe do mobile solfège différence'), video('Chanter par degrés', 'solfège relatif chanter degrés gamme majeure')],
          mix: [{ gen: 'gamme-degre', params: { types: ['maj'], max: 6 } }],
          cartes: cartes('Tonalité', [['Que veut dire « do mobile » ?', 'Do = la tonique de la tonalité, quelle qu’elle soit.'], ['Que veut dire « do fixe » ?', 'Do = toujours la touche do.'], ['Pourquoi penser en degrés ?', 'Pour retenir le dessin mélodique et le rejouer dans toutes les tonalités.'], ['1 3 5 en sol majeur donne…', 'Sol – si – ré.']]) }),
    ],
  });
})();
