import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Accueil.css';

export default function Accueil({ user }) {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [participations, setParticipations] = useState([]);

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

  const now = new Date();

  // Sessions créées par l'utilisateur et à venir
  const sessionsCreees = sessions.filter(
    s => s.createurId === user.id && new Date(s.date_heure) > now
  );

  // Sessions où je participe (hors celles que j'ai créées), à venir
  const sessionsParticipe = participations.filter(
    s => s.createurId !== user.id && new Date(s.date_heure) > now
  );

  // Fusionne les deux listes pour "mes sessions à venir"
  const mesSessionsAVenir = [...sessionsCreees, ...sessionsParticipe];

  // Sessions publiques à venir, non créées par l'utilisateur et où je ne participe pas déjà
  const autresSessionsPubliques = sessions.filter(
    s =>
      s.confidentialite === 'publique' &&
      s.createurId !== user.id &&
      !mesSessionsAVenir.some(ms => ms.id === s.id) &&
      new Date(s.date_heure) > now
  );

  // Fonction utilitaire pour afficher une session
  function renderSession(session, showCreateur = false) {
    return (
      <li 
        className="accueil-list-item" 
        key={session.id}
        onClick={() => navigate(`/session/${session.id}`, { 
          state: { from: 'home' } // ✅ AJOUTÉ : indiquer la provenance
        })}
        style={{ cursor: 'pointer' }} // ✅ AJOUTÉ : indiquer que c'est cliquable
      >
        <div className="accueil-list-main">
          <span className="accueil-list-title">
            <i className="fas fa-book"></i> {session.titre}
          </span>
          <span className="accueil-list-date">
            <i className="fas fa-calendar-alt"></i>
            {new Date(session.date_heure).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
            &nbsp;à&nbsp;
            {new Date(session.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="accueil-list-details">
          <span className="accueil-list-module">
            <i className="fas fa-layer-group"></i> {session.Module?.nom}
          </span>
          <span className="accueil-list-lieu">
            <i className="fas fa-map-marker-alt"></i> {session.en_ligne ? session.lien_en_ligne || 'En ligne' : session.lieu || session.salle || 'Non précisé'}
          </span>
          <span className="accueil-list-participants">
            <i className="fas fa-users"></i>
            {session.participants ? session.participants.length : 0}
            /
            {session.max_participants ?? '-'} participants
          </span>
          {showCreateur && session.createur && (
            <span className="accueil-list-createur">
              <i className="fas fa-user"></i>
              {session.createurId === user.id
                ? ' Créé par moi'
                : ` Créé par ${session.createur.prenom} ${session.createur.nom}`}
            </span>
          )}
        </div>
      </li>
    );
  }

  return (
    <div className="accueil-container">
      <div className="accueil-header">
        <h2>Bienvenue {user.prenom} {user.nom} !</h2>
        <p>Vous êtes connecté.</p>
      </div>

      <section className="accueil-section">
        <h3>Mes sessions de travail à venir</h3>
        {mesSessionsAVenir.length === 0 ? (
          <p className="accueil-empty">Aucune session à venir.</p>
        ) : (
          <ul className="accueil-list">
            {mesSessionsAVenir.map(session =>
              renderSession(session, true)
            )}
          </ul>
        )}
      </section>

      <section className="accueil-section">
        <h3>Autres sessions publiques à venir</h3>
        {autresSessionsPubliques.length === 0 ? (
          <p className="accueil-empty">Aucune session publique à venir.</p>
        ) : (
          <ul className="accueil-list">
            {autresSessionsPubliques.map(session => renderSession(session, true))}
          </ul>
        )}
      </section>
    </div>
  );
}