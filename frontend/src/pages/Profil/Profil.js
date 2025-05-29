import React from 'react';
import './Profil.css';

export default function Profil({ user }) {
  if (!user) return <div>Chargement...</div>;

  return (
    <div className="profil-container">
      <h2>Mon profil</h2>
      <div className="profil-card">
        <div className="profil-avatar">
          {/* Tu peux remplacer par une vraie photo si tu ajoutes le champ */}
          <span role="img" aria-label="avatar" style={{ fontSize: 64 }}>👤</span>
        </div>
        <div className="profil-info">
          <p><strong>Prénom :</strong> {user.prenom}</p>
          <p><strong>Nom :</strong> {user.nom}</p>
          <p><strong>Email :</strong> {user.email}</p>
          {/* Ajoute d'autres infos ici si besoin */}
        </div>
      </div>
    </div>
  );
}