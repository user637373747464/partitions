/* Volume 3 · Chapitre 5 — Les tonalités mineures. */
(function () {
  const { p, h, def, rem, ex, liste, num, tab, sc, piano, ry, qcm, exo, clav, son, cartes, video, ivs, G, L } = Contenu.o;
  const T = Theorie, nm = (n) => T.nomFr(n), Mj = (n) => T.Maj(n);
  const { cap, bar } = G;
  const armTxt = (n) => (n === 0 ? 'aucune altération' : Math.abs(n) + (n > 0 ? ' dièse' : ' bémol') + (Math.abs(n) > 1 ? 's' : ''));
  const dbl = (s) => s.replace('♯♯', ' (double dièse)');

  // tableau des 15 tonalités mineures : armure, tonique, relative, sensible
  function tableMineurs() {
    const out = [];
    for (let n = -7; n <= 7; n++) {
      const t = T.tonDe(n, 'min', 4), g = T.gamme(t, 'harm');
      out.push([armTxt(n), Mj(t) + ' mineur', Mj(T.relative(t, 'min')) + ' majeur', dbl(nm(g[6]))]);
    }
    return out;
  }
  // « Frère Jacques » en degrés de la gamme (1 = tonique), dans n'importe quelle tonalité
  const FJ = [[1, 0, 'q'], [2, 0, 'q'], [3, 0, 'q'], [1, 0, 'q'], '|', [1, 0, 'q'], [2, 0, 'q'], [3, 0, 'q'], [1, 0, 'q'], '|', [3, 0, 'q'], [4, 0, 'q'], [5, 0, 'h'], '|', [3, 0, 'q'], [4, 0, 'q'], [5, 0, 'h'], '|',
    [5, 0, 'e'], [6, 0, 'e'], [5, 0, 'e'], [4, 0, 'e'], [3, 0, 'q'], [1, 0, 'q'], '|', [5, 0, 'e'], [6, 0, 'e'], [5, 0, 'e'], [4, 0, 'e'], [3, 0, 'q'], [1, 0, 'q'], '|', [1, 0, 'q'], [5, -1, 'q'], [1, 0, 'h'], '|', [1, 0, 'q'], [5, -1, 'q'], [1, 0, 'h'], '|]'];
  function frere(tonique, type, arm) {
    const g = T.gamme(tonique, type), e = T.Ecr(arm), out = [];
    FJ.forEach((x) => {
      if (typeof x === 'string') { out.push(x); e.barre(); return; }
      const n = g[x[0] - 1];
      out.push(e.note({ l: n.l, a: n.a, o: n.o + x[1] }, x[2]));
    });
    return out.join(' ');
  }

  Contenu.chapitre('v3', {
    id: 'v3c5', titre: 'Chapitre 5 · Les tonalités mineures',
    lecons: [
      L('v3-28-toutes-mineures', 'Toutes les tonalités mineures', 35,
        ['Connaître les quinze tonalités mineures, leur armure et leur sensible.', 'Passer d’une tonalité mineure à sa relative majeure et inversement.', 'Retrouver une armure mineure par la relative.'],
        [
          p('Il existe **quinze tonalités mineures** (de sept bémols à sept dièses), comme pour le majeur. Voici le tableau de référence : chaque ligne est une armure, avec ses deux tonalités (majeure et mineure) et la **sensible** de la tonalité mineure (VII relevé).'),
          tab(['Armure', 'Mineur', 'Relative majeure', 'Sensible'], tableMineurs()),
          rem('Comment le retenir ?', 'Ne mémorise pas ce tableau ligne par ligne : **retiens le tableau majeur** (Volume 2) et utilise la **relative** (−3 demi-tons). L’armure de sol mineur ? C’est celle de sa relative **si♭ majeur** : 2 bémols. La sensible ? Un demi-ton sous la tonique : fa♯.'),
          h('Les mineurs les plus utilisés au piano'),
          liste('**Peu d’altérations** (0 à 3) : la, mi, si, ré, sol, do — c’est le terrain d’entraînement courant.', '**Davantage de dièses** : fa♯ mineur (3 ♯) et do♯ mineur (4 ♯) sont fréquents chez Chopin ou Beethoven (« Clair de lune » est en do♯ mineur).', '**Davantage de bémols** : fa mineur (4 ♭) pour Chopin (Ballade n°4, concerto) ; si♭ mineur (5 ♭) pour la célèbre sonate « Marche funèbre » de Chopin.'),
          sc(bar(T.gammeScore('f#4', 'harm', { d: 'q', arm: 3 }), 4), 'Fa♯ mineur harmonique (3 dièses : fa♯ do♯ sol♯) — le mi♯ est la sensible : une touche blanche (fa) que l’on écrit mi♯.', { mes: '4/4', arm: 3 }),
          rem('Le mi♯ existe !', 'En fa♯ mineur, la sensible est **mi♯** (même touche que fa). Pas fa naturel : il faut une lettre par degré de la gamme (mi, pas fa). De même, en do♯ mineur, la sensible est si♯ (même touche que do).'),
          qcm('Tonalités mineures', [
            ['Armure de fa mineur ?', ['4 ♭', '4 ♯', '3 ♭', '5 ♭'], 0, 'Relative : la♭ majeur (4 bémols).'],
            ['Armure de do♯ mineur ?', ['4 ♯', '5 ♯', '3 ♯', '4 ♭'], 0, 'Relative : mi majeur (4 dièses).'],
            ['Sensible de sol mineur ?', ['fa♯', 'fa', 'mi♭', 'la'], 0, 'Un demi-ton sous sol.'],
            ['Sensible de fa♯ mineur ?', ['mi♯', 'mi', 'fa', 'sol♯'], 0, 'Mi♯ (lettre mi, une touche blanche fa).'],
            ['Relative majeure de si♭ mineur ?', ['ré♭ majeur', 'ré majeur', 'fa majeur', 'la♭ majeur'], 0, 'Si♭ + 3 demi-tons = ré♭.'],
          ]),
          exo('armure-combien', { mode: 'min', max: 7 }, 8, 'Armure de la tonalité mineure'),
          exo('armure-notes', { mode: 'min', max: 7 }, 8, 'Altérations de l’armure'),
          exo('relative', { mode: 'les-deux', max: 7 }, 8, 'Relatives'),
        ],
        { videos: [video('Les 15 tonalités mineures', 'tonalités mineures armures sensible tableau solfège'), video('Sensible en mineur : mi dièse', 'sensible fa dièse mineur mi dièse pourquoi')],
          mix: [{ gen: 'armure-combien', params: { mode: 'min', max: 7 } }, { gen: 'armure-notes', params: { mode: 'min', max: 6 } }, { gen: 'relative', params: { mode: 'les-deux', max: 7 } }],
          cartes: cartes('Armures', [['Armure de fa mineur ?', '4 bémols : si♭ mi♭ la♭ ré♭.'], ['Armure de do♯ mineur ?', '4 dièses : fa♯ do♯ sol♯ ré♯.'], ['Armure de si♭ mineur ?', '5 bémols.'], ['Armure de sol♯ mineur ?', '5 dièses.'], ['Sensible de fa♯ mineur ?', 'Mi♯ (même touche que fa).'], ['Sensible de sol mineur ?', 'Fa♯.']]) }),

      L('v3-29-reconnaitre-mode', 'Majeur ou mineur ? Reconnaître le mode d’un morceau', 40,
        ['Mener l’enquête complète : armure, finale, sensible, tierce.', 'Distinguer deux tonalités relatives à partir d’une mélodie.', 'Comparer une mélodie en majeur et en mineur.'],
        [
          p('Une armure de **deux dièses** peut désigner **ré majeur** ou **si mineur**. Pour trancher, il faut regarder **la musique elle-même**. Voici l’enquête complète, du plus fiable au moins fiable :'),
          num('**La dernière note** (et la dernière basse) : c’est presque toujours la **tonique**.', '**La sensible** : une altération accidentelle récurrente un demi-ton sous la finale → mineur (harmonique ou mélodique).', '**La tierce** de l’accord final (ou de la mélodie autour de la finale) : majeure = tonalité majeure ; mineure = tonalité mineure.', '**Le début** : beaucoup de mélodies commencent par la tonique, la dominante ou une note de l’accord de tonique.'),
          h('Même mélodie, deux modes'),
          p('Voici « Frère Jacques » en **ré majeur**, puis en **ré mineur** (version célèbre de Mahler, *Symphonie n°1*). Dans cette mélodie, deux degrés changent : le III (fa♯ devient fa) et le VI (si devient si♭).'),
          sc(frere('d4', 'maj', 2), 'Frère Jacques en ré majeur (armure : fa♯ do♯).', { mes: '4/4', arm: 2 }),
          sc(frere('d4', 'min', -1), 'Frère Jacques en ré mineur naturel (armure : si♭). Le mode change tout : la comptine devient funèbre.', { mes: '4/4', arm: -1 }),
          rem('Un exemple célèbre', 'Au début de sa 1ʳᵉ symphonie, **Gustav Mahler** fait jouer *Frère Jacques* (« Bruder Martin » en allemand) **en mineur**, en marche funèbre : le contraste avec la version enfantine est saisissant. C’est la preuve que **le mode est une couleur expressive**, indépendante de la mélodie.'),
          h('Une même armure : deux tonalités'),
          sc('d4:q f#4:q a4:q f#4:q | d4:q f#4:q a4:q d5:q | b3:q d4:q f#4:q d4:q | b3:q d4:q f#4:q b4:q |]', 'Deux arpèges avec la même armure (fa♯ do♯) : ré majeur (ré–fa♯–la), puis si mineur (si–ré–fa♯). Seule la tonique change.', { mes: '4/4', arm: 2 }),
          qcm('Enquête', [
            ['Armure : 2 dièses ; mélodie qui finit sur si, avec un la♯ qui revient. Tonalité ?', ['si mineur', 'ré majeur', 'sol majeur', 'mi mineur'], 0, 'La♯ est la sensible de si.'],
            ['Armure : 3 bémols ; finale sur do ; un si naturel qui revient. Tonalité ?', ['do mineur', 'mi♭ majeur', 'fa mineur', 'si♭ majeur'], 0, 'Si naturel = sensible de do mineur.'],
            ['Armure : 1 dièse ; finale sur sol ; pas d’altération accidentelle. Tonalité ?', ['sol majeur', 'mi mineur', 'ré majeur', 'si mineur'], 0, 'La finale donne la tonique : sol.'],
            ['Dans Frère Jacques en ré mineur naturel, la 3ᵉ note est…', ['fa', 'fa♯', 'mi', 'sol'], 0, 'Tierce mineure : fa.'],
            ['Quel indice est le plus fiable pour distinguer deux relatives ?', ['la dernière note', 'la mesure', 'le tempo', 'la première mesure'], 0, 'La finale est la tonique.'],
          ]),
          exo('relative', { mode: 'les-deux', max: 5 }, 6, 'Relatives'),
        ],
        { videos: [video('Majeur ou mineur : comment savoir ?', 'comment savoir si un morceau est en majeur ou en mineur partition'), video('Frère Jacques en mineur Mahler', 'Mahler symphonie 1 frère jacques mineur Bruder Martin')],
          mix: [{ gen: 'relative', params: { mode: 'les-deux', max: 5 } }],
          cartes: cartes('Tonalité', [['Comment départager deux relatives sur une partition ?', 'Dernière note, sensible récurrente, tierce de l’accord final.'], ['Même mélodie en majeur et en mineur : quels degrés changent ?', 'III, VI et (souvent) VII.'], ['Quel compositeur a utilisé Frère Jacques en mineur ?', 'Gustav Mahler (Symphonie n°1).'], ['Quel indice est le plus fiable pour trouver la tonique ?', 'La dernière note.']]) }),

      L('v3-30-transposer-mineur', 'Transposer en mineur', 35,
        ['Transposer une mélodie d’une tonalité mineure à une autre par les degrés.', 'Gérer les altérations (armure et sensible).', 'Passer de majeur à mineur et inversement.'],
        [
          p('La méthode est la même qu’en majeur (V2, leçon 41) : on garde les **degrés** et on change la **tonalité**. Il faut seulement être attentif à l’**armure** et aux **altérations accidentelles** (sensible).'),
          num('Repère les **degrés** de chaque note (la = 1, si = 2, do = 3…).', 'Choisis la **nouvelle tonique**.', 'Écris les mêmes degrés dans la **gamme mineure** de la nouvelle tonique.', 'Vérifie les altérations avec la **nouvelle armure**.'),
          h('Frère Jacques dans trois tonalités mineures'),
          sc(frere('a4', 'min', 0), 'La mineur (aucune altération).', { mes: '4/4' }),
          sc(frere('e4', 'min', 1), 'Mi mineur (fa♯ à l’armure).', { mes: '4/4', arm: 1 }),
          sc(frere('g4', 'min', -2), 'Sol mineur (si♭, mi♭ à l’armure).', { mes: '4/4', arm: -2 }),
          tab(['Degré', 'la mineur', 'mi mineur', 'sol mineur'], [['1', 'la', 'mi', 'sol'], ['2', 'si', 'fa♯', 'la'], ['3', 'do', 'sol', 'si♭'], ['4', 'ré', 'la', 'do'], ['5', 'mi', 'si', 'ré'], ['6', 'fa', 'do', 'mi♭']]),
          rem('Et la sensible ?', 'Si la mélodie utilise la sensible (VII relevé), elle se transpose aussi : la sensible de la mineur est sol♯, de mi mineur ré♯, de sol mineur fa♯. **Les altérations accidentelles se déplacent avec les degrés.**'),
          h('Du majeur au mineur'),
          p('Pour passer **de la majeur à la mineur** (même mélodie, mode opposé), on remplace les degrés **III, VI et VII** par leurs versions mineures. C’est exactement ce qui sépare « Frère Jacques » du Mahler de la leçon précédente.'),
          qcm('Transposer', [
            ['De la mineur à ré mineur, la note do (III) devient…', ['fa', 'mi', 'sol', 'si♭'], 0, 'III de ré mineur : fa.'],
            ['De la mineur à mi mineur, la note ré (IV) devient…', ['la', 'sol', 'si', 'do'], 0, 'IV de mi mineur : la.'],
            ['De la mineur à sol mineur, la note fa (VI) devient…', ['mi♭', 'mi', 'fa♯', 'ré'], 0, 'VI de sol mineur : mi♭.'],
            ['De do mineur à la mineur, la note mi♭ (III) devient…', ['do', 'ré', 'mi', 'fa'], 0, 'III de la mineur : do.'],
            ['Quand on transpose, que devient l’armure ?', ['elle s’adapte à la nouvelle tonalité', 'elle reste identique', 'elle disparaît', 'elle double'], 0, 'Elle suit la nouvelle tonique.'],
          ]),
          exo('transpose', { max: 3 }, 8, 'Transposer'),
        ],
        { videos: [video('Transposer une mélodie en mineur', 'transposer une mélodie en mineur degrés solfège piano'), video('Passer de majeur à mineur', 'passer de majeur à mineur même mélodie solfège tierce sixte septième')],
          mix: [{ gen: 'transpose', params: { max: 3 } }],
          cartes: cartes('Tonalité', [['Comment transpose-t-on en mineur ?', 'On garde les degrés et on les écrit dans la nouvelle gamme mineure.'], ['Majeur → mineur : degrés à abaisser ?', 'III, VI, VII.'], ['Les altérations accidentelles lors d’une transposition ?', 'Elles se déplacent avec les degrés.'], ['Frère Jacques en la mineur : 3ᵉ degré ?', 'Do (tierce mineure).']]) }),

      L('v3-31-voisines-mineur', 'Tonalités voisines et modulation en mineur', 30,
        ['Trouver les tonalités voisines d’une tonalité mineure.', 'Comprendre quelles modulations sont naturelles.', 'Lire une courte modulation de la mineur vers do majeur.'],
        [
          p('Comme en majeur, les tonalités **voisines** d’une tonalité mineure sont celles dont l’armure ne diffère que d’**une altération** (au plus). Pour **la mineur** (aucune altération) :'),
          tab(['Tonalité', 'Rôle', 'Armure'], [['la mineur', 'tonique', 'aucune'], ['do majeur', 'relative majeure', 'aucune'], ['mi mineur', 'dominante (V)', '1 ♯'], ['ré mineur', 'sous-dominante (IV)', '1 ♭'], ['sol majeur', 'relative de la dominante', '1 ♯'], ['fa majeur', 'relative de la sous-dominante', '1 ♭']]),
          rem('La plus fréquente', 'En mineur, la modulation la plus courante est vers la **relative majeure** (la mineur → do majeur) : même armure, couleur nouvelle. La deuxième est vers la **dominante** (la mineur → mi mineur ou mi majeur).'),
          h('Un exemple de modulation'),
          sc('a4:q e5:q c5:q a4:q | g#4:q a4:q b4:q c5:q | e5:q g5:q e5:q c5:q | d5:q e5:q c5:h |]', 'La mineur au début (sol♯ = sensible de la) ; la phrase se termine sur do : on a basculé vers la relative majeure.', { mes: '4/4' }),
          p('**Comment repère-t-on une modulation ?** Par l’apparition d’une **nouvelle altération** (fa♯, par exemple) qui se répète, et par une **nouvelle finale**. On étudie en détail la modulation au **Volume 5**.'),
          qcm('Voisines en mineur', [
            ['Relative majeure de la mineur ?', ['do majeur', 'sol majeur', 'fa majeur', 'ré majeur'], 0, 'Do majeur.'],
            ['Dominante de la mineur ?', ['mi', 'ré', 'sol', 'si'], 0, 'Le 5ᵉ degré : mi.'],
            ['Sous-dominante de la mineur ?', ['ré', 'mi', 'si', 'sol'], 0, 'Le 4ᵉ degré : ré.'],
            ['Combien d’altérations de différence entre la mineur et mi mineur ?', ['1', '2', '0', '3'], 0, 'Mi mineur : un dièse.'],
            ['Modulation la plus fréquente en mineur ?', ['vers la relative majeure', 'vers l’homonyme majeur', 'vers un triton', 'vers la médiante majeure'], 0, 'La relative majeure.'],
          ]),
          exo('cercle', { max: 5 }, 6, 'Cercle des quintes'),
        ],
        { videos: [video('Tonalités voisines en mineur', 'tonalités voisines mineur modulation relative dominante'), video('Modulation du mineur au relatif majeur', 'modulation mineur vers relatif majeur exemple')],
          mix: [{ gen: 'cercle', params: { max: 5 } }],
          cartes: cartes('Tonalité', [['Modulation la plus fréquente en mineur ?', 'Vers la relative majeure.'], ['Voisines de la mineur ?', 'Do majeur, mi mineur, ré mineur, sol majeur, fa majeur.'], ['Comment repère-t-on une modulation ?', 'Nouvelle altération récurrente et nouvelle finale.'], ['Dominante de la mineur ?', 'Mi.']]) }),
    ],
  });
})();
