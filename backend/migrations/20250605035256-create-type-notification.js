'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TypeNotifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      nom: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      icone: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      couleur: {
        type: Sequelize.STRING(7),
        allowNull: true
      },
      actif: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Insérer les types de base
    await queryInterface.bulkInsert('TypeNotifications', [
      {
        code: 'demande_session',
        nom: 'Demande de participation',
        icone: 'fas fa-user-plus',
        couleur: '#4e54c8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'session_acceptee',
        nom: 'Demande acceptée',
        icone: 'fas fa-check-circle',
        couleur: '#28a745',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'session_refusee',
        nom: 'Demande refusée',
        icone: 'fas fa-times-circle',
        couleur: '#dc3545',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TypeNotifications');
  }
};