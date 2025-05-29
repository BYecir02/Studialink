travail.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SessionTravail extends Model {
    static associate(models) {
      SessionTravail.belongsTo(models.Utilisateur, { foreignKey: 'createurId' });
      SessionTravail.belongsTo(models.Module, { foreignKey: 'moduleId' });
    }
  }
  SessionTravail.init({
    titre: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    lieu: DataTypes.STRING,
    en_ligne: { type: DataTypes.BOOLEAN, defaultValue: false },
    lien_en_ligne: DataTypes.STRING,
    salle: DataTypes.STRING,
    date_heure: { type: DataTypes.DATE, allowNull: false },
    max_participants: DataTypes.INTEGER,
    confidentialite: DataTypes.STRING,
    code_acces: DataTypes.STRING,
    statut: DataTypes.STRING,
    cree_le: { type: DataTypes.DATE, allowNull: false },
    modifie_le: DataTypes.DATE,
    createurId: { type: DataTypes.INTEGER, allowNull: false },
    moduleId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'SessionTravail',
    tableName: 'SessionTravails'
  });
  return SessionTravail;
};