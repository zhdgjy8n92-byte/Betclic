"""
Assemble tout le site dans un fichier HTML unique et autonome.

Polices, images, styles et scripts sont embarqués : le fichier s'ouvre
directement depuis le disque, et se dépose tel quel sur n'importe quel
hébergeur statique (Netlify Drop, Vercel, un simple partage de fichier).

    python3 tools/build-standalone.py
    → dist/mercatodds.html
"""
import base64
import pathlib
import re

RACINE = pathlib.Path(__file__).resolve().parent.parent
SORTIE = RACINE / 'dist' / 'mercatodds.html'

TYPES = {
    '.ttf': 'font/ttf',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
}


def data_uri(chemin):
    chemin = pathlib.Path(chemin)
    mime = TYPES.get(chemin.suffix.lower(), 'application/octet-stream')
    donnees = base64.b64encode(chemin.read_bytes()).decode('ascii')
    return 'data:%s;base64,%s' % (mime, donnees)


def inliner_css(css, base):
    """Remplace les url(...) du CSS par des data URI."""
    def remplacer(m):
        ref = m.group(1).strip('\'"')
        if ref.startswith('data:'):
            return m.group(0)
        return "url('%s')" % data_uri((base / ref).resolve())

    return re.sub(r"url\(\s*([^)]+?)\s*\)", remplacer, css)


def main():
    html = (RACINE / 'index.html').read_text(encoding='utf-8')

    # --- Styles ---
    css = (RACINE / 'css' / 'style.css').read_text(encoding='utf-8')
    css = inliner_css(css, RACINE / 'css')
    html = re.sub(
        r'<link rel="stylesheet" href="css/style\.css">',
        '<style>\n%s\n</style>' % css,
        html,
    )

    # --- Scripts (les données d'abord, puis l'application) ---
    # Les chemins d'images cités dans le JS (écussons, pastille Feebet) sont
    # injectés au moment du rendu : l'inlineur HTML ne les voit pas, il faut
    # donc les remplacer directement dans le code.
    # Les portraits de joueurs sont optionnels : un fichier absent est laissé
    # tel quel, la page retombant d'elle-même sur les initiales.
    manquants = []

    def remplacer_chaine(m):
        quote, ref = m.group(1), m.group(2)
        chemin = RACINE / ref
        if not chemin.exists():
            manquants.append(ref)
            return m.group(0)
        return quote + data_uri(chemin) + quote

    for src in ('data/rumeurs.js', 'js/app.js'):
        code = (RACINE / src).read_text(encoding='utf-8')
        code = re.sub(r"""(['"])(assets/[^'"]+\.(?:png|svg|jpg|webp))\1""",
                      remplacer_chaine, code)
        # Un </script> dans une chaîne fermerait la balise prématurément
        code = code.replace('</script>', '<\\/script>')
        html = html.replace(
            '<script src="%s"></script>' % src,
            '<script>\n%s\n</script>' % code,
        )

    # --- Images ---
    def remplacer_img(m):
        ref = m.group(1)
        if ref.startswith(('data:', 'http')):
            return m.group(0)
        return 'src="%s"' % data_uri(RACINE / ref)

    html = re.sub(r'src="((?!data:|http)[^"]+\.(?:png|svg|jpg|webp))"',
                  remplacer_img, html)

    if manquants:
        print('Optionnel, absent (repli sur les initiales) : ' + ', '.join(manquants))

    # Garde-fou : aucune ressource externe requise ne doit subsister. Les
    # chemins construits dynamiquement en JS et les fichiers optionnels
    # absents ne comptent pas.
    restants = [r for r in re.findall(r'src="((?!data:|http)[^"]+)"', html)
                if "' +" not in r and r not in manquants]
    if restants:
        print('Attention, références non embarquées :', restants)

    SORTIE.parent.mkdir(exist_ok=True)
    SORTIE.write_text(html, encoding='utf-8')
    print('%s — %.1f Mo' % (SORTIE, SORTIE.stat().st_size / 1e6))


if __name__ == '__main__':
    main()
