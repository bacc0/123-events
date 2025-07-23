import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref as dbRef, onValue, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { pink } from '@mui/material/colors';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

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

    const handleNotificationClick = (notification) => {
        console.log("🖱️ Notification clicked:", notification);

        // Mark as read when clicked
        if (!notification.read) {
            markAsRead(notification.id);
        }

        // Close dropdown first
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
                // Navigate to profile or messages
                console.log("💬 Navigating to dashboard for contact message");
                navigate('/dashboard');
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
            case 'rsvp':
            case 'rsvp_cancelled':
                return '👥';
            case 'invitation':
            case 'invitation_accepted':
                return '📧';
            case 'contact':
                return '💬';
            case 'update':
                return '🔄';
            default:
                return '🔔';
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

    return (
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
                            top: '50px',
                            right: '0',
                            width: '380px',
                            maxWidth: '90vw',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            border: '0.3px solid #cfd8dc',
                            zIndex: 1000,
                            overflow: 'hidden',
                            // background: '#ffffffbb',
                            // backdropFilter: 'blur(16px)',
                            // WebkitBackdropFilter: 'blur(16px)',
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
                                        color: '#0d47a1',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        borderRadius: '8px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div style={{
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}>
                            {loading ? (
                                <div style={{
                                    padding: '40px 24px',
                                    textAlign: 'center',
                                    color: '#6b7280'
                                }}>
                                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳</div>
                                    <p style={{ margin: 0, fontSize: '16px' }}>Loading notifications...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div style={{
                                    padding: '40px 24px',
                                    textAlign: 'center',
                                    color: '#6b7280'
                                }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
                                    <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                                        No notifications yet
                                    </p>
                                    <p style={{ margin: '4px 0 0', fontSize: '14px' }}>
                                        We'll notify you when something happens
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notification, index) => (
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
                                            backgroundColor: notification.read ? 'white' : '#f8fafc',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (notification.read) {
                                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                            } else {
                                                e.currentTarget.style.backgroundColor = '#f1f5f9';
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
                                            borderRadius: '16px',
                                            backgroundColor: notification.read ? '#f3f4f6' : '#e0f2fe',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px'
                                        }}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                color: '#374151',
                                                lineHeight: '1.4',
                                                fontWeight: notification.read ? '400' : '500'
                                            }}>
                                                {notification.text}
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
                                            <div style={{
                                                flexShrink: 0,
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor: '#FF4081',
                                                marginTop: '6px'
                                            }} />
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 5 && (
                            <div style={{
                                padding: '16px 24px',
                                borderTop: '0.3px solid #cfd8dc',
                                textAlign: 'center'
                            }}>
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        navigate('/dashboard');
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#0d47a1',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        width: '100%'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    View all notifications
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .notification-container {
                    position: relative;
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
        </div>
    );
};

export default NotificationDropdown;