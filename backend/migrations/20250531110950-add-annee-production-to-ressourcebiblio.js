'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('RessourceBiblios', 'annee_production', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: new Date().getFullYear()
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('RessourceBiblios', 'annee_production');
  }
};