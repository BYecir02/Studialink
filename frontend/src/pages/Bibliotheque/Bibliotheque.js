import React, { useState } from 'react';
import './Bibliotheque.css';

const ANNEES = ['Toutes', 'L1', 'L2', 'L3', 'M1', 'M2'];
const MODULES = ['Tous', 'Base de données', 'Algorithmique', 'Web', 'Maths'];
const TYPES = ['Tous', 'Cours', 'TD', 'TP', 'Annales', 'Fiche'];

const DOCS = [
  {
    id: 1,
    titre: "Introduction aux SGBD",
    auteur: "Prof. Martin",
    type: "Cours",
    module: "Base de données",
    annee: "L3",
    date: "2023-03-15",
    poids: "2.4 Mo",
    description: "Cours complet sur les SGBD relationnels. Concepts fondamentaux, SQL, normalisation.",
    downloads: 142,
    url: "#"
  },
  {
    id: 2,
    titre: "Exercices SQL Avancé",
    auteur: "Prof. Lefebvre",
    type: "TD",
    module: "Base de données",
    annee: "M1",
    date: "2023-04-10",
    poids: "1.1 Mo",
    description: "Série d'exercices pratiques sur les requêtes SQL avancées.",
    downloads: 98,
    url: "#"
  }
];

export default function Bibliotheque() {
  const [search, setSearch] = useState('');
  const [annee, setAnnee] = useState('Toutes');
  const [module, setModule] = useState('Tous');
  const [type, setType] = useState('Tous');

  const filteredDocs = DOCS.filter(doc =>
    (annee === 'Toutes' || doc.annee === annee) &&
    (module === 'Tous' || doc.module === module) &&
    (type === 'Tous' || doc.type === type) &&
    (
      doc.titre.toLowerCase().includes(search.toLowerCase()) ||
      doc.auteur.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="biblio-container">
      <div className="biblio-header">
        <h2><i className="fas fa-book"></i> Bibliothèque</h2>
        <p>Retrouve ici tous les documents et ressources partagés par la communauté.</p>
      </div>
      <div className="biblio-columns">
        {/* Colonne gauche : Filtres */}
        <aside className="biblio-filters">
            <form className="biblio-searchbar" onSubmit={e => e.preventDefault()}>
                <input
                type="text"
                placeholder="Rechercher un document, un auteur..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="biblio-search-input"
                />
                <button className="biblio-search-btn" type="submit">
                <i className="fas fa-search"></i>
                </button>
            </form>
          <div className="biblio-filter-group">
            <label>Année</label>
            <select value={annee} onChange={e => setAnnee(e.target.value)}>
              {ANNEES.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="biblio-filter-group">
            <label>Module</label>
            <select value={module} onChange={e => setModule(e.target.value)}>
              {MODULES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="biblio-filter-group">
            <label>Type</label>
            <select value={type} onChange={e => setType(e.target.value)}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </aside>
        {/* Colonne droite : Recherche + Liste */}
        <main className="biblio-main">

          <ul className="biblio-list">
            {filteredDocs.length === 0 && (
              <li className="biblio-empty">Aucun document trouvé.</li>
            )}
            {filteredDocs.map(doc => (
              <li className="biblio-list-item" key={doc.id}>
                <div className="biblio-list-main">
                  <span className="biblio-list-title">
                    <i className="fas fa-file-alt"></i> {doc.titre}
                  </span>
                  <span className="biblio-list-meta">
                    <i className="fas fa-user"></i> {doc.auteur} &nbsp;|&nbsp;
                    <i className="fas fa-book"></i> {doc.module} &nbsp;|&nbsp;
                    <i className="fas fa-layer-group"></i> {doc.annee}
                  </span>
                </div>
                <div className="biblio-list-details">
                  <span><i className="fas fa-calendar-alt"></i> {new Date(doc.date).toLocaleDateString('fr-FR')}</span>
                  <span><i className="fas fa-download"></i> {doc.downloads}</span>
                  <span><i className="fas fa-weight-hanging"></i> {doc.poids}</span>
                </div>
                <div className="biblio-list-desc">{doc.description}</div>
                <div className="biblio-list-actions">
                  <a href={doc.url} className="biblio-btn" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-download"></i> Télécharger
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}