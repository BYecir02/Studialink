'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Utilisateurs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      mot_de_passe: {
        type: Sequelize.STRING,
        allowNull: false
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      photo: {
        type: Sequelize.STRING
      },
      niveau: {
        type: Sequelize.STRING
      },
      actif: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      administrateur: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      date_inscription: {
        type: Sequelize.DATE,
        allowNull: false
      },
      derniere_connexion: {
        type: Sequelize.DATE
      },
      filiereId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Filieres',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Utilisateurs');
  }
};