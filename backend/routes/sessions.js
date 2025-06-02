const express = require('express');
const router = express.Router();
const multer = require('multer'); // ✅ Ajouter multer
const path = require('path');
const controller = require('../controllers/sessionTravailController');
const sessionTravailController = require('../controllers/sessionTravailController');
const messageController = require('../controllers/messageController');

// ✅ Configuration de multer pour les images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier où stocker les images
  },
  filename: function (req, file, cb) {
    // Nom du fichier : timestamp + nom original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ✅ Filtre pour accepter seulement les images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers image sont autorisés'), false);
  }
};

// ✅ Configuration multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

// CRUD
router.get('/search', controller.search);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.post('/:sessionId/participants', controller.addParticipant);
router.get('/:sessionId/messages', messageController.getMessagesBySession);
router.delete('/:sessionId/participants/:utilisateurId', controller.removeParticipant);

// ✅ Route pour les messages texte
router.post('/:sessionId/messages', messageController.createMessage);

// ✅ Route pour upload d'images (maintenant upload est défini)
router.post('/:sessionId/messages/image', upload.single('image'), messageController.uploadImage);

module.exports = router;