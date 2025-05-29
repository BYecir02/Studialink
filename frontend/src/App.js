import React, { useState } from 'react';
import LoginForm from './components/Login/LoginForm';
import RegisterForm from './components/Register/RegisterForm';
import './assets/global.css';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (token, user) => {
    setToken(token);
    setUser(user);
  };

  if (token) {
    return (
      <div>
        <h2>Bienvenue {user.prenom} {user.nom} !</h2>
        <p>Vous êtes connecté.</p>
      </div>
    );
  }

  return (
    <div>
      {!showRegister ? (
        <>
          <LoginForm onLogin={handleLogin} />
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span>Vous n'avez pas de compte ? </span>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit'
              }}
              onClick={() => setShowRegister(true)}
            >
              Inscrivez-vous
            </button>
          </div>
        </>
      ) : (
        <>
          <RegisterForm />
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span>Déjà un compte ? </span>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit'
              }}
              onClick={() => setShowRegister(false)}
            >
              Connectez-vous
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;