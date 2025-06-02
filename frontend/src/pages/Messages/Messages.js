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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [imageModal, setImageModal] = useState({ isOpen: false, src: '', alt: '' });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fonctions pour gérer le modal d'image
  const openImageModal = (src, alt = 'Image') => {
    setImageModal({ isOpen: true, src, alt });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, src: '', alt: '' });
  };

  // Fermer le modal avec la touche Échap
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

  // Gestion de la sélection d'image
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image.');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB.');
        return;
      }

      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestion de la sélection de document
  const handleDocumentSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Le document ne doit pas dépasser 10MB.');
        return;
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('Type de fichier non autorisé. Formats acceptés : PDF, Word, Excel, PowerPoint, TXT');
        return;
      }

      setSelectedFile(file);
      
      setFilePreview({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: getFileType(file.type)
      });
    }
  };

  // Fonction pour obtenir le type de fichier
  const getFileType = (mimeType) => {
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Word';
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'Excel';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PowerPoint';
    if (mimeType.includes('text')) return 'Texte';
    return 'Document';
  };

  // Annuler toutes les sélections
  const cancelAllSelections = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  // Annuler la sélection d'image
  const cancelImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Annuler la sélection de document
  const cancelFileSelection = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  // ✅ Envoyer une image (corrigé)
  const sendImage = async () => {
    if (!selectedImage || !selectedSession) return;

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('sessionTravailId', selectedSession);
    formData.append('expediteurId', user.id);
    formData.append('contenu', newMessage);

    const tempMessage = {
      id: `temp-image-${Date.now()}`,
      contenu: newMessage,
      hasAttachment: true,
      attachmentType: 'image',
      utilisateur: { id: user.id, prenom: user.prenom, nom: user.nom },
      createdAt: new Date().toISOString(),
      sending: true,
      imagePreview: imagePreview
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    cancelImageSelection();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/sessions/${selectedSession}/messages/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const finalMessage = {
        ...response.data,
        content: response.data.contenu,
        utilisateur: response.data.utilisateur,
        createdAt: response.data.date_envoi,
        sending: false,
        hasAttachment: true,
        attachmentType: 'image',
        imageUrl: response.data.imageUrl
      };

      setMessages(prev => prev.map(m =>
        m.id === tempMessage.id ? finalMessage : m
      ));

      // ✅ Émettre APRÈS la sauvegarde
      socket.emit('sendMessage', finalMessage);

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'image:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      alert('Erreur lors de l\'envoi de l\'image.');
    }
  };

  // ✅ Envoyer un document (corrigé)
  const sendDocument = async () => {
    if (!selectedFile || !selectedSession) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('sessionTravailId', selectedSession);
    formData.append('expediteurId', user.id);
    formData.append('contenu', newMessage || `[${selectedFile.name}]`);

    const tempMessage = {
      id: `temp-file-${Date.now()}`,
      contenu: newMessage || `Document : ${selectedFile.name}`,
      hasAttachment: true,
      attachmentType: 'document',
      filePreview: filePreview,
      utilisateur: { id: user.id, prenom: user.prenom, nom: user.nom },
      createdAt: new Date().toISOString(),
      sending: true
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    cancelFileSelection();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/sessions/${selectedSession}/messages/file`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const finalMessage = {
        ...response.data,
        content: response.data.contenu,
        utilisateur: response.data.utilisateur,
        createdAt: response.data.date_envoi,
        sending: false,
        hasAttachment: true,
        attachmentType: 'document',
        fileUrl: response.data.fileUrl
      };

      setMessages(prev => prev.map(m =>
        m.id === tempMessage.id ? finalMessage : m
      ));

      // ✅ Émettre APRÈS la sauvegarde
      socket.emit('sendMessage', finalMessage);

    } catch (error) {
      console.error('Erreur lors de l\'envoi du document:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      alert('Erreur lors de l\'envoi du document.');
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

  // ✅ Socket.IO : écouter les nouveaux messages (avec protection contre doublons)
  useEffect(() => {
    if (!selectedSession) return;
    
    const handleReceiveMessage = (message) => {
      if (message.sessionTravailId === selectedSession) {
        // ✅ Vérifier si le message n'existe pas déjà
        setMessages(prev => {
          const messageExists = prev.some(msg => 
            msg.id === message.id || 
            (msg.contenu === message.contenu && 
             msg.utilisateur.id === message.utilisateur?.id &&
             Math.abs(new Date(msg.createdAt) - new Date(message.date_envoi)) < 1000)
          );
          
          if (messageExists) {
            return prev; // ✅ Ne pas ajouter si existe déjà
          }
          
          return [...prev, {
            ...message,
            content: message.contenu,
            utilisateur: message.utilisateur || { id: message.expediteurId, prenom: '', nom: '' },
            createdAt: message.date_envoi
          }];
        });
      }
    };
    
    socket.on('receiveMessage', handleReceiveMessage);
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [selectedSession]);

  // ✅ Rejoindre la room de la session sélectionnée
  useEffect(() => {
    if (selectedSession) {
      socket.emit('joinSession', selectedSession);
      console.log(`Rejoint la session ${selectedSession}`);
    }
    
    return () => {
      if (selectedSession) {
        socket.emit('leaveSession', selectedSession);
      }
    };
  }, [selectedSession]);

  // Retour à la liste des conversations
  const backToConversations = () => {
    setShowChat(false);
    setSelectedSession(null);
    cancelAllSelections();
  };

  // ✅ Envoi d'un message texte (corrigé)
  const sendMessage = (e) => {
    e.preventDefault();
    
    if (selectedImage) {
      sendImage();
      return;
    }
    
    if (selectedFile) {
      sendDocument();
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
      contenu: newMessage, // ✅ Ajouter cette ligne
      utilisateur: { id: user.id, prenom: user.prenom, nom: user.nom },
      createdAt: new Date().toISOString(),
      sending: true,
      sessionId: selectedSession
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    // ✅ NE PAS émettre ici - seulement APRÈS la sauvegarde
    // socket.emit('sendMessage', messageData); // ❌ Supprimé

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
        
        // ✅ Émettre APRÈS la sauvegarde réussie
        socket.emit('sendMessage', msg);
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
                          {/* Afficher le texte s'il existe */}
                          {message.contenu && message.contenu.trim() && (
                            <div className="message-text">
                              {message.contenu}
                            </div>
                          )}
                          
                          {/* Afficher l'image si elle existe */}
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
                                  onClick={() => openImageModal(`http://localhost:3000${message.imageUrl}`, 'Image partagée')}
                                />
                              ) : null}
                            </div>
                          )}
                          
                          {/* Afficher les documents */}
                          {message.hasAttachment && message.attachmentType === 'document' && (
                            <div className="message-document">
                              {message.sending && message.filePreview ? (
                                <div className="document-preview sending">
                                  <div className="document-icon">
                                    <i className="fas fa-file-alt"></i>
                                  </div>
                                  <div className="document-info">
                                    <div className="document-name">{message.filePreview.name}</div>
                                    <div className="document-size">{message.filePreview.size}</div>
                                    <div className="document-status">Envoi en cours...</div>
                                  </div>
                                </div>
                              ) : message.fileUrl ? (
                                <a 
                                  href={`http://localhost:3000${message.fileUrl}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="document-link"
                                >
                                  <div className="document-icon">
                                    <i className="fas fa-file-alt"></i>
                                  </div>
                                  <div className="document-info">
                                    <div className="document-name">{message.contenu.replace(/^\[.*?\]\s*/, '') || 'Document'}</div>
                                    <div className="document-action">
                                      <i className="fas fa-download"></i>
                                      Télécharger
                                    </div>
                                  </div>
                                </a>
                              ) : null}
                            </div>
                          )}
                          
                          {/* Autres types de fichiers */}
                          {message.hasAttachment && message.attachmentType !== 'image' && message.attachmentType !== 'document' && (
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

              {/* Aperçu de l'image sélectionnée */}
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

              {/* Aperçu du document sélectionné */}
              {filePreview && (
                <div className="file-preview-container">
                  <div className="file-preview">
                    <div className="file-icon">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="file-info">
                      <div className="file-name">{filePreview.name}</div>
                      <div className="file-details">
                        <span className="file-type">{filePreview.type}</span>
                        <span className="file-size">{filePreview.size}</span>
                      </div>
                    </div>
                    <div className="file-actions">
                      <button 
                        className="preview-btn cancel"
                        onClick={cancelFileSelection}
                        title="Annuler"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                      <button 
                        className="preview-btn send"
                        onClick={sendDocument}
                        title="Envoyer le document"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulaire de message */}
              <div className="message-container-form">
                <form className="message-input-form" onSubmit={sendMessage}>
                  <button 
                    type="button"
                    className="image-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Envoyer une image"
                  >
                    <i className="fas fa-image"></i>
                  </button>
                  
                  <button 
                    type="button"
                    className="document-btn"
                    onClick={() => documentInputRef.current?.click()}
                    title="Envoyer un document"
                  >
                    <i className="fas fa-paperclip"></i>
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                  />
                  
                  <input
                    ref={documentInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    onChange={handleDocumentSelect}
                    style={{ display: 'none' }}
                  />
                  
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      selectedImage ? "Image sélectionnée - cliquez sur Envoyer" :
                      selectedFile ? "Document sélectionné - cliquez sur Envoyer" :
                      "Tapez votre message pour la session..."
                    }
                    className="message-input"
                    autoComplete="off"
                    disabled={!!selectedImage || !!selectedFile}
                  />
                  <button 
                    type="submit" 
                    className="send-btn" 
                    disabled={!newMessage.trim() && !selectedImage && !selectedFile}
                    title={
                      selectedImage ? "Envoyer l'image" :
                      selectedFile ? "Envoyer le document" :
                      "Envoyer le message"
                    }
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Modal d'aperçu d'image */}
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