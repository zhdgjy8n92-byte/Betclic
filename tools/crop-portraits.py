"""
Normalise les portraits de joueurs pour la pastille ronde.

Les photos fournies ont des cadrages et des formats très différents. Ce script
détecte le visage, en déduit un carré centré sur la tête avec un peu d'air
au-dessus, et exporte un PNG carré de taille fixe. Les cinq pastilles sont
ainsi homogènes, quel que soit le plan d'origine.

    pip install pillow opencv-python-headless
    python3 tools/crop-portraits.py

Les sources restent dans assets/img/joueurs/sources/, les fichiers publiés
sont écrits à côté au format <slug>.jpg.
"""
import pathlib
import sys

import cv2
from PIL import Image

RACINE = pathlib.Path(__file__).resolve().parent.parent
DOSSIER = RACINE / 'assets' / 'img' / 'joueurs'
SOURCES = DOSSIER / 'sources'

# La pastille fait 46 px sur les cartes et 74 px sur la fiche : 256 px
# couvre largement les écrans à haute densité. Au-delà, on alourdit pour rien.
TAILLE = 256          # côté de l'image produite
LARGEUR_VISAGE = 0.62  # part du cadre occupée par la largeur du visage
HAUT_VISAGE = 0.30     # position verticale du centre du visage dans le cadre


def detecter_visage(chemin):
    """Retourne (cx, cy, largeur) du visage, ou None."""
    img = cv2.imread(str(chemin))
    if img is None:
        return None
    gris = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gris = cv2.equalizeHist(gris)

    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    for echelle, voisins in ((1.05, 6), (1.03, 4), (1.1, 3)):
        visages = cascade.detectMultiScale(gris, echelle, voisins,
                                           minSize=(40, 40))
        if len(visages):
            # Le plus grand visage détecté est le sujet
            x, y, w, h = max(visages, key=lambda v: v[2] * v[3])
            return x + w / 2, y + h / 2, w
    return None


def recadrer(chemin, sortie):
    im = Image.open(chemin).convert('RGB')
    L, H = im.size

    visage = detecter_visage(chemin)
    if visage:
        cx, cy, largeur = visage
        cote = largeur / LARGEUR_VISAGE
        note = 'visage détecté'
    else:
        # Repli : cadrage haut, typique des portraits sportifs
        cote = min(L, H * 0.62)
        cx, cy = L / 2, cote * HAUT_VISAGE
        note = 'REPLI (aucun visage détecté)'

    gauche = cx - cote / 2
    haut = cy - cote * HAUT_VISAGE

    # On garde le cadre dans l'image, quitte à le décaler
    cote = min(cote, L, H)
    gauche = max(0, min(gauche, L - cote))
    haut = max(0, min(haut, H - cote))

    carre = im.crop((round(gauche), round(haut),
                     round(gauche + cote), round(haut + cote)))
    carre = carre.resize((TAILLE, TAILLE), Image.LANCZOS)
    # JPEG : ce sont des photographies, le PNG les alourdit d'un facteur 20
    carre.save(sortie, 'JPEG', quality=86, optimize=True, progressive=True)
    return note, round(cote)


def main():
    SOURCES.mkdir(exist_ok=True)

    # Les originaux sont rangés une fois pour toutes dans sources/
    for f in sorted(DOSSIER.iterdir()):
        if f.is_file() and f.suffix.lower() in ('.jpg', '.jpeg', '.png') \
                and f.stem != 'README':
            cible = SOURCES / f.name
            if not cible.exists():
                f.replace(cible)

    sources = [f for f in sorted(SOURCES.iterdir())
               if f.suffix.lower() in ('.jpg', '.jpeg', '.png')]
    if not sources:
        raise SystemExit('Aucune source dans %s' % SOURCES)

    for f in sources:
        sortie = DOSSIER / (f.stem + '.jpg')
        note, cote = recadrer(f, sortie)
        print('%-16s → %-16s carré %4d px, %s'
              % (f.name, sortie.name, cote, note))


if __name__ == '__main__':
    main()
