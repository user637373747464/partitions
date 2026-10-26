/* Volume 2 · Chapitre 6 — Les gammes majeures à dièses et à bémols. */
(function () {
  const { p, h, def, rem, ex, liste, num, tab, sc, piano, ry, qcm, exo, clav, cartes, video, L } = Contenu.o;
  const T = Theorie, nm = (n) => T.nomFr(n), Mj = (n) => T.Maj(n);
  // doigtés usuels (main droite, main gauche) pour une octave
  const DOIGTES = {
    g: ['1 2 3 1 2 3 4 5', '5 4 3 2 1 3 2 1'], d: ['1 2 3 1 2 3 4 5', '5 4 3 2 1 3 2 1'], a: ['1 2 3 1 2 3 4 5', '5 4 3 2 1 3 2 1'], e: ['1 2 3 1 2 3 4 5', '5 4 3 2 1 3 2 1'],
    b: ['1 2 3 1 2 3 4 5', '4 3 2 1 4 3 2 1'], 'f#': ['2 3 4 1 2 3 1 2', '4 3 2 1 3 2 1 4'], 'c#': ['2 3 1 2 3 4 1 2', '3 2 1 4 3 2 1 3'],
    f: ['1 2 3 4 1 2 3 4', '5 4 3 2 1 3 2 1'], bb: ['4 1 2 3 1 2 3 4', '3 2 1 4 3 2 1 3'], eb: ['3 1 2 3 4 1 2 3', '3 2 1 4 3 2 1 3'], ab: ['3 4 1 2 3 1 2 3', '3 2 1 4 3 2 1 3'],
    db: ['2 3 1 2 3 4 1 2', '3 2 1 4 3 2 1 3'], gb: ['2 3 4 1 2 3 1 2', '4 3 2 1 3 2 1 4'], c: ['1 2 3 1 2 3 4 5', '5 4 3 2 1 3 2 1'],
  };
  const NOT = { g: 'sol', d: 'ré', a: 'la', e: 'mi', b: 'si', 'f#': 'fa dièse', 'c#': 'do dièse', f: 'fa', bb: 'si bémol', eb: 'mi bémol', ab: 'la bémol', db: 'ré bémol', gb: 'sol bémol', cb: 'do bémol' };
  const OCT_BAS = { c: 3, d: 3, e: 3, f: 3, g: 2, a: 2, b: 2 };
  const noms7 = (ton, type) => T.gamme(ton, type).slice(0, 7).map(nm).join(' – ');
  const cap = (x) => x.replace(/^./, (c) => c.toUpperCase());
  function bar(s, n) { const out = []; let k = 0; s.split(' ').forEach((t) => { if (t[0] !== '@' && t[0] !== '^') { if (k > 0 && k % n === 0) out.push('|'); k++; } out.push(t); }); return out.join(' ') + ' |]'; }
  const etiqs = (txt) => txt.split(' ');
  // tout ce qu'il faut pour une gamme : titre, tableau, partitions main droite / main gauche
  function blocsGamme(t, commentaire) {
    const arm = T.nbAlterations(t + '4', 'maj'), rh = DOIGTES[t], g = T.gamme(t + '4', 'maj');
    const letter = t[0], alt = arm > 0 ? arm + (arm > 1 ? ' dièses' : ' dièse') : -arm + (arm < -1 ? ' bémols' : ' bémol');
    const nom = cap(NOT[t]) + ' majeur';
    const out = [h(nom + ' · ' + alt + ' (' + T.alterationsArmure(arm).join(' ') + ')')];
    out.push(tab(['Degré', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'], [['Note'].concat(g.map(nm)), ['Vers la suivante'].concat(T.FORMULES.maj.map((x) => (x === 1 ? '½' : '1')), [''])]));
    if (commentaire) out.push(p(commentaire));
    out.push(sc(bar(T.gammeScore(t + '4', 'maj', { d: 'q', arm, etiq: etiqs(rh[0]) }), 4), nom + ', main droite (doigtés sous les notes). L’armure donne les altérations.', { mes: '4/4', arm }));
    out.push(sc(bar(T.gammeScore(t + OCT_BAS[letter], 'maj', { d: 'q', arm, etiq: etiqs(rh[1]) }), 4), nom + ', main gauche.', { clef: 'fa', mes: '4/4', arm }));
    return out;
  }
  // cartes pour une gamme
  function cartesGamme(t) {
    const arm = T.nbAlterations(t + '4', 'maj'), g = T.gamme(t + '4', 'maj'), nom = cap(NOT[t]) + ' majeur';
    return [
      { cat: 'Gammes', q: 'Quelles sont les notes de ' + nom + ' ?', r: g.map(nm).join(' – ') + '.', p: { clef: 'sol', arm, mes: '4/4', s: bar(T.gammeScore(t + '4', 'maj', { d: 'q', arm }), 4) } },
      { cat: 'Armures', q: 'Combien d’altérations à l’armure de ' + nom + ' ?', r: (arm > 0 ? arm + ' dièse' : -arm + ' bémol') + (Math.abs(arm) > 1 ? 's' : '') + ' : ' + T.alterationsArmure(arm).join(', ') + '.' },
    ];
  }
  const cartesPlusieurs = (...ts) => ts.flatMap(cartesGamme);

  Contenu.chapitre('v2', {
    id: 'v2c6', titre: 'Chapitre 6 · Les gammes majeures à dièses et à bémols',
    lecons: [
      L('v2-29-sol-re', 'Sol majeur et ré majeur', 40,
        ['Écrire et jouer les gammes de sol majeur (1 dièse) et de ré majeur (2 dièses).', 'Comprendre pourquoi chaque gamme ajoute un dièse : la sensible.', 'Appliquer la méthode « tétracorde + un nouveau dièse ».'],
        [
          p('Tu connais **do majeur** (aucune altération). En partant de **sol** (la dominante de do), puis de **ré** (la dominante de sol), on obtient les deux premières gammes à dièses. Chaque nouvelle gamme **garde les dièses précédents** et en **ajoute un**.'),
          rem('Règle', 'En montant **d’une quinte** (do → sol → ré → la → mi → si → fa♯ → do♯), la gamme majeure **ajoute un dièse**. Le **nouveau dièse** est toujours **le 7ᵉ degré** de la nouvelle gamme, c’est-à-dire sa **sensible** (demi-ton sous la tonique).'),
          ...blocsGamme('g', 'Le 7ᵉ degré est **fa♯** : c’est la sensible de sol (un demi-ton sous le sol final).'),
          ...blocsGamme('d', 'Gamme de sol avec **un dièse de plus** : fa♯ **et do♯** (la sensible de ré est do♯).'),
          tab(['Tonalité', 'Dièses', 'Nouveau dièse'], [['do majeur', '0', '—'], ['sol majeur', '1 : fa♯', 'fa♯'], ['ré majeur', '2 : fa♯ do♯', 'do♯']]),
          piano(T.sc(['d4', 'e4', 'f#4', 'g4'].map(T.parse), 'q', 2), T.sc(['d3', 'e3', 'f#3', 'g3'].map(T.parse), 'q', 2), 'Dans la gamme de ré, les fa et do portent un dièse à toutes les octaves : c’est ce que dit l’armure.', { mes: '4/4', arm: 2 }),
          qcm('Vérifie', [
            ['Combien de dièses dans la gamme de ré majeur ?', ['1', '2', '3', '4'], 1, 'Fa♯ et do♯.'],
            ['Quelle est la sensible de sol majeur ?', ['mi', 'fa♯', 'fa', 'si'], 1, 'Fa♯ : un demi-ton sous sol.'],
            ['Quel est le nouveau dièse de ré majeur par rapport à sol majeur ?', ['fa♯', 'do♯', 'sol♯', 'ré♯'], 1, 'Do♯ (sensible de ré).'],
            ['La gamme de ré majeur contient…', ['fa et do naturels', 'fa♯ et do naturel', 'fa♯ et do♯', 'si♭'], 2, 'Fa♯ et do♯.'],
          ]),
          exo('gamme-degre', { types: ['maj'], max: 2 }, 8, 'Notes des gammes (jusqu’à 2 dièses)'),
          exo('gamme-reco', { types: ['maj'], max: 2 }, 6, 'Reconnaître la gamme'),
        ],
        { videos: [video('Gamme de sol majeur au piano', 'gamme de sol majeur piano doigté'), video('Gamme de ré majeur au piano', 'gamme de ré majeur piano doigté')],
          mix: [{ gen: 'gamme-degre', params: { types: ['maj'], max: 2 } }, { gen: 'armure-notes', params: { mode: 'maj', max: 2 } }],
          cartes: cartesPlusieurs('g', 'd') }),

      L('v2-30-la-mi-si', 'La majeur, mi majeur et si majeur', 40,
        ['Écrire et jouer les gammes de la (3 dièses), mi (4 dièses) et si (5 dièses).', 'Connaître le doigté particulier de si majeur à la main gauche.', 'Retrouver la liste des dièses dans l’ordre : fa do sol ré la mi si.'],
        [
          p('Les trois gammes suivantes ajoutent chacune **un dièse** : **sol♯** pour la, **ré♯** pour mi, **la♯** pour si. Remarque que **les dièses se placent toujours dans le même ordre** — tu l’as déjà vu : **fa – do – sol – ré – la – mi – si**.'),
          ...blocsGamme('a', 'Trois dièses : **fa♯ do♯ sol♯**. Le **sol♯** est la sensible.'),
          ...blocsGamme('e', 'Quatre dièses. Le **ré♯** est la sensible de mi.'),
          ...blocsGamme('b', 'Cinq dièses. Le doigté de la main gauche change : **4 3 2 1 4 3 2 1** (aucun pouce sur une noire à la 1re note).'),
          tab(['Tonalité', 'Dièses', 'Armure'], [['la majeur', '3', 'fa♯ do♯ sol♯'], ['mi majeur', '4', 'fa♯ do♯ sol♯ ré♯'], ['si majeur', '5', 'fa♯ do♯ sol♯ ré♯ la♯']]),
          rem('Astuce de lecture', 'Pour trouver la tonalité majeure d’une armure à dièses : **prends le dernier dièse et monte d’un demi-ton**. Dernier dièse = **sol♯** ? Monte d’un demi-ton → **la**. Dernier = **ré♯** → **mi**. Dernier = **la♯** → **si**.'),
          qcm('Vérifie', [
            ['Combien de dièses à si majeur ?', ['3', '4', '5', '6'], 2, 'Fa♯ do♯ sol♯ ré♯ la♯.'],
            ['Quelle est la sensible de la majeur ?', ['fa♯', 'sol♯', 'sol', 'si'], 1, 'Sol♯.'],
            ['Le dernier dièse de l’armure est ré♯. La tonalité est…', ['mi majeur', 'la majeur', 'ré majeur', 'si majeur'], 0, 'Un demi-ton au-dessus de ré♯ : mi.'],
            ['L’ordre des dièses commence par…', ['si', 'do', 'fa', 'sol'], 2, 'Fa, do, sol, ré, la, mi, si.'],
          ]),
          exo('gamme-degre', { types: ['maj'], max: 5 }, 8, 'Notes des gammes (jusqu’à 5 dièses)'),
          exo('armure', { max: 5 }, 6, 'Armures'),
        ],
        { videos: [video('Gammes de la, mi et si majeur', 'gammes la majeur mi majeur si majeur piano doigtés')],
          mix: [{ gen: 'gamme-degre', params: { types: ['maj'], max: 5 } }, { gen: 'armure', params: { max: 5 } }],
          cartes: cartesPlusieurs('a', 'e', 'b') }),

      L('v2-31-fa-do-diese', 'Fa♯ majeur et do♯ majeur', 30,
        ['Écrire et jouer fa♯ majeur (6 dièses) et do♯ majeur (7 dièses).', 'Rencontrer mi♯ et si♯ dans une armure.', 'Comprendre que ces gammes existent aussi en bémols (sol♭, ré♭).'],
        [
          p('Les deux dernières gammes à dièses sont les plus riches en altérations : **six dièses** pour fa♯ majeur, **sept** pour do♯ majeur. On y trouve des notes inhabituelles à l’écriture : **mi♯** et **si♯**, qui sonnent comme **fa** et **do** mais s’écrivent autrement.'),
          ...blocsGamme('f#', 'Six dièses. Le 7ᵉ degré est **mi♯** : un demi-ton sous fa♯, et qui sonne comme fa naturel ! (On écrit **mi♯** parce que la gamme doit contenir **toutes les lettres**.)'),
          ...blocsGamme('c#', 'Sept dièses : toutes les notes sont altérées. Le 7ᵉ degré est **si♯** (qui sonne do).'),
          rem('Au piano, c’est facile !', 'Ces gammes se jouent **toutes les touches noires** (sauf deux) avec le doigté **2 3 4** sur les noires et **1** sur les blanches. Ce sont même **les plus ergonomiques** du clavier : la main épouse naturellement le motif noire–blanche.'),
          h('Leurs jumelles en bémols'),
          p('Fa♯ majeur (6 dièses) sonne **comme sol♭ majeur** (6 bémols). Do♯ majeur (7 dièses) sonne **comme ré♭ majeur** (5 bémols). On dit que ces tonalités sont **enharmoniques**. On choisit en général l’écriture **qui a le moins d’altérations** : ré♭ plutôt que do♯, sol♭ ou fa♯ selon le contexte.'),
          tab(['Tonalité', 'Altérations', 'Équivalent enharmonique'], [['fa♯ majeur', '6 dièses', 'sol♭ majeur (6 bémols)'], ['do♯ majeur', '7 dièses', 'ré♭ majeur (5 bémols)']]),
          qcm('Vérifie', [
            ['Combien de dièses à fa♯ majeur ?', ['4', '5', '6', '7'], 2, 'Six.'],
            ['Quelle est la sensible de fa♯ majeur ?', ['mi', 'mi♯', 'fa', 'sol♯'], 1, 'Mi♯.'],
            ['Do♯ majeur a combien d’altérations ?', ['5', '6', '7', '8'], 2, 'Sept dièses.'],
            ['Fa♯ majeur est enharmonique de…', ['sol♭ majeur', 'sol majeur', 'fa majeur', 'ré♭ majeur'], 0, 'Sol♭ majeur.'],
          ]),
          exo('gamme-degre', { types: ['maj'], max: 7 }, 8, 'Notes des gammes (toutes)'),
        ],
        { videos: [video('Gamme de fa dièse majeur', 'gamme fa dièse majeur piano doigté'), video('Pourquoi mi dièse existe', 'mi dièse si dièse existe pourquoi solfège')],
          cartes: cartesPlusieurs('f#', 'c#') }),

      L('v2-32-fa-sib-mib', 'Fa majeur, si♭ majeur et mi♭ majeur', 40,
        ['Écrire et jouer les gammes de fa (1 bémol), si♭ (2 bémols) et mi♭ (3 bémols).', 'Reconnaître que chaque gamme ajoute un bémol : le 4ᵉ degré.', 'Retenir l’ordre des bémols : si – mi – la – ré – sol – do – fa.'],
        [
          p('Pour les gammes à bémols, on descend **d’une quinte** à chaque étape (do → **fa** → **si♭** → **mi♭** → la♭ → ré♭ → sol♭ → do♭). À chaque quinte descendue, **on ajoute un bémol**. Le **nouveau bémol** est toujours **le 4ᵉ degré** de la nouvelle gamme (la sous-dominante).'),
          rem('L’ordre des bémols', 'Les bémols s’ajoutent dans **l’ordre inverse des dièses** : **si – mi – la – ré – sol – do – fa**. Retiens le mot (ou la phrase) qui t’aide : « **Si Mi La Ré Sol Do Fa** » est aussi **le cercle des quintes à l’envers**.'),
          ...blocsGamme('f', 'Un seul bémol, **si♭** : le 4ᵉ degré de fa est si, qu’on abaisse pour que III–IV soit un demi-ton (la–si♭).'),
          ...blocsGamme('bb', 'Deux bémols : **si♭ et mi♭**. Le nouveau est mi♭ (4ᵉ degré). Doigté inhabituel : la main droite commence par le **4**.'),
          ...blocsGamme('eb', 'Trois bémols : **si♭ mi♭ la♭**. Le nouveau est la♭ (4ᵉ degré).'),
          tab(['Tonalité', 'Bémols', 'Armure'], [['fa majeur', '1', 'si♭'], ['si♭ majeur', '2', 'si♭ mi♭'], ['mi♭ majeur', '3', 'si♭ mi♭ la♭']]),
          rem('Astuce de lecture', 'Pour trouver la tonalité majeure d’une armure à bémols : **l’avant-dernier bémol** est la tonique. Armure si♭ mi♭ la♭ : l’avant-dernier est **mi♭** → **mi♭ majeur**. Exception : un seul bémol (si♭) donne **fa majeur** (à retenir).'),
          qcm('Vérifie', [
            ['Combien de bémols à si♭ majeur ?', ['1', '2', '3', '4'], 1, 'Si♭ et mi♭.'],
            ['L’armure si♭ mi♭ la♭ correspond à…', ['mi♭ majeur', 'si♭ majeur', 'la♭ majeur', 'fa majeur'], 0, 'L’avant-dernier bémol : mi♭.'],
            ['Quel est le nouveau bémol de mi♭ majeur par rapport à si♭ majeur ?', ['si♭', 'la♭', 'ré♭', 'mi♭'], 1, 'La♭.'],
            ['L’ordre des bémols commence par…', ['fa', 'si', 'mi', 'la'], 1, 'Si, mi, la, ré, sol, do, fa.'],
          ]),
          exo('gamme-degre', { types: ['maj'], max: 3 }, 8, 'Notes des gammes (jusqu’à 3 altérations)'),
          exo('armure', { max: 3 }, 6, 'Armures'),
        ],
        { videos: [video('Gammes de fa, si bémol et mi bémol', 'gamme fa majeur si bémol majeur mi bémol majeur piano doigtés')],
          mix: [{ gen: 'gamme-degre', params: { types: ['maj'], max: 3 } }, { gen: 'armure-notes', params: { mode: 'maj', max: 3 } }],
          cartes: cartesPlusieurs('f', 'bb', 'eb') }),

      L('v2-33-quatre-bemols', 'La♭, ré♭, sol♭ et do♭ majeur', 40,
        ['Écrire et jouer les gammes de la♭ (4 bémols), ré♭ (5), sol♭ (6) et do♭ (7).', 'Connaître le doigté usuel de ces gammes « noires ».', 'Rencontrer fa♭ dans l’armure de do♭ majeur.'],
        [
          p('Quatre gammes de plus : **la♭, ré♭, sol♭ et do♭**. Ce sont des gammes **très agréables à jouer** au piano parce que **les doigts longs (2, 3, 4) tombent sur les touches noires** et le pouce sur les blanches.'),
          ...blocsGamme('ab', 'Quatre bémols : **si♭ mi♭ la♭ ré♭**. Le nouveau est ré♭ (4ᵉ degré).'),
          ...blocsGamme('db', 'Cinq bémols. Cette gamme est **l’équivalent bémol de do♯ majeur** : même sons, deux fois moins d’altérations en bémols.'),
          ...blocsGamme('gb', 'Six bémols. Le 4ᵉ degré est **do♭**, qui sonne comme si naturel. Sol♭ majeur est l’équivalent enharmonique de **fa♯ majeur**.'),
          p('**Do♭ majeur** (sept bémols : si♭ mi♭ la♭ ré♭ sol♭ do♭ **fa♭**) est **théorique** : on l’écrit presque toujours en **si majeur** (5 dièses), plus lisible. Il existe pourtant dans des partitions de romantiques. Sa gamme : ' + noms7('cb4', 'maj') + '.'),
          tab(['Tonalité', 'Bémols', 'Armure', 'Enharmonique'], [['la♭ majeur', '4', 'si♭ mi♭ la♭ ré♭', 'sol♯ majeur (théorique)'], ['ré♭ majeur', '5', 'si♭ mi♭ la♭ ré♭ sol♭', 'do♯ majeur (7 dièses)'], ['sol♭ majeur', '6', 'si♭ mi♭ la♭ ré♭ sol♭ do♭', 'fa♯ majeur (6 dièses)'], ['do♭ majeur', '7', 'les 7 bémols', 'si majeur (5 dièses)']]),
          qcm('Vérifie', [
            ['Combien de bémols à ré♭ majeur ?', ['3', '4', '5', '6'], 2, 'Cinq.'],
            ['Quel est le dernier bémol de l’armure de sol♭ majeur ?', ['ré♭', 'sol♭', 'do♭', 'fa♭'], 2, 'Do♭.'],
            ['Fa♯ majeur est enharmonique de…', ['sol♭ majeur', 'la♭ majeur', 'ré♭ majeur', 'mi♭ majeur'], 0, 'Sol♭ majeur.'],
            ['Quelle gamme a sept bémols ?', ['fa♯ majeur', 'do♭ majeur', 'sol♭ majeur', 'do♯ majeur'], 1, 'Do♭ majeur.'],
          ]),
          exo('gamme-degre', { types: ['maj'], max: 7 }, 8, 'Notes des gammes (toutes)'),
          exo('gamme-reco', { types: ['maj'], max: 7 }, 6, 'Reconnaître la gamme'),
        ],
        { videos: [video('Gammes de la bémol et ré bémol', 'gamme la bémol majeur ré bémol majeur piano doigtés'), video('Les gammes de sol bémol et do bémol', 'gamme sol bémol majeur do bémol majeur piano')],
          mix: [{ gen: 'gamme-degre', params: { types: ['maj'], max: 7 } }],
          cartes: cartesPlusieurs('ab', 'db', 'gb').concat([{ cat: 'Gammes', q: 'Quelles sont les notes de do♭ majeur ?', r: noms7('cb4', 'maj') + '.' }]) }),

      L('v2-34-enharmonie-ton', 'Enharmonie des tonalités', 25,
        ['Reconnaître les tonalités enharmoniques : si/do♭, fa♯/sol♭, do♯/ré♭.', 'Choisir l’écriture la plus simple selon l’armure.', 'Savoir dans quels cas on préfère dièses ou bémols.'],
        [
          p('Au piano, **la gamme de fa♯ majeur et la gamme de sol♭ majeur se jouent avec les mêmes touches**. Elles ne diffèrent que par **l’écriture**. On dit que ces tonalités sont **enharmoniques**.'),
          tab(['Écriture en dièses', 'Écriture en bémols', 'Même touche pour la tonique'], [['si majeur (5 ♯)', 'do♭ majeur (7 ♭)', 'si / do♭'], ['fa♯ majeur (6 ♯)', 'sol♭ majeur (6 ♭)', 'fa♯ / sol♭'], ['do♯ majeur (7 ♯)', 'ré♭ majeur (5 ♭)', 'do♯ / ré♭']]),
          sc(bar(T.gammeScore('f#4', 'maj', { d: 'q', arm: 6 }), 4), 'Fa♯ majeur (6 dièses).', { mes: '4/4', arm: 6 }),
          sc(bar(T.gammeScore('gb4', 'maj', { d: 'q', arm: -6 }), 4), 'Sol♭ majeur (6 bémols) : exactement les mêmes sons.', { mes: '4/4', arm: -6 }),
          rem('Comment choisir ?', 'On préfère **l’armure la plus courte** : si majeur (5 ♯) plutôt que do♭ majeur (7 ♭) ; ré♭ majeur (5 ♭) plutôt que do♯ majeur (7 ♯). Pour **fa♯ / sol♭** (6 des deux côtés), le compositeur choisit selon la tonalité d’où il vient : si on arrive de si majeur, on écrira fa♯ ; si on arrive de ré♭, on écrira sol♭.'),
          h('Pourquoi ne peut-on pas écrire n’importe quoi ?'),
          p('Parce que l’**ordre des degrés** et la **formule** dépendent des noms : la gamme de **sol♭** a un **do♭** ; si on écrivait **si** à la place, on aurait deux « si » dans la gamme et pas de « do », ce qui détruit le système (chaque lettre une seule fois).'),
          tab(['Gamme', 'Sol♭ majeur (correct)', 'Fa♯ majeur (équivalent)'], [['Notes', noms7('gb4', 'maj'), noms7('f#4', 'maj')]]),
          qcm('Vérifie', [
            ['Do♭ majeur est enharmonique de…', ['si majeur', 'do majeur', 'la majeur', 'si♭ majeur'], 0, 'Si majeur.'],
            ['On préfère écrire…', ['do♯ majeur plutôt que ré♭ majeur', 'ré♭ majeur plutôt que do♯ majeur', 'indifféremment', 'jamais en bémols'], 1, 'Cinq bémols valent mieux que sept dièses.'],
            ['Deux tonalités enharmoniques se jouent…', ['avec les mêmes touches', 'avec des touches différentes', 'une octave plus haut', 'à des tempos différents'], 0, 'Elles sonnent pareil au piano.'],
          ]),
          exo('armure', { max: 7 }, 8, 'Armures'),
        ],
        { videos: [video('Tonalités enharmoniques', 'tonalités enharmoniques fa dièse sol bémol si do bémol expliqué')],
          mix: [{ gen: 'armure', params: { max: 7 } }],
          cartes: cartes('Gammes', [['Fa♯ majeur est enharmonique de quelle tonalité ?', 'Sol♭ majeur.'], ['Do♭ majeur est enharmonique de quelle tonalité ?', 'Si majeur.'], ['Do♯ majeur est enharmonique de quelle tonalité ?', 'Ré♭ majeur.'], ['Entre deux tonalités enharmoniques, laquelle préfère-t-on écrire ?', 'Celle qui a le moins d’altérations.']]) }),

      L('v2-35-atelier-gammes', 'Atelier : n’importe quelle gamme majeure', 35,
        ['Construire une gamme majeure sur n’importe quelle note sans aide.', 'Vérifier sa gamme avec trois contrôles : formule, une lettre par note, nombre d’altérations.', 'Enchaîner les exercices de gammes à la vitesse de la lecture.'],
        [
          p('Cet atelier regroupe tout ce que tu as appris des gammes majeures. Il te donne **une méthode en cinq étapes** pour construire **n’importe quelle gamme majeure**, même une que tu n’as pas apprise par cœur.'),
          num('**Écris les sept lettres** à partir de la tonique, dans l’ordre (sol la si do ré mi fa).', '**Applique la formule** T – T – ½ – T – T – T – ½ pour savoir quelle altération chaque lettre doit recevoir.', '**Vérifie** que chaque lettre n’apparaît qu’**une seule fois**.', '**Compte** les altérations : le résultat doit donner l’armure attendue (n dièses ou n bémols).', '**Joue-la**, lentement, avec le doigté usuel.'),
          h('Exemple : la gamme de mi♭ majeur'),
          tab(['Lettre', 'Pas depuis la précédente', 'Altération', 'Note'], [['mi', '—', 'mi♭ (tonique)', 'mi♭'], ['fa', '1 ton (mi♭→fa)', 'rien', 'fa'], ['sol', '1 ton', 'rien', 'sol'], ['la', '½ ton', 'la♭', 'la♭'], ['si', '1 ton', 'si♭', 'si♭'], ['do', '1 ton', 'rien', 'do'], ['ré', '1 ton', 'rien', 'ré'], ['mi', '½ ton', 'mi♭', 'mi♭']]),
          rem('Vérification instantanée', 'Mi♭ majeur → 3 bémols : si♭ mi♭ la♭ ✓. Les trois notes altérées de la gamme sont bien **mi♭, la♭, si♭**.'),
          h('Trois pièges fréquents'),
          liste('**Oublier l’altération de la tonique** : mi♭ commence la gamme (pas mi).', '**Utiliser deux fois la même lettre** : do♯ puis ré♭ dans la même gamme est une faute.', '**Changer d’avis en cours de route** : en mi♭ majeur, tout est bémol, jamais de dièse.'),
          piano(bar(T.sc(T.gamme('eb4', 'maj'), 'q', -3), 4), bar(T.sc(T.gamme('eb3', 'maj'), 'q', -3), 4), 'Mi♭ majeur aux deux mains, à l’octave. L’armure de trois bémols donne si♭, mi♭ et la♭ sans les répéter.', { mes: '4/4', arm: -3 }),
          qcm('Quiz final des gammes', [
            ['La gamme de la♭ majeur contient…', ['4 bémols', '4 dièses', '3 bémols', '5 bémols'], 0, 'Si♭ mi♭ la♭ ré♭.'],
            ['La gamme de mi majeur contient…', ['4 dièses', '4 bémols', '3 dièses', '5 dièses'], 0, 'Fa♯ do♯ sol♯ ré♯.'],
            ['Quelle gamme a la sensible mi♯ ?', ['fa♯ majeur', 'sol♭ majeur', 'si majeur', 'do majeur'], 0, 'Fa♯ : sa sensible est mi♯.'],
            ['La médiante de si♭ majeur est…', ['ré', 'ré♭', 'mi♭', 'fa'], 0, 'Si♭ → III : ré.'],
            ['La dominante de ré♭ majeur est…', ['la♭', 'la', 'mi♭', 'fa'], 0, 'Ré♭ → V : la♭.'],
          ]),
          exo('gamme-degre', { types: ['maj'], max: 7 }, 10, 'Notes de toutes les gammes'),
          exo('gamme-reco', { types: ['maj'], max: 7 }, 8, 'Reconnaître n’importe quelle gamme'),
          exo('gamme-ecoute', { types: ['maj', 'min'] }, 6, 'Oreille : majeur ou mineur ?'),
        ],
        { videos: [video('Construire toutes les gammes majeures', 'construire toutes les gammes majeures méthode piano'), video('Apprendre les 12 gammes majeures', 'apprendre les 12 gammes majeures au piano')],
          mix: [{ gen: 'gamme-degre', params: { types: ['maj'], max: 7 } }, { gen: 'gamme-reco', params: { types: ['maj'], max: 5 } }],
          cartes: cartes('Gammes', [['Quelles sont les étapes pour construire une gamme majeure ?', 'Écrire les 7 lettres, appliquer T T ½ T T T ½, vérifier une lettre par note, compter les altérations, jouer.'], ['Quelle est la sensible de mi♭ majeur ?', 'Ré.'], ['Quelle est la dominante de la♭ majeur ?', 'Mi♭.'], ['Que vérifie-t-on pour valider une gamme ?', 'La formule, une lettre par note, et le nombre d’altérations.']]) }),
    ],
  });
})();
