import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Message.css';

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

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Fonction pour formater la date/heure
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    }
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  // ✅ Charger les sessions où l'utilisateur participe
  useEffect(() => {
    if (user) {
      // Récupérer toutes les sessions où l'utilisateur est impliqué
      Promise.all([
        // Sessions créées par l'utilisateur
        axios.get('http://localhost:3000/api/sessions').then(res => 
          res.data.filter(s => s.createurId === user.id)
        ),
        // Sessions où l'utilisateur participe
        axios.get(`http://localhost:3000/api/utilisateurs/${user.id}/sessions`)
      ])
      .then(([sessionsCreees, participations]) => {
        // Fusionner sans doublons
        const toutes = [
          ...sessionsCreees,
          ...participations.filter(sp => !sessionsCreees.some(sc => sc.id === sp.id))
        ];
        
        // Trier par date (plus récentes en premier)
        const sessionsTriees = toutes.sort((a, b) => 
          new Date(b.date_heure) - new Date(a.date_heure)
        );
        
        setSessions(sessionsTriees);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        // Données mock pour test
        setSessions([
          {
            id: 1,
            titre: 'Révision Algorithmes - Arbres Binaires',
            date_heure: new Date().toISOString(),
            lieu: 'Salle B101',
            en_ligne: false,
            createurId: user.id,
            Module: { nom: 'Algorithmes' },
            participants: [
              { id: 2, prenom: 'Marie', nom: 'Dubois' },
              { id: 3, prenom: 'Pierre', nom: 'Martin' }
            ],
            lastMessage: 'Salut tout le monde ! Prêts pour demain ?',
            lastMessageTime: new Date(Date.now() - 1800000).toISOString(),
            unreadCount: 2
          },
          {
            id: 2,
            titre: 'TP Base de Données - SQL Avancé',
            date_heure: new Date(Date.now() + 86400000).toISOString(),
            lien_en_ligne: 'https://meet.google.com/abc-def-ghi',
            en_ligne: true,
            createurId: 4,
            Module: { nom: 'Base de Données' },
            participants: [
              { id: user.id, prenom: user.prenom, nom: user.nom },
              { id: 4, prenom: 'Sophie', nom: 'Leroy' }
            ],
            lastMessage: 'J\'ai partagé les exercices dans le groupe',
            lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
            unreadCount: 0
          }
        ]);
      });
    }
  }, [user]);

  // ✅ Charger les messages d'une session
  const loadSessionMessages = (sessionId) => {
    setSelectedSession(sessionId);
    setShowChat(true); // Passer au chat sur mobile
    
    axios.get(`http://localhost:3000/api/sessions/${sessionId}/messages`)
      .then(res => setMessages(res.data))
      .catch(() => {
        // Messages mock pour test
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
          setMessages([
            {
              id: 1,
              content: `Salut ! J'ai hâte de participer à "${session.titre}"`,
              utilisateur: { id: 2, prenom: 'Marie', nom: 'Dubois' },
              createdAt: new Date(Date.now() - 7200000).toISOString()
            },
            {
              id: 2,
              content: 'Moi aussi ! J\'ai préparé quelques questions sur les algorithmes de tri',
              utilisateur: { id: user.id, prenom: user.prenom, nom: user.nom },
              createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: 3,
              content: 'Parfait ! On pourra aussi revoir les structures de données',
              utilisateur: { id: 3, prenom: 'Pierre', nom: 'Martin' },
              createdAt: new Date(Date.now() - 1800000).toISOString()
            }
          ]);
        }
      });
  };

  // ✅ Retour à la liste des conversations
  const backToConversations = () => {
    setShowChat(false);
    setSelectedSession(null);
  };

  // ✅ Amélioration de la fonction sendMessage
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSession) return;

    const messageData = {
      content: newMessage,
      sessionId: selectedSession,
      utilisateurId: user.id
    };

    // Optimistic update
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: newMessage,
      utilisateur: { id: user.id, prenom: user.prenom, nom: user.nom },
      createdAt: new Date().toISOString(),
      sending: true
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    axios.post(`http://localhost:3000/api/sessions/${selectedSession}/messages`, messageData)
      .then(res => {
        setMessages(prev => prev.map(msg => 
          msg.id === tempMessage.id ? { ...res.data, sending: false } : msg
        ));
      })
      .catch(() => {
        // Mock pour test
        const mockMessage = {
          id: messages.length + 1,
          content: tempMessage.content,
          utilisateur: { id: user.id, prenom: user.prenom, nom: user.nom },
          createdAt: new Date().toISOString()
        };
        setMessages(prev => prev.map(msg => 
          msg.id === tempMessage.id ? mockMessage : msg
        ));
      });
  };

  // ✅ Gestion de la frappe
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  // ✅ Gestion de l'envoi avec Entrée
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
                    <div className="conversation-meta">
                      <span className="session-module">
                        <i className="fas fa-book"></i> {session.Module?.nom}
                      </span>
                      <span className="session-date">
                        <i className="fas fa-calendar"></i> {formatDate(session.date_heure)}
                      </span>
                    </div>
                    <div className="conversation-last-message">
                      {session.lastMessage || 'Aucun message'}
                    </div>
                    <div className="session-participants">
                      <i className="fas fa-user-friends"></i> {session.participants?.length || 0} participant{(session.participants?.length || 0) > 1 ? 's' : ''}
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
              ))
            )}
          </div>
        </div>

        {/* ✅ Zone de chat améliorée */}
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
                {/* Bouton retour mobile */}
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

              {/* ✅ Formulaire de message simplifié */}
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