const express = require('express');
const router = express.Router();
const controller = require('../controllers/ressourceBiblioController');
const multer = require('multer');

// Pour l'upload de fichiers (dossier 'uploads/')
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Lister + filtrer
router.get('/', controller.list);

// ✅ Nouvel endpoint pour les années de production
router.get('/annees-production', controller.getAnneesProduction);


// Télécharger un fichier
router.get('/:id/download', controller.download);

// Créer (uploader)
router.post('/', upload.single('fichier'), controller.create);

// Modifier (optionnel)
router.put('/:id', controller.update);

// Supprimer (optionnel)
router.delete('/:id', controller.remove);

module.exports = router;