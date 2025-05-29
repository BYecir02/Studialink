import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <span className="navbar-title">
        STUDIALINK
      </span>
      <div className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
        >
          Accueil
        </NavLink>
        <NavLink
          to="/creer"
          className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
        >
          Créer
        </NavLink>
        <NavLink
          to="/rechercher"
          className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
        >
          Rechercher
        </NavLink>
        <NavLink
          to="/bibliotheque"
          className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
        >
          Bibliothèque
        </NavLink>
        <NavLink
          to="/profil"
          className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
        >
          Profil
        </NavLink>
        {user && (
          <button onClick={onLogout} className="navbar-logout">
            Déconnexion
          </button>
        )}
      </div>
    </nav>
  );
}