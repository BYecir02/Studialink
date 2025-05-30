import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Accueil.css';

export default function Accueil({ user }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:3000/api/sessions')
        .then(res => setSessions(res.data))
        .catch(() => setSessions([]));
    }
  }, [user]);

  const now = new Date();

  // Sessions créées par l'utilisateur et à venir
  const mesSessionsAVenir = sessions.filter(
    s => s.createurId === user.id && new Date(s.date_heure) > now
  );

  // Sessions publiques à venir, non créées par l'utilisateur
  const autresSessionsPubliques = sessions.filter(
    s =>
      s.confidentialite === 'publique' &&
      s.createurId !== user.id &&
      new Date(s.date_heure) > now
  );

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
            {mesSessionsAVenir.map(session => (
              <li className="accueil-list-item" key={session.id}>
                <span className="accueil-list-date">
                  <i className="fas fa-calendar-alt"></i>
                  {new Date(session.date_heure).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  &nbsp;à&nbsp;
                  {new Date(session.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="accueil-list-title">
                  <i className="fas fa-book"></i> {session.titre}
                </span>
                <span className="accueil-list-module">
                  <i className="fas fa-layer-group"></i> {session.Module?.nom}
                </span>
                <span className="accueil-list-lieu">
                  <i className="fas fa-map-marker-alt"></i> {session.en_ligne ? session.lien_en_ligne || 'En ligne' : session.lieu || session.salle || 'Non précisé'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="accueil-section">
        <h3>Autres sessions publiques à venir</h3>
        {autresSessionsPubliques.length === 0 ? (
          <p className="accueil-empty">Aucune session publique à venir.</p>
        ) : (
          <ul className="accueil-list">
            {autresSessionsPubliques.map(session => (
              <li className="accueil-list-item" key={session.id}>
                <span className="accueil-list-date">
                  <i className="fas fa-calendar-alt"></i>
                  {new Date(session.date_heure).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  &nbsp;à&nbsp;
                  {new Date(session.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="accueil-list-title">
                  <i className="fas fa-book"></i> {session.titre}
                </span>
                <span className="accueil-list-module">
                  <i className="fas fa-layer-group"></i> {session.Module?.nom}
                </span>
                <span className="accueil-list-lieu">
                  <i className="fas fa-map-marker-alt"></i> {session.en_ligne ? session.lien_en_ligne || 'En ligne' : session.lieu || session.salle || 'Non précisé'}
                </span>
                <span className="accueil-list-createur">
                  <i className="fas fa-user"></i> Proposé par {session.createur?.prenom} {session.createur?.nom}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}