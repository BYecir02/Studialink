'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParticipantSession extends Model {
    static associate(models) {
      ParticipantSession.belongsTo(models.SessionTravail, { foreignKey: 'sessionTravailId' });
      ParticipantSession.belongsTo(models.Utilisateur, { foreignKey: 'utilisateurId' });
    }
  }
  ParticipantSession.init({
    sessionTravailId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    utilisateurId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approuve: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    date_rejoindre: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ParticipantSession',
    tableName: 'ParticipantSessions'
  });
  return ParticipantSession;
};