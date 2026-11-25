/* AURA · amorçage synchrone : applique le thème et la langue mémorisés avant le
   premier rendu, pour éviter tout clignotement. Chargé en tête, sans defer. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  try {
    var theme = localStorage.getItem('aura-theme');
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else if (theme === 'dark') root.removeAttribute('data-theme');
  } catch (e) { /* stockage indisponible : on garde le thème sombre par défaut */ }
  try {
    var lang = localStorage.getItem('aura-lang');
    if (lang === 'en') root.setAttribute('lang', 'en');
  } catch (e) { /* idem : français par défaut */ }
})();
