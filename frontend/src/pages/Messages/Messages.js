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
  const [showChat, setShowChat] = useState(false); // État pour mobile
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        // Adapter les messages pour le front
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
  };

  // Envoi d'un message (Socket.IO + REST fallback)
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSession) return;

    const messageData = {
      contenu: newMessage,
      sessionTravailId: selectedSession,
      expediteurId: user.id,
      date_envoi: new Date().toISOString()
    };

    // Optimistic update
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

    // Envoi en temps réel
    socket.emit('sendMessage', messageData);

    // Fallback REST : on attend que le backend retourne le message complet (avec utilisateur)
    axios.post(`http://localhost:3000/api/sessions/${selectedSession}/messages`, messageData)
      .then(res => {
        // Adapter la réponse pour le front
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
        // En cas d'erreur, on retire le message temporaire
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
              sessions.map(session => {
                
                return (
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
                          navigate(`/session/${session.id}`);
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
                );
              })
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
                    {sessions.find(s => s.id === selectedSession)?.titre}
                  </div>
                  <div className="chat-session-meta">
                    <span>
                      <i className="fas fa-calendar"></i>
                      {new Date(sessions.find(s => s.id === selectedSession)?.date_heure).toLocaleDateString('fr-FR')}
                    </span>
                    <span>
                      <i className="fas fa-map-marker-alt"></i>
                      {sessions.find(s => s.id === selectedSession)?.en_ligne 
                        ? 'En ligne' 
                        : sessions.find(s => s.id === selectedSession)?.lieu || 'Lieu non précisé'
                      }
                    </span>
                    <span className="participants-count">
                      <i className="fas fa-user-friends"></i>
                      {sessions.find(s => s.id === selectedSession)?.participants?.length || 0} participants
                    </span>
                  </div>
                </div>
                <div className="chat-actions">
                  <button 
                    className="chat-action-btn"
                    onClick={() => navigate(`/session/${selectedSession}`)}
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
                          {message.content}
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

              {/* Formulaire de message */}
              <div className="message-container-form">
                <form className="message-input-form" onSubmit={sendMessage}>
                    <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre message pour la session..."
                    className="message-input"
                    autoComplete="off"
                    />
                    <button 
                    type="submit" 
                    className="send-btn" 
                    disabled={!newMessage.trim()}
                    title="Envoyer le message"
                    >
                    <i className="fas fa-paper-plane"></i>
                    </button>
                </form>
               </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}