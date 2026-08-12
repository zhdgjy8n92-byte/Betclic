/**
 * Base de données des rumeurs du Mercat'odds.
 *
 * Les cotes (`cote`) ne sont jamais affichées sur les boutons : conformément au
 * principe du Mercat'odds, chaque bouton affiche la mise fixe de 5 €. Les cotes
 * servent uniquement au calcul du gain potentiel dans le MyCombi.
 */
window.MERCATODDS_RUMEURS = [
  {
    id: 'alvarez-barca',
    joueur: 'Julián Álvarez',
    prenom: 'Julián',
    nom: 'Álvarez',
    initiales: 'JA',
    poste: 'Attaquant',
    age: 25,
    nationalite: '🇦🇷',
    clubActuel: { nom: 'Atlético Madrid', code: 'ATM', couleur: '#CE3524' },
    clubCible: { nom: 'FC Barcelone', code: 'BAR', couleur: '#A50044' },
    montant: '85 M€',
    fiabilite: 78,
    chaud: true,
    tag: 'EarlyWin',
    competition: 'Liga',
    deadline: '2026-09-01T22:00:00',
    source: 'Mundo Deportivo',
    tempsSource: 'il y a 2 h',
    titre: "Le Barça accélère pour Julián Álvarez",
    chapo:
      "Deux ans après son arrivée à Madrid, Julián Álvarez serait la priorité offensive du FC Barcelone. Les dirigeants catalans ont transmis une première offre de 75 M€, jugée insuffisante par l'Atlético qui réclame 90 M€. L'Argentin, lui, aurait déjà donné son accord de principe pour un contrat de cinq ans.",
    marches: [
      {
        titre: "Álvarez signe au FC Barcelone d'ici la fin du mercato",
        type: 'principal',
        picks: [
          { label: 'Oui', cote: 2.15, part: 62 },
          { label: 'Non', cote: 1.62, part: 38 }
        ]
      },
      {
        titre: "Club d'Álvarez au 2 septembre",
        type: 'standard',
        picks: [
          { label: 'FC Barcelone', cote: 2.15, part: 55 },
          { label: 'Atlético', cote: 1.80, part: 33 },
          { label: 'Autre club', cote: 7.50, part: 12 }
        ]
      },
      {
        titre: 'Montant du transfert supérieur à 80 M€',
        type: 'xtrawin',
        badge: 'XTRAWIN',
        picks: [
          { label: 'Oui', cote: 1.95, part: 58 },
          { label: 'Non', cote: 1.75, part: 42 }
        ]
      }
    ],
    combi: {
      lignes: [
        { titre: 'Oui', sous: 'Álvarez signe au Barça' },
        { titre: 'Plus de 80 M€', sous: 'Montant du transfert' }
      ],
      cote: 4.19
    }
  },
  {
    id: 'rodri-barca',
    joueur: 'Rodri',
    prenom: 'Rodri',
    nom: 'Hernández',
    initiales: 'RH',
    poste: 'Milieu défensif',
    age: 29,
    nationalite: '🇪🇸',
    clubActuel: { nom: 'Manchester City', code: 'MCI', couleur: '#6CABDD' },
    clubCible: { nom: 'FC Barcelone', code: 'BAR', couleur: '#A50044' },
    montant: '70 M€',
    fiabilite: 41,
    chaud: false,
    tag: null,
    competition: 'Premier League',
    deadline: '2026-09-01T22:00:00',
    source: 'SPORT',
    tempsSource: 'il y a 6 h',
    titre: 'Rodri, le rêve impossible du Barça ?',
    chapo:
      "Le Ballon d'Or 2024 aurait fait savoir à son entourage qu'un retour en Espagne l'intéresse. Le FC Barcelone a coché son nom, mais Manchester City refuse catégoriquement d'ouvrir la discussion à moins de 100 M€. Un dossier au point mort, que la Cadena SER décrit pourtant comme « loin d'être clos ».",
    marches: [
      {
        titre: 'Rodri quitte Manchester City cet été',
        type: 'principal',
        picks: [
          { label: 'Oui', cote: 4.40, part: 27 },
          { label: 'Non', cote: 1.20, part: 73 }
        ]
      },
      {
        titre: 'Une offre officielle du Barça est déposée',
        type: 'standard',
        picks: [
          { label: 'Oui', cote: 2.60, part: 44 },
          { label: 'Non', cote: 1.45, part: 56 }
        ]
      }
    ],
    combi: {
      lignes: [
        { titre: 'Non', sous: 'Rodri quitte City' },
        { titre: 'Oui', sous: 'Offre officielle déposée' }
      ],
      cote: 3.12
    }
  },
  {
    id: 'ferran-psg',
    joueur: 'Ferran Torres',
    prenom: 'Ferran',
    nom: 'Torres',
    initiales: 'FT',
    poste: 'Attaquant',
    age: 26,
    nationalite: '🇪🇸',
    clubActuel: { nom: 'FC Barcelone', code: 'BAR', couleur: '#A50044' },
    clubCible: { nom: 'Paris SG', code: 'PSG', couleur: '#004170' },
    montant: '45 M€',
    fiabilite: 66,
    chaud: true,
    tag: 'EarlyWin',
    competition: 'Ligue 1',
    deadline: '2026-09-01T22:00:00',
    source: "L'Équipe",
    tempsSource: 'il y a 1 h',
    titre: 'Le PSG passe à l’offensive sur Ferran Torres',
    chapo:
      "Poussé vers la sortie par l'arrivée d'un nouvel avant-centre, Ferran Torres est la cible désignée de Luis Enrique, qui l'a déjà eu en sélection. Paris a formulé une offre de 40 M€ plus bonus. Le Barça, qui doit dégraisser sa masse salariale avant le 31 août, se montrerait ouvert à la négociation.",
    marches: [
      {
        titre: 'Ferran Torres signe au Paris SG',
        type: 'principal',
        picks: [
          { label: 'Oui', cote: 1.67, part: 71 },
          { label: 'Non', cote: 2.05, part: 29 }
        ]
      },
      {
        titre: "Ferran Torres est présenté avant le 25 août",
        type: 'earlywin',
        badge: 'EarlyWin',
        picks: [
          { label: 'Oui', cote: 2.40, part: 48 },
          { label: 'Non', cote: 1.50, part: 52 }
        ]
      },
      {
        titre: 'Type de transfert',
        type: 'standard',
        picks: [
          { label: 'Transfert sec', cote: 1.85, part: 57 },
          { label: 'Prêt + option', cote: 3.30, part: 31 },
          { label: 'Échange', cote: 9.00, part: 12 }
        ]
      }
    ],
    combi: {
      lignes: [
        { titre: 'Oui', sous: 'Ferran Torres au PSG' },
        { titre: 'Transfert sec', sous: 'Type de transfert' }
      ],
      cote: 2.13
    }
  },
  {
    id: 'barcola-liverpool',
    joueur: 'Bradley Barcola',
    prenom: 'Bradley',
    nom: 'Barcola',
    initiales: 'BB',
    poste: 'Ailier',
    age: 23,
    nationalite: '🇫🇷',
    clubActuel: { nom: 'Paris SG', code: 'PSG', couleur: '#004170' },
    clubCible: { nom: 'Liverpool', code: 'LIV', couleur: '#C8102E' },
    montant: '90 M€',
    fiabilite: 54,
    chaud: true,
    tag: null,
    competition: 'Premier League',
    deadline: '2026-09-01T22:00:00',
    source: 'The Athletic',
    tempsSource: 'il y a 4 h',
    titre: "Liverpool a fait de Barcola sa priorité",
    chapo:
      "Arne Slot cherche un ailier gauche capable de jouer dans le dos des défenses : Bradley Barcola coche toutes les cases. Liverpool aurait pris la température auprès du PSG, qui n'entend pas brader un joueur sous contrat jusqu'en 2028 et réclame 90 M€. Le Français n'a pour l'instant pas manifesté d'envie de départ.",
    marches: [
      {
        titre: 'Barcola quitte le Paris SG cet été',
        type: 'principal',
        picks: [
          { label: 'Oui', cote: 3.10, part: 38 },
          { label: 'Non', cote: 1.33, part: 62 }
        ]
      },
      {
        titre: 'Championnat de Barcola en septembre',
        type: 'standard',
        picks: [
          { label: 'Ligue 1', cote: 1.33, part: 61 },
          { label: 'Premier League', cote: 3.40, part: 32 },
          { label: 'Autre', cote: 12.00, part: 7 }
        ]
      }
    ],
    combi: {
      lignes: [
        { titre: 'Oui', sous: 'Barcola quitte le PSG' },
        { titre: 'Premier League', sous: 'Championnat en septembre' }
      ],
      cote: 3.85
    }
  },
  {
    id: 'bouaddi-city',
    joueur: 'Ayyoub Bouaddi',
    prenom: 'Ayyoub',
    nom: 'Bouaddi',
    initiales: 'AB',
    poste: 'Milieu',
    age: 18,
    nationalite: '🇫🇷',
    clubActuel: { nom: 'LOSC Lille', code: 'LIL', couleur: '#E01E13' },
    clubCible: { nom: 'Manchester City', code: 'MCI', couleur: '#6CABDD' },
    montant: '35 M€',
    fiabilite: 84,
    chaud: true,
    tag: 'XTRAWIN',
    competition: 'Premier League',
    deadline: '2026-09-01T22:00:00',
    source: 'Fabrizio Romano',
    tempsSource: 'il y a 25 min',
    titre: 'Bouaddi–City : les négociations sont entrées dans le dur',
    chapo:
      "Manchester City a bouclé un accord de principe avec le clan Bouaddi et négocie désormais avec le LOSC. Les Cityzens sont montés à 30 M€ plus 5 M€ de bonus, Lille en demande 40. Pep Guardiola en a fait sa priorité au milieu et le dossier pourrait se conclure dans les prochaines 72 heures.",
    marches: [
      {
        titre: 'Bouaddi signe à Manchester City',
        type: 'principal',
        picks: [
          { label: 'Oui', cote: 1.36, part: 81 },
          { label: 'Non', cote: 3.80, part: 19 }
        ]
      },
      {
        titre: 'Transfert bouclé avant le 20 août',
        type: 'earlywin',
        badge: 'EarlyWin',
        picks: [
          { label: 'Oui', cote: 1.90, part: 64 },
          { label: 'Non', cote: 1.80, part: 36 }
        ]
      },
      {
        titre: 'Montant final du transfert',
        type: 'xtrawin',
        badge: 'XTRAWIN',
        picks: [
          { label: 'Moins de 35 M€', cote: 2.20, part: 45 },
          { label: '35 à 45 M€', cote: 2.10, part: 42 },
          { label: 'Plus de 45 M€', cote: 6.50, part: 13 }
        ]
      }
    ],
    combi: {
      lignes: [
        { titre: 'Oui', sous: 'Bouaddi à Manchester City' },
        { titre: 'Avant le 20 août', sous: 'Transfert bouclé' }
      ],
      cote: 2.58
    }
  }
];
