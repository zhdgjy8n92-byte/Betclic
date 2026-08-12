"""
Génère les logos du Mercat'odds en SVG à partir des polices Betclic fournies :

  logo-mercatodds.svg          lock-up vertical de l'opération
  logo-mercatodds-inline.svg   version compacte pour le header
  feebet.svg                   pastille Feebet (disque orange, F blanc)

Les glyphes sont convertis en tracés vectoriels : les SVG ne dépendent d'aucune
police et se comportent comme des images classiques.
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

FONTS = {
    'bold': '/home/user/Betclic/assets/fonts/BetclicBold.ttf',
    'cond': '/home/user/Betclic/assets/fonts/BetclicCondensedBold.ttf',
}


def text_to_path(font_path, text, size, letter_spacing=0.0):
    """Retourne (path_data, largeur, ascender, descender) mis à l'échelle."""
    font = TTFont(font_path)
    upem = font['head'].unitsPerEm
    cmap = font.getBestCmap()
    glyphset = font.getGlyphSet()
    hmtx = font['hmtx']
    scale = size / upem

    parts = []
    x = 0.0
    for ch in text:
        name = cmap.get(ord(ch))
        if name is None:
            raise SystemExit('Glyphe absent de la police : %r' % ch)
        pen = SVGPathPen(glyphset)
        glyphset[name].draw(pen)
        d = pen.getCommands()
        if d:
            # y inversé : les polices montent, le SVG descend
            parts.append(
                '<path transform="translate(%.3f 0) scale(%.6f -%.6f)" d="%s"/>'
                % (x, scale, scale, d)
            )
        x += hmtx[name][0] * scale + letter_spacing

    asc = font['hhea'].ascent * scale
    desc = font['hhea'].descent * scale
    font.close()
    return ''.join(parts), x, asc, desc


def build(stacked=True):
    # --- Pavé « Betclic » ---
    b_size = 62.0 if stacked else 74.0
    b_path, b_w, b_asc, b_desc = text_to_path(FONTS['bold'], 'Betclic', b_size)

    pad_x, pad_y = b_size * 0.30, b_size * 0.26
    cap = b_size * 0.72                      # hauteur de capitale approchée
    box_w = b_w + pad_x * 2
    box_h = cap + pad_y * 2

    # --- Mot « MERCAT'ODDS » ---
    m_size = 150.0
    m_path, m_w, m_asc, m_desc = text_to_path(
        FONTS['cond'], "MERCAT'ODDS", m_size, letter_spacing=m_size * 0.005
    )
    m_cap = m_size * 0.72
    stroke = m_size * 0.150                  # contour rouge du logo

    skew_b = 11.0                            # inclinaison du wordmark Betclic
    skew_m = 8.0                             # inclinaison du mot

    import math
    shear_b = math.tan(math.radians(skew_b))
    shear_m = math.tan(math.radians(skew_m))

    gap = m_size * 0.06
    margin = stroke + m_size * 0.12

    # Largeur totale : le mot penché déborde de sa boîte droite
    m_total_w = m_w + shear_m * m_cap
    total_w = max(box_w, m_total_w) + margin * 2

    if stacked:
        box_x = (total_w - box_w) / 2
        box_y = margin
        m_baseline_y = box_y + box_h + gap + m_cap
        total_h = m_baseline_y + margin
    else:
        box_x = margin
        box_y = margin
        m_baseline_y = box_y + cap + pad_y
        total_w = box_w + gap * 2 + m_total_w + margin * 2
        total_h = box_h + margin * 2

    m_x = (total_w - m_total_w) / 2 if stacked else box_x + box_w + gap * 2

    # Le texte Betclic, penché autour de sa propre ligne de base
    b_baseline_y = box_y + pad_y + cap
    b_x = box_x + pad_x

    svg = []
    svg.append(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.2f %.2f" '
        'width="%.0f" height="%.0f" role="img" '
        'aria-label="Betclic Mercat\'odds">' % (total_w, total_h, total_w, total_h)
    )
    svg.append('<title>Betclic Mercat\'odds</title>')

    svg.append(
        '<filter id="ombre" x="-15%%" y="-15%%" width="130%%" height="140%%">'
        '<feDropShadow dx="0" dy="%.1f" stdDeviation="%.1f" '
        'flood-color="#000" flood-opacity="0.38"/></filter>'
        % (m_size * 0.05, m_size * 0.035)
    )

    # Pavé rouge + wordmark blanc
    svg.append('<g>')
    svg.append(
        '<rect x="%.2f" y="%.2f" width="%.2f" height="%.2f" fill="#E30613"/>'
        % (box_x, box_y, box_w, box_h)
    )
    svg.append(
        '<g fill="#FFFFFF" transform="translate(%.3f %.3f) matrix(1 0 %.5f 1 0 0)">%s</g>'
        % (b_x, b_baseline_y, -shear_b, b_path)
    )
    svg.append('</g>')

    # MERCAT'ODDS : contour rouge dessous, remplissage blanc dessus
    svg.append('<g filter="url(#ombre)">')
    svg.append(
        '<g transform="translate(%.3f %.3f) matrix(1 0 %.5f 1 0 0)">'
        '<g stroke="#E30613" stroke-width="%.2f" stroke-linejoin="round" '
        'fill="#E30613">%s</g>'
        '<g fill="#FFFFFF">%s</g></g>'
        % (m_x + shear_m * m_cap, m_baseline_y, -shear_m, stroke, m_path, m_path)
    )
    svg.append('</g>')

    svg.append('</svg>')
    return '\n'.join(svg)


def build_feebet():
    """Pastille Feebet : anneau blanc, disque orange, F blanc centré."""
    ORANGE = '#EE4B26'
    size = 100.0
    cx = cy = size / 2

    font = TTFont(FONTS['bold'])
    upem = font['head'].unitsPerEm
    name = font.getBestCmap()[ord('F')]
    glyphset = font.getGlyphSet()

    pen = SVGPathPen(glyphset)
    glyphset[name].draw(pen)
    d = pen.getCommands()

    bounds = BoundsPen(glyphset)
    glyphset[name].draw(bounds)
    x_min, y_min, x_max, y_max = bounds.bounds
    font.close()

    # Le F occupe 52 % du diamètre, centré sur sa boîte englobante réelle
    scale = (size * 0.52) / (y_max - y_min)
    w = (x_max - x_min) * scale
    h = (y_max - y_min) * scale
    tx = cx - w / 2 - x_min * scale
    ty = cy + h / 2 + y_min * scale

    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %g %g" '
        'width="%g" height="%g" role="img" aria-label="Feebet">'
        '<title>Feebet</title>'
        '<circle cx="%g" cy="%g" r="%g" fill="#FFFFFF"/>'
        '<circle cx="%g" cy="%g" r="%g" fill="%s"/>'
        '<path fill="#FFFFFF" transform="translate(%.3f %.3f) scale(%.6f -%.6f)" d="%s"/>'
        '</svg>'
        % (size, size, size, size,
           cx, cy, size / 2,
           cx, cy, size * 0.445, ORANGE,
           tx, ty, scale, scale, d)
    )


with open('/home/user/Betclic/assets/img/logo-mercatodds.svg', 'w') as f:
    f.write(build(stacked=True))

with open('/home/user/Betclic/assets/img/logo-mercatodds-inline.svg', 'w') as f:
    f.write(build(stacked=False))

with open('/home/user/Betclic/assets/img/feebet.svg', 'w') as f:
    f.write(build_feebet())

print('SVG générés')
