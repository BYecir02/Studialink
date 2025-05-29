import React from 'react';

export default function Accueil({ user, onLogout }) {
  return (
    <div>
      <h2>Bienvenue {user.prenom} {user.nom} !</h2>
      <p>Vous êtes connecté.</p>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          type="button"
          style={{
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            padding: '0.7rem 1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={onLogout}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}