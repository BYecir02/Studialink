'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Filieres', [
      { nom: 'Science industrielle', type: 'cycle', createdAt: new Date(), updatedAt: new Date() },
      { nom: 'Big Data', type: 'specialisation', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Filieres', null, {});
  }
};