'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Modules', [
      {
        nom: 'Mathématiques',
        anneeId: 1, // adapte selon tes IDs réels
        filiereId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Programmation',
        anneeId: 1,
        filiereId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Big Data',
        anneeId: 3,
        filiereId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      // Ajoute d'autres modules si besoin
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Modules', null, {});
  }
};