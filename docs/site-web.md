# Site web AURA

Documentation du site vitrine du projet : contenu, structure des fichiers,
mise en ligne sur GitHub Pages, configuration (mail de support, réseaux
sociaux, questionnaire) et QR codes pour le pitch.

Historique des modifications : voir [`CHANGELOG.md`](../CHANGELOG.md).

---

## 1. En bref

| | |
|---|---|
| Adresse publique (une fois Pages activé) | <https://stayx3811.github.io/aura-code/> |
| Hébergement | GitHub Pages, gratuit |
| Technologies | HTML, CSS et JavaScript « à la main », sans framework ni étape de compilation |
| Dépendances externes chargées par le navigateur | aucune (pas de CDN, pas de Google Fonts, pas de traceur) |
| Déploiement | automatique à chaque push sur `main` qui touche `site/` (workflow `.github/workflows/pages.yml`) |
| Fichier à modifier pour le mail, les réseaux et le questionnaire | `site/assets/data/config.json` |

Le site reprend les codes des pages produit d'Apple : grandes typographies,
alternance de sections noires et claires, barre de navigation translucide,
animations déclenchées par le défilement. Toutes les illustrations sont des
SVG dessinés pour le projet (aucune image récupérée sur Internet, donc aucun
problème de droits).

## 2. Contenu des pages

| Page | Rôle |
|---|---|
| `index.html` | Page principale (détail ci-dessous) |
| `satisfaction.html` | Questionnaire de satisfaction anonyme, cible du QR code du pitch |
| `qr.html` | Kit QR codes : affichage, téléchargement SVG/PNG, impression A4 (4 par page). Non référencée par les moteurs de recherche |
| `mentions-legales.html` | Mentions légales, politique de confidentialité, informations RGPD sur le questionnaire |
| `404.html` | Page d'erreur servie par GitHub Pages pour toute adresse inconnue |

Sections de `index.html`, dans l'ordre :

1. **Hero** : animation canvas (la sonde émet des ondes, les appareils
   s'allument au passage, un appareil inconnu apparaît en rouge). L'animation
   suit légèrement la souris et se met en pause quand elle n'est plus visible.
2. **Le problème** : phrase qui s'allume mot à mot pendant le défilement.
3. **Chiffres clés** : compteurs animés.
4. **Fonctionnement** : schéma qui reste fixe à l'écran pendant que les cinq
   étapes défilent (écouter, recenser, croiser, localiser, alerter) ; le schéma
   met en avant les éléments de l'étape en cours.
5. **Scénarios** : carrousel horizontal des quatre scénarios de démo.
6. **Tableau de bord** : fausse fenêtre d'application avec graphe du réseau et
   flux d'alertes qui défile. Les données sont **fictives** et c'est indiqué
   sur la page (étiquette « Démo simulée »).
7. **La sonde** : illustration du boîtier avec effet de parallaxe.
8. **Sécurité et vie privée**.
9. **Feuille de route** O0 à O8 avec barre d'avancement.
10. **Open source** : briques réutilisées et licences.
11. **Équipe**.
12. **Votre avis** : QR code et lien vers le questionnaire.
13. **Contact et support** : mail Proton et réseaux sociaux (lus dans la config).

Accessibilité : lien d'évitement, navigation au clavier, textes alternatifs,
contrastes, et respect du réglage système « réduire les animations »
(`prefers-reduced-motion`) : les animations sont alors désactivées.

## 3. Arborescence

```
site/
├── index.html, satisfaction.html, qr.html, mentions-legales.html, 404.html
├── robots.txt
└── assets/
    ├── css/style.css            toute la mise en forme (commentée par section)
    ├── js/main.js               config, menu, animations au défilement, démo simulée, feuille de route
    ├── js/hero.js               animation canvas du hero
    ├── js/satisfaction.js       envoi du questionnaire
    ├── js/qr.js                 page kit QR codes
    ├── data/config.json         CONFIGURATION (mail, réseaux, questionnaire, URL du site)
    ├── img/                     logo, favicon, sonde, illustrations des scénarios, icônes, image de partage
    └── qr/                      QR codes générés (SVG + PNG + manifest.json) : ne pas modifier à la main
tools/
└── generate_qr.py               génère site/assets/qr/ à partir de config.json
.github/workflows/pages.yml      déploiement GitHub Pages
```

## 4. Mise en ligne sur GitHub Pages

### 4.1 Point de vigilance : le dépôt est privé

GitHub Pages est gratuit pour les **dépôts publics**. Pour un dépôt **privé**,
il faut un compte GitHub Pro (ou une organisation Team). Trois solutions,
toutes gratuites pour nous :

1. **GitHub Student Developer Pack** (solution conseillée) : en tant
   qu'étudiants, nous pouvons obtenir GitHub Pro gratuitement sur
   <https://education.github.com/pack> avec l'adresse mail de l'université.
   Le dépôt reste privé, seul le site est public.
2. **Rendre le dépôt public** : Settings > General > Danger Zone > Change
   visibility. À éviter tant que nous n'avons pas vérifié qu'aucun secret
   n'est passé dans l'historique Git.
3. **Créer un second dépôt public** dédié au site, et y copier le dossier
   `site/` et le workflow.

### 4.2 Activation (une seule fois)

1. Fusionner la branche du site dans `main` (le déploiement ne se lance que
   depuis `main`).
2. Sur GitHub : **Settings > Pages > Build and deployment > Source :
   « GitHub Actions »**.
3. Onglet **Actions** : le workflow « Site web (GitHub Pages) » se lance au
   prochain push sur `main`. On peut aussi le lancer à la main avec
   « Run workflow ».
4. Après une à deux minutes, le site est en ligne à l'adresse
   <https://stayx3811.github.io/aura-code/>.

Si l'adresse change (autre compte, autre dépôt, nom de domaine), mettre à jour
`siteUrl` dans `config.json`, la balise `og:image` de `index.html` et les
chemins `/aura-code/` de `404.html`, puis régénérer les QR codes.

### 4.3 Tester en local

```bash
cd site
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>. Ouvrir directement le fichier
`index.html` (double-clic) ne suffit pas : le navigateur bloque la lecture de
`config.json` hors serveur web.

## 5. Configuration : `site/assets/data/config.json`

C'est le **seul fichier à modifier** quand nous créerons le mail et les
réseaux sociaux. Il est lu par le site (au chargement de la page) et par le
générateur de QR codes.

| Clé | Rôle | Effet si vide |
|---|---|---|
| `siteUrl` | Adresse publique du site, utilisée dans les QR codes | obligatoire |
| `supportEmail` | Adresse de support (Proton Mail) | le site affiche « bientôt disponible », pas de QR code support |
| `satisfaction.endpoint` | URL d'un service qui reçoit les réponses du questionnaire (voir §6) | repli sur l'envoi par mail |
| `satisfaction.externalFormUrl` | URL d'un formulaire externe (Tally, Microsoft Forms…) vers lequel rediriger | questionnaire intégré au site |
| `socials[].url` | Lien de chaque réseau social | le réseau n'est pas affiché, pas de QR code |

### 5.1 Ajouter l'adresse de support Proton

1. Créer le compte sur <https://proton.me/mail> (offre gratuite), par exemple
   `aura-support@proton.me` si le nom est libre.
2. Renseigner l'adresse dans `config.json` :
   ```json
   "supportEmail": "aura-support@proton.me",
   ```
3. Régénérer les QR codes (§7), committer, pousser.

L'adresse apparaît alors dans la section Contact, les mentions légales et le
kit QR codes (QR code qui ouvre un mail vers le support).

### 5.2 Ajouter un réseau social

Renseigner l'`url` du réseau concerné dans `socials`, par exemple :

```json
{ "id": "linkedin", "label": "LinkedIn", "url": "https://www.linkedin.com/company/aura-projet" }
```

Pour ajouter un réseau absent de la liste (TikTok, Discord…), ajouter une
ligne avec un `id` unique sans espace. Régénérer ensuite les QR codes.

## 6. Questionnaire de satisfaction

Le questionnaire est **anonyme** : note sur 5, intérêt pour le problème,
points marquants, recommandation sur 10, commentaire facultatif. Un champ
caché piège les robots. Le paramètre `?src=qr` du QR code permet de savoir si
la réponse vient du QR code ou du site.

GitHub Pages ne fait que servir des fichiers : il ne peut pas enregistrer de
réponses. Il faut donc choisir où elles arrivent. Le script choisit le mode
selon la config, dans cet ordre :

| Mode | Config | Avantages | Limites |
|---|---|---|---|
| Formulaire externe | `externalFormUrl` | statistiques et export Excel tout prêts | on quitte notre site ; données chez le prestataire |
| Service d'envoi | `endpoint` | on garde notre design, réponses reçues en JSON ou par mail | offre gratuite limitée en nombre de réponses par mois |
| Mail pré-rempli | `supportEmail` seul | aucun prestataire en plus | la personne doit envoyer le mail elle-même : peu pratique sur le stand |

Si rien n'est configuré, le formulaire l'indique clairement : il ne fait
jamais croire que la réponse est partie.

**Recommandation pour le pitch** : utiliser le mode « service d'envoi » avec
[Formspree](https://formspree.io) (créer un formulaire, copier son URL
`https://formspree.io/f/xxxxxxx` dans `endpoint`). Le site est déjà configuré
pour autoriser ce domaine. Pour un autre service, ajouter son domaine dans la
directive `connect-src` de la balise `Content-Security-Policy` de
`satisfaction.html` et `index.html`, sinon le navigateur bloquera l'envoi.

Côté RGPD, le choix du prestataire est à documenter (Mahé) : Formspree est
une société américaine ; Tally annonce un hébergement dans l'Union européenne ;
Microsoft Forms via le compte universitaire reste dans le cadre de
l'université. Mettre à jour la ligne « Sous-traitant » des mentions légales
une fois le choix fait.

## 7. QR codes

Les QR codes sont générés par `tools/generate_qr.py` à partir de
`config.json` :

```bash
pip install segno
python3 tools/generate_qr.py
```

| QR code | Contenu | Créé si |
|---|---|---|
| `site` | adresse du site | toujours |
| `satisfaction` | questionnaire (`satisfaction.html?src=qr`) | toujours |
| `support` | `mailto:` vers l'adresse de support | `supportEmail` renseigné |
| `social-<id>` | lien du réseau | `url` renseignée |

Chaque QR code est produit en **SVG** (impression sans perte, affiches) et en
**PNG** 24 px par module (Canva, PowerPoint, Word), avec un niveau de
correction d'erreur Q (25 %) pour rester lisible sur une affiche abîmée. Les
QR codes devenus inutiles sont supprimés.

Le workflow de déploiement relance le script à chaque mise en ligne : le site
publié a donc toujours des QR codes à jour. Pensez quand même à lancer le
script en local et à committer le résultat, pour que le dépôt reste cohérent.

Pour le pitch : ouvrir `qr.html` sur le site, puis « Imprimer » (4 cartes par
page A4, avec traits de découpe). Pour l'affiche (J3), télécharger le PNG ou
le SVG depuis cette même page.

**Avant d'imprimer** : scanner chaque QR code avec deux téléphones différents
et vérifier qu'il ouvre la bonne page **en ligne** (le site doit déjà être
publié).

## 8. Mettre à jour le contenu

| Je veux… | Où |
|---|---|
| changer l'avancement de la feuille de route | `index.html`, attribut `data-status` de chaque `<li class="milestone">` : `done`, `doing` ou `todo`. La barre et le texte d'avancement se recalculent seuls |
| modifier un texte | directement dans le fichier HTML concerné |
| changer les fausses alertes de la démo | `assets/js/main.js`, tableau `FAKE_ALERTS` |
| changer les couleurs | `assets/css/style.css`, variables `--c1`, `--c2`, `--c3` en haut du fichier |
| remplacer une illustration | `assets/img/`, garder le même nom de fichier |

Conventions de rédaction (voir `CONTEXT.md`) : « nous » plutôt que « on »,
pas de formules toutes faites, espace insécable (`&nbsp;`) avant `: ; ? !`.

## 9. Sécurité du site

- **Content-Security-Policy** en balise `<meta>` sur chaque page : seuls les
  scripts, styles et images du site lui-même sont autorisés ; l'envoi du
  questionnaire n'est autorisé que vers Formspree. Aucun script en ligne
  (`<script>…</script>`) ni attribut `style=""` : tout est dans des fichiers
  séparés, ce qui permet une politique stricte.
- **Aucune ressource tierce** : police système (San Francisco sur Apple,
  Segoe UI sur Windows, Roboto sur Android) au lieu de Google Fonts, dont
  l'utilisation a déjà été jugée contraire au RGPD en Europe.
- **Aucun cookie, aucun outil de statistiques.** Le `localStorage` sert
  uniquement à afficher « vous avez déjà répondu » sur l'appareil qui a
  répondu ; rien n'est envoyé.
- Contenu dynamique inséré avec `textContent` (jamais `innerHTML`) : pas
  d'injection possible depuis la config ou le manifeste des QR codes.
- Liens externes en `rel="noopener noreferrer"`.
- Limite connue : GitHub Pages ne permet pas de définir des en-têtes HTTP
  (HSTS, `X-Frame-Options`…). La directive CSP `frame-ancestors` n'est pas
  prise en compte en balise `<meta>`.
