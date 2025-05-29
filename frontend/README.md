
## Studialink
Plateforme collaborative pour étudiants (Node.js, Express, Sequelize, MySQL, React).

## 📁 Structure du projet
Studialink/
│
├── backend/      # API Express, Sequelize, MySQL
└── frontend/     # Application React

## 🚀 Démarrage rapide
1. Prérequis
Node.js (>= 18)
MySQL (base de données créée, ex: studialink)
npm
2. Installation
- Backend
cd backend
npm install
- Frontend
cd ../frontend
npm install
3. Configuration
Backend
Modifie config.json pour tes identifiants MySQL si besoin.
(Optionnel) Mets la clé JWT dans un fichier .env (voir authController.js).
Frontend
Rien à configurer par défaut (le front utilise le port 3001).
4. Base de données
Dans le dossier backend :
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
5. Lancer les serveurs
- Backend
cd backend
npm run dev

L’API sera disponible sur http://localhost:3000

- Frontend
cd frontend
npm start
L’application React sera disponible sur http://localhost:3001

## 🔑 Authentification
Inscription : /api/auth/register
Connexion : /api/auth/login
Déconnexion : /api/auth/logout
Utilise le token JWT pour accéder aux routes protégées.

## 🛠️ Technologies
Backend : Node.js, Express, Sequelize, MySQL, JWT, bcrypt
Frontend : React, Axios

## 📂 Arborescence principale
backend/
  controllers/
  middlewares/
  migrations/
  models/
  routes/
  seeders/
  server.js
frontend/
  src/
    components/
    assets/
    App.js
    index.js

## ✨ Fonctionnalités principales
Authentification JWT (inscription, connexion, déconnexion)
Gestion des utilisateurs, filières, modules, sessions, notifications, etc.
Frontend React avec formulaires de connexion/inscription

## 📣 Aide
Pour toute question, ouvre une issue ou contacte le mainteneur du projet.