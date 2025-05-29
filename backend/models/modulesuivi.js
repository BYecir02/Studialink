'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ModuleSuivi extends Model {
    static associate(models) {
      ModuleSuivi.belongsTo(models.Utilisateur, { foreignKey: 'utilisateurId' });
      ModuleSuivi.belongsTo(models.Module, { foreignKey: 'moduleId' });
    }
  }
  ModuleSuivi.init({
    utilisateurId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ModuleSuivi',
    tableName: 'ModuleSuivis'
  });
  return ModuleSuivi;
};