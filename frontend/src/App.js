import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Login/LoginForm';
import RegisterForm from './components/Register/RegisterForm';
import Layout from './pages/Layout/Layout';
import Accueil from './pages/Accueil/Accueil';
import Profil from './pages/Profil/Profil';
import CreerSession from './components/CreerSession/CreerSession';
import SessionDetail from './pages/SessionDetail/SessionDetail';
import EditionSession from './pages/EditionSession/EditionSession';
import Recherche from './pages/Recherche/Recherche';
import './assets/global.css';

function App() {
  // On initialise le token et le user depuis le localStorage pour rester connecté après refresh
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [showRegister, setShowRegister] = useState(false);

  // Si le token change, on le stocke dans le localStorage (utile si tu fais une déconnexion ailleurs)
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogin = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
          <Route index element={<Accueil user={user} />} />
          <Route path="profil" element={<Profil user={user} />} />
          <Route path="creer-session" element={<CreerSession user={user} />} />
          <Route path="session/:id" element={<SessionDetail user={user} />} />
          <Route path="session/:id/edit" element={<EditionSession user={user} />} />
          <Route path="recherche" element={<Recherche user={user} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;