/* Volume 2 · Chapitre 7 — Les armures et le cercle des quintes. */
(function () {
  const { p, h, def, rem, ex, liste, num, tab, sc, piano, ry, qcm, exo, clav, cartes, video, L } = Contenu.o;
  const T = Theorie, nm = (n) => T.nomFr(n), Mj = (n) => T.Maj(n);
  const cap = (x) => x.replace(/^./, (c) => c.toUpperCase());

  /* ---------- le cercle des quintes en SVG (majeures dehors, mineures dedans) ---------- */
  function cercle() {
    const maj = ['Do', 'Sol', 'Ré', 'La', 'Mi', 'Si', 'Fa♯ / Sol♭', 'Ré♭', 'La♭', 'Mi♭', 'Si♭', 'Fa'];
    const min = ['la', 'mi', 'si', 'fa♯', 'do♯', 'sol♯', 'ré♯ / mi♭', 'si♭', 'fa', 'do', 'sol', 'ré'];
    const alt = ['0', '1♯', '2♯', '3♯', '4♯', '5♯', '6♯ ou 6♭', '5♭', '4♭', '3♭', '2♭', '1♭'];
    const P = (r, i) => [Math.sin(i * Math.PI / 6) * r, -Math.cos(i * Math.PI / 6) * r];
    let s = '<svg viewBox="-175 -175 350 350" style="width:100%;max-width:360px;height:auto;display:block;margin:12px auto" role="img" aria-label="Le cercle des quintes : tonalités majeures à l’extérieur, mineures à l’intérieur, nombre d’altérations autour.">';
    s += '<circle r="142" style="fill:none;stroke:var(--trait);stroke-width:1.5"/><circle r="102" style="fill:none;stroke:var(--trait);stroke-width:1.2"/><circle r="64" style="fill:none;stroke:var(--trait);stroke-width:1.2"/>';
    for (let i = 0; i < 12; i++) {
      const a = P(64, i - 0.5), b = P(142, i - 0.5);
      s += '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" style="stroke:var(--trait);stroke-width:1"/>';
      const pm = P(122, i), pn = P(83, i), pa = P(157, i);
      const fs = maj[i].length > 3 ? 11 : 16;
      s += '<text x="' + pm[0].toFixed(1) + '" y="' + (pm[1] + 5).toFixed(1) + '" text-anchor="middle" style="font:700 ' + fs + 'px var(--sans);fill:var(--encre)">' + maj[i] + '</text>';
      s += '<text x="' + pn[0].toFixed(1) + '" y="' + (pn[1] + 4).toFixed(1) + '" text-anchor="middle" style="font:' + (min[i].length > 3 ? 9 : 13) + 'px var(--sans);fill:var(--accent)">' + min[i] + '</text>';
      s += '<text x="' + pa[0].toFixed(1) + '" y="' + (pa[1] + 4).toFixed(1) + '" text-anchor="middle" style="font:11px var(--sans);fill:var(--gris)">' + alt[i] + '</text>';
    }
    s += '<text y="-4" text-anchor="middle" style="font:12px var(--sans);fill:var(--gris)">majeures</text><text y="12" text-anchor="middle" style="font:12px var(--sans);fill:var(--accent)">mineures</text>';
    return s + '</svg>';
  }
  const sortie = (n) => sc('', (n === 0 ? 'Aucune altération : do majeur / la mineur.' : Math.abs(n) + (n > 0 ? ' dièse' : ' bémol') + (Math.abs(n) > 1 ? 's' : '') + ' : ' + Mj(T.tonDe(n, 'maj', 4)) + ' majeur / ' + Mj(T.tonDe(n, 'min', 4)) + ' mineur.'), { arm: n });

  Contenu.chapitre('v2', {
    id: 'v2c7', titre: 'Chapitre 7 · Les armures et le cercle des quintes',
    lecons: [
      L('v2-36-armures', 'Lire une armure', 35,
        ['Connaître l’ordre des dièses et des bémols et leur place sur la portée.', 'Trouver la tonalité majeure d’une armure en quelques secondes.', 'Passer de la tonalité à son armure et inversement.'],
        [
          p('Une **armure** est l’ensemble des **altérations écrites au début de chaque ligne** (juste après la clé). Elle remplace d’avoir à écrire dièse ou bémol devant chaque note concernée, **sur toutes les octaves**, **pendant tout le morceau**.'),
          rem('Rappel', 'L’armure affecte **toutes les notes de même nom**, à toutes les octaves. Seule une altération **accidentelle** (écrite devant une note) la modifie, et seulement **jusqu’à la barre de mesure**.'),
          h('L’ordre des dièses et des bémols'),
          tab(['Altération', 'Ordre', 'Phrase pour s’en souvenir'], [['Dièses ♯', '**fa – do – sol – ré – la – mi – si**', 'Fa Do Sol Ré La Mi Si (le cercle des quintes vers le haut)'], ['Bémols ♭', '**si – mi – la – ré – sol – do – fa**', 'L’ordre inverse : Si Mi La Ré Sol Do Fa']]),
          sortie(1), sortie(2), sortie(3), sortie(4), sortie(5), sortie(6), sortie(7),
          p('Les dièses forment un **zigzag** sur la portée (en clé de sol : fa, do, sol, ré en haut, puis la, mi, si en bas) ; les bémols forment un autre zigzag. On les écrit toujours **dans cet ordre**, et le dessin ne change jamais.'),
          sortie(-1), sortie(-2), sortie(-3), sortie(-4), sortie(-5), sortie(-6), sortie(-7),
          h('Trouver la tonalité (majeure) en un coup d’œil'),
          tab(['Armure à…', 'Méthode', 'Exemple'], [['dièses', 'Le **dernier dièse** + un demi-ton (la note juste au-dessus)', 'fa♯ do♯ sol♯ → sol♯ + ½ ton = **la majeur**'], ['bémols', 'L’**avant-dernier bémol** est la tonique (un seul bémol : fa majeur)', 'si♭ mi♭ la♭ → avant-dernier = **mi♭ majeur**'], ['aucune', 'Do majeur (ou la mineur)', '—']]),
          rem('Piège', 'Ne confonds pas **la tonalité** et **la dernière altération**. La dernière altération est la **sensible** pour les dièses (un demi-ton sous la tonique) et la **sous-dominante** pour les bémols (une quarte au-dessus de la tonique).'),
          exo('armure', { max: 7 }, 10, 'Quelle tonalité majeure ?'),
          exo('armure-notes', { mode: 'maj', max: 7 }, 6, 'Quelles notes sont altérées ?'),
          exo('armure-combien', { mode: 'maj', max: 7 }, 6, 'Combien d’altérations ?'),
        ],
        { videos: [video('Lire une armure rapidement', 'trouver la tonalité à partir de l’armure astuce solfège'), video('L’ordre des dièses et des bémols', 'ordre des dièses ordre des bémols astuce piano')],
          mix: [{ gen: 'armure', params: { max: 7 } }, { gen: 'armure-notes', params: { mode: 'maj', max: 7 } }, { gen: 'armure-combien', params: { mode: 'maj', max: 7 } }],
          cartes: cartes('Armures', [['Dans quel ordre s’écrivent les dièses à l’armure ?', 'Fa, do, sol, ré, la, mi, si.'], ['Dans quel ordre s’écrivent les bémols à l’armure ?', 'Si, mi, la, ré, sol, do, fa.'], ['Comment trouve-t-on la tonalité majeure d’une armure à dièses ?', 'Dernier dièse + un demi-ton.'], ['Comment trouve-t-on la tonalité majeure d’une armure à bémols ?', 'L’avant-dernier bémol (un seul bémol : fa majeur).'], ['L’armure agit sur…', 'Toutes les notes de même nom, à toutes les octaves, pendant tout le morceau.']]) }),

      L('v2-37-cercle', 'Le cercle des quintes', 40,
        ['Lire le cercle des quintes : majeures dehors, mineures dedans, altérations autour.', 'Passer d’une tonalité à sa voisine en tournant dans un sens ou dans l’autre.', 'Trouver la dominante et la sous-dominante d’une tonalité sur le cercle.'],
        [
          p('Le **cercle des quintes** range les **douze tonalités** sur un cercle. On passe d’une tonalité à la suivante en montant **d’une quinte juste** (7 demi-tons) — et cette quinte ajoute **un dièse** (ou enlève un bémol).'),
          p(cercle()),
          rem('Comment le lire', '**Dans le sens des aiguilles d’une montre** (vers la droite) : on monte d’une quinte, on **ajoute un dièse**. **Dans le sens inverse** : on descend d’une quinte (ou monte d’une quarte), on **ajoute un bémol**. **En haut** : do majeur, aucune altération. **En bas** : fa♯ / sol♭ (6 altérations).'),
          h('Ce qu’on y lit'),
          liste('**Les majeures** (anneau extérieur) et **les mineures relatives** (anneau intérieur, même armure) face à face.', '**La dominante** d’une tonalité est **la case à sa droite** (une quinte au-dessus) ; **la sous-dominante** est **la case à sa gauche**.', '**Le nombre d’altérations** : autant de cases qu’on s’éloigne de do (vers la droite : dièses ; vers la gauche : bémols).', '**Les enharmoniques** se rencontrent en bas du cercle : fa♯ = sol♭, do♯ = ré♭, si = do♭.'),
          h('Trouver la tonalité voisine d’une tonalité'),
          tab(['Tonalité', 'À droite (dominante)', 'À gauche (sous-dominante)'], [['do majeur', 'sol majeur', 'fa majeur'], ['sol majeur', 'ré majeur', 'do majeur'], ['ré majeur', 'la majeur', 'sol majeur'], ['fa majeur', 'do majeur', 'si♭ majeur'], ['si♭ majeur', 'fa majeur', 'mi♭ majeur']]),
          rem('Astuce mnémotechnique', 'Pour réciter les quintes ascendantes : « **Do Sol Ré La Mi Si Fa♯ Do♯** ». Pour les descendantes : « **Do Fa Si♭ Mi♭ La♭ Ré♭ Sol♭ Do♭** ». Si tu sais ces deux listes, tu sais toutes les armures.'),
          h('Une propriété musicale'),
          p('Les tonalités **voisines** sur le cercle sont **les plus proches** musicalement : elles ne diffèrent que par **une seule altération**. Quand un compositeur « module » (change de tonalité), il passe le plus souvent à une tonalité voisine.'),
          qcm('Vérifie', [
            ['La tonalité à droite de do majeur sur le cercle est…', ['fa majeur', 'sol majeur', 'ré majeur', 'la mineur'], 1, 'Sol majeur (une quinte au-dessus).'],
            ['La dominante de si♭ majeur est…', ['mi♭', 'fa', 'do', 'sol'], 1, 'Fa majeur.'],
            ['En allant vers la gauche du cercle on ajoute…', ['des dièses', 'des bémols', 'des bécarres', 'rien'], 1, 'Un bémol à chaque quinte descendue.'],
            ['Quel est l’autre nom de la tonalité de fa♯ majeur ?', ['sol♭ majeur', 'la♭ majeur', 'ré♭ majeur', 'do♭ majeur'], 0, 'Sol♭ majeur.'],
            ['Combien d’altérations en bas du cercle ?', ['5', '6', '7', '8'], 1, 'Six dièses ou six bémols.'],
          ]),
          exo('cercle', { max: 6 }, 10, 'Tonalité voisine'),
          exo('armure-combien', { mode: 'les-deux', max: 7 }, 8, 'Combien d’altérations ?'),
        ],
        { videos: [video('Le cercle des quintes expliqué', 'cercle des quintes expliqué piano'), video('Utiliser le cercle des quintes', 'cercle des quintes comment l’utiliser tonalités armures')],
          mix: [{ gen: 'cercle', params: { max: 6 } }, { gen: 'armure-combien', params: { mode: 'maj', max: 7 } }],
          cartes: cartes('Armures', [['Dans quel sens ajoute-t-on des dièses sur le cercle des quintes ?', 'Dans le sens des aiguilles d’une montre (vers la droite).'], ['Dans quel sens ajoute-t-on des bémols ?', 'Dans le sens inverse (vers la gauche).'], ['Où trouve-t-on la dominante d’une tonalité sur le cercle ?', 'À sa droite.'], ['Où trouve-t-on la sous-dominante ?', 'À sa gauche.'], ['Quelles tonalités sont voisines ?', 'Celles qui diffèrent d’une seule altération.']]) }),

      L('v2-38-relatives', 'Tonalités relatives et homonymes', 30,
        ['Définir relative et homonyme.', 'Trouver la relative mineure d’une tonalité majeure (et inversement).', 'Repérer le mode d’un morceau en observant l’armure et la dernière note.'],
        [
          p('Toute armure convient à **deux tonalités**, une majeure et une mineure. C’est le principe des **tonalités relatives**.'),
          def('tonalités relatives', 'Deux tonalités sont **relatives** quand elles ont **la même armure** mais des toniques différentes (une majeure, une mineure). La relative mineure d’une tonalité majeure se trouve **une tierce mineure plus bas** (3 demi-tons).'),
          tab(['Majeure', 'Armure', 'Relative mineure'], [['do majeur', '0', 'la mineur'], ['sol majeur', '1 ♯', 'mi mineur'], ['ré majeur', '2 ♯', 'si mineur'], ['la majeur', '3 ♯', 'fa♯ mineur'], ['fa majeur', '1 ♭', 'ré mineur'], ['si♭ majeur', '2 ♭', 'sol mineur'], ['mi♭ majeur', '3 ♭', 'do mineur']]),
          sc('', 'Même armure (un dièse) pour sol majeur et mi mineur.', { arm: 1 }),
          rem('Trouver la relative', '**De majeur à mineur** : descends d’une tierce mineure (3 demi-tons) : do → la. **De mineur à majeur** : monte d’une tierce mineure : la → do. Autre truc : **la relative mineure est sur le 6ᵉ degré** de la gamme majeure, et la relative majeure sur le 3ᵉ degré de la gamme mineure.'),
          def('tonalités homonymes', 'Deux tonalités sont **homonymes** quand elles ont **la même tonique** mais **un mode différent** : do majeur et do mineur, par exemple. Elles ont des armures **différentes**.'),
          tab(['Majeur', 'Mineur homonyme', 'Différence d’armure'], [['do majeur (0)', 'do mineur (3 ♭)', '3 bémols de plus'], ['sol majeur (1 ♯)', 'sol mineur (2 ♭)', '3 altérations'], ['la majeur (3 ♯)', 'la mineur (0)', '3 dièses de moins']]),
          rem('À retenir', 'Pour passer de **majeur à mineur** sur la **même tonique**, on **abaisse de 3 altérations** (on ajoute 3 bémols ou on retire 3 dièses). Cela revient à baisser les degrés **III, VI et VII**.'),
          h('Majeur ou mineur ? Comment trancher'),
          p('Devant un morceau dont l’armure n’a, par exemple, qu’**un dièse**, on hésite entre **sol majeur** et **mi mineur**. On regarde : **la dernière note de la mélodie**, **la première note**, **les altérations accidentelles** (un ré♯ en mi mineur est une sensible, nous y reviendrons au Volume 3) et surtout **l’oreille** : le morceau « se repose-t-il » sur sol ou sur mi ?'),
          qcm('Vérifie', [
            ['La relative mineure de sol majeur est…', ['mi mineur', 'si mineur', 'la mineur', 'sol mineur'], 0, 'Mi mineur : même armure (fa♯).'],
            ['La relative majeure de ré mineur est…', ['fa majeur', 'la majeur', 'si♭ majeur', 'ré majeur'], 0, 'Fa majeur (1 bémol).'],
            ['Do majeur et do mineur sont…', ['relatives', 'homonymes', 'enharmoniques', 'voisines'], 1, 'Même tonique, mode différent.'],
            ['La relative mineure est sur quel degré de la gamme majeure ?', ['IIᵉ', 'IIIᵉ', 'VIᵉ', 'VIIᵉ'], 2, 'VIᵉ degré (do → la).'],
          ]),
          exo('relative', { mode: 'les-deux', max: 5 }, 10, 'Tonalités relatives'),
        ],
        { videos: [video('Tonalités relatives et homonymes', 'tonalités relatives homonymes solfège expliqué'), video('Trouver la relative mineure', 'trouver la relative mineure astuce')],
          mix: [{ gen: 'relative', params: { mode: 'les-deux', max: 5 } }],
          cartes: cartes('Armures', [['Quelle est la relative mineure de do majeur ?', 'La mineur.'], ['Quelle est la relative mineure de sol majeur ?', 'Mi mineur.'], ['Comment trouve-t-on la relative mineure d’une tonalité majeure ?', 'On descend d’une tierce mineure (3 demi-tons).'], ['Que sont deux tonalités homonymes ?', 'Même tonique, mode différent (do majeur / do mineur).'], ['Que sont deux tonalités relatives ?', 'Même armure, toniques différentes (une majeure, une mineure).']]) }),

      L('v2-39-voisines', 'Les tonalités voisines', 25,
        ['Identifier les cinq tonalités voisines d’une tonalité donnée.', 'Comprendre pourquoi elles sont les cibles privilégiées des modulations.', 'Les trouver à partir du cercle des quintes.'],
        [
          p('Une tonalité a **cinq tonalités « voisines »** : celles dont l’armure **diffère d’une seule altération au plus**. Ce sont les destinations de **modulation** les plus naturelles. Pour une tonalité majeure :'),
          tab(['Voisine', 'Où ?', 'Pour do majeur'], [['Dominante', 'une quinte au-dessus', 'sol majeur'], ['Sous-dominante', 'une quinte au-dessous', 'fa majeur'], ['Relative mineure', 'une tierce mineure au-dessous', 'la mineur'], ['Relative de la dominante', '', 'mi mineur'], ['Relative de la sous-dominante', '', 'ré mineur']]),
          rem('Même armure, ou une altération de différence', 'Do majeur (0) · sol majeur (1 ♯) · fa majeur (1 ♭) · la mineur (0) · mi mineur (1 ♯) · ré mineur (1 ♭) : l’armure ne bouge que d’une altération. Voilà pourquoi ces passages « coulent » naturellement.'),
          h('Modulation : changer de tonalité'),
          def('modulation', 'Une **modulation** est le **passage d’une tonalité à une autre** à l’intérieur d’un morceau. Elle se fait le plus souvent vers une **tonalité voisine**.'),
          sc('e4:q g4:q f4:q e4:q | d4:q f#4:q g4:h |]', 'Début en do majeur (fa naturel) ; puis un fa♯ apparaît et la mélodie se repose sur sol : on est passé en sol majeur.', { mes: '4/4' }),
          p('Dans un morceau classique, la **première partie** est dans la tonalité principale, la **deuxième** module vers la **dominante** (souvent) ou la **relative** (en mineur), puis **revient** à la tonique. Tu y reviendras en détail au Volume 5.'),
          qcm('Vérifie', [
            ['Combien de tonalités voisines pour une tonalité ?', ['2', '3', '5', '12'], 2, 'Cinq (en comptant relatives).'],
            ['Une modulation est…', ['un changement de tonalité', 'un changement de tempo', 'une reprise', 'une nuance'], 0, 'Un changement de tonalité.'],
            ['Vers quoi module-t-on le plus souvent depuis do majeur ?', ['sol majeur', 'fa♯ majeur', 'si♭ mineur', 'mi♭ majeur'], 0, 'Sol majeur : la dominante.'],
            ['La relative de la dominante de do majeur est…', ['la mineur', 'mi mineur', 'ré mineur', 'si mineur'], 1, 'Sol majeur → mi mineur.'],
          ]),
          exo('cercle', { max: 4 }, 8, 'Tonalités voisines'),
        ],
        { videos: [video('Les tonalités voisines', 'tonalités voisines modulation solfège expliqué')],
          cartes: cartes('Armures', [['Combien de tonalités voisines une tonalité a-t-elle ?', 'Cinq : dominante, sous-dominante, relative, relative de la dominante, relative de la sous-dominante.'], ['Quelles sont les tonalités voisines de do majeur ?', 'Sol majeur, fa majeur, la mineur, mi mineur, ré mineur.'], ['Qu’est-ce qu’une modulation ?', 'Un passage d’une tonalité à une autre dans un morceau.'], ['Quelle modulation est la plus courante en majeur ?', 'Vers la dominante (do majeur → sol majeur).']]) }),
    ],
  });
})();
