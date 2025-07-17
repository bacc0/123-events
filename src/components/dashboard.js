


import React, { useState, useEffect, useRef, useMemo } from 'react';
import { database } from "../firebase";
import { ref as dbRef, get, child, set } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
// import { EventDetailsModal, EditEventModal, ConfirmationModal } from './EventModals';
import { motion } from 'framer-motion';

// Reusable Components
const EventDetailsModal = ({ event, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2 className="modal-title">{event.title}</h2>
                <button className="close-button" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="modal-body">
                {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="modal-image" onError={(e) => { e.target.style.display = 'none'; }} />}
                <div style={{ display: 'grid', gap: '20px' }}>
                    <div className="detail-item">
                        <svg className="detail-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                        </svg>
                        <div className="detail-content">
                            <div className="detail-label">Date & Time</div>
                            <div className="detail-value">{new Date(event.date).toLocaleDateString('en-GB')} at {event.time}</div>
                        </div>
                    </div>
                    <div className="detail-item">
                        <svg className="detail-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                        </svg>
                        <div className="detail-content">
                            <div className="detail-label">Location</div>
                            <div className="detail-value">{event.location}</div>
                        </div>
                    </div>
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
        </div>
    </div>
);

const EditEventModal = ({ event, onSave, onClose }) => {
    // Use imageUrl consistently
    const [formData, setFormData] = useState({
        ...event,
        imageUrl: event.imageUrl || ""
    });
    const [imagePreview, setImagePreview] = useState(event.imageUrl || "");
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                // Don't set image in formData, just preview; imageUrl will be updated after upload
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.description) {
            alert("Please fill in all required fields.");
            return;
        }

        // Use imageFile from useState, and pass imageUrl as well
        onSave({ ...formData, imageFile: imageFile });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Edit Event</h2>
                    <button className="close-button" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form">
                            <div className="form-group">
                                <label className="form-label" htmlFor="title">Event Title</label>
                                <input className="form-input" type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="date">Date</label>
                                    <input className="form-input" type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="time">Time</label>
                                    <input className="form-input" type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="location">Location</label>
                                <input className="form-input" type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Event Image</label>
                                <input type="file" id="image-upload-edit" accept="image/*" onChange={handleImageChange} className="hidden" className="form-group" />
                                <label htmlFor="image-upload-edit" className="image-upload" >
                                    Click to upload image
                                </label>
                                {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" style={{ maxWidth: 360, maxHeight: 360, display: 'block', margin: '30px auto 0' }} />}
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="description">Description</label>
                                <textarea className="form-textarea" id="description" name="description" value={formData.description} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CreateEventPage = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({ title: '', date: '', time: '', location: '', description: '', imageUrl: '' });
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleImageChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            try {
                setUploading(true);
                const storage = getStorage();
                const imageRef = storageRef(storage, `event_images/${Date.now()}_${file.name}`);
                await uploadBytes(imageRef, file);
                const url = await getDownloadURL(imageRef);
                setFormData(prev => ({ ...prev, imageUrl: url }));
                console.log("✅ Image uploaded immediately:", url);
            } catch (error) {
                console.error("❌ Image upload error:", error);
                alert("There was an error uploading the image. Please try again.");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.description) {
            alert("Please fill in all required fields.");
            return;
        }

        if (!formData.imageUrl) {
            alert("Please wait for the image to finish uploading before submitting.");
            return;
        }

        onSave({ ...formData, id: Date.now(), attendees: 0, status: 'upcoming' });
    };

    return (
        <main className="main-content" style={{ maxWidth: '678px' }}>
            <div className="section-header">
                <h1 className="section-title page-title">Create New Event</h1>
                <button className="btn btn-outline" onClick={onCancel}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>
            <div className="card card-padded">
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="title">Event Title</label>
                        <input className="form-input" type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Summer Music Festival" required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="date">Date</label>
                            <input className="form-input" type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="time">Time</label>
                            <input className="form-input" type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="location">Location</label>
                        <input className="form-input" type="text" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Hyde Park, London" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Event Image</label>
                        <input type="file" id="image-upload-create" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <label htmlFor="image-upload-create" className="image-upload">
                            {uploading ? "Uploading image..." : <>Click to upload image <span style={{ fontSize: '0.62rem', color: '#999' }}>  Suggested aspect ratio 2:1 </span></>}
                        </label>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" style={{ maxWidth: 360, maxHeight: 360, display: 'block', margin: '30px auto 0' }} />}
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Description</label>
                        <textarea className="form-textarea" id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your event..." required />
                    </div>
                    <div className="modal-footer" style={{ padding: 0, borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Event</button>
                    </div>
                </form>
            </div>
        </main>
    );
};

const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmText }) => (
    <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5 }}>{message}</p>
            </div>
            <div className="modal-footer" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <button onClick={onCancel} className="btn btn-outline">Cancel</button>
                <button onClick={onConfirm} className="btn btn-danger" style={{ color: 'white', backgroundColor: 'var(--danger-color)' }}>{confirmText}</button>
            </div>
        </div>
    </div>
);

const App = () => {
    const [myEvents, setMyEvents] = useState([]);
    const [attendingEvents, setAttendingEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const dbRefInstance = dbRef(database);
                const snapshot = await get(child(dbRefInstance, "events"));
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const eventsArray = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                        date: data[key].dateTime ? new Date(data[key].dateTime._seconds * 1000).toISOString().split("T")[0] : "",
                        imageUrl: data[key].imageUrl || "",
                    }));
                    console.log("Loaded events from Realtime DB:", eventsArray);
                    setAllEvents(eventsArray);
                } else {
                    console.log("⚠️ No data available in 'events'.");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState('discover');
    const [currentView, setCurrentView] = useState('dashboard');
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [confirmingAction, setConfirmingAction] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notificationRef]);

    const handleCreateEvent = async (newEvent) => {
        try {
            let imageUrl = newEvent.imageUrl; // Use imageUrl already uploaded

            // Generate custom ID
            const keyName = `_v_${newEvent.title.toLowerCase().replace(/\s+/g, "_")}_${new Date(newEvent.date).getFullYear()}`;

            // Create event data with correct imageUrl
            const eventData = {
                ...newEvent,
                id: keyName,
                imageUrl: imageUrl,
                attendeesCount: 0,
                status: 'upcoming'
            };

            const databaseEventRef = dbRef(database, `events/${keyName}`);
            await set(databaseEventRef, eventData);

            setMyEvents(prev => [{ ...eventData }, ...prev]);
            setAllEvents(prev => [{ ...eventData }, ...prev]);
            alert(`Event "${newEvent.title}" created successfully!`);
            setCurrentView('dashboard');
        } catch (error) {
            console.error("Error creating event:", error);
            alert("There was an error creating the event. Please check console for details.");
        }
    };
    const handleUpdateEvent = (updatedEvent) => {
        setMyEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        setAllEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        alert(`Event "${updatedEvent.title}" updated successfully!`);
        setEditingEvent(null);
    };

    const handleRsvp = (eventToRsvp) => {
        if (myEvents.some(e => e.id === eventToRsvp.id) || attendingEvents.some(e => e.id === eventToRsvp.id)) return;
        setAttendingEvents(prev => [...prev, { ...eventToRsvp, rsvpStatus: 'accepted' }]);
        alert(`You have successfully RSVP'd to "${eventToRsvp.title}"!`);
    };

    const handleCancelRsvp = (eventToLeave) => {
        setAttendingEvents(prev => prev.filter(e => e.id !== eventToLeave.id));
        setConfirmingAction(null);
    };

    const handleDeleteEvent = (eventToDelete) => {
        setMyEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
        setAllEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
        setConfirmingAction(null);
    };

    const clearFilters = () => {
        setLocationFilter('');
        setStartDateFilter('');
        setEndDateFilter('');
    };

    const publicEvents = useMemo(() => {
        return allEvents.filter(event => {
            const keywordMatch = searchQuery === "" ||
                (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));

            const locationMatch = locationFilter === "" ||
                (event.location && event.location.toLowerCase().includes(locationFilter.toLowerCase()));

            const startDate = startDateFilter ? new Date(startDateFilter) : null;
            const endDate = endDateFilter ? new Date(endDateFilter) : null;
            const eventDate = new Date(event.date);

            if (startDate) startDate.setHours(0, 0, 0, 0);
            if (endDate) endDate.setHours(23, 59, 59, 999);

            const dateMatch =
                (!startDate || eventDate >= startDate) &&
                (!endDate || eventDate <= endDate);

            return keywordMatch && locationMatch && dateMatch;
        });
    }, [allEvents, searchQuery, locationFilter, startDateFilter, endDateFilter]);

    // Immediate search handler
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Immediate location filter handler
    const handleLocationChange = (e) => {
        setLocationFilter(e.target.value);
    };

    const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const unreadCount = notifications.filter(n => !n.read).length;

    const renderEventCard = (event) => {
        const isMyEvent = myEvents.some(e => e.id === event.id);
        const isAttending = attendingEvents.some(e => e.id === event.id);

        return (
            <motion.div
                // initial={{  opacity: 0,}}
                // animate={{ opacity: 1}}
                // transition={{ duration: 0.3, delay: 0.4}}

                key={event.id} className="event-card">
                {event.imageUrl ? (
                    <motion.img
                    style={{background: '#E5E5E5'}}
                        initial={{ opacity: 0, scale : 1, filter: "blur(7px)" }}
                        animate={{ opacity: 1 ,scale:1, filter: "blur(0px)" }}
                        transition={{ duration: 1.2, delay: 0.0 }}

                        src={event.imageUrl} alt={event.title} className="event-image" onError={(e) => { e.target.onerror = ""; e.target.src = 'https://placehold.co/400x240/f8f9fa/9ca3af?text=No+Image'; }}
                         />
                ) : (
                    <div className="event-image-placeholder">
                        <svg width="40" height="40" viewBox="0 0 16 16" fill="#9CA3AF">
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093L6.5 10.5l-2.777-2.947a.5.5 0 0 0-.577-.093L.002 9.5V3a1 1 0 0 1 1-1h12z" />
                        </svg>
                    </div>
                )}
                <div className="event-content">
                    <div>
                        <h3 className="event-title">{event.title}</h3>
                        <div className="event-meta">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                            </svg>
                            {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                        </div>
                        <div className="event-meta">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                            </svg>
                            {event.location}
                        </div>
                    </div>
                    <div className="event-actions">
                        {isMyEvent ? (
                            <>
                                <button className="btn btn-secondary" onClick={() => setSelectedEvent(event)}>Details</button>
                                <button className="btn btn-primary" onClick={() => setEditingEvent(event)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => setConfirmingAction({ type: 'delete', event })}>Cancel</button>
                            </>
                        ) : isAttending ? (
                            <>
                                <button className="btn btn-danger" onClick={() => setConfirmingAction({ type: 'rsvp_cancel', event })}>Cancel RSVP</button>
                                <button className="btn" style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }} onClick={() => setSelectedEvent(event)}>Details</button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-secondary" onClick={() => setSelectedEvent(event)}>Details</button>
                                <button className="btn btn-primary" onClick={() => handleRsvp(event)}>RSVP</button>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="app-container">
            <link rel="stylesheet" href="universal-styles.css" />


            {currentView === 'dashboard' ? (
                <main className="main-content">
                    <h3>Events</h3>
                    <div className="card card-padded">
                        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div className="search-box">
                                    <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                    </svg>
                                    <input type="text" placeholder="Search by keyword..." value={searchQuery} onChange={handleSearchChange} className="search-input" />
                                </div>
                                <button className="btn btn-outline" onClick={() => setShowFilters(!showFilters)}>Filters</button>
                            </div>
                            <button className="btn btn-primary" onClick={() => setCurrentView('createEvent')}>Create Event</button>
                        </div>
                        {showFilters && (
                            <div className="filter-panel">
                                <div className="filter-group">
                                    <label className="filter-label" htmlFor="location">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        className="form-input"
                                        placeholder="e.g. London"
                                        value={locationFilter}
                                        onChange={handleLocationChange}
                                    />
                                </div>
                                <div className="filter-group">
                                    <label className="filter-label" htmlFor="start-date">From</label>
                                    <input type="date" id="start-date" className="form-input" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
                                </div>
                                <div className="filter-group">
                                    <label className="filter-label" htmlFor="end-date">To</label>
                                    <input type="date" id="end-date" className="form-input" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
                                </div>
                                <button className="btn btn-outline" onClick={clearFilters}>Clear</button>
                            </div>
                        )}
                        <div className="tabs">
                            <button className={`tab ${activeTab === 'discover' ? 'tab-active' : ''}`} onClick={() => setActiveTab('discover')}>Discover</button>
                            <button className={`tab ${activeTab === 'myEvents' ? 'tab-active' : ''}`} onClick={() => setActiveTab('myEvents')}>My Events</button>
                            <button className={`tab ${activeTab === 'attending' ? 'tab-active' : ''}`} onClick={() => setActiveTab('attending')}>Attending</button>
                        </div>
                        <div className="events-grid">
                            {activeTab === 'discover' && (
                                publicEvents.length > 0 ? publicEvents.map(event => renderEventCard(event)) :
                                    <div className="empty-state"><p>No events match your criteria.</p></div>
                            )}
                            {activeTab === 'myEvents' && (
                                myEvents.length > 0 ? myEvents.map(event => renderEventCard(event)) :
                                    <div className="empty-state"><p>You haven't created any events.</p></div>
                            )}
                            {activeTab === 'attending' && (
                                attendingEvents.length > 0 ? attendingEvents.map(event => renderEventCard(event)) :
                                    <div className="empty-state"><p>You are not attending any events.</p></div>
                            )}
                        </div>
                    </div>
                </main>
            ) : (
                <CreateEventPage onSave={handleCreateEvent} onCancel={() => setCurrentView('dashboard')} />
            )}

            {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
            {editingEvent && <EditEventModal event={editingEvent} onSave={handleUpdateEvent} onClose={() => setEditingEvent(null)} />}
            {confirmingAction && <ConfirmationModal
                title={confirmingAction.type === 'delete' ? 'Cancel Event' : 'Cancel RSVP'}
                message={confirmingAction.type === 'delete' ? `Are you sure you want to permanently cancel and delete "${confirmingAction.event.title}"? This action cannot be undone.` : `Are you sure you want to cancel your RSVP for "${confirmingAction.event.title}"?`}
                confirmText={confirmingAction.type === 'delete' ? 'Yes, Cancel Event' : 'Yes, Cancel RSVP'}
                onConfirm={() => confirmingAction.type === 'delete' ? handleDeleteEvent(confirmingAction.event) : handleCancelRsvp(confirmingAction.event)}
                onCancel={() => setConfirmingAction(null)}
            />}

        </div>
    );
};

export default App;