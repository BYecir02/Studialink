const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const auth = require('./middlewares/auth');
const cors = require('cors');
const { Message, Utilisateur } = require('./models');

// Ajout pour Socket.IO
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    credentials: true
  }
});

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour gérer les CORS
app.use(cors({
  origin: 'http://localhost:3001', // autorise le front
  credentials: true
}));

app.use('/uploads', express.static('uploads'));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const filiereRoutes = require('./routes/filieres');
app.use('/api/filieres', filiereRoutes);

const sessionRoutes = require('./routes/sessions');
app.use('/api/sessions', sessionRoutes);

const moduleRoutes = require('./routes/modules');
app.use('/api/modules', moduleRoutes);

const utilisateurRoutes = require('./routes/utilisateurs');
app.use('/api/utilisateurs', utilisateurRoutes);

const ressourceBiblioRoutes = require('./routes/ressourceBiblio');
app.use('/api/ressources', ressourceBiblioRoutes);

const anneeRoutes = require('./routes/annees');
app.use('/api/annees', anneeRoutes);

const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);

// Routes (à définir plus tard)
app.get('/', (req, res) => {
  res.send('API en ligne !');
});

app.get('/api/route/protegee', auth, (req, res) => {
  res.json({ message: 'Accès autorisé', user: req.user });
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');

  socket.on('sendMessage', async (messageData) => {
    try {
      // Sauvegarde le message en base
      const message = await Message.create(messageData);

      // Récupère l'expéditeur complet
      const expediteur = await Utilisateur.findByPk(message.expediteurId, {
        attributes: ['id', 'prenom', 'nom']
      });

      // Diffuse le message sauvegardé à tous les clients avec l'objet utilisateur
      io.emit('receiveMessage', {
        ...message.toJSON(),
        utilisateur: expediteur
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du message :', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
});

// Lancer le serveur avec http/server pour Socket.IO
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});