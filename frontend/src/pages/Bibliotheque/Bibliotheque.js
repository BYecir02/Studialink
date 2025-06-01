import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Bibliotheque.css';

export default function Bibliotheque() {
  const [search, setSearch] = useState('');
  const [annee, setAnnee] = useState('');
  const [module, setModule] = useState('');
  const [type, setType] = useState('');
  const [anneeProduction, setAnneeProduction] = useState(''); // ✅ Nouveau state
  const [ressources, setRessources] = useState([]);
  const [modules, setModules] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [anneesProduction, setAnneesProduction] = useState([]); // ✅ Nouveau state
  const [types] = useState(['Cours', 'TD', 'TP', 'Annales', 'Fiche']);
  const navigate = useNavigate();

  // Charger modules, années et années de production pour les filtres
  useEffect(() => {
    axios.get('http://localhost:3000/api/modules')
      .then(res => setModules(res.data))
      .catch(() => setModules([]));
    axios.get('http://localhost:3000/api/annees')
      .then(res => setAnnees(res.data))
      .catch(() => setAnnees([]));
    
    // ✅ Récupérer les années de production disponibles
    axios.get('http://localhost:3000/api/ressources/annees-production')
      .then(res => setAnneesProduction(res.data))
      .catch(() => {
        // Si l'endpoint n'existe pas encore, générer les années récentes
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= currentYear - 10; i--) {
          years.push(i);
        }
        setAnneesProduction(years);
      });
  }, []);

  // Charger les ressources selon les filtres
  useEffect(() => {
    const params = {};
    if (annee) params.annee = annee;
    if (module) params.module = module;
    if (type) params.type = type;
    if (search) params.search = search;
    if (anneeProduction) params.anneeProduction = anneeProduction; // ✅ Nouveau paramètre
    
    axios.get('http://localhost:3000/api/ressources', { params })
      .then(res => setRessources(res.data))
      .catch(() => setRessources([]));
  }, [annee, module, type, search, anneeProduction]); // ✅ Ajouter anneeProduction

  // Pour afficher le nom du module/année à partir de l'id
  const getModuleNom = id => modules.find(m => m.id === Number(id))?.nom || id;
  const getAnneeNom = id => annees.find(a => a.id === Number(id))?.nom || id;

  return (
    <div className="biblio-container">
      <div className="biblio-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h2><i className="fas fa-book"></i> Bibliothèque</h2>
          <p>Retrouve ici tous les documents et ressources partagés par la communauté.</p>
        </div>
        <button className="biblio-btn" onClick={() => navigate('/ajouter-ressource')}>
          <i className="fas fa-plus"></i> Ajouter une ressource
        </button>
      </div>
      <div className="biblio-columns">
        <aside className="biblio-filters">
          <form className="biblio-searchbar" onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="biblio-search-input"
            />
            <button className="biblio-search-btn" type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>
          <div className="biblio-filter-group">
            <label>Année d'études</label>
            <select value={annee} onChange={e => setAnnee(e.target.value)}>
              <option value="">Toutes</option>
              {annees.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
            </select>
          </div>
          <div className="biblio-filter-group">
            <label>Module</label>
            <select value={module} onChange={e => setModule(e.target.value)}>
              <option value="">Tous</option>
              {modules.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
            </select>
          </div>
          <div className="biblio-filter-group">
            <label>Type</label>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="">Tous</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {/* ✅ Nouveau filtre année de production */}
          <div className="biblio-filter-group">
            <label>Année de production</label>
            <select value={anneeProduction} onChange={e => setAnneeProduction(e.target.value)}>
              <option value="">Toutes</option>
              {anneesProduction.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </aside>
        
        <main className="biblio-main">
          <ul className="biblio-list">
            {ressources.length === 0 && (
              <li className="biblio-empty">Aucun document trouvé.</li>
            )}
            {ressources.map(doc => (
              <li className="biblio-list-item" key={doc.id}>
                <div className="biblio-list-main">
                  <span className="biblio-list-title">
                    <span style={{marginRight: 8, fontWeight: 600}}>{doc.type}</span>
                    {doc.titre}
                  </span>
                  <span className="biblio-list-meta">
                    <i className="fas fa-book"></i> {getModuleNom(doc.moduleId)} &nbsp;|&nbsp;
                    <i className="fas fa-layer-group"></i> {getAnneeNom(doc.anneeId)}
                  </span>
                </div>
                <div className="biblio-list-details">
                  <span>
                    <i className="fas fa-calendar-alt"></i> Posté le : {doc.date_upload ? new Date(doc.date_upload).toLocaleDateString('fr-FR') : ''}
                  </span>
                  <span>
                    <i className="fas fa-calendar"></i> Année de production : {doc.annee_production || '-'}
                  </span>
                  <span>
                    <i className="fas fa-weight-hanging"></i> {doc.fichier ? doc.fichier.split('-').slice(1).join('-') : ''}
                  </span>
                </div>
                <div className="biblio-list-desc">{doc.description}</div>
                <div className="biblio-list-actions">
                  {doc.fichier && (
                    <a href={`http://localhost:3000/api/ressources/${doc.id}/download`} className="biblio-btn" target="_blank" rel="noopener noreferrer">
                      <i className="fas fa-download"></i> Télécharger
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}