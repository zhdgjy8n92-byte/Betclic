# Betclic Mercat'odds

Site de démonstration bâti autour d'un **prono quotidien** sur le mercato.
Chaque jour, le joueur désigne le transfert qu'il pense voir officialisé dans la
journée. Si ça tombe, il empoche des **feebets**. Il peut gonfler la cagnotte en
ouvrant la rumeur et en ajoutant des sélections complémentaires.

## La mécanique

1. **Un prono par jour.** Le fil présente les rumeurs du jour, classées par
   fiabilité décroissante. Le bouton jaune porte le gain du prono seul.
2. **Confirmation.** Ce bouton ne valide pas d'emblée : une modale demande si le
   joueur confirme en l'état ou s'il préfère enrichir son prono.
3. **Booster la cagnotte.** La fiche de la rumeur donne accès aux sélections
   additionnelles — club d'arrivée, tranche horaire de l'officialisation,
   tranche de montant, forme du transfert. Chaque option affiche ce qu'elle
   rapporte en plus (`+7 €`, `+14 €`…) et le total se recalcule en direct.
4. **Tout ou rien.** Les sélections ajoutées doivent toutes être justes pour que
   la cagnotte soit payée.
5. **Verrouillage.** Une fois le prono validé, les autres rumeurs passent en
   grisé : un seul prono par jour. Le prono reste modifiable ou annulable
   jusqu'à minuit.
6. **Série.** Les losanges sous le titre rappellent les résultats des derniers
   jours, dans l'esprit des indicateurs de forme de l'app.

Aucune cote n'est affichée nulle part : tout est exprimé en euros de feebets.
Le joueur est tutoyé partout.

## Cohérence des montants

Le gain est l'inverse de la probabilité, à deux niveaux : le `gainBase` de la
rumeur, et le `bonus` de chaque option de booster. Un dossier bouclé rapporte
peu, un dossier enlisé rapporte gros ; dans un groupe de sélections, l'issue
attendue vaut quelques euros et l'issue improbable plusieurs dizaines.

Les fiabilités reflètent l'état réel des dossiers au 12 août 2026 :

| Rumeur | Statut | Fiabilité | Prono seul |
|---|---|---|---|
| Ferran Torres → PSG | Accord imminent, joueur d'accord, ~50 M€ | 88 % | 5 € |
| Rodri → Barça | Accord bouclé à 50 M€, arrivée attendue le 12 | 85 % | 5 € |
| Bouaddi → Man City | Contrat perso jusqu'en 2031, détails financiers en cours | 72 % | 8 € |
| Barcola → Liverpool | Liverpool à 115 M€, le PSG en réclame 150 | 28 % | 20 € |
| Álvarez → Barça | L'Atlético refuse de vendre, dossier enlisé | 12 % | 40 € |

Sources : [Goal](https://www.goal.com/en/news/setting-his-arrival-date-barcelona-seal-rodri-deal/bltb4b47bccbfab0a80) et
[Foot Mercato](https://www.footmercato.net/a5796867186227462159-fc-barcelone-immense-coup-de-froid-pour-le-transfert-de-rodri) (Rodri),
[CulturePSG](https://www.culturepsg.com/news/mercato/le-transfert-de-ferran-torres-au-psg-regle-avant-le-12-aout/60241) et
[Foot Mercato](https://www.footmercato.net/a760401614473913167-mercato-ferran-torres-a-donne-son-accord-pour-rejoindre-le-psg) (Ferran Torres),
[Get French Football News](https://www.getfootballnewsfrance.com/2026/lille-and-manchester-city-poised-to-finalize-agreement-over-ayyoub-bouaddi-transfer/) et
[Sky Sports](https://www.skysports.com/football/news/11679/13571912/ayyoub-bouaddi-transfer-why-do-man-city-want-to-spend-big-on-another-midfielder-after-signing-elliot-anderson) (Bouaddi),
[CulturePSG](https://www.culturepsg.com/news/mercato/liverpool-avance-de-15-m-pour-barcola/60264) et
[Eurosport](https://www.eurosport.fr/football/transferts/2026-2027/mercato-i-150-millions-pour-bradley-barcola-psg-convoite-par-liverpool-est-ce-vraiment-delirant_sto23325898/story.shtml) (Barcola),
[Goal](https://www.goal.com/en/news/alvarez-deal-enters-a-dark-tunnel-between-barcelona-and-atletico-madrid/bltf23932a2e5b6c3a1) et
[Foot Mercato](https://www.footmercato.net/a8628089489864311937-le-fc-barcelone-perd-tout-espoir-dans-le-dossier-julian-alvarez) (Álvarez).

## Lancer le site

Aucune dépendance, aucun build.

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

Le site fonctionne aussi en ouvrant directement `index.html` (les données sont
chargées via un script, pas via `fetch`).

## Mettre en ligne

### Fichier autonome (le plus simple)

```bash
python3 tools/build-standalone.py
# → dist/mercatodds.html, ~1 Mo, polices et images embarquées
```

Le fichier obtenu ne fait aucune requête réseau. Il s'ouvre directement depuis
le disque, et se dépose tel quel sur n'importe quel hébergeur statique :
glissez-le sur [Netlify Drop](https://app.netlify.com/drop) pour obtenir une URL
publique en quelques secondes, sans compte ni ligne de commande.

### Protection par mot de passe

```bash
pip install pycryptodome
python3 tools/build-protected.py 'le-mot-de-passe'
# → public/index.html
```

Le contenu n'est pas masqué, il est **chiffré** : AES-256-GCM, clé dérivée du
mot de passe par PBKDF2-HMAC-SHA256 sur 250 000 itérations. La page publiée ne
contient que le chiffré, le sel et l'IV — sans le mot de passe, le site n'est
pas récupérable depuis le code source. Le script échoue si un témoin du contenu
en clair se retrouve dans la sortie, et le workflow refuse de déployer dans ce
cas.

Le mot de passe n'est écrit ni dans le fichier produit, ni dans le dépôt : il se
passe en argument ou via `MERCATODDS_PASSWORD`. Pour le changer, relancer la
commande et repousser `public/index.html`.

Une session déverrouillée est mémorisée dans `sessionStorage` : le mot de passe
n'est pas redemandé à chaque visite, mais il l'est à la réouverture du
navigateur.

> **Portée réelle de la protection.** Elle ne vaut que pour le site publié. Tant
> que le dépôt est public, les sources en clair (`index.html`, `css/`, `js/`,
> `data/`) restent lisibles sur GitHub, et l'adresse du dépôt se déduit de celle
> du site. Pour que le mot de passe protège vraiment, il faut soit passer le
> dépôt en privé — ce qui coupe Pages sur un compte gratuit — soit héberger
> `public/index.html` ailleurs, par exemple sur Netlify Drop, en gardant le
> dépôt privé.

### GitHub Pages

Le workflow `.github/workflows/pages.yml` déploie la racine du dépôt à chaque
push sur la branche par défaut. Il faut l'autoriser une première fois, le jeton
d'un workflow n'ayant pas le droit de créer le site lui-même :

1. **Settings › Pages › Source** : choisir « GitHub Actions ».
2. Relancer le workflow (onglet Actions, ou un nouveau push).

À noter : Pages sur un dépôt **privé** demande un compte GitHub Pro ou Team. Sur
un compte gratuit, il faut rendre le dépôt public — et le site publié est
public dans tous les cas.

### Référencement

Le site porte une méta `noindex` et un `robots.txt` interdisant l'exploration :
il reste accessible par lien, mais ne remonte pas dans les moteurs de recherche.
C'est délibéré — la maquette porte la marque Betclic et des rumeurs fictives
attribuées à de vrais médias.

## Structure

```
index.html            coquille de la page
css/style.css         DA Betclic (tokens, logo, cartes, fiche, boosters)
js/app.js             fil, fiche rumeur, prono du jour, ticket, compte à rebours
data/rumeurs.js       rumeurs, sélections additionnelles et historique
assets/fonts/         Betclic Regular / Bold / Condensed Bold
```

## Direction artistique

Reprise de l'app Betclic à partir de la capture fournie :

| Élément | Valeur |
|---|---|
| Fond | `#0A0E1C`, cartes `#161C30` / `#1C2339` |
| Rouge Betclic | `#E30613` |
| Boutons de gain | jaune `#FFE14A`, chiffre en Condensed Bold italique |
| Jauges & validations | turquoise `#14D6A6` |
| Liquid glass | `.glass` (verre translucide) et `.glass-sheen` (reflet sur surface pleine) |
| Titres | Betclic Condensed Bold, en capitales |
| Textes | Betclic Regular / Bold |

## Logo

Le logo de l'opération est servi comme image, en deux déclinaisons :

```
assets/img/logo-mercatodds.svg          lock-up vertical, utilisé en une
assets/img/logo-mercatodds-inline.svg   version compacte, utilisée dans le header
```

Ces SVG sont générés par `tools/make-logo.py`, qui extrait les tracés des
glyphes directement des polices Betclic : le mot est donc du vrai vectoriel, sans
dépendance à une police au moment du rendu.

```bash
pip install fonttools
python3 tools/make-logo.py
```

Les proportions se règlent en tête de `build()` : `b_size` (pavé Betclic),
`m_size` (taille du mot), `stroke` (épaisseur du contour rouge) et les angles
d'inclinaison `skew_b` / `skew_m`.

Pour passer au fichier source officiel, il suffit de déposer le vôtre dans
`assets/img/` et d'ajuster les deux `src` dans `index.html` — aucun style n'en
dépend au-delà de la hauteur (`.brand__logo`) et de la largeur
(`.hero__logo-img`).

## Ajouter une rumeur

Ajouter une entrée dans `data/rumeurs.js` :

```js
{
  id: 'identifiant-unique',
  joueur: 'Nom du joueur',
  clubActuel: { nom: '…', couleur: '#…' },   // couleur = dégradé du bandeau
  clubCible:  { nom: '…', couleur: '#…' },
  fiabilite: 70,                              // jauge, en %
  gainBase: 5,                                // feebets du prono seul
  boosters: [                                 // sélections additionnelles
    { id: 'club', titre: '…', options: [{ label: '…', bonus: 8 }] }
  ]
}
```

Le `bonus` de chaque option s'ajoute au `gainBase` : c'est ce que la puce jaune
affiche. Plus l'issue est improbable, plus le bonus est élevé.

## Avertissement

Projet de démonstration. Les rumeurs, montants et gains sont **fictifs** et
n'engagent aucun club ni joueur. Les polices et la marque Betclic appartiennent
à leurs propriétaires respectifs.
