const express = require('express');
const router = express.Router();
const { Utilisateur } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  const { search } = req.query;
  const where = search ? {
    [Op.or]: [
      { prenom: { [Op.iLike]: `%${search}%` } },
      { nom: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ]
  } : {};
  const users = await Utilisateur.findAll({ where, limit: 10 });
  res.json(users);
});

module.exports = router;