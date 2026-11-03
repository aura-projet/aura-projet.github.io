/* AURA · script principal du site.
   Chargé sans "defer" pour poser la classe .js avant le premier rendu
   (évite un flash des éléments animés). Le reste attend le DOM. */
document.documentElement.classList.add('js');

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Configuration partagée (assets/data/config.json) ---------- */
  function loadConfig() {
    return fetch('assets/data/config.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; });
  }

  function applyConfig(cfg) {
    // Adresse de support : lien mailto si elle est renseignée.
    document.querySelectorAll('[data-config="supportEmail"]').forEach(function (el) {
      if (!cfg.supportEmail) return;
      el.textContent = '';
      var a = document.createElement('a');
      a.href = 'mailto:' + cfg.supportEmail;
      a.textContent = cfg.supportEmail;
      el.appendChild(a);
    });

    // Réseaux sociaux : seuls ceux qui ont une URL sont affichés.
    var socials = (cfg.socials || []).filter(function (s) { return s.url; });
    document.querySelectorAll('[data-socials]').forEach(function (el) {
      if (!socials.length) return;
      el.textContent = '';
      socials.forEach(function (s) {
        var a = document.createElement('a');
        a.href = s.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = s.label;
        el.appendChild(a);
      });
    });
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    var nav = document.getElementById('nav');
    var burger = document.getElementById('burger');
    var menu = document.getElementById('menu');
    if (nav) {
      var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 10); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    if (burger && menu) {
      burger.addEventListener('click', function () {
        var open = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', String(!open));
        menu.classList.toggle('is-open', !open);
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          burger.setAttribute('aria-expanded', 'false');
          menu.classList.remove('is-open');
        });
      });
    }
  }

  /* ---------- Apparition au défilement ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal, .milestone');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el, i) {
      if (el.classList.contains('milestone')) el.style.transitionDelay = (i % 9) * 0.06 + 's';
      io.observe(el);
    });
  }

  /* ---------- Texte qui s'allume mot à mot ---------- */
  function initScrub() {
    var el = document.getElementById('scrub');
    if (!el) return;
    var highlight = ['agent.', 'inventaire.', 'réseau.'];
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    var spans = words.map(function (w, i) {
      var s = document.createElement('span');
      s.className = 'w' + (highlight.indexOf(w) !== -1 ? ' hl' : '');
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      return s;
    });
    if (reduceMotion) { spans.forEach(function (s) { s.classList.add('on'); }); return; }

    var ticking = false;
    function update() {
      ticking = false;
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight;
      // 0 quand le haut du texte arrive à 85 % de l'écran, 1 quand le bas passe à 35 %.
      var start = vh * 0.85, end = vh * 0.35;
      var p = (start - r.top) / (start - end + r.height);
      p = Math.max(0, Math.min(1, p));
      var n = Math.round(p * spans.length);
      spans.forEach(function (s, i) { s.classList.toggle('on', i < n); });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Compteurs animés ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('.count');
    if (!counters.length) return;
    function run(el) {
      var to = parseInt(el.getAttribute('data-to'), 10) || 0;
      if (reduceMotion || to === 0) { el.textContent = to; return; }
      var t0 = null, dur = 1400;
      function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---------- Fonctionnement : schéma piloté par l'étape visible ---------- */
  function initHow() {
    var svg = document.getElementById('how-svg');
    var caption = document.getElementById('how-caption');
    var steps = document.querySelectorAll('.how__step');
    if (!svg || !steps.length) return;
    var names = ['Écouter', 'Recenser', 'Croiser', 'Localiser', 'Alerter'];
    function setStep(n) {
      svg.setAttribute('class', 'how-svg step-' + n);
      steps.forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-step') === String(n)); });
      if (caption) caption.textContent = n + ' / 5 · ' + names[n - 1];
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setStep(parseInt(e.target.getAttribute('data-step'), 10));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Carrousel des scénarios ---------- */
  function initCarousel() {
    var track = document.getElementById('carousel');
    if (!track) return;
    document.querySelectorAll('[data-carousel]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = track.querySelector('.card');
        var step = card ? card.getBoundingClientRect().width + 22 : 400;
        track.scrollBy({ left: btn.getAttribute('data-carousel') === 'next' ? step : -step, behavior: 'smooth' });
      });
    });
  }

  /* ---------- Parallaxe légère (sonde) ---------- */
  function initParallax() {
    var els = document.querySelectorAll('.parallax');
    if (!els.length || reduceMotion) return;
    var ticking = false;
    function update() {
      ticking = false;
      els.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        var center = r.top + r.height / 2 - window.innerHeight / 2;
        var speed = parseFloat(el.getAttribute('data-speed')) || 0;
        el.style.transform = 'translate3d(0,' + (center * speed).toFixed(1) + 'px,0)';
      });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Démo simulée du tableau de bord (données fictives) ---------- */
  var FAKE_ALERTS = [
    { sev: 'high', title: 'Appareil inconnu détecté', detail: 'MAC 3A:F1:…:9C · switch B2, port Gi1/0/14', kpi: 'kpi-unknown' },
    { sev: 'high', title: 'Borne Wi-Fi non déclarée', detail: 'SSID « Livebox-7F2A » · canal 6 · -48 dBm', kpi: 'kpi-ap' },
    { sev: 'mid',  title: 'Partage de connexion probable', detail: 'PC-COMPTA-03 a quitté le réseau · AP « iPhone de… » apparu', kpi: 'kpi-alerts' },
    { sev: 'mid',  title: 'Plusieurs MAC sur un même port', detail: '5 adresses derrière Gi1/0/22 en 40 s', kpi: 'kpi-alerts' },
    { sev: 'low',  title: 'Appareil validé', detail: 'Imprimante RDC passée en « connu »', kpi: 'kpi-known' },
    { sev: 'low',  title: 'Mode apprentissage', detail: '3 appareils vus tous les jours ouvrés → connus', kpi: 'kpi-known' },
    { sev: 'mid',  title: 'Appareil vu la nuit', detail: 'MAC 72:0B:…:11 actif à 02 h 14 → suspect', kpi: 'kpi-unknown' }
  ];

  function initDemo() {
    var feed = document.getElementById('feed');
    var graph = document.getElementById('mini-graph');
    if (!feed || !graph) return;

    // Graphe : un nœud central (AURA) et des appareils autour.
    var NS = 'http://www.w3.org/2000/svg';
    var cx = 200, cy = 125, nodes = [];
    var linesG = document.createElementNS(NS, 'g');
    var nodesG = document.createElementNS(NS, 'g');
    graph.appendChild(linesG); graph.appendChild(nodesG);
    for (var i = 0; i < 18; i++) {
      var a = (i / 18) * Math.PI * 2 + (i % 2) * 0.17;
      var rad = 62 + (i % 3) * 28;
      nodes.push({ x: cx + Math.cos(a) * rad * 1.45, y: cy + Math.sin(a) * rad * 0.9, a: a, rad: rad });
    }
    nodes.forEach(function (n) {
      var l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', cx); l.setAttribute('y1', cy); l.setAttribute('x2', n.x); l.setAttribute('y2', n.y);
      linesG.appendChild(l);
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r', 5);
      c.setAttribute('class', 'n n-ok');
      nodesG.appendChild(c);
      n.el = c; n.line = l;
    });
    var core = document.createElementNS(NS, 'circle');
    core.setAttribute('cx', cx); core.setAttribute('cy', cy); core.setAttribute('r', 13);
    core.setAttribute('class', 'n n-core');
    nodesG.appendChild(core);
    var halo = document.createElementNS(NS, 'circle');
    halo.setAttribute('r', 6); halo.setAttribute('class', 'halo');
    halo.setAttribute('cx', -50); halo.setAttribute('cy', -50);
    nodesG.appendChild(halo);

    // Légère respiration du graphe.
    if (!reduceMotion) {
      var t0 = performance.now();
      (function float(t) {
        var k = (t - t0) / 1000;
        nodes.forEach(function (n, j) {
          var x = n.x + Math.sin(k * 0.8 + j) * 3, y = n.y + Math.cos(k * 0.7 + j * 1.3) * 3;
          n.el.setAttribute('cx', x.toFixed(1)); n.el.setAttribute('cy', y.toFixed(1));
          n.line.setAttribute('x2', x.toFixed(1)); n.line.setAttribute('y2', y.toFixed(1));
          if (n.flag) { halo.setAttribute('cx', x.toFixed(1)); halo.setAttribute('cy', y.toFixed(1)); }
        });
        requestAnimationFrame(float);
      })(t0);
    }

    function clock(offsetMin) {
      var d = new Date(Date.now() - offsetMin * 60000);
      return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }

    function push(alert, offsetMin, animateKpi) {
      var li = document.createElement('li');
      li.className = 'feed__item';
      var sev = document.createElement('i'); sev.className = 'sev sev--' + alert.sev;
      var body = document.createElement('div');
      var st = document.createElement('strong'); st.textContent = alert.title;
      var sp = document.createElement('span'); sp.textContent = alert.detail;
      body.appendChild(st); body.appendChild(sp);
      var tm = document.createElement('time'); tm.textContent = clock(offsetMin || 0);
      li.appendChild(sev); li.appendChild(body); li.appendChild(tm);
      feed.insertBefore(li, feed.firstChild);
      while (feed.children.length > 5) feed.removeChild(feed.lastChild);

      // Le graphe reflète l'alerte : un nœud change de couleur.
      nodes.forEach(function (n) { n.flag = false; });
      var target = nodes[Math.floor(Math.random() * nodes.length)];
      var cls = alert.sev === 'high' ? 'n-bad' : alert.sev === 'mid' ? 'n-warn' : 'n-ok';
      target.el.setAttribute('class', 'n ' + cls);
      if (alert.sev === 'high') { target.flag = true; halo.setAttribute('cx', target.x); halo.setAttribute('cy', target.y); }
      else { halo.setAttribute('cx', -50); halo.setAttribute('cy', -50); }

      if (animateKpi && alert.kpi) {
        var k = document.getElementById(alert.kpi);
        if (k) {
          k.textContent = String(parseInt(k.textContent, 10) + 1);
          k.classList.remove('bump'); void k.offsetWidth; k.classList.add('bump');
        }
      }
    }

    // État initial, puis une alerte toutes les 3,5 s quand la démo est visible.
    push(FAKE_ALERTS[5], 41); push(FAKE_ALERTS[4], 26); push(FAKE_ALERTS[3], 14); push(FAKE_ALERTS[2], 9); push(FAKE_ALERTS[0], 2);
    var idx = 0, timer = null;
    function tick() { push(FAKE_ALERTS[idx++ % FAKE_ALERTS.length], 0, true); }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !timer && !reduceMotion) timer = setInterval(tick, 3500);
        if (!e.isIntersecting && timer) { clearInterval(timer); timer = null; }
      });
    }, { threshold: 0.25 });
    io.observe(feed);
  }

  /* ---------- Feuille de route : barre d'avancement ---------- */
  function initRoadmap() {
    var items = document.querySelectorAll('.milestone');
    var bar = document.getElementById('progress-bar');
    var label = document.getElementById('progress-label');
    if (!items.length || !bar) return;
    var done = 0, doing = 0;
    items.forEach(function (m) {
      var s = m.getAttribute('data-status');
      if (s === 'done') done++;
      if (s === 'doing') doing++;
    });
    var pct = Math.round(((done + doing * 0.5) / items.length) * 100);
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { bar.style.width = pct + '%'; io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(bar.parentElement);
    if (label) label.textContent = done + ' objectif' + (done > 1 ? 's' : '') + ' atteint' + (done > 1 ? 's' : '') +
      ', ' + doing + ' en cours, sur ' + items.length + '.';
  }

  /* ---------- Démarrage ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
    initNav();
    initReveal();
    initScrub();
    initCounters();
    initHow();
    initCarousel();
    initParallax();
    initDemo();
    initRoadmap();
    loadConfig().then(function (cfg) {
      window.AURA_CONFIG = cfg;
      applyConfig(cfg);
      document.dispatchEvent(new CustomEvent('aura:config', { detail: cfg }));
    });
  });
})();
