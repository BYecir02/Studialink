const { Utilisateur, Filiere, Annee } = require('../models'); // Ajoute Annee
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'studiakey'; // À mettre dans un .env en prod

exports.register = async (req, res) => {
  try {
    const { email, mot_de_passe, prenom, nom, filiereId, description, anneeId } = req.body;
    const hash = await bcrypt.hash(mot_de_passe, 10);
    const user = await Utilisateur.create({
      email,
      mot_de_passe: hash,
      prenom,
      nom,
      filiereId,
      description,
      anneeId,
      date_inscription: new Date()
    });
    res.status(201).json({
      message: 'Utilisateur créé',
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    // On inclut la filière dans la requête
    const user = await Utilisateur.findOne({
      where: { email },
      include: [
        { model: Filiere, attributes: ['id', 'nom', 'type'] },
        { model: Annee, attributes: ['id', 'nom'] } // Ajoute l'année
      ]
    });
    if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé' });
    const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1d' });
    await user.update({ derniere_connexion: new Date() });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        filiereId: user.filiereId,
        filiere: user.Filiere, // On renvoie la filière complète
        date_inscription: user.date_inscription,
        description: user.description, // Ajoute ceci
        anneeId: user.anneeId,         // Ajoute ceci si tu veux l'id
        annee: user.Annee || null      // Ajoute ceci si tu fais un include sur Annee (voir ci-dessous)
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  // Pour un JWT, le logout se gère côté client (suppression du token)
  res.json({ message: 'Déconnexion réussie (côté client, supprimez le token)' });
};