'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Utilisateurs', 'description', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Utilisateurs', 'anneeId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Annees',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Utilisateurs', 'description');
    await queryInterface.removeColumn('Utilisateurs', 'anneeId');
  }
};