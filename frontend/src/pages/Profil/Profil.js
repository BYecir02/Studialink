import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:3000/api/sessions')
        .then(res => setSessions(res.data))
        .catch(() => setSessions([]));
    }
  }, [user]);

  const mesSessions = sessions.filter(s => s.createurId === user.id);

  // Statistiques fictives, à remplacer par des vraies si besoin
  const nbDocs = 12;
  const nbAmis = 7;

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="profil-layout">
      <div className="profil-card">
        <div className="profil-picture">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.prenom}%20${user.nom}`} alt="Profil" />
          <div className="profil-edit-picture" title="Changer la photo">
            <i className="fas fa-camera"></i>
          </div>
        </div>
        <h2>{user.prenom} {user.nom}</h2>
        <p>{user.filiere?.nom || 'Filière inconnue'}</p>
        <div className="profil-stats">
          <div className="stat-item">
            <div className="stat-value">{mesSessions.length}</div>
            <div className="stat-label">Sessions</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{nbDocs}</div>
            <div className="stat-label">Documents</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{nbAmis}</div>
            <div className="stat-label">Amis</div>
          </div>
        </div>
        <button className="btn-edit-profile">
          <i className="fas fa-edit"></i> Modifier le Profil
        </button>
      </div>

      <div className="profil-info">
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
          {/* À remplacer par les vraies matières si tu les as */}
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
                <div className="session-card" key={session.id}>
                  <div className="session-date">
                    <span className="session-day">{new Date(session.date_heure).getDate()}</span>
                    <span className="session-month">{new Date(session.date_heure).toLocaleString('fr-FR', { month: 'short' })}</span>
                  </div>
                  <div className="session-info">
                    <h3>{session.titre}</h3>
                    <div className="session-meta">
                      <span><i className="fas fa-clock"></i> {new Date(session.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span><i className="fas fa-map-marker-alt"></i> {session.en_ligne ? session.lien_en_ligne || 'En ligne' : session.lieu || session.salle || 'Non précisé'}</span>
                    </div>
                  </div>
                  <div className="session-actions">
                    <div className="session-btn" title="Détails">
                      <i className="fas fa-info-circle"></i>
                    </div>
                    <div className="session-btn primary" title="Chat">
                      <i className="fas fa-comments"></i>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}