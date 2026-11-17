/* AURA · interactions locales. Les données de démonstration sont fictives. */
document.documentElement.classList.add('js');
(function () {
  'use strict';
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function loadConfig() {
    return fetch('assets/data/config.json', { cache: 'no-cache' })
      .then(function (response) { return response.ok ? response.json() : {}; })
      .then(function (cfg) { return cfg && typeof cfg === 'object' && !Array.isArray(cfg) ? cfg : {}; })
      .catch(function () { return {}; });
  }
  function applyConfig(cfg) {
    document.querySelectorAll('[data-config="supportEmail"]').forEach(function (el) {
      if (typeof cfg.supportEmail !== 'string' || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(cfg.supportEmail)) return;
      var link = document.createElement('a');
      link.href = 'mailto:' + cfg.supportEmail; link.textContent = cfg.supportEmail;
      el.textContent = ''; el.appendChild(link);
    });
    var socials = Array.isArray(cfg.socials) ? cfg.socials.filter(function (social) {
      if (!social || typeof social.url !== 'string') return false;
      try { return /^https?:$/.test(new URL(social.url).protocol); } catch (error) { return false; }
    }) : [];
    document.querySelectorAll('[data-socials]').forEach(function (el) {
      if (!socials.length) return;
      el.textContent = '';
      socials.forEach(function (social) {
        var link = document.createElement('a'); link.href = social.url;
        link.target = '_blank'; link.rel = 'noopener noreferrer';
        link.textContent = typeof social.label === 'string' ? social.label : new URL(social.url).hostname;
        el.appendChild(link);
      });
    });
  }

  function initNav() {
    var nav = document.getElementById('nav');
    var burger = document.getElementById('burger');
    var menu = document.getElementById('menu');
    if (nav) {
      function scrollState() { nav.classList.toggle('is-scrolled', window.scrollY > 10); }
      window.addEventListener('scroll', scrollState, { passive: true }); scrollState();
    }
    if (!burger || !menu) return;
    function mobile() { return window.getComputedStyle(burger).display !== 'none'; }
    function open() { return burger.getAttribute('aria-expanded') === 'true'; }
    function setMenu(value, returnFocus) {
      burger.setAttribute('aria-expanded', String(value));
      burger.setAttribute('aria-label', value ? 'Fermer le menu' : 'Ouvrir le menu');
      menu.classList.toggle('is-open', value);
      menu.inert = mobile() && !value;
      if (returnFocus) burger.focus();
    }
    burger.addEventListener('click', function () {
      var next = !open(); setMenu(next, false);
      if (next) {
        var first = menu.querySelector('a[href], button:not([disabled])');
        if (first) requestAnimationFrame(function () {
          if (open() && mobile()) first.focus();
        });
      }
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false, mobile()); });
    });
    document.addEventListener('keydown', function (event) {
      if (!open() || !mobile()) return;
      if (event.key === 'Escape') { event.preventDefault(); setMenu(false, true); return; }
      if (event.key !== 'Tab') return;
      var focusable = [burger].concat(Array.prototype.slice.call(menu.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')))
        .filter(function (el) { return el.getClientRects().length > 0; });
      var first = focusable[0], last = focusable[focusable.length - 1];
      var active = document.activeElement;
      if (event.shiftKey && (active === first || focusable.indexOf(active) === -1)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (active === last || focusable.indexOf(active) === -1)) {
        event.preventDefault(); first.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (open() && !menu.contains(event.target) && !burger.contains(event.target)) setMenu(false, false);
    });
    window.addEventListener('resize', function () {
      if (!mobile()) setMenu(false, false);
      else menu.inert = !open();
    }, { passive: true });
    setMenu(false, false);
  }

  function initMotionControls() {
    var button = document.getElementById('motion-toggle');
    var userPaused = false;
    function update() {
      var paused = userPaused || motion.matches;
      window.AURA_MOTION_PAUSED = paused;
      document.documentElement.classList.toggle('is-motion-paused', paused);
      if (button) {
        button.setAttribute('aria-pressed', String(paused));
        button.disabled = motion.matches;
        button.textContent = motion.matches ? 'Animations réduites selon vos préférences' : paused ? 'Reprendre les animations' : 'Mettre les animations en pause';
      }
      document.dispatchEvent(new CustomEvent('aura:motion', { detail: { paused: paused } }));
    }
    if (button) button.addEventListener('click', function () { userPaused = !userPaused; update(); });
    if (motion.addEventListener) motion.addEventListener('change', update);
    update();
  }

  function initReading() {
    if (!('IntersectionObserver' in window)) return;
    var statement = document.querySelector('.statement');
    if (statement) {
      new IntersectionObserver(function (entries, observer) {
        if (entries[0].isIntersecting) { statement.classList.add('is-in-view'); observer.disconnect(); }
      }, { threshold: 0.6 }).observe(statement);
    }
    var links = Array.prototype.slice.call(document.querySelectorAll('#menu a[href^="#"]'));
    var sections = links.map(function (link) { return document.getElementById(link.hash.slice(1)); }).filter(Boolean);
    var queued = false;
    function update() {
      queued = false;
      var current = null;
      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        if (rect.top <= innerHeight * .4 && rect.bottom > 116) current = section.id;
      });
      links.forEach(function (link) {
        if (link.hash === '#' + current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();
  }

  function initHow() {
    var svg = document.getElementById('how-svg') || document.querySelector('.how-svg');
    var caption = document.getElementById('how-caption');
    var steps = Array.prototype.slice.call(document.querySelectorAll('.how__step[data-step]'));
    if (!svg || !steps.length) return;
    var current = null, queued = false;
    function update() {
      queued = false;
      var line = window.innerHeight * 0.45, nearest = steps[0], distance = Infinity;
      steps.forEach(function (step) {
        var rect = step.getBoundingClientRect();
        var delta = line < rect.top ? rect.top - line : line > rect.bottom ? line - rect.bottom : 0;
        if (delta < distance) { nearest = step; distance = delta; }
      });
      var n = nearest.getAttribute('data-step');
      if (n === current) return;
      current = n;
      Array.prototype.slice.call(svg.classList).forEach(function (name) { if (/^step-\d+$/.test(name)) svg.classList.remove(name); });
      svg.classList.add('step-' + n);
      document.dispatchEvent(new CustomEvent('aura:step', { detail: { step: Number(n) } }));
      steps.forEach(function (step) {
        var active = step === nearest; step.classList.toggle('is-active', active);
        if (active) step.setAttribute('aria-current', 'step'); else step.removeAttribute('aria-current');
      });
      var title = nearest.querySelector('h3');
      if (caption) caption.textContent = n + ' / ' + steps.length + (title ? ' · ' + title.textContent.trim() : '');
    }
    function requestUpdate() { if (!queued) { queued = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    window.addEventListener('load', requestUpdate, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(requestUpdate);
    update();
  }

  function initStrip() {
    var strip = document.getElementById('strip');
    var button = document.getElementById('strip-pause');
    if (!strip || !button) return;
    var track = strip.querySelector('.strip__track');
    var userPaused = false, visible = true;
    function update() {
      var paused = userPaused || motion.matches || Boolean(window.AURA_MOTION_PAUSED);
      strip.classList.toggle('is-paused', paused);
      if (track) track.style.animationPlayState = paused || document.hidden || !visible ? 'paused' : 'running';
      button.setAttribute('aria-pressed', String(paused));
      button.disabled = motion.matches;
      var label = motion.matches ? 'Défilement arrêté : mouvement réduit' : paused ? 'Reprendre le défilement' : 'Mettre le défilement en pause';
      button.setAttribute('aria-label', label); button.textContent = label;
    }
    button.addEventListener('click', function () { userPaused = !userPaused; update(); });
    document.addEventListener('visibilitychange', update);
    document.addEventListener('aura:motion', update);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; update(); }).observe(strip);
    }
    if (motion.addEventListener) motion.addEventListener('change', update);
    update();
  }

  function initDemo() {
    var feed = document.getElementById('feed'), next = document.getElementById('demo-next');
    if (!feed) return;
    // One deterministic inventory drives both tables and counters. Known includes offline devices.
    var inventory;
    var index = 0;
    function resetInventory() {
      inventory = {
        compta: { known: true, state: 'online' }, accueil: { known: true, state: 'online' },
        imp: { known: true, state: 'online' }, nas: { known: true, state: 'online' },
        new1: { known: false, state: 'waiting' }, new2: { known: false, state: 'waiting' },
        ap1: { known: true, state: 'online' }, ap2: { known: true, state: 'online' },
        ap3: { known: false, state: 'unknown', alert: true }, ap4: { known: false, state: 'waiting' },
        cl1: { known: true, state: 'online' }
      };
    }
    var labels = { online: 'Connu', offline: 'Hors ligne', waiting: 'Non observé', unknown: 'À qualifier', probable: 'Partage probable' };
    function rowFor(id) {
      return document.querySelector('#tbl-lan [data-row="' + id + '"], #tbl-wifi [data-row="' + id + '"]');
    }
    function cellLabel(id, column, fallback) {
      var row = rowFor(id);
      return row && row.cells && row.cells[column] ? row.cells[column].textContent.trim() : fallback;
    }
    var new1Mac = cellLabel('new1', 1, '02:00:00:00:00:21');
    var new2Mac = cellLabel('new2', 1, '02:00:00:00:00:22');
    var ap3Name = cellLabel('ap3', 0, 'borne de démonstration');
    function sync() {
      var known = 0, unknown = 0, alerts = 0;
      Object.keys(inventory).forEach(function (id) {
        var item = inventory[id];
        if (item.state !== 'waiting') { if (item.known) known++; else unknown++; }
        if (item.alert) alerts++;
        var row = rowFor(id);
        if (!row) return;
        row.setAttribute('data-state', item.state);
        row.classList.toggle('is-offline', item.state === 'offline');
        row.classList.toggle('is-alert', Boolean(item.alert));
        row.classList.toggle('is-pending', item.state === 'waiting');
        var status = row.querySelector('[data-status], .st, .status, .state, .pill, .badge, .tag');
        if (!status && row.cells && row.cells.length) status = row.cells[row.cells.length - 1];
        if (status) {
          status.textContent = labels[item.state];
          status.setAttribute('data-state', item.state);
          ['ok', 'warn', 'bad', 'off', 'muted'].forEach(function (name) {
            status.classList.remove('st--' + name, 'status--' + name);
          });
          var tone = item.state === 'waiting' || item.state === 'offline' ? 'off' : item.alert ? 'warn' : 'ok';
          status.classList.add('st', 'st--' + tone);
        }
      });
      [['kpi-known', known], ['kpi-unknown', unknown], ['kpi-alerts', alerts]].forEach(function (pair) {
        var el = document.getElementById(pair[0]); if (el) el.textContent = String(pair[1]);
      });
      document.dispatchEvent(new CustomEvent('aura:demo-update', { detail: { step: index } }));
    }
    function push(entry) {
      var li = document.createElement('li'); li.className = 'feed__item';
      var severity = document.createElement('i'); severity.className = 'sev sev--' + entry.sev; severity.setAttribute('aria-hidden', 'true');
      var body = document.createElement('div');
      var title = document.createElement('strong'); title.textContent = entry.title;
      var detail = document.createElement('span'); detail.textContent = entry.detail;
      body.appendChild(title); body.appendChild(detail);
      var time = document.createElement('time'); time.dateTime = entry.time; time.textContent = 'Démo · ' + entry.time;
      li.appendChild(severity); li.appendChild(body); li.appendChild(time);
      feed.insertBefore(li, feed.firstChild);
      while (feed.children.length > 3) feed.removeChild(feed.lastChild);
    }
    function initial() {
      resetInventory(); index = 0; feed.textContent = '';
      push({ sev: 'low', title: 'Référentiel chargé', detail: 'Jeu fictif : sept équipements connus. Aucune donnée du réseau réel.', time: '10:00' });
      push({ sev: 'low', title: 'Inventaire de démonstration', detail: 'Les observations filaires et radio sont regroupées ici.', time: '10:02' });
      push({ sev: 'mid', title: 'Borne non déclarée probable', detail: 'SSID fictif « ' + ap3Name + ' » · Wi-Fi 2,4 GHz · à vérifier.', time: '10:04' });
      sync();
      if (next) { next.textContent = 'Simuler un événement'; next.setAttribute('aria-label', 'Simuler le prochain événement fictif'); }
    }
    var events = [
      { sev: 'high', time: '10:05', title: 'Nouvel appareil à qualifier', detail: 'MAC fictive ' + new1Mac + ' · observation LAN · emplacement non déterminé.', apply: function () { inventory.new1.state = 'unknown'; inventory.new1.alert = true; } },
      { sev: 'mid', time: '10:06', title: 'Partage de connexion probable', detail: 'PC-COMPTA hors ligne et nouvelle borne 2,4 GHz : corrélation à vérifier, pas une preuve.', apply: function () { inventory.compta.state = 'offline'; inventory.ap4.state = 'probable'; inventory.ap4.alert = true; } },
      { sev: 'high', time: '10:07', title: 'Deuxième appareil à qualifier', detail: 'MAC fictive ' + new2Mac + ' · absent du référentiel · vérification administrateur nécessaire.', apply: function () { inventory.new2.state = 'unknown'; inventory.new2.alert = true; } },
      { sev: 'low', time: '10:08', title: 'Appareil validé dans la simulation', detail: 'L’administrateur fictif reconnaît ' + new1Mac + '. L’alerte associée est clôturée.', apply: function () { inventory.new1.state = 'online'; inventory.new1.known = true; inventory.new1.alert = false; } }
    ];
    initial();
    document.addEventListener('aura:demo-reset', initial);
    if (next) next.addEventListener('click', function () {
      if (index >= events.length) { initial(); return; }
      var event = events[index++]; event.apply(); sync(); push(event);
      next.textContent = index >= events.length ? 'Rejouer la démonstration' : 'Simuler un événement';
      next.setAttribute('aria-label', index >= events.length ? 'Rejouer la démonstration fictive depuis le début' : 'Simuler le prochain événement fictif');
    });
  }

  function initCarousel() {
    var track = document.getElementById('carousel');
    if (!track) return;
    document.querySelectorAll('[data-carousel]').forEach(function (button) {
      button.addEventListener('click', function () {
        var card = track.querySelector('.card');
        var step = card ? card.getBoundingClientRect().width + 22 : 400;
        track.scrollBy({ left: button.getAttribute('data-carousel') === 'next' ? step : -step, behavior: motion.matches ? 'auto' : 'smooth' });
      });
    });
  }
  function start() {
    var year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();
    initMotionControls(); initNav(); initReading(); initHow(); initStrip(); initDemo(); initCarousel();
    loadConfig().then(function (cfg) {
      window.AURA_CONFIG = cfg;
      applyConfig(cfg);
      document.dispatchEvent(new CustomEvent('aura:config', { detail: cfg }));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();