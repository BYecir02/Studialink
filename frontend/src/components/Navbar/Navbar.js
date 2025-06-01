import React, { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <span className="navbar-title">
          STUDIALINK
        </span>

        {/* Menu hamburger pour mobile */}
        <div 
          className={`hamburger-menu ${mobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
        >
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </div>

        {/* Navigation desktop */}
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

      {/* Overlay pour fermer le menu */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay show" 
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Menu mobile */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-menu-title">STUDIALINK</div>
        </div>
        
        <div className="mobile-menu-links">
          <NavLink
            to="/"
            className={({ isActive }) => "mobile-menu-link" + (isActive ? " active" : "")}
            onClick={closeMobileMenu}
          >
            <MdHome size={24} style={{ marginRight: 12 }} />
            Accueil
          </NavLink>
          <NavLink
            to="/creer-session"
            className={({ isActive }) => "mobile-menu-link" + (isActive ? " active" : "")}
            onClick={closeMobileMenu}
          >
            <MdAddCircleOutline size={24} style={{ marginRight: 12 }} />
            Créer
          </NavLink>
          <NavLink
            to="/recherche"
            className={({ isActive }) => "mobile-menu-link" + (isActive ? " active" : "")}
            onClick={closeMobileMenu}
          >
            <MdSearch size={24} style={{ marginRight: 12 }} />
            Rechercher
          </NavLink>
          <NavLink
            to="/bibliotheque"
            className={({ isActive }) => "mobile-menu-link" + (isActive ? " active" : "")}
            onClick={closeMobileMenu}
          >
            <MdLibraryBooks size={24} style={{ marginRight: 12 }} />
            Bibliothèque
          </NavLink>
          <NavLink
            to="/messages"
            className={({ isActive }) => "mobile-menu-link" + (isActive ? " active" : "")}
            onClick={closeMobileMenu}
          >
            <MdMessage size={24} style={{ marginRight: 12 }} />
            Messages
          </NavLink>
          <NavLink
            to="/notifications"
            className={({ isActive }) => "mobile-menu-link" + (isActive ? " active" : "")}
            onClick={closeMobileMenu}
          >
            <MdNotifications size={24} style={{ marginRight: 12 }} />
            Notifications
          </NavLink>
          <NavLink
            to="/profil"
            className={({ isActive }) => "mobile-menu-link" + (isActive ? " active" : "")}
            onClick={closeMobileMenu}
          >
            <MdPerson size={24} style={{ marginRight: 12 }} />
            Profil
          </NavLink>
        </div>

        {user && (
          <button 
            onClick={() => {
              onLogout();
              closeMobileMenu();
            }} 
            className="mobile-logout"
          >
            <MdLogout size={24} style={{ marginRight: 12 }} />
            Déconnexion
          </button>
        )}
      </div>
    </>
  );
}