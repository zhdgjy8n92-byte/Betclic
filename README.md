# Betclic Mercat'odds

Site de démonstration bâti autour d'un **guess quotidien** sur le mercato.
Chaque jour, le joueur désigne le transfert qu'il pense voir officialisé dans la
journée. Si ça tombe, il empoche des **freebets**. Il peut gonfler la cagnotte en
ouvrant la rumeur et en ajoutant des sélections complémentaires.

## La mécanique

1. **Un guess par jour.** Le fil présente les rumeurs du jour. Le bouton jaune
   `5 €` valide directement le guess : « ce transfert est officialisé
   aujourd'hui ».
2. **Booster la cagnotte.** Ouvrir une rumeur donne accès à des sélections
   additionnelles — club d'arrivée, tranche horaire de l'officialisation,
   tranche de montant, forme du transfert. Chaque option affiche ce qu'elle
   rapporte en plus (`+7 €`, `+14 €`…) et le total se recalcule en direct.
3. **Tout ou rien.** Les sélections ajoutées doivent toutes être justes pour que
   la cagnotte soit payée.
4. **Verrouillage.** Une fois le guess validé, les autres rumeurs passent en
   grisé : un seul guess par jour. Le guess reste modifiable ou annulable
   jusqu'à minuit.
5. **Série.** Les losanges sous le titre rappellent les résultats des derniers
   jours, dans l'esprit des indicateurs de forme de l'app.

Aucune cote n'est affichée nulle part : tout est exprimé en euros de freebets.

## Lancer le site

Aucune dépendance, aucun build.

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

Le site fonctionne aussi en ouvrant directement `index.html` (les données sont
chargées via un script, pas via `fetch`).

## Structure

```
index.html            coquille de la page
css/style.css         DA Betclic (tokens, logo, cartes, fiche, boosters)
js/app.js             fil, fiche rumeur, guess du jour, ticket, compte à rebours
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
| Titres | Betclic Condensed Bold, en capitales |
| Textes | Betclic Regular / Bold |

Le logo de l'opération est reconstitué en CSS (`.oplogo`) : pavé rouge
« Betclic » surmontant le mot MERCAT'ODDS en blanc à contour rouge. Deux
variantes partagent la même mécanique, `--logo-size` et `--logo-stroke` pilotant
la taille et l'épaisseur du contour :

- `.oplogo--stack` : lock-up vertical, utilisé en une ;
- `.oplogo--inline` : version compacte horizontale, utilisée dans le header.

Pour passer au fichier source du logo, remplacer les deux blocs `.oplogo` par une
balise `<img>` — aucun autre style n'en dépend.

## Ajouter une rumeur

Ajouter une entrée dans `data/rumeurs.js` :

```js
{
  id: 'identifiant-unique',
  joueur: 'Nom du joueur',
  clubActuel: { nom: '…', couleur: '#…' },   // couleur = dégradé du bandeau
  clubCible:  { nom: '…', couleur: '#…' },
  fiabilite: 70,                              // jauge, en %
  gainBase: 5,                                // freebets du guess seul
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
