'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EvenementCalendrier extends Model {
    static associate(models) {
      EvenementCalendrier.belongsTo(models.Utilisateur, { foreignKey: 'utilisateurId' });
      EvenementCalendrier.belongsTo(models.SessionTravail, { foreignKey: 'sessionTravailId' });
    }
  }
  EvenementCalendrier.init({
    utilisateurId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sessionTravailId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type_evenement: {
      type: DataTypes.STRING,
      allowNull: false
    },
    debut: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fin: {
      type: DataTypes.DATE,
      allowNull: false
    },
    synchronise_avec: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'EvenementCalendrier',
    tableName: 'EvenementCalendriers'
  });
  return EvenementCalendrier;
};