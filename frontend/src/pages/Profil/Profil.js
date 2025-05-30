import React from 'react';
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
  if (!user) return <div>Chargement...</div>;

  return (
    <div className="profil-pro-container">
      <div className="profil-pro-card">
        <div className="profil-pro-avatar">
          <span role="img" aria-label="avatar" style={{ fontSize: 90 }}>👤</span>
        </div>
        <div className="profil-pro-info">
          <h2>{user.prenom} {user.nom}</h2>
          <p className="profil-pro-email">{user.email}</p>
          <div className="profil-pro-tags">
            <span className="profil-pro-tag profil-pro-type">{user.filiere?.type || ''}</span>
            <span className="profil-pro-tag">{user.filiere?.nom || 'Filière inconnue'}</span>
          </div>
        </div>
      </div>
      <div className="profil-pro-details">
        <div>
          <strong>Date d’inscription :</strong> {formatDate(user.date_inscription)}
        </div>
      </div>
      <div className="profil-pro-actions">
        <button>Modifier mon profil</button>
        <button>Changer le mot de passe</button>
      </div>
    </div>
  );
}