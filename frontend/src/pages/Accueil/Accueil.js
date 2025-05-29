import React from 'react';
import './Accueil.css';

export default function Accueil({ user }) {
  return (
    <div className="accueil-container">
      <h2>Bienvenue {user.prenom} {user.nom} !</h2>
      <p>Vous êtes connecté.</p>
      {/* Contenu principal de la page d'accueil */}
    </div>
  );
}