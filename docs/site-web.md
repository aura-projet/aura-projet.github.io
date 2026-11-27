# Site web AURA

Documentation du site vitrine du projet : contenu, structure des fichiers,
mise en ligne sur GitHub Pages, configuration (mail de support, réseaux
sociaux, questionnaire) et QR codes pour le pitch.

Historique des modifications : voir [`CHANGELOG.md`](../CHANGELOG.md).

---

## 1. En bref

| | |
|---|---|
| Adresse publique | <https://aura-projet.github.io/> |
| Dépôt du site (public) | `aura-projet/aura-projet.github.io`, dans l'organisation GitHub de l'équipe |
| Dépôt du code (privé) | `Stayx3811/aura-code` : plugins, moteur AURA, documents internes |
| Hébergement | GitHub Pages, gratuit |
| Technologies | Accueil généré avec Astro et TypeScript, journal interactif en React, autres pages en HTML statique |
| Dépendances externes chargées par le navigateur | aucune (pas de CDN, pas de Google Fonts, pas de traceur) |
| Déploiement | GitHub Actions compile le site et publie `dist/` après les changements de la vitrine sur `main` |
| Questionnaire | hébergé sur Framaforms (Framasoft), voir §6 |
| Fichier à modifier pour le mail, les réseaux et le questionnaire | `site/assets/data/config.json` |

L’accueil reprend le bleu nuit et le corail du brouillon AURA. Le journal
réunit les indices d’une alerte probable dans une présentation inspirée d’un
journal réseau. La refonte suit la méthode [unslop](https://heydamir.design/unslop)
de Damir Sokolovsky (CC BY 4.0).

## 2. Contenu des pages

| Page | Rôle |
|---|---|
| `index.html` | Accueil, journal simulé et technologies utilisées |
| `le-projet.html` | Fonctionnement, matériel, limites et scénarios |
| `demo.html` | Démonstration sur données fictives, accessible par son ancienne adresse |
| `comparatif.html`, `faq.html`, `equipe.html` | Comparatif, questions fréquentes et équipe |
| `suggestions.html` | Page de retours sur le projet |
| `satisfaction.html` | Ancienne adresse du questionnaire qui redirige vers les suggestions |
| `mentions-legales.html` | Mentions légales, politique de confidentialité, informations RGPD sur le questionnaire |
| `404.html` | Page d'erreur servie par GitHub Pages pour toute adresse inconnue |

L’accueil présente le réseau filaire et le Wi-Fi 2,4 GHz, puis illustre leur
rapprochement par quatre événements fictifs. Le journal est lisible sans
JavaScript et se parcourt au clavier une fois React chargé. Les technologies
utilisées et les établissements figurent sous le journal.

Le site conserve le lien d’évitement et les préférences de langue et de thème.
Les animations de l’accueil et de la page du projet suivent le réglage système
`prefers-reduced-motion` et le bouton de pause.

Les polices locales Bricolage Grotesque et Atkinson Hyperlegible Next sont
fournies sous SIL OFL. Les pictogrammes [Papicons](https://github.com/PapillonApp/Papicons)
et les drapeaux [flag-icons](https://github.com/lipis/flag-icons) sont fournis
sous licence MIT. Les marques NetAlertX, Python, FastAPI et SQLite identifient
les technologies utilisées.

## 3. Arborescence

```
src/
├── pages/index.astro            accueil
├── components/Journal.tsx       journal de démonstration
└── styles/accueil.css           styles de l’accueil
site/
├── le-projet.html, demo.html, équipe et autres pages HTML
├── robots.txt
└── assets/
    ├── css/style.css            styles des pages statiques
    ├── js/main.js               menu et interactions des pages statiques
    ├── js/boot.js, js/i18n.js    langue et thème
    ├── data/config.json         CONFIGURATION (mail, réseaux, questionnaire, URL du site)
    ├── img/                     logo, favicon, sonde, illustrations des scénarios, icônes, image de partage
    └── qr/                      QR codes générés (SVG + PNG + manifest.json) : ne pas modifier à la main
tools/
└── generate_qr.py               génère site/assets/qr/ à partir de config.json
dist/                            résultat du build, non suivi par Git
docs/site-web.md                 ce document
.github/workflows/pages.yml      déploiement GitHub Pages
```

## 4. Hébergement et mise en ligne

### 4.1 Pourquoi une organisation GitHub

Publié depuis le dépôt de code, le site aurait eu pour adresse
`stayx3811.github.io/aura-code`, avec le nom d'utilisateur personnel du chef
de projet. Nous avons donc créé une **organisation GitHub gratuite**
`aura-projet`. Un dépôt nommé exactement `aura-projet.github.io` y est publié
à la racine de l'adresse <https://aura-projet.github.io/>.

Dans une organisation gratuite, GitHub Pages ne fonctionne qu'avec un dépôt
**public**. D'où la séparation en deux dépôts :

- le **site** (ce dépôt) est public : il ne contient que des fichiers statiques
  destinés à être vus de tous, **aucun secret** ;
- le **code** (plugins, moteur de corrélation, documents internes) reste dans
  le dépôt privé `Stayx3811/aura-code`.

Règle à respecter : ne jamais committer ici de mot de passe, clé d'API, jeton,
adresse IP interne ou capture de la plateforme de TP.

### 4.2 Création (une seule fois)

1. Créer l'organisation sur <https://github.com/organizations/plan>, offre
   **Free**, nom `aura-projet`. Inviter les trois autres membres.
2. Dans l'organisation, créer le dépôt **public** `aura-projet.github.io`,
   vide (sans README).
3. Pousser le site dans ce dépôt.
4. **Settings > Pages > Build and deployment > Source : « GitHub Actions »**.
   Ne pas cliquer sur les workflows suggérés (« Static HTML », « Jekyll ») :
   notre workflow existe déjà.
5. Onglet **Actions** : le workflow « Site web (GitHub Pages) » se lance à
   chaque push sur `main`. On peut aussi le lancer à la main avec
   « Run workflow ».

Si le workflow a tourné **avant** l'activation de Pages, il échoue à l'étape
`configure-pages` avec le message « Get Pages site failed ». Ce n'est pas un
bug : une fois Pages activé, ouvrir le run en échec dans l'onglet Actions et
cliquer sur « Re-run all jobs ».

### 4.3 Changer d'adresse

Si l'adresse change (autre organisation, nom de domaine), mettre à jour
`siteUrl` dans `config.json` et l’adresse du site dans `astro.config.mjs`, puis
régénérer les QR codes (§7) **avant de les imprimer**. Les chemins de
`404.html` sont absolus depuis la racine (`/assets/…`) : ils restent valables
tant que le site est servi à la racine du domaine.

### 4.4 Tester en local

```bash
npm ci
npm run check
npm run dev
```

Avec Node.js 24 ou ultérieur, ouvrir <http://localhost:4321>. Pour vérifier le
site tel qu’il sera publié, exécuter `npm run build` puis `npm run preview`.

## 5. Configuration : `site/assets/data/config.json`

C'est le **seul fichier à modifier** pour le mail, les réseaux sociaux et le
questionnaire. Il est lu par le site (au chargement de la page) et par le
générateur de QR codes.

| Clé | Rôle | Effet si vide |
|---|---|---|
| `siteUrl` | Adresse publique du site, utilisée dans les QR codes | obligatoire |
| `supportEmail` | Adresse de support (Proton Mail) | le site affiche « bientôt disponible », pas de QR code support |
| `satisfaction.externalFormUrl` | Adresse du questionnaire Framaforms (§6) | formulaire intégré au site, qui ne sait pas enregistrer de réponses seul |
| `satisfaction.endpoint` | Service qui reçoit les réponses du formulaire intégré (mode non utilisé, voir §6.3) | repli sur l'envoi par mail |
| `socials[].url` | Lien de chaque réseau social | le réseau n'est pas affiché, pas de QR code |

### 5.1 Ajouter l'adresse de support Proton

1. Créer le compte sur <https://proton.me/mail> (offre gratuite), par exemple
   `aura-support@proton.me` si le nom est libre. Pour un compte partagé à
   quatre : mot de passe long rangé dans un gestionnaire de mots de passe
   (KeePassXC, Bitwarden), double authentification activée, phrase de
   récupération conservée hors ligne. Ne jamais mettre le mot de passe dans
   un dépôt ni sur Discord.
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

## 6. Questionnaire de satisfaction (Framaforms)

GitHub Pages ne fait que servir des fichiers : il ne peut pas enregistrer de
réponses. Nous utilisons donc **[Framaforms](https://framaforms.org)**, service
gratuit et sans publicité de l'association française Framasoft, basé sur le
logiciel libre Yakforms. C'est cohérent avec notre discours open source et
RGPD, et la limite (5 000 réponses par formulaire) ne nous gênera pas.

Parcours : QR code → `satisfaction.html?src=qr` sur notre site → panneau
« Le questionnaire s'ouvre sur Framaforms » → redirection automatique au bout
de 2,5 secondes (ou clic sur le bouton). Le QR code pointe vers **notre**
page et non directement vers Framaforms : si un jour nous changeons de
service, les QR codes déjà imprimés restent valables.

### 6.1 Créer le questionnaire sur Framaforms

1. Créer un compte sur <https://framaforms.org> avec l'adresse de support
   Proton (§5.1), pour que le compte appartienne à l'équipe et pas à une
   personne.
2. Créer un formulaire « Votre avis sur AURA » et recopier les questions
   ci-dessous, dans cet ordre (les mêmes que le formulaire intégré au site) :

   | # | Question | Type | Réponses |
   |---|---|---|---|
   | 1 | Quelle note donneriez-vous au projet ? | choix unique, **obligatoire** | 1, 2, 3, 4, 5 |
   | 2 | Le problème présenté vous parle-t-il ? | choix unique | Oui, tout à fait / Un peu / Pas vraiment |
   | 3 | Qu'est-ce qui vous a le plus marqué ? | choix multiples | La sonde Wi-Fi / La corrélation ondes-réseau / La localisation sur le switch / Le tableau de bord / Le résumé par IA / Le pitch |
   | 4 | Recommanderiez-vous AURA à une entreprise ? | choix unique (échelle) | 0 à 10 |
   | 5 | Un commentaire, une idée, une critique ? | texte long, facultatif | aide : « Merci de ne pas indiquer de données personnelles. » |

3. Ajouter en tête du formulaire le texte d'information :
   > Questionnaire de l'équipe AURA (projet tutoré, BUT R&T, IUT de Valence).
   > Nous ne demandons ni nom ni adresse mail. Les réponses servent à évaluer
   > et améliorer le projet ; elles sont conservées jusqu'en juin 2027 puis
   > supprimées.
4. **Repousser la date d'expiration** du formulaire jusqu'à fin juin 2027 :
   par défaut, un formulaire Framaforms expire au bout de 6 mois.
5. Ne pas demander d'adresse mail et ne pas activer d'option qui
   enregistrerait des données d'identification.
6. Copier l'adresse publique du formulaire, puis la coller dans
   `config.json` :
   ```json
   "satisfaction": {
     "endpoint": "",
     "externalFormUrl": "https://framaforms.org/votre-avis-sur-aura-XXXXXXXX"
   },
   ```
7. Committer et pousser : le site se republie seul.
8. Tester depuis un téléphone en scannant le QR code « Votre avis », envoyer
   une réponse de test, vérifier qu'elle apparaît dans les résultats
   Framaforms, puis la supprimer.

### 6.2 Exploiter les réponses

Les résultats se consultent et s'exportent (tableur) depuis l'onglet des
résultats du formulaire sur Framaforms. Pour le rapport, exporter les
réponses après chaque présentation. En juin 2027, supprimer le formulaire et
les exports (voir la fiche RGPD dans le dépôt de code).

### 6.3 Autres modes (non utilisés)

Le script `satisfaction.js` sait aussi :

- envoyer les réponses du formulaire intégré vers un service compatible
  Formspree (`satisfaction.endpoint`). Il faut alors ajouter le domaine du
  service dans la directive `connect-src` de la balise
  `Content-Security-Policy` de `satisfaction.html`, sinon le navigateur
  bloque l'envoi. En cas d'échec (quota atteint, réseau), il propose l'envoi
  par mail ;
- ouvrir un mail pré-rempli vers `supportEmail` si rien d'autre n'est
  configuré.

Si aucun mode n'est configuré, le formulaire l'indique clairement : il ne
fait jamais croire que la réponse est partie.

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

Conventions de rédaction de l'équipe : « nous » plutôt que « on », pas de
formules toutes faites, espace insécable (`&nbsp;`) avant `: ; ? !`.

## 9. Sécurité du site

- **Content-Security-Policy** en balise `<meta>` sur chaque page : seuls les
  scripts, styles, images et requêtes vers le site lui-même sont autorisés.
  Aucun script en ligne (`<script>…</script>`) ni attribut `style=""` : tout
  est dans des fichiers séparés, ce qui permet une politique stricte.
- **Aucune ressource tierce** : police système (San Francisco sur Apple,
  Segoe UI sur Windows, Roboto sur Android) au lieu de Google Fonts, dont
  l'utilisation a déjà été jugée contraire au RGPD en Europe.
- **Aucun cookie, aucun outil de statistiques.** Le `localStorage` sert
  uniquement à afficher « vous avez déjà répondu » sur l'appareil qui a
  répondu ; rien n'est envoyé.
- Contenu dynamique inséré avec `textContent` (jamais `innerHTML`) : pas
  d'injection possible depuis la config ou le manifeste des QR codes.
- Liens externes en `rel="noopener noreferrer"`.
- Dépôt public : aucun secret, voir §4.1.
- Limite connue : GitHub Pages ne permet pas de définir des en-têtes HTTP
  (HSTS, `X-Frame-Options`…). La directive CSP `frame-ancestors` n'est pas
  prise en compte en balise `<meta>`.
