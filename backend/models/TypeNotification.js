'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TypeNotification extends Model {
    static associate(models) {
      TypeNotification.hasMany(models.Notification, {
        foreignKey: 'typeId'
      });
    }
  }

  TypeNotification.init({
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    icone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    couleur: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'TypeNotification',
    tableName: 'TypeNotifications'
  });

  return TypeNotification;
};