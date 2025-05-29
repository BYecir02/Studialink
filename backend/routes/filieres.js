const express = require('express');
const router = express.Router();
const { Filiere } = require('../models');

router.get('/', async (req, res) => {
  try {
    const filieres = await Filiere.findAll({ attributes: ['id', 'nom', 'type'] });
    res.json(filieres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;