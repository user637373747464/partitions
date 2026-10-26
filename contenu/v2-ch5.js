/* Volume 2 · Chapitre 5 — Le ton, le demi-ton et la gamme majeure. */
(function () {
  const { p, h, def, rem, ex, liste, num, tab, sc, piano, ry, qcm, exo, clav, cartes, video, L } = Contenu.o;
  const T = Theorie, nm = (n) => T.nomFr(n), Mj = (n) => T.Maj(n);
  const noms7 = (ton, type) => T.gamme(ton, type).slice(0, 7).map(nm).join(' – ');
  // insère une barre de mesure après chaque groupe de n notes (les étiquettes @ restent attachées)
  function bar(s, n) { const out = []; let k = 0; s.split(' ').forEach((t) => { if (t[0] !== '@' && t[0] !== '^') { if (k > 0 && k % n === 0) out.push('|'); k++; } out.push(t); }); return out.join(' ') + ' |]'; }
  // tableau « degré · note · intervalle jusqu’à la suivante » pour une gamme majeure
  function tabGamme(ton) {
    const g = T.gamme(ton, 'maj'), pas = T.FORMULES.maj;
    return tab(['Degré', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'], [['Note'].concat(g.map(nm)), ['Vers la suivante'].concat(pas.map((x) => (x === 1 ? '½ ton' : '1 ton')), ['']) ]);
  }
  Contenu.chapitre('v2', {
    id: 'v2c5', titre: 'Chapitre 5 · Le ton, le demi-ton et la gamme majeure',
    lecons: [
      L('v2-23-demi-ton', 'Le demi-ton et le ton', 30,
        ['Définir le demi-ton comme plus petite distance du piano.', 'Distinguer demi-ton diatonique et demi-ton chromatique.', 'Repérer les demi-tons entre notes blanches (mi–fa et si–do) et partout ailleurs.'],
        [
          p('Au piano, **deux touches voisines**, blanche ou noire, sont toujours séparées par un **demi-ton**. C’est la plus petite distance utilisée dans la musique occidentale. **Deux demi-tons** forment un **ton**.'),
          def('demi-ton', 'Le **demi-ton** est la distance entre **deux touches voisines**, quelle que soit leur couleur. Un **ton** = **deux demi-tons**.'),
          clav('c4', 'c5', { noms: 'tous', marque: ['e4', 'f4', 'b4', 'c5'], legende: 'Les seuls demi-tons **entre deux touches blanches** : mi–fa et si–do (marqués). Partout ailleurs, une touche noire se glisse entre les blanches.' }),
          h('Compter les demi-tons'),
          tab(['De…', 'À…', 'Demi-tons', 'Distance'], [['do', 'ré', '2', '1 ton'], ['ré', 'mi', '2', '1 ton'], ['mi', 'fa', '1', '**½ ton**'], ['fa', 'sol', '2', '1 ton'], ['sol', 'la', '2', '1 ton'], ['la', 'si', '2', '1 ton'], ['si', 'do', '1', '**½ ton**']]),
          sc('c4:q d4:q e4:q f4:q | g4:q a4:q b4:q c5:q |]', 'Les huit notes de la gamme de do : on cherche les deux demi-tons.', { mes: '4/4' }),
          h('Deux sortes de demi-tons'),
          def('demi-ton diatonique', 'Un demi-ton **diatonique** sépare **deux notes de noms différents** : mi–fa, do–ré♭, sol♯–la. (Les lettres se suivent.)'),
          def('demi-ton chromatique', 'Un demi-ton **chromatique** sépare **deux notes de même nom** dont l’une est altérée : do–do♯, ré–ré♭, fa♯–fa.'),
          sc('c4:q db4:q | c4:q c#4:q |]', 'À gauche : do → ré♭ (diatonique, deux noms). À droite : do → do♯ (chromatique, même nom).', { mes: '2/4' }),
          rem('Pourquoi cette distinction ?', 'Dans une gamme, **chaque lettre de note apparaît une fois** : on avance **par noms différents**. Un demi-ton **diatonique** fait « avancer » dans la gamme ; un demi-ton chromatique **colore** la note sans changer sa place. Tu verras que le choix du nom (do♯ ou ré♭) dépend de ce que cette distinction exige.'),
          qcm('Vérifie', [
            ['Combien de demi-tons dans un ton ?', ['1', '2', '3', '4'], 1, 'Deux.'],
            ['Entre quelles notes blanches y a-t-il un demi-ton ?', ['do–ré et fa–sol', 'mi–fa et si–do', 'ré–mi et la–si', 'sol–la et do–ré'], 1, 'Mi–fa et si–do : pas de touche noire entre elles.'],
            ['Do → do♯ est un demi-ton…', ['diatonique', 'chromatique', 'impossible', 'enharmonique'], 1, 'Même nom, une altération : chromatique.'],
            ['Do → ré♭ est un demi-ton…', ['chromatique', 'diatonique', 'inexistant', 'de 2 tons'], 1, 'Deux noms différents : diatonique.'],
            ['Combien de demi-tons de fa à si ?', ['4', '5', '6', '7'], 2, 'fa→sol 2, sol→la 2, la→si 2 : 6 demi-tons.'],
          ]),
          exo('interv-q', { nums: [2], quals: ['M', 'm'], alt: false }, 8, 'Seconde mineure ou majeure ?'),
        ],
        { videos: [video('Le ton et le demi-ton', 'ton demi-ton piano solfège débutant'), video('Demi-ton diatonique et chromatique', 'demi-ton diatonique chromatique expliqué')],
          mix: [{ gen: 'interv-q', params: { nums: [2], quals: ['M', 'm'], alt: false } }],
          cartes: cartes('Gammes', [['Qu’est-ce qu’un demi-ton ?', 'La distance entre deux touches voisines du piano.'], ['Combien de demi-tons dans un ton ?', 'Deux.'], ['Quels demi-tons existent entre deux touches blanches ?', 'Mi–fa et si–do.'], ['Qu’est-ce qu’un demi-ton chromatique ?', 'Deux notes de même nom, dont l’une est altérée (do–do♯).'], ['Qu’est-ce qu’un demi-ton diatonique ?', 'Deux notes de noms différents (mi–fa, do–ré♭).']]) }),

      L('v2-24-chromatique', 'La gamme chromatique', 25,
        ['Écrire la gamme chromatique montante en dièses et descendante en bémols.', 'Comprendre que la gamme chromatique est faite uniquement de demi-tons.', 'La jouer au piano.'],
        [
          p('La **gamme chromatique** utilise **toutes les touches**, blanches et noires, **de demi-ton en demi-ton**. Entre un do et le do suivant, il y a **12 demi-tons**, donc **12 notes différentes** (le 13ᵉ son est l’octave).'),
          def('gamme chromatique', 'La **gamme chromatique** est la suite de **douze demi-tons consécutifs**. On l’écrit en **dièses à la montée** et en **bémols à la descente**.'),
          sc(bar(T.sc(['c4', 'c#4', 'd4', 'd#4', 'e4', 'f4', 'f#4', 'g4', 'g#4', 'a4', 'a#4', 'b4', 'c5'].map(T.parse), 'e'), 8), 'Gamme chromatique montante, notée avec des dièses.', { mes: '4/4', horsMesure: true }),
          sc(bar(T.sc(['c5', 'b4', 'bb4', 'a4', 'ab4', 'g4', 'gb4', 'f4', 'e4', 'eb4', 'd4', 'db4', 'c4'].map(T.parse), 'e'), 8), 'Gamme chromatique descendante, notée avec des bémols.', { mes: '4/4', horsMesure: true }),
          rem('Pourquoi des dièses en montant et des bémols en descendant ?', 'C’est une convention de lecture : un **dièse** « monte » vers la note suivante, un **bémol** « descend » vers la note suivante. Lire une montée avec des dièses (do – do♯ – ré) paraît naturel ; lire une descente avec des bémols (ré – ré♭ – do) aussi.'),
          h('Les 12 notes'),
          tab(['Touche', 'Nom en montant', 'Nom en descendant'], [['1', 'do', 'do'], ['2 (noire)', 'do♯', 'ré♭'], ['3', 'ré', 'ré'], ['4 (noire)', 'ré♯', 'mi♭'], ['5', 'mi', 'mi'], ['6', 'fa', 'fa'], ['7 (noire)', 'fa♯', 'sol♭'], ['8', 'sol', 'sol'], ['9 (noire)', 'sol♯', 'la♭'], ['10', 'la', 'la'], ['11 (noire)', 'la♯', 'si♭'], ['12', 'si', 'si']]),
          rem('Doigté', 'Le doigté classique de la gamme chromatique : **le pouce (1) sur les touches blanches**, **le majeur (3) sur les touches noires**, et **deux fois le pouce de suite** sur mi–fa et si–do (puisqu’il n’y a pas de noire entre elles).'),
          qcm('Vérifie', [
            ['Combien de notes différentes dans une octave chromatique ?', ['7', '8', '12', '13'], 2, 'Douze (la 13ᵉ est l’octave).'],
            ['À la montée, on note la gamme chromatique avec…', ['des bémols', 'des dièses', 'des bécarres', 'des doubles dièses'], 1, 'Dièses en montant.'],
            ['Entre mi et fa sur la gamme chromatique, il y a…', ['une touche noire', 'aucune touche noire', 'deux touches noires', 'un ton'], 1, 'Mi–fa : demi-ton diatonique, pas de noire.'],
            ['Combien de demi-tons de do à do (octave) ?', ['6', '8', '12', '24'], 2, 'Douze.'],
          ]),
          exo('alt-clavier', {}, 8, 'Touches noires'),
        ],
        { videos: [video('La gamme chromatique au piano', 'gamme chromatique piano doigté débutant')],
          mix: [{ gen: 'alt-clavier', params: {} }],
          cartes: cartes('Gammes', [['Combien de notes différentes dans la gamme chromatique ?', 'Douze.'], ['Comment note-t-on la gamme chromatique à la montée ?', 'Avec des dièses.'], ['Comment note-t-on la gamme chromatique à la descente ?', 'Avec des bémols.'], ['Quels doigts sur les touches noires dans la gamme chromatique ?', 'Le majeur (3).']]) }),

      L('v2-25-formule', 'La gamme majeure et sa formule', 35,
        ['Construire une gamme majeure sur n’importe quelle note avec la formule ton – ton – demi-ton – ton – ton – ton – demi-ton.', 'Comprendre pourquoi les gammes ont besoin de dièses ou de bémols.', 'Vérifier une gamme avec la règle « une lettre par note ».'],
        [
          p('Une **gamme** est une suite de notes **rangées par ordre de hauteur** et qui **commence et finit sur la même note** (la **tonique**). La **gamme majeure** est la plus connue : c’est « do ré mi fa sol la si do ». Mais on peut la **construire sur n’importe quelle note**, à condition de respecter **la même suite de distances**.'),
          def('gamme majeure', 'La **gamme majeure** est une gamme de **7 notes différentes** (8 avec l’octave) dont les **intervalles entre notes voisines** sont, dans l’ordre : **ton – ton – demi-ton – ton – ton – ton – demi-ton**.'),
          tabGamme('c4'),
          sc(bar(T.gammeScore('c4', 'maj', { d: 'q', etiq: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] }), 4), 'Do majeur : demi-tons entre le 3ᵉ et le 4ᵉ degré, puis entre le 7ᵉ et le 8ᵉ.', { mes: '4/4' }),
          rem('La formule en un coup d’œil', 'Retiens : **T T ½ T T T ½**. Les deux demi-tons sont aux degrés **III–IV** et **VII–VIII**. Tout le reste est un ton.'),
          h('Construire la gamme de sol majeur'),
          p('On part de **sol** et on applique la formule. Les notes naturelles (sol, la, si, do, ré, mi, fa) donnent :'),
          tab(['De', 'À', 'Avec les touches blanches', 'Distance voulue', 'Verdict'], [['sol', 'la', '1 ton', '1 ton', '✓'], ['la', 'si', '1 ton', '1 ton', '✓'], ['si', 'do', '½ ton', '½ ton', '✓'], ['do', 'ré', '1 ton', '1 ton', '✓'], ['ré', 'mi', '1 ton', '1 ton', '✓'], ['mi', 'fa', '½ ton', '1 ton', '✗ trop court'], ['fa', 'sol', '1 ton', '½ ton', '✗ trop long']]),
          p('Seuls les deux derniers pas sont faux. On les corrige d’un seul coup en **montant le 7ᵉ degré d’un demi-ton** : **fa devient fa♯**. Mi–fa♯ fait un ton, fa♯–sol un demi-ton : la formule est respectée. La gamme est **sol la si do ré mi fa♯ sol**.'),
          tabGamme('g4'),
          sc(bar(T.gammeScore('g4', 'maj', { d: 'q' }), 4), 'Sol majeur : fa♯ au lieu de fa pour que le VII–VIII soit un demi-ton.', { mes: '4/4' }),
          rem('Règle de l’écriture', 'Dans une gamme, **chaque lettre apparaît une seule fois**. On écrit donc fa♯ (et pas sol♭) dans la gamme de sol majeur : sinon on aurait deux sol et pas de fa. Les noms sont **dictés par les lettres**, pas par la touche.'),
          qcm('Vérifie', [
            ['La formule de la gamme majeure est…', ['T ½ T T ½ T T', 'T T ½ T T T ½', '½ T T T ½ T T', 'T T T ½ T T ½'], 1, 'Ton, ton, demi-ton, ton, ton, ton, demi-ton.'],
            ['Entre quels degrés y a-t-il un demi-ton dans une gamme majeure ?', ['I–II et V–VI', 'III–IV et VII–VIII', 'II–III et VI–VII', 'IV–V et VIII–IX'], 1, 'III–IV et VII–VIII.'],
            ['Combien de notes différentes dans une gamme majeure ?', ['5', '6', '7', '8'], 2, '7 notes (la 8ᵉ répète la 1re).'],
            ['Quel degré est altéré dans la gamme de sol majeur ?', ['Le 4ᵉ', 'Le 7ᵉ', 'Le 3ᵉ', 'Le 6ᵉ'], 1, 'Le fa devient fa♯.'],
            ['Pourquoi écrit-on fa♯ et non sol♭ dans la gamme de sol majeur ?', ['C’est plus joli', 'Chaque lettre apparaît une fois', 'C’est plus facile à jouer', 'Cela dépend du compositeur'], 1, 'On a déjà sol : il faut un fa.'],
          ]),
          exo('gamme-degre', { types: ['maj'], max: 1 }, 8, 'Notes des gammes (do, sol, fa)'),
        ],
        { videos: [video('Construire une gamme majeure', 'construire gamme majeure formule ton ton demi-ton piano'), video('Pourquoi des dièses dans les gammes ?', 'gamme majeure dièses bémols pourquoi expliqué')],
          mix: [{ gen: 'gamme-degre', params: { types: ['maj'], max: 3 } }],
          cartes: cartes('Gammes', [['Quelle est la formule de la gamme majeure ?', 'Ton – ton – demi-ton – ton – ton – ton – demi-ton.'], ['Où sont les demi-tons dans une gamme majeure ?', 'Entre les degrés III–IV et VII–VIII.'], ['Combien de notes différentes dans une gamme ?', 'Sept (la 8ᵉ répète la tonique).'], ['Quelle altération a sol majeur ?', 'Fa♯.'], ['Quelle règle d’écriture exige fa♯ plutôt que sol♭ dans sol majeur ?', 'Chaque lettre de note n’apparaît qu’une fois dans la gamme.']]) }),

      L('v2-26-tetracordes', 'Les tétracordes : deux moitiés de gamme', 25,
        ['Définir le tétracorde majeur : ton – ton – demi-ton.', 'Construire une gamme en collant deux tétracordes.', 'Comprendre le lien entre une gamme et la gamme à la quinte.'],
        [
          p('Pour construire une gamme plus vite, on la coupe en **deux moitiés** de **quatre notes** : des **tétracordes** (« quatre cordes » en grec).'),
          def('tétracorde majeur', 'Un **tétracorde majeur** est une suite de **4 notes** dont les intervalles sont **ton – ton – demi-ton**. Une gamme majeure est faite de **deux tétracordes** séparés par **un ton**.'),
          tab(['Tétracorde 1', 'Ton de séparation', 'Tétracorde 2'], [['T – T – ½', 'T', 'T – T – ½']]),
          sc('c4:q @I d4:q @II e4:q @III f4:q @IV | g4:q @V a4:q @VI b4:q @VII c5:q @VIII |]', 'Do majeur : do–ré–mi–fa (1er tétracorde) · un ton fa–sol · sol–la–si–do (2ᵉ tétracorde).', { mes: '4/4' }),
          h('Le truc qui relie les gammes'),
          p('Le **2ᵉ tétracorde** de do majeur (**sol la si do**) a la formule T – T – ½ : c’est donc **le 1er tétracorde de sol majeur** ! Il suffit de lui ajouter **un nouveau 2ᵉ tétracorde** à partir de **ré** : **ré mi fa♯ sol**. Voici la gamme de sol majeur :'),
          sc('g4:q a4:q b4:q c5:q | d5:q e5:q f#5:q g5:q |]', 'Sol majeur : sol-la-si-do (1er tétracorde) · ré-mi-fa♯-sol (2ᵉ tétracorde : le fa devient fa♯).', { mes: '4/4' }),
          rem('La règle des quintes', 'Pour passer d’une gamme majeure à la gamme **une quinte plus haut** : **on garde le 2ᵉ tétracorde comme 1er** et on **ajoute un dièse** (le 7ᵉ degré de la nouvelle gamme). Pour aller **une quinte plus bas**, on fait l’inverse : le **1er tétracorde** de la gamme de départ devient le **2ᵉ** de la nouvelle, et on construit un nouveau 1er tétracorde, qui **ajoute un bémol** (fa majeur : fa sol la si♭ · do ré mi fa). C’est ainsi qu’on obtient le **cercle des quintes**.'),
          tab(['Gamme', '1er tétracorde', '2ᵉ tétracorde', 'Altération nouvelle'], [['do', 'do ré mi fa', 'sol la si do', 'aucune'], ['sol', 'sol la si do', 'ré mi fa♯ sol', 'fa♯'], ['ré', 'ré mi fa♯ sol', 'la si do♯ ré', 'do♯'], ['la', 'la si do♯ ré', 'mi fa♯ sol♯ la', 'sol♯']]),
          qcm('Vérifie', [
            ['La formule d’un tétracorde majeur est…', ['T – T – ½', '½ – T – T', 'T – ½ – T', 'T – T – T'], 0, 'Ton, ton, demi-ton.'],
            ['Combien de notes dans un tétracorde ?', ['3', '4', '5', '7'], 1, 'Quatre.'],
            ['Quel est le 2ᵉ tétracorde de do majeur ?', ['ré mi fa sol', 'sol la si do', 'fa sol la si♭', 'mi fa sol la'], 1, 'Sol, la, si, do.'],
            ['Entre les deux tétracordes d’une gamme majeure, il y a…', ['un demi-ton', 'un ton', 'deux tons', 'rien'], 1, 'Un ton.'],
          ]),
        ],
        { videos: [video('Les tétracordes et la gamme majeure', 'tétracorde gamme majeure construire expliqué')],
          cartes: cartes('Gammes', [['Qu’est-ce qu’un tétracorde majeur ?', 'Quatre notes dont les intervalles sont ton – ton – demi-ton.'], ['De combien de tétracordes se compose une gamme majeure ?', 'Deux, séparés par un ton.'], ['Comment passe-t-on de do majeur à sol majeur ?', 'Le 2ᵉ tétracorde de do devient le 1er de sol, et on ajoute un dièse (fa♯).'], ['Quel est le 2ᵉ tétracorde de do majeur ?', 'Sol la si do.']]) }),

      L('v2-27-degres', 'Les degrés de la gamme et leurs noms', 30,
        ['Numéroter les degrés d’une gamme en chiffres romains.', 'Connaître le nom de chaque degré : tonique, sus-tonique, médiante…', 'Comprendre le rôle de la sensible et de la dominante.'],
        [
          p('Chaque note d’une gamme occupe une **place** : on l’appelle un **degré**. On numérote les degrés en **chiffres romains** (I à VII) et chacun a un **nom** qui dit son rôle.'),
          tab(['Degré', 'Nom', 'Rôle'], [['I', '**Tonique**', 'Note principale, point d’arrivée'], ['II', 'Sus-tonique', 'Juste au-dessus de la tonique'], ['III', '**Médiante**', 'Au milieu entre tonique et dominante, détermine majeur/mineur'], ['IV', '**Sous-dominante**', 'À une quinte sous la tonique, ou une quarte au-dessus'], ['V', '**Dominante**', 'Note la plus importante après la tonique ; à la quinte'], ['VI', 'Sus-dominante', 'Au-dessus de la dominante'], ['VII', '**Sensible**', 'Un demi-ton sous la tonique : elle « veut » monter']]),
          sc(bar(T.gammeScore('c4', 'maj', { d: 'q', etiq: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'I'] }), 4), 'La gamme de do : tonique do, sensible si.', { mes: '4/4' }),
          h('Trois degrés à savoir par cœur'),
          liste('**I — la tonique** : tout le morceau y revient. Elle « donne son nom » à la gamme.', '**V — la dominante** : à une quinte de la tonique. Elle est presque aussi importante, elle « tire » vers la tonique.', '**IV — la sous-dominante** : son symétrique de l’autre côté.'),
          rem('Degrés tonals et modaux', 'Les degrés **I, IV et V** sont dits **tonals** (ils définissent la tonalité : leurs rôles sont fixes). Les degrés **II, III, VI et VII** sont **modaux** (ils changent selon le mode : majeur, mineur…). Le **III** surtout décide si le mode est majeur ou mineur.'),
          h('La sensible'),
          p('Le **VIIᵉ degré** d’une gamme majeure est à **un demi-ton** de la tonique : cette petite distance crée une **attraction** vers la tonique. On l’appelle **sensible**. Ce n’est pas le cas du 7ᵉ degré de toutes les gammes (en mineur naturel il est à un ton) ; nous le verrons au volume suivant.'),
          sc('a3:q b3:q c4:h |]', 'Si → do : la sensible monte naturellement vers la tonique.', { mes: '4/4' }),
          qcm('Vérifie', [
            ['Quel est le nom du Ve degré ?', ['Médiante', 'Dominante', 'Sensible', 'Sus-tonique'], 1, 'Dominante.'],
            ['Quel est le nom du VIIᵉ degré en gamme majeure ?', ['Sensible', 'Tonique', 'Sous-dominante', 'Médiante'], 0, 'Sensible, à un demi-ton de la tonique.'],
            ['Quelle est la médiante de do majeur ?', ['ré', 'mi', 'fa', 'sol'], 1, 'III = mi.'],
            ['Les degrés tonals sont…', ['II, III, VI', 'I, IV, V', 'I, III, V', 'IV, V, VII'], 1, 'I, IV, V.'],
            ['Quelle est la dominante de sol majeur ?', ['do', 'ré', 'mi', 'si'], 1, 'Sol → V = ré.'],
          ]),
          exo('gamme-degre', { types: ['maj'], max: 3, degres: [2, 3, 4, 5, 6, 7] }, 10, 'Trouver une note par son degré'),
        ],
        { videos: [video('Les degrés de la gamme', 'degrés de la gamme tonique dominante sensible solfège'), video('La sensible expliquée', 'note sensible gamme majeure attraction tonique')],
          mix: [{ gen: 'gamme-degre', params: { types: ['maj'], max: 3 } }],
          cartes: cartes('Gammes', [['Comment s’appelle le 1er degré ?', 'La tonique.'], ['Comment s’appelle le 5ᵉ degré ?', 'La dominante.'], ['Comment s’appelle le 4ᵉ degré ?', 'La sous-dominante.'], ['Comment s’appelle le 7ᵉ degré en gamme majeure ?', 'La sensible : elle est à un demi-ton de la tonique.'], ['Comment s’appelle le 3ᵉ degré ?', 'La médiante.'], ['Quels degrés sont dits tonals ?', 'I, IV et V.']]) }),

      L('v2-28-do-majeur', 'Jouer la gamme de do majeur', 30,
        ['Jouer la gamme de do majeur à une main puis aux deux, sur une et deux octaves.', 'Appliquer le passage du pouce.', 'Associer le doigté à la formule de la gamme.'],
        [
          p('Pour **jouer une gamme** sur toute la longueur du clavier avec seulement cinq doigts, il faut un **truc** : le **passage du pouce**. Le pouce passe **sous** la main pour que les doigts suivants puissent continuer leur course.'),
          h('Une octave, main droite'),
          sc('c4:q @1 d4:q @2 e4:q @3 f4:q @1 | g4:q @2 a4:q @3 b4:q @4 c5:q @5 |]', 'Main droite : 1 2 3 · pouce passe sous le majeur · 1 2 3 4 5.', { mes: '4/4' }),
          h('Une octave, main gauche'),
          sc('c3:q @5 d3:q @4 e3:q @3 f3:q @2 | g3:q @1 a3:q @3 b3:q @2 c4:q @1 |]', 'Main gauche : 5 4 3 2 1 · le majeur passe par-dessus le pouce · 3 2 1.', { clef: 'fa', mes: '4/4' }),
          rem('À retenir', 'Le passage du pouce se fait **après trois notes** à la main droite en montant, **après cinq notes** à la main gauche en montant (le doigt 3 passe par-dessus le 1). En descendant, c’est le contraire.'),
          h('Deux octaves, deux mains'),
          piano('c4:e @1 d4:e @2 e4:e @3 f4:e @1 g4:e @2 a4:e @3 b4:e @4 c5:e @1 | d5:e @2 e5:e @3 f5:e @1 g5:e @2 a5:e @3 b5:e @4 c6:q @5 |]', 'c3:e @5 d3:e @4 e3:e @3 f3:e @2 g3:e @1 a3:e @3 b3:e @2 c4:e @1 | d4:e @4 e4:e @3 f4:e @2 g4:e @1 a4:e @3 b4:e @2 c5:q @1 |]', 'Gamme de do majeur sur deux octaves, mains ensemble à l’octave (RH 1 2 3 1 2 3 4 | 1 2 3 1 2 3 4 5 ; LH 5 4 3 2 1 3 2 | 1 4 3 2 1 3 2 1).', { mes: '4/4' }),
          rem('Pour bien travailler une gamme', '**1.** Une main, lentement, avec le métronome à 60. **2.** Les deux mains. **3.** Monter **et** descendre. **4.** Augmenter le tempo de 4 en 4. **5.** Jouer fort puis piano, legato puis staccato. Cinq minutes par jour, c’est suffisant : la régularité compte plus que la durée.'),
          h('Les erreurs classiques'),
          liste('**Pouce qui saute** : le passage du pouce doit être invisible, sans à-coup.', '**Poignet qui tourne** : le bras suit les doigts, le poignet reste souple.', '**Mains décalées** : quand tu joues les deux mains à l’octave, elles doivent démarrer et arriver **ensemble**, note pour note.'),
          qcm('Vérifie', [
            ['Quel doigt passe sous la main à la main droite en montant ?', ['Le pouce', 'L’index', 'Le majeur', 'L’auriculaire'], 0, 'Le pouce.'],
            ['À la main gauche, on monte la gamme de do en commençant par…', ['le pouce', 'le doigt 5', 'le doigt 3', 'le doigt 2'], 1, 'Le 5 (auriculaire).'],
            ['Que veut dire « legato » ?', ['Détaché', 'Lié, sans coupure', 'Très fort', 'Très lent'], 1, 'Joué lié.'],
          ]),
          exo('nom-clavier', { lo: 'c3', hi: 'c5' }, 8, 'Un nom, une touche'),
        ],
        { videos: [video('La gamme de do majeur au piano', 'gamme do majeur piano doigté main droite main gauche'), video('Passage du pouce au piano', 'passage du pouce piano gamme technique')],
          mix: [{ gen: 'nom-clavier', params: { lo: 'c3', hi: 'c5' } }],
          cartes: cartes('Gammes', [['Doigté de la main droite pour do majeur (une octave) ?', '1 2 3 1 2 3 4 5.'], ['Doigté de la main gauche pour do majeur (une octave) ?', '5 4 3 2 1 3 2 1.'], ['À quoi sert le passage du pouce ?', 'À jouer une gamme sur plus de cinq notes avec une main.'], ['Quel tempo pour commencer une gamme ?', 'Lent, avec métronome (par exemple 60).']]) }),
    ],
  });
})();
