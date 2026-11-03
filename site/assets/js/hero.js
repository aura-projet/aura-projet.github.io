/* AURA · animation du hero.
   Une "sonde" au centre émet des ondes. Quand une onde atteint un appareil,
   il s'allume brièvement. De temps en temps, un appareil inconnu apparaît en
   rouge : c'est l'idée du produit, en une image. */
(function () {
  'use strict';

  var canvas = document.getElementById('hero-canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W = 0, H = 0, DPR = 1, cx = 0, cy = 0, maxR = 0;
  var devices = [], waves = [], mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  var lastWave = 0, lastRogue = 0, running = true;

  var COLORS = { c1: [46, 230, 214], c2: [110, 123, 255], c3: [200, 107, 250], bad: [255, 69, 58] };
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = W / 2; cy = H * 0.52;
    maxR = Math.hypot(W, H) * 0.6;
    seed();
  }

  function seed() {
    devices = [];
    var count = Math.round(Math.min(70, Math.max(26, (W * H) / 22000)));
    for (var i = 0; i < count; i++) {
      // Répartition en anneau : on laisse le centre libre pour le titre.
      var a = Math.random() * Math.PI * 2;
      var r = (0.28 + Math.random() * 0.72) * Math.min(W, H) * 0.75 + 40;
      devices.push({
        x: cx + Math.cos(a) * r * (W > H ? 1.5 : 1),
        y: cy + Math.sin(a) * r * 0.85,
        size: 1.2 + Math.random() * 1.8,
        glow: 0,
        rogue: false,
        drift: Math.random() * Math.PI * 2
      });
    }
  }

  function spawnWave(t) { waves.push({ r: 0, born: t }); }

  function draw(t) {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    var ox = mouse.x * 18, oy = mouse.y * 12;

    if (t - lastWave > 1600) { spawnWave(t); lastWave = t; }
    if (t - lastRogue > 3800 && devices.length) {
      devices.forEach(function (d) { d.rogue = false; });
      devices[Math.floor(Math.random() * devices.length)].rogue = true;
      lastRogue = t;
    }

    // Ondes
    for (var i = waves.length - 1; i >= 0; i--) {
      var w = waves[i];
      w.r = (t - w.born) * 0.16;
      var life = 1 - w.r / maxR;
      if (life <= 0) { waves.splice(i, 1); continue; }
      var g = ctx.createRadialGradient(cx, cy, Math.max(0, w.r - 40), cx, cy, w.r);
      g.addColorStop(0, rgba(COLORS.c2, 0));
      g.addColorStop(1, rgba(COLORS.c1, 0.10 * life));
      ctx.beginPath();
      ctx.arc(cx, cy, w.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = rgba(COLORS.c1, 0.35 * life);
      ctx.stroke();
    }

    // Appareils
    devices.forEach(function (d) {
      var x = d.x + Math.sin(t / 2400 + d.drift) * 4 + ox * (d.size / 3);
      var y = d.y + Math.cos(t / 2800 + d.drift) * 4 + oy * (d.size / 3);
      var dist = Math.hypot(x - cx, y - cy);
      waves.forEach(function (w) { if (Math.abs(w.r - dist) < 8) d.glow = 1; });
      d.glow *= 0.965;

      var col = d.rogue ? COLORS.bad : (d.glow > 0.05 ? COLORS.c1 : [160, 160, 175]);
      var alpha = d.rogue ? 0.95 : 0.35 + d.glow * 0.65;

      if (d.glow > 0.2 || d.rogue) {
        ctx.beginPath();
        ctx.moveTo(cx, cy); ctx.lineTo(x, y);
        ctx.strokeStyle = rgba(d.rogue ? COLORS.bad : COLORS.c2, (d.rogue ? 0.35 : 0.18) * Math.max(d.glow, d.rogue ? 1 : 0));
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      if (d.rogue) {
        var pulse = 6 + ((t / 18) % 22);
        ctx.beginPath();
        ctx.arc(x, y, pulse, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(COLORS.bad, Math.max(0, 0.6 - pulse / 40));
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(x, y, d.size + d.glow * 1.6 + (d.rogue ? 1.5 : 0), 0, Math.PI * 2);
      ctx.fillStyle = rgba(col, alpha);
      ctx.shadowBlur = d.rogue ? 14 : d.glow * 12;
      ctx.shadowColor = rgba(col, 1);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // La sonde, au centre
    var breathe = 1 + Math.sin(t / 600) * 0.08;
    var core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70 * breathe);
    core.addColorStop(0, rgba(COLORS.c3, 0.55));
    core.addColorStop(0.4, rgba(COLORS.c2, 0.25));
    core.addColorStop(1, rgba(COLORS.c2, 0));
    ctx.beginPath();
    ctx.arc(cx, cy, 70 * breathe, 0, Math.PI * 2);
    ctx.fillStyle = core;
    ctx.fill();

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', function (e) {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Pause quand le hero n'est plus visible : économise la batterie.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      if (visible && !running && !reduceMotion) { running = true; requestAnimationFrame(draw); }
      if (!visible) running = false;
    }).observe(canvas);
  }

  resize();
  if (reduceMotion) {
    // Image fixe : quelques ondes figées.
    var now = performance.now();
    waves = [{ r: 0, born: now - 900 }, { r: 0, born: now - 2600 }];
    lastWave = now; lastRogue = now;
    devices[0].rogue = true;
    draw(now);
  } else {
    requestAnimationFrame(draw);
  }
})();
