'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.Utilisateur, { foreignKey: 'utilisateurId' });
    }
  }
  Notification.init({
    utilisateurId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contenu: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lue: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    date_creation: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'Notifications'
  });
  return Notification;
};