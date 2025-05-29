'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fichier extends Model {
    static associate(models) {
      Fichier.belongsTo(models.SessionTravail, { foreignKey: 'sessionTravailId' });
      Fichier.belongsTo(models.Utilisateur, { foreignKey: 'uploadeurId' });
    }
  }
  Fichier.init({
    sessionTravailId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uploadeurId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fichier: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_upload: {
      type: DataTypes.DATE,
      allowNull: false
    },
    taille: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Fichier',
    tableName: 'Fichiers'
  });
  return Fichier;
};