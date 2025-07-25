import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref as dbRef, onValue, update } from 'firebase/database';
import { push, set } from "firebase/database";

import { getAuth } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { pink } from '@mui/material/colors';

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";

import GroupIcon from '@mui/icons-material/Group';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import UpdateIcon from '@mui/icons-material/Update';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';

import NotificationOnTop from './NotificationOnTop'

import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Card,
    CardContent,
    CardMedia,
    Button,
    Typography,
    Grid,

} from '@mui/material';
import { get } from 'firebase/database';

import { useMediaQuery } from '@mui/material';


const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const smallerThan = useMediaQuery('(max-width:600px)');

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);

    const fetchEventAndShowModal = async (eventId) => {
        const db = getDatabase();
        const eventRef = dbRef(db, `events/${eventId}`);
        try {
            const snapshot = await get(eventRef);
            if (snapshot.exists()) {
                setSelectedEvent(snapshot.val());
                setShowEventModal(true);
            } else {
                console.log("⚠️ Event not found");
            }
        } catch (error) {
            console.error("❌ Failed to fetch event:", error);
        }
    };


    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.log("❌ No user logged in for notifications");
            setLoading(false);
            return;
        }

        console.log("👤 Setting up notifications for user:", user.uid);

        const db = getDatabase();
        const notificationsRef = dbRef(db, `notifications/${user.uid}`);

        // Listen for real-time notifications updates
        const unsubscribe = onValue(notificationsRef, (snapshot) => {
            console.log("🔔 Notifications data received:", snapshot.val());

            const data = snapshot.val();
            if (data) {
                const notificationsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));

                // Sort by timestamp (newest first)
                notificationsArray.sort((a, b) => b.timestamp - a.timestamp);

                console.log("📋 Processed notifications:", notificationsArray);
                setNotifications(notificationsArray);

                // Count unread notifications
                const unread = notificationsArray.filter(n => !n.read).length;
                setUnreadCount(unread);
                console.log("🔢 Unread count:", unread);
            } else {
                console.log("📭 No notifications found");
                setNotifications([]);
                setUnreadCount(0);
            }
            setLoading(false);
        }, (error) => {
            console.error("❌ Error listening to notifications:", error);
            setLoading(false);
        });

        return () => {
            console.log("🔌 Unsubscribing from notifications");
            unsubscribe();
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (notificationId) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.log("❌ No user logged in to mark notification as read");
            return;
        }

        const db = getDatabase();
        const notificationRef = dbRef(db, `notifications/${user.uid}/${notificationId}`);

        try {
            await update(notificationRef, { read: true });
            console.log("✅ Notification marked as read:", notificationId);
        } catch (error) {
            console.error('❌ Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.log("❌ No user logged in to mark all notifications as read");
            return;
        }

        const db = getDatabase();
        const updates = {};

        notifications.forEach(notification => {
            if (!notification.read) {
                updates[`notifications/${user.uid}/${notification.id}/read`] = true;
            }
        });

        try {
            await update(dbRef(db), updates);
            console.log("✅ All notifications marked as read");
        } catch (error) {
            console.error('❌ Error marking all notifications as read:', error);
        }
    };

    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [contactMessage, setContactMessage] = useState('');


    const handleNotificationClick = (notification) => {
        console.log("🖱️ Notification clicked:", notification);

        // Mark as read when clicked
        if (!notification.read) {
            markAsRead(notification.id);
        }

        // RSVP type → show modal instead of navigating
        if (notification.type === 'rsvp' && notification.eventId) {
            fetchEventAndShowModal(notification.eventId);
            return; // stop further navigation
        }

        // Close dropdown
        setShowDropdown(false);

        // Navigate based on notification type with better logic
        try {
            if (notification.eventId) {
                // Navigate to dashboard and scroll to event or show event details
                console.log("🎯 Navigating to dashboard for event:", notification.eventTitle);
                navigate('/dashboard', {
                    state: {
                        eventId: notification.eventId,
                        highlightEvent: true
                    }
                });
            } else if (notification.type === 'contact') {

                console.log("💬 Showing modal for contact message");
                setContactMessage(notification.text || 'No message content');
                setContactModalOpen(true);
                return; // Stop further navigation
            } else {
                // Default navigation
                console.log("📍 Default navigation to dashboard");
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("❌ Navigation error:", error);
            // Fallback navigation
            navigate('/dashboard');
        }
    };

    const handleBellClick = () => {
        console.log("🔔 Bell clicked, dropdown visible:", !showDropdown);
        setShowDropdown(!showDropdown);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'rsvp_cancelled':
                return <NotificationsNoneIcon style={{ color: '#d81b60' }} />;
            case 'group':
                return <GroupIcon style={{ color: '#546e7a' }} />;
            case 'invitation':
            case 'invitation_accepted':
                return <NotificationsNoneIcon style={{ color: '#0097a7' }} />;
            case 'contact':
                return <ChatBubbleOutlineIcon style={{ color: '#546e7a' }} />;
            case 'update':
                return <UpdateIcon style={{ color: '#6d4c41' }} />;
            default:
                return <NotificationsNoneIcon style={{ color: '#546e7a' }} />;
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp;

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;

        return new Date(timestamp).toLocaleDateString();
    };

    // Debug information
    useEffect(() => {
        console.log("🐛 Debug - Notifications state:", notifications);
        console.log("🐛 Debug - Unread count:", unreadCount);
        console.log("🐛 Debug - Loading:", loading);
    }, [notifications, unreadCount, loading]);





    const [isAttending, setIsAttending] = useState(false);


    useEffect(() => {
        if (!selectedEvent?.id) return;

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const checkIfUserIsAttending = async () => {
            try {
                const db = getDatabase();
                const ref = dbRef(db, `events/${selectedEvent.id}/attendees/${user.uid}`);
                const snapshot = await get(ref);
                setIsAttending(snapshot.exists());
            } catch (error) {
                console.error("❌ Failed to check RSVP status:", error);
            }
        };

        checkIfUserIsAttending();
    }, [selectedEvent]);





    // const handleRSVP = async () => {
    //     const auth = getAuth();
    //     const user = auth.currentUser;

    //     if (!user || !selectedEvent?.id) {
    //         console.log("❌ Missing user or event ID");
    //         return;
    //     }

    //     const db = getDatabase();
    //     const attendeeRef = dbRef(db, `events/${selectedEvent.id}/attendees/${user.uid}`);

    //     try {
    //         const userData = {
    //             fullName: user.displayName || "Anonymous",
    //             profileImageUrl: user.photoURL || ""
    //         };

    //         await update(attendeeRef, userData);
    //         console.log("✅ RSVP saved with full user data");
    //         setIsAttending(true);
    //         setShowEventModal(false);
    //         navigate('/dashboard', {
    //             state: {
    //                 eventId: selectedEvent.id,
    //                 highlightEvent: true
    //             }
    //         });
    //     } catch (error) {
    //         console.error("❌ RSVP failed:", error);
    //     }
    // };


    const handleRSVP = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !selectedEvent?.id) {
            console.log("❌ Missing user or event ID");
            return;
        }

        const db = getDatabase();
        const attendeeRef = dbRef(db, `events/${selectedEvent.id}/attendees/${user.uid}`);

        try {
            const userData = {
                fullName: user.displayName || "Anonymous",
                profileImageUrl: user.photoURL || ""
            };

            await update(attendeeRef, userData);
            console.log("✅ RSVP saved with full user data");

            // 🔔 SEND NOTIFICATION with type "invitation_accepted"
            const organizerUid = selectedEvent.organizer?.uid;
            if (organizerUid) {
                const notificationRef = dbRef(db, `notifications/${organizerUid}`);
                const newNotificationRef = push(notificationRef);
                const timestamp = Date.now();

                await set(newNotificationRef, {
                    id: newNotificationRef.key,
                    read: false,
                    type: "invitation_accepted",
                    text: `${user.displayName || "Someone"} accepted the invitation to ${selectedEvent.title}.`,
                    timestamp,
                    senderName: user.displayName || "Anonymous",
                    senderEmail: user.email || "",
                    message: "" // optional
                });
            }

            setIsAttending(true);
            setShowEventModal(false);
            navigate('/dashboard', {
                state: {
                    eventId: selectedEvent.id,
                    highlightEvent: true
                }
            });
        } catch (error) {
            console.error("❌ RSVP failed:", error);
        }
    };


    const [showFullDescription, setShowFullDescription] = useState(false);


    const dialogPopupEvent = (


        <Dialog
            open={showEventModal}
            onClose={() => setShowEventModal(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                style: {
                    borderRadius: "16px",
                    width: 'auto',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0)'
                },
            }}
        >
            <Card
                className="card-wrapper-event-list"
                sx={{

                    borderRadius: "16px",

                    boxShadow: "none",
                    border: "none",
                    width: 320,
                    height: 'auto',


                }}
            >



                <>
                    <motion.div
                        initial={{ opacity: 0, scale: 1, filter: "blur(7px)", }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)", }}
                        transition={{ duration: 1.2, delay: 0.0 }}
                        style={{
                            backgroundColor: "#F3F5F7",
                            backgroundImage: `url(${process.env.PUBLIC_URL}/imageBG_s.svg)`,
                            backgroundSize: "66%", // Scale image to 23% of container
                            backgroundPosition: "center", // Centre the image
                            backgroundRepeat: "no-repeat", // Do not repeat the image

                            height: 'auto',
                        }}
                    >
                        <CardMedia
                            component="img"
                            // alt={event.title}
                            image={selectedEvent?.imageUrl}

                            sx={{
                                objectFit: "cover",
                                height: 160,
                                minHeight: 160,
                                overflowY: 'auto'
                            }}
                        />
                    </motion.div>

                    <CardContent>
                        <div style={{ maxHeight: '220px', overflowY: 'auto', padding: '4px 12px 0' }}>
                            <Typography
                                variant="h5"
                                color="text.primary"
                                style={{
                                    fontWeight: 600,
                                    marginBottom: '4px',
                                    fontSize: '18px',
                                    color: '#37474f'
                                }}
                            >
                                {selectedEvent?.title || ''}
                            </Typography>

                            {/* <div> */}

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                style={{ marginBottom: '4px', fontSize: '14px', color: '#546e7a' }}
                            >
                                <strong>Date and Time:</strong><br />
                                {selectedEvent?.dateTime?.seconds
                                    ? new Date(selectedEvent.dateTime.seconds * 1000).toLocaleString('en-GB')
                                    : ''}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                style={{ marginBottom: '4px', fontSize: '14px', color: '#546e7a' }}
                            >
                                <strong>Location:</strong><br />
                                {selectedEvent?.location || ''}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                style={{ fontSize: '14px', color: '#546e7a' }}
                            >
                                <strong>Description:</strong>
                                <br />
                                {showFullDescription
                                    ? selectedEvent?.description
                                    : (selectedEvent?.description?.length > 100
                                        ? selectedEvent.description.slice(0, 100) + '...'
                                        : selectedEvent?.description || '')}
                            </Typography>

                            {selectedEvent?.description?.length > 100 && (
                                <div style={{ textAlign: 'center' }}>
                                    <Button
                                        variant="text"
                                        onClick={() => setShowFullDescription(prev => !prev)}
                                        style={{
                                            padding: 0,
                                            marginTop: 2,
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            textTransform: 'none',
                                            color: '#0A47A3',
                                        }}
                                    >
                                        {showFullDescription ? 'Less' : 'More'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </>


                <Grid
                    container
                    spacing={1}
                    sx={{
                        padding: "8px",
                        borderRadius: "8px",
                        width: "10",
                        display: "flex",
                        justifyContent: "center",

                        backgroundColor: "#ffffffff",
                        paddingBottom: "16px",
                    }}
                >



                    <Button
                        fullWidth
                        variant="contained"
                        color="success"

                        onClick={handleRSVP}
                        style={{
                            width: "80%",
                            color: "white",
                            backgroundColor: "#0A47A3",
                            borderRadius: 8,
                            boxShadow: "6px -6px 20px rgba(255, 255, 255, 1)",
                        }}
                    >
                        RSVP
                    </Button>

                </Grid>


            </Card>


        </Dialog>
    )


    const dialogPopupMessage = (
        <Dialog
            open={contactModalOpen}
            onClose={() => setContactModalOpen(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                style: {
                    borderRadius: "16px",
                    padding: "20px",
                    top: '70px' // Move modal up
                },
            }}
        >
            <DialogTitle style={{ fontSize: '18px', fontWeight: '600', color: '#37474f', }}>
                Message from User
            </DialogTitle>

            <div style={{ borderBottom: '0.3px solid #cfd8dc', }} />

            <DialogContent>
                <Typography style={{ fontSize: '16px', color: '#455a64' }}>
                    {contactMessage}
                </Typography>

                <div style={{ borderBottom: '0.3px solid #cfd8dc', marginTop: 12 }} />

                <Typography style={{ fontSize: '14px', color: '#546e7a', marginTop: '12px' }}>
                    You can check your email for the full message.
                </Typography>
            </DialogContent>

            <DialogActions style={{ justifyContent: 'center' }}>
                <Button
                    onClick={() => setContactModalOpen(false)}
                    variant="contained"
                    style={{
                        backgroundColor: '#ffffffff',
                        color: 'rgb(245, 0, 87)',
                        borderRadius: 8,
                        padding: '6px 20px',
                        boxShadow: 'none'
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )


    const [userNotificationsList, setUserNotificationsList] = useState([]);
    const [topNotification, setTopNotification] = useState(false);
    const latestSeenNotificationRef = useRef([]);

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) return;

        const db = getDatabase();
        const userNotificationsRef = dbRef(db, `notifications/${currentUser.uid}`);

        const unsubscribe = onValue(userNotificationsRef, (snapshot) => {
            const rawData = snapshot.val();
            if (!rawData) return;

            const newNotificationsArray = Object.keys(rawData).map(key => ({
                id: key,
                ...rawData[key]
            }));

            newNotificationsArray.sort((a, b) => b.timestamp - a.timestamp);

            const newestNotification = newNotificationsArray[0];

            if (
                newestNotification &&
                newestNotification.id !== latestSeenNotificationRef.current?.[0]?.id
            ) {
                // alert("🔔 New notification received!");
                latestSeenNotificationRef.current = [newestNotification];

                setTopNotification(true)

                // alert('1')

                setTimeout(() => {
                    setTopNotification(false)
                    // alert('12')

                }, 7000);
            }

            setUserNotificationsList(newNotificationsArray);
        });

        return () => unsubscribe();
    }, []);



    return (

        <div >

            {topNotification &&
                <NotificationOnTop
                    notifications={notifications}
                />
            }

            {dialogPopupEvent}
            {dialogPopupMessage}


            <div className="notification-container" ref={dropdownRef}>
                <IconButton
                    onClick={handleBellClick}
                    color="inherit"
                    sx={{ position: 'relative' }}
                >
                    <NotificationsIcon />
                    {unreadCount > 0 && (
                        <motion.div
                            initial={{ y: -16, opacity: 0, scale: 5 }}
                            animate={{ y: -16, opacity: 1, scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                delay: 0.6
                            }}
                        >
                            <Badge
                                badgeContent={unreadCount > 99 ? '99+' : unreadCount}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: pink.A200,
                                        color: 'white',
                                        fontSize: '11px',
                                        minWidth: '18px',
                                        height: '18px'
                                    }
                                }}
                            />
                        </motion.div>
                    )}
                </IconButton>

                <AnimatePresence>
                    {showDropdown && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="notification-dropdown"
                            style={{
                                position: 'absolute',
                                top: '53.8px',
                                // right: '0',
                                left: smallerThan ? -126 : -300,

                                width: '380px',
                                maxWidth: '90vw',
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                border: '0.3px solid #cfd8dc',
                                zIndex: 1000,
                                overflow: 'hidden',
                                background: '#ffffff',
                                // backdropFilter: 'blur(16px)',
                                // WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: 32
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                padding: '20px 24px 16px',
                                borderBottom: '0.3px solid #cfd8dc',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#1f2937'
                                }}>
                                    Notifications {loading && '(Loading...)'}
                                </h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#FF4081',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            padding: '4px 8px',
                                            borderRadius: '8px',
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div
                                style={{
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    background: 'rgba(255, 255, 255, 0)'
                                }}
                            >
                                {loading ? (
                                    <div style={{
                                        padding: '40px 24px',
                                        textAlign: 'center',
                                        color: '#6b7280',
                                        background: '#ffffff00'
                                    }}>
                                        <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳</div>
                                        <p style={{ margin: 0, fontSize: '16px' }}>Loading notifications...</p>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div
                                        style={{
                                            padding: '40px 24px',
                                            textAlign: 'center',
                                            color: '#6b7280'
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: '48px',
                                                marginBottom: '12px',
                                                color: '#6b7280'
                                            }}
                                        >
                                            <NotificationsNoneIcon />
                                        </div>
                                        <p
                                            style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                                            No notifications yet
                                        </p>
                                        <p style={{ margin: '4px 0 0', fontSize: '14px' }}>
                                            We'll notify you when something happens
                                        </p>
                                    </div>
                                ) : (
                                    notifications
                                        // ✅ Only show unread ones
                                        .filter(notification => !notification.read)
                                        .map((notification, index) => (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleNotificationClick(notification)}
                                                style={{
                                                    display: 'flex',
                                                    gap: '12px',
                                                    padding: '16px 24px',
                                                    borderBottom: index < notifications.length - 1 ? '1px solid #f3f4f6' : 'none',
                                                    backgroundColor: notification.read ? 'white' : '#ffffff88',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s',
                                                    fontWeight: 400,
                                                    color: '#78909c',
                                                    background: '#44444400',

                                                }}
                                                onMouseEnter={(e) => {
                                                    if (notification.read) {
                                                        e.currentTarget.style.backgroundColor = '#F3F5F7';
                                                    } else {
                                                        e.currentTarget.style.backgroundColor = '#eceff1';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = notification.read ? 'white' : '#f8fafc';
                                                }}
                                            >

                                                {/* Icon */}
                                                <div style={{
                                                    flexShrink: 0,
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '8px',
                                                    backgroundColor: notification.read ? 'rgba(35, 149, 224, 0)' : '#ffffff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '18px'
                                                }}>
                                                    {getNotificationIcon(notification.type)}
                                                </div>



                                                {/* Content */}
                                                <div
                                                    style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '14px',
                                                        fontWeight: 400,
                                                        color: '#546e7a',
                                                        lineHeight: '1.5',
                                                        // fontWeight: notification.read ? '400' : '500'
                                                    }}
                                                    >

                                                        {
                                                            //    notification.text
                                                            console.log('A ', notification)
                                                        }
                                                        {
                                                            notification.text
                                                            // console.log('A ',notification)
                                                        }
                                                    </p>
                                                    <p style={{
                                                        margin: '4px 0 0',
                                                        fontSize: '12px',
                                                        color: '#9ca3af'
                                                    }}>
                                                        {formatTimestamp(notification.timestamp)}
                                                    </p>
                                                </div>

                                                {/* Unread indicator */}
                                                {!notification.read && (
                                                    <div
                                                        style={{
                                                            // flexShrink: 0,
                                                            // width: '6px',
                                                            // height: '6px',
                                                            // borderRadius: '50%',
                                                            // backgroundColor: '#FF4081',
                                                            // marginTop: 'px'

                                                        }}
                                                    />
                                                )}
                                            </motion.div>
                                        ))
                                )}
                            </div>


                        </motion.div >
                    )}
                </AnimatePresence >

                <style jsx>{`
                .notification-container {
                    position: relative;
                    right::'-50px'
                }
                
                .notification-dropdown::-webkit-scrollbar {
                    width: 6px;
                }
                
                .notification-dropdown::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                
                .notification-dropdown::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                
                .notification-dropdown::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
            </div >
        </div>

    );
};

export default NotificationDropdown;