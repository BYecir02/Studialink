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
module.exports = router;