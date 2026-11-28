/* Points et signaux décoratifs, sans données du réseau réel. */
(function () {
  'use strict';
  var canvas = document.getElementById('constellation');
  var ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;

  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var palettes = {
    dark: { node: '#8fc8f0', edge: '#6c99d4', packet: '#89e8d1' },
    light: { node: '#34668f', edge: '#41698f', packet: '#086c60' }
  };
  var palette, width, height, reach;
  var points = [];
  var frame = null;
  var previousTime = 0;
  var elapsed = 0;

  function paused() {
    return document.hidden || reducedMotion.matches || window.AURA_MOTION_PAUSED;
  }

  function theme() {
    palette = root.dataset.theme === 'light' ? palettes.light : palettes.dark;
    if (width && height) draw();
  }

  function resize() {
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    reach = width < 600 ? 122 : 176;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    var count = Math.min(84, Math.max(24, Math.round(width * height / 13500)));
    points = Array.from({ length: count }, function () {
      var angle = Math.random() * 2 * Math.PI;
      var speed = 14 + Math.random() * 14;
      return {
        x: Math.random() * width, y: Math.random() * height,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        r: 1.25 + Math.random() * .95
      };
    });
    draw();
  }

  function dot(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function wrap(value, size) {
    if (value < -16) return value + size + 32;
    if (value > size + 16) return value - size - 32;
    return value;
  }

  function draw(dt) {
    ctx.clearRect(0, 0, width, height);
    points.forEach(function (point) {
      if (!dt) return;
      point.x = wrap(point.x + point.vx * dt, width);
      point.y = wrap(point.y + point.vy * dt, height);
    });

    ctx.strokeStyle = palette.edge;
    ctx.lineWidth = 1;
    for (var i = 0; i < points.length; i++) {
      var a = points[i];
      for (var j = i + 1; j < points.length; j++) {
        var b = points[j];
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var distanceSquared = dx * dx + dy * dy;
        if (distanceSquared >= reach * reach) continue;
        ctx.globalAlpha = (1 - Math.sqrt(distanceSquared) / reach) * .62;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        if ((i * 5 + j * 3) % 11 === 0) {
          var progress = (elapsed * .52 + i * .17 + j * .11) % 1;
          ctx.fillStyle = palette.packet;
          ctx.globalAlpha = .7 * Math.sin(Math.PI * progress);
          dot(a.x + dx * progress, a.y + dy * progress, 2.2);
        }
      }
    }

    ctx.fillStyle = palette.node;
    ctx.globalAlpha = .62;
    points.forEach(function (point) { dot(point.x, point.y, point.r); });
    ctx.globalAlpha = 1;
  }

  function tick(now) {
    frame = null;
    if (paused()) return;
    var dt = previousTime ? Math.min((now - previousTime) / 1000, .05) : 0;
    previousTime = now;
    elapsed += dt;
    draw(dt);
    frame = requestAnimationFrame(tick);
  }

  function refresh() {
    if (paused()) {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previousTime = 0;
      draw();
    } else if (frame === null) {
      frame = requestAnimationFrame(tick);
    }
  }

  theme();
  resize();
  refresh();
  new MutationObserver(theme).observe(root, { attributeFilter: ['data-theme'] });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', refresh);
  document.addEventListener('aura:motion', refresh);
  reducedMotion.addEventListener('change', refresh);
})();
