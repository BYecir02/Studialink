'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Ajouter les nouvelles colonnes à la table Notifications
    await queryInterface.addColumn('Notifications', 'typeId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'TypeNotifications',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('Notifications', 'titre', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Notifications', 'sessionTravailId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'SessionTravails',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('Notifications', 'demandeurId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Utilisateurs',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('Notifications', 'traite', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    // Modifier le champ type pour qu'il soit nullable
    await queryInterface.changeColumn('Notifications', 'type', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Supprimer les colonnes ajoutées
    await queryInterface.removeColumn('Notifications', 'typeId');
    await queryInterface.removeColumn('Notifications', 'titre');
    await queryInterface.removeColumn('Notifications', 'sessionTravailId');
    await queryInterface.removeColumn('Notifications', 'demandeurId');
    await queryInterface.removeColumn('Notifications', 'traite');

    // Remettre type comme non nullable
    await queryInterface.changeColumn('Notifications', 'type', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};