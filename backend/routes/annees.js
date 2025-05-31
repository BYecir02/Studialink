const express = require('express');
const router = express.Router();
const { Annee } = require('../models');

router.get('/', async (req, res) => {
  try {
    const annees = await Annee.findAll({ attributes: ['id', 'nom'] });
    res.json(annees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;