import React from 'react';

export default function Navbar({ user, onLogout }) {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#1976d2',
      color: '#fff',
      padding: '1rem 2rem'
    }}>
      <span style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '2px' }}>
        STUDIALINK
      </span>
      <div>
        {user && (
          <>
            <span style={{ marginRight: '1rem' }}>{user.prenom} {user.nom}</span>
            <button onClick={onLogout} style={{
              background: '#fff',
              color: '#1976d2',
              border: 'none',
              borderRadius: '5px',
              padding: '0.5rem 1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
}