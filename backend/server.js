const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const auth = require('./middlewares/auth');
const cors = require('cors');

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour gérer les CORS
app.use(cors({
  origin: 'http://localhost:3001', // autorise le front
  credentials: true
}));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const filiereRoutes = require('./routes/filieres');
app.use('/api/filieres', filiereRoutes);

const sessionRoutes = require('./routes/sessions');
app.use('/api/sessions', sessionRoutes);

const moduleRoutes = require('./routes/modules');
app.use('/api/modules', moduleRoutes);

// Routes (à définir plus tard)
app.get('/', (req, res) => {
  res.send('API en ligne !');
});

app.get('/api/route/protegee', auth, (req, res) => {
  res.json({ message: 'Accès autorisé', user: req.user });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
