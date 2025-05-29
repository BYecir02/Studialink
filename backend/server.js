const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const auth = require('./middlewares/auth');

// Middleware pour parser le JSON
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

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
