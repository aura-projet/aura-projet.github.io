/* AURA · révélations au scroll, compteurs et boutons magnétiques.
   Vanilla et 100% local (inspiration leaconsulting.fr, sans GSAP ni CDN).
   Respecte prefers-reduced-motion : tout s'affiche d'emblée, sans mouvement. */
(function () {
  'use strict';
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motion.matches;

  /* 1 · Révélations [data-reveal] → classe .is-revealed (une seule fois). */
  function initReveals() {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!items.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseFloat(el.getAttribute('data-delay'));
        if (delay) el.style.transitionDelay = delay + 's';
        el.classList.add('is-revealed');
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* 2 · Compteurs [data-count] → 0 vers la valeur, à l'entrée dans l'écran. */
  function initCounters() {
    var nums = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    if (!nums.length) return;
    function run(el) {
      var raw = el.getAttribute('data-count');
      var target = parseFloat(raw);
      if (isNaN(target)) return;
      var decimals = (raw.split('.')[1] || '').length;
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      function set(v) { el.textContent = prefix + v.toFixed(decimals) + suffix; }
      if (reduced) { set(target); return; }
      var dur = 2000, start = null;
      function frame(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1);
        set(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(frame); else set(target);
      }
      requestAnimationFrame(frame);
    }
    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* 3 · Boutons magnétiques .js-magnetic — pointeur fin uniquement. */
  function initMagnetic() {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    Array.prototype.slice.call(document.querySelectorAll('.js-magnetic')).forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.28;
        var y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* 4 · La barre de navigation se cache au défilement vers le bas. */
  function initNavHide() {
    var nav = document.getElementById('nav');
    if (!nav || reduced) return;
    var last = window.scrollY, ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY;
      if (y > 260 && y > last + 4) nav.classList.add('is-hidden');
      else if (y < last - 4 || y < 260) nav.classList.remove('is-hidden');
      last = y;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  }

  function start() { initReveals(); initCounters(); initMagnetic(); initNavHide(); }
  if (motion.addEventListener) motion.addEventListener('change', function () { reduced = motion.matches; });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
