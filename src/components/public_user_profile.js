import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// --- Contact Organizer Modal (mockup) ---
const ContactOrganizerModal = ({ organizerName, onClose }) => (
    <div className="modal-overlay" onClick={onClose} >
        <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3 className="modal-title" style={{ fontSize: '20px' }}>{`Contact ${organizerName}`}</h3>
                <button className="close-button" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div style={{ padding: 32, textAlign: "center" }}>Contact form goes here.</div>
        </div>
    </div>
);

// --- Calendar ---
const Calendar = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 2));
    const eventDates = useMemo(
        () => new Set(events.map(event => new Date(event.date).toDateString())),
        [events]
    );
    const changeMonth = offset => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const renderCells = () => {
        const cells = [];
        for (let i = 0; i < firstDayOfMonth; i++) cells.push(<div key={`empty-${i}`} className="calendar-day"></div>);
        for (let day = 1; day <= daysInMonth; day++) {
            const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isEventDay = eventDates.has(fullDate.toDateString());
            cells.push(
                <div key={day} className={`calendar-day ${isEventDay ? 'calendar-day-event' : ''}`}>
                    {day}
                </div>
            );
        }
        return cells;
    };
    return (
        <div className="calendar-container"  >
            <div className="calendar-header">
                <button className="calendar-nav" onClick={() => changeMonth(-1)}>&lt;</button>
                <h4 className="calendar-title">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                <button className="calendar-nav" onClick={() => changeMonth(1)}>&gt;</button>
            </div>
            <div className="calendar-grid">
                {weekDays.map(day => <div key={day} className="calendar-day-header">{day}</div>)}
                {renderCells()}
            </div>
        </div>
    );
};

// --- Event Details Modal ---
const EventDetailsModal = ({ event, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h2 className="modal-title">{event.title}</h2>
                <button className="close-button" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="modal-body">
                {event.image && <img src={event.image} alt={event.title} className="modal-image" />}
                <div style={{ marginTop: 24 }}>
                    <strong>Date:</strong> {event.date} <br />
                    <strong>Time:</strong> {event.time} <br />
                    <strong>Location:</strong> {event.location} <br />
                    <strong>Description:</strong> {event.description}
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Close</button>
            </div>
        </div>
    </div>
);

// --- Event Card ---
const EventCard = ({ event, onViewDetails }) => {
    const eventDate = new Date(event.date);
    return (
        <div className="event-card" >
            {event.image ? (
                <img src={event.image} alt={event.title} className="event-image profile-event-card" />
            ) : (
                <div className="event-image-placeholder profile-event-card">
                    <svg width="40" height="40" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093L6.5 10.5l-2.777-2.947a.5.5 0 0 0-.577-.093L.002 9.5V3a1 1 0 0 1 1-1h12z" />
                    </svg>
                </div>
            )}
            <div className="event-content">
                <h4 className="event-title profile-event-title">{event.title}</h4>
                <div className="event-meta profile-event-meta">
                    <span>{eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="event-meta profile-event-meta">
                    <span>{event.location}</span>
                </div>
            </div>
            <div style={{ padding: '0 16px 16px 16px' }}>
                <button className="btn btn-primary btn-full" onClick={() => onViewDetails(event)}>View Details</button>
            </div>
        </div>
    );
};

// --- Main Public Profile Page Component ---
const UserProfilePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { uid, fullName } = location.state || {};

    useEffect(() => {
        if (!uid || !fullName) {
            navigate('/dashboard');
        }
    }, [uid, fullName, navigate]);

    const [user, setUser] = useState({
        uid: uid || 'user_def_456',
        fullName: fullName || 'Sarah Johnson',
        profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
        about: "Passionate about building communities and creating memorable experiences. Specializing in tech and design events that inspire and connect people."
    });

    const [events, setEvents] = useState({
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
    });

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);

    return (
        <div className="app-container"  style={{paddingTop: '24px'}}>
            <link rel="stylesheet" href="universal-styles.css" />

            <div className="profile-grid" >
                <div className="profile-left-panel">
                    <div className="profile-header">
                        <img src={user.profileImageUrl} alt={user.fullName} className="profile-avatar" />
                        <h2 className="profile-name">{user.fullName}</h2>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '8px 0 16px 0' }}>
                            {(events.organized.length + events.past.length)} Total Events Hosted
                        </p>
                        <p className="profile-about">{user.about}</p>
                        <button className="btn btn-primary btn-full" onClick={() => setShowContactModal(true)}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.803V4.697l-5.803 3.558z" />
                            </svg>
                            Contact Organizer
                        </button>
                    </div>
                </div>

                <div>
                    <Calendar events={[...events.organized, ...events.past]} />

                    <h3 className="section-title" style={{
                        fontSize: '24px', marginBottom: '24px', borderBottom: '2px solid var(--primary-color)',
                        paddingBottom: '8px', display: 'inline-block'
                    }}>
                        Upcoming Events
                    </h3>
                    <div className="profile-events-grid">
                        {events.organized.length > 0 ?
                            events.organized.map(event => <EventCard key={event.id} event={event} onViewDetails={setSelectedEvent} />) :
                            <div className="empty-state">{user.fullName.split(' ')[0]} has no upcoming events.</div>
                        }
                    </div>

                    <h3 className="section-title" style={{
                        fontSize: '24px', marginBottom: '24px', borderBottom: '2px solid var(--primary-color)',
                        paddingBottom: '8px', display: 'inline-block'
                    }}>
                        Past Events
                    </h3>
                    <div className="profile-events-grid">
                        {events.past.length > 0 ?
                            events.past.map(event => <EventCard key={event.id} event={event} onViewDetails={setSelectedEvent} />) :
                            <div className="empty-state">No past events to show.</div>
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
