/* Volume 4 · Chapitre 2 — Les accords dans une tonalité. */
(function () {
  const { p, h, def, rem, ex, liste, num, tab, sc, piano, ry, qcm, exo, clav, son, cartes, video, ivs, acs, G, L } = Contenu.o;
  const T = Theorie, nm = (n) => T.nomFr(n), Mj = (n) => T.Maj(n);
  const { cap, bar } = G;
  // progression en partition piano (main droite en accords, basse à la main gauche), avec barres de mesure
  function prog(t, mode, degs, leg, opt) {
    opt = opt || {};
    const d = opt.d || 'h', bpb = { '4/4': 4, '6/4': 6, '3/4': 3, '2/4': 2 }[opt.mes || '4/4'], per = Math.max(1, Math.round(bpb / ({ w: 4, h: 2, q: 1 }[d])));
    const pr = T.progression(t, mode, degs, { d, sept: !!opt.sept });
    const cut = (s) => { const k = s.split(' '), out = []; k.forEach((x, i) => { if (i && i % per === 0) out.push('|'); out.push(x); }); return out.join(' ') + ' |]'; };
    return piano(cut(pr.haut), cut(pr.bas), leg + ' (' + pr.romains.join(' – ') + ')', { mes: opt.mes || '4/4', arm: pr.arm });
  }
  // tableau des accords de la gamme dans plusieurs tonalités
  function tableTonalites(tons, mode) {
    const cols = tons.map((t) => T.accordsTonalite(t, mode, false));
    return cols[0].map((a, i) => [a.romain].concat(cols.map((c) => c[i].nom)));
  }

  Contenu.chapitre('v4', {
    id: 'v4c2', titre: 'Chapitre 2 · Les accords dans une tonalité',
    lecons: [
      L('v4-07-gamme-majeure', 'Les accords de la gamme majeure', 40,
        ['Construire un accord parfait sur chaque degré de la gamme majeure.', 'Connaître la suite « M m m M M m dim » et les chiffres romains.', 'Trouver les sept accords de n’importe quelle tonalité majeure.'],
        [
          p('Une tonalité est un « pays » : la gamme fournit les **notes**, et les accords du pays sont obtenus en **empilant des tierces à l’intérieur de la gamme**. Sur chaque degré, on construit un accord parfait en prenant **une note sur deux** de la gamme.'),
          sc(acs([['c4', 'M'], ['d4', 'm'], ['e4', 'm'], ['f4', 'M'], ['g4', 'M'], ['a4', 'm'], ['b3', 'dim'], ['c5', 'M']], 'h', 2), 'Les accords de do majeur : do, ré mineur, mi mineur, fa, sol, la mineur, si diminué, do.', { mes: '4/4' }),
          def('chiffrage romain', 'Chaque accord est repéré par le **numéro de son degré** en chiffres **romains** (I, II, III…). Une **majuscule** désigne un accord **majeur** (I, IV, V), une **minuscule** un accord **mineur** (ii, iii, vi), et le **petit cercle** ° un accord **diminué** (vii°).'),
          tab(['Degré', 'Chiffrage', 'Nature', 'Do majeur'], [['I', 'I', 'majeur', 'Do'], ['II', 'ii', 'mineur', 'Ré mineur'], ['III', 'iii', 'mineur', 'Mi mineur'], ['IV', 'IV', 'majeur', 'Fa'], ['V', 'V', 'majeur', 'Sol'], ['VI', 'vi', 'mineur', 'La mineur'], ['VII', 'vii°', 'diminué', 'Si diminué']]),
          rem('La règle à retenir', 'Dans **toute** gamme majeure, la suite des accords est toujours la même : **majeur, mineur, mineur, majeur, majeur, mineur, diminué** (M m m M M m °). C’est un moyen mnémotechnique puissant : tu peux deviner les accords d’une tonalité avec la gamme seule.'),
          h('Les mêmes accords dans d’autres tonalités'),
          tab(['Degré', 'Do majeur', 'Sol majeur', 'Ré majeur', 'Fa majeur'], tableTonalites(['c4', 'g4', 'd4', 'f4'], 'maj')),
          h('Pourquoi ces natures ?'),
          p('Parce que la gamme majeure alterne tons et demi-tons de façon **irrégulière**. Quand on empile tierces dans la gamme, la nature de chaque accord dépend des demi-tons rencontrés. Exemple : sur le II, ré–fa–la contient une tierce mineure (ré–fa) puis une majeure (fa–la) : accord mineur.'),
          qcm('Accords de la gamme majeure', [
            ['L’accord du IV degré de do majeur ?', ['fa majeur', 'fa mineur', 'sol majeur', 'ré mineur'], 0, 'Fa–la–do.'],
            ['L’accord du V degré de sol majeur ?', ['ré majeur', 'ré mineur', 'do majeur', 'la mineur'], 0, 'Ré–fa♯–la.'],
            ['L’accord du vi degré de do majeur ?', ['la mineur', 'la majeur', 'mi mineur', 'fa majeur'], 0, 'La–do–mi.'],
            ['Quel degré porte l’accord diminué ?', ['VII', 'II', 'IV', 'VI'], 0, 'Si–ré–fa en do.'],
            ['La suite des natures d’accord dans toute gamme majeure ?', ['M m m M M m °', 'm M M m m M °', 'M M m m M M °', 'm m M M m m °'], 0, 'Toujours la même.'],
            ['Que signifie « ii » ?', ['accord mineur sur le 2ᵉ degré', 'accord majeur sur le 2ᵉ degré', 'accord diminué sur le 2ᵉ', 'deuxième renversement'], 0, 'Minuscule = mineur.'],
          ]),
          exo('accord-degre', { mode: 'maj', max: 3, sens: ['accord'] }, 10, 'Du degré à l’accord'),
          exo('accord-degre', { mode: 'maj', max: 3, sens: ['degre'] }, 10, 'De l’accord au degré'),
        ],
        { videos: [video('Les accords de la gamme majeure', 'accords de la gamme majeure degrés chiffrage romain piano'), video('Chiffrage romain expliqué', 'chiffrage romain accords I IV V vi explication musique')],
          mix: [{ gen: 'accord-degre', params: { mode: 'maj', max: 3 } }],
          cartes: cartes('Degrés', [['Suite des accords d’une gamme majeure ?', 'M m m M M m dim.'], ['Accord du II degré (do majeur) ?', 'Ré mineur.'], ['Accord du IV degré (do majeur) ?', 'Fa majeur.'], ['Accord du V degré (do majeur) ?', 'Sol majeur.'], ['Accord du VI degré (do majeur) ?', 'La mineur.'], ['Accord du VII degré (do majeur) ?', 'Si diminué.'], ['Majuscule/minuscule en chiffrage romain ?', 'Majuscule : majeur ; minuscule : mineur ; ° : diminué.']]) }),

      L('v4-08-fonctions', 'Les fonctions harmoniques : tonique, sous-dominante, dominante', 40,
        ['Comprendre que les accords ont des fonctions : repos, départ, tension.', 'Associer chaque degré à une fonction.', 'Prévoir l’enchaînement naturel T → SD → D → T.'],
        [
          p('Les sept accords d’une tonalité ne jouent pas le même rôle. Ils se rangent en **trois familles**, selon l’effet qu’ils produisent sur l’oreille : le **repos**, le **mouvement**, la **tension**.'),
          def('fonctions tonales', 'La **tonique** (T, degré I) est l’accord de **repos**, la « maison ». La **dominante** (D, degré V) est l’accord de **tension** qui « veut » revenir à la tonique. La **sous-dominante** (SD, degré IV) est l’accord de **départ** : il s’éloigne de la tonique et prépare la dominante.'),
          tab(['Fonction', 'Degrés principaux', 'Substituts', 'Effet'], [['Tonique (T)', 'I', 'vi (et iii)', 'repos, stabilité'], ['Sous-dominante (SD)', 'IV', 'ii', 'départ, ouverture'], ['Dominante (D)', 'V', 'vii°', 'tension, attente']]),
          rem('Pourquoi V → I est si fort ?', 'L’accord de dominante contient la **sensible** (le 7ᵉ degré) qui « tire » vers la tonique, et sa **fondamentale** est une quinte au-dessus de la tonique. Quand on enchaîne V → I, la sensible monte d’un demi-ton vers la tonique : l’oreille ressent une **conclusion**. C’est le mouvement le plus puissant de la musique tonale.'),
          h('L’enchaînement naturel'),
          p('La plupart des phrases musicales suivent le trajet : **T → SD → D → T**, c’est-à-dire **I → IV → V → I** (ou I → ii → V → I). Ce schéma est la colonne vertébrale de la musique occidentale (classique, jazz, pop, rock).'),
          prog('c4', 'maj', [1, 4, 5, 1], 'Do majeur : tonique, sous-dominante, dominante, tonique', { d: 'h' }),
          prog('g4', 'maj', [1, 2, 5, 1], 'Sol majeur : I – ii – V – I', { d: 'h' }),
          h('Les substituts'),
          p('Un accord peut **remplacer** un autre de la même famille : vi (la mineur en do) peut remplacer I ; ii (ré mineur) peut remplacer IV ; vii° peut remplacer V. Le sens général est conservé, la couleur change.'),
          qcm('Fonctions', [
            ['Quelle est la fonction du I ?', ['tonique', 'dominante', 'sous-dominante', 'médiante'], 0, 'Repos.'],
            ['Quelle est la fonction du V ?', ['dominante', 'tonique', 'sous-dominante', 'sensible'], 0, 'Tension.'],
            ['Quelle est la fonction du IV ?', ['sous-dominante', 'dominante', 'tonique', 'médiante'], 0, 'Départ.'],
            ['Quel enchaînement est le plus naturel ?', ['T – SD – D – T', 'D – T – SD – D', 'SD – T – D – SD', 'T – D – SD – D'], 0, 'I – IV – V – I.'],
            ['Quel accord peut remplacer la sous-dominante IV ?', ['ii', 'iii', 'vi', 'vii°'], 0, 'ii est de la famille SD.'],
            ['Quel accord peut remplacer la tonique I ?', ['vi', 'ii', 'V', 'IV'], 0, 'vi (relative) est de la famille T.'],
          ]),
          exo('cadence', { types: ['parfaite', 'plagale', 'demi'], mode: 'maj', max: 2 }, 6, 'Reconnaître la cadence (aperçu)'),
        ],
        { videos: [video('Les fonctions harmoniques : tonique, dominante, sous-dominante', 'fonctions harmoniques tonique dominante sous-dominante explication piano'), video('Pourquoi V I sonne comme une fin', 'pourquoi dominante tonique résolution sensible explication')],
          mix: [{ gen: 'cadence', params: { types: ['parfaite', 'plagale', 'demi'], mode: 'maj', max: 2 } }],
          cartes: cartes('Degrés', [['Tonique : fonction ?', 'Repos (degré I).'], ['Dominante : fonction ?', 'Tension qui appelle la tonique (degré V).'], ['Sous-dominante : fonction ?', 'Départ, prépare la dominante (degré IV).'], ['Enchaînement naturel ?', 'T – SD – D – T, soit I – IV – V – I.'], ['Substitut de I ?', 'vi.'], ['Substitut de IV ?', 'ii.']]) }),

      L('v4-09-gamme-mineure', 'Les accords de la gamme mineure', 40,
        ['Construire les accords sur les degrés de la gamme mineure naturelle et harmonique.', 'Comprendre pourquoi le V est majeur en mineur.', 'Connaître la suite « m dim M m M M dim » (avec harmonique).'],
        [
          p('Dans une tonalité **mineure**, on construit les accords de la même façon, mais la gamme mineure a **trois formes** : cela donne des accords un peu différents.'),
          h('Avec le mineur naturel'),
          sc(acs([['a3', 'm'], ['b3', 'dim'], ['c4', 'M'], ['d4', 'm'], ['e4', 'm'], ['f4', 'M'], ['g4', 'M'], ['a4', 'm']], 'h', 2), 'Accords de la mineur naturel : Am, B°, C, Dm, Em, F, G, Am.', { mes: '4/4' }),
          h('Avec le mineur harmonique : la sensible'),
          sc(acs([['e4', 'M'], ['g#3', 'dim']], 'h', 2), 'Dominante majeure (mi–sol♯–si) et accord de sensible (sol♯–si–ré), construits avec le sol♯ (VII relevé).', { mes: '4/4' }),
          p('Pour avoir une vraie dominante qui conduise à la tonique, on **relève le VII** (sol♯ en la mineur). Du coup : le **V devient majeur** (mi–sol♯–si au lieu de mi–sol–si), et le **VII devient diminué** (sol♯–si–ré).'),
          tab(['Degré', 'Chiffrage', 'Nature', 'La mineur (naturel)', 'La mineur (harmonique)'], [['I', 'i', 'mineur', 'La mineur', 'La mineur'], ['II', 'ii°', 'diminué', 'Si diminué', 'Si diminué'], ['III', 'III', 'majeur', 'Do majeur', 'Do augmenté (rare)'], ['IV', 'iv', 'mineur', 'Ré mineur', 'Ré mineur'], ['V', 'v / V', 'mineur / majeur', 'Mi mineur', '**Mi majeur**'], ['VI', 'VI', 'majeur', 'Fa majeur', 'Fa majeur'], ['VII', 'VII / vii°', 'majeur / diminué', 'Sol majeur', '**Sol♯ diminué**']]),
          rem('En pratique', 'Dans la musique **classique** on emploie le **V majeur** (et vii° diminué) : c’est la tonalité mineure « harmonique ». Dans la musique **populaire** et modale, on utilise souvent **v mineur** et **VII majeur** (mineur naturel) : par exemple Am – G – F – E ou Am – G – F – G. Les deux sonorités existent !'),
          h('Les mêmes accords dans d’autres tonalités mineures'),
          tab(['Degré', 'La mineur', 'Ré mineur', 'Mi mineur', 'Sol mineur'], tableTonalites(['a4', 'd4', 'e4', 'g4'], 'min')),
          qcm('Accords de la gamme mineure', [
            ['L’accord du i degré de la mineur ?', ['la mineur', 'la majeur', 'do majeur', 'mi mineur'], 0, 'La–do–mi.'],
            ['L’accord du III degré de la mineur ?', ['do majeur', 'do mineur', 'mi mineur', 'fa majeur'], 0, 'Do–mi–sol.'],
            ['L’accord du V degré de la mineur (harmonique) ?', ['mi majeur', 'mi mineur', 'ré mineur', 'sol majeur'], 0, 'Avec sol♯.'],
            ['L’accord du ii degré de la mineur ?', ['si diminué', 'si mineur', 'si majeur', 'ré mineur'], 0, 'Si–ré–fa.'],
            ['Pourquoi le V est-il majeur en mineur harmonique ?', ['à cause de la sensible', 'à cause de la tonique', 'à cause du II', 'à cause du IV'], 0, 'Sol♯ est la sensible de la.'],
          ]),
          exo('accord-degre', { mode: 'min', max: 3, sens: ['accord'] }, 10, 'Du degré à l’accord (mineur)'),
          exo('accord-degre', { mode: 'min', max: 3, sens: ['degre'] }, 10, 'De l’accord au degré (mineur)'),
        ],
        { videos: [video('Les accords de la gamme mineure', 'accords de la gamme mineure harmonique degrés la mineur piano'), video('Pourquoi V majeur en mineur', 'pourquoi accord de dominante majeur en mineur sensible')],
          mix: [{ gen: 'accord-degre', params: { mode: 'min', max: 3 } }],
          cartes: cartes('Degrés', [['Accord du V en mineur harmonique ?', 'Majeur (grâce à la sensible).'], ['Accord du VII en mineur harmonique ?', 'Diminué (sensible).'], ['Accord du ii en mineur ?', 'Diminué.'], ['Accord du III en mineur ?', 'Majeur (relative majeure).'], ['Suite en mineur harmonique ?', 'm dim aug m M M dim.'], ['Accords de la mineur naturel ?', 'Am – B° – C – Dm – Em – F – G.']]) }),

      L('v4-10-reconnaitre-degre', 'Reconnaître le degré d’un accord', 35,
        ['Trouver le degré d’un accord dans une tonalité donnée.', 'Trouver un accord à partir de son chiffrage.', 'Lire les accords d’une grille en chiffres romains.'],
        [
          p('Savoir dans quelle tonalité on est, c’est savoir quel est le **degré** de chaque accord. Deux gestes à acquérir : **traduire un accord en chiffre** et **traduire un chiffre en accord**.'),
          h('Geste 1 : de l’accord au chiffre'),
          num('Écris la **gamme** de la tonalité.', 'Repère le **degré** de la fondamentale de l’accord dans cette gamme.', 'Écris le chiffre en **majuscule** (accord majeur) ou **minuscule** (mineur).'),
          p('Exemple : en **sol majeur** (sol la si do ré mi fa♯), l’accord **Em** (mi–sol–si) a pour fondamentale mi, 6ᵉ degré, et il est mineur : **vi**. L’accord **D** (ré–fa♯–la) est sur le 5ᵉ degré, majeur : **V**.'),
          h('Geste 2 : du chiffre à l’accord'),
          p('Exemple : en **fa majeur** (fa sol la si♭ do ré mi), le **IV** est l’accord majeur sur si♭ : **B♭**. Le **ii** est l’accord mineur sur sol : **Gm**. Le **V** est l’accord majeur sur do : **C**.'),
          tab(['Tonalité', 'I', 'ii', 'iii', 'IV', 'V', 'vi'], [['Do majeur', 'C', 'Dm', 'Em', 'F', 'G', 'Am'], ['Sol majeur', 'G', 'Am', 'Bm', 'C', 'D', 'Em'], ['Ré majeur', 'D', 'Em', 'F♯m', 'G', 'A', 'Bm'], ['La majeur', 'A', 'Bm', 'C♯m', 'D', 'E', 'F♯m'], ['Fa majeur', 'F', 'Gm', 'Am', 'B♭', 'C', 'Dm'], ['Si♭ majeur', 'B♭', 'Cm', 'Dm', 'E♭', 'F', 'Gm']]),
          rem('Pourquoi apprendre en chiffres ?', 'Une grille en **chiffres romains** (I – vi – IV – V) est **valable dans toutes les tonalités** : elle décrit la structure, pas les notes. Les musiciens professionnels pensent en chiffres : cela leur permet de **transposer** instantanément un morceau.'),
          qcm('Chiffrage', [
            ['En sol majeur, l’accord Em est…', ['vi', 'ii', 'iii', 'IV'], 0, 'Mi est le 6ᵉ degré, accord mineur.'],
            ['En sol majeur, l’accord D est…', ['V', 'IV', 'I', 'vi'], 0, 'Ré est le 5ᵉ degré, majeur.'],
            ['En fa majeur, le IV est…', ['B♭', 'Bm', 'B°', 'C'], 0, 'Si♭ majeur.'],
            ['En ré majeur, l’accord Bm est…', ['vi', 'ii', 'iii', 'IV'], 0, 'Si = 6ᵉ degré, mineur.'],
            ['En la mineur harmonique, l’accord E est…', ['V', 'v', 'III', 'iv'], 0, 'Dominante majeure.'],
            ['En do majeur, la suite I – vi – IV – V donne…', ['C – Am – F – G', 'C – Dm – F – G', 'C – Em – F – G', 'C – Am – Dm – G'], 0, 'Progression classique des années 50.'],
          ]),
          exo('accord-degre', { mode: 'les-deux', max: 4 }, 12, 'Série complète majeur et mineur'),
        ],
        { videos: [video('Lire une grille en chiffres romains', 'grille d’accords chiffrage romain lire I vi IV V transposer'), video('Trouver les accords d’une tonalité', 'trouver les accords d’une tonalité majeure piano rapide')],
          mix: [{ gen: 'accord-degre', params: { mode: 'les-deux', max: 4 } }],
          cartes: cartes('Degrés', [['Pourquoi les chiffres romains ?', 'Ils décrivent la structure et sont valables dans toutes les tonalités.'], ['En sol majeur : accord du vi ?', 'Mi mineur (Em).'], ['En fa majeur : accord du IV ?', 'Si♭ majeur (B♭).'], ['En ré majeur : accord du V ?', 'La majeur (A).'], ['I – vi – IV – V en do majeur ?', 'C – Am – F – G.']]) }),

      L('v4-11-i-iv-v', 'Les trois accords essentiels : I, IV, V', 40,
        ['Jouer I, IV, V dans plusieurs tonalités.', 'Accompagner une chanson avec trois accords.', 'Passer d’un accord à l’autre sans à-coup.'],
        [
          p('Avec **trois accords** — I, IV et V — on peut accompagner **des centaines de chansons** : *La Bamba*, *Twist and Shout*, *Wild Thing*, d’innombrables blues et chansons folk. Ce sont les trois « piliers » de la tonalité (tonique, sous-dominante, dominante).'),
          h('En do majeur : C – F – G'),
          prog('c4', 'maj', [1, 4, 5, 1], 'Do majeur', { d: 'h' }),
          h('En sol majeur : G – C – D'),
          prog('g4', 'maj', [1, 4, 5, 1], 'Sol majeur', { d: 'h' }),
          h('En fa majeur : F – B♭ – C'),
          prog('f4', 'maj', [1, 4, 5, 1], 'Fa majeur', { d: 'h' }),
          tab(['Tonalité', 'I', 'IV', 'V'], [['Do majeur', 'C', 'F', 'G'], ['Sol majeur', 'G', 'C', 'D'], ['Ré majeur', 'D', 'G', 'A'], ['La majeur', 'A', 'D', 'E'], ['Mi majeur', 'E', 'A', 'B'], ['Fa majeur', 'F', 'B♭', 'C'], ['Si♭ majeur', 'B♭', 'E♭', 'F']]),
          rem('Plusieurs chansons, une seule structure', 'Beaucoup de chansons enchaînent ces trois accords dans des ordres variés : **I – IV – V – IV** (*Wild Thing*), **I – IV – I – V** (*La Bamba* alterne I–IV–V), ou le **blues** que l’on verra à la fin du volume. Une fois la structure maîtrisée, tu peux jouer ces chansons dans **n’importe quelle tonalité**.'),
          h('Comment enchaîner sans à-coup ?'),
          p('Regarde les **notes communes** : dans C → F, la note **do** reste ; dans F → G, rien ne reste, mais les notes bougent d’un ton. Une main qui garde la forme d’accord et glisse d’un degré à l’autre sonne plus **fluide**. On verra les **positions les plus proches** au chapitre 4.'),
          qcm('I – IV – V', [
            ['Les accords I, IV, V de la majeur ?', ['A – D – E', 'A – C – E', 'A – D – G', 'A – E – B'], 0, 'La, ré, mi.'],
            ['Les accords I, IV, V de ré majeur ?', ['D – G – A', 'D – F – A', 'D – G – B', 'D – E – A'], 0, 'Ré, sol, la.'],
            ['Les accords I, IV, V de fa majeur ?', ['F – B♭ – C', 'F – B – C', 'F – G – C', 'F – A – C'], 0, 'Fa, si♭, do.'],
            ['Quelle chanson repose sur I – IV – V ?', ['La Bamba', 'Pachelbel', 'Clair de lune', 'Für Elise'], 0, 'C – F – G.'],
            ['Le IV est un accord de…', ['sous-dominante', 'dominante', 'tonique', 'sensible'], 0, 'Fonction SD.'],
          ]),
          exo('accord-degre', { mode: 'maj', max: 4, degres: [1, 4, 5] }, 10, 'I, IV ou V ?'),
        ],
        { videos: [video('Les trois accords I IV V au piano', 'accompagner une chanson avec trois accords I IV V piano débutant'), video('La Bamba au piano facile', 'La Bamba piano facile accords C F G')],
          mix: [{ gen: 'accord-degre', params: { mode: 'maj', max: 4, degres: [1, 4, 5] } }],
          cartes: cartes('Degrés', [['I – IV – V en do majeur ?', 'C – F – G.'], ['I – IV – V en sol majeur ?', 'G – C – D.'], ['I – IV – V en ré majeur ?', 'D – G – A.'], ['I – IV – V en fa majeur ?', 'F – B♭ – C.'], ['Pourquoi ces trois accords ?', 'Ils représentent tonique, sous-dominante et dominante : les piliers de la tonalité.']]) }),

      L('v4-12-cadences', 'Les cadences : ponctuer la musique', 40,
        ['Reconnaître les quatre cadences principales : parfaite, plagale, demi-cadence, rompue.', 'Les jouer dans plusieurs tonalités.', 'Les entendre à l’oreille.'],
        [
          p('Une **cadence** est un enchaînement d’accords qui **ponctue** une phrase musicale, comme un point ou une virgule dans un texte. La cadence finale d’un morceau est la plus importante : elle donne le **sentiment de fin**.'),
          def('cadence', 'Une **cadence** est la **suite d’accords qui termine une phrase**. Selon les accords, la phrase paraît **terminée** (point) ou **suspendue** (virgule).'),
          h('1 · La cadence parfaite : V → I'),
          prog('c4', 'maj', [4, 5, 1], 'Cadence parfaite en do majeur', { d: 'h', mes: '6/4' }),
          p('Le plus puissant des « points finaux ». La dominante (tension) se résout sur la tonique (repos). On la rencontre à la fin de presque tous les morceaux classiques et populaires.'),
          h('2 · La cadence plagale : IV → I'),
          prog('c4', 'maj', [1, 4, 1], 'Cadence plagale en do majeur', { d: 'h', mes: '6/4' }),
          p('Plus douce, moins affirmée : c’est le « amen » des chants religieux. Elle donne une impression de paix, de conclusion tranquille.'),
          h('3 · La demi-cadence : → V'),
          prog('c4', 'maj', [1, 4, 5], 'Demi-cadence en do majeur', { d: 'h', mes: '6/4' }),
          p('La phrase s’arrête **sur la dominante** : c’est une **virgule**, on attend la suite. On l’emploie à la fin de la première moitié d’une phrase.'),
          h('4 · La cadence rompue : V → vi'),
          prog('c4', 'maj', [1, 5, 6], 'Cadence rompue en do majeur', { d: 'h', mes: '6/4' }),
          p('On s’attend à I après V, mais la musique **dévie** sur vi (la mineur) : effet de surprise, de rebondissement.'),
          tab(['Cadence', 'Accords', 'Effet', 'Ponctuation'], [['Parfaite', 'V → I', 'conclusion forte', 'point'], ['Plagale', 'IV → I', 'conclusion douce', 'point (« amen »)'], ['Demi-cadence', '… → V', 'suspension', 'virgule'], ['Rompue', 'V → vi', 'surprise', 'point d’exclamation / de suspension']]),
          qcm('Cadences', [
            ['V → I est la cadence…', ['parfaite', 'plagale', 'rompue', 'demi-cadence'], 0, 'Conclusion.'],
            ['IV → I est la cadence…', ['plagale', 'parfaite', 'rompue', 'demi-cadence'], 0, 'Le « amen ».'],
            ['Une phrase qui s’arrête sur V termine par une…', ['demi-cadence', 'cadence parfaite', 'cadence plagale', 'cadence rompue'], 0, 'Virgule.'],
            ['V → vi est la cadence…', ['rompue', 'parfaite', 'plagale', 'demi'], 0, 'On évite la tonique.'],
            ['Quelle cadence donne la conclusion la plus forte ?', ['parfaite', 'plagale', 'demi', 'rompue'], 0, 'V → I.'],
          ]),
          exo('cadence', { types: ['parfaite', 'plagale', 'demi', 'rompue'], mode: 'maj', max: 2 }, 10, 'Reconnaître la cadence (majeur)'),
          exo('cadence', { types: ['parfaite', 'plagale', 'demi'], mode: 'min', max: 2 }, 6, 'Reconnaître la cadence (mineur)'),
          exo('cadence-ecoute', { types: ['parfaite', 'plagale', 'demi', 'rompue'] }, 10, 'À l’oreille'),
        ],
        { videos: [video('Les cadences en musique expliquées', 'les cadences en musique parfaite plagale demi-cadence rompue explication piano'), video('Reconnaître une cadence à l’oreille', 'reconnaître une cadence à l’oreille formation musicale')],
          mix: [{ gen: 'cadence', params: { types: ['parfaite', 'plagale', 'demi', 'rompue'], mode: 'maj', max: 3 } }, { gen: 'cadence-ecoute', params: {} }],
          cartes: cartes('Degrés', [['Cadence parfaite ?', 'V → I (conclusion forte).'], ['Cadence plagale ?', 'IV → I (le « amen »).'], ['Demi-cadence ?', 'La phrase s’arrête sur V (virgule).'], ['Cadence rompue ?', 'V → vi (surprise).'], ['Cadence ?', 'Suite d’accords qui ponctue une phrase.']]) }),
    ],
  });
})();
