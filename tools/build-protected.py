"""
Construit la version publiée du site, protégée par mot de passe.

Le contenu n'est pas simplement masqué : il est chiffré en AES-256-GCM avec une
clé dérivée du mot de passe (PBKDF2-HMAC-SHA256, 250 000 itérations). La page
publiée ne contient que le chiffré — sans le mot de passe, le contenu n'est pas
récupérable depuis le code source.

Le mot de passe n'est jamais écrit dans le fichier produit, ni stocké dans le
dépôt : il est passé en argument ou via la variable MERCATODDS_PASSWORD.

    python3 tools/build-protected.py 'mot-de-passe'
    → public/index.html
"""
import base64
import hashlib
import os
import pathlib
import subprocess
import sys

from Crypto.Cipher import AES

RACINE = pathlib.Path(__file__).resolve().parent.parent
AUTONOME = RACINE / 'dist' / 'mercatodds.html'
SORTIE = RACINE / 'public' / 'index.html'

ITERATIONS = 250_000


def chiffrer(texte, mot_de_passe):
    sel = os.urandom(16)
    iv = os.urandom(12)

    cle = hashlib.pbkdf2_hmac('sha256', mot_de_passe.encode('utf-8'),
                              sel, ITERATIONS, dklen=32)

    chiffreur = AES.new(cle, AES.MODE_GCM, nonce=iv)
    corps, tag = chiffreur.encrypt_and_digest(texte.encode('utf-8'))

    # WebCrypto attend le tag d'authentification concaténé au chiffré
    b64 = lambda b: base64.b64encode(b).decode('ascii')
    return b64(sel), b64(iv), b64(corps + tag)


GABARIT = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Betclic Mercat'odds</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0A0E1C">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23E30613'/><text x='16' y='23' font-family='Arial' font-size='20' font-weight='bold' font-style='italic' fill='white' text-anchor='middle'>B</text></svg>">
<style>
  :root {
    --bg: #0A0E1C; --card: #161C30; --line: #262E48;
    --red: #E30613; --yellow: #FFE14A; --text-dim: #9AA3BF; --text-mute: #6B7595;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100dvh;
    background:
      radial-gradient(120% 90% at 80% 0%, #3B1020 0%, transparent 60%),
      linear-gradient(180deg, #1A1030 0%, #0F1424 70%, var(--bg) 100%);
    color: #fff;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    display: flex; align-items: center; justify-content: center;
    padding: 24px; position: relative; overflow-x: hidden;
  }
  body::before {
    content: ''; position: fixed; inset: 0; pointer-events: none;
    background-image: repeating-linear-gradient(-60deg,
      rgba(227,6,19,.16) 0 2px, transparent 2px 26px);
    mask-image: linear-gradient(180deg, #000 0%, transparent 80%);
  }
  .porte {
    position: relative; width: 100%; max-width: 380px; text-align: center;
    background: linear-gradient(158deg, rgba(255,255,255,.09) 0%, rgba(255,255,255,.02) 42%), #131829;
    backdrop-filter: blur(22px) saturate(1.7);
    -webkit-backdrop-filter: blur(22px) saturate(1.7);
    border: 1px solid rgba(255,255,255,.14);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 24px 60px rgba(0,0,0,.6);
    border-radius: 20px; padding: 28px 22px 22px;
  }
  .porte__logo { width: 78%; max-width: 250px; margin: 0 auto 18px; display: block; }
  .porte__titre {
    margin: 0 0 6px; font-size: 15px; letter-spacing: 1.4px;
    text-transform: uppercase; color: var(--yellow); font-weight: 700;
  }
  .porte__texte { margin: 0 0 20px; font-size: 14px; color: var(--text-dim); line-height: 1.5; }
  .porte__champ {
    width: 100%; padding: 14px 16px; font-size: 16px; font-family: inherit;
    color: #fff; text-align: center; letter-spacing: 2px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.16);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.2);
    border-radius: 12px; outline: none; transition: border-color .15s ease;
  }
  .porte__champ::placeholder { color: var(--text-mute); letter-spacing: 1px; }
  .porte__champ:focus { border-color: rgba(255,60,75,.7); }
  .porte__bouton {
    position: relative; overflow: hidden; width: 100%; margin-top: 12px;
    padding: 15px; font-size: 16.5px; font-weight: 700; font-family: inherit;
    color: #fff; cursor: pointer; border: 0; border-radius: 12px;
    background: linear-gradient(158deg, #FF3444 0%, var(--red) 48%, #B00510 100%);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.38),
                inset 0 -2px 4px rgba(0,0,0,.3), 0 6px 20px rgba(227,6,19,.35);
    transition: transform .12s ease, filter .12s ease;
  }
  .porte__bouton::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(152deg, rgba(255,255,255,.4) 0%,
      rgba(255,255,255,.1) 30%, rgba(255,255,255,0) 52%);
  }
  .porte__bouton:active { transform: scale(.985); filter: brightness(.95); }
  .porte__bouton:disabled { filter: grayscale(.5) brightness(.8); cursor: default; }
  .porte__erreur {
    margin: 12px 0 0; font-size: 13px; font-weight: 700;
    color: #FF6472; min-height: 18px;
  }
  .porte__pied {
    margin: 18px 0 0; padding-top: 14px; border-top: 1px solid var(--line);
    font-size: 11px; color: var(--text-mute); line-height: 1.5;
  }
  @keyframes secousse {
    0%,100% { transform: translateX(0); }
    25% { transform: translateX(-7px); }
    75% { transform: translateX(7px); }
  }
  .secousse { animation: secousse .3s ease; }
</style>
</head>
<body>
  <main class="porte" id="porte">
    <img class="porte__logo" src="__LOGO__" alt="Betclic Mercat'odds">
    <p class="porte__titre">Accès réservé</p>
    <p class="porte__texte">Cette maquette est protégée.<br>Saisis le mot de passe pour y accéder.</p>

    <form id="formulaire" autocomplete="off">
      <input class="porte__champ" id="mdp" type="password" placeholder="Mot de passe"
             autocomplete="current-password" autocapitalize="characters" spellcheck="false">
      <button class="porte__bouton" id="bouton" type="submit">Entrer</button>
    </form>

    <p class="porte__erreur" id="erreur" role="alert"></p>

    <p class="porte__pied">
      Projet de démonstration. Les rumeurs, montants et gains sont fictifs et
      n'engagent aucun club ni joueur.
    </p>
  </main>

<script>
(function () {
  'use strict';

  var SEL = '__SEL__';
  var IV = '__IV__';
  var CHIFFRE = '__CHIFFRE__';
  var ITERATIONS = __ITERATIONS__;
  var CLE_SESSION = 'mercatodds.acces';

  var form = document.getElementById('formulaire');
  var champ = document.getElementById('mdp');
  var bouton = document.getElementById('bouton');
  var erreur = document.getElementById('erreur');
  var porte = document.getElementById('porte');

  function octets(b64) {
    var brut = atob(b64);
    var out = new Uint8Array(brut.length);
    for (var i = 0; i < brut.length; i++) out[i] = brut.charCodeAt(i);
    return out;
  }

  function dechiffrer(motDePasse) {
    var enc = new TextEncoder();
    return crypto.subtle
      .importKey('raw', enc.encode(motDePasse), 'PBKDF2', false, ['deriveKey'])
      .then(function (base) {
        return crypto.subtle.deriveKey(
          { name: 'PBKDF2', salt: octets(SEL), iterations: ITERATIONS, hash: 'SHA-256' },
          base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      })
      .then(function (cle) {
        return crypto.subtle.decrypt({ name: 'AES-GCM', iv: octets(IV) }, cle, octets(CHIFFRE));
      })
      .then(function (clair) { return new TextDecoder().decode(clair); });
  }

  function afficher(html) {
    document.open();
    document.write(html);
    document.close();
  }

  function tenter(motDePasse, silencieux) {
    bouton.disabled = true;
    erreur.textContent = '';

    return dechiffrer(motDePasse).then(function (html) {
      try { sessionStorage.setItem(CLE_SESSION, motDePasse); } catch (e) {}
      afficher(html);
    }).catch(function () {
      bouton.disabled = false;
      if (silencieux) {
        try { sessionStorage.removeItem(CLE_SESSION); } catch (e) {}
        return;
      }
      erreur.textContent = 'Mot de passe incorrect.';
      porte.classList.remove('secousse');
      void porte.offsetWidth;
      porte.classList.add('secousse');
      champ.value = '';
      champ.focus();
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valeur = champ.value.trim();
    if (!valeur) { champ.focus(); return; }
    tenter(valeur, false);
  });

  if (!window.crypto || !crypto.subtle) {
    erreur.textContent = 'Navigateur trop ancien : chiffrement indisponible.';
    bouton.disabled = true;
    return;
  }

  // Une session déjà ouverte évite de ressaisir le mot de passe à chaque visite
  var memorise = null;
  try { memorise = sessionStorage.getItem(CLE_SESSION); } catch (e) {}
  if (memorise) tenter(memorise, true);
  else champ.focus();
})();
</script>
</body>
</html>
"""


def main():
    mot_de_passe = (sys.argv[1] if len(sys.argv) > 1
                    else os.environ.get('MERCATODDS_PASSWORD'))
    if not mot_de_passe:
        raise SystemExit(
            'Mot de passe manquant.\n'
            "  python3 tools/build-protected.py 'mot-de-passe'\n"
            '  ou MERCATODDS_PASSWORD=… python3 tools/build-protected.py')

    # On reconstruit d'abord le fichier autonome, pour partir de sources à jour
    subprocess.run([sys.executable, str(RACINE / 'tools' / 'build-standalone.py')],
                   check=True)

    clair = AUTONOME.read_text(encoding='utf-8')
    sel, iv, chiffre = chiffrer(clair, mot_de_passe)

    logo = RACINE / 'assets' / 'img' / 'logo-mercatodds.png'
    logo_uri = 'data:image/png;base64,' + base64.b64encode(logo.read_bytes()).decode('ascii')

    page = GABARIT
    for jeton, valeur in (
        ('__LOGO__', logo_uri),
        ('__SEL__', sel),
        ('__IV__', iv),
        ('__CHIFFRE__', chiffre),
        ('__ITERATIONS__', str(ITERATIONS)),
    ):
        page = page.replace(jeton, valeur)

    SORTIE.parent.mkdir(exist_ok=True)
    SORTIE.write_text(page, encoding='utf-8')

    # Le contenu en clair ne doit apparaître nulle part dans la page publiée
    for temoin in ("Mercat'odds — Le guess du jour", 'MERCATODDS_RUMEURS', 'Ferran Torres'):
        if temoin in page:
            raise SystemExit('Fuite : « %s » apparaît en clair dans la sortie.' % temoin)

    print('%s — %.1f Mo (contenu chiffré)' % (SORTIE, SORTIE.stat().st_size / 1e6))


if __name__ == '__main__':
    main()
