import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: '', mot_de_passe: '', prenom: '', nom: '', filiereId: ''
  });
  const [filieres, setFilieres] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/filieres')
      .then(res => setFilieres(res.data))
      .catch(() => setFilieres([]));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:3000/api/auth/register', form);
      setSuccess('Inscription réussie ! Vous pouvez vous connecter.');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inscription</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      {success && <div style={{color:'green'}}>{success}</div>}
      <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required />
      <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="mot_de_passe" type="password" placeholder="Mot de passe" value={form.mot_de_passe} onChange={handleChange} required />
      <select name="filiereId" value={form.filiereId} onChange={handleChange} required>
        <option value="">Sélectionnez une filière</option>
        {filieres.map(f => (
          <option key={f.id} value={f.id}>{f.nom} ({f.type})</option>
        ))}
      </select>
      <button type="submit">S'inscrire</button>
    </form>
  );
}