/* AURA · page "Kit QR codes" : affiche les QR listés dans assets/qr/manifest.json. */
(function () {
  'use strict';

  var grid = document.getElementById('qr-grid');
  var printBtn = document.getElementById('print');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
  if (!grid) return;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function card(q) {
    var item = el('article', 'qr-item');
    var brand = el('div', 'qr-item__brand');
    var logo = document.createElement('img');
    logo.src = 'assets/img/logo.svg'; logo.alt = ''; logo.width = 20; logo.height = 20;
    brand.appendChild(logo);
    brand.appendChild(el('span', '', 'AURA'));
    item.appendChild(brand);

    var img = document.createElement('img');
    img.className = 'qr';
    img.src = q.svg;
    img.alt = 'QR code : ' + q.title;
    img.width = 190; img.height = 190;
    item.appendChild(img);

    item.appendChild(el('h2', '', q.title));
    item.appendChild(el('p', '', q.subtitle));
    item.appendChild(el('p', 'qr-url', q.data.replace(/^mailto:/, '')));

    var dl = el('div', 'qr-item__dl');
    [['svg', 'SVG'], ['png', 'PNG']].forEach(function (f) {
      var a = el('a', '', '↓ ' + f[1]);
      a.setAttribute('aria-label', 'Télécharger le QR code ' + q.title + ' en ' + f[1]);
      a.href = q[f[0]];
      a.download = 'aura-qr-' + q.id + '.' + f[0];
      dl.appendChild(a);
    });
    item.appendChild(dl);
    return item;
  }

  fetch('assets/qr/manifest.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
    .then(function (m) {
      grid.textContent = '';
      (m.generated || []).forEach(function (q) { grid.appendChild(card(q)); });
    })
    .catch(function () {
      grid.textContent = '';
      grid.appendChild(el('p', 'qr-empty', 'Impossible de charger la liste des QR codes. Lancez « python3 tools/generate_qr.py ».'));
    });
})();
