# AURA · site vitrine

Site de présentation d'**AURA** (Analyse Unifiée du Réseau et des Antennes),
notre projet tutoré de BUT Réseaux & Télécommunications, parcours
cybersécurité, à l'IUT de Valence (2026-2027).

AURA repère ce qui se branche sur le réseau et ce qui émet dans les locaux,
sans agent sur les postes.

**En ligne : <https://aura-projet.github.io/>**

Équipe : Yanis Lameche (chef de projet), Baptiste Faure--Streiff, Mahé
Peligry, Mathys Pannetier.

## Contenu du dépôt

Ce dépôt ne contient que le site, qui est public. Le code du projet (plugins
NetAlertX, moteur de corrélation) est dans un dépôt séparé et privé.

```
site/                        le site, publié tel quel (HTML, CSS, JavaScript, sans framework)
  assets/data/config.json    mail de support, réseaux sociaux, questionnaire, adresse du site
tools/generate_qr.py         génère les QR codes à partir de config.json
docs/site-web.md             documentation complète du site
.github/workflows/pages.yml  publication automatique sur GitHub Pages
CHANGELOG.md                 journal des modifications
```

## Tester en local

```bash
cd site
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>.

## Modifier le site

- Mail, réseaux sociaux, lien du questionnaire : `site/assets/data/config.json`,
  puis régénérer les QR codes :
  ```bash
  pip install segno
  python3 tools/generate_qr.py
  ```
- Chaque push sur `main` qui touche `site/` republie le site en une à deux
  minutes (onglet Actions).
- Noter chaque changement dans `CHANGELOG.md`.

Tout le détail (structure, questionnaire Framaforms, QR codes, sécurité) est
dans [`docs/site-web.md`](docs/site-web.md).

## Règles

- Dépôt public : **aucun secret** (mot de passe, clé d'API, jeton, adresse IP
  interne, capture de la plateforme de TP).
- Aucun cookie, aucun traceur, aucune ressource chargée depuis un autre site.

## Contact

<aura-support-ptut@proton.me>
