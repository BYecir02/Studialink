import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profil.css';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function Profil({ user }) {
  const [sessions, setSessions] = useState([]);
  const [participations, setParticipations] = useState([]);
  const navigate = useNavigate();

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette session ?")) {
      try {
        await axios.delete(`http://localhost:3000/api/sessions/${sessionId}`);
        setSessions(sessions.filter(s => s.id !== sessionId));
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:3000/api/sessions')
        .then(res => setSessions(res.data))
        .catch(() => setSessions([]));
      axios.get(`http://localhost:3000/api/utilisateurs/${user.id}/sessions`)
        .then(res => setParticipations(res.data))
        .catch(() => setParticipations([]));
    }
  }, [user]);

  // Sessions créées par l'utilisateur
  const sessionsCreees = sessions.filter(s => s.createurId === user.id);

  // Sessions où l'utilisateur est participant (hors celles qu'il a créées)
  const sessionsParticipe = participations.filter(
    s => s.createurId !== user.id
  );

  // Fusionne et retire les doublons (si besoin)
  const mesSessions = [...sessionsCreees, ...sessionsParticipe];

  // Statistiques réelles
  const nbSessionsTotal = mesSessions.length;
  const nbSessionsCreees = sessionsCreees.length;

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="profile-container">
      {/* Colonne gauche : carte profil */}
      <div className="profile-card">
        <div className="profile-picture">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.prenom}%20${user.nom}`} alt="Profil" />
          <div className="edit-picture" title="Changer la photo">
            <i className="fas fa-camera"></i>
          </div>
        </div>
        <h2>{user.prenom} {user.nom}</h2>
        <p>{user.filiere?.nom || 'Filière inconnue'}</p>
        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-value">{nbSessionsTotal}</div>
            <div className="stat-label">Participations</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{nbSessionsCreees}</div>
            <div className="stat-label">Sessions créées</div>
          </div>
        </div>
        <button className="btn-edit-profile">
          <i className="fas fa-edit"></i> Modifier le Profil
        </button>
      </div>

      {/* Colonne droite : infos et sessions */}
      <div className="profile-info">
        <div className="section-title">
          Informations Personnelles
        </div>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon"><i className="fas fa-envelope"></i></div>
            <div className="info-content">
              <h3>Email</h3>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon"><i className="fas fa-graduation-cap"></i></div>
            <div className="info-content">
              <h3>Filière</h3>
              <p>{user.filiere?.nom || 'Non renseignée'}</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon"><i className="fas fa-layer-group"></i></div>
            <div className="info-content">
              <h3>Type</h3>
              <p>{user.filiere?.type || 'Non renseigné'}</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon"><i className="fas fa-calendar"></i></div>
            <div className="info-content">
              <h3>Membre depuis</h3>
              <p>{formatDate(user.date_inscription)}</p>
            </div>
          </div>
        </div>

        <div className="section-title">Matières suivies</div>
        <div className="tags-container">
          <span className="tag">Algorithmique</span>
          <span className="tag">Base de données</span>
          <span className="tag">Développement Web</span>
        </div>

        <div className="sessions-container">
          <div className="section-title">Mes prochaines sessions</div>
          {mesSessions.length === 0 ? (
            <p>Aucune session créée.</p>
          ) : (
            mesSessions
              .filter(s => new Date(s.date_heure) > new Date())
              .sort((a, b) => new Date(a.date_heure) - new Date(b.date_heure))
              .map(session => (
                <div
                  className="session-card"
                  key={session.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/session/${session.id}`)}
                  title="Voir le détail de la session"
                >
                  <div className="session-date">
                    <span className="session-day">{new Date(session.date_heure).getDate()}</span>
                    <span className="session-month">{new Date(session.date_heure).toLocaleString('fr-FR', { month: 'short' })}</span>
                  </div>
                  <div className="session-info">
                    <h3>{session.titre}</h3>
                    <div className="session-meta">
                      <span>
                        <i className="fas fa-clock"></i>
                        {new Date(session.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>
                        <i className="fas fa-map-marker-alt"></i>
                        {session.en_ligne ? session.lien_en_ligne || 'En ligne' : session.lieu || session.salle || 'Non précisé'}
                      </span>
                    </div>
                  </div>
                  <div className="session-actions">
                    <div className="session-btn" title="Détails" onClick={e => { e.stopPropagation(); navigate(`/session/${session.id}`); }}>
                      <i className="fas fa-info-circle"></i>
                    </div>
                    <div className="session-btn primary" title="Chat" onClick={e => { e.stopPropagation(); navigate(`/session/${session.id}/chat`); }}>
                      <i className="fas fa-comments"></i>
                    </div>
                    {session.createurId === user.id && (
                      <>
                        <div
                          className="session-btn"
                          title="Modifier"
                          onClick={e => { e.stopPropagation(); navigate(`/session/${session.id}/edit`); }}
                        >
                          <i className="fas fa-edit"></i>
                        </div>
                        <div
                          className="session-btn danger"
                          title="Supprimer"
                          style={{ color: '#e74c3c' }}
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}