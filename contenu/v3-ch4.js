/* Volume 3 · Chapitre 4 — Les trois formes du mineur : naturel, harmonique, mélodique. */
(function () {
  const { p, h, def, rem, ex, liste, num, tab, sc, piano, ry, qcm, exo, clav, son, cartes, video, ivs, G, L } = Contenu.o;
  const T = Theorie, nm = (n) => T.nomFr(n), Mj = (n) => T.Maj(n);
  const { DOIGTES_MIN, NOT, OCT_BAS, cap, bar, etiqs, noms7 } = G;
  const armTxt = (n) => (n === 0 ? 'aucune altération' : Math.abs(n) + (n > 0 ? ' dièse' : ' bémol') + (Math.abs(n) > 1 ? 's' : ''));
  const finH = (s) => s.replace(/:q( \|\])$/, ':h$1');
  // gamme mélodique : montante avec VI et VII relevés, descendante naturelle (les altérations de rappel sont écrites)
  function melScore(t, oct, arm, etiq) {
    const e = T.Ecr(arm), up = T.gamme(t + oct, 'mel'), down = T.gamme(t + oct, 'min').slice(0, 7).reverse();
    const toks = up.map((n, i) => e.note(n, 'q') + (etiq && etiq[i] ? ' @' + etiq[i] : '')).concat(down.map((n) => e.note(n, 'q')));
    return finH(bar(toks.join(' '), 4));
  }
  const harmScore = (t, oct, arm, etiq) => bar(T.gammeScore(t + oct, 'harm', { d: 'q', arm, etiq }), 4);
  // blocs « gamme harmonique et mélodique » avec doigtés
  function blocsForme(t) {
    const arm = T.nbAlterations(t + '4', 'min'), rh = DOIGTES_MIN[t], nom = cap(NOT[t]) + ' mineur';
    const gh = T.gamme(t + '4', 'harm'), gm = T.gamme(t + '4', 'mel');
    return [
      h(nom + ' · ' + armTxt(arm)),
      tab(['Forme', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'], [['Naturel'].concat(T.gamme(t + '4', 'min').map(nm)), ['Harmonique'].concat(gh.map(nm)), ['Mélodique ↑'].concat(gm.map(nm))]),
      sc(harmScore(t, 4, arm, etiqs(rh[0])), nom + ' harmonique, main droite.', { mes: '4/4', arm }),
      sc(melScore(t, 4, arm, etiqs(rh[0])), nom + ' mélodique : montée avec VI et VII relevés, descente naturelle (mêmes doigtés qu’en naturel).', { mes: '4/4', arm }),
    ];
  }
  function cartesForme(t) {
    const arm = T.nbAlterations(t + '4', 'min'), nom = cap(NOT[t]) + ' mineur';
    return [
      { cat: 'Gammes mineures', q: 'Notes de ' + nom + ' harmonique ?', r: T.gamme(t + '4', 'harm').map(nm).join(' – ') + '.', p: { clef: 'sol', arm, mes: '4/4', s: harmScore(t, 4, arm) } },
      { cat: 'Gammes mineures', q: 'Notes de ' + nom + ' mélodique (montée) ?', r: T.gamme(t + '4', 'mel').map(nm).join(' – ') + '. (Descente : naturelle.)' },
    ];
  }

  Contenu.chapitre('v3', {
    id: 'v3c4', titre: 'Chapitre 4 · Les trois formes du mineur',
    lecons: [
      L('v3-21-sensible', 'Le problème de la sensible', 30,
        ['Comprendre pourquoi la gamme mineure naturelle « manque » de sensible.', 'Distinguer sensible et sous-tonique.', 'Saisir pourquoi les musiciens ont inventé d’autres formes du mineur.'],
        [
          p('La gamme mineure naturelle est belle, mais elle a un **défaut musical** : son 7ᵉ degré est à **un ton** de la tonique (sol–la en la mineur), alors qu’en majeur il est à **un demi-ton** (si–do). Or ce demi-ton sous la tonique a un pouvoir énorme : il crée une **tension** qui « appelle » la tonique.'),
          def('sensible', 'La **sensible** est le **7ᵉ degré situé un demi-ton sous la tonique**. Elle est « sensible » parce qu’elle **tire** vers la tonique : on a envie de monter. Quand le 7ᵉ degré est un ton plus bas, il s’appelle **sous-tonique** : il ne tire pas.'),
          h('Écoute la différence'),
          sc('a4:q g4:q a4:h |]', 'Fin de phrase avec la **sous-tonique** (sol naturel) : on retombe sur la tonique sans tension, effet « modal », archaïque.', { mes: '4/4' }),
          sc('a4:q g#4:q a4:h |]', 'Fin de phrase avec la **sensible** (sol♯) : le sol♯ « monte » vers la : conclusion forte, effet « classique ».', { mes: '4/4' }),
          p('Dans la musique classique (du XVIIᵉ au XIXᵉ), on veut une **vraie conclusion** : on **relève donc le 7ᵉ degré** d’un demi-ton pour obtenir une sensible. Mais cela crée un nouveau problème : entre le **6ᵉ degré** (fa) et le **7ᵉ relevé** (sol♯), il y a maintenant **3 demi-tons** : une **seconde augmentée**, difficile à chanter. D’où trois « formes » du mineur :'),
          tab(['Forme', 'Idée'], [['Naturel', 'On garde la gamme telle quelle (pas de sensible).'], ['Harmonique', 'On relève seulement le VII : une sensible, mais une seconde augmentée VI–VII.'], ['Mélodique', 'En montant, on relève VI et VII (pas de seconde augmentée) ; en descendant, on revient au naturel.']]),
          rem('Mineur = trois visages d’une même tonalité', 'Il n’y a **qu’une seule armure** pour une tonalité mineure : celle du mineur **naturel**. Le VI et le VII relevés sont des **altérations accidentelles** écrites quand c’est nécessaire (la sensible, par exemple). Les trois formes sont donc trois façons de **colorer** la même tonalité.'),
          qcm('Sensible', [
            ['La sensible est…', ['le 7ᵉ degré à un demi-ton sous la tonique', 'le 7ᵉ degré à un ton sous la tonique', 'le 5ᵉ degré', 'le 3ᵉ degré'], 0, 'Un demi-ton sous la tonique.'],
            ['En la mineur naturel, le 7ᵉ degré est…', ['sol (sous-tonique)', 'sol♯ (sensible)', 'si', 'fa♯'], 0, 'Sol naturel, à un ton de la.'],
            ['Pour créer une sensible en la mineur, on altère…', ['le sol (sol♯)', 'le fa (fa♯)', 'le si (si♭)', 'le do (do♯)'], 0, 'Sol♯, un demi-ton sous la.'],
            ['L’intervalle fa–sol♯ est…', ['une seconde augmentée', 'une tierce mineure', 'une seconde majeure', 'une tierce majeure'], 0, 'Deux lettres, 3 demi-tons.'],
            ['Combien d’armures différentes pour une tonalité mineure ?', ['1', '2', '3', '4'], 0, 'Celle du mineur naturel (= relative majeure).'],
          ]),
          exo('gamme-ecoute', { types: ['maj', 'min', 'harm'] }, 6, 'À l’oreille : majeur / naturel / harmonique'),
        ],
        { videos: [video('La sensible en musique', 'la sensible en musique solfège explication septième degré'), video('Pourquoi trois gammes mineures ?', 'pourquoi trois gammes mineures naturelle harmonique mélodique')],
          mix: [{ gen: 'gamme-ecoute', params: { types: ['maj', 'min', 'harm'] } }],
          cartes: cartes('Gammes mineures', [['Sensible ?', 'Le 7ᵉ degré à un demi-ton sous la tonique : il tire vers elle.'], ['Sous-tonique ?', 'Le 7ᵉ degré à un ton sous la tonique (mineur naturel).'], ['Pourquoi le mineur harmonique ?', 'Pour avoir une sensible (VII relevé).'], ['Pourquoi le mineur mélodique ?', 'Pour éviter la seconde augmentée VI–VII en montant.'], ['Combien d’armures pour une tonalité mineure ?', 'Une seule : celle du mineur naturel.']]) }),

      L('v3-22-harmonique', 'Le mineur harmonique', 40,
        ['Écrire la gamme mineure harmonique (VII relevé).', 'Connaître sa formule : T ½ T T ½ 1½ ½.', 'Repérer la seconde augmentée VI–VII.'],
        [
          def('mineur harmonique', 'La gamme **mineure harmonique** est la gamme mineure naturelle dont on **relève le 7ᵉ degré** d’un demi-ton (monter ou descendre : elle reste la même). Formule : **T – ½ – T – T – ½ – 1½ – ½**.'),
          sc(harmScore('a', 4, 0), 'La mineur harmonique : la si do ré mi fa **sol♯** la. Le sol♯ n’est pas dans l’armure : c’est une altération accidentelle.', { mes: '4/4' }),
          tab(['Degré', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'], [['Note', 'la', 'si', 'do', 'ré', 'mi', 'fa', 'sol♯', 'la'], ['Vers la suivante', 'T', '½', 'T', 'T', '½', '1½', '½', '']]),
          h('La seconde augmentée'),
          p('Entre le **6ᵉ degré (fa)** et le **7ᵉ degré relevé (sol♯)** se glisse un intervalle de **trois demi-tons** : une **seconde augmentée**. C’est la signature sonore du mineur harmonique : un « saut oriental » reconnaissable entre mille (musique klezmer, flamenco, arabe, Rimski-Korsakov, métal néoclassique…).'),
          sc('f4:h g#4:h |]', 'Fa → sol♯ : seconde augmentée (3 demi-tons). À écouter !', { mes: '4/4' }),
          h('Ce que cette gamme apporte à l’harmonie'),
          p('Grâce à la **sensible**, l’accord de **dominante** (V) devient **majeur** (mi–sol♯–si en la mineur) au lieu de mineur (mi–sol–si). C’est pourquoi on dit « harmonique » : elle sert à construire les **accords** (Volume 4).'),
          sc('e4+g#4+b4:h a4+c5+e5:h |]', 'Accord de dominante (V) en la mineur avec la sensible (mi–sol♯–si), qui résout sur l’accord de tonique (la–do–mi).', { mes: '4/4' }),
          h('Quelques gammes harmoniques'),
          tab(['Mineur', 'Armure', 'Notes (harmonique)'], ['a', 'e', 'b', 'd', 'g', 'c', 'f#'].map((t) => [cap(NOT[t]) + ' mineur', armTxt(T.nbAlterations(t + '4', 'min')), noms7(t + '4', 'harm') + ' – ' + nm(T.gamme(t + '4', 'harm')[7])])),
          rem('Comment les retrouver ?', 'Écris le mineur naturel (avec l’armure), puis **relève la dernière note avant la tonique d’un demi-ton** : en la mineur, sol → sol♯ ; en mi mineur, ré → ré♯ ; en ré mineur, do → do♯ ; en sol mineur, fa → fa♯ ; en do mineur, si♭ → si naturel (un bécarre !).'),
          qcm('Mineur harmonique', [
            ['Notes de la mineur harmonique ?', ['la si do ré mi fa sol♯ la', 'la si do ré mi fa♯ sol♯ la', 'la si do ré mi fa sol la', 'la si do♯ ré mi fa sol♯ la'], 0, 'Seul le VII est relevé.'],
            ['Notes de mi mineur harmonique ?', ['mi fa♯ sol la si do ré♯ mi', 'mi fa sol la si do ré mi', 'mi fa♯ sol♯ la si do♯ ré♯ mi', 'mi fa♯ sol la si do♯ ré♯ mi'], 0, 'Fa♯ (armure), ré♯ (sensible).'],
            ['Quel intervalle caractérise le mineur harmonique ?', ['seconde augmentée VI–VII', 'tierce majeure', 'quinte diminuée', 'quarte augmentée'], 0, '1½ ton entre VI et VII.'],
            ['La sensible de ré mineur est…', ['do♯', 'do', 'si♭', 'mi'], 0, 'Un demi-ton sous ré : do♯.'],
            ['La sensible de do mineur est…', ['si naturel', 'si♭', 'la♭', 'ré'], 0, 'Si bécarre (l’armure donne si♭).'],
            ['Le mineur harmonique rend l’accord de dominante…', ['majeur', 'mineur', 'diminué', 'augmenté'], 0, 'Mi–sol♯–si est majeur.'],
          ]),
          exo('gamme-degre', { types: ['harm'], max: 5, degres: [6, 7] }, 8, 'Les degrés VI et VII en harmonique'),
          exo('gamme-reco', { types: ['min', 'harm'], max: 5 }, 8, 'Naturel ou harmonique ?'),
          exo('gamme-ecoute', { types: ['min', 'harm'] }, 6, 'À l’oreille : naturel ou harmonique ?'),
        ],
        { videos: [video('Gamme mineure harmonique', 'gamme mineure harmonique solfège piano explication seconde augmentée'), video('Mineur harmonique : sons et exemples', 'mineur harmonique exemples musique klezmer flamenco')],
          mix: [{ gen: 'gamme-degre', params: { types: ['harm'], max: 5, degres: [6, 7] } }, { gen: 'gamme-reco', params: { types: ['min', 'harm'], max: 5 } }],
          cartes: cartes('Gammes mineures', [['Formule du mineur harmonique ?', 'T ½ T T ½ 1½ ½.'], ['Quelle altération définit le mineur harmonique ?', 'Le VII relevé (sensible).'], ['Quel intervalle est caractéristique du mineur harmonique ?', 'La seconde augmentée entre VI et VII.'], ['Notes de la mineur harmonique ?', 'La – si – do – ré – mi – fa – sol♯ – la.'], ['La sensible de mi mineur ?', 'Ré♯.']]).concat(cartesForme('a'), cartesForme('e'), cartesForme('d')) }),

      L('v3-23-melodique', 'Le mineur mélodique', 40,
        ['Écrire la gamme mineure mélodique (montée et descente).', 'Retenir que la montée relève VI et VII, la descente est naturelle.', 'Distinguer mélodique « classique » et « jazz ».'],
        [
          def('mineur mélodique', 'La gamme **mineure mélodique** se joue **différemment à la montée et à la descente** : en **montant**, on **relève les 6ᵉ et 7ᵉ degrés** (T ½ T T T T ½) ; en **descendant**, on revient à la gamme **naturelle** (T T ½ T T ½ T).'),
          sc(melScore('a', 4, 0), 'La mineur mélodique : à la montée fa♯ et sol♯ ; à la descente sol et fa naturels (♮ de rappel).', { mes: '4/4' }),
          tab(['Sens', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'], [['Montée', 'la', 'si', 'do', 'ré', 'mi', 'fa♯', 'sol♯', 'la'], ['Descente', 'la', 'sol', 'fa', 'mi', 'ré', 'do', 'si', 'la']]),
          p('**Pourquoi relever le VI ?** Parce que, une fois le VII relevé (sensible), la seconde augmentée VI–VII serait lourde à chanter : on relève aussi le VI pour que la montée se fasse **par secondes conjointes** (ton, ton, demi-ton). **Pourquoi redescendre au naturel ?** Parce qu’en descendant, il n’y a plus besoin de sensible ni de tension : la mélodie retombe naturellement.'),
          rem('Astuce', 'La **montée** du mineur mélodique est exactement une **gamme majeure avec la tierce abaissée** : la mineur mélodique ↑ = la si do ré mi fa♯ sol♯ la, soit **la majeur avec do naturel** au lieu de do♯. Elle sonne « majeure » dans sa deuxième moitié et « mineure » dans la première.'),
          h('Dans la pratique'),
          liste('Les musiciens **classiques** utilisent ces formes **selon le contexte** : si la mélodie monte vers la tonique, on relève VI et VII ; si elle redescend, on garde le naturel.', 'Les **jazzmen** utilisent souvent la gamme mélodique **montante** dans les deux sens (« mineur mélodique jazz ») : c’est la source de beaucoup de gammes de l’improvisation moderne (Volume 5).'),
          h('Quelques gammes mélodiques (montée)'),
          tab(['Mineur', 'Armure', 'Montée'], ['a', 'e', 'b', 'd', 'g', 'c', 'f#'].map((t) => [cap(NOT[t]) + ' mineur', armTxt(T.nbAlterations(t + '4', 'min')), T.gamme(t + '4', 'mel').map(nm).join(' – ')])),
          qcm('Mineur mélodique', [
            ['Quels degrés sont relevés à la montée du mineur mélodique ?', ['VI et VII', 'III et VII', 'VII seulement', 'IV et V'], 0, 'VI et VII.'],
            ['Que devient la gamme à la descente ?', ['naturelle', 'harmonique', 'majeure', 'chromatique'], 0, 'On revient au mineur naturel.'],
            ['La mineur mélodique montant : notes ?', ['la si do ré mi fa♯ sol♯ la', 'la si do ré mi fa sol♯ la', 'la si do ré mi fa sol la', 'la si do♯ ré mi fa♯ sol♯ la'], 0, 'VI et VII relevés.'],
            ['Mi mineur mélodique montant ?', ['mi fa♯ sol la si do♯ ré♯ mi', 'mi fa♯ sol la si do ré♯ mi', 'mi fa sol la si do♯ ré♯ mi', 'mi fa♯ sol la si do ré mi'], 0, 'Fa♯ (armure), do♯, ré♯.'],
            ['Le mineur mélodique évite…', ['la seconde augmentée', 'la tierce mineure', 'la quinte juste', 'l’octave'], 0, 'VI–VII devient une seconde majeure.'],
          ]),
          exo('gamme-degre', { types: ['mel'], max: 5, degres: [6, 7] }, 8, 'Les degrés VI et VII en mélodique (montée)'),
          exo('gamme-reco', { types: ['min', 'harm', 'mel'], max: 5 }, 10, 'Naturel, harmonique ou mélodique ?'),
        ],
        { videos: [video('Gamme mineure mélodique', 'gamme mineure mélodique piano solfège montée descente explication'), video('Mineur mélodique et jazz', 'mineur mélodique jazz gamme improvisation')],
          mix: [{ gen: 'gamme-reco', params: { types: ['min', 'harm', 'mel'], max: 5 } }],
          cartes: cartes('Gammes mineures', [['Quelles altérations dans le mineur mélodique (montée) ?', 'VI et VII relevés.'], ['Que devient la gamme mélodique à la descente ?', 'Mineur naturel.'], ['Formule du mineur mélodique montant ?', 'T ½ T T T T ½.'], ['La mineur mélodique montant ?', 'La si do ré mi fa♯ sol♯ la.']]).concat(cartesForme('g'), cartesForme('c')) }),

      L('v3-24-comparer', 'Comparer les trois formes', 35,
        ['Résumer naturel / harmonique / mélodique en un tableau.', 'Savoir laquelle utiliser selon le contexte.', 'Identifier la forme d’une gamme écrite.'],
        [
          p('Récapitulons, en prenant **la mineur** comme exemple :'),
          tab(['Degré', 'Naturel', 'Harmonique', 'Mélodique ↑', 'Mélodique ↓'], [['I', 'la', 'la', 'la', 'la'], ['II', 'si', 'si', 'si', 'si'], ['III', 'do', 'do', 'do', 'do'], ['IV', 'ré', 'ré', 'ré', 'ré'], ['V', 'mi', 'mi', 'mi', 'mi'], ['VI', 'fa', 'fa', '**fa♯**', 'fa'], ['VII', 'sol', '**sol♯**', '**sol♯**', 'sol']]),
          sc(bar(T.gammeScore('a3', 'min', { d: 'q' }), 4), 'Naturel.', { mes: '4/4' }),
          sc(harmScore('a', 3, 0), 'Harmonique.', { mes: '4/4' }),
          sc(melScore('a', 3, 0), 'Mélodique : montée (fa♯, sol♯) puis descente naturelle.', { mes: '4/4' }),
          tab(['Forme', 'Formule', 'Intervalle remarquable', 'Usage'], [['Naturel', 'T ½ T T ½ T T', 'sous-tonique (VII)', 'musique modale, folk, pop'], ['Harmonique', 'T ½ T T ½ 1½ ½', 'seconde augmentée VI–VII', 'harmonie classique (accord V)'], ['Mélodique', '↑ T ½ T T T T ½ · ↓ naturel', 'sixte et septième relevées', 'lignes mélodiques classiques ; jazz']]),
          rem('Ce qu’il faut retenir', 'Les trois formes **partagent les cinq premiers degrés** (I à V) : tierce mineure, quarte et quinte justes. Elles ne se distinguent que par les **degrés VI et VII**. Pour reconnaître la forme d’une gamme, regarde donc **d’abord le VI et le VII**.'),
          p('**Astuce de lecture** : le VII relevé (sensible) se trouve un demi-ton sous la tonique ; si le VI est aussi relevé (un ton sous le VII relevé), c’est le mélodique ; sinon c’est l’harmonique (seconde augmentée entre VI et VII).'),
          qcm('Quelle forme ?', [
            ['La si do ré mi fa sol♯ la : quelle forme ?', ['harmonique', 'naturel', 'mélodique', 'majeur'], 0, 'Sol♯ seul.'],
            ['La si do ré mi fa♯ sol♯ la : quelle forme ?', ['mélodique ↑', 'harmonique', 'naturel', 'majeur'], 0, 'Fa♯ et sol♯.'],
            ['La si do ré mi fa sol la : quelle forme ?', ['naturel', 'harmonique', 'mélodique', 'dorien'], 0, 'Aucune altération.'],
            ['Pour avoir une sensible, on choisit…', ['harmonique ou mélodique', 'naturel', 'dorien', 'chromatique'], 0, 'Le VII relevé les caractérise.'],
            ['Qu’ont en commun les 3 formes ?', ['les degrés I à V', 'les degrés VI et VII', 'aucun degré', 'le degré III seulement'], 0, 'I–V sont identiques.'],
          ]),
          exo('gamme-reco', { types: ['min', 'harm', 'mel'], max: 6 }, 12, 'Reconnaître la forme'),
          exo('gamme-degre', { types: ['min', 'harm', 'mel'], max: 6, degres: [6, 7] }, 10, 'Degrés VI et VII selon la forme'),
        ],
        { videos: [video('Les trois gammes mineures comparées', 'gammes mineures naturelle harmonique mélodique comparaison tableau'), video('Quelle gamme mineure utiliser ?', 'quelle gamme mineure utiliser harmonique mélodique quand')],
          mix: [{ gen: 'gamme-reco', params: { types: ['min', 'harm', 'mel'], max: 6 } }, { gen: 'gamme-degre', params: { types: ['min', 'harm', 'mel'], max: 6, degres: [6, 7] } }],
          cartes: cartes('Gammes mineures', [['Degrés communs aux trois formes ?', 'I à V.'], ['Qu’est-ce qui distingue les formes du mineur ?', 'Les degrés VI et VII.'], ['Harmonique : VI et VII ?', 'VI naturel, VII relevé.'], ['Mélodique ↑ : VI et VII ?', 'Tous deux relevés.'], ['Naturel : VI et VII ?', 'Tous deux non relevés.']]) }),

      L('v3-25-accidents', 'Les altérations accidentelles en mineur', 35,
        ['Repérer la sensible écrite en altération accidentelle.', 'Lire une mélodie en mineur avec ses altérations.', 'Déduire la tonalité (mineur ou majeur) d’une mélodie.'],
        [
          p('L’armure d’une tonalité mineure ne contient que les altérations du **mineur naturel**. La **sensible** (VII relevé) et le VI relevé s’écrivent donc **devant les notes**, comme des altérations accidentelles : elles valent jusqu’à la **barre de mesure** (rappel de V1).'),
          h('Exemple : la « Lettre à Élise » de Beethoven'),
          sc('e5:s d#5:s | e5:s d#5:s e5:s b4:s d5:s c5:s | a4:e r:s c4:s e4:s a4:s | b4:e r:s e4:s g#4:s b4:s | c5:e r:s e4:s e5:s d#5:s | e5:s d#5:s e5:s b4:s d5:s c5:s | a4:e r:s c4:s e4:s a4:s | b4:e r:s e4:s c5:s b4:s | a4:q. |]', 'Début de *Für Elise* (la mineur, 3/8). Le ré♯ (note de passage sur mi) et le sol♯ (sensible de la mineur) sont des altérations accidentelles : l’armure est vide.', { mes: '3/8', anacrouse: true }),
          p('**Que se passe-t-il ?** Le ré♯ est la **sensible de mi** : il « tire » vers mi (la dominante). Le sol♯ est la **sensible de la**. Dans le morceau, ces deux altérations apparaissent sans cesse et **révèlent la tonalité**: aucune altération à l’armure, mais un sol♯ qui revient → **la mineur**, pas do majeur.'),
          h('Pour trouver la tonalité : l’enquête'),
          num('**Armure** : donne deux candidats (majeur / relative mineure).', '**Dernière note** : la tonique.', '**Altérations accidentelles** : un 7ᵉ degré relevé (sensible) qui revient souvent désigne le **mineur**. Exemple : armure vide + sol♯ récurrent + dernière note la → **la mineur**.'),
          h('Une mélodie à lire'),
          sc('a4:q c5:q b4:q a4:q | g#4:q a4:q b4:q c5:q | d5:q c5:q b4:q a4:q | g#4:q a4:q a4:h |]', 'Mélodie en la mineur : le sol♯ (sensible) apparaît deux fois, et la mélodie finit sur la.', { mes: '4/4' }),
          sc('e4:q g4:q f#4:q e4:q | d#4:q e4:q f#4:q g4:q | a4:q g4:q f#4:q e4:q | d#4:q e4:q e4:h |]', 'Mélodie en mi mineur (un dièse : fa♯ dans l’armure). Le ré♯ est la sensible (altération accidentelle) ; elle finit sur mi.', { mes: '4/4', arm: 1 }),
          rem('Attention au bécarre', 'En **do mineur** (armure : si♭ mi♭ la♭), la sensible est **si naturel** : il faut écrire un **bécarre** devant si. En **ré mineur** (armure : si♭), la sensible est **do♯**. En lisant, vérifie chaque altération accidentelle avant de jouer.'),
          qcm('Altérations en mineur', [
            ['Armure vide, sol♯ qui revient, finale sur la. Tonalité ?', ['la mineur', 'do majeur', 'mi mineur', 'sol majeur'], 0, 'Le sol♯ est la sensible de la.'],
            ['Armure : un bémol, do♯ qui revient, finale sur ré. Tonalité ?', ['ré mineur', 'fa majeur', 'sol mineur', 'la mineur'], 0, 'Do♯ est la sensible de ré.'],
            ['En do mineur, la sensible s’écrit…', ['si♮ (bécarre)', 'si♭', 'ré♭', 'la♭'], 0, 'L’armure donne si♭ ; la sensible est si naturel.'],
            ['Une altération accidentelle vaut…', ['jusqu’à la barre de mesure', 'pour tout le morceau', 'pour une seule note', 'jusqu’à la fin de la ligne'], 0, 'Rappel : jusqu’à la barre.'],
            ['Dans Für Elise (début), pourquoi l’armure est-elle vide ?', ['La mineur n’a pas d’altération', 'Il y a des erreurs', 'C’est en do majeur', 'C’est en fa majeur'], 0, 'La mineur naturel est sur les touches blanches.'],
          ]),
          exo('armure-notes', { mode: 'min', max: 5 }, 8, 'Altérations de l’armure en mineur'),
        ],
        { videos: [video('Lettre à Élise : analyse du début', 'lettre à Élise analyse harmonique début la mineur'), video('Trouver la tonalité en mineur', 'trouver la tonalité mineure sensible altération accidentelle')],
          mix: [{ gen: 'armure-notes', params: { mode: 'min', max: 5 } }],
          cartes: cartes('Tonalité', [['Où s’écrit la sensible d’une tonalité mineure ?', 'En altération accidentelle (devant la note), pas dans l’armure.'], ['Armure vide + sol♯ récurrent + fin sur la ?', 'La mineur.'], ['Sensible de do mineur ?', 'Si naturel (bécarre).'], ['Sensible de ré mineur ?', 'Do♯.'], ['Sensible de mi mineur ?', 'Ré♯.']]) }),

      L('v3-26-jouer-formes', 'Jouer les gammes mineures harmoniques et mélodiques', 40,
        ['Jouer les gammes de la, mi, ré et sol mineur sous leurs trois formes.', 'Garder les doigtés du mineur naturel.', 'Enchaîner une routine « majeur – naturel – harmonique – mélodique ».'],
        [
          p('Bonne nouvelle : **les doigtés ne changent pas** d’une forme à l’autre. Seules deux touches changent de place (le VI et le VII). Pratique chaque gamme en trois temps : **naturel → harmonique → mélodique**.'),
          rem('Routine « trois formes »', 'Pour chaque tonique, joue d’une traite : la gamme **naturelle**, puis **harmonique**, puis **mélodique** (montée + descente). Écoute bien le **demi-ton** qui apparaît sous la tonique et la **seconde augmentée** de l’harmonique.'),
          ...blocsForme('a'),
          ...blocsForme('e'),
          ...blocsForme('d'),
          ...blocsForme('g'),
          h('Arpège de tonique et cadence'),
          p('Après les gammes, joue l’**arpège** de tonique (la–do–mi) puis la petite cadence **V–i** (mi–sol♯–si → la–do–mi) pour sentir la sensible en action.'),
          sc('a3:q c4:q e4:q a4:q | e4+g#4+b4:h a3+c4+e4:h |]', 'Arpège de la mineur (la–do–mi–la), puis cadence V–i avec sensible sol♯.', { mes: '4/4' }),
          qcm('Gammes jouées', [
            ['Les doigtés changent-ils d’une forme à l’autre ?', ['Non', 'Oui, complètement', 'Seulement à la main gauche', 'Seulement à la main droite'], 0, 'Seules les altérations changent.'],
            ['Pour la mineur harmonique, quelle touche noire apparaît ?', ['sol♯', 'fa♯', 'si♭', 'do♯'], 0, 'Sol♯.'],
            ['Pour la mineur mélodique montant, quelles touches noires ?', ['fa♯ et sol♯', 'sol♯ seulement', 'si♭ et mi♭', 'aucune'], 0, 'VI et VII relevés.'],
          ]),
        ],
        { videos: [video('Gammes mineures harmoniques au piano', 'gammes mineures harmonique mélodique piano doigtés la mineur'), video('Arpèges et cadences en mineur', 'arpège la mineur cadence piano débutant')],
          mix: [{ gen: 'gamme-reco', params: { types: ['min', 'harm', 'mel'], max: 3 } }],
          cartes: cartes('Gammes mineures', [['Les doigtés changent-ils entre naturel, harmonique et mélodique ?', 'Non : seules les altérations (VI, VII) changent.'], ['Cadence V–i en la mineur ?', 'Mi–sol♯–si puis la–do–mi.'], ['Arpège de la mineur ?', 'La – do – mi – la.']]).concat(cartesForme('a')) }),

      L('v3-27-oreille-mineur', 'Oreille : majeur, mineur, harmonique, mélodique', 35,
        ['Reconnaître à l’oreille une gamme majeure ou mineure.', 'Entendre la seconde augmentée et la sensible.', 'Associer chaque forme à une couleur sonore.'],
        [
          p('Le mode se reconnaît **à l’oreille** bien avant de savoir le nommer. Voici les caractères sonores à retenir :'),
          tab(['Forme', 'Couleur'], [['Majeur', 'Clair, stable, ouvert.'], ['Mineur naturel', 'Sombre, un peu « ancien », modal ; le VII ne tire pas.'], ['Mineur harmonique', 'Dramatique, « oriental » : la seconde augmentée se remarque tout de suite.'], ['Mineur mélodique ↑', 'Tendu en bas (tierce mineure), lumineux en haut ; descente naturelle.']]),
          rem('Comment s’entraîner ?', 'Joue-toi la gamme de **la**, puis chante-la mentalement. Compare ensuite avec une gamme **majeure** de même tonique (la majeur) et écoute le **III**. Commence par **majeur vs mineur**, puis ajoute l’harmonique, enfin le mélodique. Les séries ci-dessous augmentent progressivement.'),
          exo('gamme-ecoute', { types: ['maj', 'min'] }, 8, 'Niveau 1 : majeur ou mineur ?'),
          exo('gamme-ecoute', { types: ['min', 'harm'] }, 8, 'Niveau 2 : naturel ou harmonique ?'),
          exo('gamme-ecoute', { types: ['maj', 'min', 'harm', 'mel'] }, 12, 'Niveau 3 : les quatre gammes'),
          h('Intervalles caractéristiques'),
          exo('interv-ecoute', { liste: [[2, 'M'], [2, 'A'], [3, 'm'], [3, 'M']] }, 8, 'Seconde majeure, seconde augmentée, tierces'),
          qcm('Oreille', [
            ['Quelle gamme contient une seconde augmentée ?', ['mineur harmonique', 'mineur naturel', 'majeur', 'mineur mélodique'], 0, 'VI–VII = 1½ ton.'],
            ['La tierce mineure donne un caractère…', ['sombre', 'brillant', 'oriental', 'neutre'], 0, 'Le mineur est sombre.'],
            ['Le mineur mélodique descendant est…', ['naturel', 'harmonique', 'majeur', 'chromatique'], 0, 'On redescend au naturel.'],
          ]),
        ],
        { videos: [video('Reconnaître majeur et mineur à l’oreille', 'reconnaître majeur mineur oreille formation musicale exercice'), video('Écouter les trois gammes mineures', 'écouter gamme mineure naturelle harmonique mélodique piano')],
          mix: [{ gen: 'gamme-ecoute', params: { types: ['maj', 'min', 'harm', 'mel'] } }],
          cartes: cartes('Oreille', [['Couleur du mineur harmonique ?', 'Dramatique, orientale (seconde augmentée VI–VII).'], ['Couleur du mineur naturel ?', 'Sombre, modale (pas de sensible).'], ['Que change le mineur par rapport au majeur à l’oreille ?', 'La tierce mineure, plus sombre.'], ['Comment sonne le mineur mélodique montant ?', 'Mineur en bas, majeur en haut.']]) }),
    ],
  });
})();
