/* AURA · carrousel « Le projet » : glisser fluide, physique façon Apple.
   Suivi 1:1 au pointeur, reprise de vélocité au relâcher, projection d'élan,
   ressort amorti interruptible, résistance aux bords. Flèches, points et
   clavier. Le schéma suit l'étape active. 100% local.
   Respecte prefers-reduced-motion : saut immédiat, sans ressort. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Projection d'élan facon iOS (décroissance exponentielle).
  function project(v, d) { d = d || 0.995; return (v / 1000) * d / (1 - d); }
  function pad(x) { return x < 10 ? '0' + x : '' + x; }

  function setup(root) {
    var viewport = root.querySelector('[data-slider-viewport]');
    var track = root.querySelector('[data-slider-track]');
    if (!viewport || !track) return;
    var slides = Array.prototype.slice.call(track.children);
    if (slides.length < 2) return;
    var prev = root.querySelector('[data-slider-prev]');
    var next = root.querySelector('[data-slider-next]');
    var dotsBox = root.querySelector('[data-slider-dots]');
    var progress = root.querySelector('[data-slider-progress]');
    var diagram = document.querySelector('[data-flow-diagram]');

    var n = slides.length;
    var index = 0, pos = 0, target = 0, vel = 0, raf = null;
    var minPos = 0, offsets = [];
    var dragging = false, pid = null, startX = 0, startPos = 0, lastX = 0, lastT = 0, flyVel = 0, moved = 0;

    var dots = [];
    if (dotsBox) {
      dotsBox.textContent = '';
      slides.forEach(function (s, i) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'slider__dot';
        b.addEventListener('click', function () { go(i, 0); });
        dotsBox.appendChild(b); dots.push(b);
      });
    }

    function clamp(x) { return Math.max(minPos, Math.min(0, x)); }
    function setX(x) { track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)'; }
    function snapFor(i) { return clamp(-offsets[i]); }
    function nearest(x) {
      var best = 0, bd = Infinity;
      for (var i = 0; i < n; i++) { var d = Math.abs(-offsets[i] - x); if (d < bd) { bd = d; best = i; } }
      return best;
    }
    function maxIndex() {
      for (var j = 0; j < n; j++) if (-offsets[j] <= minPos + 0.5) return j;
      return n - 1;
    }
    function rubber(over, dim) { var c = 0.5; return (over * dim * c) / (dim + c * Math.abs(over)); }

    function measure() {
      var base = track.getBoundingClientRect().left;
      offsets = slides.map(function (s) { return s.getBoundingClientRect().left - base + pos; });
      minPos = Math.min(0, viewport.clientWidth - track.scrollWidth);
      index = Math.min(index, maxIndex());
      pos = snapFor(index); target = pos; setX(pos); render();
    }

    function render() {
      var active = slides[index];
      var h3 = active.querySelector('h3');
      var title = h3 ? h3.textContent.trim() : '';
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
      var english = document.documentElement.lang === 'en';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-on', i === index);
        dot.setAttribute('aria-label', (english ? 'Go to step ' : 'Aller à l’étape ') + (i + 1));
        if (i === index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      var mi = maxIndex();
      if (prev) prev.disabled = index <= 0;
      if (next) next.disabled = index >= mi;
      if (progress) progress.textContent = pad(index + 1) + ' / ' + pad(n) + (title ? ' · ' + title : '');
      if (diagram) diagram.dataset.step = active.dataset.step;
    }

    // Ressort critique (amorti, sans dépassement), interruptible.
    function spring() {
      raf = null;
      var k = 130, c = 2 * Math.sqrt(k), dt = 1 / 60;
      var a = -k * (pos - target) - c * vel;
      vel += a * dt; pos += vel * dt;
      if (Math.abs(pos - target) < 0.3 && Math.abs(vel) < 0.4) { pos = target; vel = 0; setX(pos); return; }
      setX(pos); raf = requestAnimationFrame(spring);
    }
    function stop() { if (raf != null) { cancelAnimationFrame(raf); raf = null; } }
    function animateTo(t, v0) {
      target = clamp(t);
      if (reduce.matches || window.AURA_MOTION_PAUSED) { stop(); pos = target; vel = 0; setX(pos); return; }
      vel = v0 || 0;
      if (raf == null) raf = requestAnimationFrame(spring);
    }
    function go(i, v0) { index = Math.max(0, Math.min(maxIndex(), i)); animateTo(snapFor(index), v0); render(); }

    viewport.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button > 0) return;
      stop(); dragging = true; pid = e.pointerId; moved = 0;
      try { viewport.setPointerCapture(e.pointerId); } catch (x) {}
      viewport.classList.add('is-dragging');
      startX = e.clientX; startPos = pos; lastX = e.clientX;
      lastT = e.timeStamp || performance.now(); flyVel = 0;
    });
    viewport.addEventListener('pointermove', function (e) {
      if (!dragging || e.pointerId !== pid) return;
      var dx = e.clientX - startX; moved = Math.max(moved, Math.abs(dx));
      var raw = startPos + dx;
      if (raw > 0) raw = rubber(raw, viewport.clientWidth);
      else if (raw < minPos) raw = minPos - rubber(minPos - raw, viewport.clientWidth);
      pos = raw; setX(pos);
      var t = e.timeStamp || performance.now(), ddt = t - lastT;
      if (ddt > 0) flyVel = (e.clientX - lastX) / ddt * 1000;
      lastX = e.clientX; lastT = t;
    });
    function endDrag(e) {
      if (!dragging || (e && e.pointerId !== pid)) return;
      dragging = false; viewport.classList.remove('is-dragging');
      try { viewport.releasePointerCapture(pid); } catch (x) {}
      index = Math.max(0, Math.min(maxIndex(), nearest(pos + project(flyVel))));
      animateTo(snapFor(index), flyVel); render();
    }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('dragstart', function (e) { e.preventDefault(); });

    if (prev) prev.addEventListener('click', function () { go(index - 1, 0); });
    if (next) next.addEventListener('click', function () { go(index + 1, 0); });
    viewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1, 0); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1, 0); }
      else if (e.key === 'Home') { e.preventDefault(); go(0, 0); }
      else if (e.key === 'End') { e.preventDefault(); go(maxIndex(), 0); }
    });

    var rt;
    document.addEventListener('aura:language', render);
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(measure, 150); }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
  }

  function init() { Array.prototype.slice.call(document.querySelectorAll('[data-slider]')).forEach(setup); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
