'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    static associate(models) {
      Utilisateur.belongsTo(models.Filiere, { foreignKey: 'filiereId' });
      Utilisateur.belongsTo(models.Annee, { foreignKey: 'anneeId' });
      Utilisateur.hasMany(models.ModuleSuivi, { foreignKey: 'utilisateurId' });
      Utilisateur.belongsToMany(models.Module, {
        through: models.ModuleSuivi,
        foreignKey: 'utilisateurId',
        otherKey: 'moduleId',
        as: 'modulesSuivis'
      });
    }
  }
  Utilisateur.init({
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    mot_de_passe: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
    nom: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.STRING },
    niveau: { type: DataTypes.STRING },
    actif: { type: DataTypes.BOOLEAN, defaultValue: true },
    administrateur: { type: DataTypes.BOOLEAN, defaultValue: false },
    date_inscription: { type: DataTypes.DATE, allowNull: false },
    derniere_connexion: { type: DataTypes.DATE },
    filiereId: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.STRING }, // Ajouté
    anneeId: { type: DataTypes.INTEGER }     // Ajouté
  }, {
    sequelize,
    modelName: 'Utilisateur',
    tableName: 'Utilisateurs'
  });
  return Utilisateur;
};