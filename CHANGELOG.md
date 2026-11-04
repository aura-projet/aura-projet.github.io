# Journal des modifications

Toutes les modifications notables du dépôt sont listées ici, de la plus
récente à la plus ancienne. Format inspiré de
[Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

Rubriques : **Ajouté**, **Modifié**, **Corrigé**, **Supprimé**, **Sécurité**.

---

## 2026-11-04 · Mise en ligne et questionnaire

### Ajouté

- `docs/rgpd-questionnaire.md` : fiche de validation RGPD du service qui
  reçoit les réponses (Formspree, Microsoft Forms, mail Proton), points à
  vérifier et texte prêt à reporter dans les mentions légales.
- `docs/site-web.md` : pas à pas Formspree, conseils de sécurité pour le
  compte Proton partagé, marche à suivre si le premier déploiement a échoué.

### Modifié

- Questionnaire : si l'envoi au service échoue (quota de 50 réponses par
  mois atteint chez Formspree, ou problème réseau), le formulaire l'explique
  et propose d'envoyer l'avis par mail au support.
- Workflow GitHub Pages : `actions/checkout` v5 et `actions/setup-python` v6
  (les versions précédentes utilisaient Node.js 20, déprécié par GitHub).

### Notes

- PR #2 fusionnée dans `main`. Le premier déploiement a échoué à l'étape
  `configure-pages` : GitHub Pages n'était pas encore activé dans les
  réglages du dépôt.

---

## 2026-11-03 · Site web vitrine

### Ajouté

- Site vitrine statique dans `site/`, publié sur GitHub Pages
  (<https://stayx3811.github.io/aura-code/> une fois Pages activé).
  - `index.html` : hero animé (canvas), texte qui s'allume au défilement,
    chiffres clés, schéma « Fonctionnement » qui suit les cinq étapes,
    carrousel des quatre scénarios, démo simulée du tableau de bord, sonde en
    parallaxe, sécurité et RGPD, feuille de route O0 à O8, briques open
    source, équipe, appel au questionnaire, contact.
  - `satisfaction.html` : questionnaire de satisfaction anonyme en cinq
    questions, trois modes d'envoi configurables.
  - `qr.html` : kit QR codes pour le pitch, téléchargement SVG / PNG et
    impression A4.
  - `mentions-legales.html` : mentions légales, confidentialité, informations
    RGPD sur le questionnaire.
  - `404.html`, `robots.txt`.
- Illustrations SVG originales : logo, favicon, sonde, quatre scénarios,
  icônes. Image de partage `og-image.png` (aperçu sur LinkedIn, Discord…) et
  icône iPhone.
- `site/assets/data/config.json` : fichier unique pour le mail de support
  Proton, les réseaux sociaux, le questionnaire et l'adresse du site.
- `tools/generate_qr.py` : génération des QR codes (site, questionnaire,
  support, réseaux sociaux) en SVG et PNG à partir de la config.
- `.github/workflows/pages.yml` : déploiement automatique sur GitHub Pages à
  chaque push sur `main`, avec régénération des QR codes.
- `docs/site-web.md` : documentation complète du site (structure,
  déploiement, configuration, QR codes, sécurité).
- Ce fichier `CHANGELOG.md`.

### Modifié

- `README.md` : nouvelle section « Site web ».

### Sécurité

- Politique CSP stricte sur toutes les pages, aucune ressource tierce, aucun
  cookie ni traceur, insertion du contenu dynamique par `textContent`.

### À faire

- Activer GitHub Pages (dépôt privé : voir `docs/site-web.md` §4.1).
- Créer l'adresse Proton Mail et les réseaux sociaux, puis les renseigner
  dans `config.json` et régénérer les QR codes.
- Choisir le service qui reçoit les réponses du questionnaire (§6 de la
  documentation) et mettre à jour les mentions légales.
- Vérifier le statut des objectifs O0 et O1 sur la feuille de route.

---

## Avant le 2026-11-03

- Présentation du projet (`README.md`), répartition des tâches, brief de
  contexte (`CONTEXT.md`).
- Plugin NetAlertX « Sonde Wi-Fi (Kismet) » dans
  `server/plugins/netalertx_kismet/`.
