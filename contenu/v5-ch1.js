/* Volume 5 · Chapitre 1 — Motifs, phrases, périodes, séquences. */
(function () {
  const { p, h, def, rem, ex, liste, num, tab, sc, piano, ry, qcm, exo, clav, son, cartes, video, ivs, acs, G, L } = Contenu.o;

  // Ode à la joie (Beethoven) en do majeur, 16 mesures
  const ODE_A = 'e4:q e4:q f4:q g4:q | g4:q f4:q e4:q d4:q | c4:q c4:q d4:q e4:q | e4:q. d4:e d4:h |';
  const ODE_B = 'e4:q e4:q f4:q g4:q | g4:q f4:q e4:q d4:q | c4:q c4:q d4:q e4:q | d4:q. c4:e c4:h |]';
  const ODE_B1 = 'e4:q e4:q f4:q g4:q | g4:q f4:q e4:q d4:q | c4:q c4:q d4:q e4:q | d4:q. c4:e c4:h |]';

  Contenu.chapitre('v5', {
    id: 'v5c1', titre: 'Chapitre 1 · Motifs, phrases et périodes',
    lecons: [
      L('v5-01-motif', 'Le motif : la plus petite idée musicale', 30,
        ['Définir un motif et reconnaître sa répétition.', 'Entendre comment un motif fait « avancer » une pièce.', 'Repérer répétition, variation et contraste.'],
        [
          p('Les quatre volumes précédents t’ont donné l’**alphabet** (notes, rythmes, gammes, accords). Ce volume t’apprend à **lire les phrases** : comment les compositeurs construisent une pièce entière à partir de petites idées.'),
          def('motif', 'Un **motif** est la plus petite idée musicale reconnaissable : quelques notes avec un rythme caractéristique. On peut le reconnaître même s’il est transposé ou légèrement modifié.'),
          p('L’exemple le plus célèbre : le début de la **Cinquième Symphonie** de Beethoven (1808). Quatre notes : trois croches répétées, puis une note longue plus grave.'),
          sc('r:e g4:e g4:e g4:e | e4:h | r:e f4:e f4:e f4:e | d4:h |]', 'Le motif de la 5ᵉ Symphonie (en do mineur) puis le même motif un ton plus bas : cela s’appelle une séquence.', { mes: '2/4', arm: -3 }),
          p('Beethoven construit tout le premier mouvement avec ce seul motif : il le **répète**, le **transpose**, le **raccourcit**, le **renverse**. Cette économie de moyens est l’une des clés de la musique classique.'),
          h('Trois façons de traiter un motif'),
          tab(['Procédé', 'Ce que fait le compositeur', 'Effet'], [
            ['Répétition', 'Le motif revient identique', 'Unité, mémoire, insistance'],
            ['Variation', 'Même idée, légèrement modifiée (rythme, notes, harmonie)', 'Intérêt, évolution'],
            ['Contraste', 'Nouvelle idée, très différente', 'Surprise, équilibre'],
          ]),
          rem('Règle d’or de la forme', 'Presque toute musique repose sur un équilibre entre **ce qui revient** (unité) et **ce qui change** (variété). Trop de répétition ennuie ; trop de nouveauté désoriente. Toute la suite du volume ne fait qu’explorer cet équilibre.'),
          h('À toi de jouer'),
          ex('Joue le motif de la 5ᵉ Symphonie au piano (sol sol sol mi♭, puis fa fa fa ré), puis invente ta propre variation : même rythme, notes différentes.'),
          clav('g3', 'g4', { jouer: ['g4', 'g4', 'g4', 'd#4'], legende: 'Sol – sol – sol – mi♭ (le mi♭ s’écrit aussi ré♯ sur le clavier).' }),
          qcm('Le motif', [
            ['Qu’est-ce qu’un motif ?', ['une petite idée musicale reconnaissable', 'une longue mélodie', 'un accord', 'une nuance'], 0, 'Quelques notes seulement.'],
            ['Que fait Beethoven du motif de la 5ᵉ ?', ['il le répète, le transpose et le transforme', 'il l’utilise une seule fois', 'il l’abandonne', 'il le joue en accord'], 0, 'Tout le mouvement en dérive.'],
            ['Le même motif joué plus bas s’appelle…', ['une séquence', 'un contraste', 'une cadence', 'un ostinato'], 0, 'Transposition exacte du motif.'],
            ['Répéter exactement une idée donne surtout…', ['de l’unité', 'du contraste', 'de la modulation', 'du silence'], 0, 'Unité.'],
          ]),
        ],
        { videos: [video('Le motif de la 5ᵉ Symphonie de Beethoven expliqué', 'Beethoven 5e symphonie motif expliqué analyse'), video('Qu’est-ce qu’un motif en musique', 'motif musical définition phrase thème analyse débutant')],
          mix: [],
          cartes: cartes('Motif', [['Motif ?', 'La plus petite idée musicale reconnaissable.'], ['Répétition / variation / contraste ?', 'Les trois ressorts de la forme musicale.'], ['Séquence ?', 'Un motif répété à une hauteur différente.'], ['Motif de la 5ᵉ de Beethoven ?', 'Trois croches répétées puis une note longue plus grave.']]) }),

      L('v5-02-phrase', 'La phrase et la respiration', 35,
        ['Définir la phrase musicale.', 'Entendre où une phrase « respire ».', 'Mesurer des phrases de 4 mesures.'],
        [
          p('Un motif seul ne fait pas une mélodie. En les enchaînant, on obtient une **phrase** : un groupe de notes qui « dit quelque chose » et qui **se termine** par un petit repos, comme une phrase parlée.'),
          def('phrase', 'Une **phrase musicale** est une unité mélodique qui forme un sens complet et se termine par une **ponctuation** (une cadence ou un repos). La plus courante dure **4 mesures**, parfois 2 ou 8.'),
          sc(ODE_A, 'L’Ode à la joie de Beethoven (mesures 1 à 4) : une phrase de quatre mesures qui se termine sur un repos en suspens (la note ré).', { mes: '4/4' }),
          p('Chante-la, ou joue-la : à la fin de la mesure 4, tu sens que **ce n’est pas fini** — le ré est une note en l’air. Ce sentiment de suspension est une **ponctuation faible** (comme une virgule).'),
          sc(ODE_B, 'Les mesures 5 à 8 reprennent le même début, mais cette fois la phrase se termine sur la tonique (do) : le repos est complet.', { mes: '4/4' }),
          h('La ponctuation musicale'),
          tab(['En français', 'En musique', 'Effet'], [['virgule', 'cadence suspensive (demi-cadence sur V)', 'on attend la suite'], ['point', 'cadence conclusive (parfaite sur I)', 'on est arrivé'], ['point d’interrogation', 'cadence suspensive avec note aiguë', 'ouverture'], ['respiration', 'silence ou note longue', 'le chanteur respire']]),
          rem('Respirer en jouant', 'Quand tu joues une phrase, **lève légèrement la main** à la fin de chaque phrase, comme un chanteur qui reprend son souffle. Jouer toutes les notes sans respiration sonne mécanique.'),
          h('Compter les mesures'),
          p('Pour repérer les phrases, **compte les mesures** par groupes de 2 ou 4. Dans la musique classique et la chanson, 4 + 4 + 4 + 4 est la structure la plus fréquente : on dit que la musique est **carrée**.'),
          qcm('La phrase', [
            ['Combien de mesures dure la phrase la plus courante ?', ['4', '1', '16', '3'], 0, 'Quatre.'],
            ['Dans l’Ode à la joie, la première phrase se termine sur…', ['ré (suspension)', 'do (repos complet)', 'sol', 'mi'], 0, 'Ré : la note est en l’air.'],
            ['La virgule musicale correspond à…', ['une cadence suspensive', 'une cadence parfaite', 'un double barre', 'un trille'], 0, 'On attend la suite.'],
            ['Une musique « carrée » est faite de…', ['phrases de 4 mesures', 'phrases de 3 mesures', 'accords de 4 notes', 'mesures à 4 temps'], 0, 'Des groupes réguliers de 4 mesures.'],
          ]),
        ],
        { videos: [video('La phrase musicale expliquée', 'phrase musicale définition cadence ponctuation exemple piano'), video('Ode à la joie piano facile Beethoven', 'Ode à la joie Beethoven piano débutant tutoriel')],
          mix: [],
          cartes: cartes('Phrase', [['Phrase musicale ?', 'Unité mélodique complète qui se termine par une ponctuation, souvent de 4 mesures.'], ['Virgule musicale ?', 'Cadence suspensive (demi-cadence).'], ['Point musical ?', 'Cadence conclusive (parfaite).'], ['Musique « carrée » ?', 'Composée de phrases régulières de 4 mesures.']]) }),

      L('v5-03-periode', 'La période : question et réponse', 40,
        ['Définir la période, l’antécédent et le conséquent.', 'Repérer une période de huit mesures.', 'Voir comment les cadences la structurent.'],
        [
          p('Deux phrases qui se répondent forment une **période**. La première **pose une question**, la seconde **y répond**.'),
          def('période', 'Une **période** est un ensemble de **deux phrases** (souvent 4 + 4 mesures). La première, **l’antécédent**, finit sur une cadence **suspensive** (la question). La seconde, **le conséquent**, commence pareil mais finit sur une cadence **conclusive** (la réponse).'),
          sc(ODE_A + ' ' + ODE_B1, 'Ode à la joie (8 mesures) : l’antécédent finit sur ré (suspension), le conséquent sur do (conclusion).', { mes: '4/4' }),
          tab(['', 'Antécédent', 'Conséquent'], [['Mesures', '1 – 4', '5 – 8'], ['Début', 'Mi mi fa sol…', 'Identique'], ['Fin', 'Ré (sur V)', 'Do (sur I)'], ['Rôle', 'Question', 'Réponse'], ['Cadence', 'Demi-cadence', 'Cadence parfaite']]),
          rem('Une même architecture partout', 'Cette forme question/réponse est universelle : elle structure d’innombrables chansons, menuets et thèmes classiques. Quand deux phrases commencent de la même façon mais finissent différemment, pense « période ».'),
          h('Un autre exemple : le Menuet en sol'),
          p('Le célèbre **Menuet en sol majeur** (attribué à Christian Petzold, longtemps cru de Bach) ouvre sur une phrase de quatre mesures à 3/4 :'),
          sc('d5:q g4:e a4:e b4:e c5:e | d5:q g4:q g4:q | e5:q c5:e d5:e e5:e f#5:e | g5:q g4:q g4:q |]', 'Menuet en sol — début (4 mesures en 3/4). Remarque l’élan vers le sol aigu, puis la retombée.', { mes: '3/4', arm: 1 }),
          qcm('La période', [
            ['Une période est faite de…', ['deux phrases qui se répondent', 'trois motifs', 'un seul accord', 'une cadence'], 0, 'Antécédent + conséquent.'],
            ['L’antécédent finit sur…', ['une cadence suspensive', 'une cadence parfaite', 'un silence de 4 mesures', 'une modulation'], 0, 'La question.'],
            ['Le conséquent finit sur…', ['une cadence conclusive', 'une cadence suspensive', 'un trille', 'une double barre'], 0, 'La réponse.'],
            ['Les deux phrases de la période commencent…', ['de la même façon (en général)', 'de façon opposée', 'sans mélodie', 'avec des accords différents'], 0, 'Même début, fin différente.'],
          ]),
          ex('Chante l’Ode à la joie sur « lalala ». Après la mesure 4, arrête-toi : que ressens-tu ? Puis chante jusqu’à la mesure 8. Note la différence entre les deux fins.'),
        ],
        { videos: [video('La période musicale : antécédent et conséquent', 'période musicale antécédent conséquent analyse explication'), video('Menuet en sol majeur piano', 'Menuet en sol majeur Petzold piano tutoriel débutant')],
          mix: [],
          cartes: cartes('Période', [['Période ?', 'Deux phrases qui se répondent : antécédent puis conséquent.'], ['Antécédent ?', 'Première phrase, finit sur une cadence suspensive (question).'], ['Conséquent ?', 'Deuxième phrase, finit sur une cadence conclusive (réponse).'], ['Structure type ?', '4 mesures + 4 mesures.']]) }),

      L('v5-04-cadences', 'Placer les cadences : la ponctuation', 35,
        ['Associer cadences et fonctions dans une phrase.', 'Choisir la cadence qui convient à la fin d’une phrase.', 'Entendre la différence suspensive / conclusive.'],
        [
          p('Au volume 4, tu as appris les cadences. Voyons leur **rôle dans la forme** : elles sont la ponctuation des phrases.'),
          tab(['Cadence', 'Accords', 'Effet', 'Où la trouve-t-on ?'], [
            ['Parfaite', 'V → I', 'Conclusive, arrivée', 'Fin de phrase finale, fin de pièce'],
            ['Demi-cadence', '… → V', 'Suspensive, attente', 'Fin d’un antécédent'],
            ['Plagale', 'IV → I', 'Conclusive douce (« amen »)', 'Après la cadence parfaite, finales'],
            ['Rompue', 'V → vi', 'Surprise, rebondit', 'Prolonger une phrase'],
          ]),
          h('Exemple : une période harmonisée'),
          sc(acs([['c4', 'M'], ['f4', 'M'], ['c4', 'M', 2], ['g3', 'M'], ['c4', 'M'], ['f4', 'M'], ['g3', 'M'], ['c4', 'M']], 'h', 2), 'Antécédent : C – F – C/G – G (demi-cadence sur V). Conséquent : C – F – G – C (cadence parfaite).', { mes: '4/4' }),
          p('L’antécédent finit sur **G** (V) : demi-cadence, on attend. Le conséquent finit **G → C** : cadence parfaite, on conclut.'),
          rem('Astuce d’oreille', 'Pour savoir si une cadence est suspensive ou conclusive, demande-toi : « puis-je m’arrêter là ? » Si oui, c’est conclusif (I). Si non, c’est suspensif (V).'),
          exo('cadence', { types: ['parfaite', 'plagale', 'demi', 'rompue'], mode: 'maj', max: 3 }, 8, 'Reconnaître la cadence'),
          exo('cadence-ecoute', { types: ['parfaite', 'plagale', 'demi', 'rompue'] }, 8, 'Cadences à l’oreille'),
          qcm('Cadences et formes', [
            ['Quelle cadence termine un antécédent ?', ['la demi-cadence', 'la parfaite', 'la plagale', 'aucune'], 0, 'Elle suspend.'],
            ['Quelle cadence termine un conséquent ?', ['la parfaite', 'la demi-cadence', 'la rompue', 'aucune'], 0, 'Elle conclut.'],
            ['Que fait la cadence rompue ?', ['elle surprend et prolonge la phrase', 'elle conclut', 'elle modifie le tempo', 'elle ajoute un silence'], 0, 'V → vi : on s’attendait à I.'],
          ]),
        ],
        { videos: [video('Les cadences en musique : parfaite, plagale, demi, rompue', 'cadences parfaite plagale demi-cadence rompue piano explication'), video('Reconnaître les cadences à l’oreille', 'reconnaître cadences à l’oreille exercice formation musicale')],
          mix: [{ gen: 'cadence', params: { types: ['parfaite', 'plagale', 'demi', 'rompue'], mode: 'maj', max: 3 } }],
          cartes: cartes('Cadences et forme', [['Cadence parfaite ?', 'V → I, conclusive.'], ['Demi-cadence ?', 'Arrivée sur V, suspensive.'], ['Cadence plagale ?', 'IV → I, « amen ».'], ['Cadence rompue ?', 'V → vi, surprise.'], ['Cadence en fin d’antécédent ?', 'Une demi-cadence.']]) }),

      L('v5-05-sequence', 'La séquence : répéter plus haut ou plus bas', 35,
        ['Définir la séquence mélodique et harmonique.', 'Repérer la séquence dans une œuvre.', 'Jouer une séquence par quintes descendantes.'],
        [
          p('Quand un motif revient **à une autre hauteur**, c’est une **séquence**. C’est un procédé de composition très économique : on obtient de la musique « en marche » sans inventer de nouvelles notes.'),
          def('séquence', 'Une **séquence** est la répétition d’un motif (mélodique ou harmonique) à une **hauteur différente**, en général un ou deux degrés plus haut ou plus bas. Elle peut être **ascendante** ou **descendante**.'),
          sc('c4:e d4:e e4:e c4:e | d4:e e4:e f4:e d4:e | e4:e f4:e g4:e e4:e | f4:q g4:q |]', 'Séquence ascendante : le motif do–ré–mi–do est répété une note plus haut, puis encore une note plus haut.', { mes: '2/4' }),
          h('La séquence harmonique : le cycle des quintes'),
          p('La séquence d’accords la plus célèbre descend de **quinte en quinte** (ou monte de quarte). Elle parcourt les accords de la gamme en passant par tous les degrés :'),
          sc(acs([['c4', 'M'], ['f4', 'M'], ['b3', 'dim'], ['e4', 'm'], ['a3', 'm'], ['d4', 'm'], ['g3', 'M'], ['c4', 'M']], 'h', 2), 'Séquence par quintes en do majeur : C – F – B° – Em – Am – Dm – G – C (I – IV – vii° – iii – vi – ii – V – I).', { mes: '4/4' }),
          p('Cette suite sonne tellement bien qu’on la retrouve dans la musique baroque (Vivaldi, Bach), le jazz (Autumn Leaves) et la pop. Chaque accord « tire » vers le suivant.'),
          rem('Séquence ≠ répétition', 'Une **répétition** garde la même hauteur ; une **séquence** la déplace. Si tu changes la hauteur, la musique **progresse** ; si tu ne la changes pas, elle **insiste**.'),
          qcm('Séquence', [
            ['Une séquence est…', ['un motif répété à une autre hauteur', 'un accord de septième', 'une cadence', 'un rythme'], 0, 'Transposition de motif.'],
            ['Dans la séquence par quintes, après C vient…', ['F', 'G', 'Am', 'Dm'], 0, 'Descente de quinte (ou montée de quarte).'],
            ['Le dernier accord avant la tonique est souvent…', ['G (V)', 'Em', 'F', 'Am'], 0, 'La dominante prépare la fin.'],
            ['Dans cette séquence, quel accord est diminué ?', ['B° (vii)', 'Em', 'Am', 'Dm'], 0, 'Le 7ᵉ degré.'],
          ]),
          exo('accord-degre', { mode: 'maj', max: 3, sens: 'degre' }, 8, 'Accords de la gamme'),
        ],
        { videos: [video('La séquence en musique : mélodique et harmonique', 'séquence musicale mélodique harmonique cycle des quintes explication'), video('Le cycle des quintes en harmonie', 'progression par quintes descendantes cycle harmonique piano exemple')],
          mix: [{ gen: 'accord-degre', params: { mode: 'maj', max: 3 } }],
          cartes: cartes('Séquence', [['Séquence ?', 'Un motif répété à une autre hauteur.'], ['Séquence ascendante / descendante ?', 'Le motif monte / descend à chaque reprise.'], ['Séquence par quintes en do ?', 'C – F – B° – Em – Am – Dm – G – C.'], ['Répétition ou séquence : qu’est-ce qui fait avancer ?', 'La séquence, car la hauteur change.']]) }),
    ],
  });
})();
