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
  const [sessionsCreees, setSessionsCreees] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [mesRessources, setMesRessources] = useState([]);
  const [modules, setModules] = useState([]);
  const [annees, setAnnees] = useState([]);
  const navigate = useNavigate();

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette session ?")) {
      try {
        await axios.delete(`http://localhost:3000/api/sessions/${sessionId}`);
        setSessionsCreees(sessionsCreees.filter(s => s.id !== sessionId));
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleDeleteRessource = async (ressourceId) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce document ?")) {
      try {
        await axios.delete(`http://localhost:3000/api/ressources/${ressourceId}`);
        setMesRessources(mesRessources.filter(r => r.id !== ressourceId));
      } catch (err) {
        alert("Erreur lors de la suppression du document.");
      }
    }
  };

  useEffect(() => {
    if (user) {
      // 1. Sessions créées par l'utilisateur
      axios.get('http://localhost:3000/api/sessions')
        .then(res => setSessionsCreees(res.data.filter(s => s.createurId === user.id)))
        .catch(() => setSessionsCreees([]));
      // 2. Sessions où l'utilisateur est participant
      axios.get(`http://localhost:3000/api/utilisateurs/${user.id}/sessions`)
        .then(res => setParticipations(res.data))
        .catch(() => setParticipations([]));
      axios.get('http://localhost:3000/api/ressources', { params: { uploadeurId: user.id } })
        .then(res => setMesRessources(res.data))
        .catch(() => setMesRessources([]));
      axios.get('http://localhost:3000/api/modules')
        .then(res => setModules(res.data))
        .catch(() => setModules([]));
      axios.get('http://localhost:3000/api/annees')
        .then(res => setAnnees(res.data))
        .catch(() => setAnnees([]));
    }
  }, [user]);

  // Fusionne sans doublons (par id)
  const mesSessions = [
    ...sessionsCreees,
    ...participations.filter(
      sp => !sessionsCreees.some(sc => sc.id === sp.id)
    )
  ];

  const nbSessionsTotal = mesSessions.length;
  const nbSessionsCreees = sessionsCreees.length;

  const getModuleNom = id => modules.find(m => m.id === Number(id))?.nom || id;
  const getAnneeNom = id => annees.find(a => a.id === Number(id))?.nom || id;

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

        <div className="section-title">Modules suivies</div>
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

        {/* Section : Mes documents postés */}
        <div className="section-title" style={{marginTop: 32}}>Mes documents partagées</div>
        {mesRessources.length === 0 ? (
          <p>Aucun document posté.</p>
        ) : (
          <ul className="biblio-list">
            {mesRessources.map(doc => (
              <li className="biblio-list-item" key={doc.id}>
                <div className="biblio-list-main">
                  <span className="biblio-list-title">
                    <span style={{marginRight: 8, fontWeight: 600}}>{doc.type}</span>
                    {doc.titre}
                  </span>
                  <span className="biblio-list-meta">
                    <i className="fas fa-book"></i> {getModuleNom(doc.moduleId)} &nbsp;|&nbsp;
                    <i className="fas fa-layer-group"></i> {getAnneeNom(doc.anneeId)}
                  </span>
                </div>
                <div className="biblio-list-details">
                  <span>
                    <i className="fas fa-calendar-alt"></i> Posté le : {doc.date_upload ? new Date(doc.date_upload).toLocaleDateString('fr-FR') : ''}
                  </span>
                  <span>
                    <i className="fas fa-calendar"></i> Année de production : {doc.annee_production || '-'}
                  </span>
                  <span>
                    <i className="fas fa-weight-hanging"></i> {doc.fichier ? doc.fichier.split('-').slice(1).join('-') : ''}
                  </span>
                </div>
                <div className="biblio-list-desc">{doc.description}</div>
                <div className="biblio-list-actions">
                  {doc.fichier && (
                    <a href={`http://localhost:3000/api/ressources/${doc.id}/download`} className="biblio-btn" target="_blank" rel="noopener noreferrer">
                      <i className="fas fa-download"></i> Télécharger
                    </a>
                  )}
                  <button
                    className="biblio-btn danger"
                    style={{marginLeft: 8}}
                    onClick={() => handleDeleteRessource(doc.id)}
                  >
                    <i className="fas fa-trash"></i> Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}