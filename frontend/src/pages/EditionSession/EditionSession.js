import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditionSession.css';

export default function EditionSession({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [titre, setTitre] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [modules, setModules] = useState([]);
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [duree, setDuree] = useState(60);
  const [type, setType] = useState('presentiel');
  const [lieu, setLieu] = useState('');
  const [description, setDescription] = useState('');
  const [confidentialite, setConfidentialite] = useState('publique');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [participants, setParticipants] = useState([]);

  // Charger la session et ses participants
  useEffect(() => {
    axios.get(`http://localhost:3000/api/sessions/${id}`)
      .then(res => {
        setSession(res.data);
        setTitre(res.data.titre || '');
        setModuleId(res.data.Module?.id || '');
        setDate(res.data.date_heure ? res.data.date_heure.slice(0, 10) : '');
        setHeure(res.data.date_heure ? res.data.date_heure.slice(11, 16) : '');
        setDuree(res.data.duree || 60);
        setType(res.data.en_ligne ? (res.data.lien_en_ligne ? 'en_ligne' : 'hybride') : 'presentiel');
        setLieu(res.data.lieu || res.data.lien_en_ligne || '');
        setDescription(res.data.description || '');
        setConfidentialite(res.data.confidentialite || 'publique');
        setMaxParticipants(res.data.max_participants || 10);
        setParticipants(res.data.participants || []);
      });
    // Charger les modules pour la liste déroulante
    axios.get('http://localhost:3000/api/modules')
      .then(res => setModules(res.data));
  }, [id]);

  // Recherche utilisateur dynamique
  useEffect(() => {
    if (search.length < 2) {
      setSuggestions([]);
      return;
    }
    axios.get(`http://localhost:3000/api/utilisateurs?search=${search}`)
      .then(res => setSuggestions(res.data));
  }, [search]);

  // Ajouter un participant à la session
  const addParticipant = (utilisateur) => {
    if (participants.some(p => p.id === utilisateur.id)) return;
    axios.post(`http://localhost:3000/api/sessions/${id}/participants`, { utilisateurId: utilisateur.id })
      .then(() => setParticipants([...participants, utilisateur]));
  };

  // Retirer un participant (optionnel)
  const removeParticipant = (utilisateurId) => {
    axios.delete(`http://localhost:3000/api/sessions/${id}/participants/${utilisateurId}`)
      .then(() => setParticipants(participants.filter(p => p.id !== utilisateurId)));
  };

  // Enregistrer les modifications
  const handleSubmit = (e) => {
    e.preventDefault();
    const date_heure = `${date}T${heure}`;
    axios.put(`http://localhost:3000/api/sessions/${id}`, {
      titre,
      moduleId,
      date_heure,
      duree,
      en_ligne: type === 'en_ligne' || type === 'hybride',
      lien_en_ligne: type === 'en_ligne' || type === 'hybride' ? lieu : null,
      lieu: type === 'presentiel' || type === 'hybride' ? lieu : null,
      description,
      confidentialite,
      max_participants: maxParticipants
    }).then(() => navigate(-1));
  };

  if (!session) return <div>Chargement...</div>;

  return (
    <div className="container">
        <div className="header">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left"></i> Retour
            </button>
        </div>
      <h2>Modifier la session</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Titre de la session</label>
          <input
            type="text"
            className="form-control"
            value={titre}
            onChange={e => setTitre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Matière</label>
          <select
            className="form-control"
            value={moduleId}
            onChange={e => setModuleId(e.target.value)}
            required
          >
            <option value="">Sélectionner...</option>
            {modules.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Heure</label>
          <input
            type="time"
            className="form-control"
            value={heure}
            onChange={e => setHeure(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Durée (minutes)</label>
          <input
            type="number"
            className="form-control"
            value={duree}
            min={15}
            max={300}
            onChange={e => setDuree(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Type de session</label>
          <select
            className="form-control"
            value={type}
            onChange={e => setType(e.target.value)}
            required
          >
            <option value="presentiel">Présentiel</option>
            <option value="en_ligne">En ligne</option>
            <option value="hybride">Hybride</option>
          </select>
        </div>
        <div className="form-group">
          <label>Lieu ou lien</label>
          <input
            type="text"
            className="form-control"
            value={lieu}
            onChange={e => setLieu(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        <div className="form-group">
          <label>Visibilité</label>
          <select
            className="form-control"
            value={confidentialite}
            onChange={e => setConfidentialite(e.target.value)}
            required
          >
            <option value="publique">Publique</option>
            <option value="privee">Privée</option>
          </select>
        </div>
        <div className="form-group">
          <label>Participants maximum</label>
          <input
            type="number"
            className="form-control"
            value={maxParticipants}
            min={2}
            max={50}
            onChange={e => setMaxParticipants(e.target.value)}
            required
          />
        </div>
        <div style={{margin: '30px 0'}}>
          <label>Ajouter un participant :</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur..."
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map(u => (
                <li key={u.id} onClick={() => addParticipant(u)} style={{cursor: 'pointer'}}>
                  {u.prenom} {u.nom} ({u.email})
                </li>
              ))}
            </ul>
          )}
          <div style={{marginTop: 20}}>
            <strong>Participants :</strong>
            <ul>
              {participants.map(p => (
                <li key={p.id}>
                  {p.prenom} {p.nom}
                  <button type="button" style={{marginLeft: 8, color: 'red', border: 'none', background: 'none', cursor: 'pointer'}}
                    onClick={() => removeParticipant(p.id)}>
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{marginTop: 30}}>
          <button type="button" className="action-btn" onClick={() => navigate(-1)}>
            Annuler
          </button>
          <button type="submit" className="action-btn primary" style={{marginLeft: 12}}>
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}