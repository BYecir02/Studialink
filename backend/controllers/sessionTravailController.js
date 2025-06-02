const { SessionTravail, Module, Utilisateur, ParticipantSession } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const sessions = await SessionTravail.findAll({
      include: [
        { model: Module },
        { model: Utilisateur, as: 'createur' },
        {
          model: ParticipantSession,
          as: 'participants',
          include: [{ model: Utilisateur }]
        }
      ]
    });
    // On simplifie la structure pour le front
    const sessionsJson = sessions.map(session => {
      const s = session.toJSON();
      s.participants = s.participants.map(p => p.Utilisateur);
      return s;
    });
    res.json(sessionsJson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const session = await SessionTravail.findByPk(req.params.id, {
      include: [
        { model: Module },
        { model: Utilisateur, as: 'createur' },
        {
          model: ParticipantSession,
          as: 'participants',
          include: [{ model: Utilisateur }]
        }
      ]
    });
    if (!session) return res.status(404).json({ error: 'Session non trouvée' });
    // Pour simplifier côté front
    const sessionJson = session.toJSON();
    sessionJson.participants = sessionJson.participants.map(p => p.Utilisateur);
    res.json(sessionJson);
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

// Ajouter un participant à une session
exports.addParticipant = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { utilisateurId } = req.body;

    // Vérifier que la session existe
    const session = await SessionTravail.findByPk(sessionId);
    if (!session) return res.status(404).json({ error: 'Session non trouvée' });

    // Vérifier que l'utilisateur existe
    const user = await Utilisateur.findByPk(utilisateurId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    // Vérifier si déjà participant
    const deja = await ParticipantSession.findOne({
      where: { sessionTravailId: sessionId, utilisateurId }
    });
    if (deja) return res.status(400).json({ error: 'Déjà participant à cette session' });

    // Ajouter le participant
    const participant = await ParticipantSession.create({
      sessionTravailId: sessionId,
      utilisateurId,
      approuve: true, // ou false si tu veux une validation
      date_rejoindre: new Date()
    });

    res.status(201).json({ message: 'Participant ajouté', participant });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Recherche avancée de sessions
exports.search = async (req, res) => {
  const { titre, matiere, en_ligne, date } = req.query;
  const where = {};
  if (titre) where.titre = { [Op.like]: `%${titre}%` };
  if (en_ligne !== undefined && en_ligne !== '') where.en_ligne = en_ligne;
  if (date) where.date_heure = { [Op.gte]: new Date(date) };
  if (matiere) where.moduleId = matiere;
  try {
    const sessions = await SessionTravail.findAll({
      where,
      include: [{ model: Module }, { model: Utilisateur, as: 'createur' }]
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeParticipant = async (req, res) => {
  try {
    const { sessionId, utilisateurId } = req.params;

    // Vérifier que la session existe
    const session = await SessionTravail.findByPk(sessionId);
    if (!session) return res.status(404).json({ error: 'Session non trouvée' });

    // Vérifier que l'utilisateur existe
    const user = await Utilisateur.findByPk(utilisateurId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    // Trouver et supprimer la participation
    const participation = await ParticipantSession.findOne({
      where: { sessionTravailId: sessionId, utilisateurId }
    });

    if (!participation) {
      return res.status(404).json({ error: 'Participation non trouvée' });
    }

    await participation.destroy();

    res.json({ message: 'Participant retiré avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du participant:', err);
    res.status(500).json({ error: err.message });
  }
};

// Sessions où l'utilisateur est créateur OU participant (fusion sans doublons)
exports.getAllUserSessions = async (req, res) => {
  const userId = Number(req.params.id);
  try {
    // Sessions créées par l'utilisateur
    const sessionsCreees = await SessionTravail.findAll({
      where: { createurId: userId },
      include: [{ model: Module }, { model: Utilisateur, as: 'createur' }]
    });
    // Sessions où il est participant
    const participations = await ParticipantSession.findAll({
      where: { utilisateurId: userId },
      include: [{
        model: SessionTravail,
        include: [{ model: Module }, { model: Utilisateur, as: 'createur' }]
      }]
    });
    const sessionsParticipations = participations.map(p => p.SessionTravail);

    // Fusion sans doublons (par id)
    const map = new Map();
    sessionsCreees.concat(sessionsParticipations).forEach(s => {
      if (s) map.set(s.id, s);
    });

    res.json(Array.from(map.values()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};