/**
 * Base de données du Mercat'odds.
 *
 * Mécanique : un seul guess par jour. Le joueur désigne le transfert qu'il
 * pense voir officialisé dans la journée et empoche `gainBase` en freebets si
 * ça tombe. Il peut gonfler cette cagnotte en ajoutant des sélections
 * complémentaires (club d'arrivée, heure d'officialisation, montant…), chacune
 * valant le `bonus` en freebets indiqué sur la puce.
 *
 * Aucune cote n'est affichée nulle part : tout est exprimé en euros de freebets.
 */
window.MERCATODDS_RUMEURS = [
  {
    id: 'alvarez-barca',
    joueur: 'Julián Álvarez',
    initiales: 'JA',
    poste: 'Attaquant',
    age: 25,
    nationalite: '🇦🇷',
    clubActuel: { nom: 'Atlético Madrid', couleur: '#CE3524' },
    clubCible: { nom: 'FC Barcelone', couleur: '#A50044' },
    montant: '85 M€',
    fiabilite: 78,
    chaud: true,
    competition: 'Liga',
    source: 'Mundo Deportivo',
    tempsSource: 'il y a 2 h',
    titre: "Le Barça accélère pour Julián Álvarez",
    chapo:
      "Deux ans après son arrivée à Madrid, Julián Álvarez serait la priorité offensive du FC Barcelone. Les dirigeants catalans ont transmis une première offre de 75 M€, jugée insuffisante par l'Atlético qui réclame 90 M€. L'Argentin, lui, aurait déjà donné son accord de principe pour un contrat de cinq ans. Les deux clubs se sont parlé hier soir et une nouvelle réunion est calée dans la journée.",
    gainBase: 5,
    boosters: [
      {
        id: 'club',
        titre: "Dans quel club signe-t-il ?",
        options: [
          { label: 'FC Barcelone', bonus: 8 },
          { label: 'Chelsea', bonus: 25 },
          { label: 'Un autre club', bonus: 40 }
        ]
      },
      {
        id: 'heure',
        titre: "À quelle heure tombe l'officialisation ?",
        options: [
          { label: 'Avant 14 h', bonus: 12 },
          { label: 'Entre 14 h et 19 h', bonus: 10 },
          { label: 'Après 19 h', bonus: 15 }
        ]
      },
      {
        id: 'montant',
        titre: 'Pour quel montant ?',
        options: [
          { label: 'Moins de 75 M€', bonus: 15 },
          { label: '75 à 90 M€', bonus: 10 },
          { label: 'Plus de 90 M€', bonus: 22 }
        ]
      }
    ]
  },
  {
    id: 'rodri-barca',
    joueur: 'Rodri',
    initiales: 'RH',
    poste: 'Milieu défensif',
    age: 29,
    nationalite: '🇪🇸',
    clubActuel: { nom: 'Manchester City', couleur: '#6CABDD' },
    clubCible: { nom: 'FC Barcelone', couleur: '#A50044' },
    montant: '70 M€',
    fiabilite: 41,
    chaud: false,
    competition: 'Premier League',
    source: 'SPORT',
    tempsSource: 'il y a 6 h',
    titre: 'Rodri, le rêve impossible du Barça ?',
    chapo:
      "Le Ballon d'Or 2024 aurait fait savoir à son entourage qu'un retour en Espagne l'intéresse. Le FC Barcelone a coché son nom, mais Manchester City refuse catégoriquement d'ouvrir la discussion à moins de 100 M€. Un dossier au point mort, que la Cadena SER décrit pourtant comme « loin d'être clos ».",
    gainBase: 5,
    boosters: [
      {
        id: 'club',
        titre: "Dans quel club signe-t-il ?",
        options: [
          { label: 'FC Barcelone', bonus: 20 },
          { label: 'Real Madrid', bonus: 45 },
          { label: 'Un autre club', bonus: 60 }
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
          { label: 'Moins de 80 M€', bonus: 30 },
          { label: '80 à 100 M€', bonus: 20 },
          { label: 'Plus de 100 M€', bonus: 35 }
        ]
      }
    ]
  },
  {
    id: 'ferran-psg',
    joueur: 'Ferran Torres',
    initiales: 'FT',
    poste: 'Attaquant',
    age: 26,
    nationalite: '🇪🇸',
    clubActuel: { nom: 'FC Barcelone', couleur: '#A50044' },
    clubCible: { nom: 'Paris SG', couleur: '#004170' },
    montant: '45 M€',
    fiabilite: 66,
    chaud: true,
    competition: 'Ligue 1',
    source: "L'Équipe",
    tempsSource: 'il y a 1 h',
    titre: 'Le PSG passe à l’offensive sur Ferran Torres',
    chapo:
      "Poussé vers la sortie par l'arrivée d'un nouvel avant-centre, Ferran Torres est la cible désignée de Luis Enrique, qui l'a déjà eu en sélection. Paris a formulé une offre de 40 M€ plus bonus. Le Barça, qui doit dégraisser sa masse salariale avant le 31 août, se montrerait ouvert à la négociation. L'entourage du joueur est attendu à Paris ce matin.",
    gainBase: 5,
    boosters: [
      {
        id: 'club',
        titre: "Dans quel club signe-t-il ?",
        options: [
          { label: 'Paris SG', bonus: 7 },
          { label: 'Aston Villa', bonus: 30 },
          { label: 'Un autre club', bonus: 45 }
        ]
      },
      {
        id: 'heure',
        titre: "À quelle heure tombe l'officialisation ?",
        options: [
          { label: 'Avant 14 h', bonus: 14 },
          { label: 'Entre 14 h et 19 h', bonus: 11 },
          { label: 'Après 19 h', bonus: 16 }
        ]
      },
      {
        id: 'montant',
        titre: 'Pour quel montant ?',
        options: [
          { label: 'Moins de 40 M€', bonus: 16 },
          { label: '40 à 50 M€', bonus: 9 },
          { label: 'Plus de 50 M€', bonus: 24 }
        ]
      },
      {
        id: 'formule',
        titre: 'Sous quelle forme ?',
        options: [
          { label: 'Transfert sec', bonus: 8 },
          { label: 'Prêt avec option', bonus: 18 }
        ]
      }
    ]
  },
  {
    id: 'barcola-liverpool',
    joueur: 'Bradley Barcola',
    initiales: 'BB',
    poste: 'Ailier',
    age: 23,
    nationalite: '🇫🇷',
    clubActuel: { nom: 'Paris SG', couleur: '#004170' },
    clubCible: { nom: 'Liverpool', couleur: '#C8102E' },
    montant: '90 M€',
    fiabilite: 54,
    chaud: true,
    competition: 'Premier League',
    source: 'The Athletic',
    tempsSource: 'il y a 4 h',
    titre: "Liverpool a fait de Barcola sa priorité",
    chapo:
      "Arne Slot cherche un ailier gauche capable de jouer dans le dos des défenses : Bradley Barcola coche toutes les cases. Liverpool aurait pris la température auprès du PSG, qui n'entend pas brader un joueur sous contrat jusqu'en 2028 et réclame 90 M€. Le Français n'a pour l'instant pas manifesté d'envie de départ.",
    gainBase: 5,
    boosters: [
      {
        id: 'club',
        titre: "Dans quel club signe-t-il ?",
        options: [
          { label: 'Liverpool', bonus: 14 },
          { label: 'Bayern Munich', bonus: 35 },
          { label: 'Un autre club', bonus: 50 }
        ]
      },
      {
        id: 'heure',
        titre: "À quelle heure tombe l'officialisation ?",
        options: [
          { label: 'Avant 14 h', bonus: 20 },
          { label: 'Entre 14 h et 19 h', bonus: 17 },
          { label: 'Après 19 h', bonus: 21 }
        ]
      },
      {
        id: 'montant',
        titre: 'Pour quel montant ?',
        options: [
          { label: 'Moins de 85 M€', bonus: 22 },
          { label: '85 à 100 M€', bonus: 14 },
          { label: 'Plus de 100 M€', bonus: 30 }
        ]
      }
    ]
  },
  {
    id: 'bouaddi-city',
    joueur: 'Ayyoub Bouaddi',
    initiales: 'AB',
    poste: 'Milieu',
    age: 18,
    nationalite: '🇫🇷',
    clubActuel: { nom: 'LOSC Lille', couleur: '#E01E13' },
    clubCible: { nom: 'Manchester City', couleur: '#6CABDD' },
    montant: '35 M€',
    fiabilite: 84,
    chaud: true,
    competition: 'Premier League',
    source: 'Fabrizio Romano',
    tempsSource: 'il y a 25 min',
    titre: 'Bouaddi–City : les négociations sont entrées dans le dur',
    chapo:
      "Manchester City a bouclé un accord de principe avec le clan Bouaddi et négocie désormais avec le LOSC. Les Cityzens sont montés à 30 M€ plus 5 M€ de bonus, Lille en demande 40. Pep Guardiola en a fait sa priorité au milieu et le dossier pourrait se conclure dans la journée : la visite médicale serait déjà programmée.",
    gainBase: 5,
    boosters: [
      {
        id: 'club',
        titre: "Dans quel club signe-t-il ?",
        options: [
          { label: 'Manchester City', bonus: 6 },
          { label: 'Chelsea', bonus: 28 },
          { label: 'Un autre club', bonus: 42 }
        ]
      },
      {
        id: 'heure',
        titre: "À quelle heure tombe l'officialisation ?",
        options: [
          { label: 'Avant 14 h', bonus: 10 },
          { label: 'Entre 14 h et 19 h', bonus: 8 },
          { label: 'Après 19 h', bonus: 13 }
        ]
      },
      {
        id: 'montant',
        titre: 'Pour quel montant ?',
        options: [
          { label: 'Moins de 35 M€', bonus: 12 },
          { label: '35 à 45 M€', bonus: 9 },
          { label: 'Plus de 45 M€', bonus: 26 }
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
