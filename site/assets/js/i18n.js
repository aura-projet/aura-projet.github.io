/* AURA · thème clair/sombre et bascule français/anglais.
   La version française reste la source : elle vit dans le HTML. L'anglais est un
   calque appliqué par-dessus, depuis le dictionnaire DICT.en ci-dessous.
   Tout est local : aucune donnée n'est envoyée. */
(function () {
  'use strict';
  var root = document.documentElement;

  /* --------------------------------------------------------------------- */
  /* Dictionnaire français → anglais. Clé = texte visible français normalisé */
  /* (apostrophes droites, espaces simples). Valeur = HTML anglais.          */
  /* --------------------------------------------------------------------- */
  var EN = {
    /* ---- Navigation, pied de page, éléments partagés ---- */
    'Accueil': 'Home',
    'Le projet': 'The project',
    'Démo': 'Demo',
    'Comparatif': 'Comparison',
    'Équipe': 'Team',
    'Proposer une idée': 'Suggest an idea',
    'Aller au contenu': 'Skip to content',
    'Retour au site': 'Back to site',
    'AURA · Analyse Unifiée du Réseau et des Antennes': 'AURA · Unified Analysis of Network and Antennas',
    'Améliorations et suggestions': 'Improvements and suggestions',
    'Questions fréquentes': 'Frequently asked questions',
    'Mentions légales': 'Legal notice',
    'Confidentialité': 'Privacy',
    'Projet tutoré BUT3 Réseaux & Télécommunications, parcours cybersécurité · IUT de Valence, Université Grenoble Alpes · 2026–2027': 'Tutored project · BUT3 Networks & Telecommunications, cybersecurity track · IUT de Valence, Université Grenoble Alpes · 2026–2027',
    /* aria-labels / alt partagés */
    'AURA, accueil': 'AURA, home',
    'Ouvrir le menu': 'Open menu',
    'Fermer le menu': 'Close menu',
    'Navigation principale': 'Main navigation',
    'Navigation': 'Navigation',
    'Liens de pied de page': 'Footer links',
    "Fil d'ariane": 'Breadcrumb',
    'Établissements': 'Institutions',
    /* ---- Relecture n°4 : établissements, répartition, connexion ---- */
    "Connexion": "Sign in",
    "IUT de Valence (nouvel onglet)": "IUT de Valence (new tab)",
    "BUT Réseaux et Télécommunications (nouvel onglet)": "BUT Networks and Telecommunications (new tab)",
    "Université Grenoble Alpes (nouvel onglet)": "Université Grenoble Alpes (new tab)",
    "GRETA Ardèche Drôme (nouvel onglet)": "GRETA Ardèche Drôme (new tab)",
    "Pilotage": "Project management",
    "Collecte": "Collection",
    "Matériel": "Hardware",
    "Sécurité": "Security",
    "Infrastructure": "Infrastructure",
    "Capteurs": "Sensors",
    "Conformité": "Compliance",
    "IA": "AI",
    "Design": "Design",
    "Qualité": "Quality",
    "Interface": "Interface",
    "Fabrication": "Manufacturing",
    "Communication": "Communication",
    "Connexion · AURA bêta": "Sign in · AURA beta",
    "Connexion au tableau de bord AURA, version bêta : se connecter, demander un compte au support ou recevoir un nouveau mot de passe.": "Sign in to the AURA dashboard, beta version: sign in, request an account from support or get a new password.",
    "Espace client": "Customer area",
    "Version bêta": "Beta version",
    "Se connecter au tableau de bord.": "Sign in to the<br>dashboard.",
    "AURA est en version bêta. Pendant cette phase, notre équipe crée les comptes à la main, sur demande, le temps de tester l'outil avec quelques structures.": "AURA is in beta. During this phase, our team creates accounts by hand, on request, while we test the tool with a few organisations.",
    "Accès au tableau de bord": "Dashboard access",
    "Choisir une action": "Choose an action",
    "Se connecter": "Sign in",
    "Demander un compte": "Request an account",
    "Mot de passe oublié": "Forgotten password",
    "Utilisez l'adresse e-mail et le mot de passe que le support AURA vous a envoyés.": "Use the email address and password that AURA support sent you.",
    "Adresse e-mail": "Email address",
    "Mot de passe": "Password",
    "Pas encore de compte ? Demander un accès": "No account yet? Request access",
    "Mot de passe oublié ?": "Forgot your password?",
    "Vos identifiants partent directement vers le serveur AURA, en HTTPS. Ce site vitrine ne les lit pas et ne les enregistre pas.": "Your credentials go straight to the AURA server over HTTPS. This showcase site never reads or stores them.",
    "Pendant la bêta, nous ouvrons les comptes un par un. Laissez-nous votre adresse e-mail : votre demande part au support AURA, qui vous recontacte pour préparer votre accès.": "During the beta, we open accounts one by one. Leave us your email address: your request goes to AURA support, who will get back to you to set up your access.",
    "Nom et prénom": "Full name",
    "Le support l'utilise pour vous recontacter.": "Support uses it to get back to you.",
    "Structure ou entreprise (facultatif)": "Organisation or company (optional)",
    "Votre besoin en quelques mots (facultatif)": "Your need in a few words (optional)",
    "Autre calcul": "Another sum",
    "Site web": "Website",
    "J'accepte que mon adresse e-mail serve uniquement à traiter cette demande.": "I agree that my email address is used only to handle this request.",
    "Envoyer la demande au support": "Send the request to support",
    "Indiquez l'adresse e-mail de votre compte. Nous ouvrons un ticket au support AURA, qui génère un nouveau mot de passe aléatoire et vous l'envoie à cette adresse.": "Enter the email address of your account. We open a ticket with AURA support, who generates a new random password and sends it to that address.",
    "Adresse e-mail du compte": "Account email address",
    "Demander un nouveau mot de passe": "Request a new password",
    "Par sécurité, nous n'indiquons jamais si un compte existe pour une adresse. Le nouveau mot de passe n'est envoyé qu'à l'adresse du compte.": "For security, we never say whether an account exists for an address. The new password is only sent to the account address.",
    "Comment se passe l'accès ?": "How does access work?",
    "Vous demandez un compte": "You request an account",
    "Avec l'adresse e-mail à laquelle nous pourrons vous répondre.": "With the email address where we can reply to you.",
    "Le support le prépare": "Support sets it up",
    "Nous vérifions la demande et créons votre compte sur le serveur AURA.": "We check the request and create your account on the AURA server.",
    "Vous vous connectez ici": "You sign in here",
    "Vos identifiants arrivent par e-mail. Ils ouvrent votre tableau de bord.": "Your credentials arrive by email. They open your dashboard.",
    "Le tableau de bord tourne pour l'instant sur le serveur de l'IUT. Tant qu'il n'est pas ouvert sur Internet, la connexion depuis ce site reste fermée.": "For now the dashboard runs on the IUT server. Until it is open to the Internet, signing in from this site stays closed.",
    'BUT Réseaux et Télécommunications': 'BUT Networks and Telecommunications',
    'AURA — Analyse Unifiée du Réseau et des Antennes': 'AURA — Unified Analysis of Network and Antennas',
    /* bandeau défilant (décoratif) */
    'Écouter': 'Listen', 'Recenser': 'Inventory', 'Croiser': 'Correlate', 'Alerter': 'Alert',

    /* ---- Accueil ---- */
    'AURA · Repérer les appareils inconnus sur votre réseau': 'AURA · Spot unknown devices on your network',
    "AURA rapproche les observations du réseau filaire et du Wi-Fi 2,4 GHz. Projet tutoré de BUT Réseaux & Télécommunications à l'IUT de Valence.": 'AURA combines observations from wired networks and 2.4 GHz Wi-Fi. A Networks & Telecommunications student project at IUT de Valence.',
    'Réseau filaire et Wi-Fi 2,4 GHz': 'Wired network and 2.4 GHz Wi-Fi',
    'Repérer les appareils inconnus sur votre réseau': 'Spot unknown devices on your network',
    'AURA rapproche ce qui se connecte au réseau filaire et ce que la sonde capte en Wi‑Fi, sans agent sur les postes.': 'AURA compares wired network connections with what the Wi-Fi sensor picks up, without installing agents on devices.',
    'Console AURA · Données simulées': 'AURA console · Simulated data',
    "Sans mesure d'audience": 'No audience tracking',
    'AURA · Le réseau et les ondes, au même endroit': 'AURA · The network and the airwaves, in one place',
    "AURA détecte ce qui se branche et ce qui émet dans vos locaux, sans agent sur les postes. Projet tutoré BUT Réseaux & Télécoms, IUT de Valence.": 'AURA detects what plugs in and what transmits on your premises, with no agent on the machines. Tutored project, BUT Networks & Telecoms, IUT de Valence.',
    'Le réseau et les ondes.': '<span class="rl__i">The network and the airwaves.</span>',
    'Au même endroit.': '<span class="rl__i">In one place.</span>',
    "Repérer ce qui se branche. Voir ce qui émet. AURA croise les deux, sans agent sur les postes.": 'Spot what plugs in. See what transmits. AURA cross-checks both, with no agent on the machines.',
    'Découvrir le projet': 'Discover the project',
    'Ouvrir la démo': 'Open the demo',
    'Voir les technologies': 'Explore the technologies',
    'Les technologies derrière AURA': 'The technology behind AURA',
    'Inventaire du réseau filaire': 'Wired network inventory',
    'Observation Wi-Fi 2,4 GHz': '2.4 GHz Wi-Fi observation',
    'Support de la sonde Wi-Fi': 'Platform for the Wi-Fi sensor',
    'Collecte et corrélation': 'Collection and correlation',
    'API de supervision': 'Monitoring API',
    'Référentiel et historique': 'Device registry and history',
    'Appareils reliés': 'Connected devices',
    'Référentiel AURA': 'AURA device registry',
    'Signal non déclaré': 'Unregistered signal',
    'Départ du poste': 'Device leaves',
    'Apparition de la borne': 'Access point appears',
    'Switch non déclaré': 'Unregistered switch',
    'Tableau de bord': 'Dashboard',
    'Schéma de principe': 'Process diagram',
    'Emplacement à vérifier': 'Location to verify',
    'Projet tutoré · BUT3 Réseaux & Télécoms · IUT de Valence': 'Tutored project · BUT3 Networks & Telecoms · IUT de Valence',
    'Explorer le projet': 'Explore the project',
    "Un appareil inconnu n'a pas d'agent. Il a pourtant une place sur votre réseau.": 'An unknown device has no agent. Yet it holds a place on your network.',
    'Repérer une borne Wi-Fi inconnue': 'Spot an unknown Wi-Fi access point',
    "La sonde observe les bornes en 2,4 GHz. La console rassemble les appareils repérés, le signal reçu et les indices qui ont motivé l'alerte.": 'The sensor observes 2.4 GHz access points. The console brings together observed devices, received signal strength and the evidence behind the alert.',
    'Essayer la démonstration': 'Try the demo',
    "Console AURA en mode démonstration, avec le graphe de supervision et la fiche d'une borne Wi-Fi signalée": 'AURA console in demo mode, showing the monitoring graph and a flagged Wi-Fi access point',
    'Réseau filaire': 'Wired network',
    'Wi-Fi · 2,4 GHz': 'Wi-Fi · 2.4 GHz',

    /* ---- Le projet ---- */
    "Du premier signal à l'alerte": 'From the first signal to the alert',
    'AURA rapproche les observations du réseau filaire et les relevés Wi-Fi de la sonde.': 'AURA brings wired network observations together with the sensor’s Wi-Fi readings.',
    'Comment AURA relie les observations': 'How AURA connects observations',
    'Quatre situations à repérer': 'Four situations to look for',
    'Les schémas illustrent des situations fictives.': 'The diagrams illustrate fictional situations.',
    'Un appareil non déclaré': 'An unregistered device',
    'Un switch non déclaré': 'An unregistered switch',
    'Un poste quitte le réseau et une borne apparaît peu après. AURA signale un partage de connexion probable.': 'A device leaves the network and an access point appears shortly afterwards. AURA flags likely Wi-Fi hotspot sharing.',
    'Comparer les outils': 'Compare the tools',
    "Étapes du fonctionnement d'AURA": 'Steps in the AURA process',
    'Étape précédente': 'Previous step',
    'Étape suivante': 'Next step',
    'Le projet AURA · Du réseau aux ondes': 'The AURA project · From network to airwaves',
    "Comment AURA marche, en clair : écoute Wi-Fi, collecte filaire, corrélation ondes/réseau et alertes. Les situations qu'on veut repérer et les briques de l'outil.": 'How AURA works, in plain terms: Wi-Fi listening, wired collection, airwave/network correlation and alerts. The situations we look for and the building blocks of the tool.',
    'La démarche': 'The approach',
    'Du réseau aux ondes, les indices se croisent.': 'From the network to the airwaves, the clues meet.',
    "AURA surveille le câble et les ondes en même temps, puis rapproche les deux. Le but : repérer vite ce qui cloche, sans rien installer sur les postes.": 'AURA watches the cable and the airwaves at the same time, then brings the two together. The goal: quickly spot what is off, without installing anything on the machines.',
    'Voir la démonstration': 'See the demonstration',
    'Comment ça marche': 'How it works',
    'Cinq étapes, une seule lecture.': 'Five steps, a single reading.',
    "Parcourez les cinq étapes : le schéma suit la carte active. Au doigt, à la souris ou avec les flèches du clavier.": 'Go through the five steps: the diagram follows the active card. By finger, by mouse or with the arrow keys.',
    'Écouter les ondes': 'Listen to the airwaves',
    "Une sonde Raspberry Pi écoute le Wi-Fi 2,4 GHz avec Kismet. Elle relève les bornes et les adresses autour d'elle, sans rien émettre.": 'A Raspberry Pi probe listens to 2.4 GHz Wi-Fi with Kismet. It records the access points and addresses around it, without transmitting anything.',
    'Recenser le réseau': 'Inventory the network',
    'NetAlertX liste les appareils du réseau filaire et les compare à notre référentiel connu / inconnu.': 'NetAlertX lists the wired-network devices and compares them against our known / unknown reference list.',
    'Croiser les événements': 'Correlate the events',
    "AURA rapproche un événement Wi-Fi et un événement réseau proches dans le temps. Par exemple : un poste part, une borne apparaît.": 'AURA brings together a Wi-Fi event and a network event close in time. For example: a machine leaves, an access point appears.',
    'Localiser sur le switch': 'Locate on the switch',
    'Objectif à venir': 'Upcoming goal',
    'Objectif à venir Lire la table MAC du switch en SNMP pour retrouver le port physique. Pas encore en place.': '<span class="tag">Upcoming goal</span><br>Read the switch MAC table over SNMP to find the physical port. Not in place yet.',
    'Alerter, et expliquer': 'Alert, and explain',
    "L'alerte montre la règle déclenchée et les indices. Une IA la reformule en clair ; l'administrateur décide.": 'The alert shows the triggered rule and the clues. An AI rephrases it in plain language; the administrator decides.',
    '1 / 5 · Écouter': '1 / 5 · Listen',
    '01 / 05 · Écouter les ondes': '01 / 05 · Listen to the airwaves',
    'Ce que nous cherchons à repérer.': 'What we are looking to spot.',
    "Quatre situations typiques. Les scènes sont des illustrations, pas un vrai réseau.": 'Four typical situations. The scenes are illustrations, not a real network.',
    'Priorité 1': 'Priority 1',
    'Un appareil pas déclaré': 'An undeclared device',
    "Il se branche sans être au référentiel. NetAlertX le voit, l'administrateur le qualifie.": 'It plugs in without being in the reference list. NetAlertX sees it, the administrator classifies it.',
    'Priorité 2': 'Priority 2',
    'Une borne Wi-Fi inconnue': 'An unknown Wi-Fi access point',
    'Une borne non déclarée émet dans les locaux. Retrouver son port de switch viendra plus tard.': 'An undeclared access point transmits on the premises. Finding its switch port will come later.',
    'Corrélation': 'Correlation',
    'Un partage de connexion': 'A shared connection',
    "Un poste s'en va pile quand une borne apparaît. Possible partage, à vérifier.": 'A machine leaves right as an access point appears. Possible sharing, to be checked.',
    'Sur données simulées': 'On simulated data',
    'Un switch ajouté en douce': 'A switch added on the quiet',
    "Plusieurs adresses derrière un même port. Nous le testons pour l'instant sur des données simulées.": 'Several addresses behind one port. For now we test it on simulated data.',
    'Place à la pratique.': 'Now to the practice.',
    "Le plus parlant, c'est de voir AURA tourner sur un tableau de bord simulé.": 'The most telling thing is to see AURA running on a simulated dashboard.',
    'Ouvrir la démonstration': 'Open the demonstration',
    "Comparer à l'existant": 'Compare with the existing tools',

    /* ---- Démo ---- */
    'Démonstration AURA · Tableau de bord simulé': 'AURA demonstration · Simulated dashboard',
    "Pilotez une démonstration d'AURA : vues filaire, Wi-Fi, cartographie et analyse IA, recherche d'appareils et alertes fictives. Rien n'agit sur un vrai réseau.": "Drive an AURA demonstration: wired, Wi-Fi, mapping and AI-analysis views, device search and fictional alerts. Nothing acts on a real network.",
    'Démonstration': 'Demonstration',
    'Simulation locale': 'Local simulation',
    'Prenez les commandes de la démonstration.': 'Take control of the demonstration.',
    "Changez de vue (filaire, Wi-Fi, cartographie, analyse IA, alertes), cherchez un appareil, ouvrez sa fiche ou déclenchez un événement pour voir ce qui change. Les appareils et les alertes sont fictifs : rien ici n'agit sur un vrai réseau.": 'Switch views (wired, Wi-Fi, mapping, AI analysis, alerts), search for a device, open its card or trigger an event to see what changes. The devices and alerts are fictional: nothing here acts on a real network.',
    'AURA · Votre réseau, expliqué': 'AURA · Your network, explained',
    "Vues de la démonstration": 'Demonstration views',
    "Choisir une vue": 'Choose a view',
    "Vue d'ensemble": 'Overview',
    'Appareils filaires': 'Wired devices',
    'Wi-Fi': 'Wi-Fi',
    'Cartographie': 'Mapping',
    'Analyse IA': 'AI analysis',
    'Alertes': 'Alerts',
    'Connus': 'Known',
    'À qualifier': 'To classify',
    'Alertes simulées': 'Simulated alerts',
    'Réseau filaire NetAlertX': 'Wired network NetAlertX',
    'Nom': 'Name', 'MAC': 'MAC', 'IP': 'IP', 'Fabricant': 'Maker', 'État': 'Status',
    'connu': 'known',
    'Non observé': 'Not seen',
    '(sans nom)': '(no name)',
    'non disponible': 'not available',
    'MAC aléatoire': 'random MAC',
    'Wi-Fi 2,4 GHz Kismet': 'Wi-Fi 2.4 GHz Kismet',
    'SSID': 'SSID', 'Type': 'Type', 'Canal': 'Channel', 'dBm': 'dBm', 'Paquets': 'Packets',
    'AP': 'AP', 'Client': 'Client',
    '(SSID masqué)': '(hidden SSID)',
    'Cartographie Plan fictif': 'Mapping Fictional plan',
    'Appareil connu': 'Known device',
    'Sonde Wi-Fi': 'Wi-Fi probe',
    'Switch': 'Switch',
    'Inconnu à vérifier': 'Unknown, to check',
    'Caméra thermique': 'Thermal camera',
    'Périmètre surveillé': 'Monitored perimeter',
    "Retrouver le port de switch exact d'un appareil (lecture SNMP) reste un objectif. Ces positions sont fictives et illustratives.": "Finding a device's exact switch port (SNMP read) is still a goal. These positions are fictional and illustrative.",
    'Analyse par IA Texte illustratif': 'AI analysis Illustrative text',
    'Borne Wi-Fi non déclarée, probable': 'Undeclared Wi-Fi access point, likely',
    "En clair : une borne « Livebox-7F2A » émet en 2,4 GHz dans les locaux mais ne figure pas au référentiel. Elle peut être un partage de connexion ou un équipement oublié. L'administrateur devrait vérifier qui l'a installée avant de conclure.": 'In plain terms: a "Livebox-7F2A" access point transmits at 2.4 GHz on the premises but is not in the reference list. It could be a shared connection or a forgotten device. The administrator should check who installed it before concluding.',
    'Gravité': 'Severity',
    'Moyenne · fixée par les règles': 'Medium · set by the rules',
    'Indice': 'Clue',
    'SSID absent du référentiel': 'SSID missing from the reference list',
    'À faire': 'To do',
    'Identifier puis qualifier': 'Identify, then classify',
    'Partage de connexion, à vérifier': 'Shared connection, to check',
    "En clair : un poste connu a quitté le réseau filaire au moment où une nouvelle borne Wi-Fi est apparue. Ce rapprochement dans le temps évoque un partage de connexion, sans le prouver. Les deux événements sont datés pour faciliter le contrôle.": 'In plain terms: a known machine left the wired network just as a new Wi-Fi access point appeared. This closeness in time suggests a shared connection, without proving it. Both events are timestamped to make checking easier.',
    'Élevée · fixée par les règles': 'High · set by the rules',
    'Poste hors ligne + borne au même instant': 'Machine offline + access point at the same moment',
    'Recouper avec le planning du poste': 'Cross-check with the machine schedule',
    "L'IA reformule l'alerte en langage clair pour l'administrateur. Elle ne décide pas de la gravité : ce sont les règles d'AURA qui la calculent. Exemple fictif.": "The AI rephrases the alert in plain language for the administrator. It does not decide the severity: AURA's rules compute it. Fictional example.",
    'Alertes Règles AURA': 'Alerts AURA rules',
    'Alertes fictives': 'Fictional alerts',
    'Borne non déclarée probable': 'Likely undeclared access point',
    'SSID fictif « Livebox-7F2A » · Wi-Fi 2,4 GHz · à vérifier.': 'Fictional SSID "Livebox-7F2A" · Wi-Fi 2.4 GHz · to check.',
    'Inventaire de démonstration': 'Demonstration inventory',
    'Les observations filaires et radio sont regroupées ici.': 'Wired and radio observations are gathered here.',
    'Référentiel chargé': 'Reference list loaded',
    'Jeu fictif : sept équipements connus. Aucune donnée du réseau réel.': 'Fictional set: seven known devices. No data from a real network.',
    'Nouvel appareil à qualifier': 'New device to classify',
    'Partage de connexion probable': 'Likely shared connection',
    'Deuxième appareil à qualifier': 'Second device to classify',
    'Appareil validé dans la simulation': 'Device validated in the simulation',
    'PC-COMPTA hors ligne et nouvelle borne 2,4 GHz : corrélation à vérifier, pas une preuve.': 'PC-COMPTA offline and a new 2.4 GHz access point: correlation to check, not proof.',
    "Simuler l'événement suivant": 'Simulate the next event',
    'Simuler un événement': 'Simulate an event',
    'Rejouer la démonstration': 'Replay the demonstration',
    "Les règles déterminent la gravité des alertes, pas une IA. L'administrateur vérifie les indices et décide de la suite.": 'The rules determine the severity of alerts, not an AI. The administrator checks the clues and decides what comes next.',
    "Envie d'aller plus loin ?": 'Want to go further?',
    'La démo montre le résultat. Les pages Projet et Comparatif expliquent comment et pourquoi.': 'The demo shows the result. The Project and Comparison pages explain how and why.',
    'Comprendre le fonctionnement': 'Understand how it works',
    'Voir le comparatif': 'See the comparison',
    /* dashboard-demo.js (vues générées) */
    'Rechercher un appareil': 'Search for a device',
    'Nom, adresse MAC ou IP': 'Name, MAC address or IP',
    'Afficher': 'Show',
    'Tous les états': 'All statuses',
    'À vérifier': 'To check',
    'Non observés': 'Not seen',
    'Lancer la visite': 'Start the tour',
    'Arrêter la visite': 'Stop the tour',
    'Repartir du début': 'Start over',
    'Fermer': 'Close',
    'Fermer le détail de cet appareil': 'Close this device detail',
    'Emplacement réel': 'Real location',
    'Non disponible — jeu fictif': 'Not available — fictional set',
    'Aucun appareil ne correspond à ces critères. Effacez la recherche ou changez le filtre.': 'No device matches these criteria. Clear the search or change the filter.',
    'Choisissez une vue, cliquez sur un appareil ou simulez un événement. Tout reste dans cette page.': 'Choose a view, click a device or simulate an event. Everything stays on this page.',
    'Plan fictif : chaque pastille situe un appareil de la démonstration. Aucune position réelle.': 'Fictional plan: each dot places a device from the demonstration. No real position.',
    "Reformulation illustrative des alertes par l'IA. La gravité reste calculée par les règles, pas par l'IA.": 'Illustrative rephrasing of alerts by the AI. Severity is still computed by the rules, not by the AI.',
    'Trois événements fictifs au maximum. Le bouton ci-dessous permet de poursuivre le scénario.': 'Up to three fictional events. The button below continues the scenario.',
    'Visite arrêtée. Vous pouvez continuer avec « Simuler un événement ».': 'Tour stopped. You can continue with "Simulate an event".',
    'Les animations sont en pause. Vous pouvez avancer à votre rythme avec « Simuler un événement ».': 'Animations are paused. You can move at your own pace with "Simulate an event".',

    /* ---- Comparatif ---- */
    "AURA face à l'existant · Comparatif, choix et matériel": 'AURA versus the existing tools · Comparison, choices and hardware',
    "Ce qu'AURA apporte par rapport à NetAlertX seul, un scan Wi-Fi ponctuel ou un NAC commercial. Pourquoi ces choix, le matériel employé et les dépôts qui nous inspirent.": 'What AURA adds compared with NetAlertX alone, a one-off Wi-Fi scan or a commercial NAC. Why these choices, the hardware used and the repositories that inspire us.',
    'Lecture honnête': 'An honest read',
    "AURA face à l'existant.": 'AURA versus the existing tools.',
    "Plusieurs outils savent déjà faire une partie du travail. Voici, honnêtement, ce qu'AURA apporte par rapport à eux, pourquoi nous faisons ces choix, et sur quel matériel il repose.": 'Several tools already do part of the job. Here, honestly, is what AURA adds compared with them, why we make these choices, and the hardware it runs on.',
    'Le tableau, sans fard.': 'The table, unvarnished.',
    "Les cases « En cours » et « Objectif » signalent ce qui n'est pas encore en place. Nous préférons l'annoncer plutôt que de le survendre.": 'The "In progress" and "Goal" cells flag what is not in place yet. We would rather say so than oversell it.',
    'Tableau comparatif entre AURA et des solutions existantes': 'Comparison table between AURA and existing solutions',
    "Comparaison d'AURA avec NetAlertX seul, un scan Wi-Fi ponctuel et un contrôle d'accès réseau commercial.": 'Comparison of AURA with NetAlertX alone, a one-off Wi-Fi scan and a commercial network access control.',
    'Critère': 'Criterion',
    'NetAlertX seul': 'NetAlertX alone',
    'Scan Wi-Fi ponctuel': 'One-off Wi-Fi scan',
    'NAC commercial': 'Commercial NAC',
    'Écoute Wi-Fi': 'Wi-Fi listening',
    'Corrélation ondes / réseau': 'Airwave / network correlation',
    'Localisation sur le port de switch': 'Location on the switch port',
    'Sans agent sur les postes': 'No agent on the machines',
    'Logiciel libre': 'Open-source software',
    'Coût': 'Cost',
    'Oui': 'Yes', 'Non': 'No', 'Ponctuel': 'One-off', 'Parfois': 'Sometimes',
    'En cours': 'In progress', 'Objectif': 'Goal', 'Souvent non': 'Often no',
    'Variable': 'Varies', 'Faible': 'Low', 'Élevé': 'High', 'Matériel seul': 'Hardware only',
    "Lecture honnête d'étudiants : un NAC commercial fait déjà beaucoup, mais au prix d'agents sur les postes et d'une licence. AURA vise la corrélation ondes/réseau, en logiciel libre et sans agent.": 'An honest student read: a commercial NAC already does a lot, but at the cost of agents on the machines and a licence. AURA aims at airwave/network correlation, open-source and agent-free.',
    'Pourquoi AURA, et pas autre chose.': 'Why AURA, and not something else.',
    'Ce ne sont pas des promesses commerciales, mais les partis pris qui guident notre projet.': 'These are not sales promises, but the choices that guide our project.',
    "Rien à installer sur les ordinateurs. AURA observe le réseau et les ondes depuis l'extérieur des machines.": 'Nothing to install on the computers. AURA observes the network and the airwaves from outside the machines.',
    'Les ondes et le réseau, ensemble': 'The airwaves and the network, together',
    "La plupart des outils voient l'un ou l'autre. AURA rapproche les deux pour donner du sens aux indices.": 'Most tools see one or the other. AURA brings the two together to make sense of the clues.',
    'Bâti sur du logiciel libre': 'Built on open-source software',
    'NetAlertX, Kismet, Netdisco : des briques éprouvées, chacune avec sa licence, que nous assemblons.': 'NetAlertX, Kismet, Netdisco: proven building blocks, each with its own licence, that we assemble.',
    'Tout reste local': 'Everything stays local',
    "Les observations restent chez vous, sur votre serveur. Seule l'explication d'alerte peut passer par une IA externe.": 'The observations stay with you, on your server. Only the alert explanation may go through an external AI.',
    'Des alertes expliquées': 'Explained alerts',
    "Chaque alerte montre la règle qui l'a déclenchée et les indices. La gravité est calculée, pas devinée.": 'Each alert shows the rule that triggered it and the clues. Severity is computed, not guessed.',
    'Transparent et documenté': 'Transparent and documented',
    "Un projet d'étudiants, assumé comme tel : objectifs, limites et code sont écrits noir sur blanc.": 'A student project, owned as such: goals, limits and code are written down in black and white.',
    'Le matériel qui écoute et rassemble les observations.': 'The hardware that listens and gathers the observations.',
    'Du matériel accessible, et des rôles séparés : le Raspberry Pi écoute, le serveur rassemble les observations.': 'Affordable hardware, with separate roles: the Raspberry Pi listens, the server gathers the observations.',
    'Raspberry Pi 3B+': 'Raspberry Pi 3B+',
    "Kismet écoute les trames de gestion. AURA lit son API REST, sans installer d'agent sur les postes.": 'Kismet listens to the management frames. AURA reads its REST API, with no agent installed on the machines.',
    'Processeur': 'Processor', 'Mémoire': 'Memory', 'Système': 'System',
    '4 cœurs · 1,4 GHz': '4 cores · 1.4 GHz',
    '1 Go': '1 GB',
    'Raspberry Pi OS Lite 64 bits': 'Raspberry Pi OS Lite 64-bit',
    'Alfa AWUS036NH': 'Alfa AWUS036NH',
    'Ralink RT3070, mode monitor et antenne externe. Capture en 2,4 GHz uniquement.': 'Ralink RT3070, monitor mode and external antenna. Captures on <strong>2.4 GHz only</strong>.',
    'Cisco Catalyst': 'Cisco Catalyst',
    'Localiser un appareil par la table MAC en SNMP : un objectif à venir, pas encore une fonction disponible.': 'Locating a device via the MAC table over SNMP: an upcoming goal, not an available feature yet.',
    'Serveur Debian 12': 'Debian 12 server',
    'NetAlertX et AURA Core dans une VM, sur XCP-ng et Xen Orchestra.': 'NetAlertX and AURA Core in a VM, on XCP-ng and Xen Orchestra.',
    'Ressources': 'Resources', 'Déploiement': 'Deployment',
    '2 vCPU · 4 Go RAM · 20 Go': '2 vCPU · 4 GB RAM · 20 GB',
    'Docker': 'Docker',
    'Des briques libres qui travaillent ensemble.': 'Open-source blocks working together.',
    'Des logiciels libres, leurs API et notre moteur de corrélation. Chaque brique conserve sa licence.': 'Open-source software, their APIs and our correlation engine. Each block keeps its own licence.',
    'Surveillance du réseau filaire.': 'Wired-network monitoring.',
    'Écoute Wi-Fi, utilisé par son API comme programme séparé.': 'Wi-Fi listening, used through its API as a separate program.',
    "Source d'inspiration pour la lecture SNMP à venir.": 'Inspiration for the upcoming SNMP read.',
    'Brique envisagée pour le graphe réseau du dashboard.': 'Block considered for the dashboard network graph.',
    'Le projet, à la source.': 'The project, at the source.',
    'Voir le dépôt GitLab IUT Dépôt de référence': 'View the IUT GitLab repository <span>Reference repository</span>',
    'Retrouver AURA sur GitHub Organisation et site vitrine': 'Find AURA on GitHub <span>Organisation and showcase site</span>',
    'Les dépôts GitHub qui nous ont inspirés.': 'The GitHub repositories that inspired us.',
    "Nous ne partons pas de zéro. Voici les projets libres que nous étudions, utilisons ou dont nous reprenons les idées — avec un lien vers leur code.": 'We are not starting from scratch. Here are the open-source projects we study, use or borrow ideas from — with a link to their code.',
    'Le socle de la surveillance filaire. Nous le prolongeons par des plugins, sans le réécrire.': 'The foundation of wired monitoring. We extend it with plugins, without rewriting it.',
    'Voir le dépôt': 'View the repository',
    "L'écoute Wi-Fi sur la sonde. Nous lisons son API REST comme un programme séparé.": 'The Wi-Fi listening on the probe. We read its REST API as a separate program.',
    "La lecture SNMP des switchs. Source d'inspiration pour retrouver le port d'un appareil.": "The SNMP read of switches. Inspiration for finding a device's port.",
    'Décodage de signaux radio 433/868 MHz en réception seule. Piste « si nous avons le temps ».': 'Decoding 433/868 MHz radio signals, receive-only. A "if we have time" lead.',
    'La brique envisagée pour dessiner le graphe réseau du tableau de bord.': 'The block considered for drawing the dashboard network graph.',
    'Une question reste ?': 'Still have a question?',
    'La FAQ répond aux questions fréquentes. Sinon, écrivez-nous : nous lisons tout.': 'The FAQ answers the common questions. Otherwise, write to us: we read everything.',
    'Lire la FAQ': 'Read the FAQ',

    /* ---- FAQ ---- */
    'Questions fréquentes · AURA': 'Frequently asked questions · AURA',
    "Vie privée, RGPD, matériel, portée réelle : les réponses claires aux questions qui reviennent sur AURA, projet tutoré BUT Réseaux & Télécoms de l'IUT de Valence.": "Privacy, GDPR, hardware, real reach: clear answers to the recurring questions about AURA, a tutored BUT Networks & Telecoms project at IUT de Valence.",
    'Vos questions': 'Your questions',
    'Questions fréquentes.': 'Frequently asked questions.',
    "Les questions qui reviennent quand nous présentons AURA. Si la vôtre n'y est pas, la page de suggestions est là pour ça.": 'The questions that come up when we present AURA. If yours is not here, the suggestions page is there for that.',
    'AURA lit-il le contenu de mes communications ?': 'Does AURA read the content of my communications?',
    "Non. La sonde écoute uniquement les trames de gestion du Wi-Fi, c'est-à-dire des métadonnées (adresses, noms de bornes, puissance). Elle n'émet rien et ne lit aucun contenu de navigation ou de message.": 'No. The probe only listens to Wi-Fi management frames, that is, metadata (addresses, access-point names, signal strength). It transmits nothing and reads no browsing or message content.',
    'Faut-il installer un logiciel sur les postes ?': 'Do I need to install software on the machines?',
    "Non. AURA fonctionne sans agent. Rien n'est installé sur les ordinateurs des utilisateurs : tout se passe côté réseau et côté sonde.": "No. AURA works without an agent. Nothing is installed on the users' computers: everything happens on the network side and the probe side.",
    'Et le RGPD dans tout ça ?': 'And what about the GDPR?',
    "AURA observe des métadonnées, dans les locaux de l'organisation, sans collecter de contenu. Le cadre légal et les mentions de confidentialité sont suivis par l'équipe ; les détails figurent dans nos mentions légales.": "AURA observes metadata, on the organisation's premises, without collecting content. The legal framework and privacy notice are handled by the team; the details are in our legal notice.",
    'AURA capte-t-il le Wi-Fi 5 GHz ?': 'Does AURA capture 5 GHz Wi-Fi?',
    "Pas pour l'instant. La sonde actuelle écoute en 2,4 GHz uniquement. Le 5 GHz dépendrait d'un autre matériel et du firmware adapté.": 'Not for now. The current probe listens on 2.4 GHz only. 5 GHz would depend on other hardware and suitable firmware.',
    'Peut-on savoir sur quel port un appareil est branché ?': 'Can we tell which port a device is plugged into?',
    "Pas encore. La localisation sur le port d'un switch, par lecture SNMP, est un objectif que nous annonçons comme tel. Aujourd'hui, AURA ne connaît pas le port physique.": "Not yet. Locating a device on a switch port, via an SNMP read, is a goal we state as such. Today AURA does not know the physical port.",
    'Les adresses MAC aléatoires ne faussent-elles pas tout ?': 'Do random MAC addresses not throw everything off?',
    "Elles compliquent la détection, c'est vrai. C'est pour cela que nous parlons d'alerte « probable » et que nous croisons plusieurs indices (nom de borne, heure, poste qui disparaît) plutôt qu'un seul.": 'They do make detection harder, true. That is why we speak of a "likely" alert and cross-check several clues (access-point name, time, machine disappearing) rather than just one.',
    'AURA est-il un produit à vendre ?': 'Is AURA a product for sale?',
    "Non. C'est un projet tutoré du BUT3 Réseaux & Télécommunications (parcours cybersécurité) à l'IUT de Valence. Il n'y a ni offre commerciale, ni tarif.": 'No. It is a tutored project of the BUT3 Networks & Telecommunications (cybersecurity track) at IUT de Valence. There is no commercial offer and no price.',
    'Quel matériel faut-il ?': 'What hardware is needed?',
    "Un Raspberry Pi 3B+ avec un dongle Wi-Fi en mode monitor pour la sonde, et un petit serveur ou une VM (Debian, Docker) pour NetAlertX et AURA Core. Rien d'exotique.": 'A Raspberry Pi 3B+ with a Wi-Fi dongle in monitor mode for the probe, and a small server or VM (Debian, Docker) for NetAlertX and AURA Core. Nothing exotic.',
    "Votre question n'y est pas ?": 'Your question is not here?',
    'Dites-nous ce qui vous aiderait et dans quelle situation. Nous lisons chaque message.': 'Tell us what would help you and in what situation. We read every message.',
    'Poser une question': 'Ask a question',
    'Revenir au projet': 'Back to the project',

    /* ---- Équipe ---- */
    "L'équipe AURA · Quatre étudiants, un projet": 'The AURA team · Four students, one project',
    "L'équipe derrière AURA : quatre étudiants du BUT3 Réseaux & Télécommunications de l'IUT de Valence, leurs rôles, et comment nous contacter.": 'The team behind AURA: four students from the BUT3 Networks & Telecommunications at IUT de Valence, their roles, and how to contact us.',
    'Qui fait AURA': 'Who makes AURA',
    'Une équipe de quatre étudiants pour construire AURA.': 'A team of four students building AURA.',
    'BUT Réseaux & Télécommunications, parcours cybersécurité, IUT de Valence, promotion 2026-2027.': 'BUT Networks & Telecommunications, cybersecurity track, IUT de Valence, class of 2026-2027.',
    'Chef de projet': 'Project lead',
    'Planning, collecte NetAlertX, back-end, sonde Wi-Fi, documentation technique et pitch.': 'Planning, NetAlertX collection, back-end, Wi-Fi probe, technical documentation and pitch.',
    'Sécurité & infrastructure': 'Security & infrastructure',
    'Durcissement, analyse de risque, VM serveur, capteur infrarouge et communication.': 'Hardening, risk analysis, server VM, infrared sensor and communication.',
    'IA, design & RGPD': 'AI, design & GDPR',
    "API vers l'IA, charte graphique et maquettes, cadre légal, guide utilisateur et tests d'ergonomie.": 'API to the AI, visual identity and mockups, legal framework, user guide and usability testing.',
    'Interface & conception': 'Interface & design',
    'Tableau de bord web, boîtiers imprimés en 3D, montage vidéo et communication.': 'Web dashboard, 3D-printed cases, video editing and communication.',
    'Une idée pour faire avancer AURA ?': 'An idea to move AURA forward?',
    "Vous avez une idée pour AURA ou un passage du site n'est pas clair ? Dites-nous ce qui vous aiderait et dans quelle situation.": 'Have an idea for AURA or a part of the site that is unclear? Tell us what would help you and in what situation.',
    'Proposer une amélioration': 'Suggest an improvement',
    'Support': 'Support',
    'Adresse de contact bientôt disponible': 'Contact address coming soon',
    'Réseaux sociaux': 'Social networks',
    'Nos réseaux arrivent très bientôt.': 'Our social accounts are coming very soon.',

    /* ---- Suggestions ---- */
    'Suggestions et améliorations · AURA': 'Suggestions and improvements · AURA',
    "Proposez une amélioration pour AURA : usage, interface, fonctionnalité ou documentation.": 'Suggest an improvement for AURA: usage, interface, feature or documentation.',
    'Une idée pour améliorer AURA ?': 'An idea to improve AURA?',
    "Que changeriez-vous dans AURA ou dans sa présentation ? Vous pouvez partir d'un problème rencontré ou d'une information que vous n'avez pas trouvée.": 'What would you change in AURA or in how it is presented? You can start from a problem you ran into or from information you could not find.',
    "Pour partir d'un cas concret": 'To start from a concrete case',
    "« Pour comprendre une alerte, j'aimerais voir… »": '"To understand an alert, I would like to see…"',
    '« Pour un administrateur, ce serait plus simple si… »': '"For an administrator, it would be simpler if…"',
    '« Dans la présentation du projet, il manque… »': '"In the project presentation, what is missing is…"',
    'Et ensuite ?': 'And then?',
    "Vos suggestions nous aident à choisir les prochaines améliorations du projet. Nous ne pourrons pas toutes les réaliser. Si vous laissez votre adresse e-mail, nous pourrons vous demander des précisions, mais nous ne pouvons pas garantir une réponse à chaque message.": 'Your suggestions help us choose the next improvements to the project. We will not be able to carry them all out. If you leave your email address, we may ask you for details, but we cannot guarantee a reply to every message.',
    "N'indiquez ni mot de passe, ni adresse IP ou MAC réelle, ni information confidentielle sur votre réseau.": 'Do not enter any password, real IP or MAC address, or confidential information about your network.',
    'Votre suggestion': 'Your suggestion',
    "Tous les champs sont obligatoires, sauf l'adresse e-mail.": 'All fields are required, except the email address.',
    'Détails de la suggestion': 'Suggestion details',
    'Type de suggestion': 'Suggestion type',
    'Choisir un type': 'Choose a type',
    'Usage et besoins': 'Usage and needs',
    'Interface et accessibilité': 'Interface and accessibility',
    'Fonctionnalité': 'Feature',
    'Présentation et documentation': 'Presentation and documentation',
    'Autre amélioration': 'Other improvement',
    'Sujet': 'Subject',
    "De 5 à 120 caractères. Par exemple : « Clarifier le niveau d'une alerte ».": 'From 5 to 120 characters. For example: "Clarify the level of an alert".',
    'Votre idée en détail': 'Your idea in detail',
    "De 20 à 2 000 caractères. Expliquez dans quelle situation vous utiliseriez cette amélioration et ce qu'elle vous aiderait à faire.": 'From 20 to 2,000 characters. Explain in what situation you would use this improvement and what it would help you do.',
    'Adresse e-mail (facultative)': 'Email address (optional)',
    "Seulement si vous acceptez d'être recontacté au sujet de cette idée.": 'Only if you agree to be contacted again about this idea.',
    'Laisser ce champ vide': 'Leave this field empty',
    "J'accepte que l'équipe AURA utilise ma suggestion et, si je la fournis, mon adresse e-mail pour améliorer le projet et me recontacter à ce sujet.": 'I agree that the AURA team may use my suggestion and, if I provide it, my email address to improve the project and contact me about it.',
    "La vérification anti-robot se fait sur cette page, sans service externe. L'envoi, lorsqu'il est configuré, transmet votre message à Formspree. Informations de confidentialité.": 'The anti-robot check happens on this page, with no external service. Sending, when configured, forwards your message to Formspree. <a href="mentions-legales.html#confidentialite">Privacy information</a>.',
    'Vérification anti-robot': 'Anti-robot check',
    'Petit calcul de vérification…': 'A small verification sum…',
    'Autre question': 'Another question',
    "Répondez à la question pour activer l'envoi.": 'Answer the question to enable sending.',
    'Envoyer ma suggestion': 'Send my suggestion',
    "JavaScript est nécessaire à la vérification anti-robot. Aucun envoi n'est possible ici sans cette vérification.": 'JavaScript is required for the anti-robot check. No sending is possible here without it.',
    'Une autre façon de partager votre idée': 'Another way to share your idea',
    "Vous pouvez aussi copier votre suggestion ou préparer un e-mail. Ces options n'utilisent pas la vérification anti-robot du formulaire. Copier le texte ne transmet rien. Si vous préparez un e-mail, vérifiez-le puis envoyez-le depuis votre messagerie.": "You can also copy your suggestion or prepare an email. These options do not use the form's anti-robot check. Copying the text sends nothing. If you prepare an email, review it then send it from your mail app.",
    'Copier ma suggestion': 'Copy my suggestion',
    'Préparer un e-mail (sans CAPTCHA)': 'Prepare an email (without CAPTCHA)',
    'Texte à sélectionner et copier manuellement': 'Text to select and copy manually',
    'Choisissez un type de suggestion.': 'Choose a suggestion type.',

    /* ---- Mentions légales ---- */
    'Mentions légales et confidentialité · AURA': 'Legal notice and privacy · AURA',
    'Informations légales': 'Legal information',
    'Mentions légales et confidentialité': 'Legal notice and privacy',
    'Dernière mise à jour : 17 novembre 2026.': 'Last updated: 17 November 2026.',
    'Éditeur du site': 'Site publisher',
    "Ce site présente AURA, un projet tutoré non commercial réalisé dans le cadre du BUT Réseaux & Télécommunications, parcours cybersécurité, à l'IUT de Valence (Université Grenoble Alpes), année 2026-2027.": 'This site presents AURA, a non-commercial tutored project carried out as part of the BUT Networks & Telecommunications, cybersecurity track, at IUT de Valence (Université Grenoble Alpes), year 2026-2027.',
    'Responsable de la publication': 'Publication manager',
    'Yanis Lameche, chef de projet': 'Yanis Lameche, project lead',
    'Contact': 'Contact',
    'Adresse de support en cours de création': 'Support address being set up',
    'Hébergement': 'Hosting',
    'Le site est hébergé gratuitement par GitHub Pages, service de GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.': 'The site is hosted free of charge by GitHub Pages, a service of GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States.',
    'Propriété intellectuelle': 'Intellectual property',
    'Les schémas des scénarios ont été réalisés pour le projet. Les noms, logos et photographies restent la propriété de leurs auteurs ou établissements respectifs. NetAlertX, Kismet, Netdisco, D3.js et rtl_433 sont des projets libres appartenant à leurs auteurs respectifs et cités avec leur licence.': 'The scenario diagrams were made for the project. The names, logos and photographs remain the property of their respective authors or institutions. NetAlertX, Kismet, Netdisco, D3.js and rtl_433 are open-source projects belonging to their respective authors and cited with their licence.',
    'Confidentialité et données personnelles': 'Privacy and personal data',
    'Nous appliquons à ce site les principes que nous défendons dans le projet : collecter le moins possible.': 'We apply to this site the principles we stand for in the project: collect as little as possible.',
    "Aucun outil de mesure d'audience ni traceur publicitaire ajouté par AURA.": '<strong>No audience-measurement tool</strong> or advertising tracker added by AURA.',
    "Les polices et les visuels sont hébergés avec le site. La vérification anti-robot du formulaire de suggestions se fait sur la page elle-même, sans service externe ni transmission à un tiers. Pour l'envoi, le formulaire prévoit un seul service externe, Formspree, activé uniquement lorsque la configuration publique du formulaire est renseignée.": "The fonts and visuals are hosted with the site. The suggestion form's anti-robot check happens on the page itself, with no external service or transfer to a third party. For sending, the form plans a single external service, Formspree, enabled only when the form's public configuration is filled in.",
    "Ouvrir la page de suggestions ne transmet aucune donnée à un tiers. Lorsque l'envoi est configuré, envoyer le formulaire transmet les champs saisis à Formspree : ce n'est alors pas un service anonyme.": 'Opening the suggestions page transfers no data to a third party. When sending is configured, submitting the form forwards the entered fields to Formspree: it is then not an anonymous service.',
    'Comme tout hébergeur, GitHub enregistre des données techniques de connexion (adresse IP notamment) pour assurer la sécurité du service. Voir la déclaration de confidentialité de GitHub.': "Like any host, GitHub records technical connection data (IP address in particular) to keep the service secure. See <a href=\"https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement\" rel=\"noopener noreferrer\">GitHub's privacy statement</a>.",
    'Finalité': 'Purpose',
    'Recueillir des propositions pour améliorer AURA et répondre si une adresse de contact est fournie.': 'Collect proposals to improve AURA and reply if a contact address is provided.',
    'Champs du formulaire': 'Form fields',
    'Type de proposition, sujet, description, consentement et adresse mail facultative. Nous ne demandons ni nom ni note de satisfaction.': 'Proposal type, subject, description, consent and optional email address. We ask for neither a name nor a satisfaction rating.',
    'Envoi volontaire': 'Voluntary submission',
    "Une case explicite accompagne l'envoi de la suggestion. La vérification anti-robot se fait localement, dans votre navigateur, sans transmission à un tiers.": 'An explicit checkbox accompanies the submission of the suggestion. The anti-robot check happens locally, in your browser, with no transfer to a third party.',
    'Destinataires': 'Recipients',
    "Les membres de l'équipe AURA ; Formspree pour transmettre le formulaire, après activation de ce service.": 'The members of the AURA team; Formspree to forward the form, once that service is enabled.',
    'Durée de conservation': 'Retention period',
    "Jusqu'à la fin du projet tutoré (juin 2027), puis suppression.": 'Until the end of the tutored project (June 2027), then deletion.',
    'Services externes': 'External services',
    "Voir la politique de Formspree. L'équipe doit vérifier sa configuration, ses conditions et les durées de conservation avant activation.": "See <a href=\"https://formspree.io/legal/privacy-policy/\" rel=\"noopener noreferrer\">Formspree</a>'s policy. The team must check its configuration, terms and retention periods before enabling it.",
    "N'indiquez pas de mot de passe, de jeton, de capture sensible ni de données réseau identifiantes dans votre suggestion. Le recours facultatif à votre application mail est distinct du formulaire protégé : il ne bénéficie pas de sa vérification CAPTCHA, et votre adresse accompagne alors le message. Ouvrir le brouillon ne l'envoie pas.": 'Do not enter any password, token, sensitive screenshot or identifying network data in your suggestion. The optional use of your mail app is separate from the protected form: it does not benefit from its CAPTCHA check, and your address then accompanies the message. Opening the draft does not send it.',
    'Vos droits': 'Your rights',
    "Pour demander l'accès, la correction ou la suppression d'une suggestion, contactez-nous à l'adresse de support en donnant assez d'éléments pour la retrouver, par exemple son sujet et sa date. Vous pouvez aussi adresser une réclamation à la CNIL.": 'To request access to, correction of or deletion of a suggestion, contact us at the support address, giving enough details to find it, for example its subject and date. You may also file a complaint with the <a href="https://www.cnil.fr/fr/plaintes" rel="noopener noreferrer">CNIL</a>.',

    /* ---- 404 ---- */
    'Page introuvable · AURA': 'Page not found · AURA',
    'Erreur 404': 'Error 404',
    'Même notre sonde ne trouve pas cette page.': 'Even our probe cannot find this page.',
    "Retour à l'accueil": 'Back to home',

    /* ---- Accueil : aperçu du tableau de bord ---- */
    'Écran de supervision, en mode démonstration avec des données simulées.': 'The monitoring screen, in demonstration mode with simulated data.',

    /* ---- Comparatif : partis pris et matériel ---- */
    'Voici les six choix que nous avons faits au début du projet, et sur lesquels nous ne sommes pas revenus depuis.': 'Here are the six choices we made at the start of the project, and have stuck with since.',
    'Prix relevés le 27 novembre 2026, TTC et hors livraison. Ils bougent souvent, prenez-les comme un ordre de grandeur.': 'Prices checked on 27 November 2026, including tax and excluding delivery. They move often, so treat them as a rough guide.',
    'environ 48 €': 'about €48',
    'environ 35 €': 'about €35',
    "Prêté par l’IUT": 'Lent by the IUT',
    "Hébergé par l’IUT": 'Hosted by the IUT',

    /* ---- Comparatif : les briques libres ---- */
    'Les briques libres': 'The open-source building blocks',
    'que nous assemblons.': 'that we put together.',
    'Nous ne partons pas de zéro. Chaque brique garde sa licence et son dépôt ; dépliez-en une pour voir sa place dans la chaîne et son code.': 'We are not starting from scratch. Each block keeps its own licence and repository; open one to see where it sits in the chain and where its code lives.',
    'Surveillance du réseau filaire': 'Wired network monitoring',
    'Écoute Wi-Fi sur la sonde': 'Wi-Fi listening on the probe',
    'Lecture SNMP des switchs': 'Reading switch tables over SNMP',
    'Radio 433 et 868 MHz, en réception': 'Radio at 433 and 868 MHz, receive only',
    'Graphe réseau du tableau de bord': 'Network graph for the dashboard',
    'Le socle du filaire : scans ARP, DHCP et SNMP, historique et notifications. Nous le prolongeons par des plugins plutôt que de le réécrire, et il reste la source des appareils câblés.': 'The backbone for wired devices: ARP, DHCP and SNMP scans, history and notifications. We extend it with plugins rather than rewriting it, and it stays the source for cabled devices.',
    'Kismet tourne sur le Raspberry Pi et capte les trames de gestion. Nous lisons son API REST comme un programme séparé, ce qui évite de mélanger du code GPL 2 et GPL 3.': 'Kismet runs on the Raspberry Pi and captures management frames. We read its REST API as a separate program, which avoids mixing GPL 2 and GPL 3 code.',
    'Source d’inspiration, pas une dépendance : nous reprenons sa logique de lecture de la table MAC pour retrouver le port physique d’un appareil, recodée en Python.': 'An inspiration rather than a dependency: we reuse its approach to reading the MAC table to find a device’s physical port, rewritten in Python.',
    'Piste « si nous avons le temps » : décoder les capteurs radio du bâtiment avec une clé RTL-SDR, en réception seule. Rien n’est émis.': 'A “if we have time” idea: decoding the building’s radio sensors with an RTL-SDR dongle, receive only. Nothing is transmitted.',
    'Brique envisagée côté interface pour dessiner le graphe des appareils et de leurs liens, une fois la corrélation en place.': 'A block we are considering on the interface side, to draw the graph of devices and their links once correlation is in place.',
    'Voir le dépôt ↗': 'View the repository ↗',

    /* ---- Équipe : répartition des tâches ---- */
    'Qui fait quoi,': 'Who does what,',
    'concrètement.': 'in practice.',
    'Les 14 tâches du projet, réparties entre nous quatre. Choisissez un prénom pour ne garder que les siennes.': 'The 14 tasks in the project, shared between the four of us. Pick a first name to see only their tasks.',
    'Tout le monde': 'Everyone',
    'Aucune tâche pour ce filtre.': 'No task matches this filter.',

    /* ---- Suggestions : copie et messagerie ---- */
    'Copier ma suggestion et ouvrir ma messagerie': 'Copy my suggestion and open my mail app',
    'Cette option n’utilise pas la vérification anti-robot. Rien n’est envoyé sans que vous validiez le message dans votre messagerie.': 'This option does not use the anti-robot check. Nothing is sent unless you confirm the message in your mail app.'
  };

  var DICT = { en: EN };

  /* --------------------------------------------------------------------- */
  /* Normalisation et extraction du texte visible                          */
  /* --------------------------------------------------------------------- */
  function norm(s) {
    return s.replace(/[’‘]/g, "'").replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  }
  function visibleText(el) {
    var out = '';
    var nodes = el.childNodes, i;
    for (i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.nodeType === 3) out += n.nodeValue;
      else if (n.nodeType === 1) {
        var tag = n.tagName ? n.tagName.toLowerCase() : '';
        if (tag === 'br') out += ' ';
        else out += visibleText(n);
      }
    }
    return out;
  }

  var SELECTOR = 'h1,h2,h3,h4,h5,h6,p,li,a,button,span,strong,em,small,b,legend,summary,label,th,td,caption,figcaption,option,dt,dd,time,blockquote';
  var ATTR_SELECTOR = '[alt],[aria-label],[placeholder],[title]';
  var ATTRS = ['alt', 'aria-label', 'placeholder', 'title'];
  var SKIP_CLOSEST = 'svg,code,script,style,.footer__legal,.nav__tool,#motion-toggle,[data-slider-progress],[data-i18n-managed]';

  // Motifs pour les textes dynamiques qui contiennent un nombre ou un nom.
  var PATTERNS = [
    { re: /^Aller à l'étape (\d+)$/, en: function (m) { return 'Go to step ' + m[1]; } },
    { re: /^Voir le détail de (.+)$/, en: function (m) { return 'View the detail of ' + m[1]; } },
    { re: /^(\d+) appareil affiché\. Cliquez sur un nom pour voir ses détails\.$/, en: function (m) { return m[1] + ' device shown. Click a name to see its details.'; } },
    { re: /^(\d+) appareils affichés\. Cliquez sur un nom pour voir ses détails\.$/, en: function (m) { return m[1] + ' devices shown. Click a name to see its details.'; } },
    { re: /^MAC fictive (.+) · observation LAN · emplacement non déterminé\.$/, en: function (m) { return 'Fictional MAC ' + m[1] + ' · LAN observation · location undetermined.'; } },
    { re: /^MAC fictive (.+) · absent du référentiel · vérification administrateur nécessaire\.$/, en: function (m) { return 'Fictional MAC ' + m[1] + ' · missing from the reference list · administrator check required.'; } },
    { re: /^L'administrateur fictif reconnaît (.+)\. L'alerte associée est clôturée\.$/, en: function (m) { return 'The fictional administrator recognises ' + m[1] + '. The related alert is closed.'; } }
  ];
  function patternEN(key) {
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = key.match(PATTERNS[i].re);
      if (m) return PATTERNS[i].en(m);
    }
    return null;
  }

  var translated = []; // { el, html } ou { el, attrs:{name:value} }
  var applying = false;

  function enFor(key) {
    if (DICT.en.hasOwnProperty(key)) return DICT.en[key];
    return patternEN(key);
  }
  function depth(el) { var d = 0, p = el.parentElement; while (p) { d++; p = p.parentElement; } return d; }

  function translateTree(rootEl) {
    // Éléments de texte, traités du plus profond au plus superficiel pour ne
    // pas écraser une structure interne (ex. titres animés .rl__i).
    var els = [];
    if (rootEl.matches && rootEl.matches(SELECTOR)) els.push(rootEl);
    var found = rootEl.querySelectorAll ? rootEl.querySelectorAll(SELECTOR) : [];
    for (var i = 0; i < found.length; i++) els.push(found[i]);
    els = els.filter(function (el) { return !el.closest(SKIP_CLOSEST); });
    // Du plus superficiel au plus profond : l'élément parent gagne et est
    // traduit en entier (avec sa structure interne reconstruite dans la valeur).
    // Ses descendants, détachés par le remplacement, sont alors ignorés.
    els.sort(function (a, b) { return depth(a) - depth(b); });
    els.forEach(function (el) {
      if (!el.isConnected) return;
      var key = norm(visibleText(el));
      if (!key) return;
      var en = enFor(key);
      if (en == null) return;
      translated.push({ el: el, html: el.innerHTML });
      el.innerHTML = en;
    });
    // Attributs
    var attrEls = [];
    if (rootEl.matches && rootEl.matches(ATTR_SELECTOR)) attrEls.push(rootEl);
    var af = rootEl.querySelectorAll ? rootEl.querySelectorAll(ATTR_SELECTOR) : [];
    for (var j = 0; j < af.length; j++) attrEls.push(af[j]);
    attrEls.forEach(function (el) {
      if (el.closest && el.closest('svg,script,style,[data-i18n-managed]')) return;
      ATTRS.forEach(function (name) {
        if (!el.hasAttribute(name)) return;
        var val = el.getAttribute(name);
        var key = norm(val);
        var en = enFor(key);
        if (en == null) return;
        var rec = { el: el, attrs: {} };
        rec.attrs[name] = val;
        translated.push(rec);
        el.setAttribute(name, en.replace(/<[^>]+>/g, ''));
      });
    });
  }

  function restoreAll() {
    for (var i = translated.length - 1; i >= 0; i--) {
      var rec = translated[i];
      if (!rec.el.isConnected) continue;
      if (rec.html != null) rec.el.innerHTML = rec.html;
      if (rec.attrs) { for (var name in rec.attrs) rec.el.setAttribute(name, rec.attrs[name]); }
    }
    translated = [];
  }

  // Titre et méta sont hors du <body> : gérés à part.
  var frTitle = document.title;
  var metaDesc = document.querySelector('meta[name="description"]');
  var frDesc = metaDesc ? metaDesc.getAttribute('content') : null;
  function applyHead(lang) {
    if (lang === 'en') {
      var t = enFor(norm(frTitle)); if (t) document.title = t.replace(/<[^>]+>/g, '');
      if (metaDesc && frDesc) { var d = enFor(norm(frDesc)); if (d) metaDesc.setAttribute('content', d.replace(/<[^>]+>/g, '')); }
    } else {
      document.title = frTitle;
      if (metaDesc && frDesc) metaDesc.setAttribute('content', frDesc);
    }
  }

  // Le pied de page légal contient l'année dynamique : reconstruit proprement.
  function applyFooterLegal(lang) {
    var p = document.querySelector('.footer__legal');
    if (!p) return;
    var yearEl = document.getElementById('year');
    var year = (yearEl && yearEl.textContent) || new Date().getFullYear();
    if (lang === 'en') {
      p.innerHTML = 'Tutored project, BUT R&amp;T, IUT de Valence · <span id="year">' + year + '</span> · No audience tracking. <a href="mentions-legales.html#confidentialite">Privacy</a>';
    } else {
      p.innerHTML = 'Projet tutoré BUT R&amp;T, IUT de Valence · <span id="year">' + year + '</span> · Sans mesure d’audience. <a href="mentions-legales.html#confidentialite">Confidentialité</a>';
    }
  }

  var lang = root.getAttribute('lang') === 'en' ? 'en' : 'fr';

  function setLang(next, persist) {
    applying = true;
    restoreAll();
    if (next === 'en') {
      translateTree(document.body);
      applyHead('en');
      applyFooterLegal('en');
      root.setAttribute('lang', 'en');
    } else {
      applyHead('fr');
      applyFooterLegal('fr');
      root.setAttribute('lang', 'fr');
    }
    lang = next;
    if (persist) { try { localStorage.setItem('aura-lang', next); } catch (e) {} }
    updateLangButton();
    applying = false;
    document.dispatchEvent(new CustomEvent('aura:language'));
  }

  /* --------------------------------------------------------------------- */
  /* Thème clair / sombre                                                   */
  /* --------------------------------------------------------------------- */
  function currentTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function setTheme(next, persist) {
    if (next === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#eef3fb' : '#070e20');
    if (persist) { try { localStorage.setItem('aura-theme', next); } catch (e) {} }
    updateThemeButton();
  }
  function updateThemeButton() {
    var b = document.getElementById('theme-toggle');
    if (!b) return;
    var light = currentTheme() === 'light';
    b.setAttribute('aria-pressed', String(light));
    var toLight = lang === 'en' ? 'Switch to light theme' : 'Activer le thème clair';
    var toDark = lang === 'en' ? 'Switch to dark theme' : 'Activer le thème sombre';
    b.setAttribute('aria-label', light ? toDark : toLight);
    b.setAttribute('title', light ? toDark : toLight);
    var label = b.querySelector('.theme-label');
    if (label) label.textContent = light ? (lang === 'en' ? 'Dark' : 'Sombre') : (lang === 'en' ? 'Light' : 'Clair');
  }
  function updateLangButton() {
    var b = document.getElementById('lang-toggle');
    if (!b) return;
    b.setAttribute('aria-label', lang === 'en' ? 'Passer au français' : 'Switch to English');
    b.setAttribute('title', lang === 'en' ? 'Passer au français' : 'Switch to English');
    updateThemeButton();
  }

  /* --------------------------------------------------------------------- */
  /* Branche l'interface et traduit le contenu dynamique au fil de l'eau   */
  /* --------------------------------------------------------------------- */
  function wire() {
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', function () {
      setTheme(currentTheme() === 'light' ? 'dark' : 'light', true);
      // Relance l'animation de l'icône à chaque bascule.
      themeBtn.classList.remove('vient-de-basculer');
      void themeBtn.offsetWidth;
      themeBtn.classList.add('vient-de-basculer');
    });
    if (themeBtn) themeBtn.addEventListener('animationend', function () {
      themeBtn.classList.remove('vient-de-basculer');
    });
    var langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.addEventListener('click', function () {
      setLang(lang === 'en' ? 'fr' : 'en', true);
    });

    // État initial : le français est déjà dans le HTML ; on applique l'anglais si besoin.
    if (lang === 'en') setLang('en', false); else updateLangButton();
    updateThemeButton();

    // Traduit les morceaux AJOUTÉS dynamiquement (ex. nouvelles alertes de la démo).
    // On n'écoute volontairement pas characterData : la démo réécrit souvent des
    // compteurs et statuts, ce qui provoquerait une boucle de traduction coûteuse.
    // L'observateur se déconnecte pendant qu'il travaille pour ne pas se relancer.
    if (window.MutationObserver) {
      var obs = new MutationObserver(function (records) {
        if (lang !== 'en') return;
        obs.disconnect();
        try {
          for (var k = 0; k < records.length; k++) {
            var added = records[k].addedNodes;
            for (var i = 0; i < added.length; i++) {
              var node = added[i];
              if (node.nodeType === 1) translateTree(node);
              else if (node.nodeType === 3 && node.parentElement) translateTree(node.parentElement);
            }
          }
        } catch (e) { /* on ne bloque jamais la page pour une traduction */ }
        obs.takeRecords();
        obs.observe(document.body, { childList: true, subtree: true });
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire, { once: true });
  else wire();
})();
