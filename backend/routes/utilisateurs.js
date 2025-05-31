const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Utilisateur, SessionTravail, ParticipantSession, Module } = require('../models');

router.get('/', async (req, res) => {
  const search = req.query.search;
  try {
    let utilisateurs = [];
    if (search && search.length > 1) {
      utilisateurs = await Utilisateur.findAll({
        where: {
          [Op.or]: [
            { prenom: { [Op.like]: `%${search}%` } },
            { nom: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        }
      });
    }
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/sessions', async (req, res) => {
  try {
    const participations = await ParticipantSession.findAll({
      where: { utilisateurId: req.params.id },
      include: [
        {
          model: SessionTravail,
          include: [{ model: Module }, { model: Utilisateur, as: 'createur' }]
        }
      ]
    });
    // On retourne juste la session (pas l'objet ParticipantSession)
    res.json(participations.map(p => p.SessionTravail));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/modules-suivis', async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.params.id, {
      include: [
        {
          model: Module,
          as: 'modulesSuivis',
          attributes: ['id', 'nom']
        }
      ]
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user.modulesSuivis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    // Mise à jour des champs de base
    await user.update({
      prenom: req.body.prenom,
      nom: req.body.nom,
      description: req.body.description,
      anneeId: req.body.anneeId
    });

    // Mise à jour des modules suivis (table de jointure)
    if (Array.isArray(req.body.modulesSuivis)) {
      await user.setModulesSuivis(req.body.modulesSuivis);
    }

    res.json({ message: 'Profil mis à jour' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;