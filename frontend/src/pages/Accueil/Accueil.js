import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Accueil.css';
import Calendar from '../../components/Calendar/Calendar';

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

  // Toutes les sessions pour le composant Calendar
  const allSessions = [...mesSessionsAVenir, ...autresSessionsPubliques];

  return (
    <div className="accueil-container">
      <div className="accueil-header">
        <h2>Bienvenue {user.prenom} {user.nom} !</h2>
        <p>Découvrez et organisez vos sessions d'étude collaboratives.</p>
      </div>

      {/* ✅ Remplacé par le composant Calendar */}
      <Calendar
        sessions={allSessions}
        user={user}
        context="home"
        showFilters={true}
        defaultView="list"
        onSessionClick={(session) => {
          navigate(`/session/${session.id}`, { 
            state: { from: 'home' } 
          });
        }}
      />
    </div>
  );
}