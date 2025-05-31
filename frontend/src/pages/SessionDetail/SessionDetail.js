import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SessionDetail.css';

export default function SessionDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/sessions/${id}`)
      .then(res => setSession(res.data))
      .catch(() => setSession(null));
  }, [id]);

  if (!session) return <div>Chargement...</div>;

  // Exemples de fallback pour les données manquantes
  const participants = session.participants || [];
  const maxPlaces = session.max_participants || 10;
  const module = session.Module?.nom || 'Non précisé';
  const createur = session.createur || { prenom: 'Inconnu', nom: '' };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Retour au profil
        </button>
        <div className="session-actions">
          <button className="action-btn" onClick={() => navigate(`/session/${session.id}/edit`)}>
            <i className="fas fa-edit"></i> Modifier
          </button>
          {session.createurId === user.id && (
            <>
              <button
                className="action-btn danger"
                style={{ marginLeft: 8, color: '#e74c3c' }}
                onClick={async () => {
                  if (window.confirm("Voulez-vous vraiment supprimer cette session ?")) {
                    try {
                      await axios.delete(`http://localhost:3000/api/sessions/${session.id}`);
                      navigate('/'); // Redirige vers l'accueil après suppression
                    } catch (err) {
                      alert("Erreur lors de la suppression.");
                    }
                  }
                }}
              >
                <i className="fas fa-trash"></i> Supprimer
              </button>
            </>
          )}
          <button className="action-btn primary">
            <i className="fas fa-share-alt"></i> Partager
          </button>
        </div>
      </div>

      {/* Session Header */}
      <div className="session-header">
        <h1>{session.titre}</h1>
      </div>

      <div className="session-container">
        {/* Colonne gauche : détails */}
        <div className="session-details">
          <div className="section-title">
            Détails de la session
            <button className="action-btn">
              <i className="fas fa-calendar-plus"></i> Ajouter à l'agenda
            </button>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-calendar-day"></i></div>
              <div className="info-content">
                <h3>Date</h3>
                <p>{new Date(session.date_heure).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-clock"></i></div>
              <div className="info-content">
                <h3>Heure</h3>
                <p>{new Date(session.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div className="info-content">
                <h3>Lieu</h3>
                <p>{session.en_ligne ? (session.lien_en_ligne || 'En ligne') : (session.lieu || session.salle || 'Non précisé')}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-users"></i></div>
              <div className="info-content">
                <h3>Participants</h3>
                <p>{participants.length}/{maxPlaces} places</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-book"></i></div>
              <div className="info-content">
                <h3>Matière</h3>
                <p>{module}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-user-tie"></i></div>
              <div className="info-content">
                <h3>Organisateur</h3>
                <p>{createur.prenom} {createur.nom}</p>
              </div>
            </div>
          </div>

          <div className="section-title">Description</div>
          <div className="description-box">
            <p>{session.description || "Aucune description pour cette session."}</p>
          </div>

          {/* Ressources partagées (exemple statique) */}
          <div className="resources-container">
            <div className="section-title">
              Ressources partagées
              <button className="action-btn primary">
                <i className="fas fa-plus"></i> Ajouter
              </button>
            </div>
            <div className="resource-list">
              {/* Exemple de ressource */}
              <div className="resource-item">
                <div className="resource-icon">
                  <i className="fas fa-file-pdf"></i>
                </div>
                <div className="resource-info">
                  <h3>Notes de cours - Algorithmes Avancés</h3>
                  <div className="resource-meta">
                    <span><i className="fas fa-user"></i> Marie Dubois</span>
                    <span><i className="fas fa-calendar"></i> 10 Juin 2023</span>
                    <span><i className="fas fa-weight-hanging"></i> 2.4 Mo</span>
                  </div>
                </div>
                <div className="resource-actions">
                  <div className="resource-btn">
                    <i className="fas fa-eye"></i>
                  </div>
                  <div className="resource-btn primary">
                    <i className="fas fa-download"></i>
                  </div>
                </div>
              </div>
              {/* Ajoute d'autres ressources dynamiquement si tu veux */}
            </div>
          </div>

          {/* Chat (exemple statique) */}
          <div className="chat-container">
            <div className="section-title">Discussion de session</div>
            <div className="chat-messages">
              <div className="message received">
                <div className="message-header">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Thomas" className="message-avatar" />
                  <h3>Thomas Martin</h3>
                  <span className="message-time">14:20</span>
                </div>
                <div className="message-content">
                  Bonjour à tous ! Est-ce que quelqu'un a des exercices supplémentaires sur les arbres AVL ?
                </div>
              </div>
              {/* ...autres messages statiques ou dynamiques... */}
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Écrire un message..." />
              <button type="submit">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Colonne droite : participants */}
        <div className="participants-container">
          <div className="section-title">
            Participants
            <span>{participants.length}/{maxPlaces}</span>
          </div>
          <div className="participant-list">
            {participants.map((p, idx) => (
              <div className="participant-item" key={p.id || idx}>
                <img
                  src={p.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${p.prenom || ''}%20${p.nom || ''}`}
                  alt={p.prenom}
                  className="participant-avatar"
                />
                <div className="participant-info">
                  <h3>{p.prenom} {p.nom}</h3>
                  <p>{p.role || 'Participant'}</p>
                </div>
                <div className="participant-actions">
                  <div className="participant-btn">
                    <i className="fas fa-comment-dots"></i>
                  </div>
                  <div className="participant-btn">
                    <i className="fas fa-user-plus"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}