/* AURA · questionnaire de satisfaction.
   Trois modes, choisis dans assets/data/config.json (voir docs/site-web.md) :
     1. satisfaction.externalFormUrl renseigné : redirection vers ce formulaire
        (Tally, Microsoft Forms...).
     2. satisfaction.endpoint renseigné : envoi JSON vers ce service
        (compatible Formspree).
     3. sinon, si supportEmail est renseigné : ouverture d'un mail pré-rempli.
   Si rien n'est configuré, un message l'indique : on ne fait jamais croire
   à l'utilisateur que sa réponse est partie alors qu'elle n'est stockée nulle part. */
(function () {
  'use strict';

  var form = document.getElementById('survey');
  if (!form) return;
  var msg = document.getElementById('form-msg');
  var btn = document.getElementById('submit');
  var area = document.getElementById('commentaire');
  var count = document.getElementById('count');
  var cfg = null;

  area.addEventListener('input', function () { count.textContent = area.value.length; });

  document.addEventListener('aura:config', function (e) {
    cfg = e.detail || {};
    var ext = cfg.satisfaction && cfg.satisfaction.externalFormUrl;
    if (ext) window.location.replace(ext);
  });

  function setMsg(text, isError) {
    msg.textContent = text;
    msg.className = 'form-msg' + (isError ? ' form-msg--error' : '');
  }

  function collect() {
    var data = new FormData(form);
    var params = new URLSearchParams(window.location.search);
    return {
      note: data.get('note'),
      probleme: data.get('probleme') || '',
      points: data.getAll('points'),
      recommandation: data.get('recommandation') || '',
      commentaire: (data.get('commentaire') || '').trim(),
      source: params.get('src') || 'site',
      date: new Date().toISOString().slice(0, 10)
    };
  }

  function done() {
    try { localStorage.setItem('aura-avis-envoye', '1'); } catch (e) { /* navigation privée */ }
    document.getElementById('survey-wrap').hidden = true;
    var t = document.getElementById('thanks');
    t.hidden = false;
    t.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function asText(r) {
    return [
      'Note : ' + r.note + ' / 5',
      'Le problème parle : ' + (r.probleme || '-'),
      'Points marquants : ' + (r.points.join(', ') || '-'),
      'Recommandation : ' + (r.recommandation || '-') + ' / 10',
      'Commentaire : ' + (r.commentaire || '-'),
      'Source : ' + r.source + ' · ' + r.date
    ].join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.site_web.value) return; // robot
    var r = collect();
    if (!r.note) {
      setMsg('Merci de choisir une note de 1 à 5 étoiles.', true);
      form.querySelector('.stars input').focus();
      return;
    }

    var endpoint = cfg && cfg.satisfaction && cfg.satisfaction.endpoint;
    var email = cfg && cfg.supportEmail;

    if (endpoint) {
      btn.disabled = true;
      setMsg('Envoi en cours…');
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(r)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        done();
      }).catch(function () {
        btn.disabled = false;
        setMsg("L'envoi a échoué. Vérifiez votre connexion et réessayez.", true);
      });
      return;
    }

    if (email) {
      var subject = encodeURIComponent('Avis sur AURA (' + r.note + '/5)');
      window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + encodeURIComponent(asText(r));
      setMsg('Votre application de messagerie va s\'ouvrir : il ne reste qu\'à envoyer le mail.');
      return;
    }

    setMsg("Le questionnaire n'est pas encore relié à un service d'envoi. Merci de réessayer plus tard.", true);
  });

  try {
    if (localStorage.getItem('aura-avis-envoye')) {
      setMsg('Vous avez déjà répondu depuis cet appareil. Merci ! Vous pouvez répondre à nouveau si vous le souhaitez.');
    }
  } catch (e) { /* navigation privée */ }
})();
