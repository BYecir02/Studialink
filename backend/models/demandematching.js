'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DemandeMatching extends Model {
    static associate(models) {
      DemandeMatching.belongsTo(models.Utilisateur, { foreignKey: 'utilisateurId' });
      DemandeMatching.belongsTo(models.Module, { foreignKey: 'moduleId' });
    }
  }
  DemandeMatching.init({
    utilisateurId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creneau_prefere: DataTypes.DATE,
    statut: DataTypes.STRING,
    date_demande: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'DemandeMatching',
    tableName: 'DemandeMatchings'
  });
  return DemandeMatching;
};