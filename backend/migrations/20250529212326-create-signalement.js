'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Signalements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      signaleParId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Utilisateurs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      utilisateurCibleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Utilisateurs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      sessionCibleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'SessionTravails',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      messageCibleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Messages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      motif: {
        type: Sequelize.STRING,
        allowNull: false
      },
      statut: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date_signalement: {
        type: Sequelize.DATE,
        allowNull: false
      },
      traiteParId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Utilisateurs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      date_traitement: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Signalements');
  }
};