/* Interactive local showcase. No backend, telemetry, or automatic outbound calls.
   The window dots (red/yellow/green) are purely decorative: the demo can no longer
   be closed, minimised or expanded. Views include a fictional map and an IA readout. */
(function () {
  'use strict';
  function start() {
    var win = document.getElementById('demo-window');
    if (!win) return;
    var section = document.getElementById('demo');
    var next = document.getElementById('demo-next');
    var panes = win.querySelector('.panes');
    var view = 'all', selected = null, tour = null, tourSteps = 0, visible = false;
    var motion = matchMedia('(prefers-reduced-motion: reduce)');

    function element(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text) e.textContent = text;
      return e;
    }
    var toolbar = element('div', 'demo-toolbar');
    var searchLabel = element('label', '', 'Rechercher un appareil');
    var search = element('input'); search.id = 'demo-search'; search.type = 'search';
    search.placeholder = 'Nom, adresse MAC ou IP'; search.autocomplete = 'off';
    searchLabel.appendChild(search);
    var filterLabel = element('label', 'demo-filter', 'Afficher');
    var filter = element('select'); filter.id = 'demo-filter';
    [['all','Tous les états'],['known','Connus'],['review','À vérifier'],['waiting','Non observés']].forEach(function (item) {
      var option = element('option', '', item[1]); option.value = item[0]; filter.appendChild(option);
    });
    filterLabel.appendChild(filter);
    var play = element('button', 'demo-action', 'Lancer la visite');
    play.id = 'demo-tour'; play.type = 'button'; play.setAttribute('aria-pressed', 'false');
    var reset = element('button', 'demo-action demo-action--quiet', 'Repartir du début');
    reset.id = 'demo-reset'; reset.type = 'button';
    var status = element('p', 'demo-tour-status', 'Choisissez une vue, cliquez sur un appareil ou simulez un événement. Tout reste dans cette page.');
    status.id = 'demo-view-status'; status.setAttribute('role', 'status');
    toolbar.append(searchLabel, filterLabel, play, reset, status); panes.prepend(toolbar);

    var detail = element('section', 'demo-detail'); detail.id = 'demo-detail'; detail.hidden = true;
    detail.setAttribute('aria-labelledby', 'demo-detail-title'); detail.tabIndex = -1;
    var detailHead = element('div', 'demo-detail__head');
    var detailTitle = element('h3'); detailTitle.id = 'demo-detail-title';
    var detailClose = element('button', 'demo-action demo-action--quiet', 'Fermer');
    detailClose.type = 'button'; detailClose.setAttribute('aria-label', 'Fermer le détail de cet appareil');
    var details = element('dl');
    detailHead.append(detailTitle, detailClose); detail.append(detailHead, details); toolbar.after(detail);
    var tables = Array.prototype.slice.call(win.querySelectorAll('table.grid'));
    var rows = Array.prototype.slice.call(win.querySelectorAll('tr[data-row]'));
    var tablePanes = tables.map(function (table) { return table.closest('.pane'); });
    var feedPane = document.getElementById('feed').closest('.pane');
    var mapPane = document.getElementById('pane-map');
    var iaPane = document.getElementById('pane-ia');
    var empties = tables.map(function (table) {
      var empty = element('p', 'demo-empty', 'Aucun appareil ne correspond à ces critères. Effacez la recherche ou changez le filtre.');
      empty.hidden = true; table.closest('.table-wrap').after(empty); return empty;
    });
    function showDetail(row, focus) {
      selected = row;
      var table = row.closest('table');
      var labels = table.querySelectorAll('th');
      detailTitle.textContent = row.cells[0].textContent.trim(); details.textContent = '';
      Array.prototype.slice.call(row.cells).forEach(function (cell, i) {
        var group = element('div'); group.append(element('dt', '', labels[i].textContent), element('dd', '', cell.textContent.trim()));
        details.appendChild(group);
      });
      var group = element('div'); group.append(element('dt', '', 'Emplacement réel'), element('dd', '', 'Non disponible — jeu fictif'));
      details.appendChild(group); detail.hidden = false;
      if (focus) detail.focus({preventScroll:true});
    }
    rows.forEach(function (row) {
      var cell = row.cells[0]; var button = element('button', 'device-open', cell.textContent);
      button.type = 'button'; button.setAttribute('aria-label', 'Voir le détail de ' + cell.textContent.trim());
      button.addEventListener('click', function () { showDetail(row, true); }); cell.textContent = ''; cell.appendChild(button);
    });
    detailClose.addEventListener('click', function () {
      detail.hidden = true;
      if (selected && !selected.hidden && !selected.closest('.pane').hidden) selected.querySelector('button').focus();
      else search.focus();
      selected = null;
    });
    function refresh() {
      var showTables = view === 'all' || view === 'lan' || view === 'wifi';
      var query = search.value.trim().toLocaleLowerCase('fr'); var total = 0;
      tables.forEach(function (table, i) {
        var count = 0;
        table.querySelectorAll('tbody tr').forEach(function (row) {
          var state = row.dataset.state;
          var fits = filter.value === 'all' || (filter.value === 'known' && (state === 'online' || state === 'offline')) || (filter.value === 'review' && (state === 'unknown' || state === 'probable')) || (filter.value === 'waiting' && state === 'waiting');
          row.hidden = !fits || (query && !row.textContent.toLocaleLowerCase('fr').includes(query));
          if (!row.hidden) count++;
        });
        tablePanes[i].hidden = !(view === 'all' || view === (i === 0 ? 'lan' : 'wifi'));
        empties[i].hidden = count > 0;
        if (!tablePanes[i].hidden) total += count;
      });
      if (mapPane) mapPane.hidden = view !== 'map';
      if (iaPane) iaPane.hidden = view !== 'ia';
      feedPane.hidden = !(view === 'all' || view === 'alerts');
      // Search and filter only make sense when a device table is on screen.
      searchLabel.hidden = filterLabel.hidden = !showTables;
      if (selected && (selected.hidden || selected.closest('.pane').hidden)) { detail.hidden = true; selected = null; }
      else if (selected) showDetail(selected, false);
      if (view === 'map') status.textContent = 'Plan fictif : chaque pastille situe un appareil de la démonstration. Aucune position réelle.';
      else if (view === 'ia') status.textContent = 'Reformulation illustrative des alertes par l’IA. La gravité reste calculée par les règles, pas par l’IA.';
      else if (view === 'alerts') status.textContent = 'Trois événements fictifs au maximum. Le bouton ci-dessous permet de poursuivre le scénario.';
      else status.textContent = total + (total > 1 ? ' appareils affichés.' : ' appareil affiché.') + ' Cliquez sur un nom pour voir ses détails.';
    }
    win.querySelectorAll('[data-demo-view]').forEach(function (button) {
      button.addEventListener('click', function () {
        view = button.dataset.demoView; detail.hidden = true; selected = null;
        win.querySelectorAll('[data-demo-view]').forEach(function (item) {
          var active = item === button; item.classList.toggle('is-on', active); item.setAttribute('aria-pressed', String(active));
        }); refresh();
      });
    });
    search.addEventListener('input', refresh); filter.addEventListener('change', refresh);
    document.addEventListener('aura:demo-update', function () { refresh(); });
    if (next) next.addEventListener('click', refresh);
    function stopTour(announce) {
      if (tour) clearInterval(tour);
      tour = null; play.setAttribute('aria-pressed', 'false'); play.textContent = 'Lancer la visite';
      if (announce) status.textContent = 'Visite arrêtée. Vous pouvez continuer avec « Simuler un événement ».';
    }
    play.addEventListener('click', function () {
      if (tour) { stopTour(true); return; }
      if (motion.matches || window.AURA_MOTION_PAUSED) {
        status.textContent = 'Les animations sont en pause. Vous pouvez avancer à votre rythme avec « Simuler un événement ».'; return;
      }
      document.dispatchEvent(new CustomEvent('aura:demo-reset'));
      tourSteps = 0; play.textContent = 'Arrêter la visite'; play.setAttribute('aria-pressed', 'true');
      if (next) { next.click(); tourSteps++; }
      tour = setInterval(function () {
        if (document.hidden || win.hidden || !visible) { stopTour(true); return; }
        if (next) next.click(); tourSteps++;
        if (tourSteps >= 4) stopTour(false);
      }, 4500);
    });
    reset.addEventListener('click', function () {
      stopTour(false); selected = null; detail.hidden = true;
      document.dispatchEvent(new CustomEvent('aura:demo-reset')); refresh();
    });
    function updateMotion() {
      var idle = document.hidden || motion.matches || Boolean(window.AURA_MOTION_PAUSED) || !visible;
      win.classList.toggle('is-motion-idle', idle);
      if (idle) stopTour(false);
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; updateMotion(); },{threshold:.05}).observe(section);
    else visible = true;
    document.addEventListener('visibilitychange', updateMotion); document.addEventListener('aura:motion', updateMotion);
    if (motion.addEventListener) motion.addEventListener('change', updateMotion);
    refresh(); updateMotion();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true}); else start();
})();
