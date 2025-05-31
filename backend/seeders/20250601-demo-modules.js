'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Modules', [
      { nom: 'Electronique Analogique', anneeId: 1, filiereId: 1, createdAt: new Date(), updatedAt: new Date() },
      { nom: 'Physique du solide', anneeId: 1, filiereId: 1, createdAt: new Date(), updatedAt: new Date() },
      { nom: 'EN - µC', anneeId: 1, filiereId: 1, createdAt: new Date(), updatedAt: new Date() },
      { nom: 'Mécanique Quantique', anneeId: 1, filiereId: 1, createdAt: new Date(), updatedAt: new Date() },
      { nom: 'EN - FPGA', anneeId: 1, filiereId: 1, createdAt: new Date(), updatedAt: new Date() },
      { nom: 'Automatique', anneeId: 1, filiereId: 1, createdAt: new Date(), updatedAt: new Date() },
      { nom: 'Analyse des signaux et des images', anneeId: 1, filiereId: 1, createdAt: new Date(), updatedAt: new Date() },
      { nom: 'Projet d’Electronique Numérique', anneeId: 1, filiereId: 1, createdAt: new Date(), updatedAt: new Date() },
      { nom: 'Probabilités, Statistiques', anneeId: 1, filiereId: 1, createdAt: new Date(), updatedAt: new Date() },
      { nom: 'Transformations Intégrales', anneeId: 1, filiereId: 1, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Modules', {
      nom: [
        'Electronique Analogique',
        'Physique du solide',
        'EN - µC',
        'Mécanique Quantique',
        'EN - FPGA',
        'Automatique',
        'Analyse des signaux et des images',
        'Projet d’Electronique Numérique',
        'Probabilités, Statistiques',
        'Transformations Intégrales'
      ]
    });
  }
};