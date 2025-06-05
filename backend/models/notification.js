'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.Utilisateur, { 
        foreignKey: 'utilisateurId',
        as: 'destinataire'
      });
      
      // ✅ NOUVEAU : Relation avec TypeNotification
      Notification.belongsTo(models.TypeNotification, { 
        foreignKey: 'typeId'
      });
      
      // ✅ NOUVEAU : Relation avec SessionTravail
      Notification.belongsTo(models.SessionTravail, { 
        foreignKey: 'sessionTravailId'
      });
      
      // ✅ NOUVEAU : Relation avec le demandeur
      Notification.belongsTo(models.Utilisateur, { 
        foreignKey: 'demandeurId',
        as: 'demandeur'
      });
    }
  }

  Notification.init({
    utilisateurId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // ✅ GARDER pour la compatibilité, mais on utilisera typeId
    type: {
      type: DataTypes.STRING,
      allowNull: true // Changé en nullable
    },
    // ✅ NOUVEAU : Référence vers TypeNotification
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'TypeNotifications',
        key: 'id'
      }
    },
    contenu: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // ✅ NOUVEAU : Titre de la notification
    titre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // ✅ NOUVEAU : Session concernée
    sessionTravailId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // ✅ NOUVEAU : Utilisateur qui fait la demande
    demandeurId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // ✅ NOUVEAU : Si la notification a été traitée (accepté/refusé)
    traite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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