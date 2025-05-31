import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditProfil.css';

export default function EditProfil({ user, updateUser}) {
  const [form, setForm] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    description: user?.description || '',
    anneeId: user?.anneeId || ''
  });
  const [annees, setAnnees] = useState([]);
  const [modules, setModules] = useState([]);
  const [modulesSuivis, setModulesSuivis] = useState([]); // tableau d'ids
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/annees')
      .then(res => setAnnees(res.data))
      .catch(() => setAnnees([]));
    axios.get('http://localhost:3000/api/modules')
      .then(res => setModules(res.data))
      .catch(() => setModules([]));
    axios.get(`http://localhost:3000/api/utilisateurs/${user.id}/modules-suivis`)
      .then(res => setModulesSuivis(res.data.map(m => m.id)))
      .catch(() => setModulesSuivis([]));
  }, [user.id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleModuleClick = id => {
    if (modulesSuivis.includes(id)) return;
    setModulesSuivis(prev => [...prev, id]);
  };

  const handleRemoveModule = id => {
    setModulesSuivis(prev => prev.filter(mid => mid !== id));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/utilisateurs/${user.id}`, {
        ...form,
        modulesSuivis // tableau d'ids à envoyer au backend
      });

      // ✅ Mettre à jour l'état utilisateur dans App.js
      const selectedAnnee = annees.find(a => a.id === Number(form.anneeId));
      const updatedUserData = {
        prenom: form.prenom,
        nom: form.nom,
        description: form.description,
        anneeId: form.anneeId,
        annee: selectedAnnee || null // Pour l'affichage du nom de l'année
      };
      
      if (updateUser) {
        updateUser(updatedUserData);
      }

      setMessage('Profil mis à jour !');
      setTimeout(() => navigate('/profil'), 1000);
    } catch (err) {
      setMessage("Erreur lors de la mise à jour");
    }
  };

  // Modules filtrés par recherche et non déjà suivis
  const filteredModules = modules
    .filter(m =>
      m.nom.toLowerCase().includes(search.toLowerCase()) &&
      !modulesSuivis.includes(m.id)
    )
    .slice(0, 10); // Limite l'affichage à 10 résultats

  return (
    <div className="edit-profile-container">
      <button
        type="button"
        className="edit-profile-back-btn"
        onClick={() => navigate('/profil')}
      >
        &#8592; Retour au profil
      </button>
      <h2 className="edit-profile-title">Modifier mon profil</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="edit-profile-grid">
          <div className="edit-profile-item">
            <label htmlFor="prenom">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="edit-profile-item">
            <label htmlFor="nom">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="edit-profile-item edit-profile-full">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="edit-profile-item edit-profile-full">
            <label htmlFor="anneeId">Année actuelle</label>
            <select
              id="anneeId"
              name="anneeId"
              value={form.anneeId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner une année</option>
              {annees.map(a => (
                <option key={a.id} value={a.id}>{a.nom}</option>
              ))}
            </select>
          </div>
          <div className="edit-profile-item edit-profile-full">
            <label>Modules suivis</label>
            <input
              type="text"
              placeholder="Rechercher un module..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="edit-profile-module-search"
              autoComplete="off"
            />
            {search && filteredModules.length > 0 && (
              <div className="edit-profile-module-list">
                {filteredModules.map(m => (
                  <div
                    key={m.id}
                    className="edit-profile-module-suggestion"
                    onClick={() => handleModuleClick(m.id)}
                  >
                    {m.nom}
                  </div>
                ))}
              </div>
            )}
            <div className="edit-profile-modules" style={{ marginTop: 8 }}>
              {modules
                .filter(m => modulesSuivis.includes(m.id))
                .map(m => (
                  <span
                    key={m.id}
                    className="edit-profile-module-tag selected"
                  >
                    {m.nom}
                    <span
                      className="edit-profile-module-remove"
                      onClick={() => handleRemoveModule(m.id)}
                      title="Retirer ce module"
                    >
                      &times;
                    </span>
                  </span>
                ))}
            </div>
          </div>
        </div>
        <button className="edit-profile-btn" type="submit">
          Enregistrer les modifications
        </button>
        {message && (
          <div className={`edit-profile-message${message.includes('Erreur') ? ' error' : ''}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}