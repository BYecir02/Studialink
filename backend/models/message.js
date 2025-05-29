'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.SessionTravail, { foreignKey: 'sessionTravailId' });
      Message.belongsTo(models.Utilisateur, { as: 'expediteur', foreignKey: 'expediteurId' });
      Message.belongsTo(models.Utilisateur, { as: 'destinataire', foreignKey: 'destinataireId' });
    }
  }
  Message.init({
    sessionTravailId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expediteurId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    piece_jointe: DataTypes.STRING,
    date_envoi: {
      type: DataTypes.DATE,
      allowNull: false
    },
    prive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    destinataireId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'Messages'
  });
  return Message;
};