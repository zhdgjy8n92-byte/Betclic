/* =========================================================
   Betclic Mercat'odds — logique applicative
   ---------------------------------------------------------
   Un seul prono par jour. Le joueur désigne le transfert qu'il
   pense voir officialisé dans la journée : s'il tombe juste, il
   empoche des feebets. Il peut gonfler la cagnotte en ajoutant
   des sélections complémentaires depuis la fiche de la rumeur.

   Aucune cote n'est affichée : tout est exprimé en euros de feebets.
   ========================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'mercatodds.prono';

  var rumeurs = window.MERCATODDS_RUMEURS || [];
  var historique = window.MERCATODDS_HISTORIQUE || [];

  /* ---------- État ---------- */
  var prono = null;      // prono validé du jour
  var brouillon = null;  // fiche en cours d'édition

  /* ---------- Raccourcis DOM ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var feed = $('#feed');
  var sheet = $('#sheet');
  var sheetScroll = $('#sheet-scroll');
  var ticketEl = $('#ticket');
  var toastEl = $('#toast');
  var modal = $('#modal');

  var rumeurEnAttente = null; // rumeur soumise à confirmation

  /* =========================================================
     Utilitaires
     ========================================================= */
  function echapper(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function jourISO(d) {
    d = d || new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function trouverRumeur(id) {
    for (var i = 0; i < rumeurs.length; i++) {
      if (rumeurs[i].id === id) return rumeurs[i];
    }
    return null;
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2600);
  }

  /* ---------- Persistance ---------- */
  function charger() {
    try {
      var brut = localStorage.getItem(STORAGE_KEY);
      if (!brut) return null;
      var g = JSON.parse(brut);
      // Un prono n'est valable que pour sa journée.
      return g && g.date === jourISO() ? g : null;
    } catch (e) {
      return null;
    }
  }

  function sauver() {
    try {
      if (prono) localStorage.setItem(STORAGE_KEY, JSON.stringify(prono));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* mode privé : on ignore */ }
  }

  /* ---------- Calcul de la cagnotte ---------- */
  function calculerGain(rumeur, selections) {
    var total = rumeur.gainBase;
    rumeur.boosters.forEach(function (groupe) {
      var idx = selections[groupe.id];
      if (idx !== undefined && groupe.options[idx]) {
        total += groupe.options[idx].bonus;
      }
    });
    return total;
  }

  function detailSelections(rumeur, selections) {
    var lignes = [];
    rumeur.boosters.forEach(function (groupe) {
      var idx = selections[groupe.id];
      if (idx !== undefined && groupe.options[idx]) {
        lignes.push({
          titre: groupe.options[idx].label,
          sous: groupe.titre,
          bonus: groupe.options[idx].bonus
        });
      }
    });
    return lignes;
  }

  /* =========================================================
     Fil de rumeurs
     ========================================================= */
  function classeFiabilite(v) {
    if (v >= 70) return '';
    if (v >= 45) return ' fiab__fill--mid';
    return ' fiab__fill--low';
  }

  function gabaritClub(club) {
    // L'écusson officiel si on l'a, sinon une pastille aux couleurs du club
    var visuel = club.ecusson
      ? '<img class="rumeur__crest" src="' + club.ecusson + '" alt="" loading="lazy">'
      : '<i class="rumeur__crest rumeur__crest--uni" style="background:' + club.couleur + '"></i>';
    return '<span class="rumeur__club">' + visuel + echapper(club.nom) + '</span>';
  }

  function gabaritRoute(rumeur) {
    return (
      gabaritClub(rumeur.clubActuel) +
      '<span class="rumeur__arrow" aria-label="vers">→</span>' +
      gabaritClub(rumeur.clubCible)
    );
  }

  function gabaritRumeur(rumeur) {
    var estChoisi = prono && prono.rumeurId === rumeur.id;
    var estBloque = prono && !estChoisi;

    var classes = 'rumeur';
    if (rumeur.chaud && !prono) classes += ' is-hot';
    if (estChoisi) classes += ' is-chosen';
    if (estBloque) classes += ' is-locked';

    var pastille = '';
    if (estChoisi) {
      pastille = '<span class="pill pill--chosen">✓ Ton prono</span>';
    } else if (rumeur.chaud && !prono) {
      pastille = '<span class="pill pill--hot">🔥 Chaud</span>';
    }

    // Barre d'action. Les sélections additionnelles ne sont accessibles que
    // depuis le pop-up : la carte ne propose donc que le bouton de prono.
    var cta;
    if (estBloque) {
      cta = '<div class="cta"><div class="cta__locked">🔒 Prono du jour déjà utilisé</div></div>';
    } else if (estChoisi) {
      cta =
        '<div class="cta">' +
          '<div class="cta__etat">' +
            '<b>Prono enregistré</b>' +
            '<small>Modifiable jusqu\'à minuit</small>' +
          '</div>' +
          '<button class="cta__go" type="button" data-ouvrir="' + rumeur.id + '">' +
            '<small>À gagner</small><b>' + prono.gain + ' €</b>' +
          '</button>' +
        '</div>';
    } else {
      cta =
        '<div class="cta">' +
          '<div class="cta__etat">' +
            '<b>Officialisé aujourd\'hui ?</b>' +
            '<small>Touche pour pronostiquer</small>' +
          '</div>' +
          '<button class="cta__go" type="button" data-valider="' + rumeur.id + '">' +
            '<small>Prono du jour</small><b>' + rumeur.gainBase + ' €</b>' +
          '</button>' +
        '</div>';
    }

    // La carte entière ouvre le pop-up ; une fois le prono posé, elle rouvre
    // la fiche pour ajuster les sélections.
    var action = estBloque ? '' :
      (estChoisi ? ' data-ouvrir="' + rumeur.id + '"' : ' data-valider="' + rumeur.id + '"');

    return (
      '<article class="' + classes + '" data-id="' + rumeur.id + '">' +
        '<button class="rumeur__banner" type="button"' + action +
          ' style="--from-color:' + rumeur.clubActuel.couleur + ';--to-color:' + rumeur.clubCible.couleur + '">' +
          (pastille ? '<div class="rumeur__flags">' + pastille + '</div>' : '') +
          '<span class="rumeur__avatar">' + echapper(rumeur.initiales) + '</span>' +
          '<span class="rumeur__ident">' +
            '<span class="rumeur__name">' + echapper(rumeur.joueur) +
              '<span class="rumeur__flag">' + rumeur.nationalite + '</span></span>' +
            '<span class="rumeur__meta">' + echapper(rumeur.poste) + ' <span class="dot">•</span> ' + rumeur.age + ' ans</span>' +
            '<span class="rumeur__route">' + gabaritRoute(rumeur) +
              '<span class="rumeur__fee">' + echapper(rumeur.montant) + '</span></span>' +
          '</span>' +
        '</button>' +

        '<button class="rumeur__article" type="button"' + action + '>' +
          '<span class="rumeur__source">' +
            '<span class="rumeur__source-name">' + echapper(rumeur.source) + '</span>' +
            '<span class="dot">•</span>' + echapper(rumeur.tempsSource) +
          '</span>' +
          '<span class="rumeur__titre">' + echapper(rumeur.titre) + '</span>' +
          '<span class="rumeur__chapo">' + echapper(rumeur.chapo) + '</span>' +
        '</button>' +

        '<div class="fiab">' +
          '<span class="fiab__label">Indice de fiabilité</span>' +
          '<span class="fiab__track"><span class="fiab__fill' + classeFiabilite(rumeur.fiabilite) + '" style="width:' + rumeur.fiabilite + '%"></span></span>' +
          '<span class="fiab__value">' + rumeur.fiabilite + ' %</span>' +
        '</div>' +

        cta +
      '</article>'
    );
  }

  function rendreFeed() {
    feed.innerHTML = rumeurs.map(gabaritRumeur).join('');
  }

  /* =========================================================
     Ticket du prono validé
     ========================================================= */
  function rendreTicket() {
    if (!prono) {
      ticketEl.hidden = true;
      ticketEl.innerHTML = '';
      return;
    }

    var rumeur = trouverRumeur(prono.rumeurId);
    if (!rumeur) { ticketEl.hidden = true; return; }

    var lignes = [{
      titre: 'Transfert officialisé aujourd\'hui',
      sous: rumeur.joueur + ' quitte ' + rumeur.clubActuel.nom,
      bonus: rumeur.gainBase
    }].concat(detailSelections(rumeur, prono.selections));

    ticketEl.innerHTML =
      '<div class="ticket__card">' +
        '<div class="ticket__top">🎟️ Ton prono du jour</div>' +
        '<div class="ticket__body">' +
          '<h2 class="ticket__joueur">' + echapper(rumeur.joueur) + '</h2>' +
          '<p class="ticket__route">' + echapper(rumeur.clubActuel.nom) + ' → ' + echapper(rumeur.clubCible.nom) + '</p>' +
          '<ul class="ticket__lignes">' +
            lignes.map(function (l) {
              return (
                '<li class="ticket__ligne">' +
                  '<span class="ticket__check" aria-hidden="true">✓</span>' +
                  '<span><b>' + echapper(l.titre) + '</b>' +
                    '<span class="ticket__ligne-sous">' + echapper(l.sous) + '</span></span>' +
                  '<span class="ticket__ligne-bonus">' + l.bonus + ' €</span>' +
                '</li>'
              );
            }).join('') +
          '</ul>' +
          '<div class="ticket__total">' +
            '<span class="ticket__total-label">Feebets à gagner</span>' +
            '<span class="total-wrap">' +
              '<img class="feebet-ico" src="assets/img/feebet.svg" alt="" width="26" height="26">' +
              '<span class="ticket__total-value">' + prono.gain + ' €</span>' +
            '</span>' +
          '</div>' +
          '<div class="ticket__actions">' +
            '<button class="ticket__edit" type="button" data-ouvrir="' + rumeur.id + '">Modifier</button>' +
            '<button class="ticket__cancel" type="button" id="ticket-cancel">Annuler mon prono</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    ticketEl.hidden = false;
  }

  /* =========================================================
     Série de prono
     ========================================================= */
  function rendreStreak() {
    var row = $('#streak-row');
    var serie = 0;

    for (var i = historique.length - 1; i >= 0; i--) {
      if (historique[i].gagne) serie++;
      else break;
    }

    var items = historique.map(function (h) {
      return '<span class="streak__item streak__item--' + (h.gagne ? 'win' : 'lose') + '"' +
        ' title="' + echapper(h.jour + ' — ' + h.libelle) + '"></span>';
    });

    items.push('<span class="streak__item streak__item--today' + (prono ? ' is-done' : '') +
      '" title="Aujourd\'hui"></span>');

    row.innerHTML = items.join('');

    $('#streak-label').innerHTML = prono
      ? 'Prono enregistré <span class="dot">•</span> série en cours : <b>' + serie + ' jours</b>'
      : 'Série en cours : <b>' + serie + ' jours</b> <span class="dot">•</span> ne la brise pas';
  }

  /* =========================================================
     Fiche rumeur (sélections additionnelles)
     ========================================================= */
  function rendreSheet() {
    var rumeur = brouillon.rumeur;
    var sel = brouillon.selections;

    var groupes = rumeur.boosters.map(function (groupe, gi) {
      var choisi = sel[groupe.id];
      var options = groupe.options.map(function (opt, oi) {
        return (
          '<button class="option' + (choisi === oi ? ' is-selected' : '') + '" type="button"' +
            ' data-groupe="' + groupe.id + '" data-option="' + oi + '"' +
            ' aria-pressed="' + (choisi === oi) + '">' +
            '<span class="option__radio" aria-hidden="true"></span>' +
            '<span class="option__label">' + echapper(opt.label) + '</span>' +
            '<span class="option__bonus">+' + opt.bonus + ' €</span>' +
          '</button>'
        );
      }).join('');

      return (
        '<div class="groupe' + (choisi !== undefined ? ' is-filled' : '') + '">' +
          '<h3 class="groupe__titre">' +
            '<span class="groupe__num">' + (choisi !== undefined ? '✓' : gi + 1) + '</span>' +
            echapper(groupe.titre) +
          '</h3>' +
          '<div class="options">' + options + '</div>' +
        '</div>'
      );
    }).join('');

    sheetScroll.innerHTML =
      '<div class="sheet__hero" style="--from-color:' + rumeur.clubActuel.couleur + ';--to-color:' + rumeur.clubCible.couleur + '">' +
        '<h2 class="sheet__joueur" id="sheet-joueur">' + echapper(rumeur.joueur) + ' ' + rumeur.nationalite + '</h2>' +
        '<p class="sheet__meta">' + echapper(rumeur.poste) + ' <span class="dot">•</span> ' + rumeur.age + ' ans' +
          ' <span class="dot">•</span> ' + echapper(rumeur.source) + ', ' + echapper(rumeur.tempsSource) + '</p>' +
        '<div class="sheet__route">' + gabaritRoute(rumeur) +
          '<span class="rumeur__fee">' + echapper(rumeur.montant) + '</span></div>' +
      '</div>' +

      '<div class="sheet__section">' +
        '<h3 class="sheet__article-titre">' + echapper(rumeur.titre) + '</h3>' +
        '<p class="sheet__article-texte">' + echapper(rumeur.chapo) + '</p>' +
      '</div>' +

      '<div class="base">' +
        '<span class="base__check" aria-hidden="true">✓</span>' +
        '<span class="base__texte">' +
          '<span class="base__t">Le transfert est officialisé aujourd\'hui</span>' +
          '<span class="base__s">Ton prono du jour, acquis par défaut</span>' +
        '</span>' +
        '<span class="base__gain"><b>' + rumeur.gainBase + ' €</b></span>' +
      '</div>' +

      '<div class="boosters">' +
        '<h3 class="boosters__intro">Booste tes feebets</h3>' +
        '<p class="boosters__sub">Chaque sélection ajoutée gonfle la cagnotte. Toutes doivent tomber juste pour être payées.</p>' +
        groupes +
      '</div>';

    majTotalSheet(false);
  }

  function majTotalSheet(anime) {
    var total = calculerGain(brouillon.rumeur, brouillon.selections);
    var el = $('#sheet-total');
    el.textContent = total + ' €';

    if (anime) {
      el.classList.add('is-bumped');
      setTimeout(function () { el.classList.remove('is-bumped'); }, 250);
    }

    var nb = Object.keys(brouillon.selections).length;
    $('#sheet-submit').textContent = prono && prono.rumeurId === brouillon.rumeur.id
      ? 'Mettre à jour mon prono'
      : 'Valider mon prono';
    $('#sheet-hint').textContent = nb === 0
      ? 'Sans sélection additionnelle, tu joues le transfert seul.'
      : nb + (nb > 1 ? ' sélections ajoutées' : ' sélection ajoutée') + ' — toutes doivent être justes.';
  }

  function ouvrirSheet(rumeurId) {
    var rumeur = trouverRumeur(rumeurId);
    if (!rumeur) return;

    // Un seul prono par jour : les autres rumeurs sont consultables mais figées.
    if (prono && prono.rumeurId !== rumeurId) {
      toast('Un seul prono par jour — reviens demain !');
      return;
    }

    brouillon = {
      rumeur: rumeur,
      selections: prono && prono.rumeurId === rumeurId
        ? JSON.parse(JSON.stringify(prono.selections))
        : {}
    };

    rendreSheet();
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sheet-open');
    sheetScroll.scrollTop = 0;
  }

  function fermerSheet() {
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sheet-open');
    brouillon = null;
  }

  /* =========================================================
     Modale de confirmation
     ---------------------------------------------------------
     Le bouton jaune ne valide plus directement : on demande
     d'abord si le joueur confirme ou s'il préfère enrichir son
     prono de sélections additionnelles.
     ========================================================= */
  function ouvrirModal(rumeurId) {
    var rumeur = trouverRumeur(rumeurId);
    if (!rumeur) return;

    rumeurEnAttente = rumeur;

    $('#modal-texte').innerHTML =
      'Tu paries que le transfert de <b>' + echapper(rumeur.joueur) + '</b> vers ' +
      echapper(rumeur.clubCible.nom) + ' sera officialisé aujourd\'hui.';
    $('#modal-gain').textContent = rumeur.gainBase + ' €';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sheet-open');
  }

  function fermerModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (!sheet.classList.contains('is-open')) {
      document.body.classList.remove('sheet-open');
    }
    rumeurEnAttente = null;
  }

  /* =========================================================
     Validation
     ========================================================= */
  function validerProno(rumeurId, selections) {
    var rumeur = trouverRumeur(rumeurId);
    if (!rumeur) return;

    selections = selections || {};
    prono = {
      date: jourISO(),
      rumeurId: rumeurId,
      selections: selections,
      gain: calculerGain(rumeur, selections)
    };
    sauver();

    rendreTout();
    majCompteur();

    toast('Prono validé · ' + prono.gain + ' € de feebets en jeu');

    // On remonte sur le ticket pour matérialiser la validation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function annulerProno() {
    prono = null;
    sauver();
    rendreTout();
    majCompteur();
    toast('Prono annulé — tu peux rejouer aujourd\'hui');
  }

  function rendreTout() {
    rendreTicket();
    rendreFeed();
    rendreStreak();
    $('#feed-head').hidden = false;
  }

  /* =========================================================
     Compte à rebours jusqu'à la clôture du jour
     ========================================================= */
  function majCompteur() {
    var fin = new Date();
    fin.setHours(23, 59, 59, 999);

    var reste = fin - new Date();
    var el = $('#countdown-value');
    var label = $('#countdown-label');

    label.textContent = prono ? 'Résultat dans' : 'Prono ouvert encore';

    if (reste <= 0) {
      el.textContent = 'Clôturé';
      return;
    }

    var h = Math.floor(reste / 3600000);
    var m = Math.floor(reste / 60000) % 60;
    var s = Math.floor(reste / 1000) % 60;
    el.textContent = String(h).padStart(2, '0') + 'h ' +
      String(m).padStart(2, '0') + 'm ' + String(s).padStart(2, '0') + 's';
  }

  function majDate() {
    var d = new Date();
    var texte = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    $('#hero-date').textContent = texte.charAt(0).toUpperCase() + texte.slice(1);
  }

  /* =========================================================
     Écouteurs
     ========================================================= */
  document.addEventListener('click', function (e) {
    // Le bouton jaune ouvre la confirmation, il ne valide pas d'emblée
    var direct = e.target.closest('[data-valider]');
    if (direct) { ouvrirModal(direct.dataset.valider); return; }

    // Modale : valider tel quel
    if (e.target.closest('#modal-valider') && rumeurEnAttente) {
      var id = rumeurEnAttente.id;
      fermerModal();
      validerProno(id, {});
      return;
    }

    // Modale : basculer vers les sélections additionnelles
    if (e.target.closest('#modal-booster') && rumeurEnAttente) {
      var idBoost = rumeurEnAttente.id;
      fermerModal();
      ouvrirSheet(idBoost);
      return;
    }

    if (e.target.closest('[data-close-modal]') || e.target === modal) { fermerModal(); return; }

    // Ouvrir la fiche
    var ouvrir = e.target.closest('[data-ouvrir]');
    if (ouvrir) { ouvrirSheet(ouvrir.dataset.ouvrir); return; }

    // Choisir / retirer une sélection additionnelle
    var option = e.target.closest('.option');
    if (option && brouillon) {
      var g = option.dataset.groupe;
      var o = +option.dataset.option;
      if (brouillon.selections[g] === o) delete brouillon.selections[g];
      else brouillon.selections[g] = o;

      // On redessine le groupe concerné sans perdre la position de scroll
      var pos = sheetScroll.scrollTop;
      rendreSheet();
      sheetScroll.scrollTop = pos;
      majTotalSheet(true);
      return;
    }

    if (e.target.closest('[data-close-sheet]') || e.target === sheet) { fermerSheet(); return; }

    if (e.target.closest('#sheet-submit') && brouillon) {
      var r = brouillon.rumeur.id;
      var s = brouillon.selections;
      fermerSheet();
      validerProno(r, s);
      return;
    }

    if (e.target.closest('#ticket-cancel')) { annulerProno(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('is-open')) fermerModal();
    else fermerSheet();
  });

  /* =========================================================
     Démarrage
     ========================================================= */
  prono = charger();
  majDate();
  rendreTout();
  majCompteur();
  setInterval(majCompteur, 1000);
})();
