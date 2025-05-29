import React from 'react';

export default function Accueil({ user }) {
  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', textAlign: 'center' }}>
      <h2>Bienvenue {user.prenom} {user.nom} !</h2>
      <p>Vous êtes connecté.</p>
      {/* Contenu principal de la page d'accueil */}
    </div>
  );
}