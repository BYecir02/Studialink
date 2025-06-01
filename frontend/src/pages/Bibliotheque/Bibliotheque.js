import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Bibliotheque.css';

export default function Bibliotheque() {
  const [search, setSearch] = useState('');
  const [annee, setAnnee] = useState('');
  const [module, setModule] = useState('');
  const [type, setType] = useState('');
  const [anneeProduction, setAnneeProduction] = useState('');
  const [ressources, setRessources] = useState([]);
  const [modules, setModules] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [anneesProduction, setAnneesProduction] = useState([]);
  const [types] = useState(['Cours', 'TD', 'TP', 'Annales', 'Fiche']);
  
  // ✅ États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [ressourcesPerPage] = useState(8); // 8 ressources par page
  
  const navigate = useNavigate();

  // Charger modules, années et années de production pour les filtres
  useEffect(() => {
    axios.get('http://localhost:3000/api/modules')
      .then(res => setModules(res.data))
      .catch(() => setModules([]));
    axios.get('http://localhost:3000/api/annees')
      .then(res => setAnnees(res.data))
      .catch(() => setAnnees([]));
    
    // Récupérer les années de production disponibles
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
    if (anneeProduction) params.anneeProduction = anneeProduction;
    
    axios.get('http://localhost:3000/api/ressources', { params })
      .then(res => {
        setRessources(res.data);
        // ✅ Remettre à la première page quand les filtres changent
        setCurrentPage(1);
      })
      .catch(() => setRessources([]));
  }, [annee, module, type, search, anneeProduction]);

  // ✅ Logique de pagination
  const indexOfLastRessource = currentPage * ressourcesPerPage;
  const indexOfFirstRessource = indexOfLastRessource - ressourcesPerPage;
  const currentRessources = ressources.slice(indexOfFirstRessource, indexOfLastRessource);
  const totalPages = Math.ceil(ressources.length / ressourcesPerPage);

  // ✅ Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          {/* Nouveau filtre année de production */}
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
          {/* ✅ Informations de pagination en haut */}
          {ressources.length > 0 && (
            <div className="biblio-results-info">
              <span className="results-count">
                {ressources.length} document{ressources.length > 1 ? 's' : ''} trouvé{ressources.length > 1 ? 's' : ''}
              </span>
              {totalPages > 1 && (
                <span className="pagination-info-top">
                  Page {currentPage} sur {totalPages}
                </span>
              )}
            </div>
          )}

          <ul className="biblio-list">
            {currentRessources.length === 0 && ressources.length === 0 && (
              <li className="biblio-empty">Aucun document trouvé.</li>
            )}
            {currentRessources.length === 0 && ressources.length > 0 && (
              <li className="biblio-empty">Aucun document sur cette page.</li>
            )}
            {currentRessources.map(doc => (
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

          {/* ✅ Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Affichage de {indexOfFirstRessource + 1} à {Math.min(indexOfLastRessource, ressources.length)} sur {ressources.length} documents
              </div>
              <div className="pagination">
                {/* Bouton Précédent */}
                <button 
                  className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {/* Numéros de pages avec logique d'affichage intelligente */}
                {(() => {
                  const pages = [];
                  const maxVisiblePages = 5;
                  
                  if (totalPages <= maxVisiblePages) {
                    // Afficher toutes les pages si peu de pages
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Logique d'affichage avec "..."
                    if (currentPage <= 3) {
                      // Au début
                      for (let i = 1; i <= 4; i++) pages.push(i);
                      pages.push('...');
                      pages.push(totalPages);
                    } else if (currentPage >= totalPages - 2) {
                      // À la fin
                      pages.push(1);
                      pages.push('...');
                      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
                    } else {
                      // Au milieu
                      pages.push(1);
                      pages.push('...');
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                      pages.push('...');
                      pages.push(totalPages);
                    }
                  }

                  return pages.map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                    ) : (
                      <button
                        key={page}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => paginate(page)}
                      >
                        {page}
                      </button>
                    )
                  ));
                })()}

                {/* Bouton Suivant */}
                <button 
                  className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}