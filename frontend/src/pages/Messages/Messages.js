import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './Message.css';

const socket = io('http://localhost:3000', {
  withCredentials: true
});

export default function Messages({ user }) {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // ✅ État pour l'image sélectionnée
  const [imagePreview, setImagePreview] = useState(null); // ✅ Aperçu de l'image
  const [imageModal, setImageModal] = useState({ isOpen: false, src: '', alt: '' });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // ✅ Référence pour l'input file
  const navigate = useNavigate();
  const location = useLocation();

    // ✅ Fonctions pour gérer le modal d'image
  const openImageModal = (src, alt = 'Image') => {
    setImageModal({ isOpen: true, src, alt });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, src: '', alt: '' });
  };

  // ✅ Fermer le modal avec la touche Échap
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && imageModal.isOpen) {
        closeImageModal();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [imageModal.isOpen]);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Gestion de la sélection d'image
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image.');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB.');
        return;
      }

      setSelectedImage(file);
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Annuler la sélection d'image
  const cancelImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ✅ Envoyer une image
const sendImage = async () => {
  if (!selectedImage || !selectedSession) return;

  const formData = new FormData();
  formData.append('image', selectedImage);
  formData.append('sessionTravailId', selectedSession);
  formData.append('expediteurId', user.id);
  formData.append('contenu', newMessage); // ✅ Ajouter le texte saisi

  // Message temporaire
  const tempMessage = {
    id: `temp-image-${Date.now()}`,
    contenu: newMessage, // ✅ Afficher le texte
    hasAttachment: true,
    attachmentType: 'image',
    utilisateur: { id: user.id, prenom: user.prenom, nom: user.nom },
    createdAt: new Date().toISOString(),
    sending: true,
    imagePreview: imagePreview
  };

  setMessages(prev => [...prev, tempMessage]);
  setNewMessage(''); // ✅ Vider le champ texte
  cancelImageSelection();

    try {
      // Envoyer l'image au backend
      const response = await axios.post(
        `http://localhost:3000/api/sessions/${selectedSession}/messages/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Remplacer le message temporaire par le message final
      const finalMessage = {
        ...response.data,
        content: response.data.contenu,
        utilisateur: response.data.utilisateur,
        createdAt: response.data.date_envoi,
        sending: false,
        type: 'image',
        imageUrl: response.data.imageUrl
      };

      setMessages(prev => prev.map(m =>
        m.id === tempMessage.id ? finalMessage : m
      ));

      // Émettre via Socket.IO pour les autres utilisateurs
      socket.emit('sendMessage', finalMessage);

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'image:', error);
      // Supprimer le message temporaire en cas d'erreur
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      alert('Erreur lors de l\'envoi de l\'image.');
    }
  };

  // Charger les sessions où l'utilisateur participe
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:3000/api/utilisateurs/${user.id}/toutes-sessions`)
        .then(res => {
          const sessionsTriees = res.data.sort((a, b) =>
            new Date(b.date_heure) - new Date(a.date_heure)
          );
          setSessions(sessionsTriees);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  // Ouvre la session si paramètre dans l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session');
    if (sessionId) {
      loadSessionMessages(Number(sessionId));
      setShowChat(true);
    }
    // eslint-disable-next-line
  }, [location.search, sessions.length]);

  // Charger les messages d'une session
  const loadSessionMessages = (sessionId) => {
    setSelectedSession(sessionId);
    setShowChat(true);

    axios.get(`http://localhost:3000/api/sessions/${sessionId}/messages`)
      .then(res => {
        const messagesAdapted = res.data.map(msg => ({
          ...msg,
          content: msg.contenu,
          createdAt: msg.date_envoi
        }));
        setMessages(messagesAdapted);
      })
      .catch(() => {
        setMessages([]);
      });
  };

  // Socket.IO : écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!selectedSession) return;
    const handleReceiveMessage = (message) => {
      if (message.sessionTravailId === selectedSession) {
        setMessages(prev => [...prev, {
          ...message,
          content: message.contenu,
          utilisateur: message.utilisateur || { id: message.expediteurId, prenom: '', nom: '' },
          createdAt: message.date_envoi
        }]);
      }
    };
    socket.on('receiveMessage', handleReceiveMessage);
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [selectedSession]);

  // Retour à la liste des conversations
  const backToConversations = () => {
    setShowChat(false);
    setSelectedSession(null);
    cancelImageSelection(); // ✅ Nettoyer la sélection d'image
  };

  // Envoi d'un message texte (modifié)
  const sendMessage = (e) => {
    e.preventDefault();
    
    // Si une image est sélectionnée, envoyer l'image
    if (selectedImage) {
      sendImage();
      return;
    }
    
    if (!newMessage.trim() || !selectedSession) return;

    const messageData = {
      contenu: newMessage,
      sessionTravailId: selectedSession,
      expediteurId: user.id,
      date_envoi: new Date().toISOString()
    };

    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: newMessage,
      utilisateur: { id: user.id, prenom: user.prenom, nom: user.nom },
      createdAt: new Date().toISOString(),
      sending: true,
      sessionId: selectedSession
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    socket.emit('sendMessage', messageData);

    axios.post(`http://localhost:3000/api/sessions/${selectedSession}/messages`, messageData)
      .then(res => {
        const msg = {
          ...res.data,
          content: res.data.contenu,
          utilisateur: res.data.utilisateur,
          createdAt: res.data.date_envoi,
          sending: false
        };
        setMessages(prev => prev.map(m =>
          m.id === tempMessage.id ? msg : m
        ));
      })
      .catch(() => {
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      });
  };

  // Gestion de la frappe
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  // Gestion de l'envoi avec Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  if (loading) return <div className="messages-loading">Chargement...</div>;

  const currentSession = sessions.find(s => s.id === selectedSession);

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2><i className="fas fa-comments"></i> Discussions de Sessions</h2>
        <p>Communiquez avec les participants de vos sessions de révision</p>
      </div>

      <div className="messages-layout">
        {/* Sidebar des sessions */}
        <div className={`conversations-sidebar ${showChat ? 'mobile-hidden' : ''}`}>
          <div className="conversations-header">
            <h3>Mes Sessions</h3>
            <button 
              className="btn-new-conversation"
              onClick={() => navigate('/creer-session')}
              title="Créer une nouvelle session"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          
          <div className="conversations-list">
            {sessions.length === 0 ? (
              <div className="no-conversations">
                <i className="fas fa-users"></i>
                <p>Aucune session</p>
                <button 
                  className="btn-create-session"
                  onClick={() => navigate('/creer-session')}
                >
                  Créer ma première session
                </button>
              </div>
            ) : (
              sessions.map(session => (
                <div
                  key={session.id}
                  className={`conversation-item ${selectedSession === session.id ? 'active' : ''}`}
                  onClick={() => loadSessionMessages(session.id)}
                >
                  <div className="conversation-avatar session-avatar">
                    <i className="fas fa-users"></i>
                  </div>
                  
                  <div className="conversation-info">
                    <div className="conversation-name">
                      {session.titre}
                    </div>
                    <div className="conversation-last-message">
                      {session.lastMessage || 'Aucun message'}
                    </div>
                  </div>
                  
                  <div className="session-actions">
                    <button 
                      className="session-detail-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/session/${session.id}`, { state: { from: 'messages' } });
                      }}
                      title="Voir les détails"
                    >
                      <i className="fas fa-info-circle"></i>
                    </button>
                    {session.unreadCount > 0 && (
                      <div className="conversation-unread">
                        {session.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Zone de chat */}
        <div className={`chat-area ${showChat ? 'mobile-visible' : ''}`}>
          {!selectedSession ? (
            <div className="no-conversation-selected">
              <i className="fas fa-comments"></i>
              <h3>Sélectionnez une session</h3>
              <p>Choisissez une session pour commencer à discuter avec les participants</p>
            </div>
          ) : (
            <>
              {/* En-tête du chat */}
              <div className="chat-header">
                <button 
                  className="mobile-back-btn"
                  onClick={backToConversations}
                  title="Retour aux conversations"
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
                
                <div className="chat-session-info">
                  <div className="chat-contact">
                    <i className="fas fa-users chat-icon"></i>
                    {currentSession?.titre}
                  </div>
                  <div className="chat-session-meta">
                    <span>
                      <i className="fas fa-calendar"></i>
                      {currentSession ? new Date(currentSession.date_heure).toLocaleDateString('fr-FR') : ''}
                    </span>
                    <span>
                      <i className="fas fa-map-marker-alt"></i>
                      {currentSession
                        ? (currentSession.en_ligne
                          ? 'En ligne'
                          : currentSession.lieu || 'Lieu non précisé')
                        : ''}
                    </span>
                    <span className="participants-count">
                      <i className="fas fa-user-friends"></i>
                      {currentSession?.participants?.length || 0} participants
                    </span>
                  </div>
                </div>
                <div className="chat-actions">
                  <button 
                    className="chat-action-btn"
                    onClick={() => currentSession && navigate(`/session/${currentSession.id}`, { state: { from: 'messages', sessionId: currentSession.id } })}
                    title="Voir les détails de la session"
                  >
                    <i className="fas fa-external-link-alt"></i>
                  </button>
                  <button 
                    className="chat-action-btn"
                    title="Options du chat"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>

              {/* Zone des messages */}
              <div className="messages-area">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <i className="fas fa-comment-dots"></i>
                    <h4>Aucun message pour le moment</h4>
                    <p>Soyez le premier à envoyer un message dans cette session !</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`message ${message.utilisateur.id === user.id ? 'sent' : 'received'} ${message.sending ? 'sending' : ''}`}
                      >
                        {message.utilisateur.id !== user.id && (
                          <div className="message-author">
                            <span className="author-name">
                              {message.utilisateur.prenom} {message.utilisateur.nom}
                            </span>
                          </div>
                        )}
                        <div className="message-content">
                          {/* ✅ Afficher le texte s'il existe */}
                          {message.contenu && message.contenu.trim() && (
                            <div className="message-text">
                              {message.contenu}
                            </div>
                          )}
                          
                          {/* ✅ Afficher l'image si elle existe */}
                          {message.hasAttachment && message.attachmentType === 'image' && (
                            <div className="message-image">
                              {message.sending && message.imagePreview ? (
                                <img 
                                  src={message.imagePreview} 
                                  alt="En cours d'envoi" 
                                  className="chat-image sending-image"
                                />
                              ) : message.imageUrl ? (
                                <img 
                                  src={`http://localhost:3000${message.imageUrl}`} 
                                  alt="Contenu partagé" 
                                  className="chat-image"
                                  // ✅ Ouvrir le modal au lieu d'ouvrir dans un nouvel onglet
                                  onClick={() => openImageModal(`http://localhost:3000${message.imageUrl}`, 'Image partagée')}
                                />
                              ) : null}
                            </div>
                          )}
                          
                          {/* ✅ Autres types de fichiers */}
                          {message.hasAttachment && message.attachmentType !== 'image' && (
                            <div className="message-file">
                              <a 
                                href={`http://localhost:3000${message.fileUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="file-link"
                              >
                                <i className="fas fa-file"></i>
                                Pièce jointe
                              </a>
                            </div>
                          )}
                          
                          {message.sending && (
                            <div className="message-sending-indicator">
                              <i className="fas fa-clock"></i>
                            </div>
                          )}
                        </div>
                        <div className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
                
                {/* Indicateur de frappe */}
                {isTyping && (
                  <div className="typing-indicator">
                    <span>Vous êtes en train d'écrire...</span>
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ Aperçu de l'image sélectionnée */}
              {imagePreview && (
                <div className="image-preview-container">
                  <div className="image-preview">
                    <img src={imagePreview} alt="Aperçu" className="preview-image" />
                    <div className="preview-actions">
                      <button 
                        className="preview-btn cancel"
                        onClick={cancelImageSelection}
                        title="Annuler"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                      <button 
                        className="preview-btn send"
                        onClick={sendImage}
                        title="Envoyer l'image"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ Formulaire de message modifié */}
              <div className="message-container-form">
                <form className="message-input-form" onSubmit={sendMessage}>
                  {/* ✅ Bouton pour sélectionner une image */}
                  <button 
                    type="button"
                    className="image-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Envoyer une image"
                  >
                    <i className="fas fa-image"></i>
                  </button>
                  
                  {/* ✅ Input file caché */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                  />
                  
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedImage ? "Image sélectionnée - cliquez sur Envoyer" : "Tapez votre message pour la session..."}
                    className="message-input"
                    autoComplete="off"
                    disabled={!!selectedImage} // ✅ Désactiver si image sélectionnée
                  />
                  <button 
                    type="submit" 
                    className="send-btn" 
                    disabled={!newMessage.trim() && !selectedImage}
                    title={selectedImage ? "Envoyer l'image" : "Envoyer le message"}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </>
          )}
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