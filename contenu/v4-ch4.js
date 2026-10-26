/* Volume 4 · Chapitre 4 — Enchaîner, accompagner, harmoniser. */
(function () {
  const { p, h, def, rem, ex, liste, num, tab, sc, piano, ry, qcm, exo, clav, son, cartes, video, ivs, acs, G, L } = Contenu.o;
  const T = Theorie, nm = (n) => T.nomFr(n), Mj = (n) => T.Maj(n);
  const { cap, bar, prog, tableTonalites } = G;
  // accords explicites en partition piano : [fondamentale (sans octave), type] ; main droite en octave 4, basse en octave 2-3
  function pianoAcc(liste, d, parMesure, leg, mes, arm) {
    const eh = T.Ecr(arm || 0), eb = T.Ecr(arm || 0), haut = [], bas = [];
    liste.forEach(([r, ty, inv], i) => {
      if (i && i % parMesure === 0) { haut.push('|'); bas.push('|'); eh.barre(); eb.barre(); }
      const root = T.parse(r + '4'), base = T.accord(root, ty).map((n) => ({ l: n.l, a: n.a, o: n.o }));
      haut.push(eh.accord(inv ? T.renverser(base, inv) : base, d));
      const b = T.parse(r + (['c', 'd'].includes(r[0]) ? '3' : '2'));
      bas.push(eb.note(b, d));
    });
    return piano(haut.join(' ') + ' |]', bas.join(' ') + ' |]', leg, { mes: mes || '4/4', arm: arm || 0 });
  }
  const SYMB = (r, ty) => T.symboleAccord(T.parse(r + '4'), ty);

  Contenu.chapitre('v4', {
    id: 'v4c4', titre: 'Chapitre 4 · Enchaîner, accompagner, harmoniser',
    lecons: [
      L('v4-19-enchainer', 'Enchaîner les accords en douceur', 40,
        ['Comprendre les notes communes et la « position la plus proche ».', 'Enchaîner I – IV – V – I en bougeant le moins possible.', 'Éviter les sauts inutiles et les quintes parallèles.'],
        [
          p('Quand on joue une suite d’accords, on peut **tout recommencer à chaque accord** (saut de main) ou **conduire** les notes de l’un à l’autre en bougeant le moins possible. La deuxième méthode sonne bien plus **fluide** : c’est la **conduite des voix**.'),
          h('Méthode « bête » : tout en position fondamentale'),
          sc(acs([['c4', 'M'], ['f4', 'M'], ['g4', 'M'], ['c4', 'M']], 'w', 1), 'Chaque accord est rejoué en position fondamentale : la main saute de do à fa puis à sol, puis revient.', { mes: '4/4' }),
          h('Méthode « douce » : la position la plus proche'),
          prog('c4', 'maj', [1, 4, 5, 1], 'Les mêmes accords avec la position la plus proche : la main bouge à peine', { d: 'w' }),
          p('Regarde : le do reste en place entre C et F, le sol reste entre C et G, la mélodie des notes aiguës bouge **par petits pas**. À l’oreille, c’est plus naturel, et la main ne saute pas.'),
          def('note commune', 'Une **note commune** est une note qui appartient aux **deux accords** qui se suivent. On la **garde** à la même voix : elle ne bouge pas. Les autres notes se déplacent **au plus près**.'),
          tab(['Enchaînement', 'Notes communes'], [['C → F', 'do'], ['C → G', 'sol'], ['F → G', 'aucune'], ['C → Am', 'do, mi'], ['F → Dm', 'fa, la'], ['G → Em', 'sol, si']]),
          rem('Interdit à connaître', 'Les musiciens classiques évitent deux choses : les **quintes parallèles** et les **octaves parallèles** (deux voix qui montent ou descendent d’un même intervalle de quinte ou d’octave). Elles font perdre l’indépendance des voix. Dans la pop, on les accepte (accords de puissance en rock), mais en harmonie classique elles sont fautives.'),
          h('La règle de la sensible'),
          p('Dans l’accord de dominante (V), la **sensible** (7ᵉ degré) **monte** vers la tonique dans l’accord suivant. Dans G → C : le si monte sur do. Dans V7 → I : le fa de la septième **descend** sur le mi.'),
          qcm('Enchaînement', [
            ['Qu’est-ce qu’une note commune ?', ['une note qui appartient aux deux accords', 'la note la plus aiguë', 'la tonique', 'la basse'], 0, 'Elle reste à la même voix.'],
            ['Combien de notes communes entre C et Am ?', ['2', '1', '0', '3'], 0, 'Do et mi.'],
            ['Entre F et G, combien de notes communes ?', ['0', '1', '2', '3'], 0, 'Fa–la–do / sol–si–ré : aucune.'],
            ['Que fait la sensible dans V → I ?', ['elle monte vers la tonique', 'elle descend', 'elle reste', 'elle saute'], 0, 'Un demi-ton vers le haut.'],
            ['Pourquoi garde-t-on les notes communes ?', ['pour limiter les sauts et fluidifier', 'pour jouer plus fort', 'pour ralentir', 'pour changer de tonalité'], 0, 'Fluidité.'],
          ]),
          exo('accord-degre', { mode: 'maj', max: 3, degres: [1, 4, 5, 6] }, 8, 'Révision : degrés'),
        ],
        { videos: [video('Conduite des voix : enchaîner les accords au piano', 'enchaîner accords piano position la plus proche notes communes'), video('Quintes parallèles : pourquoi les éviter', 'quintes parallèles octaves parallèles harmonie interdit explication')],
          mix: [{ gen: 'accord-degre', params: { mode: 'maj', max: 3 } }],
          cartes: cartes('Enchaînement', [['Note commune ?', 'Note appartenant aux deux accords : on la garde à la même voix.'], ['Combien de notes communes entre C et Am ?', 'Deux : do et mi.'], ['Que fait la sensible dans V → I ?', 'Elle monte sur la tonique.'], ['Que fait la septième de V7 dans V7 → I ?', 'Elle descend d’un demi-ton.'], ['Pourquoi éviter les quintes parallèles ?', 'Elles font perdre l’indépendance des voix (harmonie classique).']]) }),

      L('v4-20-progressions-majeur', 'Les grandes progressions en majeur', 40,
        ['Reconnaître et jouer les progressions les plus fréquentes.', 'Les écrire en chiffres romains et les transposer.', 'Repérer ces progressions dans des chansons.'],
        [
          p('La musique populaire utilise un **petit nombre de progressions** qui reviennent partout. Les connaître te permet de **jouer des centaines de chansons** et de comprendre ce que tu entends.'),
          h('1 · I – V – vi – IV : « la progression pop »'),
          prog('c4', 'maj', [1, 5, 6, 4], 'C – G – Am – F', { d: 'h' }),
          p('La plus célèbre de la pop moderne : *Let It Be*, *No Woman No Cry*, *Someone Like You*, *With or Without You*… (et des centaines d’autres).'),
          h('2 · I – vi – IV – V : « la progression des années 50 »'),
          prog('c4', 'maj', [1, 6, 4, 5], 'C – Am – F – G', { d: 'h' }),
          p('Typique du doo-wop et du rock’n’roll : *Stand By Me*, *Every Breath You Take*, *Earth Angel*.'),
          h('3 · vi – IV – I – V : la même, décalée'),
          prog('c4', 'maj', [6, 4, 1, 5], 'Am – F – C – G', { d: 'h' }),
          p('Une rotation de la précédente : même accords, autre point de départ. Commencer sur vi (mineur) donne une couleur plus mélancolique à la même boucle.'),
          h('4 · I – IV – V – I : le grand classique'),
          prog('c4', 'maj', [1, 4, 5, 1], 'C – F – G – C', { d: 'h' }),
          h('5 · ii – V – I : le moteur du jazz'),
          prog('c4', 'maj', [2, 5, 1], 'Dm – G – C', { d: 'h', mes: '6/4' }),
          h('Le canon de Pachelbel'),
          prog('d4', 'maj', [1, 5, 6, 3, 4, 1, 4, 5], 'Canon de Pachelbel en ré majeur', { d: 'h' }),
          p('Cette suite de huit accords, **I – V – vi – iii – IV – I – IV – V**, boucle en canon dans la célèbre œuvre de Pachelbel (XVIIᵉ siècle). Elle a inspiré des centaines de chansons.'),
          rem('Les transposer', 'Tu connais maintenant les chiffres romains : tu peux jouer ces progressions **dans toutes les tonalités**. En sol majeur, I – V – vi – IV donne G – D – Em – C ; en ré majeur D – A – Bm – G ; en fa majeur F – C – Dm – B♭.'),
          tab(['Progression', 'Do', 'Sol', 'Ré', 'Fa'], [['I – V – vi – IV', 'C G Am F', 'G D Em C', 'D A Bm G', 'F C Dm B♭'], ['I – vi – IV – V', 'C Am F G', 'G Em C D', 'D Bm G A', 'F Dm B♭ C'], ['ii – V – I', 'Dm G C', 'Am D G', 'Em A D', 'Gm C F']]),
          qcm('Progressions', [
            ['I – V – vi – IV en sol majeur ?', ['G – D – Em – C', 'G – C – Am – D', 'G – D – Am – C', 'G – C – D – Em'], 0, 'Sol, ré, mi mineur, do.'],
            ['I – vi – IV – V en fa majeur ?', ['F – Dm – B♭ – C', 'F – Am – B♭ – C', 'F – Dm – C – B♭', 'F – Gm – B♭ – C'], 0, 'Fa, ré mineur, si♭, do.'],
            ['ii – V – I en sol majeur ?', ['Am – D – G', 'Gm – C – F', 'Am – D – Em', 'Bm – E – A'], 0, 'La mineur, ré, sol.'],
            ['Quelle progression est le moteur du jazz ?', ['ii – V – I', 'I – IV – I', 'vi – iii – V', 'I – iii – vi'], 0, 'ii–V–I.'],
            ['Le canon de Pachelbel commence par…', ['I – V – vi – iii', 'I – IV – V – I', 'I – vi – ii – V', 'I – ii – iii – IV'], 0, 'Puis IV – I – IV – V.'],
          ]),
          exo('accord-degre', { mode: 'maj', max: 4, degres: [1, 2, 4, 5, 6] }, 10, 'Degrés des progressions'),
        ],
        { videos: [video('La progression I V vi IV au piano', 'progression I V vi IV piano chansons pop accords'), video('Canon de Pachelbel au piano', 'canon de Pachelbel piano accords progression facile')],
          mix: [{ gen: 'accord-degre', params: { mode: 'maj', max: 4, degres: [1, 2, 4, 5, 6] } }],
          cartes: cartes('Progressions', [['La progression pop ?', 'I – V – vi – IV (C – G – Am – F).'], ['La progression des années 50 ?', 'I – vi – IV – V (C – Am – F – G).'], ['Le moteur du jazz ?', 'ii – V – I.'], ['Canon de Pachelbel ?', 'I – V – vi – iii – IV – I – IV – V.'], ['I – V – vi – IV en ré majeur ?', 'D – A – Bm – G.']]) }),

      L('v4-21-progressions-mineur', 'Les grandes progressions en mineur', 35,
        ['Jouer les progressions en mineur les plus courantes.', 'Entendre la cadence andalouse et la descente de basse.', 'Reconnaître ces progressions dans des chansons célèbres.'],
        [
          p('Le mode mineur a lui aussi ses progressions types. Voici les plus utiles, en **la mineur** (aucune altération, facile pour commencer).'),
          h('1 · i – iv – V – i : la cadence classique en mineur'),
          prog('a3', 'min', [1, 4, 5, 1], 'Am – Dm – E – Am', { d: 'h' }),
          h('2 · i – VII – VI – V : la cadence andalouse'),
          pianoAcc([['a', 'm'], ['g', 'M'], ['f', 'M'], ['e', 'M']], 'h', 2, 'La mineur : Am – G – F – E (la basse descend d’un degré à chaque accord : la–sol–fa–mi)', '4/4'),
          p('Une descente de quarte à la basse : **la – sol – fa – mi**. C’est la progression du flamenco et d’innombrables chansons : *Hit the Road Jack*, *Stairway to Heaven* (début), *Sultans of Swing* (basse).'),
          h('3 · i – VI – III – VII : l’axe mineur'),
          pianoAcc([['a', 'm'], ['f', 'M'], ['c', 'M'], ['g', 'M']], 'h', 2, 'La mineur : Am – F – C – G', '4/4'),
          p('Plusieurs hits rock/pop en ont fait leur recette : *Zombie* (The Cranberries, en mi mineur : Em – C – G – D), *Believer*, *Skyfall* (variantes).'),
          h('4 · i – iv – VII – III'),
          pianoAcc([['a', 'm'], ['d', 'm'], ['g', 'M'], ['c', 'M']], 'h', 2, 'La mineur : Am – Dm – G – C', '4/4'),
          rem('Le même schéma, deux modes', 'Les accords de l’axe mineur (Am – F – C – G) sont exactement ceux de l’axe majeur (C – G – Am – F) **décalés**. Une même boucle peut être majeure ou mineure selon l’accord sur lequel on s’arrête et sur lequel on insiste : c’est la **relative**.'),
          tab(['Progression', 'La mineur', 'Mi mineur', 'Ré mineur'], [['i – iv – V – i', 'Am Dm E Am', 'Em Am B Em', 'Dm Gm A Dm'], ['i – VII – VI – V', 'Am G F E', 'Em D C B', 'Dm C B♭ A'], ['i – VI – III – VII', 'Am F C G', 'Em C G D', 'Dm B♭ F C']]),
          qcm('Progressions en mineur', [
            ['La cadence andalouse en la mineur ?', ['Am – G – F – E', 'Am – F – C – G', 'Am – Dm – E – Am', 'Am – C – G – F'], 0, 'La basse descend.'],
            ['i – VI – III – VII en mi mineur ?', ['Em – C – G – D', 'Em – D – C – B', 'Em – Am – B – Em', 'Em – G – C – D'], 0, 'Zombie.'],
            ['Dans la cadence andalouse, le dernier accord est…', ['majeur (dominante)', 'mineur', 'diminué', 'augmenté'], 0, 'E majeur, avec sol♯.'],
            ['La cadence classique en mineur ?', ['i – iv – V – i', 'I – IV – V – I', 'i – VII – VI', 'i – VI – III'], 0, 'Am – Dm – E – Am.'],
            ['Quel mode est typique du flamenco ?', ['phrygien', 'lydien', 'ionien', 'dorien'], 0, 'La cadence andalouse est phrygienne.'],
          ]),
          exo('cadence', { types: ['parfaite', 'plagale', 'demi'], mode: 'min', max: 3 }, 8, 'Cadences en mineur'),
        ],
        { videos: [video('Cadence andalouse au piano', 'cadence andalouse piano Am G F E explication'), video('Progression Zombie en mi mineur', 'zombie cranberries accords piano progression i VI III VII')],
          mix: [{ gen: 'cadence', params: { types: ['parfaite', 'plagale', 'demi'], mode: 'min', max: 3 } }],
          cartes: cartes('Progressions', [['Cadence andalouse en la mineur ?', 'Am – G – F – E.'], ['Axe mineur i – VI – III – VII en la mineur ?', 'Am – F – C – G.'], ['Cadence classique en mineur ?', 'i – iv – V – i : Am – Dm – E – Am.'], ['Zombie (Cranberries) ?', 'Em – C – G – D.']]) }),

      L('v4-22-accompagner', 'Choisir les accords d’une mélodie', 40,
        ['Choisir un accord pour une mesure de mélodie.', 'Appliquer la règle « les notes de la mélodie appartiennent à l’accord ».', 'Harmoniser « Ah vous dirai-je maman ».'],
        [
          p('Harmoniser une mélodie, c’est lui **choisir des accords**. Il y a plusieurs possibilités (toutes pas aussi bonnes) ; voici une méthode simple pour trouver une harmonisation qui **fonctionne**.'),
          h('Les trois règles de base'),
          num('Repère la **tonalité** (armure + dernière note).', 'Pour chaque mesure (ou demi-mesure), regarde les **notes sur les temps forts**. L’accord choisi doit **contenir** ces notes.', 'Utilise surtout **I, IV, V** (et vi, ii en renfort). Termine par **V → I** ou **IV → I**.'),
          h('Exemple : « Ah ! vous dirai-je, maman »'),
          sc('c4:q ^C c4:q g4:q ^C g4:q | a4:q ^F a4:q g4:h ^C | f4:q ^F f4:q e4:q ^C e4:q | d4:q ^G d4:q c4:h ^C |]', 'Mélodie en do majeur harmonisée : C | F C | F C | G C. La note sur les temps forts dicte l’accord.', { mes: '4/4' }),
          p('Mesure par mesure : **do do sol sol** → accord de do (C) contient do et sol ; **la la sol-** → accord de fa (F) contient la, mais sol est de passage (la dominante revient sur C) ; **fa fa mi mi** → F puis C ; **ré ré do-** → G (contient ré), puis C. Résultat : **C | F C | F C | G C**.'),
          h('Quand plusieurs accords conviennent'),
          p('La note **mi**, par exemple, peut être harmonisée par **C** (tierce), **Em** (fondamentale) ou **Am** (quinte). Le choix dépend de la **couleur** désirée et de l’**enchaînement** avec les autres accords. Un bon critère : **moins de changements d’accord = plus de stabilité**.'),
          tab(['Note de mélodie', 'Accords possibles (do majeur)'], [['do', 'C, F, Am'], ['ré', 'G, Dm, Bdim'], ['mi', 'C, Em, Am'], ['fa', 'F, Dm, G7'], ['sol', 'C, G, Em'], ['la', 'F, Am, Dm'], ['si', 'G, Em, Bdim']]),
          rem('Astuce de pro', 'Si tu hésites, chante la mélodie et joue la **fondamentale** de l’accord à la basse : l’oreille te dit tout de suite si c’est juste. Les mauvais choix « grincent » : réessaie avec un accord voisin (même fonction).'),
          qcm('Choisir les accords', [
            ['Une mesure contient do–mi–sol–do. Quel accord ?', ['C', 'F', 'Dm', 'Am'], 0, 'Toutes les notes sont dans C.'],
            ['Une mesure contient la–do–fa–la. Quel accord ?', ['F', 'C', 'G', 'Em'], 0, 'Fa–la–do.'],
            ['Une mesure contient sol–si–ré. Quel accord ?', ['G', 'C', 'F', 'Dm'], 0, 'Sol–si–ré.'],
            ['Quelle note peut être harmonisée par C, Em ou Am ?', ['mi', 'fa', 'ré', 'si'], 0, 'Mi est commune.'],
            ['La phrase se termine sur do. Quelle fin d’accords ?', ['V → I', 'I → V', 'vi → ii', 'iii → vi'], 0, 'G → C.'],
          ]),
        ],
        { videos: [video('Harmoniser une mélodie', 'harmoniser une mélodie choisir les accords piano débutant'), video('Trouver les accords d’une chanson', 'trouver les accords d’une chanson à l’oreille piano')],
          mix: [],
          cartes: cartes('Progressions', [['Règle de base pour harmoniser ?', 'L’accord doit contenir les notes sur les temps forts.'], ['Accords les plus utilisés pour harmoniser ?', 'I, IV, V (et vi, ii).'], ['Harmonisation de Ah vous dirai-je maman ?', 'C | F C | F C | G C.'], ['Comment finir une phrase ?', 'V → I ou IV → I.']]) }),

      L('v4-23-figures', 'Les figures d’accompagnement à la main gauche', 45,
        ['Jouer les principales figures d’accompagnement : accords plaqués, arpèges, basse Alberti, valse.', 'Accompagner une mélodie avec la main gauche.', 'Choisir une figure selon le caractère du morceau.'],
        [
          p('Les accords n’ont pas besoin d’être plaqués : on peut les **jouer de mille façons**. Voici cinq **figures d’accompagnement** classiques, ici sur C – F – G – C. Joue-les à la **main gauche**, avec la mélodie à la main droite.'),
          h('1 · Accords plaqués'),
          piano('c5:w | c5:w | c5:w | c5:w |]', 'c3+e3+g3:w | f2+a2+c3:w | g2+b2+d3:w | c3+e3+g3:w |]', 'Accords plaqués (un par mesure) : solide, simple.', { mes: '4/4' }),
          h('2 · Basse et accord'),
          piano('c5:w | c5:w | c5:w | c5:w |]', 'c2:h c3+e3+g3:h | f2:h f2+a2+c3:h | g2:h g2+b2+d3:h | c2:h c3+e3+g3:h |]', 'Basse (fondamentale) puis accord : la basse donne le fond, l’accord l’harmonie.', { mes: '4/4' }),
          h('3 · Arpège'),
          piano('c5:w | c5:w | c5:w | c5:w |]', 'c3:q e3:q g3:q e3:q | f2:q a2:q c3:q a2:q | g2:q b2:q d3:q b2:q | c3:q e3:q g3:q e3:q |]', 'Arpège : les notes de l’accord défilent une à une.', { mes: '4/4' }),
          h('4 · Basse Alberti'),
          piano('c5:w | c5:w | c5:w | c5:w |]', 'c3:e g3:e e3:e g3:e c3:e g3:e e3:e g3:e | f2:e c3:e a2:e c3:e f2:e c3:e a2:e c3:e | g2:e d3:e b2:e d3:e g2:e d3:e b2:e d3:e | c3:e g3:e e3:e g3:e c3:e g3:e e3:e g3:e |]', 'Basse Alberti (grave–aigu–médium–aigu) : classique de Mozart et Haydn.', { mes: '4/4' }),
          h('5 · Valse'),
          piano('c5:h. | c5:h. | c5:h. | c5:h. |]', 'c2:q c3+e3+g3:q c3+e3+g3:q | f2:q f3+a3+c4:q f3+a3+c4:q | g2:q d3+g3+b3:q d3+g3+b3:q | c2:q c3+e3+g3:q c3+e3+g3:q |]', 'Valse (3/4) : basse – accord – accord (oum-pa-pa).', { mes: '3/4' }),
          rem('Quelle figure choisir ?', '**Accords plaqués** : chorals, hymnes, moments solennels. **Basse + accord** : country, folk, chanson. **Arpège** : ballades, musique romantique. **Alberti** : style classique (Mozart). **Valse** : musique à trois temps. Change de figure à chaque couplet : tu varies l’énergie sans changer d’accords.'),
          qcm('Figures', [
            ['Quelle figure alterne basse–aigu–médium–aigu ?', ['la basse Alberti', 'la valse', 'les accords plaqués', 'l’arpège montant'], 0, 'Alberti.'],
            ['Dans une valse, la main gauche joue…', ['basse – accord – accord', 'accord – basse – basse', 'arpège', 'accords plaqués'], 0, 'Oum-pa-pa.'],
            ['Quelle figure convient à une ballade romantique ?', ['l’arpège', 'la valse seule', 'la basse Alberti', 'les accords plaqués'], 0, 'Arpège.'],
            ['Que joue la main gauche en « basse et accord » ?', ['la fondamentale puis l’accord', 'toujours la quinte', 'la mélodie', 'un arpège'], 0, 'Fondamentale puis accord.'],
            ['Peut-on changer de figure sans changer d’accords ?', ['oui', 'non', 'seulement en mineur', 'seulement en valse'], 0, 'On change le caractère.'],
          ]),
        ],
        { videos: [video('Accompagnement à la main gauche au piano', 'accompagnement main gauche piano figures arpège basse Alberti valse'), video('Basse Alberti expliquée', 'basse d’Alberti piano Mozart explication main gauche')],
          mix: [],
          cartes: cartes('Accompagnement', [['Basse Alberti ?', 'Basse–aigu–médium–aigu en croches, à la main gauche.'], ['Accompagnement de valse ?', 'Basse – accord – accord (oum-pa-pa).'], ['Basse et accord ?', 'La fondamentale puis l’accord.'], ['Arpège de main gauche ?', 'Les notes de l’accord jouées une à une.']]) }),

      L('v4-24-harmoniser-ode', 'Atelier : harmoniser l’Ode à la joie', 45,
        ['Harmoniser une mélodie complète en choisissant les accords.', 'Jouer la mélodie et l’accompagnement ensemble.', 'Varier l’accompagnement.'],
        [
          p('Mettons tout en pratique avec la plus célèbre mélodie de Beethoven. **Étape 1** : la mélodie (main droite). **Étape 2** : les accords (main gauche).'),
          h('La mélodie avec les accords'),
          sc('e4:q ^C e4:q f4:q g4:q | g4:q ^G7 f4:q e4:q d4:q | c4:q ^C c4:q d4:q e4:q | e4:q. ^G7 d4:e d4:h | e4:q ^C e4:q f4:q g4:q | g4:q ^G7 f4:q e4:q d4:q | c4:q ^C c4:q d4:q e4:q | d4:q. ^G7 c4:e c4:h ^C |]', 'L’Ode à la joie (Beethoven, 9ᵉ symphonie) en do majeur avec les accords : C – G7 – C – G7 | C – G7 – C – G7 → C.', { mes: '4/4' }),
          h('Piano : mélodie et accords plaqués'),
          piano('e4:q e4:q f4:q g4:q | g4:q f4:q e4:q d4:q | c4:q c4:q d4:q e4:q | e4:q. d4:e d4:h | e4:q e4:q f4:q g4:q | g4:q f4:q e4:q d4:q | c4:q c4:q d4:q e4:q | d4:q. c4:e c4:h |]', 'c3+e3+g3:w | g2+b2+d3+f3:w | c3+e3+g3:w | g2+b2+d3+f3:w | c3+e3+g3:w | g2+b2+d3+f3:w | c3+e3+g3:w | g2+b2+d3+f3:h c3+e3+g3:h |]', 'Première harmonisation : accords plaqués.', { mes: '4/4' }),
          p('**Pourquoi G7 ?** Parce que le ré de la mélodie (sur G7) est dans l’accord, et le fa (septième) donne l’envie de résoudre sur do. À la dernière mesure, G7 (ré.) se résout sur C (do–do).'),
          h('Variantes'),
          liste('**Simplifier** : remplace G7 par G (sans fa).', '**Enrichir** : remplace C par Am (vi) à la mesure 3 : l’accord a les notes do et mi.', '**Changer la figure** : remplace les accords plaqués par une **basse Alberti** ou un **arpège** (leçon précédente).', '**Transposer** : joue l’Ode à la joie en sol majeur (G – D7 – G) avec mélodie si si do ré | ré do si la | sol sol la si | la. sol sol (dernière mesure).'),
          rem('Défi', 'Joue l’Ode à la joie **d’une seule main** (la mélodie) puis ajoute la main gauche seule (accords) **sans regarder le clavier**. Enfin, joue-la **avec la figure de ton choix** et chante-la. Tu viens de réaliser un arrangement !'),
          qcm('Harmonisation', [
            ['Quel accord sur « e e f g » ?', ['C', 'G', 'F', 'Dm'], 0, 'Mi et sol sont dans C.'],
            ['Pourquoi utiliser G7 plutôt que G ?', ['la septième fait désirer la résolution sur C', 'il est plus fort', 'il est plus grave', 'il est plus simple'], 0, 'Le fa renforce la tension.'],
            ['Comment finir la phrase ?', ['G7 → C', 'C → G7', 'F → G', 'Am → Dm'], 0, 'V7 → I.'],
          ]),
        ],
        { videos: [video('Ode à la joie au piano avec accompagnement', 'ode à la joie piano accompagnement main gauche accords C G7'), video('Harmoniser en piano facile', 'harmoniser mélodie piano facile accords débutant tutoriel')],
          mix: [],
          cartes: cartes('Accompagnement', [['Accords de l’Ode à la joie ?', 'C – G7 – C – G7 | C – G7 – C – G7 → C.'], ['Pourquoi G7 dans l’Ode ?', 'La septième fait désirer la résolution sur C.'], ['Variante simple ?', 'G à la place de G7.'], ['Dernière mesure de l’Ode ?', 'G7 sur ré. puis C sur do do : V7 → I.']]) }),
    ],
  });
})();
