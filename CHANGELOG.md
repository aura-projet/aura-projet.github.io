# Journal des modifications du site

Toutes les modifications notables du site sont listées ici, de la plus
récente à la plus ancienne. Format inspiré de
[Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

Rubriques : **Ajouté**, **Modifié**, **Corrigé**, **Supprimé**, **Sécurité**.

---

## Refonte de l’accueil

- La rubrique Démo cède la place aux technologies utilisées. L’accueil et la page du projet adoptent deux nouvelles polices, des commandes de thème plus lisibles et un drapeau pour la langue proposée.
- Le schéma du projet suit chacune des cinq étapes. Les quatre scénarios ont des illustrations distinctes et les animations se mettent en pause à la demande.
- L’accueil Astro présente un journal React qui permet de suivre les indices d’une alerte probable sur un exemple simulé.
- GitHub Pages publie le résultat du build statique, avec les adresses existantes.

## Accueil et préférences de lecture

- L’accueil présente le cas d’une borne Wi-Fi inconnue à partir d’une capture de la console AURA en mode simulé.
- La navigation permet de choisir le français ou l’anglais et le thème clair ou sombre. Les choix sont conservés dans le navigateur.
- La page du projet distingue les fonctions disponibles et les limites du matériel.

---

## 2026-11-04 · Transfert dans l'organisation aura-projet

### Ajouté

- Dépôt public `aura-projet/aura-projet.github.io`, publié sur
  <https://aura-projet.github.io/>.
- `README.md` propre au site.

### Modifié

- Le site, son outil de QR codes, sa documentation et son workflow quittent
  le dépôt de code privé. L'historique Git du site a été conservé ; les
  fichiers internes du projet (plugins, brief, répartition des tâches) n'ont
  jamais été copiés ici.

---

## 2026-11-04 · Nouvelle adresse, Framaforms et mise en ligne

### Ajouté

- Adresse de support : `aura-support-ptut@proton.me` (Proton Mail),
  affichée dans Contact et les mentions légales, avec son QR code « Support ».
- Page du questionnaire : panneau « Le questionnaire s'ouvre sur
  Framaforms » avant la redirection (2,5 s), pour prévenir la personne
  qu'elle quitte notre site.
- `docs/rgpd-questionnaire.md` (dépôt de code) : fiche RGPD du questionnaire,
  comparaison Framaforms / Formspree / Microsoft Forms, points à vérifier.
- `docs/site-web.md` : pas à pas Framaforms (questions à recopier, date
  d'expiration), organisation GitHub, conseils de sécurité pour le compte
  Proton partagé.

### Modifié

- Adresse du site : `https://aura-projet.github.io/` (organisation GitHub
  `aura-projet`) au lieu de `stayx3811.github.io/aura-code`, pour ne pas
  publier sous un compte personnel. QR codes régénérés, image de partage et
  page 404 adaptées.
- Questionnaire : **Framaforms** retenu (association Framasoft, logiciel
  libre) à la place de Formspree.
- Mentions légales : sous-traitant Framaforms, adresse IP citée dans les
  données traitées ; « questionnaire anonyme » remplacé par « sans données
  d'identification demandées », plus exact au sens du RGPD.
- Formulaire intégré (mode de secours) : si le service d'envoi échoue, il
  l'explique et propose l'envoi par mail au support.
- Workflow GitHub Pages : `actions/checkout` v5 et `actions/setup-python` v6
  (les versions précédentes utilisaient Node.js 20, déprécié par GitHub).

### Corrigé

- Logo : les arcs extérieurs étaient légèrement rognés (zone de dessin SVG
  élargie).
- Boutons sombres affichés avec un texte bleu sur les pages claires (bouton
  « Découvrir le projet » après envoi, bouton Framaforms).

### Sécurité

- CSP resserrée : plus aucun domaine externe autorisé pour les requêtes
  (`connect-src 'self'`), Formspree n'étant plus utilisé.

### Notes

- PR #2 fusionnée dans `main` du dépôt de code. Son déploiement a échoué à
  l'étape `configure-pages` (Pages pas encore activé) ; c'est voulu de ne pas
  le relancer, pour ne pas publier sous l'adresse personnelle.

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
