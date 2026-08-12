/* =========================================================
   Betclic Mercat'odds — logique applicative
   ---------------------------------------------------------
   Principe : chaque sélection vaut une mise fixe de MISE (5 €).
   Les boutons n'affichent donc jamais de cote, seulement « 5 € ».
   Les cotes servent uniquement au calcul du gain potentiel.
   ========================================================= */
(function () {
  'use strict';

  var MISE = 5;
  var DEADLINE = '2026-09-01T22:00:00';
  var STORAGE_KEY = 'mercatodds.slip';

  var rumeurs = window.MERCATODDS_RUMEURS || [];

  /* ---------- État ---------- */
  var selections = charger();
  var filtreActif = 'tous';
  var modeCombi = 'simple';

  /* ---------- Raccourcis DOM ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var feed = $('#feed');
  var feedEmpty = $('#feed-empty');
  var slip = $('#slip');
  var slipList = $('#slip-list');
  var slipEmpty = $('#slip-empty');
  var slipFab = $('#slip-fab');
  var toastEl = $('#toast');

  /* =========================================================
     Utilitaires
     ========================================================= */
  function euros(n) {
    return n.toFixed(2).replace('.', ',') + ' €';
  }

  function echapper(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function charger() {
    try {
      var brut = localStorage.getItem(STORAGE_KEY);
      return brut ? JSON.parse(brut) : [];
    } catch (e) {
      return [];
    }
  }

  function sauver() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
    } catch (e) { /* mode privé : on ignore */ }
  }

  function indexDe(cle) {
    for (var i = 0; i < selections.length; i++) {
      if (selections[i].cle === cle) return i;
    }
    return -1;
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2000);
  }

  /* =========================================================
     Rendu du fil de rumeurs
     ========================================================= */
  function classeFiabilite(v) {
    if (v >= 70) return '';
    if (v >= 45) return ' fiab__fill--mid';
    return ' fiab__fill--low';
  }

  function gabaritPick(rumeur, marche, mIndex, pick, pIndex, meneur) {
    var cle = rumeur.id + '|' + mIndex + '|' + pIndex;
    var choisi = indexDe(cle) !== -1;
    return (
      '<div class="pick">' +
        '<button class="pick__btn' + (choisi ? ' is-picked' : '') + '" type="button"' +
          ' data-cle="' + cle + '"' +
          ' data-rumeur="' + rumeur.id + '"' +
          ' data-marche="' + mIndex + '"' +
          ' data-pick="' + pIndex + '"' +
          ' aria-pressed="' + choisi + '">' +
          '<span class="pick__label">' + echapper(pick.label) + '</span>' +
          '<span class="pick__mise">' + MISE + ' €</span>' +
        '</button>' +
        '<div class="pick__bar' + (pIndex === meneur ? ' pick__bar--lead' : '') + '">' +
          '<span style="width:' + pick.part + '%"></span>' +
        '</div>' +
      '</div>'
    );
  }

  function gabaritMarche(rumeur, marche, mIndex) {
    var meneur = 0;
    marche.picks.forEach(function (p, i) {
      if (p.part > marche.picks[meneur].part) meneur = i;
    });

    var modif = '';
    if (marche.type === 'earlywin') modif = ' marche--earlywin';
    if (marche.type === 'xtrawin') modif = ' marche--xtrawin';

    var badge = '';
    if (marche.badge === 'EarlyWin') {
      badge = '<span class="marche__badge marche__badge--earlywin">⏱ EarlyWin</span>';
    } else if (marche.badge === 'XTRAWIN') {
      badge = '<span class="marche__badge marche__badge--xtrawin">XtraWin</span>';
    }

    var picks = marche.picks.map(function (p, i) {
      return gabaritPick(rumeur, marche, mIndex, p, i, meneur);
    }).join('');

    return (
      '<section class="marche' + modif + '">' +
        badge +
        '<div class="marche__head">' +
          '<button class="marche__info" type="button" aria-label="Règles du marché">i</button>' +
          '<h3 class="marche__titre">' + echapper(marche.titre) + '</h3>' +
          '<div class="marche__actions">' +
            '<button class="marche__icon" type="button" aria-label="Ajouter au MyCombi">' +
              '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">' +
                '<rect x="3" y="4" width="12" height="16" rx="3"/><path d="M19 9v8M23 13h-8"/></svg>' +
            '</button>' +
            '<button class="marche__icon marche__icon--stats" type="button" aria-label="Statistiques">' +
              '<svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor">' +
                '<rect x="3" y="10" width="4" height="11" rx="1"/>' +
                '<rect x="10" y="4" width="4" height="17" rx="1"/>' +
                '<rect x="17" y="14" width="4" height="7" rx="1"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="picks" style="--cols:' + marche.picks.length + '">' + picks + '</div>' +
      '</section>'
    );
  }

  function gabaritCombi(rumeur) {
    if (!rumeur.combi) return '';
    var cle = rumeur.id + '|combi';
    var choisi = indexDe(cle) !== -1;

    var lignes = rumeur.combi.lignes.map(function (l) {
      return (
        '<div class="combi-suggest__line">' +
          '<span class="combi-suggest__dot" aria-hidden="true">+</span>' +
          '<div>' +
            '<div class="combi-suggest__t">' + echapper(l.titre) + '</div>' +
            '<div class="combi-suggest__s">' + echapper(l.sous) + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="combi-suggest">' +
        '<div class="combi-suggest__lines">' + lignes + '</div>' +
        '<button class="combi-suggest__btn' + (choisi ? ' is-picked' : '') + '" type="button"' +
          ' data-cle="' + cle + '" data-rumeur="' + rumeur.id + '" data-combi="1"' +
          ' aria-pressed="' + choisi + '">' +
          '<small>MyCombi</small><b>' + MISE + ' €</b>' +
        '</button>' +
      '</div>'
    );
  }

  function gabaritRumeur(rumeur) {
    var marches = rumeur.marches.map(function (m, i) {
      return gabaritMarche(rumeur, m, i);
    }).join('');

    return (
      '<article class="rumeur' + (rumeur.chaud ? ' is-hot' : '') + '" data-id="' + rumeur.id + '"' +
        ' data-competition="' + echapper(rumeur.competition) + '" data-chaud="' + (rumeur.chaud ? '1' : '0') + '">' +

        '<div class="rumeur__banner" style="--from-color:' + rumeur.clubActuel.couleur + ';--to-color:' + rumeur.clubCible.couleur + '">' +
          (rumeur.chaud ? '<div class="rumeur__flags"><span class="pill pill--hot">🔥 Chaud</span></div>' : '') +
          '<div class="rumeur__avatar">' + echapper(rumeur.initiales) + '</div>' +
          '<div class="rumeur__ident">' +
            '<h2 class="rumeur__name">' + echapper(rumeur.joueur) +
              '<span class="rumeur__flag">' + rumeur.nationalite + '</span></h2>' +
            '<div class="rumeur__meta">' + echapper(rumeur.poste) + ' <span class="dot">•</span> ' + rumeur.age + ' ans</div>' +
            '<div class="rumeur__route">' +
              '<span class="rumeur__club"><i class="rumeur__crest" style="background:' + rumeur.clubActuel.couleur + '"></i>' + echapper(rumeur.clubActuel.nom) + '</span>' +
              '<span class="rumeur__arrow" aria-label="vers">→</span>' +
              '<span class="rumeur__club"><i class="rumeur__crest" style="background:' + rumeur.clubCible.couleur + '"></i>' + echapper(rumeur.clubCible.nom) + '</span>' +
              '<span class="rumeur__fee">' + echapper(rumeur.montant) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="rumeur__article">' +
          '<div class="rumeur__source">' +
            '<span class="rumeur__source-name">' + echapper(rumeur.source) + '</span>' +
            '<span class="dot">•</span>' + echapper(rumeur.tempsSource) +
          '</div>' +
          '<h3 class="rumeur__titre">' + echapper(rumeur.titre) + '</h3>' +
          '<p class="rumeur__chapo">' + echapper(rumeur.chapo) + '</p>' +
          '<button class="rumeur__more" type="button" data-more>Lire la suite</button>' +
        '</div>' +

        '<div class="fiab">' +
          '<span class="fiab__label">Indice de fiabilité</span>' +
          '<span class="fiab__track"><span class="fiab__fill' + classeFiabilite(rumeur.fiabilite) + '" style="width:' + rumeur.fiabilite + '%"></span></span>' +
          '<span class="fiab__value">' + rumeur.fiabilite + ' %</span>' +
        '</div>' +

        '<div class="marches">' + marches + gabaritCombi(rumeur) + '</div>' +
      '</article>'
    );
  }

  function rendre() {
    feed.innerHTML = rumeurs.map(gabaritRumeur).join('');
    feed.appendChild(feedEmpty);
    appliquerFiltre();
  }

  /* =========================================================
     Filtres
     ========================================================= */
  function appliquerFiltre() {
    var visibles = 0;
    $$('.rumeur', feed).forEach(function (el) {
      var ok =
        filtreActif === 'tous' ||
        (filtreActif === 'chaud' && el.dataset.chaud === '1') ||
        el.dataset.competition === filtreActif;
      el.hidden = !ok;
      if (ok) visibles++;
    });
    feedEmpty.hidden = visibles > 0;
  }

  /* =========================================================
     Sélections / panier
     ========================================================= */
  function trouverRumeur(id) {
    for (var i = 0; i < rumeurs.length; i++) {
      if (rumeurs[i].id === id) return rumeurs[i];
    }
    return null;
  }

  function basculer(btn) {
    var cle = btn.dataset.cle;
    var rumeur = trouverRumeur(btn.dataset.rumeur);
    if (!rumeur) return;

    var i = indexDe(cle);
    if (i !== -1) {
      selections.splice(i, 1);
      btn.classList.remove('is-picked');
      btn.setAttribute('aria-pressed', 'false');
    } else {
      var entree;
      if (btn.dataset.combi) {
        entree = {
          cle: cle,
          joueur: rumeur.joueur,
          marche: 'MyCombi ' + rumeur.clubCible.nom,
          pick: rumeur.combi.lignes.map(function (l) { return l.titre; }).join(' + '),
          cote: rumeur.combi.cote
        };
      } else {
        var marche = rumeur.marches[+btn.dataset.marche];
        var pick = marche.picks[+btn.dataset.pick];
        entree = {
          cle: cle,
          joueur: rumeur.joueur,
          marche: marche.titre,
          pick: pick.label,
          cote: pick.cote
        };
      }
      selections.push(entree);
      btn.classList.add('is-picked');
      btn.setAttribute('aria-pressed', 'true');
      toast('5 € ajoutés : ' + entree.pick);
    }

    sauver();
    majPanier();
  }

  function retirer(cle) {
    var i = indexDe(cle);
    if (i === -1) return;
    selections.splice(i, 1);
    sauver();

    var btn = document.querySelector('[data-cle="' + cle + '"]');
    if (btn) {
      btn.classList.remove('is-picked');
      btn.setAttribute('aria-pressed', 'false');
    }
    majPanier();
  }

  function totaux() {
    var n = selections.length;
    if (!n) return { mise: 0, gain: 0 };

    if (modeCombi === 'combi') {
      var coteTotale = selections.reduce(function (acc, s) { return acc * s.cote; }, 1);
      return { mise: MISE, gain: MISE * coteTotale };
    }

    var gain = selections.reduce(function (acc, s) { return acc + MISE * s.cote; }, 0);
    return { mise: MISE * n, gain: gain };
  }

  function majPanier() {
    var n = selections.length;
    var t = totaux();

    // Bandeau flottant
    slipFab.hidden = n === 0;
    $('#slip-fab-count').textContent = n;
    $('#slip-fab-stake').textContent = t.mise + ' €';

    // Compteur d'onglet
    var tabCount = $('#tab-combi-count');
    tabCount.hidden = n === 0;
    tabCount.textContent = n;

    // Liste
    slipList.innerHTML = selections.map(function (s) {
      return (
        '<li class="slip__item">' +
          '<div class="slip__item-body">' +
            '<div class="slip__item-pick">' + echapper(s.pick) + '</div>' +
            '<div class="slip__item-marche">' + echapper(s.marche) + '</div>' +
            '<div class="slip__item-joueur">' + echapper(s.joueur) + '</div>' +
          '</div>' +
          '<span class="slip__item-stake">' + MISE + ' €</span>' +
          '<button class="slip__item-del" type="button" data-del="' + s.cle + '" aria-label="Retirer">✕</button>' +
        '</li>'
      );
    }).join('');

    slipEmpty.hidden = n > 0;
    $('#slip-stake').textContent = t.mise + ' €';
    $('#slip-gain').textContent = euros(t.gain);
    $('#slip-submit').disabled = n === 0;
    $('#slip-submit').textContent = n === 0
      ? 'Parier'
      : 'Parier ' + t.mise + ' €';

    // Le combiné exige au moins deux sélections
    $$('.slip__mode').forEach(function (b) {
      if (b.dataset.mode === 'combi') b.disabled = n < 2;
    });
    if (n < 2 && modeCombi === 'combi') basculerMode('simple');
  }

  function basculerMode(mode) {
    modeCombi = mode;
    $$('.slip__mode').forEach(function (b) {
      var actif = b.dataset.mode === mode;
      b.classList.toggle('is-active', actif);
      b.setAttribute('aria-selected', String(actif));
    });
    majPanier();
  }

  function ouvrirSlip() {
    slip.classList.add('is-open');
    slip.setAttribute('aria-hidden', 'false');
    document.body.classList.add('slip-open');
  }

  function fermerSlip() {
    slip.classList.remove('is-open');
    slip.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('slip-open');
  }

  /* =========================================================
     Compte à rebours
     ========================================================= */
  function majCompteur() {
    var reste = new Date(DEADLINE) - new Date();
    var el = $('#countdown-value');
    if (reste <= 0) {
      el.textContent = 'Mercato fermé';
      return;
    }
    var j = Math.floor(reste / 86400000);
    var h = Math.floor(reste / 3600000) % 24;
    var m = Math.floor(reste / 60000) % 60;
    var s = Math.floor(reste / 1000) % 60;
    el.textContent = j + 'j ' + String(h).padStart(2, '0') + 'h ' +
      String(m).padStart(2, '0') + 'm ' + String(s).padStart(2, '0') + 's';
  }

  /* =========================================================
     Écouteurs
     ========================================================= */
  document.addEventListener('click', function (e) {
    var btnPick = e.target.closest('.pick__btn, .combi-suggest__btn');
    if (btnPick) { basculer(btnPick); return; }

    var more = e.target.closest('[data-more]');
    if (more) {
      var art = more.closest('.rumeur');
      var ouvert = art.classList.toggle('is-open');
      more.textContent = ouvert ? 'Réduire' : 'Lire la suite';
      return;
    }

    var tab = e.target.closest('.tabs__item[data-filter]');
    if (tab) {
      $$('.tabs__item').forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      filtreActif = tab.dataset.filter;
      appliquerFiltre();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (e.target.closest('[data-open-slip]')) { ouvrirSlip(); return; }
    if (e.target.closest('[data-close-slip]')) { fermerSlip(); return; }
    if (e.target === slip) { fermerSlip(); return; }

    var del = e.target.closest('[data-del]');
    if (del) { retirer(del.dataset.del); return; }

    var mode = e.target.closest('.slip__mode');
    if (mode && !mode.disabled) { basculerMode(mode.dataset.mode); return; }

    if (e.target.closest('#slip-clear')) {
      selections = [];
      sauver();
      $$('.pick__btn.is-picked, .combi-suggest__btn.is-picked').forEach(function (b) {
        b.classList.remove('is-picked');
        b.setAttribute('aria-pressed', 'false');
      });
      majPanier();
      return;
    }

    if (e.target.closest('#slip-submit')) {
      var t = totaux();
      toast('Pari de ' + t.mise + ' € enregistré · gain potentiel ' + euros(t.gain));
      selections = [];
      sauver();
      $$('.pick__btn.is-picked, .combi-suggest__btn.is-picked').forEach(function (b) {
        b.classList.remove('is-picked');
        b.setAttribute('aria-pressed', 'false');
      });
      majPanier();
      fermerSlip();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') fermerSlip();
  });

  /* =========================================================
     Démarrage
     ========================================================= */
  rendre();
  majPanier();
  majCompteur();
  setInterval(majCompteur, 1000);
})();
