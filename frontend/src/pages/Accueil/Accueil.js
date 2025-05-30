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
      <h2>Bienvenue {user.prenom} {user.nom} !</h2>
      <p>Vous êtes connecté.</p>

      <section style={{ marginTop: '2rem', textAlign: 'left' }}>
        <h3>Mes sessions de travail à venir</h3>
        {mesSessionsAVenir.length === 0 ? (
          <p>Aucune session à venir.</p>
        ) : (
          <ul>
            {mesSessionsAVenir.map(session => (
              <li key={session.id} style={{ marginBottom: '1rem' }}>
                <strong>{session.titre}</strong> — {session.Module?.nom}
                <br />
                <span>
                  {new Date(session.date_heure).toLocaleString('fr-FR', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </span>
                <br />
                <span>
                  Lieu : {session.en_ligne ? session.lien_en_ligne || 'En ligne' : session.lieu || session.salle || 'Non précisé'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: '2rem', textAlign: 'left' }}>
        <h3>Autres sessions publiques à venir</h3>
        {autresSessionsPubliques.length === 0 ? (
          <p>Aucune session publique à venir.</p>
        ) : (
          <ul>
            {autresSessionsPubliques.map(session => (
              <li key={session.id} style={{ marginBottom: '1rem' }}>
                <strong>{session.titre}</strong> — {session.Module?.nom}
                <br />
                <span>
                  {new Date(session.date_heure).toLocaleString('fr-FR', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </span>
                <br />
                <span>
                  Lieu : {session.en_ligne ? session.lien_en_ligne || 'En ligne' : session.lieu || session.salle || 'Non précisé'}
                </span>
                <br />
                <span style={{ fontSize: '0.95em', color: '#555' }}>
                  Proposée par : {session.createur?.prenom} {session.createur?.nom}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}