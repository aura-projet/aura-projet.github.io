/* AURA suggestions : captcha maison (calcul simple), sans service externe.
   Note honnête : une vérification 100% côté navigateur n'arrête pas un robot
   déterminé. Associée au honeypot et au délai minimal, elle filtre les envois
   automatiques les plus simples. L'envoi réel passe par Formspree quand un
   endpoint est renseigné dans assets/data/config.json ; sinon, les options
   « copier » et « préparer un e-mail » restent disponibles. */
(function () {
  'use strict';
  var form = document.getElementById('suggestion-form');
  if (!form) return;
  function el(id) { return document.getElementById(id); }
  var submit = el('suggestion-submit');
  var fields = el('suggestion-fields');
  var status = el('suggestion-status');
  var captchaStatus = el('captcha-status');
  var question = el('captcha-question');
  var answer = el('captcha-answer');
  var refresh = el('captcha-refresh');
  var type = el('suggestion-type');
  var subject = el('suggestion-subject');
  var detail = el('suggestion-detail');
  var email = el('suggestion-email');
  var consent = el('suggestion-consent');
  var busy = false, captchaOk = false, expected = null;
  var endpoint = '', endpointReady = false, supportEmail = '', configReceived = false;
  var started = Date.now();
  var allowedTypes = ['usage', 'interface', 'fonctionnalite', 'documentation', 'autre'];

  function message(text, error) {
    status.textContent = text;
    status.dataset.error = String(Boolean(error));
  }
  function updateButton() { submit.disabled = !captchaOk || busy; }

  // --- Captcha maison : une simple addition de deux chiffres. ---
  function newCaptcha() {
    var a = 1 + Math.floor(Math.random() * 9);
    var b = 1 + Math.floor(Math.random() * 9);
    expected = a + b;
    captchaOk = false;
    answer.value = '';
    answer.setAttribute('aria-invalid', 'false');
    question.textContent = 'Pour vérifier que vous n’êtes pas un robot : combien font ' + a + ' + ' + b + ' ?';
    captchaStatus.textContent = 'Répondez à la question pour activer l’envoi.';
    updateButton();
  }
  function checkCaptcha() {
    var value = answer.value.trim();
    captchaOk = value !== '' && /^[0-9]+$/.test(value) && Number(value) === expected;
    if (value === '') captchaStatus.textContent = 'Répondez à la question pour activer l’envoi.';
    else if (captchaOk) captchaStatus.textContent = 'Merci, vérification réussie. Vous pouvez envoyer votre suggestion.';
    else captchaStatus.textContent = 'Ce n’est pas le bon résultat. Réessayez, ou changez de question.';
    answer.setAttribute('aria-invalid', value !== '' && !captchaOk ? 'true' : 'false');
    updateButton();
  }
  answer.addEventListener('input', checkCaptcha);
  refresh.addEventListener('click', function () { newCaptcha(); answer.focus(); });
  newCaptcha();

  function configure(cfg) {
    if (configReceived) return;
    configReceived = true;
    cfg = cfg || {};
    if (typeof cfg.supportEmail === 'string' && /^[^\s@<>?&#]+@[^\s@<>?&#]+\.[^\s@<>?&#]+$/.test(cfg.supportEmail)) {
      supportEmail = cfg.supportEmail;
    }
    var settings = cfg.suggestions || {};
    // Exact Formspree origin/path only ; aucune URL arbitraire acceptée.
    if (typeof settings.endpoint === 'string' && /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(settings.endpoint)) {
      endpoint = settings.endpoint;
      endpointReady = true;
    }
  }
  document.addEventListener('aura:config', function (event) { configure(event.detail); });
  if (window.AURA_CONFIG) configure(window.AURA_CONFIG);

  function fieldError(control, id, text) {
    el(id).textContent = text;
    control.setAttribute('aria-invalid', text ? 'true' : 'false');
    return Boolean(text);
  }
  function validate() {
    var first = null;
    function check(control, id, text) {
      if (fieldError(control, id, text) && !first) first = control;
    }
    var s = subject.value.trim(), d = detail.value.trim();
    check(type, 'type-error', allowedTypes.indexOf(type.value) < 0 ? 'Choisissez un type de suggestion.' : '');
    check(subject, 'subject-error', s.length < 5 || s.length > 120 ? 'Le sujet doit contenir entre 5 et 120 caractères, hors espaces de début et de fin.' : '');
    check(detail, 'detail-error', d.length < 20 || d.length > 2000 ? 'Décrivez votre idée en 20 à 2 000 caractères, hors espaces de début et de fin.' : '');
    check(email, 'email-error', email.value && (!email.validity.valid || email.value.length > 254) ? 'Saisissez une adresse e-mail valide ou laissez ce champ vide.' : '');
    check(consent, 'consent-error', !consent.checked ? 'Votre accord est nécessaire pour envoyer ce formulaire.' : '');
    if (first) { message('Vérifiez les champs indiqués avant de poursuivre.', true); first.focus(); }
    return !first;
  }
  detail.addEventListener('input', function () { el('suggestion-count').textContent = String(detail.value.length); });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (busy) return;
    if (!validate()) return;
    if (el('suggestion-website').value || Date.now() - started < 3000) {
      message('Envoi bloqué par les contrôles auxiliaires. Patientez quelques secondes et laissez le champ masqué vide.', true);
      return;
    }
    checkCaptcha();
    if (!captchaOk) {
      message('La vérification anti-robot n’est pas validée. Répondez à la question de calcul avant d’envoyer.', true);
      answer.focus();
      return;
    }
    if (!endpointReady) {
      message('L’envoi n’est pas encore configuré. Vous pouvez copier votre suggestion ou préparer un e-mail ci-dessous.', true);
      return;
    }
    var data = new FormData();
    data.set('type', type.value);
    data.set('subject', subject.value.trim());
    data.set('message', detail.value.trim());
    if (email.value.trim()) data.set('email', email.value.trim());
    data.set('consent', 'accepted');
    data.set('_gotcha', el('suggestion-website').value);
    busy = true;
    fields.disabled = true;
    updateButton();
    submit.textContent = 'Envoi en cours…';
    form.setAttribute('aria-busy', 'true');
    message('Envoi en cours. Ne fermez pas cette page.');
    var controller = new AbortController();
    var timeout = window.setTimeout(function () { controller.abort(); }, 20000);
    try {
      var response = await fetch(endpoint, {
        method: 'POST', body: data, headers: { Accept: 'application/json' },
        signal: controller.signal, credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer'
      });
      if (!response.ok) {
        message(response.status === 429 ? 'Le service limite les envois. Attendez un peu avant de réessayer.' : 'Le service a refusé cet envoi. Votre texte est conservé ; vous pouvez réessayer.', true);
      } else {
        form.reset();
        el('suggestion-count').textContent = '0';
        message('Votre suggestion a été acceptée par le service d’envoi. Merci de contribuer au projet.');
        status.focus();
        started = Date.now();
        newCaptcha();
      }
    } catch (error) {
      message('La réception n’a pas pu être confirmée (connexion interrompue ou délai dépassé). Votre texte est conservé. Vérifiez avant de renvoyer pour éviter un doublon.', true);
    } finally {
      window.clearTimeout(timeout);
      busy = false;
      fields.disabled = false;
      submit.textContent = 'Envoyer ma suggestion';
      form.setAttribute('aria-busy', 'false');
      checkCaptcha();
    }
  });

  function asText() {
    var label = type.options[type.selectedIndex];
    return ['Suggestion pour AURA', 'Type : ' + (type.value && label ? label.textContent : 'Non précisé'),
      'Sujet : ' + subject.value.trim(), '', detail.value.trim(), '',
      email.value.trim() ? 'E-mail de contact : ' + email.value.trim() : 'Sans adresse de contact'].join('\n');
  }
  var relais = el('suggestion-send');
  var statut = el('alternative-status');

  relais.addEventListener('click', async function () {
    var text = asText();
    var copie = false;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(text);
      copie = true;
      el('suggestion-copy-text').hidden = true;
    } catch (error) {
      var zone = el('suggestion-copy-text');
      zone.value = text;
      zone.hidden = false;
      zone.focus();
      zone.select();
    }
    if (!supportEmail) {
      statut.textContent = copie
        ? 'Texte copié. L’adresse de contact n’est pas configurée : collez-le dans votre messagerie. Rien n’a été envoyé.'
        : 'La copie automatique est indisponible. Copiez le texte sélectionné, rien n’a été envoyé.';
      return;
    }
    statut.textContent = (copie ? 'Texte copié. ' : 'La copie automatique est indisponible, le texte est sélectionné ci-dessous. ')
      + 'Votre messagerie devrait s’ouvrir avec le brouillon. Vérifiez-le avant de l’envoyer : rien ne part automatiquement.';
    window.location.href = 'mailto:' + supportEmail
      + '?subject=' + encodeURIComponent('Suggestion AURA : ' + subject.value.trim())
      + '&body=' + encodeURIComponent(text);
  });
})();
