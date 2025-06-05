import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Calendar from '../../components/Calendar/Calendar'; // ✅ Import du composant Calendar
import './Profil.css';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function Profil({ user }) {
  const [sessionsCreees, setSessionsCreees] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [mesRessources, setMesRessources] = useState([]);
  const [modules, setModules] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [modulesSuivis, setModulesSuivis] = useState([]);
  
  // ✅ États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [ressourcesPerPage] = useState(5); // 5 ressources par page
  
  const navigate = useNavigate();

  // ✅ Gestionnaire de suppression pour Calendar
  const handleSessionDeleted = (sessionId) => {
    setSessionsCreees(prev => prev.filter(s => s.id !== sessionId));
    setParticipations(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleDeleteRessource = async (ressourceId) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce document ?")) {
      try {
        await axios.delete(`http://localhost:3000/api/ressources/${ressourceId}`);
        setMesRessources(mesRessources.filter(r => r.id !== ressourceId));
        // ✅ Ajuster la page courante si nécessaire
        const newTotal = mesRessources.length - 1;
        const maxPage = Math.ceil(newTotal / ressourcesPerPage);
        if (currentPage > maxPage && maxPage > 0) {
          setCurrentPage(maxPage);
        }
      } catch (err) {
        alert("Erreur lors de la suppression du document.");
      }
    }
  };

  useEffect(() => {
    if (user) {
      // 1. Sessions créées par l'utilisateur
      axios.get('http://localhost:3000/api/sessions')
        .then(res => setSessionsCreees(res.data.filter(s => s.createurId === user.id)))
        .catch(() => setSessionsCreees([]));
      // 2. Sessions où l'utilisateur est participant
      axios.get(`http://localhost:3000/api/utilisateurs/${user.id}/sessions`)
        .then(res => setParticipations(res.data))
        .catch(() => setParticipations([]));
      // 3. Ressources partagées par l'utilisateur connecté (filtrage côté front)
      axios.get('http://localhost:3000/api/ressources')
        .then(res => setMesRessources(res.data.filter(r => r.uploadeurId === user.id)))
        .catch(() => setMesRessources([]));
      axios.get('http://localhost:3000/api/modules')
        .then(res => setModules(res.data))
        .catch(() => setModules([]));
      axios.get('http://localhost:3000/api/annees')
        .then(res => setAnnees(res.data))
        .catch(() => setAnnees([]));
      axios.get(`http://localhost:3000/api/utilisateurs/${user.id}/modules-suivis`)
        .then(res => setModulesSuivis(res.data))
        .catch(() => setModulesSuivis([]));
    }
  }, [user]);

  // ✅ Logique de pagination
  const indexOfLastRessource = currentPage * ressourcesPerPage;
  const indexOfFirstRessource = indexOfLastRessource - ressourcesPerPage;
  const currentRessources = mesRessources.slice(indexOfFirstRessource, indexOfLastRessource);
  const totalPages = Math.ceil(mesRessources.length / ressourcesPerPage);

  // ✅ Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ✅ Fusionne toutes les sessions pour le Calendar
  const mesSessions = [
    ...sessionsCreees,
    ...participations.filter(
      sp => !sessionsCreees.some(sc => sc.id === sp.id)
    )
  ];

  const nbSessionsTotal = mesSessions.length;
  const nbSessionsCreees = sessionsCreees.length;

  const getModuleNom = id => modules.find(m => m.id === Number(id))?.nom || id;
  const getAnneeNom = id => annees.find(a => a.id === Number(a))?.nom || id;

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="profile-container">
      {/* Colonne gauche : carte profil */}
      <div className="profile-card">
        <div className="profile-picture">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.prenom}%20${user.nom}`} alt="Profil" />
          <div className="edit-picture" title="Changer la photo">
            <i className="fas fa-camera"></i>
          </div>
        </div>
        <h2>{user.prenom} {user.nom}</h2>
        <p>{user.filiere?.nom || 'Filière inconnue'}</p>
        <div className="info-item">
          <div className="info-icon"><i className="fas fa-calendar"></i></div>
          <div className="info-content">
            <h3>Année actuelle</h3>
            <p>{user.annee?.nom || 'Non renseignée'}</p>
          </div>
        </div>
        <div className="info-item">
          <div className="info-icon"><i className="fas fa-info"></i></div>
          <div className="info-content">
            <h3>Description</h3>
            <p>{user.description || 'Non renseignée'}</p>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-value">{nbSessionsTotal}</div>
            <div className="stat-label">Participations</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{nbSessionsCreees}</div>
            <div className="stat-label">Sessions créées</div>
          </div>
          {/* ✅ Nouvelle stat pour les ressources */}
          <div className="stat-item">
            <div className="stat-value">{mesRessources.length}</div>
            <div className="stat-label">Documents partagés</div>
          </div>
        </div>
        <button className="btn-edit-profile" onClick={() => navigate('/profil/edit')}>
          <i className="fas fa-edit"></i> Modifier le Profil
        </button>
        <button
          className="btn-edit-profile" style={{ marginTop: 10 }} onClick={() => navigate('/profil/parametres')}
        >
          <i className="fas fa-cog"></i> Paramètres
        </button>
      </div>

      {/* Colonne droite : infos et sessions */}
      <div className="profile-info">
        <div className="section-title">
          Informations Personnelles
        </div>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon"><i className="fas fa-envelope"></i></div>
            <div className="info-content">
              <h3>Email</h3>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon"><i className="fas fa-graduation-cap"></i></div>
            <div className="info-content">
              <h3>Filière</h3>
              <p>{user.filiere?.nom || 'Non renseignée'}</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon"><i className="fas fa-layer-group"></i></div>
            <div className="info-content">
              <h3>Type</h3>
              <p>{user.filiere?.type || 'Non renseigné'}</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon"><i className="fas fa-calendar"></i></div>
            <div className="info-content">
              <h3>Membre depuis</h3>
              <p>{formatDate(user.date_inscription)}</p>
            </div>
          </div>
        </div>

        <div className="section-title">Modules suivis</div>
        <div className="tags-container">
          {modulesSuivis.length === 0 ? (
            <span className="tag">Aucun module suivi</span>
          ) : (
            modulesSuivis.map(m => (
              <span className="tag" key={m.id}>{m.nom}</span>
            ))
          )}
        </div>

        {/* ✅ REMPLACEMENT : Composant Calendar au lieu de la liste manuelle */}
        <div className="section-title">Mes sessions à venir</div>
        <Calendar
          sessions={mesSessions}
          user={user}
          context="profile"
          showFilters={false}
          defaultView="list"
          onSessionDeleted={handleSessionDeleted}
          onSessionClick={(session) => {
            navigate(`/session/${session.id}`, { 
              state: { from: 'profile' } 
            });
          }}
          className="profile-calendar"
        />

        {/* ✅ Section : Mes documents postés avec pagination */}
        <div className="section-title" style={{marginTop: 32}}>
          Mes documents partagés 
          {mesRessources.length > 0 && (
            <span className="section-count">({mesRessources.length})</span>
          )}
        </div>
        {mesRessources.length === 0 ? (
          <p>Aucun document partagé.</p>
        ) : (
          <>
            <ul className="biblio-list">
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
                    <button
                      className="biblio-btn danger"
                      style={{marginLeft: 8}}
                      onClick={() => handleDeleteRessource(doc.id)}
                    >
                      <i className="fas fa-trash"></i> Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Affichage de {indexOfFirstRessource + 1} à {Math.min(indexOfLastRessource, mesRessources.length)} sur {mesRessources.length} documents
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

                  {/* Numéros de pages */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                        onClick={() => paginate(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

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
          </>
        )}
      </div>
    </div>
  );
}