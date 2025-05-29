'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Annee extends Model {
    static associate(models) {
      // associations à ajouter plus tard
    }
  }
  Annee.init({
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Annee',
    tableName: 'Annees',
    timestamps: false
  });
  return Annee;
};