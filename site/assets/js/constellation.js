/* AURA · fond animé « constellation » (inspiration leaconsulting.fr), 100% local.
   Un réseau de points reliés qui dérive lentement derrière le contenu. Respecte
   prefers-reduced-motion et la pause globale (window.AURA_MOTION_PAUSED). */
(function () {
  'use strict';
  var canvas = document.getElementById('constellation');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var points = [], raf = null, w = 0, h = 0, dpr = 1;
  var LINK = 150; // distance de liaison en px CSS

  function count() {
    // Densité raisonnable, plafonnée pour rester fluide sur mobile.
    return Math.min(90, Math.round((w * h) / 20000));
  }
  function seed() {
    points = [];
    var n = count();
    for (var i = 0; i < n; i++) {
      points.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6
      });
    }
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }
  function draw(move) {
    ctx.clearRect(0, 0, w, h);
    var i, j, a, b, dx, dy, dist;
    for (i = 0; i < points.length; i++) {
      a = points[i];
      if (move) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < -20) a.x = w + 20; else if (a.x > w + 20) a.x = -20;
        if (a.y < -20) a.y = h + 20; else if (a.y > h + 20) a.y = -20;
      }
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(112,229,247,0.55)';
      ctx.fill();
    }
    for (i = 0; i < points.length; i++) {
      a = points[i];
      for (j = i + 1; j < points.length; j++) {
        b = points[j];
        dx = a.x - b.x; dy = a.y - b.y; dist = dx * dx + dy * dy;
        if (dist < LINK * LINK) {
          var alpha = (1 - Math.sqrt(dist) / LINK) * 0.22;
          ctx.strokeStyle = 'rgba(8,176,179,' + alpha.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
  }
  function paused() {
    return document.hidden || motion.matches || Boolean(window.AURA_MOTION_PAUSED);
  }
  function loop() {
    if (paused()) { raf = null; draw(false); return; }
    draw(true);
    raf = window.requestAnimationFrame(loop);
  }
  function start() { if (raf == null && !paused()) raf = window.requestAnimationFrame(loop); else draw(false); }
  function stop() { if (raf != null) { window.cancelAnimationFrame(raf); raf = null; } }

  resize();
  draw(false);
  if (!motion.matches) start();
  var rt;
  window.addEventListener('resize', function () { window.clearTimeout(rt); rt = window.setTimeout(function () { resize(); draw(!paused()); }, 200); }, { passive: true });
  document.addEventListener('visibilitychange', function () { if (paused()) stop(); else start(); });
  document.addEventListener('aura:motion', function () { if (paused()) { stop(); draw(false); } else start(); });
  if (motion.addEventListener) motion.addEventListener('change', function () { if (paused()) { stop(); draw(false); } else start(); });
})();
