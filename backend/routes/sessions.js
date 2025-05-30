const express = require('express');
const router = express.Router();
const controller = require('../controllers/sessionTravailController');

// CRUD
router.get('/search', controller.search);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
// Ajouter un participant à une session
router.post('/:sessionId/participants', controller.addParticipant);


module.exports = router;