const { Message, Utilisateur } = require('../models');

// ✅ Créer un message texte simple
exports.createMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { contenu, expediteurId } = req.body;

    const message = await Message.create({
      contenu: contenu,
      sessionTravailId: sessionId,
      expediteurId: expediteurId,
      date_envoi: new Date()
    });

    const messageWithUser = await Message.findByPk(message.id, {
      include: [{ model: Utilisateur, as: 'expediteur', attributes: ['id', 'prenom', 'nom'] }]
    });

    res.status(201).json({
      ...messageWithUser.toJSON(),
      utilisateur: messageWithUser.expediteur
    });
  } catch (error) {
    console.error('Erreur création message:', error);
    res.status(400).json({ error: error.message });
  }
};

// ✅ Récupérer tous les messages (fonction générale)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({ 
      include: [{ model: Utilisateur, as: 'expediteur', attributes: ['id', 'prenom', 'nom'] }],
      order: [['date_envoi', 'ASC']] 
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Récupérer messages par session avec gestion des pièces jointes
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

    console.log(`Messages trouvés pour session ${sessionId}:`, messages.length);

    // Adapter pour le frontend avec gestion des pièces jointes
    const messagesAdapted = messages.map(msg => ({
      id: msg.id,
      contenu: msg.contenu,
      date_envoi: msg.date_envoi,
      // ✅ Gestion des pièces jointes
      hasAttachment: !!msg.piece_jointe,
      attachmentType: msg.type_piece_jointe,
      imageUrl: msg.type_piece_jointe === 'image' ? msg.piece_jointe : null,
      fileUrl: msg.piece_jointe,
      // ✅ Pour compatibilité avec le frontend actuel
      type: msg.type_piece_jointe === 'image' ? 'image' : 'text',
      utilisateur: msg.expediteur,
      sessionTravailId: msg.sessionTravailId
    }));

    console.log('Messages adaptés:', messagesAdapted.map(m => ({
      id: m.id,
      contenu: m.contenu,
      hasAttachment: m.hasAttachment,
      attachmentType: m.attachmentType,
      imageUrl: m.imageUrl
    })));

    res.json(messagesAdapted);
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Upload d'image avec texte optionnel
exports.uploadImage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { expediteurId, contenu } = req.body; // ✅ Contenu optionnel
    
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier image fourni' });
    }

    console.log('Upload image:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      contenu: contenu
    });

    const message = await Message.create({
      contenu: contenu || '[Image]', // ✅ Texte accompagnant l'image ou placeholder
      piece_jointe: `/uploads/${req.file.filename}`, // ✅ Utiliser piece_jointe
      type_piece_jointe: 'image', // ✅ Type de la pièce jointe
      sessionTravailId: sessionId,
      expediteurId: expediteurId,
      date_envoi: new Date()
    });

    const messageWithUser = await Message.findByPk(message.id, {
      include: [{ model: Utilisateur, as: 'expediteur', attributes: ['id', 'prenom', 'nom'] }]
    });

    console.log('Message avec image créé:', {
      id: messageWithUser.id,
      contenu: messageWithUser.contenu,
      piece_jointe: messageWithUser.piece_jointe,
      type_piece_jointe: messageWithUser.type_piece_jointe
    });

    res.json({
      ...messageWithUser.toJSON(),
      contenu: messageWithUser.contenu,
      utilisateur: messageWithUser.expediteur,
      imageUrl: messageWithUser.piece_jointe, // ✅ Pour compatibilité frontend
      type: 'image', // ✅ Pour compatibilité frontend
      hasAttachment: true,
      attachmentType: 'image'
    });
  } catch (error) {
    console.error('Erreur upload image:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Upload de fichiers généraux (pour extension future)
exports.uploadFile = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { expediteurId, contenu } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    // Déterminer le type de fichier
    let fileType = 'document';
    if (req.file.mimetype.startsWith('image/')) fileType = 'image';
    else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
    else if (req.file.mimetype.startsWith('audio/')) fileType = 'audio';

    const message = await Message.create({
      contenu: contenu || `[${req.file.originalname}]`,
      piece_jointe: `/uploads/${req.file.filename}`,
      type_piece_jointe: fileType,
      sessionTravailId: sessionId,
      expediteurId: expediteurId,
      date_envoi: new Date()
    });

    const messageWithUser = await Message.findByPk(message.id, {
      include: [{ model: Utilisateur, as: 'expediteur', attributes: ['id', 'prenom', 'nom'] }]
    });

    res.json({
      ...messageWithUser.toJSON(),
      utilisateur: messageWithUser.expediteur,
      fileUrl: messageWithUser.piece_jointe,
      hasAttachment: true,
      attachmentType: fileType
    });
  } catch (error) {
    console.error('Erreur upload fichier:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Supprimer un message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByPk(messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    // Supprimer le fichier physique si c'est une pièce jointe
    if (message.piece_jointe) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', message.piece_jointe);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await message.destroy();
    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression message:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { expediteurId, contenu } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    console.log('Upload fichier:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Déterminer le type de fichier
    let fileType = 'document';
    if (req.file.mimetype.startsWith('image/')) fileType = 'image';
    else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
    else if (req.file.mimetype.startsWith('audio/')) fileType = 'audio';

    const message = await Message.create({
      contenu: contenu || `[${req.file.originalname}]`,
      piece_jointe: `/uploads/${req.file.filename}`,
      type_piece_jointe: fileType,
      sessionTravailId: sessionId,
      expediteurId: expediteurId,
      date_envoi: new Date()
    });

    const messageWithUser = await Message.findByPk(message.id, {
      include: [{ model: Utilisateur, as: 'expediteur', attributes: ['id', 'prenom', 'nom'] }]
    });

    res.json({
      ...messageWithUser.toJSON(),
      contenu: messageWithUser.contenu,
      utilisateur: messageWithUser.expediteur,
      fileUrl: messageWithUser.piece_jointe,
      hasAttachment: true,
      attachmentType: fileType
    });
  } catch (error) {
    console.error('Erreur upload fichier:', error);
    res.status(500).json({ error: error.message });
  }
};