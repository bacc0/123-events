import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import EventList from './eventList';
import EventList from './eventList';

import { Grid, Card, CardContent, CardMedia, Button, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';




// --- Contact Organizer Modal (mockup) ---
const ContactOrganizerModal = ({ organizerName, onClose }) => (
    <div className="modal-overlay" onClick={onClose} >
        <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3 className="modal-title" style={{ fontSize: '20px' }}>{`Contact ${organizerName}`}</h3>
                <Button className="close-button" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </Button>
            </div>
            <div style={{ padding: 32, textAlign: "center" }}>Contact form goes here.</div>
        </div>
    </div>
);

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
                {
                    event.image &&
                    <img src={event.image} alt={event.title} className="modal-image" />
                }
                <div >

                    <br />
                    <div className="detail-item">
                        <svg className="detail-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                        </svg>
                        <div className="detail-content">
                            <div className="detail-label">Date & Time</div>
                            <div className="detail-value">{event.date} at {event.time}</div>
                        </div>
                    </div>
                    <br />
                    <div className="detail-item">
                        <svg className="detail-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                        </svg>
                        <div className="detail-content">
                            <div className="detail-label">Location</div>
                            <div className="detail-value">{event.location}</div>
                        </div>
                    </div>

                    <br />

                    <div className="detail-item">
                        <svg className="detail-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM4 8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1-1H5a1 1 0 0 1-1-1V8z" />
                        </svg>
                        <div className="detail-content">
                            <div className="detail-label">Description</div>
                            <div className="detail-value">{event.description}</div>
                        </div>
                    </div>
                </div>

            </div>












            <div className="modal-footer">
                {/* <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Close</button> */}
            </div>
        </div>
    </div>
);

// --- Event Card ---
// const EventCard = ({ event, onViewDetails }) => {
//     const eventDate = new Date(event.date);
//     return (
//         <div className="event-card" style={{ maxWidth: '460px' }}>
//             {event.image ? (
//                 <img src={event.image} alt={event.title} className="event-image profile-event-card" />
//             ) : (
//                 <div className="event-image-placeholder profile-event-card">
//                     <svg width="40" height="40" viewBox="0 0 16 16" fill="currentColor">
//                         <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
//                         <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093L6.5 10.5l-2.777-2.947a.5.5 0 0 0-.577-.093L.002 9.5V3a1 1 0 0 1 1-1h12z" />
//                     </svg>
//                 </div>
//             )}
//             <div className="event-content">
//                 <h4 className="event-title profile-event-title">{event.title}</h4>
//                 <div className="event-meta profile-event-meta">
//                     <span>{eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
//                 </div>
//                 <div className="event-meta profile-event-meta">
//                     <span>{event.location}</span>
//                 </div>
//             </div>
//             <div style={{ padding: '0 16px 16px 16px' }}>
//                 <button className="btn btn-primary btn-full" onClick={() => onViewDetails(event)}>View Details</button>
//             </div>
//         </div>
//     );
// };

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

    // If you want to fetch real user events, do it here.
    // For now, placeholder static data:
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
        <div className="app-container" style={{ paddingTop: '24px' }}>
            <link rel="stylesheet" href="universal-styles.css" />

            <div className="profile-grid"
                style={{
                    margin: '0 auto',
                    padding: '0 16px',
                    maxWidth: '1200px',
                    // display: 'flex',
                }}
            >
                <div className="profile-left-panel"
                    style={{
                        borderRadius: 16,
                    }}
                >
                    <div className="profile-header">
                        <img src={user.profileImageUrl} alt={user.fullName} className="profile-avatar" />
                        <h2 className="profile-name">{user.fullName} </h2>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '8px 0 16px 0' }}>
                            {/* {(events.organized.length + events.past.length)} Total Events Hosted */}
                            About
                        </p>
                        <p className="profile-about">{user.about}</p>
                        <Button
                            onClick={() => setShowContactModal(true)}
                            variant="contained"
                            endIcon={<SendIcon />}
                            style={{
                                color: 'white',
                                backgroundColor: '#0A47A3',
                                borderRadius: 8,
                                boxShadow: 'none',
                                height: 38,
                            }}
                        >

                            Contact Organizer
                        </Button>
                    </div>
                </div>



                <div className="profile-container_card"
                    style={{
                        background: '#ffffff',
                        padding: 16,
                        borderRadius: 16,
                        border: '1px solid #E5E7EB',
                    }}
                >
                    <h3
                        className="section-title"
                        style={{
                            fontSize: '1.17em',
                            marginBottom: '24px',
                            paddingBottom: '8px',
                            display: 'inline-block',
                            marginLeft: 40
                        }}
                    >
                        Upcoming Events
                    </h3>
                    <EventList creatorName={user.fullName} date="upcoming" />


                    <h3
                        className="section-title"
                        style={{
                            fontSize: '1.17em',
                            marginBottom: '24px',
                            paddingBottom: '8px',
                            display: 'inline-block',
                            marginLeft: 40
                        }}
                    >
                        Past Events
                    </h3>

                    <EventList creatorName={user.fullName} date="past" />

                </div>
            </div>

            {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
            {showContactModal && <ContactOrganizerModal organizerName={user.fullName} onClose={() => setShowContactModal(false)} />}
        </div>
    );
};

export default UserProfilePage;
