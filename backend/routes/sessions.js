const express = require('express');
const router = express.Router();
const controller = require('../controllers/sessionTravailController');
const sessionTravailController = require('../controllers/sessionTravailController');
const messageController = require('../controllers/messageController');

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


module.exports = router;