import React, { useState, useMemo } from 'react';

// --- Mock Data (Expanded with About text and Past Events) ---
const mockPublicUser = {
  uid: "user_def_456",
  fullName: "Sarah Johnson",
  profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  about: "Passionate about building communities and creating memorable experiences. Specializing in tech and design events that inspire and connect people."
};

const mockPublicUserEvents = {
  organized: [
    {
      id: "evt_marketing_summit_2025",
      title: "Marketing Summit 2025",
      date: "2025-03-18",
      time: "10:00",
      location: "Excel London",
      image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=240&fit=crop&crop=center',
      description: 'Annual marketing summit featuring keynote speakers, workshops, and networking opportunities.'
    },
    {
      id: "evt_design_workshop_2025",
      title: "UI/UX Design Workshop",
      date: "2025-05-20",
      time: "13:00",
      location: "Online",
      image: 'https://images.unsplash.com/photo-1558692257-2f3b904d415b?w=400&h=240&fit=crop&crop=center',
      description: 'A hands-on workshop covering the fundamentals of modern UI/UX design principles and tools.'
    }
  ],
  past: [
      {
      id: "evt_charity_gala_2024",
      title: "Annual Charity Gala",
      date: "2024-11-15",
      time: "19:00",
      location: "The Landmark Hotel",
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=240&fit=crop&crop=center',
      description: 'An elegant evening of fundraising for a great cause.'
    }
  ]
};

// --- NEW: Contact Organizer Modal ---
const ContactOrganizerModal = ({ organizerName, onClose }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: ''});
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log("Sending message:", formData);
            setLoading(false);
            setSent(true);
            // Optionally close modal after a delay
            // setTimeout(onClose, 2000);
        }, 1500);
    };

    const modalStyles = { // Base inline styles
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.3s ease-out' },
        content: { backgroundColor: '#FFFFFF', borderRadius: '12px', width: '100%', animation: 'slideUp 0.3s ease-out', overflow: 'hidden' },
        header: { borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        title: { fontWeight: '600', color: '#1F2937' },
        closeButton: { background: 'none', border: 'none', cursor: 'pointer', borderRadius: '50%' },
        body: {},
        form: { display: 'flex', flexDirection: 'column', gap: '20px' },
        formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
        label: { fontSize: '14px', fontWeight: '500', color: '#374151' },
        input: { padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' },
        textarea: { minHeight: '120px', resize: 'vertical' },
        footer: { display: 'flex', gap: '12px', borderTop: '1px solid #E5E7EB', justifyContent: 'flex-end' },
        button: { padding: '10px 20px', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', border: '1px solid transparent' },
        spinner: { display: 'inline-block', width: '16px', height: '16px', border: '2px solid transparent', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
        successView: { textAlign: 'center' },
    };

    return (
        <div style={modalStyles.overlay} onClick={onClose} className="contact-modal-overlay">
            <div style={modalStyles.content} onClick={(e) => e.stopPropagation()} className="contact-modal-content">
                <div style={modalStyles.header} className="contact-modal-header">
                    <h3 style={modalStyles.title} className="contact-modal-title">{sent ? "Message Sent" : `Contact ${organizerName}`}</h3>
                    <button style={modalStyles.closeButton} className="close-button" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                </div>

                {sent ? (
                    <div style={modalStyles.successView} className="contact-modal-success-view">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="#059669" style={{margin: '0 auto 16px'}}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        <p style={{color: '#374151'}}>Your message has been sent successfully. <br/>{organizerName} will get back to you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={modalStyles.body} className="contact-modal-body">
                            <div style={modalStyles.form}>
                                <div style={modalStyles.formGroup}>
                                    <label htmlFor="name" style={modalStyles.label}>Your Name</label>
                                    <input type="text" id="name" required style={modalStyles.input} onChange={(e) => setFormData({...formData, name: e.target.value})}/>
                                </div>
                                <div style={modalStyles.formGroup}>
                                    <label htmlFor="email" style={modalStyles.label}>Your Email</label>
                                    <input type="email" id="email" required style={modalStyles.input} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                                </div>
                                <div style={modalStyles.formGroup}>
                                    <label htmlFor="message" style={modalStyles.label}>Message</label>
                                    <textarea id="message" required style={{...modalStyles.input, ...modalStyles.textarea}} onChange={(e) => setFormData({...formData, message: e.target.value})}/>
                                </div>
                            </div>
                        </div>
                        <div style={modalStyles.footer} className="contact-modal-footer">
                            <button type="button" style={{...modalStyles.button, backgroundColor: '#F9FAFB', borderColor: '#D1D5DB'}} onClick={onClose}>Cancel</button>
                            <button type="submit" style={{...modalStyles.button, backgroundColor: '#0d47a1', color: 'white', display: 'flex', alignItems: 'center', gap: '8px'}} disabled={loading}>
                                {loading ? <div style={modalStyles.spinner}></div> : 'Send Message'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// --- Calendar Component ---
const Calendar = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 2));

    const eventDates = useMemo(() =>
        new Set(events.map(event => new Date(event.date).toDateString())),
        [events]
    );

    const changeMonth = (offset) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const calendarStyles = { // Base inline styles (non-responsive)
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
        headerTitle: { fontWeight: '600' },
        navButton: { background: 'none', border: '1px solid #D1D5DB', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' },
        dayHeader: { textAlign: 'center', color: '#6B7280', fontWeight: '500', paddingBottom: '8px' },
        dayCell: { height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', position: 'relative' },
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
                <button style={calendarStyles.navButton} className="calendar-nav-button" onClick={() => changeMonth(-1)}>&lt;</button>
                <h4 style={calendarStyles.headerTitle} className="calendar-header-title">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                <button style={calendarStyles.navButton} className="calendar-nav-button" onClick={() => changeMonth(1)}>&gt;</button>
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
    const modalStyles = { // Base inline styles (non-responsive)
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.3s ease-out' },
        content: { backgroundColor: '#FFFFFF', borderRadius: '12px', width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative', animation: 'slideUp 0.3s ease-out' },
        header: { borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        title: { fontWeight: '700', color: '#1F2937' },
        closeButton: { background: 'none', border: 'none', cursor: 'pointer', borderRadius: '50%', color: '#6B7280' },
        body: {},
        image: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '24px' },
        detailItem: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
        detailIcon: { flexShrink: 0, color: '#6B7280', marginTop: '2px', width: '20px', height: '20px' },
        detailContent: { flex: 1 },
        detailLabel: { color: '#6B7280', marginBottom: '4px' },
        detailValue: { color: '#1F2937', fontWeight: '500' },
        actions: { display: 'flex', gap: '12px', borderTop: '1px solid #E5E7EB', justifyContent: 'flex-end' },
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

// --- Reusable Event Card Component ---
const EventCard = ({ event, onViewDetails }) => {
    const cardStyles = { // Base inline styles (non-responsive)
        container: { backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' },
        image: { width: '100%', height: '140px', objectFit: 'cover' },
        placeholder: { width: '100%', height: '140px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' },
        content: { padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' },
        title: { fontWeight: '600', color: '#1F2937', marginBottom: '8px', flex: 1 },
        meta: { color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' },
        viewButton: { padding: '8px 16px', backgroundColor: '#0d47a1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', width: '100%', marginTop: 'auto' },
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

// --- Main Public Profile Page Component ---
const UserProfilePage = () => {
  const [user, setUser] = useState(mockPublicUser);
  const [events, setEvents] = useState(mockPublicUserEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const styles = { // Base inline styles (non-responsive)
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
    profileHeader: { textAlign: 'center' },
    avatar: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', margin: '0 auto 16px' },
    fullName: { margin: 0 },
    info: { color: '#6B7280', margin: '8px 0 16px 0' },
    about: { color: '#374151', lineHeight: 1.5, textAlign: 'left', marginBottom: '24px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' },
    contactButton: { width: '100%', borderRadius: '8px', border: 'none', backgroundColor: '#0d47a1', color: 'white', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' },
    rightPanel: { minHeight: '100vh' },
    sectionTitle: { fontWeight: '700', color: '#1F2937', marginBottom: '24px', borderBottom: '2px solid #0d47a1', paddingBottom: '8px', display: 'inline-block' },
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
            /* Global animations/hovers for all screen sizes */
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes spin { to { transform: rotate(360deg); } }

            .event-card-profile:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.08); }
            .view-event-button:hover { background-color: #1565c0; }
            .close-button:hover { background-color: #F3F4F6; }
            .contact-button:hover { background-color: #1565c0; }
            .calendar-nav-button:hover { background-color: #F3F4F6; } /* Consistent hover for calendar nav */

            input:focus, textarea:focus { border-color: #0d47a1 !important; box-shadow: 0 0 0 3px rgba(13, 71, 161, 0.1) !important; outline: none; }


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
            .avatar {
                width: 120px;
                height: 120px;
            }
            .full-name {
                font-size: 22px;
            }
            .info, .about {
                font-size: 14px;
            }
            .contact-button {
                padding: 10px 16px;
                font-size: 14px;
            }
            .calendar-container {
                padding: 24px;
            }
            .calendar-header-title {
                font-size: 18px;
            }
            .calendar-nav-button {
                width: 32px;
                height: 32px;
            }
            .calendar-day-cell {
                font-size: 14px;
            }
            .calendar-day-header {
                font-size: 12px;
            }
            .section-title {
                font-size: 24px;
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
            }

            /* Event Details Modal */
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

            /* Contact Modal */
            .contact-modal-overlay {
                padding: 20px;
                align-items: center;
            }
            .contact-modal-content {
                max-width: 500px;
                border-radius: 12px;
            }
            .contact-modal-header {
                padding: 24px;
            }
            .contact-modal-title {
                font-size: 20px;
            }
            .contact-modal-body {
                padding: 24px;
            }
            .contact-modal-footer {
                padding: 20px 24px;
            }
            .contact-modal-success-view {
                padding: 40px;
            }


            /* --- Mobile-specific styles (max-width: 900px) --- */
            @media (max-width: 900px) {
                .profile-page-container {
                    padding: 20px 16px;
                }
                .profile-grid {
                    grid-template-columns: 1fr;
                    gap: 24px;
                }
                .left-panel {
                    position: static;
                    padding: 20px;
                }
                .avatar {
                    width: 100px;
                    height: 100px;
                }
                .full-name {
                    font-size: 20px;
                }
                .info, .about {
                    font-size: 13px;
                }
                .contact-button {
                    padding: 10px 14px;
                    font-size: 13px;
                }

                /* Calendar adjustments */
                .calendar-container {
                    padding: 16px;
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

                .section-title {
                    font-size: 20px;
                }
                .event-list {
                    grid-template-columns: 1fr;
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

                /* Event Details Modal */
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

                /* Contact Modal */
                .contact-modal-overlay {
                    padding: 0;
                    align-items: flex-end; /* Bottom sheet effect */
                }
                .contact-modal-content {
                    width: 100%;
                    max-width: none;
                    border-radius: 12px 12px 0 0;
                }
                .contact-modal-header {
                    padding: 20px;
                }
                .contact-modal-title {
                    font-size: 18px;
                }
                .contact-modal-body {
                    padding: 20px;
                }
                .contact-modal-footer {
                    padding: 16px 20px;
                }
                .contact-modal-success-view {
                    padding: 30px;
                    font-size: 14px;
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
                .avatar {
                    width: 80px;
                    height: 80px;
                }
                .full-name {
                    font-size: 18px;
                }
                .info, .about {
                    font-size: 12px;
                }
                .contact-button {
                    padding: 8px 12px;
                    font-size: 12px;
                }
                .calendar-container {
                    padding: 10px;
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
                .section-title {
                    font-size: 18px;
                }
                .empty-state {
                    padding: 24px;
                    font-size: 13px;
                }

                /* Modals (smaller text/padding for very small screens) */
                .event-details-modal-title, .contact-modal-title {
                    font-size: 18px;
                }
                .event-details-modal-body, .contact-modal-body {
                    padding: 16px;
                }
                .event-details-modal-detail-label, .contact-modal-success-view p {
                    font-size: 11px;
                }
                .event-details-modal-detail-value {
                    font-size: 13px;
                }
                .event-details-modal-actions, .contact-modal-footer {
                    padding: 12px 16px;
                }
            }
        `}</style>
      <div style={styles.profileGrid} className="profile-grid">
        <div style={styles.leftPanel} className="left-panel">
          <div style={styles.profileHeader}>
            <img src={user.profileImageUrl} alt={user.fullName} style={styles.avatar} className="avatar" />
            <h2 style={styles.fullName} className="full-name">{user.fullName}</h2>
            <p style={styles.info} className="info">{(events.organized.length + events.past.length)} Total Events Hosted</p>
            <p style={styles.about} className="about">{user.about}</p>
            <button style={styles.contactButton} className="contact-button" onClick={() => setShowContactModal(true)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.803V4.697l-5.803 3.558z"/></svg>
                Contact Organizer
            </button>
          </div>
        </div>

        <div style={styles.rightPanel}>
            <Calendar events={[...events.organized, ...events.past]} />

            <h3 style={styles.sectionTitle} className="section-title">Upcoming Events</h3>
            <div style={styles.eventList} className="event-list">
                {events.organized.length > 0 ?
                events.organized.map(event => <EventCard key={event.id} event={event} onViewDetails={setSelectedEvent} />) :
                <div style={styles.emptyState} className="empty-state">{user.fullName.split(' ')[0]} has no upcoming events.</div>
                }
            </div>

            <h3 style={styles.sectionTitle} className="section-title">Past Events</h3>
             <div style={styles.eventList} className="event-list">
                {events.past.length > 0 ?
                events.past.map(event => <EventCard key={event.id} event={event} onViewDetails={setSelectedEvent} />) :
                <div style={styles.emptyState} className="empty-state">No past events to show.</div>
                }
            </div>
        </div>
      </div>

      {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {showContactModal && <ContactOrganizerModal organizerName={user.fullName} onClose={() => setShowContactModal(false)} />}
    </div>
  );
};

export default UserProfilePage;