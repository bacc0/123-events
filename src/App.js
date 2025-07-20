import React, { useState, useEffect } from 'react';
import './App.css';
import MenuAppBar from './components/menuAppBar';
import Dashboard from './components/dashboard';
import Signup from './components/signup';
import Login from './components/login';
import ForgotPass from './components/forgot_password';
import MyProfile from './components/my_profile';
import PublicUPser_profile from './components/public_user_profile';
import Video from './components/video';

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// import EventList from "./components/EventList";

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// import TestFirebase from "./TestFirebase";


function AnimatedRoute({ children }) {
    return (
        <motion.div
            initial={{ scale: 1.05, opacity: 0.2, y: -20, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ scale: 1.05, opacity: 0.05, y: 20, filter: "blur(10px)" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
}

function App({ loggedIn, setLoggedIn }) {


    const location = useLocation();

    const handleToggleLogin = () => {
        setLoggedIn((prev) => !prev);
    };

    return (
        <div className="App">
            <div
                style={{
                    position: loggedIn ? "static" : "absolute",
                    top: 110, left: 0, right: 0, zIndex: 1000,
                }}
            >
                <MenuAppBar isLoggedIn={loggedIn} onToggleLogin={handleToggleLogin} />
            </div>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            loggedIn ? (
                                <Navigate to="/dashboard" />
                            ) : (
                                <AnimatedRoute>
                                    <Video />
                                </AnimatedRoute>
                            )
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            loggedIn ? (
                                <AnimatedRoute>
                                    <Dashboard />
                                </AnimatedRoute>
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            loggedIn ? (
                                <Navigate to="/dashboard" />
                            ) : (
                                <AnimatedRoute>
                                    <Signup />
                                </AnimatedRoute>
                            )
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            loggedIn ? (
                                <Navigate to="/dashboard" />
                            ) : (
                                <AnimatedRoute>
                                    <Login onLogin={() => setLoggedIn(true)} />
                                </AnimatedRoute>
                            )
                        }
                    />
                    <Route
                        path="/forgot-password"
                        element={

                            <AnimatedRoute>
                                <ForgotPass />
                            </AnimatedRoute>
                        }
                    />
                    <Route
                        path="/my-profile"
                        element={
                            loggedIn ? (
                                <AnimatedRoute>
                                    <MyProfile />
                                </AnimatedRoute>
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route
                        path="/public-user-profile"
                        element={
                            loggedIn ? (
                                <AnimatedRoute>
                                    <PublicUPser_profile />
                                </AnimatedRoute>
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    {/* <Route
                        path="/events"
                        element={
                            loggedIn ? (
                                <AnimatedRoute>
                                    <EventList />
                                </AnimatedRoute>
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    /> */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AnimatePresence>
        </div>
    );
}

export default function AppWrapper() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoggedIn(!!user);
            setCheckingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    if (checkingAuth) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <App loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        </Router>
    );
}