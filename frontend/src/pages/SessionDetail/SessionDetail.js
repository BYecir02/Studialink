import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './SessionDetail.css';

export default function SessionDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  // ✅ Nouvel état pour les images partagées
  const [sharedImages, setSharedImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  // ✅ État pour le modal d'image
  const [imageModal, setImageModal] = useState({ isOpen: false, src: '', alt: '' });

  useEffect(() => {
    axios.get(`http://localhost:3000/api/sessions/${id}`)
      .then(res => setSession(res.data))
      .catch(() => setSession(null));
  }, [id]);

  // ✅ Récupérer les images partagées dans cette session
  useEffect(() => {
    if (id) {
      setLoadingImages(true);
      axios.get(`http://localhost:3000/api/sessions/${id}/messages`)
        .then(res => {
          // Filtrer seulement les messages avec des images
          const images = res.data.filter(msg => 
            msg.hasAttachment && msg.attachmentType === 'image' && msg.imageUrl
          );
          setSharedImages(images);
          setLoadingImages(false);
        })
        .catch(error => {
          console.error('Erreur récupération images:', error);
          setSharedImages([]);
          setLoadingImages(false);
        });
    }
  }, [id]);

  // ✅ Fonctions pour gérer le modal d'image
  const openImageModal = (src, alt = 'Image partagée') => {
    setImageModal({ isOpen: true, src, alt });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, src: '', alt: '' });
  };

  // ✅ Fermer le modal avec Échap
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && imageModal.isOpen) {
        closeImageModal();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [imageModal.isOpen]);

  // ✅ Empêcher le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (imageModal.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [imageModal.isOpen]);

  if (!session) return <div>Chargement...</div>;

  // Exemples de fallback pour les données manquantes
  const participants = session.participants || [];
  const maxPlaces = session.max_participants || 10;
  const module = session.Module?.nom || 'Non précisé';
  const createur = session.createur || { prenom: 'Inconnu', nom: '' };

  // Gère le retour selon la provenance
  const handleBack = () => {
    if (location.state?.from === 'messages' && location.state?.sessionId) {
      navigate(`/messages?session=${location.state.sessionId}`);
    } else if (location.state?.from === 'profil') {
      navigate('/profil');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <button className="back-btn" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i> Retour
        </button>
        <div className="session-actions">
          {/* Affiche le bouton Modifier UNIQUEMENT si c'est le créateur */}
          {session.createurId === user.id && (
            <button className="action-btn" onClick={() => navigate(`/session/${session.id}/edit`)}>
              <i className="fas fa-edit"></i> Modifier
            </button>
          )}
          {/* Affiche le bouton Supprimer UNIQUEMENT si c'est le créateur */}
          {session.createurId === user.id && (
            <button
              className="action-btn danger"
              style={{ marginLeft: 8, color: '#e74c3c' }}
              onClick={async () => {
                if (window.confirm("Voulez-vous vraiment supprimer cette session ?")) {
                  try {
                    await axios.delete(`http://localhost:3000/api/sessions/${session.id}`);
                    navigate('/');
                  } catch (err) {
                    alert("Erreur lors de la suppression.");
                  }
                }
              }}
            >
              <i className="fas fa-trash"></i> Supprimer
            </button>
          )}
          <button className="action-btn primary">
            <i className="fas fa-share-alt"></i> Partager
          </button>
        </div>
      </div>

      {/* Session Header */}
      <div className="session-header">
        <h1>{session.titre}</h1>
      </div>

      <div className="session-container">
        {/* Colonne gauche : détails */}
        <div className="session-details">
          <div className="section-title">
            Détails de la session
            <button className="action-btn">
              <i className="fas fa-calendar-plus"></i> Ajouter à l'agenda
            </button>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-calendar-day"></i></div>
              <div className="info-content">
                <h3>Date</h3>
                <p>{new Date(session.date_heure).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-clock"></i></div>
              <div className="info-content">
                <h3>Heure</h3>
                <p>{new Date(session.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div className="info-content">
                <h3>Lieu</h3>
                <p>{session.en_ligne ? (session.lien_en_ligne || 'En ligne') : (session.lieu || session.salle || 'Non précisé')}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-users"></i></div>
              <div className="info-content">
                <h3>Participants</h3>
                <p>{participants.length}/{maxPlaces} places</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-book"></i></div>
              <div className="info-content">
                <h3>Matière</h3>
                <p>{module}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><i className="fas fa-user-tie"></i></div>
              <div className="info-content">
                <h3>Organisateur</h3>
                <p>{createur.prenom} {createur.nom}</p>
              </div>
            </div>
          </div>

          <div className="section-title">Description</div>
          <div className="description-box">
            <p>{session.description || "Aucune description pour cette session."}</p>
          </div>

          {/* ✅ Images partagées remplaçant les ressources */}
          <div className="resources-container">
            <div className="section-title">
              Images partagées
              <span className="images-count">
                {sharedImages.length} image{sharedImages.length > 1 ? 's' : ''}
              </span>
            </div>
            
            {loadingImages ? (
              <div className="loading-images">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Chargement des images...</span>
              </div>
            ) : sharedImages.length === 0 ? (
              <div className="no-images">
                <i className="fas fa-images"></i>
                <h4>Aucune image partagée</h4>
                <p>Les images partagées dans les discussions apparaîtront ici.</p>
                <button 
                  className="action-btn primary"
                  onClick={() => navigate(`/messages?session=${session.id}`)}
                >
                  <i className="fas fa-comments"></i>
                  Rejoindre la discussion
                </button>
              </div>
            ) : (
              <div className="images-grid">
                {sharedImages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className="image-card"
                    onClick={() => openImageModal(`http://localhost:3000${message.imageUrl}`, `Image ${index + 1}`)}
                  >
                    <div className="image-thumbnail">
                      {/* eslint-disable-next-line */}
                      <img 
                        src={`http://localhost:3000${message.imageUrl}`} 
                        alt={`Image partagée ${index + 1}`}
                        loading="lazy"
                      />
                      <div className="image-overlay">
                        <i className="fas fa-search-plus"></i>
                      </div>
                    </div>
                    <div className="image-info">
                      <div className="image-meta">
                        <span className="image-author">
                          <i className="fas fa-user"></i>
                          {message.utilisateur?.prenom} {message.utilisateur?.nom}
                        </span>
                        <span className="image-date">
                          <i className="fas fa-calendar"></i>
                          {new Date(message.date_envoi).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {message.contenu && message.contenu !== '[Image]' && (
                        <div className="image-caption">
                          {message.contenu}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite : participants */}
        <div className="participants-container">
          <div className="section-title">
            Participants
            <span>{participants.length}/{maxPlaces}</span>
          </div>
          <div className="participant-list">
            {participants.map((p, idx) => (
              <div className="participant-item" key={p.id || idx}>
                <img
                  src={p.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${p.prenom || ''}%20${p.nom || ''}`}
                  alt={p.prenom}
                  className="participant-avatar"
                />
                <div className="participant-info">
                  <h3>{p.prenom} {p.nom}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Modal d'aperçu d'image */}
      {imageModal.isOpen && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-container">
            <button 
              className="image-modal-close"
              onClick={closeImageModal}
              title="Fermer (Échap)"
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <img 
                src={imageModal.src} 
                alt={imageModal.alt}
                className="image-modal-img"
              />
              
              <div className="image-modal-actions">
                <button 
                  className="image-modal-action"
                  onClick={() => window.open(imageModal.src, '_blank')}
                  title="Ouvrir dans un nouvel onglet"
                >
                  <i className="fas fa-external-link-alt"></i>
                  Ouvrir
                </button>
                
                <button 
                  className="image-modal-action"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = imageModal.src;
                    link.download = 'image.jpg';
                    link.click();
                  }}
                  title="Télécharger l'image"
                >
                  <i className="fas fa-download"></i>
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}