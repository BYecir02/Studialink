const { Message, Utilisateur } = require('../models');

exports.createMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({ order: [['createdAt', 'ASC']] });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessagesBySession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const messages = await Message.findAll({
      where: { sessionTravailId: sessionId },
      include: [{ model: Utilisateur, as: 'utilisateur', attributes: ['id', 'prenom', 'nom'] }],
      order: [['date_envoi', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessagesBySession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const messages = await Message.findAll({
      where: { sessionTravailId: sessionId },
      include: [
        { model: Utilisateur, as: 'expediteur', attributes: ['id', 'prenom', 'nom'] }
      ],
      order: [['date_envoi', 'ASC']]
    });

    // Adapter pour le front : renommer "expediteur" en "utilisateur"
    const messagesAdapted = messages.map(msg => ({
      id: msg.id,
      contenu: msg.contenu,
      date_envoi: msg.date_envoi,
      utilisateur: msg.expediteur,
    }));

    res.json(messagesAdapted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};