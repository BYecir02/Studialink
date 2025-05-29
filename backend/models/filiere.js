'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Filiere extends Model {
    static associate(models) {
      // associations à ajouter plus tard
    }
  }
  Filiere.init({
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['cycle', 'specialisation']]
      }
    }
  }, {
    sequelize,
    modelName: 'Filiere',
    tableName: 'Filieres',
    timestamps: false
  });
  return Filiere;
};