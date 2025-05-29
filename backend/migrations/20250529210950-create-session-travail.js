'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SessionTravails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      },
      lieu: {
        type: Sequelize.STRING
      },
      en_ligne: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      lien_en_ligne: {
        type: Sequelize.STRING
      },
      salle: {
        type: Sequelize.STRING
      },
      date_heure: {
        type: Sequelize.DATE,
        allowNull: false
      },
      max_participants: {
        type: Sequelize.INTEGER
      },
      confidentialite: {
        type: Sequelize.STRING
      },
      code_acces: {
        type: Sequelize.STRING
      },
      statut: {
        type: Sequelize.STRING
      },
      cree_le: {
        type: Sequelize.DATE,
        allowNull: false
      },
      modifie_le: {
        type: Sequelize.DATE
      },
      createurId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Utilisateurs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      moduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Modules',
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
    await queryInterface.dropTable('SessionTravails');
  }
};