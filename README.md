# 📄 CV Builder Pro

Application web moderne et professionnelle pour créer des CV personnalisés. Interface intuitive avec prévisualisation en temps réel, export PDF propre et fonctionnalités avancées.

## ✨ Fonctionnalités

### 🎨 Personnalisation Visuelle
- **Photo de profil** - Ajoutez ou retirez votre photo (format carré recommandé)
- **4 thèmes professionnels** - Bleu, Vert, Violet, Sombre
- **Affichage conditionnel** - Activez/désactivez les sections selon vos besoins
- **Design responsive** - Fonctionne parfaitement sur tous les appareils
- **Interface redimensionnable** - Ajustez la taille de l'éditeur selon vos besoins

### ✏️ Édition Avancée
- **Édition en temps réel** - Voyez les changements instantanément
- **Formatage de texte riche** - **Gras**, *italique*, <u>souligné</u>, couleurs
- **Drag & Drop** - Réorganisez facilement vos sections et éléments
- **Ordre personnalisable** - Changez l'ordre des sections principales
- **Undo/Redo** - Annulez ou refaites vos modifications (Ctrl+Z / Ctrl+Shift+Z)
- **Auto-save** - Sauvegarde automatique dans le navigateur toutes les modifications
- **Raccourcis clavier** - Travaillez plus rapidement avec les raccourcis
- **Mode sombre** - Interface sombre pour le confort des yeux (Ctrl+D)
- **Templates prédéfinis** - Démarrez rapidement avec 4 modèles professionnels
- **Statistiques en temps réel** - Compteur de mots, score de complétude, checklist
- **Copie texte brut** - Copiez votre CV en format texte pour emails/ATS
- **Personnalisation couleurs** - Choisissez votre couleur d'accent parmi 8 presets ou créez la vôtre
- **Informations personnelles** - Nom, titre, email, téléphone, localisation, LinkedIn, GitHub, site web
- **Résumé professionnel** - Présentez votre profil avec formatage
- **Expérience professionnelle** - Postes avec descriptions formatées et réorganisables
- **Formation** - Diplômes et établissements réorganisables
- **Compétences** - Liste de vos technologies et outils maîtrisés
- **Langues** - Langues parlées avec niveaux
- **Certifications** - Ajoutez vos certifications avec liens de vérification, réorganisables
- **Sections personnalisées** - Créez vos propres sections avec éléments réorganisables (Projets, Publications, Prix, etc.)

### 🎯 Gestion de l'Ordre
- **Ordre des sections** - Glissez-déposez pour réorganiser les sections principales
- **Ordre des expériences** - Réorganisez vos expériences professionnelles
- **Ordre des formations** - Réorganisez vos diplômes
- **Ordre des certifications** - Réorganisez vos certifications
- **Ordre des éléments personnalisés** - Réorganisez les items de vos sections custom

### 🔗 Liens Cliquables
- Tous les liens (email, téléphone, LinkedIn, GitHub, site web, certifications) sont **cliquables**
- Les liens s'ouvrent dans un nouvel onglet
- Parfait pour une version digitale de votre CV

### 💾 Gestion des Données
- **Sauvegarde** - Exportez votre CV au format JSON pour le réutiliser plus tard
- **Chargement** - Importez un CV précédemment sauvegardé
- **Auto-save** - Sauvegarde automatique dans le navigateur (localStorage)
- **Historique** - 50 dernières modifications conservées pour undo/redo
- **Persistance** - Ne perdez jamais votre travail, même en fermant le navigateur

### 🖨️ Export PDF
- **Export PDF propre** - Sans watermark, sans publicité
- **Optimisé pour l'impression** - Mise en page professionnelle
- **Format A4** - Standard pour les CV
- Les liens sont masqués à l'impression pour un rendu professionnel

### 🐳 Docker
- **Conteneurisé** - Déploiement simple et rapide
- **Production-ready** - Configuration Nginx optimisée
- **Multi-stage build** - Image légère et performante

## 🚀 Démarrage Rapide avec Docker

### Prérequis
- Docker
- Docker Compose

### Installation et Lancement

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd cv_builder
```

2. **Lancer avec Docker Compose**
```bash
docker-compose up --build
```

3. **Accéder à l'application**
Ouvrez votre navigateur à l'adresse : `http://localhost:3000`

### Arrêter l'application
```bash
docker-compose down
```

## 💻 Développement Local (sans Docker)

### Prérequis
- Node.js 18+
- npm

### Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Lancer le serveur de développement**
```bash
npm run dev
```

3. **Accéder à l'application**
Ouvrez votre navigateur à l'adresse : `http://localhost:5173`

### Build pour production
```bash
npm run build
```

## 📋 Guide d'Utilisation

### 1️⃣ Paramètres d'Affichage
- Activez/désactivez les sections que vous souhaitez afficher
- Contrôlez l'affichage de votre photo de profil

### 2️⃣ Informations Personnelles
- **Photo** : Cliquez sur "Ajouter une photo" (max 2 Mo, format carré recommandé)
- Remplissez vos coordonnées (email, téléphone, localisation)
- Ajoutez vos liens professionnels (LinkedIn, GitHub, site web)

### 3️⃣ Contenu du CV
- **Résumé** : Décrivez votre profil en quelques lignes percutantes
- **Expérience** : Ajoutez vos postes avec descriptions (utilisez • pour les points)
- **Formation** : Listez vos diplômes et établissements
- **Compétences** : Ajoutez vos technologies et outils
- **Langues** : Indiquez vos langues avec niveaux
- **Certifications** : Ajoutez vos certifications avec liens de vérification

### 4️⃣ Sections Personnalisées
- Créez des sections sur mesure pour vos besoins spécifiques
- Exemples : Projets, Publications, Prix, Activités bénévoles
- Ajoutez des liens vers vos réalisations

### 5️⃣ Personnalisation
- Choisissez parmi 4 thèmes professionnels
- Prévisualisez en temps réel

### 6️⃣ Sauvegarde et Export
- **Sauvegarder** : Exportez votre CV au format JSON pour le réutiliser
- **Charger** : Importez un CV précédemment sauvegardé
- **Imprimer** : Imprimez directement ou sauvegardez en PDF
- **Télécharger PDF** : Génère un PDF propre et professionnel

### ⌨️ Raccourcis Clavier
- **Ctrl+S** (Cmd+S) - Sauvegarder le CV en JSON
- **Ctrl+P** (Cmd+P) - Imprimer / Export PDF
- **Ctrl+Z** (Cmd+Z) - Annuler la dernière modification
- **Ctrl+Shift+Z** (Cmd+Shift+Z) ou **Ctrl+Y** - Refaire
- **Ctrl+D** (Cmd+D) - Basculer le mode sombre

### 🎨 Templates Disponibles
- **💻 Tech / Développeur** - Compétences en avant, parfait pour les développeurs
- **🎨 Créatif / Designer** - Portfolio et projets en vedette
- **👔 Manager / Chef de Projet** - Expérience et leadership mis en valeur
- **📄 Minimaliste** - Base vide pour personnalisation complète

## 🎨 Thèmes Disponibles

- **Bleu** - Classique et professionnel
- **Vert** - Dynamique et moderne
- **Violet** - Créatif et original
- **Sombre** - Élégant et sobre

## 🛠️ Technologies Utilisées

- **React 18** - Framework UI moderne
- **Vite 5** - Build tool ultra-rapide
- **Lucide React** - Icônes élégantes et modernes
- **Docker** - Conteneurisation
- **Nginx** - Serveur web performant (production)
- **CSS3** - Styles modernes avec flexbox et grid

## 💡 Fonctionnalités Avancées

### 📸 Gestion de Photo
- Upload d'image avec prévisualisation
- Validation de taille (max 2 Mo)
- Affichage circulaire professionnel
- Option pour retirer la photo

### 🔗 Liens Intelligents
- Auto-détection des protocoles HTTP/HTTPS
- Ouverture dans nouvel onglet
- Liens email et téléphone fonctionnels
- Masquage automatique à l'impression

### 💾 Persistance des Données
- Export JSON avec nom personnalisé
- Import de CV sauvegardés
- Aucune perte de données

### 🖨️ Export PDF Optimisé
- Marges optimales pour l'impression
- Suppression automatique des éléments non imprimables
- Format A4 standard
- Aucun watermark ou publicité

### 📊 Sections Dynamiques
- Ajout illimité de sections personnalisées
- Gestion flexible des contenus
- Organisation modulaire

### 📊 Analyse & Optimisation
- **Compteur de mots** - Total et par section (résumé)
- **Score de complétude** - Pourcentage de remplissage du CV
- **Checklist intelligente** - Recommandations et éléments manquants
- **Indicateurs visuels** - Vert/Orange/Rouge selon les bonnes pratiques
- **Conseils intégrés** - Longueurs idéales et optimisations

### 🎨 Personnalisation Avancée
- **8 couleurs prédéfinies** - Bleu, Vert, Violet, Orange, Rose, Cyan, Indigo, Teal
- **Sélecteur de couleur libre** - Choisissez n'importe quelle couleur
- **Aperçu temps réel** - Voyez les changements instantanément
- **Sauvegarde de préférence** - Votre couleur est conservée
- **Cohérence visuelle** - Couleur appliquée partout (titres, boutons, accents)

## 🎯 Cas d'Usage

- **Chercheurs d'emploi** - Créez un CV professionnel rapidement
- **Freelances** - Présentez vos compétences et projets
- **Étudiants** - Premier CV facile à créer
- **Professionnels** - Mettez à jour votre CV en quelques minutes
- **Recruteurs** - Aidez les candidats à structurer leur CV

## 🔒 Confidentialité

- **Aucune donnée envoyée** - Tout fonctionne en local dans votre navigateur
- **Aucun tracking** - Pas de collecte de données personnelles
- **Open source** - Code transparent et vérifiable
- **Contrôle total** - Vos données vous appartiennent

## 📁 Structure du Projet

```
cv_builder/
├── src/
│   ├── components/
│   │   ├── CVEditor.jsx       # Composant d'édition
│   │   ├── CVEditor.css
│   │   ├── CVPreview.jsx      # Composant de prévisualisation
│   │   └── CVPreview.css
│   ├── App.jsx                # Composant principal
│   ├── App.css
│   ├── main.jsx              # Point d'entrée
│   └── index.css
├── Dockerfile                # Configuration Docker
├── docker-compose.yml        # Orchestration Docker
├── nginx.conf               # Configuration Nginx
├── vite.config.js          # Configuration Vite
└── package.json

```

## 🐳 Docker

### Construire l'image Docker
```bash
docker build -t cv-builder .
```

### Lancer le conteneur
```bash
docker run -p 3000:80 cv-builder
```

### Utiliser Docker Compose (recommandé)
```bash
docker-compose up -d
```

## 📝 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à me contacter.

---

Créé avec ❤️ pour faciliter la création de CV professionnels
