import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdHome,
  MdAddCircleOutline,
  MdSearch,
  MdLibraryBooks,
  MdPerson,
  MdMessage,
  MdNotifications,
  MdLogout
} from 'react-icons/md';
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
          title="Accueil"
        >
          <MdHome size={27} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <span className="navbar-link-text">Accueil</span>
        </NavLink>
        <NavLink
          to="/creer-session"
          className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
          title="Créer"
        >
          <MdAddCircleOutline size={27} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <span className="navbar-link-text">Créer</span>
        </NavLink>
        <NavLink
          to="/recherche"
          className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
          title="Rechercher"
        >
          <MdSearch size={27} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <span className="navbar-link-text">Rechercher</span>
        </NavLink>
        <NavLink
          to="/bibliotheque"
          className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
          title="Bibliothèque"
        >
          <MdLibraryBooks size={27} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <span className="navbar-link-text">Bibliothèque</span>
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
          title="Messages"
        >
          <MdMessage size={27} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <span className="navbar-link-text">Messages</span>
        </NavLink>
        <NavLink
          to="/notifications"
          className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
          title="Notifications"
        >
          <MdNotifications size={27} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <span className="navbar-link-text">Notifications</span>
        </NavLink>
        <NavLink
          to="/profil"
          className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
          title="Profil"
        >
          <MdPerson size={27} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <span className="navbar-link-text">Profil</span>
        </NavLink>
        {user && (
          <button onClick={onLogout} className="navbar-logout" title="Déconnexion">
            <MdLogout size={27} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            <span className="navbar-link-text">Déconnexion</span>
          </button>
        )}
      </div>
    </nav>
  );
}