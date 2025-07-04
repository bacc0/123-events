import React, { useState, useMemo } from 'react';

// --- Mock Data (Expanded with About text and Past Events) ---
const mockCurrentUser = {
  uid: "user_abc_123",
  fullName: "John Doe",
  email: "john.doe@example.com",
  profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
  about: "Event enthusiast and community builder. I enjoy bringing people together for tech talks and product showcases."
};

const mockUserEvents = {
  organized: [
    {
      id: "evt_tech_conf_2025",
      title: "Tech Conference 2025",
      date: "2025-03-15",
      time: "09:00",
      location: "Convention Center, London",
      image: 'https://images.unsplash.com/photo-1540575467063-178a0c2df87?w=400&h=240&fit=crop&crop=center',
      description: 'An exciting day of innovation and networking at our annual tech conference, featuring talks from industry leaders.'
    },
     {
      id: "evt_product_launch_2025",
      title: "Product Launch Party",
      date: "2025-04-10",
      time: "18:00",
      location: "Rooftop Venue, Canary Wharf",
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=240&fit=crop&crop=center',
      description: 'Celebrate the launch of our latest product with cocktails, live music, and networking.'
    },
  ],
  attending: [
    {
      id: "evt_marketing_summit_2025",
      title: "Marketing Summit 2025",
      date: "2025-03-18",
      time: "10:00",
      location: "Excel London",
      rsvpStatus: "accepted",
      image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=240&fit=crop&crop=center',
      description: 'Annual marketing summit featuring keynote speakers, workshops, and networking opportunities.'
    }
  ],
  past: [
      {
      id: "evt_data_science_meetup_2024",
      title: "Data Science Meetup",
      date: "2024-12-05",
      time: "18:30",
      location: "Google Campus, London",
      image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400&h=240&fit=crop&crop=center',
      description: 'A monthly meetup for data science professionals and enthusiasts.'
    }
  ]
};

// --- Calendar Component ---
const Calendar = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 2)); // Set a fixed date for consistent display

    const eventDates = useMemo(() =>
        new Set(events.map(event => new Date(event.date).toDateString())),
        [events]
    );

    const changeMonth = (offset) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const calendarStyles = { // Inline styles for general appearance (not responsive)
       container: {  
            backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        margin: '0 auto 32px',
        maxWidth: '400px',      // ← here
        aspectRatio: '1 / 1',   // ← and here
        padding: '16px',
        boxSizing: 'border-box'
    },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
        headerTitle: { fontSize: '18px', fontWeight: '600' },
        navButton: { background: 'none', border: '1px solid #D1D5DB', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }, // Calendar grid always 7 columns
        dayHeader: { textAlign: 'center', fontSize: '12px', color: '#6B7280', fontWeight: '500', paddingBottom: '8px' },
        dayCell: {
            height: '40px', // Fixed height to maintain square-like appearance
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            borderRadius: '50%',
            position: 'relative'
        },
        hasEvent: { backgroundColor: '#EBF4FF', color: '#1E40AF', fontWeight: '600' }
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const renderCells = () => {
        const cells = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push(<div key={`empty-${i}`} style={calendarStyles.dayCell}></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isEventDay = eventDates.has(fullDate.toDateString());
            cells.push(
                <div key={day} style={{...calendarStyles.dayCell, ...(isEventDay && calendarStyles.hasEvent)}} className="calendar-day-cell">
                    {day}
                </div>
            );
        }
        return cells;
    };

    return (
        <div style={calendarStyles.container} className="calendar-container">
            <div style={calendarStyles.header}>
                <button style={calendarStyles.navButton} onClick={() => changeMonth(-1)} className="calendar-nav-button">&lt;</button>
                <h4 style={calendarStyles.headerTitle} className="calendar-header-title">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                <button style={calendarStyles.navButton} onClick={() => changeMonth(1)} className="calendar-nav-button">&gt;</button>
            </div>
            <div style={calendarStyles.grid}>
                {weekDays.map(day => <div key={day} style={calendarStyles.dayHeader} className="calendar-day-header">{day}</div>)}
                {renderCells()}
            </div>
        </div>
    );
};


// --- Event Details Modal Component ---
const EventDetailsModal = ({ event, onClose }) => {
    const modalStyles = {
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000, animation: 'fadeIn 0.3s ease-out' },
        content: { backgroundColor: '#FFFFFF', borderRadius: '12px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative', animation: 'slideUp 0.3s ease-out' },
        header: { padding: '24px 24px 16px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        title: { fontSize: '24px', fontWeight: '700', color: '#1F2937' },
        closeButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', color: '#6B7280' },
        body: { padding: '24px' },
        image: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '24px' },
        detailItem: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
        detailIcon: { flexShrink: 0, color: '#6B7280', marginTop: '2px', width: '20px', height: '20px' },
        detailContent: { flex: 1 },
        detailLabel: { fontSize: '13px', color: '#6B7280', marginBottom: '4px' },
        detailValue: { fontSize: '15px', color: '#1F2937', fontWeight: '500' },
        actions: { display: 'flex', gap: '12px', padding: '24px', borderTop: '1px solid #E5E7EB', justifyContent: 'flex-end' },
        actionButton: { padding: '10px 20px', fontSize: '14px', borderRadius: '8px', border: '1px solid #D1D5DB', cursor: 'pointer', fontWeight: '500' },
    };

    return (
        <div style={modalStyles.overlay} onClick={onClose} className="event-details-modal-overlay">
            <div style={modalStyles.content} onClick={(e) => e.stopPropagation()} className="event-details-modal-content">
                <div style={modalStyles.header} className="event-details-modal-header">
                    <h2 style={modalStyles.title} className="event-details-modal-title">{event.title}</h2>
                    <button style={modalStyles.closeButton} className="close-button" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                </div>
                <div style={modalStyles.body} className="event-details-modal-body">
                    {event.image && <img src={event.image} alt={event.title} style={modalStyles.image} className="event-details-modal-image" onError={(e) => { e.target.style.display = 'none'; }} />}
                    <div style={{ display: 'grid', gap: '20px', marginBottom: '24px' }}>
                        <div style={modalStyles.detailItem}>
                             <svg style={modalStyles.detailIcon} viewBox="0 0 16 16" fill="currentColor"><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>
                            <div style={modalStyles.detailContent}>
                                <div style={modalStyles.detailLabel} className="event-details-modal-detail-label">Date & Time</div>
                                <div style={modalStyles.detailValue} className="event-details-modal-detail-value">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at {event.time}</div>
                            </div>
                        </div>
                        <div style={modalStyles.detailItem}>
                            <svg style={modalStyles.detailIcon} viewBox="0 0 16 16" fill="currentColor"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                            <div style={modalStyles.detailContent}>
                                <div style={modalStyles.detailLabel} className="event-details-modal-detail-label">Location</div>
                                <div style={modalStyles.detailValue} className="event-details-modal-detail-value">{event.location}</div>
                            </div>
                        </div>
                        <div style={modalStyles.detailItem}>
                            <svg style={modalStyles.detailIcon} viewBox="0 0 16 16" fill="currentColor"><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/><path d="M4 8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1-1H5a1 1 0 0 1-1-1V8z"/></svg>
                            <div style={modalStyles.detailContent}>
                                <div style={modalStyles.detailLabel} className="event-details-modal-detail-label">Description</div>
                                <div style={modalStyles.detailValue} className="event-details-modal-detail-value">{event.description}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={modalStyles.actions} className="event-details-modal-actions">
                    <button style={{ ...modalStyles.actionButton, flex: 1, backgroundColor: '#F9FAFB' }} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};


// --- Reusable Event Card Component (Redesigned) ---
const EventCard = ({ event, onViewDetails }) => {
    const cardStyles = {
        container: { backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' },
        image: { width: '100%', height: '140px', objectFit: 'cover' },
        placeholder: { width: '100%', height: '140px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' },
        content: { padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' },
        title: { fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '8px', flex: 1 },
        meta: { fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' },
        viewButton: { padding: '8px 16px', backgroundColor: '#0d47a1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%', marginTop: 'auto' },
    };
    const eventDate = new Date(event.date);

    return (
        <div style={cardStyles.container} className="event-card-profile">
            {event.image ? (
                <img src={event.image} alt={event.title} style={cardStyles.image} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x240/f8f9fa/9ca3af?text=No+Image'; }} />
            ) : (
                <div style={cardStyles.placeholder}>
                    <svg width="40" height="40" viewBox="0 0 16 16" fill="currentColor"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093L6.5 10.5l-2.777-2.947a.5.5 0 0 0-.577-.093L.002 9.5V3a1 1 0 0 1 1-1h12z"/></svg>
                </div>
            )}
            <div style={cardStyles.content}>
                <h4 style={cardStyles.title} className="event-card-title">{event.title}</h4>
                <div style={cardStyles.meta} className="event-card-meta">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>
                    <span>{eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div style={cardStyles.meta} className="event-card-meta">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                    <span>{event.location}</span>
                </div>
            </div>
             <div style={{padding: '0 16px 16px 16px'}}>
                 <button style={cardStyles.viewButton} className="view-event-button" onClick={() => onViewDetails(event)}>View Details</button>
            </div>
        </div>
    );
};


// --- Main Personal Profile Page Component ---
const MyProfilePage = () => {
  const [user, setUser] = useState(mockCurrentUser);
  const [events, setEvents] = useState(mockUserEvents);
  const [activeTab, setActiveTab] = useState('organized');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const styles = {
    // Base styles (will be overridden by CSS classes on smaller screens)
    container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', backgroundColor: '#f8f9fa', color: '#1F2937' },
    profileGrid: { display: 'grid', maxWidth: '1200px', margin: '0 auto' },
    leftPanel: { 
        backgroundColor: '#FFFFFF', 
        borderRadius: '12px', 
        border: '1px solid #E5E7EB', 
        alignSelf: 'start',
        alignSelf: 'start',
        maxWidth: '360px',    // limit width like the calendar
        margin: '0 auto'      // centre it horizontally
        },
    profileHeader: { textAlign: 'center', marginBottom: '24px' },
    avatarContainer: { position: 'relative', margin: '0 auto 16px', cursor: 'pointer' },
    avatar: { 
       width: '100%', height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '4px solid white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    avatarOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', opacity: 0, transition: 'opacity 0.3s ease' },
    fullName: { margin: 0 },
    email: { color: '#6B7280', margin: '4px 0 16px' },
    about: { color: '#374151', lineHeight: 1.5, textAlign: 'left', marginBottom: '24px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' },
    profileActions: { display: 'flex', flexDirection: 'column', gap: '12px' },
    actionButton: { borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' },
    primaryButton: { backgroundColor: '#0d47a1', color: 'white', border: 'none' },
    rightPanel: { minHeight: '100vh' },
    tabs: { display: 'flex', borderBottom: '1px solid #E5E7EB', overflowX: 'auto', WebkitOverflowScrolling: 'touch' },
    tab: { cursor: 'pointer', border: 'none', backgroundColor: 'transparent', borderBottom: '2px solid transparent', flexShrink: 0 },
    activeTab: { color: '#0d47a1', borderBottom: '2px solid #0d47a1' },
    sectionTitle: { color: '#1F2937', borderBottom: '2px solid #0d47a1', display: 'inline-block' },
    eventList: { 
        display: 'grid', 
        marginBottom: '40px' ,
        margin : '0 0px',
    },
    emptyState: { textAlign: 'center', padding: '48px', color: '#6B7280', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB' },
  };

  return (
    <div style={styles.container} className="profile-page-container">
        <style>{`
            /* Global animations/hovers for all screen sizes (applied directly to classes) */
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

            .avatar-container:hover .avatar-overlay { opacity: 1; }
            .action-button:hover { background-color: #F9FAFB; }
            .action-button.primary:hover { background-color: #1565c0; }
            .event-card-profile:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.08); }
            .view-event-button:hover { background-color: #1565c0; }
            .close-button:hover { background-color: #F3F4F6; }

            /* Desktop / Default Styles */
            .profile-page-container {
                padding: 40px 24px;
            }
            .profile-grid {
                grid-template-columns: 300px 1fr;
                gap: 32px;
            }
            .left-panel {
                position: sticky;
                top: 40px;
                padding: 32px;
            }
            .avatar-container {
                width: 120px;
                height: 120px;
            }
            .full-name {
                font-size: 22px;
            }
            .email {
                font-size: 14px;
            }
            .about {
                font-size: 14px;
            }
            .action-button {
                padding: 10px 16px;
                font-size: 14px;
            }
            .calendar-container {
                padding: 24px;
                margin-bottom: 32px;
            }
            .calendar-header-title {
                font-size: 18px;
            }
            .calendar-nav-button {
                width: 32px;
                height: 32px;
            }
            .calendar-day-cell {
                height: 40px;
                font-size: 14px;
            }
            .calendar-day-header {
                font-size: 12px;
            }
            .tabs {
                margin-bottom: 24px;
            }
            .tab {
                padding: 12px 24px;
                font-size: 14px;
            }
            .event-list {
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
            }
            .event-card-title {
                font-size: 16px;
            }
            .event-card-meta {
                font-size: 13px;
            }
            .empty-state {
                padding: 48px;
                font-size: 14px;
            }
            .event-details-modal-overlay {
                padding: 20px;
                align-items: center;
            }
            .event-details-modal-content {
                max-width: 600px;
                border-radius: 12px;
                max-height: 90vh;
            }
            .event-details-modal-header {
                padding: 24px 24px 16px;
            }
            .event-details-modal-title {
                font-size: 24px;
            }
            .event-details-modal-body {
                padding: 24px;
            }
            .event-details-modal-image {
                height: 200px;
            }
            .event-details-modal-detail-label {
                font-size: 13px;
            }
            .event-details-modal-detail-value {
                font-size: 15px;
            }
            .event-details-modal-actions {
                padding: 24px;
            }


            /* --- Mobile-specific styles (max-width: 900px) --- */
            @media (max-width: 900px) {
                .profile-page-container {
                    padding: 20px 16px;
                }
                .profile-grid {
                    grid-template-columns: 1fr; /* Stacks columns on mobile */
                    gap: 24px;
                }
                .left-panel {
                    position: static; /* Disable sticky on mobile */
                    padding: 20px;
                    margin-bottom: 0; /* Ensures it sits directly above content */
                }
                .avatar-container {
                    width: 100px;
                    height: 100px;
                }
                .full-name {
                    font-size: 20px;
                }
                .email, .about {
                    font-size: 13px;
                }
                .action-button {
                    padding: 10px 14px;
                    font-size: 13px;
                }

                /* Calendar adjustments (retains square grid) */
                .calendar-container {
                    padding: 16px;
                    margin-bottom: 24px;
                }
                .calendar-header-title {
                    font-size: 16px;
                }
                .calendar-nav-button {
                    width: 28px;
                    height: 28px;
                }
                .calendar-day-cell {
                    height: 35px;
                    font-size: 13px;
                }
                .calendar-day-header {
                    font-size: 11px;
                }

                /* Tabs adjustments */
                .tabs {
                    padding-bottom: 8px; /* For potential scroll indicator */
                    margin-bottom: 20px;
                }
                .tab {
                    padding: 10px 16px;
                    font-size: 13px;
                }

                /* Event List adjustments - cards stack */
                .event-list {
                    grid-template-columns: 1fr; /* Forces single column */
                    gap: 16px;
                }
                .event-card-title {
                    font-size: 15px;
                }
                .event-card-meta {
                    font-size: 12px;
                }
                .empty-state {
                    padding: 32px;
                    font-size: 14px;
                }

                /* Modal responsiveness */
                .event-details-modal-overlay {
                    padding: 0;
                    align-items: flex-end; /* Bottom sheet effect */
                }
                .event-details-modal-content {
                    width: 100%;
                    max-width: none;
                    border-radius: 12px 12px 0 0;
                    max-height: 85vh;
                }
                .event-details-modal-header {
                    padding: 20px;
                }
                .event-details-modal-title {
                    font-size: 20px;
                }
                .event-details-modal-body {
                    padding: 20px;
                }
                .event-details-modal-image {
                    height: 160px;
                }
                .event-details-modal-detail-label {
                    font-size: 12px;
                }
                .event-details-modal-detail-value {
                    font-size: 14px;
                }
                .event-details-modal-actions {
                    padding: 20px;
                }
            }

            /* --- Even smaller screens (max-width: 500px) --- */
            @media (max-width: 500px) {
                .profile-page-container {
                    padding: 15px 10px;
                }
                .left-panel {
                    padding: 16px;
                }
                .avatar-container {
                    width: 80px;
                    height: 80px;
                }
                .full-name {
                    font-size: 18px;
                }
                .email, .about {
                    font-size: 12px;
                }
                .action-button {
                    padding: 8px 12px;
                    font-size: 12px;
                }
                .calendar-container {
                    padding: 10px;
                    margin-bottom: 20px;
                }
                .calendar-header-title {
                    font-size: 14px;
                }
                .calendar-nav-button {
                    width: 24px;
                    height: 24px;
                }
                .calendar-day-cell {
                    height: 30px;
                    font-size: 12px;
                }
                .calendar-day-header {
                    font-size: 10px;
                }
                .tab {
                    padding: 8px 10px;
                    font-size: 11px;
                }
                .empty-state {
                    padding: 24px;
                    font-size: 13px;
                }
            }
        `}</style>
      <div style={styles.profileGrid} className="profile-grid">
        <div style={styles.leftPanel} className="left-panel">
          <div style={styles.profileHeader}>
            <div style={styles.avatarContainer} className="avatar-container">
              <img src={user.profileImageUrl} alt={user.fullName} style={styles.avatar} />
              <div style={styles.avatarOverlay} className="avatar-overlay">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M16.5 6v1.5h-9V6h9zM12 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
              </div>
            </div>
            <h2 style={styles.fullName} className="full-name">{user.fullName}</h2>
            <p style={styles.email} className="email">{user.email}</p>
            <p style={styles.about} className="about">{user.about}</p>
          </div>
          <div style={styles.profileActions}>
            <button style={{...styles.actionButton, ...styles.primaryButton}} className="action-button primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/></svg>
                Edit Profile
            </button>
            <button style={styles.actionButton} className="action-button">
                 <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>
                 Change Password
            </button>
          </div>
        </div>

        <div style={styles.rightPanel}>
            <Calendar events={[...events.organized, ...events.attending, ...events.past]} />

            <div style={styles.tabs} className="tabs">
                <button style={{...styles.tab, ...(activeTab === 'organized' && styles.activeTab)}} onClick={() => setActiveTab('organized')} className="tab">Upcoming Organized ({events.organized.length})</button>
                <button style={{...styles.tab, ...(activeTab === 'attending' && styles.activeTab)}} onClick={() => setActiveTab('attending')} className="tab">Upcoming Attending ({events.attending.length})</button>
                <button style={{...styles.tab, ...(activeTab === 'past' && styles.activeTab)}} onClick={() => setActiveTab('past')} className="tab">Past Events ({events.past.length})</button>
            </div>

            <div style={styles.eventList} className="event-list">
                {activeTab === 'organized' && (
                events.organized.length > 0 ?
                events.organized.map(event => <EventCard key={event.id} event={event} onViewDetails={setSelectedEvent} />) :
                <div style={styles.emptyState} className="empty-state">You haven't organized any upcoming events yet.</div>
                )}
                {activeTab === 'attending' && (
                events.attending.length > 0 ?
                events.attending.map(event => <EventCard key={event.id} event={event} onViewDetails={setSelectedEvent} />) :
                <div style={styles.emptyState} className="empty-state">You are not attending any upcoming events.</div>
                )}
                {activeTab === 'past' && (
                events.past.length > 0 ?
                events.past.map(event => <EventCard key={event.id} event={event} onViewDetails={setSelectedEvent} />) :
                <div style={styles.emptyState} className="empty-state">You have no past events in your history.</div>
                )}
            </div>
        </div>
      </div>

      {selectedEvent && (
        <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

export default MyProfilePage;