/* Volume 3 · Chapitre 3 — Le mode mineur : la gamme mineure naturelle. */
(function () {
  const { p, h, def, rem, ex, liste, num, tab, sc, piano, ry, qcm, exo, clav, son, cartes, video, ivs, G, L } = Contenu.o;
  const T = Theorie, nm = (n) => T.nomFr(n), Mj = (n) => T.Maj(n);
  const { DOIGTES_MIN, NOT, OCT_BAS, cap, bar, etiqs, noms7 } = G;
  const armTxt = (n) => (n === 0 ? 'aucune altération' : Math.abs(n) + (n > 0 ? ' dièse' : ' bémol') + (Math.abs(n) > 1 ? 's' : ''));

  // une gamme mineure naturelle avec doigtés (main droite, main gauche) + tableau
  function blocsMin(t, commentaire) {
    const arm = T.nbAlterations(t + '4', 'min'), rh = DOIGTES_MIN[t], g = T.gamme(t + '4', 'min');
    const nom = cap(NOT[t]) + ' mineur';
    const out = [h(nom + ' naturel · ' + armTxt(arm) + (arm ? ' (' + T.alterationsArmure(arm).join(' ') + ')' : ''))];
    out.push(tab(['Degré', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'], [['Note'].concat(g.map(nm)), ['Vers la suivante'].concat(T.FORMULES.min.map((x) => (x === 1 ? '½' : '1')), [''])]));
    if (commentaire) out.push(p(commentaire));
    out.push(sc(bar(T.gammeScore(t + '4', 'min', { d: 'q', arm, etiq: etiqs(rh[0]) }), 4), nom + ' naturel, main droite (doigtés sous les notes).', { mes: '4/4', arm }));
    out.push(sc(bar(T.gammeScore(t + OCT_BAS[t[0]], 'min', { d: 'q', arm, etiq: etiqs(rh[1]) }), 4), nom + ' naturel, main gauche.', { clef: 'fa', mes: '4/4', arm }));
    return out;
  }
  function cartesMin(t) {
    const arm = T.nbAlterations(t + '4', 'min'), g = T.gamme(t + '4', 'min'), nom = cap(NOT[t]) + ' mineur';
    return [
      { cat: 'Gammes mineures', q: 'Quelles sont les notes de ' + nom + ' naturel ?', r: g.map(nm).join(' – ') + '.', p: { clef: 'sol', arm, mes: '4/4', s: bar(T.gammeScore(t + '4', 'min', { d: 'q', arm }), 4) } },
      { cat: 'Armures', q: 'Combien d’altérations à l’armure de ' + nom + ' ?', r: armTxt(arm).replace(/^./, (c) => c.toUpperCase()) + (arm ? ' : ' + T.alterationsArmure(arm).join(', ') : '') + '.' },
    ];
  }
  // tableau des 15 couples relatifs
  function tableRelatives() {
    const lignes = [];
    for (let n = -7; n <= 7; n++) {
      const ma = T.tonDe(n, 'maj', 4), mi = T.tonDe(n, 'min', 4);
      lignes.push([armTxt(n), Mj(ma) + ' majeur', Mj(mi) + ' mineur']);
    }
    return lignes;
  }

  Contenu.chapitre('v3', {
    id: 'v3c3', titre: 'Chapitre 3 · Le mode mineur : la gamme naturelle',
    lecons: [
      L('v3-15-mineur', 'Le mode mineur : une autre couleur', 35,
        ['Entendre la différence entre mode majeur et mode mineur.', 'Reconnaître la gamme de la mineur naturelle (touches blanches de la à la).', 'Connaître sa formule : T ½ T T ½ T T.'],
        [
          p('Jusqu’ici toutes tes gammes étaient **majeures** : elles sonnent claires, ouvertes, joyeuses. Le **mode mineur** est leur contraire expressif : **sombre, intérieur, mélancolique, dramatique**. Beaucoup de grandes pages classiques (Fantaisie-Impromptu, Sonate « Clair de lune », Lacrimosa de Mozart) et presque toutes les chansons tristes sont en mineur.'),
          p('Le piano rend la différence très concrète : **les touches blanches de la à la** forment la gamme de **la mineur naturel**.'),
          sc('a3:q b3:q c4:q d4:q | e4:q f4:q g4:q a4:q |]', 'La mineur naturel : la – si – do – ré – mi – fa – sol – la (touches blanches seulement).', { mes: '4/4' }),
          sc('c4:q d4:q e4:q f4:q | g4:q a4:q b4:q c5:q |]', 'Rappel : do majeur. Mêmes notes que la mineur, mais le point de départ n’est pas le même.', { mes: '4/4' }),
          clav('a3', 'a4', { noms: 'tous', marque: ['a3', 'a4'], legende: 'De la à la sur les touches blanches : la mineur naturel. Écoute (▶ sur la partition) : l’impression d’ensemble est très différente de do majeur.' }),
          h('La formule : où sont les demi-tons ?'),
          tab(['Degré', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'], [['Note (la mineur)', 'la', 'si', 'do', 'ré', 'mi', 'fa', 'sol', 'la'], ['Vers la suivante', '1 ton', '½ ton', '1 ton', '1 ton', '½ ton', '1 ton', '1 ton', '']]),
          def('gamme mineure naturelle', 'La **gamme mineure naturelle** suit la formule **T – ½ – T – T – ½ – T – T**. Les **demi-tons** sont entre les degrés **II et III** et entre **V et VI**. (En majeur ils étaient entre III–IV et VII–VIII.)'),
          h('Ce qui change : tierce, sixte, septième'),
          p('Compare la mineur avec **la majeur** (la si do♯ ré mi fa♯ sol♯ la) :'),
          tab(['Degré', 'la majeur', 'la mineur naturel', 'Changement'], [['III', 'do♯', 'do', 'tierce mineure au lieu de majeure'], ['VI', 'fa♯', 'fa', 'sixte mineure au lieu de majeure'], ['VII', 'sol♯', 'sol', 'septième mineure au lieu de majeure']]),
          rem('Le secret de la couleur', 'C’est surtout la **tierce mineure** (3 demi-tons) entre la tonique et le 3ᵉ degré qui crée le caractère « triste ». Les sixte et septième mineures renforcent cet effet. Retiens : **mineur = tierce, sixte et septième abaissées d’un demi-ton par rapport au majeur homonyme**.'),
          qcm('Mode mineur', [
            ['La gamme de la mineur naturel utilise…', ['uniquement les touches blanches', 'un dièse', 'un bémol', 'toutes les touches noires'], 0, 'La si do ré mi fa sol la.'],
            ['Où sont les demi-tons dans la mineur naturel ?', ['entre III–IV et VII–VIII', 'entre II–III et V–VI', 'entre I–II et IV–V', 'entre VI–VII et VII–VIII'], 1, 'si–do et mi–fa.'],
            ['Quel intervalle caractérise le mode mineur à partir de la tonique ?', ['tierce majeure', 'tierce mineure', 'quarte juste', 'quinte diminuée'], 1, 'Tierce mineure : 3 demi-tons.'],
            ['En passant de la majeur à la mineur naturel, quels degrés sont abaissés ?', ['II, V, VII', 'III, VI, VII', 'I, IV, V', 'IV, V, VI'], 1, 'Tierce, sixte et septième.'],
            ['La formule de la gamme mineure naturelle est…', ['T ½ T T ½ T T', 'T T ½ T T T ½', '½ T T T ½ T T', 'T T T ½ T T ½'], 0, 'Voir tableau.'],
          ]),
          exo('gamme-ecoute', { types: ['maj', 'min'] }, 8, 'À l’oreille : majeur ou mineur ?'),
          exo('gamme-reco', { types: ['maj', 'min'], max: 0 }, 6, 'Reconnaître la gamme (sans altérations)'),
        ],
        { videos: [video('Majeur et mineur : quelle différence ?', 'gamme majeure gamme mineure différence solfège débutant'), video('La gamme de la mineur naturel', 'gamme de la mineur naturelle piano touches blanches')],
          mix: [{ gen: 'gamme-ecoute', params: { types: ['maj', 'min'] } }],
          cartes: cartes('Gammes mineures', [['Formule de la gamme mineure naturelle ?', 'T ½ T T ½ T T.'], ['Où sont les demi-tons du mineur naturel ?', 'Entre les degrés II–III et V–VI.'], ['Notes de la mineur naturel ?', 'La – si – do – ré – mi – fa – sol – la (touches blanches).'], ['Qu’est-ce qui caractérise le mode mineur ?', 'La tierce mineure (3 demi-tons) au-dessus de la tonique.'], ['Majeur → mineur naturel : quels degrés baissent ?', 'III, VI et VII.']]) }),

      L('v3-16-mineur-toutes', 'La gamme mineure naturelle dans toutes les tonalités', 40,
        ['Construire une gamme mineure naturelle sur n’importe quelle tonique.', 'Trois méthodes : formule, relative majeure, majeur homonyme modifié.', 'Écrire ré, mi, sol et si mineur.'],
        [
          p('Comme pour le majeur, il y a **douze toniques possibles**. Trois méthodes pour construire une gamme mineure naturelle :'),
          h('Méthode 1 : la formule T ½ T T ½ T T'),
          p('On applique la formule depuis la tonique, en veillant à avoir **chaque lettre une seule fois**. Exemple en **mi mineur** : mi – fa♯ (T) – sol (½) – la (T) – si (T) – do (½) – ré (T) – mi (T).'),
          sc(bar(T.gammeScore('e4', 'min', { d: 'q', arm: 1 }), 4), 'Mi mineur naturel : un seul dièse (fa♯), comme sol majeur.', { mes: '4/4', arm: 1 }),
          h('Méthode 2 : la relative majeure'),
          p('Chaque gamme mineure naturelle a exactement les **mêmes notes** que sa **relative majeure**, située une **tierce mineure au-dessus** (3 demi-tons). Il suffit de **partir du 6ᵉ degré** de la gamme majeure. Mi mineur : la relative est **sol majeur** (sol la si do ré mi fa♯ sol) ; on part du mi → mi fa♯ sol la si do ré mi.'),
          tab(['Tonique mineure', 'Relative majeure', 'Armure'], [['la', 'do', 'aucune'], ['mi', 'sol', '1 ♯'], ['si', 'ré', '2 ♯'], ['ré', 'fa', '1 ♭'], ['sol', 'si♭', '2 ♭'], ['do', 'mi♭', '3 ♭']]),
          h('Méthode 3 : à partir du majeur homonyme'),
          p('Prends la gamme **majeure** sur la même tonique et **abaisse** les degrés **III, VI et VII** d’un demi-ton. Ré majeur (ré mi fa♯ sol la si do♯) devient ré mineur (ré mi **fa** sol la **si♭** **do**).'),
          sc(bar(T.gammeScore('d4', 'min', { d: 'q', arm: -1 }), 4), 'Ré mineur naturel : un bémol (si♭) à l’armure.', { mes: '4/4', arm: -1 }),
          sc(bar(T.gammeScore('g4', 'min', { d: 'q', arm: -2 }), 4), 'Sol mineur naturel : deux bémols (si♭, mi♭).', { mes: '4/4', arm: -2 }),
          sc(bar(T.gammeScore('b3', 'min', { d: 'q', arm: 2 }), 4), 'Si mineur naturel : deux dièses (fa♯, do♯).', { mes: '4/4', arm: 2 }),
          h('Toutes les gammes mineures naturelles (tableau de référence)'),
          tab(['Mineur', 'Armure', 'Notes'], ['a', 'e', 'b', 'f#', 'c#', 'g#', 'd', 'g', 'c', 'f', 'bb', 'eb'].map((t) => [cap(NOT[t]) + ' mineur', armTxt(T.nbAlterations(t + '4', 'min')), noms7(t + '4', 'min')])),
          qcm('Gammes mineures', [
            ['Notes de mi mineur naturel ?', ['mi fa♯ sol la si do ré', 'mi fa sol la si do ré', 'mi fa♯ sol♯ la si do♯ ré♯', 'mi sol la si do ré fa'], 0, 'Un seul dièse : fa♯.'],
            ['Relative majeure de ré mineur ?', ['fa majeur', 'la majeur', 'si♭ majeur', 'do majeur'], 0, 'Ré + 3 demi-tons = fa.'],
            ['Armure de sol mineur ?', ['1 ♭', '2 ♭', '1 ♯', '3 ♭'], 1, 'Si♭ et mi♭ (comme si♭ majeur).'],
            ['Dans do mineur naturel, la tierce est…', ['mi', 'mi♭', 'ré♯', 'fa'], 1, 'Tierce mineure : mi♭.'],
            ['Quel est le 6ᵉ degré de si mineur naturel ?', ['sol', 'sol♯', 'la', 'fa♯'], 0, 'Si do♯ ré mi fa♯ sol la si.'],
          ]),
          exo('gamme-degre', { types: ['min'], max: 5 }, 10, 'Degrés du mineur naturel'),
          exo('gamme-reco', { types: ['maj', 'min'], max: 5 }, 8, 'Reconnaître majeur / mineur naturel'),
        ],
        { videos: [video('Construire une gamme mineure naturelle', 'construire gamme mineure naturelle toutes tonalités solfège'), video('Gamme mineure et relative majeure', 'gamme mineure relative majeure tierce mineure armure')],
          mix: [{ gen: 'gamme-degre', params: { types: ['min'], max: 5 } }, { gen: 'gamme-reco', params: { types: ['maj', 'min'], max: 5 } }],
          cartes: cartes('Gammes mineures', [['Trois méthodes pour une gamme mineure naturelle ?', 'Formule T ½ T T ½ T T ; partir du 6ᵉ degré de la relative majeure ; abaisser III, VI, VII du majeur homonyme.'], ['Relative majeure d’une tonalité mineure ?', 'Une tierce mineure au-dessus de la tonique.'], ['Armure de ré mineur ?', 'Un bémol : si♭ (comme fa majeur).'], ['Armure de sol mineur ?', 'Deux bémols (comme si♭ majeur).'], ['Armure de mi mineur ?', 'Un dièse : fa♯ (comme sol majeur).']]).concat(cartesMin('e'), cartesMin('d')) }),

      L('v3-17-relatives', 'Armures mineures et relatives', 35,
        ['Trouver la relative mineure d’une tonalité majeure (et inversement).', 'Lire l’armure d’une tonalité mineure.', 'Placer les tonalités mineures sur le cercle des quintes.'],
        [
          def('relative', 'Deux tonalités **relatives** ont **la même armure** : une **majeure** et une **mineure**. La tonique mineure est une **tierce mineure sous** la tonique majeure (ou : sur le **6ᵉ degré** de la gamme majeure).'),
          tab(['Armure', 'Majeur', 'Mineur'], tableRelatives()),
          rem('Méthode de calcul', 'Majeur → relative mineure : **descends de 3 demi-tons** (do → la, sol → mi, fa → ré). Mineur → relative majeure : **monte de 3 demi-tons** (la → do, mi → sol, ré → fa). Sur la portée, c’est toujours **une tierce mineure** (3 lettres : do-si-la).'),
          h('Retrouver l’armure d’une tonalité mineure'),
          num('Trouve la **relative majeure** (+3 demi-tons).', 'Lis l’armure de cette tonalité majeure.', 'Elle vaut aussi pour le mineur.'),
          p('Exemple : **fa♯ mineur** → relative **la majeur** (+3 demi-tons) → armure de la majeur = **3 dièses** (fa♯, do♯, sol♯). Fa♯ mineur a donc ces trois dièses. Autre exemple : **si♭ mineur** → relative **ré♭ majeur** → **5 bémols**.'),
          h('Le cercle des quintes avec les mineures'),
          p('Les tonalités mineures se rangent dans le **cercle intérieur** : chaque mineure est **sous sa relative majeure** (voir leçon 38 du Volume 2). Pour les dièses : la mineur (0), mi mineur (1 ♯), si mineur (2 ♯), fa♯ mineur (3 ♯), do♯ mineur (4 ♯), sol♯ mineur (5 ♯), ré♯ mineur (6 ♯), la♯ mineur (7 ♯). Pour les bémols : ré mineur (1 ♭), sol mineur (2 ♭), do mineur (3 ♭), fa mineur (4 ♭), si♭ mineur (5 ♭), mi♭ mineur (6 ♭), la♭ mineur (7 ♭).'),
          qcm('Relatives', [
            ['Relative mineure de do majeur ?', ['la mineur', 'mi mineur', 'ré mineur', 'sol mineur'], 0, 'Do − 3 demi-tons = la.'],
            ['Relative mineure de sol majeur ?', ['mi mineur', 'si mineur', 'la mineur', 'ré mineur'], 0, 'Sol − 3 demi-tons = mi.'],
            ['Relative mineure de mi♭ majeur ?', ['do mineur', 'sol mineur', 'fa mineur', 'si♭ mineur'], 0, 'Mi♭ − 3 = do.'],
            ['Relative majeure de fa♯ mineur ?', ['la majeur', 'ré majeur', 'si majeur', 'mi majeur'], 0, 'Fa♯ + 3 demi-tons = la.'],
            ['Armure de si mineur ?', ['2 ♯', '2 ♭', '3 ♯', '1 ♯'], 0, 'Relative majeure : ré majeur.'],
            ['Armure de do♯ mineur ?', ['4 ♯', '3 ♯', '5 ♯', '3 ♭'], 0, 'Relative majeure : mi majeur, 4 dièses.'],
          ]),
          exo('relative', { mode: 'les-deux', max: 7 }, 10, 'Trouver la relative'),
          exo('armure-combien', { mode: 'min', max: 7 }, 8, 'Armure d’une tonalité mineure'),
          exo('armure-notes', { mode: 'min', max: 5 }, 6, 'Quelles altérations ?'),
        ],
        { videos: [video('Tonalités relatives : majeur et mineur', 'tonalités relatives majeur mineur armure cercle des quintes'), video('Trouver la relative mineure', 'trouver relative mineure tierce mineure solfège méthode')],
          mix: [{ gen: 'relative', params: { mode: 'les-deux', max: 7 } }, { gen: 'armure-combien', params: { mode: 'min', max: 7 } }],
          cartes: cartes('Gammes mineures', [['Relative mineure : comment la trouver ?', 'Descendre de 3 demi-tons (une tierce mineure) depuis la majeure.'], ['Relative majeure : comment la trouver ?', 'Monter de 3 demi-tons depuis la mineure.'], ['Armure de fa♯ mineur ?', '3 dièses (comme la majeur).'], ['Armure de si♭ mineur ?', '5 bémols (comme ré♭ majeur).'], ['Armure de la mineur ?', 'Aucune altération.'], ['Relatives de do mineur ?', 'Mi♭ majeur (3 bémols).']]) }),

      L('v3-18-homonymes', 'Homonymes : do majeur / do mineur', 30,
        ['Distinguer relatives (même armure) et homonymes (même tonique).', 'Passer de do majeur à do mineur en changeant trois notes.', 'Comprendre l’effet expressif du passage majeur → mineur.'],
        [
          def('homonymes', 'Deux tonalités **homonymes** ont **la même tonique** mais **un mode différent** : do majeur / do mineur, sol majeur / sol mineur… Leurs armures **diffèrent de trois altérations**.'),
          sc(bar(T.gammeScore('c4', 'maj', { d: 'q' }), 4), 'Do majeur : aucune altération.', { mes: '4/4' }),
          sc(bar(T.gammeScore('c4', 'min', { d: 'q', arm: -3 }), 4), 'Do mineur naturel : trois bémols (si♭, mi♭, la♭). Tierce, sixte et septième sont abaissées.', { mes: '4/4', arm: -3 }),
          tab(['Majeur', 'Armure', 'Mineur homonyme', 'Armure'], [['Do', 'aucune', 'do mineur', '3 ♭'], ['Sol', '1 ♯', 'sol mineur', '2 ♭'], ['Ré', '2 ♯', 'ré mineur', '1 ♭'], ['La', '3 ♯', 'la mineur', 'aucune'], ['Mi', '4 ♯', 'mi mineur', '1 ♯'], ['Fa', '1 ♭', 'fa mineur', '4 ♭']]),
          rem('Piège', 'Ne confonds pas **relatives** et **homonymes** : do majeur et **la mineur** sont **relatives** (même armure) ; do majeur et **do mineur** sont **homonymes** (même tonique). Les relatives sont proches (aucun changement de notes) ; les homonymes sont très différentes à l’oreille (trois notes changent).'),
          h('Pourquoi passer au mineur homonyme ?'),
          p('Les compositeurs jouent beaucoup de ce contraste. Un thème en **majeur** repris en **mineur homonyme** (même mélodie, tierce abaissée) change complètement de climat : de la lumière à l’ombre. C’est un procédé classique chez Mozart, Schubert, et dans le jazz et le rock (accord de sous-dominante mineure).'),
          sc('c4:q e4:q g4:q e4:q | c4:q eb4:q g4:q eb4:q |]', 'Même arpège de do : en majeur (do–mi–sol) puis en mineur (do–mi♭–sol) : seule la tierce a changé.', { mes: '4/4' }),
          qcm('Relative ou homonyme ?', [
            ['Do majeur et la mineur sont…', ['relatives', 'homonymes', 'voisines', 'enharmoniques'], 0, 'Même armure.'],
            ['Sol majeur et sol mineur sont…', ['relatives', 'homonymes', 'voisines', 'enharmoniques'], 1, 'Même tonique.'],
            ['Combien d’altérations d’écart entre deux homonymes ?', ['1', '2', '3', '4'], 2, 'III, VI, VII sont abaissés : trois altérations de plus en bémols.'],
            ['Armure du mineur homonyme de ré majeur ?', ['1 ♭', '2 ♯', '1 ♯', '3 ♭'], 0, 'Ré mineur : un bémol.'],
            ['Armure du mineur homonyme de fa majeur ?', ['4 ♭', '1 ♭', '3 ♭', '2 ♭'], 0, 'Fa mineur : 4 bémols.'],
          ]),
          exo('gamme-reco', { types: ['maj', 'min'], max: 4 }, 8, 'Majeur ou mineur homonyme ?'),
        ],
        { videos: [video('Relatives et homonymes', 'tonalités relatives homonymes différence solfège'), video('Passer du majeur au mineur', 'passer du majeur au mineur homonyme tierce abaissée effet')],
          mix: [{ gen: 'gamme-reco', params: { types: ['maj', 'min'], max: 4 } }],
          cartes: cartes('Gammes mineures', [['Tonalités homonymes ?', 'Même tonique, mode différent (do majeur / do mineur).'], ['Tonalités relatives ?', 'Même armure, toniques différentes (do majeur / la mineur).'], ['Écart d’armure entre homonymes ?', 'Trois altérations (tierce, sixte, septième).'], ['Armure de do mineur ?', '3 bémols : si♭, mi♭, la♭.']]) }),

      L('v3-19-jouer-mineur', 'Jouer les gammes mineures naturelles', 40,
        ['Jouer neuf gammes mineures naturelles avec les bons doigtés.', 'Connaître le doigté commun aux gammes mineures et à leurs relatives majeures.', 'Installer une routine d’entraînement.'],
        [
          p('Les doigtés des gammes mineures naturelles sont **les mêmes que ceux de leurs relatives majeures**, en décalant le point de départ. Voici les neuf plus utiles. Joue chaque gamme **mains séparées**, lentement, en écoutant la tierce mineure.'),
          rem('Routine conseillée', '**5 minutes par jour** : une gamme, **mains séparées** à 60 à la noire, puis **mains ensemble** à l’octave si tu es à l’aise. Change de gamme chaque jour. Joue sans regarder ton clavier dès que le doigté est sûr.'),
          ...blocsMin('a', 'Aucune touche noire : c’est la plus simple. Le pouce passe sous la main après le troisième doigt.'),
          ...blocsMin('e', 'Un seul dièse (fa♯) : le doigté est identique à la mineur.'),
          ...blocsMin('d', 'Un seul bémol (si♭) : la main gauche garde le doigté 5 4 3 2 1 3 2 1.'),
          ...blocsMin('g', 'Deux bémols (si♭ et mi♭).'),
          ...blocsMin('c', 'Trois bémols : si♭, mi♭, la♭ — la main droite commence au pouce.'),
          ...blocsMin('b', 'Deux dièses : la main gauche utilise 4 3 2 1 4 3 2 1.'),
          ...blocsMin('f', 'Quatre bémols : le doigté de la main droite démarre sur le pouce et monte sur 4 doigts avant de recommencer.'),
          ...blocsMin('f#', 'Trois dièses : le pouce passe sur le la, après le second doigt (2 – 3 – 4 – 1…).'),
          ...blocsMin('c#', 'Quatre dièses : la main droite démarre sur le troisième doigt.'),
          qcm('Doigtés', [
            ['Pour la mineur, le doigté de la main droite est…', ['1 2 3 1 2 3 4 5', '2 3 1 2 3 4 1 2', '1 2 3 4 1 2 3 4', '3 4 1 2 3 1 2 3'], 0, 'Comme do majeur.'],
            ['Quelle gamme n’utilise aucune touche noire ?', ['la mineur', 'mi mineur', 'ré mineur', 'sol mineur'], 0, 'La mineur naturel.'],
            ['Pour fa mineur, la main droite joue…', ['1 2 3 4 1 2 3 4', '1 2 3 1 2 3 4 5', '3 4 1 2 3 1 2 3', '2 3 4 1 2 3 1 2'], 0, 'Comme fa majeur.'],
          ]),
        ],
        { videos: [video('Gammes mineures au piano : doigtés', 'gammes mineures piano doigtés la mineur mi mineur ré mineur'), video('Routine de gammes pour débutants', 'routine gammes piano débutant mineur exercices quotidiens')],
          mix: [{ gen: 'gamme-reco', params: { types: ['min'], max: 5 } }],
          cartes: cartes('Gammes mineures', [['Doigté main droite de la mineur ?', '1 2 3 1 2 3 4 5.'], ['Doigté main gauche de la mineur ?', '5 4 3 2 1 3 2 1.'], ['Doigté main droite de fa mineur ?', '1 2 3 4 1 2 3 4.'], ['Doigté main gauche de si mineur ?', '4 3 2 1 4 3 2 1.']]).concat(cartesMin('a'), cartesMin('g'), cartesMin('c'), cartesMin('b')) }),

      L('v3-20-atelier-mineur', 'Atelier : reconnaître et écrire les gammes mineures', 35,
        ['Consolider les gammes mineures naturelles par des séries variées.', 'Enchaîner reconnaissance, écriture et oreille.', 'Repérer ses points faibles.'],
        [
          p('Atelier de consolidation : plusieurs séries courtes, à enchaîner. Reviens sur la leçon correspondante quand une erreur se répète.'),
          h('Série 1 · Degrés'),
          exo('gamme-degre', { types: ['min'], max: 7 }, 10, 'Du degré à la note (mineur naturel)'),
          h('Série 2 · Reconnaître la gamme'),
          exo('gamme-reco', { types: ['maj', 'min'], max: 6 }, 10, 'Majeur ou mineur ?'),
          h('Série 3 · Armures et relatives'),
          exo('armure-combien', { mode: 'min', max: 7 }, 8, 'Armure de la tonalité mineure'),
          exo('relative', { mode: 'les-deux', max: 7 }, 8, 'Relatives'),
          h('Série 4 · Oreille'),
          exo('gamme-ecoute', { types: ['maj', 'min'] }, 8, 'Majeur ou mineur ?'),
          qcm('Quiz final', [
            ['Quelle est la formule du mineur naturel ?', ['T ½ T T ½ T T', 'T T ½ T T T ½', 'T ½ T T ½ 1½ ½', '½ T T T ½ T T'], 0, 'Voir leçon 15.'],
            ['Armure de mi♭ mineur ?', ['6 ♭', '5 ♭', '3 ♭', '6 ♯'], 0, 'Relative majeure : sol♭ majeur (6 bémols).'],
            ['Relative mineure de si♭ majeur ?', ['sol mineur', 'mi mineur', 'ré mineur', 'fa mineur'], 0, 'Si♭ − 3 demi-tons = sol.'],
            ['Combien d’altérations d’écart entre do majeur et do mineur ?', ['2', '3', '4', '1'], 1, 'Trois bémols.'],
            ['Quelle est la tierce de sol mineur ?', ['si♭', 'si', 'la', 'ré'], 0, 'Tierce mineure : si♭.'],
          ]),
        ],
        { videos: [video('Exercices sur les gammes mineures', 'exercices gammes mineures solfège formation musicale'), video('Quiz tonalités majeures et mineures', 'quiz tonalités majeures et mineures armure relative')],
          mix: [{ gen: 'gamme-degre', params: { types: ['min'], max: 7 } }, { gen: 'armure-notes', params: { mode: 'min', max: 6 } }],
          cartes: cartes('Gammes mineures', [['Armure de mi♭ mineur ?', '6 bémols (comme sol♭ majeur).'], ['Relative mineure de si♭ majeur ?', 'Sol mineur.'], ['Tierce de sol mineur ?', 'Si♭.'], ['Armure de la♭ mineur ?', '7 bémols.']]) }),
    ],
  });
})();
