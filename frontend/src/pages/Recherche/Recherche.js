import React, { useState } from 'react';
import axios from 'axios';
import './Recherche.css';

export default function Recherche({ user }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [filtre, setFiltre] = useState({ matiere: '', en_ligne: '', date: '' });
  const [loading, setLoading] = useState(false);

  // Pour la session privée
  const [privateCode, setPrivateCode] = useState('');
  const [privateSession, setPrivateSession] = useState(null);
  const [privateError, setPrivateError] = useState('');
  const [privateLoading, setPrivateLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const params = {
      titre: query,
      matiere: filtre.matiere,
      en_ligne: filtre.en_ligne,
      date: filtre.date
    };
    try {
      // On ne récupère que les sessions publiques
      const { data } = await axios.get('http://localhost:3000/api/sessions/search', { params });
      setResults(data);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  // Recherche d'une session privée par code
  const handlePrivateJoin = async (e) => {
    e.preventDefault();
    setPrivateError('');
    setPrivateSession(null);
    setPrivateLoading(true);
    try {
      // À adapter selon ton backend, ici on suppose une route dédiée
      const { data } = await axios.get(`http://localhost:3000/api/sessions/private/${privateCode}`);
      setPrivateSession(data);
    } catch {
      setPrivateError("Aucune session privée trouvée avec ce code.");
    }
    setPrivateLoading(false);
  };

  function renderSession(session) {
    return (
      <li className="recherche-list-item" key={session.id}>
        <div className="recherche-list-main">
          <span className="recherche-list-title">
            <i className="fas fa-book"></i> {session.titre}
          </span>
          <span className="recherche-list-date">
            <i className="fas fa-calendar-alt"></i>
            {new Date(session.date_heure).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
            &nbsp;à&nbsp;
            {new Date(session.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="recherche-list-details">
          <span className="recherche-list-module">
            <i className="fas fa-layer-group"></i> {session.Module?.nom}
          </span>
          <span className="recherche-list-lieu">
            <i className="fas fa-map-marker-alt"></i> {session.en_ligne ? session.lien_en_ligne || 'En ligne' : session.lieu || session.salle || 'Non précisé'}
          </span>
          <span className="recherche-list-participants">
            <i className="fas fa-users"></i>
            {session.participants ? session.participants.length : 0}
            /
            {session.max_participants ?? '-'} participants
          </span>
          {session.createur && (
            <span className="recherche-list-createur">
              <i className="fas fa-user"></i>
              {session.createur.prenom} {session.createur.nom}
            </span>
          )}
        </div>
      </li>
    );
  }

  return (
    <div className="recherche-container">
      <div className="recherche-header">
        <h2>
          <i className="fas fa-search"></i> Recherche de sessions publiques
        </h2>
        <p>Filtrez et trouvez rapidement une session de travail, de révision ou de projet.</p>
      </div>
      <form onSubmit={handleSearch} className="recherche-form">
        <input
          type="text"
          placeholder="Titre, créateur, matière..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="recherche-input"
        />
        <select
          value={filtre.en_ligne}
          onChange={e => setFiltre(f => ({ ...f, en_ligne: e.target.value }))}
          className="recherche-select"
        >
          <option value="">Tous formats</option>
          <option value="1">En ligne</option>
          <option value="0">Présentiel</option>
        </select>
        <input
          type="date"
          value={filtre.date}
          onChange={e => setFiltre(f => ({ ...f, date: e.target.value }))}
          className="recherche-input"
        />
        <button type="submit" className="recherche-btn" disabled={loading}>
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </form>
      <ul className="recherche-list">
        {results.length === 0 && !loading && (
          <p className="recherche-empty">Aucune session publique trouvée.</p>
        )}
        {results.map(renderSession)}
      </ul>

      <div className="recherche-header" style={{ marginTop: 40 }}>
        <h2>
          <i className="fas fa-lock"></i> Rejoindre une session privée
        </h2>
        <p>Entrez le code d'accès fourni par l'organisateur.</p>
      </div>
      <form onSubmit={handlePrivateJoin} className="recherche-form">
        <input
          type="text"
          placeholder="Code d'accès de la session privée"
          value={privateCode}
          onChange={e => setPrivateCode(e.target.value)}
          className="recherche-input"
        />
        <button type="submit" className="recherche-btn" disabled={privateLoading || !privateCode}>
          {privateLoading ? "Recherche..." : "Rejoindre"}
        </button>
      </form>
      {privateError && <p className="recherche-empty">{privateError}</p>}
      {privateSession && (
        <div className="recherche-list-item" style={{ borderLeft: '4px solid #1976d2', marginTop: 10 }}>
          <div className="recherche-list-main">
            <span className="recherche-list-title">
              <i className="fas fa-book"></i> {privateSession.titre}
            </span>
            <span className="recherche-list-date">
              <i className="fas fa-calendar-alt"></i>
              {new Date(privateSession.date_heure).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
              &nbsp;à&nbsp;
              {new Date(privateSession.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="recherche-list-details">
            <span className="recherche-list-module">
              <i className="fas fa-layer-group"></i> {privateSession.Module?.nom}
            </span>
            <span className="recherche-list-lieu">
              <i className="fas fa-map-marker-alt"></i> {privateSession.en_ligne ? privateSession.lien_en_ligne || 'En ligne' : privateSession.lieu || privateSession.salle || 'Non précisé'}
            </span>
            <span className="recherche-list-participants">
              <i className="fas fa-users"></i>
              {privateSession.participants ? privateSession.participants.length : 0}
              /
              {privateSession.max_participants ?? '-'} participants
            </span>
            {privateSession.createur && (
              <span className="recherche-list-createur">
                <i className="fas fa-user"></i>
                {privateSession.createur.prenom} {privateSession.createur.nom}
              </span>
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <button className="recherche-btn" disabled>
              Rejoindre (à implémenter)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}