import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Login/LoginForm';
import RegisterForm from './components/Register/RegisterForm';
import Layout from './pages/Layout/Layout';
import Accueil from './pages/Accueil/Accueil';
import './assets/global.css';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (token, user) => {
    setToken(token);
    setUser(user);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <div>
        <h1 style={{
          textAlign: 'center',
          color: '#1976d2',
          letterSpacing: '2px',
          margin: '2rem 0 1rem 0',
          fontWeight: 700
        }}>
          STUDIALINK
        </h1>
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

  // Si connecté, affiche le layout avec la navbar et les pages
  return (
    <Router>
      <Routes>
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={<Accueil user={user} />} />
          {/* Ajoute ici d'autres routes/pages */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;