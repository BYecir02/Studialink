# 🎓 Studialink

**Plateforme collaborative pour étudiants universitaires**

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-orange.svg)](https://www.mysql.com/)
[![Socket.IO](https://img.shields.io/badge/Real--time-Socket.IO-black.svg)](https://socket.io/)

> Une plateforme web moderne permettant aux étudiants d'organiser des sessions de travail collaboratives, de partager des ressources pédagogiques et de communiquer en temps réel.

![Studialink Preview](./docs/preview.png)

## ✨ **Fonctionnalités principales**

### 🔐 **Authentification & Profils**
- Système d'inscription/connexion sécurisé avec JWT
- Profils utilisateurs personnalisables (filière, année, modules)
- Gestion des informations personnelles

### 📚 **Sessions de travail collaboratives**
- Création et gestion complète de sessions d'étude
- Sessions en ligne ou en présentiel
- Gestion des participants (ajout/suppression)
- Interface détaillée avec toutes les informations

### 💬 **Chat temps réel**
- Messagerie instantanée par session avec Socket.IO
- Interface moderne et responsive
- Indicateurs de statut (en cours de frappe, message envoyé)

### 📖 **Bibliothèque collaborative**
- Upload et partage de ressources pédagogiques
- Organisation par année/filière/module
- Système de téléchargement sécurisé
- Gestion des permissions (suppression par l'uploadeur)

### 🎯 **Interface utilisateur**
- Design moderne et responsive (mobile-first)
- Navigation intuitive entre les pages
- Retour intelligent selon la page de provenance
- Pagination pour les grandes listes

## 🚀 **Installation et lancement**

### **Prérequis**
- Node.js (v16 ou plus récent)
- MySQL (v8.0 ou plus récent)
- npm ou yarn

### **1. Cloner le projet**
```bash
git clone https://github.com/BYecir02/Studialink.git
cd studialink
```

### **2. Configuration de la base de données**
```bash
# Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE studialink;
EXIT;

# Importer le schéma (optionnel)
mysql -u root -p studialink < backend/studialink.sql
```

### **3. Installation Backend**
```bash
cd backend

# Installer les dépendances
npm install

# Configuration de la base de données
# Modifier backend/config/config.json avec vos identifiants MySQL

# Lancer les migrations Sequelize (si nécessaire)
npx sequelize-cli db:migrate

# Démarrer le serveur backend
npm start
# ou en mode développement
npm run dev
```

### **4. Installation Frontend**
```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer l'application React
npm start
```

### **5. Accéder à l'application**
- **Frontend** : http://localhost:3001
- **Backend API** : http://localhost:3000

## 🏗️ **Architecture technique**

### **Stack technologique**
- **Frontend** : React 19.1.0, React Router, Axios, Socket.IO Client
- **Backend** : Node.js, Express.js, Socket.IO
- **Base de données** : MySQL avec Sequelize ORM
- **Authentification** : JWT (JSON Web Tokens)
- **Temps réel** : Socket.IO pour le chat
- **Upload de fichiers** : Multer

### **Structure du projet**
```
studialink/
├── backend/
│   ├── config/          # Configuration base de données
│   ├── controllers/     # Logique métier
│   ├── middlewares/     # Middlewares (auth, etc.)
│   ├── models/          # Modèles Sequelize
│   ├── routes/          # Routes API REST
│   ├── uploads/         # Fichiers uploadés
│   └── server.js        # Point d'entrée
├── frontend/
│   ├── public/          # Assets publics
│   ├── src/
│   │   ├── assets/      # CSS globaux, images
│   │   ├── components/  # Composants React
│   │   ├── pages/       # Pages principales
│   │   └── App.js       # Composant racine
└── README.md
```

## 📡 **API Endpoints**

### **Authentification**
```http
POST /api/auth/register     # Inscription
POST /api/auth/login        # Connexion
GET  /api/auth/me          # Profil utilisateur connecté
```

### **Sessions de travail**
```http
GET    /api/sessions           # Liste des sessions
GET    /api/sessions/:id       # Détail d'une session
POST   /api/sessions           # Créer une session
PUT    /api/sessions/:id       # Modifier une session
DELETE /api/sessions/:id       # Supprimer une session
POST   /api/sessions/:id/participants  # Ajouter un participant
```

### **Messages**
```http
GET  /api/sessions/:id/messages    # Messages d'une session
POST /api/sessions/:id/messages    # Envoyer un message
```

### **Bibliothèque**
```http
GET    /api/ressources                 # Liste des ressources
POST   /api/ressources                 # Upload une ressource
GET    /api/ressources/:id/download    # Télécharger une ressource
DELETE /api/ressources/:id             # Supprimer une ressource
```

## 🔧 **Configuration**

### **Variables d'environnement Backend**
Créer un fichier `.env` dans le dossier `backend/` :
```env
PORT=3000
JWT_SECRET=votre_secret_jwt_ultra_securise
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=studialink
```

### **Configuration Frontend**
Le frontend utilise `http://localhost:3000` pour l'API par défaut. Pour changer :
```javascript
// Dans les fichiers où axios est utilisé
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
```

## 🎯 **Fonctionnalités à venir**

- [ ] **Recherche avancée** de sessions avec filtres multiples
- [ ] **Système de notifications** (email + in-app)
- [ ] **Calendrier personnel** avec agenda des sessions
- [ ] **Messagerie privée** entre utilisateurs
- [ ] **Suggestions automatiques** de sessions
- [ ] **Dashboard administrateur** pour la modération
- [ ] **Intégrations cloud** (Google Drive, OneDrive)
- [ ] **Application mobile** (React Native)

## 🤝 **Contribution**

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créer une **branche** pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commiter** vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une **Pull Request**

### **Standards de code**
- Utiliser les conventions de nommage JavaScript/React
- Commenter le code complexe
- Tester les nouvelles fonctionnalités
- Suivre l'architecture existante

## 📝 **Licence**
Licence MIT à venir

## 👨‍💻 **Auteur**

**BADIROU Mohamed Yecir** - *Développeur Full Stack*
- GitHub: [@BYecir02](https://github.com/BYecir02)
- Email: Badirouyecir@gmail.com
- LinkedIn: [Badirou Mohamed Yecir](https://www.linkedin.com/in/mohamed-yecir-badirou-4b46a2299/)

## 📞 **Support**

Si vous avez des questions ou des problèmes :
- Ouvrir une [Issue](https://github.com/BYecir02/studialink/issues)
- Envoyer un email à : support@studialink.com
- Consulter la [Documentation](https://docs.studialink.com)

## 🎉 **Remerciements**

- Merci à la communauté React pour les outils fantastiques
- Inspiration tirée des meilleures pratiques de développement web moderne
- Remerciements spéciaux aux beta-testeurs étudiants

---

⭐ **N'hésitez pas à donner une étoile au projet si vous l'aimez !**

*Développé avec ❤️ pour la communauté étudiante*
