/* Répartition des tâches : filtre par membre, sur la page Équipe. */
(function () {
  'use strict';

  var bloc = document.querySelector('.repart');
  if (!bloc) return;

  var chips = Array.prototype.slice.call(bloc.querySelectorAll('.repart__chip'));
  var taches = Array.prototype.slice.call(bloc.querySelectorAll('.tache'));
  var parts = Array.prototype.slice.call(bloc.querySelectorAll('.repart__part'));
  var vide = bloc.querySelector('.repart__vide');

  function appliquer(filtre) {
    var visibles = 0;
    taches.forEach(function (tache) {
      var garde = filtre === 'tous' || tache.getAttribute('data-membre') === filtre;
      tache.classList.toggle('est-masquee', !garde);
      tache.setAttribute('aria-hidden', garde ? 'false' : 'true');
      if (garde) visibles++;
    });
    parts.forEach(function (part) {
      part.classList.toggle('est-eteinte', filtre !== 'tous' && part.getAttribute('data-membre') !== filtre);
    });
    chips.forEach(function (chip) {
      var actif = chip.getAttribute('data-filtre') === filtre;
      chip.classList.toggle('is-actif', actif);
      chip.setAttribute('aria-pressed', actif ? 'true' : 'false');
    });
    bloc.setAttribute('data-filtre', filtre);
    if (vide) vide.hidden = visibles > 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filtre = chip.getAttribute('data-filtre');
      // Recliquer sur le filtre actif revient à tout afficher.
      appliquer(chip.classList.contains('is-actif') && filtre !== 'tous' ? 'tous' : filtre);
    });
  });

  // Les parts de la barre servent aussi de raccourci.
  parts.forEach(function (part) {
    part.addEventListener('click', function () {
      var membre = part.getAttribute('data-membre');
      appliquer(bloc.getAttribute('data-filtre') === membre ? 'tous' : membre);
    });
  });

  appliquer('tous');
}());
