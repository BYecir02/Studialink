'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    static associate(models) {
      Module.belongsTo(models.Filiere, { foreignKey: 'filiereId' });
      Module.belongsTo(models.Annee, { foreignKey: 'anneeId' });
      Module.hasMany(models.ModuleSuivi, { foreignKey: 'moduleId' });
      Module.belongsToMany(models.Utilisateur, {
        through: models.ModuleSuivi,
        foreignKey: 'moduleId',
        otherKey: 'utilisateurId',
        as: 'utilisateursSuiveurs'
      });
    }
  }
  Module.init({
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    anneeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    filiereId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Module',
    tableName: 'Modules'
  });
  return Module;
};