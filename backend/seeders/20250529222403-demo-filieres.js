'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Filieres', [
      { nom: 'CSI', type: 'cycle', createdAt: new Date(), updatedAt: new Date() },
      { nom: 'CNB', type: 'cycle', createdAt: new Date(), updatedAt: new Date() },
      { nom: 'CIR', type: 'cycle', createdAt: new Date(), updatedAt: new Date() },
      { nom: 'Big Data', type: 'specialisation', createdAt: new Date(), updatedAt: new Date() },
      { nom: 'Cybersécurité', type: 'specialisation', createdAt: new Date(), updatedAt: new Date() },
      { nom: 'Développement logiciel', type: 'specialisation', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Filieres', null, {});
  }
};