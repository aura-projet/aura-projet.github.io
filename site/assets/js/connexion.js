/* AURA · page de connexion (version bêta).
   - Connexion : le formulaire part directement vers le tableau de bord, en
     HTTPS, à l'adresse dashboard.loginUrl de assets/data/config.json. Ce site
     ne lit ni ne garde les identifiants. Sans adresse, la connexion reste fermée.
   - Demande de compte et mot de passe oublié : un ticket pour le support AURA,
     envoyé par Formspree (support.endpoint), sinon par la messagerie
     (supportEmail), sinon copié dans le presse-papiers.
   Le mot de passe de remplacement est généré par le support, jamais ici. */
(function () {
  'use strict';
  function el(id) { return document.getElementById(id); }
  if (!el('form-connexion')) return;

  function en() { return document.documentElement.lang === 'en'; }
  var T = {
    requis: ['Ce champ est obligatoire.', 'This field is required.'],
    email: ['Saisissez une adresse e-mail valide, par exemple nom@domaine.fr.', 'Enter a valid email address, for example name@domain.com.'],
    nom: ['Indiquez votre nom et votre prénom (2 à 80 caractères).', 'Enter your first and last name (2 to 80 characters).'],
    accord: ['Votre accord est nécessaire pour envoyer la demande.', 'Your consent is needed to send the request.'],
    captchaQ: ['Vérification anti-robot : combien font {a} + {b} ?', 'Anti-robot check: what is {a} + {b}?'],
    captchaKo: ['Ce n’est pas le bon résultat. Réessayez ou changez de calcul.', 'That is not the right result. Try again or get another sum.'],
    verifier: ['Vérifiez les champs indiqués.', 'Please check the highlighted fields.'],
    trop: ['Envoi bloqué par les contrôles anti-robot. Patientez quelques secondes et réessayez.', 'Sending blocked by the anti-robot checks. Wait a few seconds and try again.'],
    ferme: ['Pendant la bêta, le tableau de bord tourne sur le serveur de l’IUT et n’est pas encore ouvert sur Internet. Demandez un compte : le support vous recontacte dès que l’accès en ligne est prêt.',
      'During the beta, the dashboard runs on the IUT server and is not open to the Internet yet. Request an account: support will get back to you as soon as online access is ready.'],
    redirige: ['Connexion au serveur AURA…', 'Connecting to the AURA server…'],
    envoi: ['Envoi en cours, ne fermez pas la page.', 'Sending, please keep this page open.'],
    ok: ['Votre demande est bien partie au support AURA. Vous recevrez une réponse à l’adresse indiquée.', 'Your request has been sent to AURA support. You will get a reply at the address you entered.'],
    okOubli: ['Ticket envoyé. Si un compte existe pour cette adresse, le support vous envoie un nouveau mot de passe généré aléatoirement.', 'Ticket sent. If an account exists for this address, support will email you a new randomly generated password.'],
    refus: ['Le service d’envoi a refusé la demande. Vos informations sont conservées, vous pouvez réessayer.', 'The sending service refused the request. Your details are kept, you can try again.'],
    reseau: ['La réception n’a pas pu être confirmée (connexion coupée ou délai dépassé). Vérifiez avant de renvoyer pour éviter un doublon.', 'Delivery could not be confirmed (connection lost or timed out). Check before sending again to avoid a duplicate.'],
    mail: ['Votre messagerie s’ouvre avec le ticket déjà rédigé. Il ne reste qu’à l’envoyer.', 'Your email app opens with the ticket already written. You just need to send it.'],
    copie: ['L’adresse du support n’est pas encore publiée sur ce site. Votre ticket est copié : collez-le dans un message à l’équipe AURA.', 'The support address is not published on this site yet. Your ticket has been copied: paste it into a message to the AURA team.'],
    copieKo: ['L’adresse du support n’est pas encore publiée sur ce site, et la copie automatique a échoué. Notez votre demande et réessayez plus tard.', 'The support address is not published on this site yet, and automatic copy failed. Note your request and try again later.']
  };
  function t(key, vars) {
    var s = T[key][en() ? 1 : 0];
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }

  /* ---------------- Configuration ---------------- */
  var cfg = { loginUrl: '', endpoint: '', supportEmail: '' };
  var EMAIL_RE = /^[^\s@<>?&#]+@[^\s@<>?&#]+\.[^\s@<>?&#]+$/;
  function configure(raw) {
    raw = raw || {};
    var dash = raw.dashboard || {};
    if (typeof dash.loginUrl === 'string' && dash.loginUrl) {
      try {
        var u = new URL(dash.loginUrl);
        // HTTPS uniquement, sans identifiants dans l'URL.
        if (u.protocol === 'https:' && !u.username && !u.password) cfg.loginUrl = u.href;
      } catch (e) { /* adresse invalide : connexion fermée */ }
    }
    var support = raw.support || {};
    if (typeof support.endpoint === 'string' && /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(support.endpoint)) cfg.endpoint = support.endpoint;
    if (typeof raw.supportEmail === 'string' && EMAIL_RE.test(raw.supportEmail)) cfg.supportEmail = raw.supportEmail;
  }
  document.addEventListener('aura:config', function (e) { configure(e.detail); });
  if (window.AURA_CONFIG) configure(window.AURA_CONFIG);

  /* ---------------- Onglets ---------------- */
  var tablist = document.querySelector('.cx-onglets');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.cx-onglet'));
  var NOMS = ['connexion', 'demande', 'oubli'];
  function choisir(nom, focus) {
    var i = NOMS.indexOf(nom);
    if (i < 0) i = 0;
    tabs.forEach(function (tab, j) {
      var actif = i === j;
      tab.setAttribute('aria-selected', String(actif));
      tab.tabIndex = actif ? 0 : -1;
      el(tab.getAttribute('aria-controls')).hidden = !actif;
    });
    if (focus) tabs[i].focus();
  }
  tablist.hidden = false;
  document.querySelector('.cx__carte').classList.add('a-onglets');
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      choisir(NOMS[i]);
      history.replaceState(null, '', '#' + NOMS[i]);
    });
    tab.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      choisir(NOMS[n], true);
      history.replaceState(null, '', '#' + NOMS[n]);
    });
  });
  document.querySelectorAll('[data-onglet]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var nom = a.getAttribute('data-onglet');
      choisir(nom, true);
      history.replaceState(null, '', '#' + nom);
    });
  });
  choisir((location.hash || '').slice(1));
  window.addEventListener('hashchange', function () { choisir(location.hash.slice(1)); });

  /* ---------------- Outils de formulaire ---------------- */
  function erreur(input, texte) {
    var p = el(input.id + '-erreur');
    if (p) p.textContent = texte || '';
    input.setAttribute('aria-invalid', texte ? 'true' : 'false');
    return Boolean(texte);
  }
  function verifierEmail(input) {
    var v = input.value.trim();
    if (!v) return erreur(input, t('requis'));
    if (!input.validity.valid || v.length > 254 || !EMAIL_RE.test(v)) return erreur(input, t('email'));
    return erreur(input, '');
  }
  function statut(id, texte, isErreur) {
    var p = el(id);
    p.textContent = texte;
    p.dataset.error = String(Boolean(isErreur));
  }

  var captchas = {};
  function nouveauCaptcha(prefix) {
    var a = 1 + Math.floor(Math.random() * 9), b = 1 + Math.floor(Math.random() * 9);
    captchas[prefix] = { a: a, b: b, attendu: a + b, debut: Date.now() };
    el(prefix + '-captcha').value = '';
    el(prefix + '-captcha-q').textContent = t('captchaQ', { a: a, b: b });
    erreur(el(prefix + '-captcha'), '');
  }
  function captchaOk(prefix) {
    var input = el(prefix + '-captcha'), v = input.value.trim();
    var bon = /^[0-9]{1,3}$/.test(v) && Number(v) === captchas[prefix].attendu;
    erreur(input, bon ? '' : (v ? t('captchaKo') : t('requis')));
    return bon;
  }
  ['dm', 'ob'].forEach(nouveauCaptcha);
  document.querySelectorAll('[data-captcha-nouveau]').forEach(function (b) {
    b.addEventListener('click', function () {
      var p = b.getAttribute('data-captcha-nouveau');
      nouveauCaptcha(p);
      el(p + '-captcha').focus();
    });
  });
  document.addEventListener('aura:language', function () {
    Object.keys(captchas).forEach(function (p) {
      el(p + '-captcha-q').textContent = t('captchaQ', captchas[p]);
    });
  });

  /* ---------------- Connexion ---------------- */
  var formConnexion = el('form-connexion');
  formConnexion.addEventListener('submit', function (e) {
    var email = el('cx-email'), mdp = el('cx-mdp');
    var ko = verifierEmail(email);
    ko = erreur(mdp, mdp.value ? '' : t('requis')) || ko;
    if (ko) { e.preventDefault(); statut('cx-statut', t('verifier'), true); return; }
    if (!cfg.loginUrl) { e.preventDefault(); statut('cx-statut', t('ferme'), true); return; }
    // Envoi natif vers le serveur AURA : il pose sa propre session.
    formConnexion.action = cfg.loginUrl;
    statut('cx-statut', t('redirige'), false);
  });

  /* ---------------- Tickets support ---------------- */
  function copier(texte) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(texte);
    return new Promise(function (resolve, reject) {
      var zone = document.createElement('textarea');
      zone.value = texte;
      zone.setAttribute('readonly', '');
      zone.className = 'sr-only';
      document.body.appendChild(zone);
      zone.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      zone.remove();
      if (ok) resolve(); else reject(new Error('copie'));
    });
  }

  function envoyerTicket(opts) {
    var bouton = el(opts.bouton);
    if (bouton.disabled) return;
    if (opts.form.querySelector('.cx-pot input').value || Date.now() - captchas[opts.prefix].debut < 2500) {
      statut(opts.statut, t('trop'), true);
      return;
    }
    if (cfg.endpoint) {
      var data = new FormData();
      data.set('_subject', opts.sujet);
      data.set('email', opts.email);
      data.set('type', opts.type);
      data.set('message', opts.corps);
      bouton.disabled = true;
      opts.form.setAttribute('aria-busy', 'true');
      statut(opts.statut, t('envoi'), false);
      var controller = new AbortController();
      var minuteur = window.setTimeout(function () { controller.abort(); }, 20000);
      fetch(cfg.endpoint, {
        method: 'POST', body: data, headers: { Accept: 'application/json' },
        signal: controller.signal, credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer'
      }).then(function (r) {
        if (!r.ok) { statut(opts.statut, t('refus'), true); return; }
        opts.form.reset();
        statut(opts.statut, t(opts.ok), false);
        nouveauCaptcha(opts.prefix);
      }).catch(function () {
        statut(opts.statut, t('reseau'), true);
      }).finally(function () {
        window.clearTimeout(minuteur);
        bouton.disabled = false;
        opts.form.removeAttribute('aria-busy');
      });
      return;
    }
    if (cfg.supportEmail) {
      window.location.href = 'mailto:' + cfg.supportEmail + '?subject=' + encodeURIComponent(opts.sujet) + '&body=' + encodeURIComponent(opts.corps);
      statut(opts.statut, t('mail'), false);
      return;
    }
    copier(opts.sujet + '\n\n' + opts.corps).then(function () {
      statut(opts.statut, t('copie'), false);
    }, function () {
      statut(opts.statut, t('copieKo'), true);
    });
  }

  function premierInvalide(form) {
    var premier = form.querySelector('[aria-invalid="true"]');
    if (premier) premier.focus();
  }

  el('form-demande').addEventListener('submit', function (e) {
    e.preventDefault();
    var nom = el('dm-nom'), email = el('dm-email'), structure = el('dm-structure'), besoin = el('dm-besoin'), accord = el('dm-accord');
    var n = nom.value.trim();
    var ko = erreur(nom, n.length < 2 || n.length > 80 ? (n ? t('nom') : t('requis')) : '');
    ko = verifierEmail(email) || ko;
    ko = !captchaOk('dm') || ko;
    ko = erreur(accord, accord.checked ? '' : t('accord')) || ko;
    if (ko) { statut('dm-statut', t('verifier'), true); premierInvalide(this); return; }
    var adresse = email.value.trim();
    envoyerTicket({
      form: this, prefix: 'dm', bouton: 'dm-envoyer', statut: 'dm-statut', ok: 'ok', type: 'creation-compte', email: adresse,
      sujet: '[AURA bêta] Demande de création de compte',
      corps: 'Bonjour,\n\nJe souhaite un compte pour la version bêta d’AURA.\n\n'
        + 'Nom : ' + n + '\n'
        + 'Adresse e-mail pour me recontacter : ' + adresse + '\n'
        + 'Structure : ' + (structure.value.trim() || 'non précisée') + '\n'
        + 'Besoin : ' + (besoin.value.trim() || 'non précisé') + '\n\nMerci.'
    });
  });

  el('form-oubli').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = el('ob-email');
    var ko = verifierEmail(email);
    ko = !captchaOk('ob') || ko;
    if (ko) { statut('ob-statut', t('verifier'), true); premierInvalide(this); return; }
    var adresse = email.value.trim();
    envoyerTicket({
      form: this, prefix: 'ob', bouton: 'ob-envoyer', statut: 'ob-statut', ok: 'okOubli', type: 'mot-de-passe-oublie', email: adresse,
      sujet: '[AURA bêta] Mot de passe oublié',
      corps: 'Bonjour,\n\nJe demande un nouveau mot de passe pour mon compte AURA (version bêta).\n\n'
        + 'Adresse e-mail du compte : ' + adresse + '\n\n'
        + 'Merci de générer un nouveau mot de passe aléatoire et de l’envoyer à cette adresse.'
    });
  });
})();
