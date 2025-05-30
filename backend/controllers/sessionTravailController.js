const { SessionTravail, Module, Utilisateur } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const sessions = await SessionTravail.findAll({
      include: [
        { model: Module },
        { model: Utilisateur, as: 'createur' }
      ]
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const session = await SessionTravail.findByPk(req.params.id, {
      include: [
        { model: Module },
        { model: Utilisateur, as: 'createur' } // Correction ici !
      ]
    });
    if (!session) return res.status(404).json({ error: 'Session non trouvée' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const session = await SessionTravail.create(req.body);
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const session = await SessionTravail.findByPk(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session non trouvée' });
    await session.update(req.body);
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const session = await SessionTravail.findByPk(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session non trouvée' });
    await session.destroy();
    res.json({ message: 'Session supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};