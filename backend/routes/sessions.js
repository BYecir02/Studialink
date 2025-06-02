const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/sessionTravailController');
const sessionTravailController = require('../controllers/sessionTravailController');
const messageController = require('../controllers/messageController');

// ✅ Configuration de multer pour les images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ✅ Configuration de multer pour les documents
const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ✅ Filtre pour les images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers image sont autorisés'), false);
  }
};

// ✅ Filtre pour les documents
const documentFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

// ✅ Configuration multer pour les images
const uploadImage = multer({ 
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

// ✅ Configuration multer pour les documents
const uploadDocument = multer({ 
  storage: documentStorage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
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

// ✅ Route pour upload d'images
router.post('/:sessionId/messages/image', uploadImage.single('image'), messageController.uploadImage);

// ✅ Route pour upload de documents
router.post('/:sessionId/messages/file', uploadDocument.single('file'), messageController.uploadFile);

module.exports = router;