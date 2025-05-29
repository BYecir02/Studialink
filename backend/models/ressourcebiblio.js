'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RessourceBiblio extends Model {
    static associate(models) {
      RessourceBiblio.belongsTo(models.Utilisateur, { foreignKey: 'uploadeurId' });
      RessourceBiblio.belongsTo(models.Module, { foreignKey: 'moduleId' });
      RessourceBiblio.belongsTo(models.Annee, { foreignKey: 'anneeId' });
      RessourceBiblio.belongsTo(models.Filiere, { foreignKey: 'filiereId' });
    }
  }
  RessourceBiblio.init({
    titre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fichier: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uploadeurId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_upload: {
      type: DataTypes.DATE,
      allowNull: false
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    anneeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    filiereId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    statut: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nb_telechargements: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'RessourceBiblio',
    tableName: 'RessourceBiblios'
  });
  return RessourceBiblio;
};