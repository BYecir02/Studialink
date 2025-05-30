-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 30 mai 2025 à 15:22
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `studialink`
--

-- --------------------------------------------------------

--
-- Structure de la table `annees`
--

CREATE TABLE `annees` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `annees`
--

INSERT INTO `annees` (`id`, `nom`, `createdAt`, `updatedAt`) VALUES
(1, '1ère année', '2025-05-30 00:50:21', '2025-05-30 00:50:21'),
(2, '2ème année', '2025-05-30 00:50:21', '2025-05-30 00:50:21'),
(3, '3ème année', '2025-05-30 00:50:21', '2025-05-30 00:50:21'),
(4, '4ème année', '2025-05-30 00:50:21', '2025-05-30 00:50:21'),
(5, '5ème année', '2025-05-30 00:50:21', '2025-05-30 00:50:21'),
(6, '1ère année', '2025-05-30 00:53:20', '2025-05-30 00:53:20'),
(7, '2ème année', '2025-05-30 00:53:20', '2025-05-30 00:53:20'),
(8, '3ème année', '2025-05-30 00:53:20', '2025-05-30 00:53:20'),
(9, '4ème année', '2025-05-30 00:53:20', '2025-05-30 00:53:20'),
(10, '5ème année', '2025-05-30 00:53:20', '2025-05-30 00:53:20');

-- --------------------------------------------------------

--
-- Structure de la table `demandematchings`
--

CREATE TABLE `demandematchings` (
  `id` int(11) NOT NULL,
  `utilisateurId` int(11) NOT NULL,
  `moduleId` int(11) NOT NULL,
  `creneau_prefere` datetime DEFAULT NULL,
  `statut` varchar(255) DEFAULT NULL,
  `date_demande` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `evenementcalendriers`
--

CREATE TABLE `evenementcalendriers` (
  `id` int(11) NOT NULL,
  `utilisateurId` int(11) NOT NULL,
  `sessionTravailId` int(11) NOT NULL,
  `type_evenement` varchar(255) NOT NULL,
  `debut` datetime NOT NULL,
  `fin` datetime NOT NULL,
  `synchronise_avec` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fichiers`
--

CREATE TABLE `fichiers` (
  `id` int(11) NOT NULL,
  `sessionTravailId` int(11) NOT NULL,
  `uploadeurId` int(11) NOT NULL,
  `fichier` varchar(255) NOT NULL,
  `date_upload` datetime NOT NULL,
  `taille` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `filieres`
--

CREATE TABLE `filieres` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `filieres`
--

INSERT INTO `filieres` (`id`, `nom`, `type`, `createdAt`, `updatedAt`) VALUES
(1, 'Science industrielle', 'cycle', '2025-05-29 22:27:49', '2025-05-29 22:27:49'),
(2, 'Big Data', 'specialisation', '2025-05-29 22:27:49', '2025-05-29 22:27:49'),
(3, 'Science industrielle', 'cycle', '2025-05-30 00:50:21', '2025-05-30 00:50:21'),
(4, 'Big Data', 'specialisation', '2025-05-30 00:50:21', '2025-05-30 00:50:21'),
(5, 'Science industrielle', 'cycle', '2025-05-30 00:53:20', '2025-05-30 00:53:20'),
(6, 'Big Data', 'specialisation', '2025-05-30 00:53:20', '2025-05-30 00:53:20');

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sessionTravailId` int(11) NOT NULL,
  `expediteurId` int(11) NOT NULL,
  `contenu` text NOT NULL,
  `piece_jointe` varchar(255) DEFAULT NULL,
  `date_envoi` datetime NOT NULL,
  `prive` tinyint(1) DEFAULT 0,
  `destinataireId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `anneeId` int(11) NOT NULL,
  `filiereId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `modules`
--

INSERT INTO `modules` (`id`, `nom`, `anneeId`, `filiereId`, `createdAt`, `updatedAt`) VALUES
(1, 'Mathématiques', 1, 1, '2025-05-30 00:53:20', '2025-05-30 00:53:20'),
(2, 'Programmation', 1, 1, '2025-05-30 00:53:20', '2025-05-30 00:53:20'),
(3, 'Big Data', 3, 2, '2025-05-30 00:53:20', '2025-05-30 00:53:20');

-- --------------------------------------------------------

--
-- Structure de la table `modulesuivis`
--

CREATE TABLE `modulesuivis` (
  `id` int(11) NOT NULL,
  `utilisateurId` int(11) NOT NULL,
  `moduleId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `utilisateurId` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `contenu` varchar(255) NOT NULL,
  `lue` tinyint(1) DEFAULT 0,
  `date_creation` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `participantsessions`
--

CREATE TABLE `participantsessions` (
  `id` int(11) NOT NULL,
  `sessionTravailId` int(11) NOT NULL,
  `utilisateurId` int(11) NOT NULL,
  `approuve` tinyint(1) DEFAULT 0,
  `date_rejoindre` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `participantsessions`
--

INSERT INTO `participantsessions` (`id`, `sessionTravailId`, `utilisateurId`, `approuve`, `date_rejoindre`, `createdAt`, `updatedAt`) VALUES
(1, 4, 5, 1, '2025-05-30 12:39:46', '2025-05-30 12:39:46', '2025-05-30 12:39:46');

-- --------------------------------------------------------

--
-- Structure de la table `ressourcebiblios`
--

CREATE TABLE `ressourcebiblios` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `fichier` varchar(255) NOT NULL,
  `uploadeurId` int(11) NOT NULL,
  `date_upload` datetime NOT NULL,
  `moduleId` int(11) NOT NULL,
  `anneeId` int(11) NOT NULL,
  `filiereId` int(11) NOT NULL,
  `statut` varchar(255) NOT NULL,
  `nb_telechargements` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20250529205715-create-filiere.js'),
('20250529205943-create-annee.js'),
('20250529210145-create-utilisateur.js'),
('20250529210652-create-module.js'),
('20250529210839-create-module-suivi.js'),
('20250529210950-create-session-travail.js'),
('20250529211159-create-participant-session.js'),
('20250529211335-create-message.js'),
('20250529211538-create-fichier.js'),
('20250529211705-create-notification.js'),
('20250529211846-create-demande-matching.js'),
('20250529211952-create-evenement-calendrier.js'),
('20250529212123-create-ressource-biblio.js'),
('20250529212326-create-signalement.js'),
('20250529212439-create-signalement-ressource.js');

-- --------------------------------------------------------

--
-- Structure de la table `sessiontravails`
--

CREATE TABLE `sessiontravails` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `lieu` varchar(255) DEFAULT NULL,
  `en_ligne` tinyint(1) DEFAULT 0,
  `lien_en_ligne` varchar(255) DEFAULT NULL,
  `salle` varchar(255) DEFAULT NULL,
  `date_heure` datetime NOT NULL,
  `max_participants` int(11) DEFAULT NULL,
  `confidentialite` varchar(255) DEFAULT NULL,
  `code_acces` varchar(255) DEFAULT NULL,
  `statut` varchar(255) DEFAULT NULL,
  `cree_le` datetime NOT NULL,
  `modifie_le` datetime DEFAULT NULL,
  `createurId` int(11) NOT NULL,
  `moduleId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `sessiontravails`
--

INSERT INTO `sessiontravails` (`id`, `titre`, `description`, `lieu`, `en_ligne`, `lien_en_ligne`, `salle`, `date_heure`, `max_participants`, `confidentialite`, `code_acces`, `statut`, `cree_le`, `modifie_le`, `createurId`, `moduleId`, `createdAt`, `updatedAt`) VALUES
(2, 'Révision proba', 'Session unique', 'ISEN', 0, '', 'B506', '2025-05-31 01:17:00', 4, 'publique', '', NULL, '2025-05-30 01:17:34', NULL, 4, 1, '2025-05-30 01:18:37', '2025-05-30 01:18:37'),
(3, 'Révision Transfo', '', 'HEI', 0, '', 'B506', '2025-06-08 02:08:00', 11, 'privee', 'ADERV', NULL, '2025-05-30 01:20:41', NULL, 4, 1, '2025-05-30 02:08:23', '2025-05-30 02:08:23'),
(4, 'Session test', ' Ca marchera', '', 1, 'dvrzrrrrrrrrrrrr', '', '2025-06-06 02:15:00', 20, 'publique', '', NULL, '2025-05-30 02:14:57', NULL, 5, 2, '2025-05-30 02:15:37', '2025-05-30 02:15:37'),
(5, 'Session test 2', 'SESSION', '', 0, '', '', '2025-06-04 02:34:00', 3, 'publique', '', NULL, '2025-05-30 02:34:35', NULL, 5, 3, '2025-05-30 02:34:58', '2025-05-30 02:34:58');

-- --------------------------------------------------------

--
-- Structure de la table `signalementressources`
--

CREATE TABLE `signalementressources` (
  `id` int(11) NOT NULL,
  `ressourceId` int(11) NOT NULL,
  `signaleParId` int(11) NOT NULL,
  `motif` varchar(255) NOT NULL,
  `date_signalement` datetime NOT NULL,
  `statut` varchar(255) NOT NULL,
  `traiteParId` int(11) DEFAULT NULL,
  `date_traitement` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `signalements`
--

CREATE TABLE `signalements` (
  `id` int(11) NOT NULL,
  `signaleParId` int(11) NOT NULL,
  `utilisateurCibleId` int(11) DEFAULT NULL,
  `sessionCibleId` int(11) DEFAULT NULL,
  `messageCibleId` int(11) DEFAULT NULL,
  `motif` varchar(255) NOT NULL,
  `statut` varchar(255) NOT NULL,
  `date_signalement` datetime NOT NULL,
  `traiteParId` int(11) DEFAULT NULL,
  `date_traitement` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `niveau` varchar(255) DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `administrateur` tinyint(1) DEFAULT 0,
  `date_inscription` datetime NOT NULL,
  `derniere_connexion` datetime DEFAULT NULL,
  `filiereId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `email`, `mot_de_passe`, `prenom`, `nom`, `photo`, `niveau`, `actif`, `administrateur`, `date_inscription`, `derniere_connexion`, `filiereId`, `createdAt`, `updatedAt`) VALUES
(1, 'test@example.com', '$2b$10$4pPrPvRRdCh7JUYMDdAqLuZpU4yA2W82bVjkK8SXu0cCwV86dtTHq', 'Jean', 'Dupont', NULL, NULL, 1, 0, '2025-05-29 22:32:43', '2025-05-29 22:33:34', 1, '2025-05-29 22:32:43', '2025-05-29 22:33:34'),
(4, 'badirouyecir@gmail.com', '$2b$10$nUkX8H7TaZKBckMelVmpbewyLeFmDPj3Tl0egi3llLVi2NSsBEzdq', 'Mohamed Yecir', 'Badirou', NULL, NULL, 1, 0, '2025-05-30 00:16:28', '2025-05-30 13:12:11', 1, '2025-05-30 00:16:28', '2025-05-30 13:12:11'),
(5, 'Saandouneadediran@gmail.com', '$2b$10$6JEokFswQZvHOT7yzyR7muPuGkUxJH8Rhr9QHdeLpMbA6UNvdMXNK', 'Saandoune', 'Adediran', NULL, NULL, 1, 0, '2025-05-30 00:27:21', '2025-05-30 02:44:56', 2, '2025-05-30 00:27:21', '2025-05-30 02:44:56');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `annees`
--
ALTER TABLE `annees`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `demandematchings`
--
ALTER TABLE `demandematchings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateurId` (`utilisateurId`),
  ADD KEY `moduleId` (`moduleId`);

--
-- Index pour la table `evenementcalendriers`
--
ALTER TABLE `evenementcalendriers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateurId` (`utilisateurId`),
  ADD KEY `sessionTravailId` (`sessionTravailId`);

--
-- Index pour la table `fichiers`
--
ALTER TABLE `fichiers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessionTravailId` (`sessionTravailId`),
  ADD KEY `uploadeurId` (`uploadeurId`);

--
-- Index pour la table `filieres`
--
ALTER TABLE `filieres`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessionTravailId` (`sessionTravailId`),
  ADD KEY `expediteurId` (`expediteurId`),
  ADD KEY `destinataireId` (`destinataireId`);

--
-- Index pour la table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anneeId` (`anneeId`),
  ADD KEY `filiereId` (`filiereId`);

--
-- Index pour la table `modulesuivis`
--
ALTER TABLE `modulesuivis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateurId` (`utilisateurId`),
  ADD KEY `moduleId` (`moduleId`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateurId` (`utilisateurId`);

--
-- Index pour la table `participantsessions`
--
ALTER TABLE `participantsessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessionTravailId` (`sessionTravailId`),
  ADD KEY `utilisateurId` (`utilisateurId`);

--
-- Index pour la table `ressourcebiblios`
--
ALTER TABLE `ressourcebiblios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploadeurId` (`uploadeurId`),
  ADD KEY `moduleId` (`moduleId`),
  ADD KEY `anneeId` (`anneeId`),
  ADD KEY `filiereId` (`filiereId`);

--
-- Index pour la table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `sessiontravails`
--
ALTER TABLE `sessiontravails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `createurId` (`createurId`),
  ADD KEY `moduleId` (`moduleId`);

--
-- Index pour la table `signalementressources`
--
ALTER TABLE `signalementressources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ressourceId` (`ressourceId`),
  ADD KEY `signaleParId` (`signaleParId`),
  ADD KEY `traiteParId` (`traiteParId`);

--
-- Index pour la table `signalements`
--
ALTER TABLE `signalements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `signaleParId` (`signaleParId`),
  ADD KEY `utilisateurCibleId` (`utilisateurCibleId`),
  ADD KEY `sessionCibleId` (`sessionCibleId`),
  ADD KEY `messageCibleId` (`messageCibleId`),
  ADD KEY `traiteParId` (`traiteParId`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `filiereId` (`filiereId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `annees`
--
ALTER TABLE `annees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `demandematchings`
--
ALTER TABLE `demandematchings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `evenementcalendriers`
--
ALTER TABLE `evenementcalendriers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `fichiers`
--
ALTER TABLE `fichiers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `filieres`
--
ALTER TABLE `filieres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `modulesuivis`
--
ALTER TABLE `modulesuivis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `participantsessions`
--
ALTER TABLE `participantsessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `ressourcebiblios`
--
ALTER TABLE `ressourcebiblios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `sessiontravails`
--
ALTER TABLE `sessiontravails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `signalementressources`
--
ALTER TABLE `signalementressources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `signalements`
--
ALTER TABLE `signalements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `demandematchings`
--
ALTER TABLE `demandematchings`
  ADD CONSTRAINT `demandematchings_ibfk_1` FOREIGN KEY (`utilisateurId`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `demandematchings_ibfk_2` FOREIGN KEY (`moduleId`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `evenementcalendriers`
--
ALTER TABLE `evenementcalendriers`
  ADD CONSTRAINT `evenementcalendriers_ibfk_1` FOREIGN KEY (`utilisateurId`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `evenementcalendriers_ibfk_2` FOREIGN KEY (`sessionTravailId`) REFERENCES `sessiontravails` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `fichiers`
--
ALTER TABLE `fichiers`
  ADD CONSTRAINT `fichiers_ibfk_1` FOREIGN KEY (`sessionTravailId`) REFERENCES `sessiontravails` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fichiers_ibfk_2` FOREIGN KEY (`uploadeurId`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sessionTravailId`) REFERENCES `sessiontravails` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`expediteurId`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`destinataireId`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`anneeId`) REFERENCES `annees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `modules_ibfk_2` FOREIGN KEY (`filiereId`) REFERENCES `filieres` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `modulesuivis`
--
ALTER TABLE `modulesuivis`
  ADD CONSTRAINT `modulesuivis_ibfk_1` FOREIGN KEY (`utilisateurId`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `modulesuivis_ibfk_2` FOREIGN KEY (`moduleId`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`utilisateurId`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `participantsessions`
--
ALTER TABLE `participantsessions`
  ADD CONSTRAINT `participantsessions_ibfk_1` FOREIGN KEY (`sessionTravailId`) REFERENCES `sessiontravails` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `participantsessions_ibfk_2` FOREIGN KEY (`utilisateurId`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ressourcebiblios`
--
ALTER TABLE `ressourcebiblios`
  ADD CONSTRAINT `ressourcebiblios_ibfk_1` FOREIGN KEY (`uploadeurId`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ressourcebiblios_ibfk_2` FOREIGN KEY (`moduleId`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ressourcebiblios_ibfk_3` FOREIGN KEY (`anneeId`) REFERENCES `annees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ressourcebiblios_ibfk_4` FOREIGN KEY (`filiereId`) REFERENCES `filieres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `sessiontravails`
--
ALTER TABLE `sessiontravails`
  ADD CONSTRAINT `sessiontravails_ibfk_1` FOREIGN KEY (`createurId`) REFERENCES `utilisateurs` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `sessiontravails_ibfk_2` FOREIGN KEY (`moduleId`) REFERENCES `modules` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `signalementressources`
--
ALTER TABLE `signalementressources`
  ADD CONSTRAINT `signalementressources_ibfk_1` FOREIGN KEY (`ressourceId`) REFERENCES `ressourcebiblios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `signalementressources_ibfk_2` FOREIGN KEY (`signaleParId`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `signalementressources_ibfk_3` FOREIGN KEY (`traiteParId`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `signalements`
--
ALTER TABLE `signalements`
  ADD CONSTRAINT `signalements_ibfk_1` FOREIGN KEY (`signaleParId`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `signalements_ibfk_2` FOREIGN KEY (`utilisateurCibleId`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signalements_ibfk_3` FOREIGN KEY (`sessionCibleId`) REFERENCES `sessiontravails` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signalements_ibfk_4` FOREIGN KEY (`messageCibleId`) REFERENCES `messages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `signalements_ibfk_5` FOREIGN KEY (`traiteParId`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD CONSTRAINT `utilisateurs_ibfk_1` FOREIGN KEY (`filiereId`) REFERENCES `filieres` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
