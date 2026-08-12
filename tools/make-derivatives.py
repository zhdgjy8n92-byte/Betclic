"""
Découpe le logo de l'opération (assets/img/logo.png) en déclinaisons prêtes
à l'emploi :

  logo-mercatodds.png          lock-up vertical détouré, pour la une
  logo-mercatodds-inline.png   version horizontale compacte, pour le header

Le fichier source est conservé tel quel : ce script ne fait que rogner la
transparence superflue et recomposer la variante horizontale à partir des
deux blocs du lock-up (le pavé « Betclic » et le mot MERCAT'ODDS).

    pip install pillow
    python3 tools/make-derivatives.py
"""
from PIL import Image

SRC = '/home/user/Betclic/assets/img/logo.png'
OUT = '/home/user/Betclic/assets/img/'

# Hauteurs de sortie, calibrées pour un affichage en 3x
HAUTEUR_STACK = 700     # la une s'affiche jusqu'à ~340 px de large
HAUTEUR_INLINE = 200    # le header s'affiche à 34 px de haut

# Proportions de la variante horizontale
RATIO_PAVE = 0.78       # hauteur du pavé Betclic, relative au mot
ECART = 0.14            # espace entre les deux blocs, relatif au mot


def bandes_vides(alpha, boite):
    """Repère les bandes horizontales entièrement transparentes."""
    gauche, haut, droite, bas = boite
    vides = [y for y in range(haut, bas)
             if alpha.crop((gauche, y, droite, y + 1)).getextrema()[1] == 0]

    groupes, debut = [], None
    for i, y in enumerate(vides):
        if debut is None:
            debut = y
        elif y != vides[i - 1] + 1:
            groupes.append((debut, vides[i - 1]))
            debut = y
    if debut is not None and vides:
        groupes.append((debut, vides[-1]))
    return groupes


def redimensionner_hauteur(im, hauteur):
    ratio = hauteur / im.height
    return im.resize((max(1, round(im.width * ratio)), hauteur), Image.LANCZOS)


def main():
    src = Image.open(SRC).convert('RGBA')
    boite = src.getbbox()
    if boite is None:
        raise SystemExit('Le logo semble entièrement transparent.')

    # --- Lock-up vertical, simplement détouré ---
    stack = src.crop(boite)
    redimensionner_hauteur(stack, HAUTEUR_STACK).save(OUT + 'logo-mercatodds.png')

    # --- Variante horizontale, recomposée à partir des deux blocs ---
    groupes = bandes_vides(src.split()[3], boite)
    if not groupes:
        raise SystemExit('Aucune séparation trouvée entre le pavé et le mot.')

    # La plus large bande vide sépare le pavé Betclic du mot
    coupe_haut, coupe_bas = max(groupes, key=lambda g: g[1] - g[0])

    pave = src.crop((boite[0], boite[1], boite[2], coupe_haut))
    mot = src.crop((boite[0], coupe_bas + 1, boite[2], boite[3]))
    pave = pave.crop(pave.getbbox())
    mot = mot.crop(mot.getbbox())

    mot = redimensionner_hauteur(mot, HAUTEUR_INLINE)
    pave = redimensionner_hauteur(pave, round(HAUTEUR_INLINE * RATIO_PAVE))

    ecart = round(HAUTEUR_INLINE * ECART)
    largeur = pave.width + ecart + mot.width
    inline = Image.new('RGBA', (largeur, HAUTEUR_INLINE), (0, 0, 0, 0))
    inline.alpha_composite(pave, (0, (HAUTEUR_INLINE - pave.height) // 2))
    inline.alpha_composite(mot, (pave.width + ecart, 0))
    inline.save(OUT + 'logo-mercatodds-inline.png')

    print('logo-mercatodds.png       ', redimensionner_hauteur(stack, HAUTEUR_STACK).size)
    print('logo-mercatodds-inline.png', inline.size)


if __name__ == '__main__':
    main()
