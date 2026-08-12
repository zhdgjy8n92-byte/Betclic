/**
 * Base de données du Mercat'odds.
 *
 * Mécanique : un seul prono par jour. Le joueur désigne le transfert qu'il
 * pense voir officialisé dans la journée et empoche `gainBase` en feebets si
 * ça tombe. Il peut gonfler cette cagnotte en ajoutant des sélections
 * complémentaires (club d'arrivée, heure d'officialisation, montant…), chacune
 * valant le `bonus` en feebets indiqué sur la puce.
 *
 * Cohérence des montants : le gain est l'inverse de la probabilité. Un dossier
 * quasiment bouclé rapporte peu (5 €), un dossier enlisé rapporte gros (40 €).
 * Même logique sur chaque option de booster : l'issue attendue vaut quelques
 * euros, l'issue improbable en vaut plusieurs dizaines.
 *
 * Les rumeurs sont classées par fiabilité décroissante et les statuts reflètent
 * l'état réel des dossiers au 12 août 2026 (voir README pour les sources).
 *
 * Aucune cote n'est affichée nulle part : tout est exprimé en euros de feebets.
 */
window.MERCATODDS_RUMEURS = [
  {
    id: 'ferran-psg',
    photo: 'assets/img/joueurs/ferran-torres.jpg',
    joueur: 'Ferran Torres',
    initiales: 'FT',
    poste: 'Attaquant',
    age: 26,
    nationalite: '🇪🇸',
    clubActuel: { nom: 'FC Barcelone', couleur: '#A50044', ecusson: 'assets/img/clubs/barcelone.png' },
    clubCible: { nom: 'Paris SG', couleur: '#004170', ecusson: 'assets/img/clubs/psg.png' },
    montant: '50 M€',
    fiabilite: 88,
    chaud: true,
    competition: 'Ligue 1',
    source: "L'Équipe",
    tempsSource: 'il y a 40 min',
    titre: 'Ferran Torres au PSG : accord imminent avec le Barça',
    chapo:
      "Les discussions entre Paris et le FC Barcelone sont entrées dans leur dernière ligne droite, pour un montant attendu autour de 50 M€. Ferran Torres a donné son accord final aux Parisiens et espère voir son départ acté avant le 12 août, date de son retour à l'entraînement barcelonais. Champion du monde avec l'Espagne le 19 juillet, l'attaquant sort de la meilleure saison de sa carrière : 21 buts et 3 passes décisives en 49 matches.",
    gainBase: 5,
    boosters: [
      {
        id: 'club',
        titre: 'Dans quel club signe-t-il ?',
        options: [
          { label: 'Paris SG', bonus: 3 },
          { label: 'Aston Villa', bonus: 40 },
          { label: 'Un autre club', bonus: 55 }
        ]
      },
      {
        id: 'heure',
        titre: "À quelle heure tombe l'officialisation ?",
        options: [
          { label: 'Avant 14 h', bonus: 9 },
          { label: 'Entre 14 h et 19 h', bonus: 7 },
          { label: 'Après 19 h', bonus: 11 }
        ]
      },
      {
        id: 'montant',
        titre: 'Pour quel montant ?',
        options: [
          { label: 'Moins de 45 M€', bonus: 14 },
          { label: '45 à 55 M€', bonus: 6 },
          { label: 'Plus de 55 M€', bonus: 20 }
        ]
      },
      {
        id: 'formule',
        titre: 'Sous quelle forme ?',
        options: [
          { label: 'Transfert sec', bonus: 4 },
          { label: 'Prêt avec option', bonus: 26 }
        ]
      }
    ]
  },
  {
    id: 'rodri-barca',
    photo: 'assets/img/joueurs/rodri.jpg',
    joueur: 'Rodri',
    initiales: 'RH',
    poste: 'Milieu défensif',
    age: 29,
    nationalite: '🇪🇸',
    clubActuel: { nom: 'Manchester City', couleur: '#6CABDD', ecusson: 'assets/img/clubs/manchester-city.png' },
    clubCible: { nom: 'FC Barcelone', couleur: '#A50044', ecusson: 'assets/img/clubs/barcelone.png' },
    montant: '50 M€',
    fiabilite: 85,
    chaud: true,
    competition: 'Liga',
    source: 'Cadena SER',
    tempsSource: 'il y a 1 h',
    titre: 'Rodri au Barça : accord bouclé avec Manchester City',
    chapo:
      "Le Barça et Manchester City ont trouvé un accord autour de 50 M€ pour le Ballon d'Or 2024. Rodri a écarté les avances du Real Madrid et n'a jamais caché sa préférence pour la Catalogne. Son arrivée est attendue ce 12 août, en même temps que le retour des internationaux espagnols du Mondial. La rupture du ligament collatéral médial du genou droit de Frenkie de Jong a fini d'accélérer le dossier.",
    gainBase: 5,
    boosters: [
      {
        id: 'club',
        titre: 'Dans quel club signe-t-il ?',
        options: [
          { label: 'FC Barcelone', bonus: 3 },
          { label: 'Real Madrid', bonus: 50 },
          { label: 'Un autre club', bonus: 65 }
        ]
      },
      {
        id: 'heure',
        titre: "À quelle heure tombe l'officialisation ?",
        options: [
          { label: 'Avant 14 h', bonus: 8 },
          { label: 'Entre 14 h et 19 h', bonus: 7 },
          { label: 'Après 19 h', bonus: 12 }
        ]
      },
      {
        id: 'montant',
        titre: 'Pour quel montant ?',
        options: [
          { label: 'Moins de 50 M€', bonus: 12 },
          { label: '50 à 60 M€', bonus: 6 },
          { label: 'Plus de 60 M€', bonus: 22 }
        ]
      }
    ]
  },
  {
    id: 'bouaddi-city',
    photo: 'assets/img/joueurs/bouaddi.jpg',
    joueur: 'Ayyoub Bouaddi',
    initiales: 'AB',
    poste: 'Milieu',
    age: 18,
    nationalite: '🇲🇦',
    clubActuel: { nom: 'LOSC Lille', couleur: '#E01E13', ecusson: 'assets/img/clubs/lille.png' },
    clubCible: { nom: 'Manchester City', couleur: '#6CABDD', ecusson: 'assets/img/clubs/manchester-city.png' },
    montant: '100 M€',
    fiabilite: 72,
    chaud: true,
    competition: 'Premier League',
    source: 'Fabrizio Romano',
    tempsSource: 'il y a 25 min',
    titre: 'Bouaddi–City : les clubs finalisent les derniers détails',
    chapo:
      "Ayyoub Bouaddi a accepté un contrat courant jusqu'en juin 2031 et a reçu le feu vert pour rejoindre l'Angleterre. Lille et Manchester City règlent les derniers détails financiers d'un accord jugé imminent, pour un chèque attendu autour de 100 M€. Formé au LOSC, déjà 96 matches avec le club et révélation du parcours marocain jusqu'en quarts de finale du Mondial, le milieu de 18 ans est appelé à préparer l'après-Rodri.",
    gainBase: 8,
    boosters: [
      {
        id: 'club',
        titre: 'Dans quel club signe-t-il ?',
        options: [
          { label: 'Manchester City', bonus: 4 },
          { label: 'Chelsea', bonus: 45 },
          { label: 'Un autre club', bonus: 60 }
        ]
      },
      {
        id: 'heure',
        titre: "À quelle heure tombe l'officialisation ?",
        options: [
          { label: 'Avant 14 h', bonus: 11 },
          { label: 'Entre 14 h et 19 h', bonus: 9 },
          { label: 'Après 19 h', bonus: 14 }
        ]
      },
      {
        id: 'montant',
        titre: 'Pour quel montant ?',
        options: [
          { label: 'Moins de 90 M€', bonus: 18 },
          { label: '90 à 110 M€', bonus: 7 },
          { label: 'Plus de 110 M€', bonus: 24 }
        ]
      }
    ]
  },
  {
    id: 'barcola-liverpool',
    photo: 'assets/img/joueurs/barcola.jpg',
    joueur: 'Bradley Barcola',
    initiales: 'BB',
    poste: 'Ailier',
    age: 23,
    nationalite: '🇫🇷',
    clubActuel: { nom: 'Paris SG', couleur: '#004170', ecusson: 'assets/img/clubs/psg.png' },
    clubCible: { nom: 'Liverpool', couleur: '#C8102E', ecusson: 'assets/img/clubs/liverpool.png' },
    montant: '150 M€',
    fiabilite: 28,
    chaud: false,
    competition: 'Premier League',
    source: 'The Athletic',
    tempsSource: 'il y a 3 h',
    titre: 'Barcola : Liverpool monte à 115 M€, le PSG en réclame 150',
    chapo:
      "Les discussions sont décrites comme positives, mais l'écart de valorisation reste béant : après une première offre autour de 100 M€, Liverpool est monté à 115 M€ quand Paris n'entend pas descendre sous les 150 M€. Barcola a signalé son envie d'ailleurs après deux Ligues des champions consécutives et Luis Enrique se dit prêt à le laisser partir — le PSG travaille déjà sur son remplaçant.",
    gainBase: 20,
    boosters: [
      {
        id: 'club',
        titre: 'Dans quel club signe-t-il ?',
        options: [
          { label: 'Liverpool', bonus: 12 },
          { label: 'Bayern Munich', bonus: 45 },
          { label: 'Un autre club', bonus: 55 }
        ]
      },
      {
        id: 'heure',
        titre: "À quelle heure tombe l'officialisation ?",
        options: [
          { label: 'Avant 14 h', bonus: 25 },
          { label: 'Entre 14 h et 19 h', bonus: 22 },
          { label: 'Après 19 h', bonus: 28 }
        ]
      },
      {
        id: 'montant',
        titre: 'Pour quel montant ?',
        options: [
          { label: 'Moins de 130 M€', bonus: 26 },
          { label: '130 à 155 M€', bonus: 16 },
          { label: 'Plus de 155 M€', bonus: 34 }
        ]
      }
    ]
  },
  {
    id: 'alvarez-barca',
    photo: 'assets/img/joueurs/alvarez.jpg',
    joueur: 'Julián Álvarez',
    initiales: 'JA',
    poste: 'Attaquant',
    age: 25,
    nationalite: '🇦🇷',
    clubActuel: { nom: 'Atlético Madrid', couleur: '#CE3524', ecusson: 'assets/img/clubs/atletico.png' },
    clubCible: { nom: 'FC Barcelone', couleur: '#A50044', ecusson: 'assets/img/clubs/barcelone.png' },
    montant: '120 M€',
    fiabilite: 12,
    chaud: false,
    competition: 'Liga',
    source: 'Mundo Deportivo',
    tempsSource: 'il y a 2 h',
    titre: "Álvarez au Barça : le dossier s'enlise",
    chapo:
      "Álvarez a pourtant déclaré publiquement son envie de quitter l'Atlético pour le Barça, club de son cœur. Mais les Colchoneros refusent fermement de vendre leur attaquant, et surtout pas aux Catalans : les offres blaugrana ont beau être montées jusqu'à environ 120 M€, le 1er août est passé sans accord. En interne, Gavi et Pedri, proches de Ferran Torres, ne verraient pas cette arrivée d'un très bon œil.",
    gainBase: 40,
    boosters: [
      {
        id: 'club',
        titre: 'Dans quel club signe-t-il ?',
        options: [
          { label: 'FC Barcelone', bonus: 30 },
          { label: 'Chelsea', bonus: 55 },
          { label: 'Un autre club', bonus: 70 }
        ]
      },
      {
        id: 'heure',
        titre: "À quelle heure tombe l'officialisation ?",
        options: [
          { label: 'Avant 14 h', bonus: 50 },
          { label: 'Entre 14 h et 19 h', bonus: 45 },
          { label: 'Après 19 h', bonus: 55 }
        ]
      },
      {
        id: 'montant',
        titre: 'Pour quel montant ?',
        options: [
          { label: 'Moins de 110 M€', bonus: 55 },
          { label: '110 à 130 M€', bonus: 45 },
          { label: 'Plus de 130 M€', bonus: 70 }
        ]
      }
    ]
  }
];

/** Historique des derniers jours, pour la série affichée en une. */
window.MERCATODDS_HISTORIQUE = [
  { jour: 'Ven', gagne: true,  libelle: 'Wirtz à Leverkusen' },
  { jour: 'Sam', gagne: true,  libelle: 'Olise au Bayern' },
  { jour: 'Dim', gagne: false, libelle: 'Zaïre-Emery à Madrid' },
  { jour: 'Lun', gagne: true,  libelle: 'Gyökeres à Arsenal' },
  { jour: 'Mar', gagne: true,  libelle: 'Simons à Chelsea' }
];
