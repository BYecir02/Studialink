const { SessionTravail, Module, Utilisateur, ParticipantSession } = require('../models');

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