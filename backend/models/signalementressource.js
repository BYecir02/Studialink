'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SignalementRessource extends Model {
    static associate(models) {
      SignalementRessource.belongsTo(models.RessourceBiblio, { foreignKey: 'ressourceId' });
      SignalementRessource.belongsTo(models.Utilisateur, { as: 'signalePar', foreignKey: 'signaleParId' });
      SignalementRessource.belongsTo(models.Utilisateur, { as: 'traitePar', foreignKey: 'traiteParId' });
    }
  }
  SignalementRessource.init({
    ressourceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    signaleParId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    motif: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_signalement: {
      type: DataTypes.DATE,
      allowNull: false
    },
    statut: {
      type: DataTypes.STRING,
      allowNull: false
    },
    traiteParId: DataTypes.INTEGER,
    date_traitement: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'SignalementRessource',
    tableName: 'SignalementRessources'
  });
  return SignalementRessource;
};