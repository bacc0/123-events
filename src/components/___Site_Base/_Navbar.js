import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref as dbRef, onValue } from 'firebase/database';
import NotificationDropdown from '../__Notification/NotificationDropdown';
import { motion } from 'framer-motion';

import IconButton from '@mui/material/IconButton';


import LogoutIcon from '@mui/icons-material/Logout';

import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';



const Navbar = ({ isLoggedIn, onToggleLogin }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const db = getDatabase();
                const userRef = dbRef(db, `users/${currentUser.uid}`);

                const unsubscribeProfile = onValue(userRef, (snapshot) => {
                    const profileData = snapshot.val();
                    setUserProfile(profileData);
                });

                return () => unsubscribeProfile();
            } else {
                setUserProfile(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            const auth = getAuth();
            await signOut(auth);
            onToggleLogin();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleProfileClick = () => {
        setShowProfileMenu(false);
        if (user) {
            navigate('/my-profile', {
                state: {
                    uid: user.uid,
                    fullName: userProfile?.fullName || user?.displayName || ''
                }
            });
        }
    };

    const handleLogoClick = () => {
        if (isLoggedIn) {
            if (user) {
                navigate('/dashboard', {
                    state: {
                        uid: user.uid,
                        fullName: userProfile?.fullName || user?.displayName || ''
                    }
                });
            }
        } else {
            navigate('/');
        }
    };

    return (
        <nav
            className="navbar"
            style={{
                opacity: isLoggedIn ? 1 : 0,
                position: 'fixed',
                width: '100%',
                background: '#ffffffbb',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '0.1px solid #EDEFF1',
                // height:60

            }}
        >
            <div className="navbar-container">
                <div className="navbar-brand" onClick={handleLogoClick}
                    style={{ cursor: 'pointer' }}
                >
                    <IconButton onClick={() => navigate('/dashboard')} sx={{ p: 0 }}>
                        <motion.div
                            initial={{ y: -100, opacity: 0, scale: 1.2 }}
                            animate={{ y: 1, opacity: 1, scale: 1.2 }}
                            transition={{ duration: 1, delay: 1 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                whiteSpace: 'nowrap',
                                padding: 4,
                                borderRadius: 6,
                                position: 'relative',
                                top: -2
                            }}
                        >
                            <img src="/appLogoEvents.svg" alt="App Logo" width="50" height="50" />
                        </motion.div>
                    </IconButton>
                </div>

                <div className="navbar-nav">
                    {isLoggedIn ? (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                style={{
                                    color: '#455a64'
                                }}

                            >
                                <NotificationDropdown />
                            </motion.div>

                            <div className="profile-menu-container" style={{ position: 'relative' }}>
                                <motion.button
                                    initial={{ y: -100, opacity: 0, scale: 1 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    transition={{ duration: 1, delay: 1 }}
                                    className="profile-button"
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 12px',
                                        borderRadius: '16px',
                                        border: 'none',
                                        backgroundColor: '#EBEFF1',
                                        border:'0.1px solid #DADEE0',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        borderRadius: 32
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#b0bec566'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#cfd8dc66'}
                                >
                                    {userProfile?.profileImageUrl ? (
                                        <img
                                            src={userProfile.profileImageUrl}
                                            alt="Profile"
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                backgroundColor: '#cfd8dc',
                                                color: '#78909c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '10px',
                                                fontWeight: 'bold',
                                                fontWeight: 500
                                            }}
                                        >
                                            user {/* {userProfile?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'} */}
                                        </div>
                                    )}
                                    <span style={{ color: '#455a64', fontWeight: '500', backgroundColor: 'rgba(47, 199, 52, 0)' }}>
                                        {userProfile?.fullName || user?.displayName || 'User'}
                                    </span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        style={{
                                            transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s'
                                        }}
                                    >
                                        <path d="M4.646 6.646a.5.5 0 0 1 .708 0L8 9.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </motion.button>

                                {showProfileMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="profile-dropdown"
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: '0',
                                            marginTop: '8px',
                                            minWidth: '200px',
                                            backgroundColor: 'white',
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                            border: '0.3px solid #cfd8dc',
                                            zIndex: 1000,
                                            overflow: 'hidden',
                                            // background: '#ffffffbb',
                                            // backdropFilter: isLoggedIn ? 'blur(6px)' : 'blur(0px)',
                                            // WebkitBackdropFilter: isLoggedIn ? 'blur(16px)' : 'blur(0px)',
                                            borderRadius: 32,
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <div>
                                            <div style={{ padding: '16px', borderBottom: '0.3px solid #cfd8dc' }}>
                                                <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>
                                                    {userProfile?.fullName || user?.displayName || 'User'}
                                                </p>
                                                <p style={{ margin: 0, fontSize: '14px', color: '#546e7a' }}>
                                                    {user?.email}
                                                </p>
                                            </div>

                                            <div style={{ padding: '8px' }}>
                                                <button
                                                    onClick={handleProfileClick}
                                                    style={buttonStyle}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#eceff1'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                >
                                                    <PersonIcon />
                                                    My Profile
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setShowProfileMenu(false);
                                                        if (user) {
                                                            navigate('/dashboard', {
                                                                state: {
                                                                    uid: user.uid,
                                                                    fullName: userProfile?.fullName || user?.displayName || ''
                                                                }
                                                            });
                                                        }
                                                    }}
                                                    style={buttonStyle}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#eceff1'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                >
                                                    <DashboardIcon />

                                                    Dashboard
                                                </button>
                                            </div>

                                            <div style={{ padding: '8px', borderTop: '0.3px solid #cfd8dc', color: '#455a64' }}>
                                                <button
                                                    onClick={() => {
                                                        const auth = getAuth();
                                                        signOut(auth)
                                                            .then(() => { window.location.href = '/'; })
                                                            .catch((error) => { console.error('Logout error:', error); });
                                                    }}
                                                    style={{
                                                        ...buttonStyle,
                                                        color: '#FF4081'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#FCEEF3'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                >
                                                    <LogoutIcon />
                                                    Sign Out
                                                </button>
                                            </div></div>
                                    </motion.div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* <motion.button
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                onClick={() => navigate('/login')}
                                className="nav-button"
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #0d47a1',
                                    backgroundColor: 'transparent',
                                    color: '#0d47a1',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#0d47a1';
                                    e.target.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#0d47a1';
                                }}
                            >
                                Login
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                onClick={() => navigate('/signup')}
                                className="nav-button"
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#0d47a1',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#1565c0'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#0d47a1'}
                            >
                                Sign Up
                            </motion.button> */}
                        </>
                    )}
                </div>
            </div>

            {showProfileMenu && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                    onClick={() => setShowProfileMenu(false)}
                />
            )}

            <style jsx>{`
                .navbar {
                    background-color: white;
                    border-bottom: '0.3px solid #cfd8dc';
                    padding: 12px 0;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }

                .navbar-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .navbar-nav {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                @media (max-width: 768px) {
                    .navbar-container {
                        padding: 0 16px;
                    }

                    .navbar-nav {
                        gap: 12px;
                    }
                }
            `}</style>
        </nav>
    );
};

const buttonStyle = {
    width: '100%',
    padding: '12px 16px',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#546e7a',
    fontSize: '14px'
};

export default Navbar;