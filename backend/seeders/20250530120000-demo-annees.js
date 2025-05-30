'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Annees', [
      { nom: '1ère année', createdAt: new Date(), updatedAt: new Date() },
      { nom: '2ème année', createdAt: new Date(), updatedAt: new Date() },
      { nom: '3ème année', createdAt: new Date(), updatedAt: new Date() },
      { nom: '4ème année', createdAt: new Date(), updatedAt: new Date() },
      { nom: '5ème année', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Annees', null, {});
  }
};