'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Signalement extends Model {
    static associate(models) {
      Signalement.belongsTo(models.Utilisateur, { as: 'signalePar', foreignKey: 'signaleParId' });
      Signalement.belongsTo(models.Utilisateur, { as: 'utilisateurCible', foreignKey: 'utilisateurCibleId' });
      Signalement.belongsTo(models.SessionTravail, { as: 'sessionCible', foreignKey: 'sessionCibleId' });
      Signalement.belongsTo(models.Message, { as: 'messageCible', foreignKey: 'messageCibleId' });
      Signalement.belongsTo(models.Utilisateur, { as: 'traitePar', foreignKey: 'traiteParId' });
    }
  }
  Signalement.init({
    signaleParId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    utilisateurCibleId: DataTypes.INTEGER,
    sessionCibleId: DataTypes.INTEGER,
    messageCibleId: DataTypes.INTEGER,
    motif: {
      type: DataTypes.STRING,
      allowNull: false
    },
    statut: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_signalement: {
      type: DataTypes.DATE,
      allowNull: false
    },
    traiteParId: DataTypes.INTEGER,
    date_traitement: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Signalement',
    tableName: 'Signalements'
  });
  return Signalement;
};