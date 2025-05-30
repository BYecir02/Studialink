import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditionSession({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [participants, setParticipants] = useState([]);

  // Charger la session et ses participants
  useEffect(() => {
    axios.get(`http://localhost:3000/api/sessions/${id}`)
      .then(res => {
        setSession(res.data);
        setParticipants(res.data.participants || []);
      });
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

  if (!session) return <div>Chargement...</div>;

  return (
    <div className="container">
      <h2>Modifier la session</h2>
      {/* ...autres champs de modification... */}
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
              <li key={p.id}>{p.prenom} {p.nom}</li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={() => navigate(-1)}>Retour</button>
    </div>
  );
}