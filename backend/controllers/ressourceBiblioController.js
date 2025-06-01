const { RessourceBiblio } = require('../models');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

// Créer (upload)
exports.create = async (req, res) => {
  try {
    const { titre, description, type, uploadeurId, moduleId, anneeId, filiereId, statut, annee_production } = req.body;
    const fichier = req.file ? req.file.filename : null;
    const date_upload = new Date();
    const ressource = await RessourceBiblio.create({
      titre,
      description,
      type,
      fichier,
      uploadeurId,
      moduleId,
      anneeId,
      filiereId,
      statut,
      annee_production,
      date_upload
    });
    res.status(201).json(ressource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lister + filtrer
exports.list = async (req, res) => {
  const { annee, module, type, search, anneeProduction } = req.query; // ✅ Ajouter anneeProduction
  const where = {};
  if (annee) where.anneeId = annee;   // annee = id
  if (module) where.moduleId = module; // module = id
  if (type) where.type = type;
  if (anneeProduction) where.annee_production = anneeProduction; // ✅ Nouveau filtre
  if (search) {
    where[Op.or] = [
      { titre: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  try {
    const ressources = await RessourceBiblio.findAll({ where });
    res.json(ressources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Télécharger un fichier
exports.download = async (req, res) => {
  try {
    const ressource = await RessourceBiblio.findByPk(req.params.id);
    if (!ressource || !ressource.fichier) return res.status(404).json({ error: 'Fichier non trouvé' });
    const filePath = path.join(__dirname, '..', 'uploads', ressource.fichier);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Fichier absent sur le serveur' });
    res.download(filePath, ressource.fichier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier (optionnel)
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    if (req.file) data.fichier = req.file.filename;
    const [updated] = await RessourceBiblio.update(data, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Ressource non trouvée' });
    const ressource = await RessourceBiblio.findByPk(id);
    res.json(ressource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer (optionnel)
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const ressource = await RessourceBiblio.findByPk(id);
    if (!ressource) return res.status(404).json({ error: 'Ressource non trouvée' });
    // Supprime le fichier physique si besoin
    if (ressource.fichier) {
      const filePath = path.join(__dirname, '..', 'uploads', ressource.fichier);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await RessourceBiblio.destroy({ where: { id } });
    res.json({ message: 'Ressource supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Nouvelle fonction pour récupérer les années de production
exports.getAnneesProduction = async (req, res) => {
  try {
    const result = await RessourceBiblio.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('annee_production')), 'annee_production']],
      where: {
        annee_production: {
          [Op.not]: null
        }
      },
      order: [['annee_production', 'DESC']]
    });
    
    const annees = result.map(r => r.annee_production).filter(Boolean);
    res.json(annees);
  } catch (error) {
    console.error('Erreur lors de la récupération des années de production:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};