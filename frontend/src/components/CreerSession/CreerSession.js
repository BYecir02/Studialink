import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreerSession.css';

export default function CreerSession({ user }) {
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    moduleId: '',
    date_heure: '',
    lieu: '',
    en_ligne: false,
    lien_en_ligne: '',
    salle: '',
    max_participants: '',
    confidentialite: '',
    code_acces: '',
    cree_le: new Date().toISOString(),
    createurId: user?.id || ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/modules')
      .then(res => setModules(res.data))
      .catch(() => setModules([]));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://localhost:3000/api/sessions', form);
      setMessage('Session créée avec succès !');
      setForm({
        ...form,
        titre: '',
        description: '',
        moduleId: '',
        date_heure: '',
        lieu: '',
        en_ligne: false,
        lien_en_ligne: '',
        salle: '',
        max_participants: '',
        confidentialite: '',
        code_acces: ''
      });
    } catch (err) {
      setMessage(err.response?.data?.error || 'Erreur lors de la création');
    }
  };

  return (
    <form className="creer-session-form" onSubmit={handleSubmit}>
      <h2>Créer une session de travail</h2>
      {message && <div className="creer-session-message">{message}</div>}
      <input
        name="titre"
        placeholder="Titre"
        value={form.titre}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <select
        name="moduleId"
        value={form.moduleId}
        onChange={handleChange}
        required
      >
        <option value="">Sélectionnez un module</option>
        {modules.map(m => (
          <option key={m.id} value={m.id}>{m.nom}</option>
        ))}
      </select>
      <input
        type="datetime-local"
        name="date_heure"
        value={form.date_heure}
        onChange={handleChange}
        required
      />
      <input
        name="lieu"
        placeholder="Lieu (facultatif)"
        value={form.lieu}
        onChange={handleChange}
      />
      <label>
        <input
          type="checkbox"
          name="en_ligne"
          checked={form.en_ligne}
          onChange={handleChange}
        />
        Session en ligne
      </label>
      {form.en_ligne && (
        <input
          name="lien_en_ligne"
          placeholder="Lien en ligne"
          value={form.lien_en_ligne}
          onChange={handleChange}
        />
      )}
      <input
        name="salle"
        placeholder="Salle (facultatif)"
        value={form.salle}
        onChange={handleChange}
      />
      <input
        type="number"
        name="max_participants"
        placeholder="Nombre max de participants"
        value={form.max_participants}
        onChange={handleChange}
      />
      <select
        name="confidentialite"
        value={form.confidentialite}
        onChange={handleChange}
      >
        <option value="">Confidentialité</option>
        <option value="publique">Publique</option>
        <option value="privee">Privée</option>
      </select>
      {form.confidentialite === 'privee' && (
        <input
          name="code_acces"
          placeholder="Code d'accès"
          value={form.code_acces}
          onChange={handleChange}
        />
      )}
      <button type="submit">Créer la session</button>
    </form>
  );
}