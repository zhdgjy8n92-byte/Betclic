# Betclic Mercat'odds

Site de démonstration qui référence les rumeurs du mercato et permet de parier
dessus. Le principe : **à la place des cotes jaunes de l'app Betclic, chaque
bouton affiche une mise fixe de 5 €.**

## Lancer le site

Aucune dépendance, aucun build. Un simple serveur statique suffit :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

Le site fonctionne aussi en ouvrant directement `index.html` (les données sont
chargées via un script, pas via `fetch`).

## Structure

```
index.html            coquille de la page
css/style.css         DA Betclic (tokens, cartes, boutons de mise, panier)
js/app.js             rendu du fil, filtres, panier MyCombi, compte à rebours
data/rumeurs.js       les rumeurs et leurs marchés
assets/fonts/         Betclic Regular / Bold / Condensed Bold
```

## Direction artistique

Reprise de l'app Betclic à partir de la capture fournie :

| Élément | Valeur |
|---|---|
| Fond | `#0A0E1C`, cartes `#161C30` / `#1C2339` |
| Rouge Betclic | `#E30613` |
| Boutons de mise | jaune `#FFE14A`, chiffre en Condensed Bold italique |
| Jauges | turquoise `#14D6A6` (favori) / rouge (outsider) |
| EarlyWin | liseré + badge turquoise |
| XtraWin | liseré + badge orange `#FF8A00` |
| Titres | Betclic Condensed Bold, en capitales |
| Textes | Betclic Regular / Bold |

Le logo est reconstitué en HTML/CSS (bloc rouge + wordmark blanc incliné dans la
police Betclic Bold) plutôt qu'importé en image.

## Fonctionnalités

- **Fil de rumeurs** : joueur, club actuel → club cible, montant estimé, extrait
  d'article sourcé, indice de fiabilité.
- **Marchés de paris** par rumeur : marché principal, marchés annexes, et selon
  les cas un marché EarlyWin ou XtraWin.
- **Boutons 5 €** : un appui ajoute la sélection au panier, le bouton passe au
  rouge Betclic avec une coche.
- **MyCombi** : panier persistant (localStorage), mode paris simples ou combiné,
  mise totale et gain potentiel.
- **Filtres** : Le Top, rumeurs chaudes, Ligue 1, Liga, Premier League.
- **Compte à rebours** jusqu'à la fermeture du mercato.

Les cotes ne sont jamais affichées sur les boutons — elles ne servent qu'au
calcul du gain potentiel dans le panier.

## Ajouter une rumeur

Ajouter une entrée dans `data/rumeurs.js`. Le champ `marches[].picks[].part`
correspond à la répartition des parieurs (largeur des jauges sous les boutons),
`cote` au calcul du gain, jamais à l'affichage.

## Avertissement

Projet de démonstration. Les rumeurs, montants et cotes sont **fictifs** et
n'engagent aucun club ni joueur. Les polices et la marque Betclic appartiennent
à leurs propriétaires respectifs.
