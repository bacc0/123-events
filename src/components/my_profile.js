import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import EventList from './EventList';


import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from "framer-motion";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { app } from '../firebase';
import Modal_Edit_Profile from './ModalEditProfile';

const db = getDatabase(app);

const ContactOrganizerModal = ({ organizerName, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3 className="modal-title" style={{ fontSize: '20px' }}>{`Contact ${organizerName}`}</h3>
                <Button className="close-button" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </Button>
            </div>
            <div style={{ padding: 32, textAlign: 'center' }}>Contact form goes here.</div>
        </div>
    </div>
);

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
                <br />
                <div className="detail-item">
                    <svg className="detail-icon" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z..." />
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
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2z..." />
                    </svg>
                    <div className="detail-content">
                        <div className="detail-label">Description</div>
                        <div className="detail-value">{event.description}</div>
                    </div>
                </div>
            </div>
            <div className="modal-footer" />
        </div>
    </div>
);

const UserProfilePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { uid, fullName: nameFromNav } = location.state || {};

    const [user, setUser] = useState({
        uid: uid || '',
        fullName: nameFromNav || '',
        profileImageUrl: '',
        about: ''
    });

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (!uid || !nameFromNav) navigate('/dashboard');
    }, [uid, nameFromNav, navigate]);

    useEffect(() => {
        if (!uid) return;
        const userRef = ref(db, `users/${uid}`);
        const unsubscribe = onValue(userRef, snapshot => {
            const data = snapshot.val();
            if (data) {
                setUser({
                    uid,
                    fullName: data.fullName || '',
                    profileImageUrl: data.profileImageUrl || '',
                    about: data.about || ''
                });
            }
        });
        return () => unsubscribe();
    }, [uid]);

    return (
        <div className="app-container" style={{ paddingTop: '24px' }}>
            <link rel="stylesheet" href="universal-styles.css" />
            <div style={{ maxWidth: 1200, margin: '0 auto 12px' }}>
                <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', maxHeight: 1, paddingBottom: 10, cursor: 'pointer', marginLeft: 12, color: '#78909c' }}>
                    <ArrowBackIcon />
                    <div style={{ fontSize: 12, marginLeft: 6 }}>BACK</div>
                </div>
            </div>
            <div className="profile-grid" style={{ margin: '0 auto', padding: '0 16px', maxWidth: '1200px' }}>
                <div className="profile-left-panel" style={{ borderRadius: 16 }}>
                    <div className="profile-header">
                        <div style={{ width: 120, height: 120, borderRadius: '50%', backgroundColor: '#F3F5F7', margin: '0 auto 36px', backgroundImage: `url(${process.env.PUBLIC_URL}/userIMG.png)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', border: '1px solid #ffffff' }}>
                            <motion.img initial={{ opacity: 0, filter: "blur(7px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.6, delay: 1.9 }} src={user.profileImageUrl} className="profile-avatar" />
                        </div>
                        <h2 className="profile-name">{user.fullName}</h2>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '16px 0 16px 0' }}>About</p>
                        {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
                      
                      
                      
                      
                        <Modal_Edit_Profile
                            userId={uid}
                            // refreshUser={() => window.location.reload()}
                        />


                        {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
                        {showContactModal && <ContactOrganizerModal organizerName={user.fullName} onClose={() => setShowContactModal(false)} />}
                        {showEditModal && <Modal_Edit_Profile userId={user.uid} refreshUser={() => window.location.reload()} onClose={() => setShowEditModal(false)} />}

                        <br />


                        {/* <Button onClick={() => setShowContactModal(true)} variant="contained" endIcon={<SendIcon />} style={{ color: 'white', backgroundColor: '#0A47A3', borderRadius: 8, boxShadow: 'none', height: 38 }}>
                            Contact Organizer
                        </Button> */}

                    </div>
                </div>
                <div className="profile-container_card" style={{ background: '#ffffff', padding: 16, borderRadius: 16 }}>
                    <h3 className="section-title" style={{ fontSize: '1.17em', marginBottom: '24px', paddingBottom: '8px', display: 'inline-block', marginLeft: 40, color: '#78909c' }}>Upcoming Events</h3>
                    <EventList creatorName={user.fullName} date="upcoming" />
                    <h3 className="section-title" style={{ fontSize: '1.17em', marginBottom: '24px', paddingBottom: '8px', display: 'inline-block', marginLeft: 40, color: '#78909c' }}>Past Events</h3>
                    <EventList creatorName={user.fullName} date="past" />
                </div>
            </div>

        </div>
    );
};

export default UserProfilePage;
