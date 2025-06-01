import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Bibliotheque.css';
import { useNavigate } from 'react-router-dom';

export default function AjouterRessource({ user }) {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    type: '',
    moduleId: '',
    anneeId: '',
    filiereId: '',
    annee_production: new Date().getFullYear(),
    fichier: null
  });
  const [modules, setModules] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Charger modules, années et filières au chargement du composant
  useEffect(() => {
    axios.get('http://localhost:3000/api/modules')
      .then(res => setModules(res.data))
      .catch(() => setModules([]));
    axios.get('http://localhost:3000/api/annees')
      .then(res => setAnnees(res.data))
      .catch(() => setAnnees([]));
    axios.get('http://localhost:3000/api/filieres')
      .then(res => setFilieres(res.data))
      .catch(() => setFilieres([]));
  }, []);

  const handleChange = e => {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'file' ? e.target.files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    // Ajoute les champs obligatoires côté backend
    data.append('uploadeurId', user.id); 
    data.append('statut', 'valide'); // ou 'en_attente'
    try {
      await axios.post('http://localhost:3000/api/ressources', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Ressource ajoutée !');
      setTimeout(() => navigate('/bibliotheque'), 1200);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Erreur lors de l\'ajout');
    }
  };

  return (
    <div className="biblio-container">
      <button
        className="biblio-btn biblio-btn-retour"
        type="button"
        onClick={() => navigate('/bibliotheque')}
        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center' }}
      >
        <i className="fas fa-arrow-left" style={{ marginRight: 8 }}></i>
        Retour à la bibliothèque
      </button>
      <div className="biblio-header">
        <h2><i className="fas fa-plus"></i> Ajouter une ressource</h2>
      </div>
      <form className="biblio-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          name="titre"
          placeholder="Titre"
          value={form.titre}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="">Type de ressource</option>
          <option value="Cours">Cours</option>
          <option value="TD">TD</option>
          <option value="TP">TP</option>
          <option value="Annales">Annales</option>
          <option value="Fiche">Fiche</option>
        </select>
        {/* Liste des modules */}
        <select
          name="moduleId"
          value={form.moduleId}
          onChange={handleChange}
          required
        >
          <option value="">Sélectionner un module</option>
          {modules.map(m => (
            <option key={m.id} value={m.id}>{m.nom}</option>
          ))}
        </select>
        {/* Liste des années d'enseignement */}
        <select
          name="anneeId"
          value={form.anneeId}
          onChange={handleChange}
          required
        >
          <option value="">Sélectionner une année d'enseignement</option>
          {annees.map(a => (
            <option key={a.id} value={a.id}>{a.nom}</option>
          ))}
        </select>
        {/* Liste des filières */}
        <select
          name="filiereId"
          value={form.filiereId}
          onChange={handleChange}
          required
        >
          <option value="">Sélectionner une filière</option>
          {filieres.map(f => (
            <option key={f.id} value={f.id}>{f.nom}</option>
          ))}
        </select>
        <input
          name="annee_production"
          type="number"
          placeholder="Année de production"
          value={form.annee_production}
          onChange={handleChange}
          required
        />
        <input
          name="fichier"
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.jpg,.png"
          onChange={handleChange}
          required
        />
        <button className="biblio-btn" type="submit">
          <i className="fas fa-upload"></i> Ajouter
        </button>
        {message && <div className="biblio-message">{message}</div>}
      </form>
    </div>
  );
}