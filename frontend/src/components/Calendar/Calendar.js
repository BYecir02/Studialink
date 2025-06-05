import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CalendarView from 'react-calendar'; // Import de react-calendar
import './Calendar.css';
import 'react-calendar/dist/Calendar.css'; // Import du CSS de react-calendar

const Calendar = ({
  sessions = [],
  user,
  context = 'home',
  showFilters = true,
  defaultView = 'list',
  onSessionClick,
  onSessionDeleted,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  
  // États du composant
  const [viewMode, setViewMode] = useState(defaultView);
  const [filteredSessions, setFilteredSessions] = useState(sessions);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // États des filtres (conditionnels selon showFilters)
  const [filters, setFilters] = useState({
    showMyCreated: true,
    showMyParticipated: true,
    showPublicSessions: context === 'home'
  });

  // ✅ Fonction de suppression de session
  const handleDeleteSession = async (sessionId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette session ?")) {
      try {
        await axios.delete(`http://localhost:3000/api/sessions/${sessionId}`);
        if (onSessionDeleted) {
          onSessionDeleted(sessionId);
        }
        setFilteredSessions(prev => prev.filter(s => s.id !== sessionId));
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression de la session');
      }
    }
  };

  // ✅ Fonction pour aller à aujourd'hui
    const goToToday = () => {
    setSelectedDate(new Date());
    };

  // Mettre à jour les sessions filtrées
  useEffect(() => {
    if (!showFilters) {
      setFilteredSessions(sessions);
      return;
    }
    
    const filtered = sessions.filter(session => {
      const isCreator = session.createurId === user?.id;
      const isParticipant = session.participants?.some(p => p.id === user?.id);
      const isPublic = session.confidentialite === 'publique';

      if (context === 'profile') {
        return isCreator || isParticipant;
      }

      if (isCreator && filters.showMyCreated) return true;
      if (isParticipant && !isCreator && filters.showMyParticipated) return true;
      if (isPublic && !isCreator && !isParticipant && filters.showPublicSessions) return true;
      
      return false;
    });
    
    setFilteredSessions(filtered);
  }, [sessions, filters, user, context, showFilters]);

  // Gestionnaire de clic sur session
  const handleSessionClick = (session) => {
    if (onSessionClick) {
      onSessionClick(session);
    } else {
      navigate(`/session/${session.id}`, { 
        state: { from: context === 'profile' ? 'profile' : 'home' } 
      });
    }
  };

  // Gestionnaire de changement de filtre
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // ✅ Fonction pour obtenir les sessions d'une date donnée
  const getSessionsForDate = (date) => {
    return filteredSessions.filter(session => {
      const sessionDate = new Date(session.date_heure);
      return (
        sessionDate.getFullYear() === date.getFullYear() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getDate() === date.getDate()
      );
    });
  };

  // ✅ Fonction pour personnaliser le contenu des tuiles du calendrier
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const sessionsOnDate = getSessionsForDate(date);
      if (sessionsOnDate.length > 0) {
        return (
          <div className="calendar-tile-sessions">
            {sessionsOnDate.slice(0, 2).map(session => {
              const isCreator = session.createurId === user?.id;
              const isParticipant = session.participants?.some(p => p.id === user?.id);
              let sessionType = 'public';
              if (isCreator) sessionType = 'created';
              else if (isParticipant) sessionType = 'participating';
              
              return (
                <div 
                  key={session.id} 
                  className={`calendar-session-dot ${sessionType}`}
                  title={`${session.titre} - ${new Date(session.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                />
              );
            })}
            {sessionsOnDate.length > 2 && (
              <div className="calendar-session-more">+{sessionsOnDate.length - 2}</div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  // ✅ Sessions de la date sélectionnée
  const selectedDateSessions = getSessionsForDate(selectedDate);

  // ✅ Fonction pour rendre une session avec boutons d'actions
  const renderSession = (session, showCreateur = false) => {
    const isCreator = session.createurId === user?.id;
    const isParticipant = session.participants?.some(p => p.id === user?.id);

    return (
      <li 
        className="calendar-list-item" 
        key={session.id}
        onClick={() => handleSessionClick(session)}
        style={{ cursor: 'pointer' }}
      >
        <div className="calendar-list-main">
          <span className="calendar-list-title">
            <i className="fas fa-book"></i> {session.titre}
          </span>
        </div>
        
        <div className="calendar-list-details">
          <span className="calendar-list-module">
            <i className="fas fa-layer-group"></i> {session.Module?.nom || 'Non précisé'}
          </span>
          <span className="calendar-list-date">
            <i className="fas fa-calendar-alt"></i>
            {new Date(session.date_heure).toLocaleDateString('fr-FR', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })}
            &nbsp;à&nbsp;
            {new Date(session.date_heure).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          <span className="calendar-list-lieu">
            <i className="fas fa-map-marker-alt"></i> 
            {session.en_ligne ? 
              session.lien_en_ligne || 'En ligne' : 
              session.lieu || session.salle || 'Non précisé'
            }
          </span>
          <span className="calendar-list-participants">
            <i className="fas fa-users"></i>
            {session.participants ? session.participants.length : 0}
            /
            {session.max_participants ?? '-'} participants
          </span>
          {showCreateur && session.createur && (
            <span className="calendar-list-createur">
              <i className="fas fa-user"></i>
              {isCreator
                ? ' Créé par moi'
                : ` Créé par ${session.createur.prenom} ${session.createur.nom}`}
            </span>
          )}
        </div>

        {/* Boutons d'actions */}
        <div className="calendar-session-actions">
          <div 
            className="calendar-session-btn" 
            title="Détails" 
            onClick={e => { 
              e.stopPropagation(); 
              navigate(`/session/${session.id}`); 
            }}
          >
            <i className="fas fa-info-circle"></i>
          </div>

          {(isCreator || isParticipant) && (
            <div
              className="calendar-session-btn primary"
              title="Chat"
              onClick={e => {
                e.stopPropagation();
                navigate(`/messages?session=${session.id}`);
              }}
            >
              <i className="fas fa-comments"></i>
            </div>
          )}

          {isCreator && (
            <>
              <div
                className="calendar-session-btn"
                title="Modifier"
                onClick={e => { 
                  e.stopPropagation(); 
                  navigate(`/session/${session.id}/edit`); 
                }}
              >
                <i className="fas fa-edit"></i>
              </div>
              <div
                className="calendar-session-btn danger"
                title="Supprimer"
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteSession(session.id);
                }}
              >
                <i className="fas fa-trash"></i>
              </div>
            </>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className={`calendar-component ${className}`} {...props}>
      {/* Header avec toggle vue et filtres */}
      <div className="calendar-header">
        <div className="calendar-view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <i className="fas fa-list"></i>
            Liste
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            <i className="fas fa-calendar"></i>
            Calendrier
          </button>
        </div>

        {showFilters && context === 'home' && (
          <div className="calendar-filters">
            <label className="filter-checkbox">
              <input 
                type="checkbox" 
                checked={filters.showMyCreated}
                onChange={(e) => handleFilterChange('showMyCreated', e.target.checked)}
              />
              <span>Mes sessions créées</span>
            </label>
            <label className="filter-checkbox">
              <input 
                type="checkbox" 
                checked={filters.showMyParticipated}
                onChange={(e) => handleFilterChange('showMyParticipated', e.target.checked)}
              />
              <span>Mes participations</span>
            </label>
            <label className="filter-checkbox">
              <input 
                type="checkbox" 
                checked={filters.showPublicSessions}
                onChange={(e) => handleFilterChange('showPublicSessions', e.target.checked)}
              />
              <span>Sessions publiques</span>
            </label>
          </div>
        )}
      </div>

      {/* Contenu selon le mode de vue */}
      <div className="calendar-content">
        {viewMode === 'list' ? (
          <div className="calendar-list-container">
            {filteredSessions.length === 0 ? (
              <div className="calendar-empty">
                <i className="fas fa-calendar-alt"></i>
                <h4>Aucune session trouvée</h4>
                <p>
                  {context === 'profile' 
                    ? 'Vous n\'avez pas encore de sessions à venir.'
                    : 'Aucune session ne correspond aux filtres sélectionnés.'
                  }
                </p>
              </div>
            ) : (
              <ul className="calendar-list">
                {filteredSessions
                  .sort((a, b) => new Date(a.date_heure) - new Date(b.date_heure))
                  .map(session => renderSession(session, context === 'home'))
                }
              </ul>
            )}
          </div>
        ) : (
          // ✅ VRAIE VUE CALENDRIER
          <div className="calendar-view-container">
            <div className="calendar-wrapper">
            <div className="calendar-container">
                {/* ✅ Bouton Aujourd'hui */}
                <div className="calendar-controls">
                <button 
                    className="today-btn" 
                    onClick={goToToday}
                    title="Aller à aujourd'hui"
                >
                    <i className="fas fa-calendar-day"></i>
                    Aujourd'hui
                </button>
                </div>
                
                <CalendarView
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                locale="fr-FR"
                className="custom-calendar"
                navigationLabel={({ date, label, locale, view }) => `${label}`}
                next2Label={null}
                prev2Label={null}
                showNeighboringMonth={false}
                />
            </div>
            
            {/* Sessions de la date sélectionnée */}
            <div className="calendar-selected-date">
                <h3>
                Sessions du {selectedDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                })}
                </h3>
                
                {selectedDateSessions.length === 0 ? (
                <p className="no-sessions">Aucune session prévue ce jour</p>
                ) : (
                <ul className="calendar-day-sessions">
                    {selectedDateSessions
                    .sort((a, b) => new Date(a.date_heure) - new Date(b.date_heure))
                    .map(session => renderSession(session, context === 'home'))
                    }
                </ul>
                )}
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;