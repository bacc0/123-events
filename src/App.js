import React, { useState } from 'react';
import './App.css';
import MenuAppBar from './components/menuAppBar';
import Dashboard from './components/dashboard';
import Signup from './components/signup';
import Login from './components/login';
import ForgotPass from './components/forgot_password';
import MyProfile from './components/my_profile';
import PublicUPser_profile from './components/public_user_profile';
import Video from './components/video';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    const handleToggleLogin = () => {
        setLoggedIn((prev) => !prev);
    };

    return (
        <div className="App">
            <Router>
                <div
                    style={{
                        position: loggedIn ? "static" : "absolute",
                        top: 110, left: 0, right: 0, zIndex: 1000
                    }}
                >
                    <MenuAppBar isLoggedIn={loggedIn} onToggleLogin={handleToggleLogin} />
                </div>
                <Routes>
                    <Route
                        path="/"
                        element={loggedIn ? <Navigate to="/dashboard" /> : <Video />}
                    />
                    <Route
                        path="/dashboard"
                        element={
                            loggedIn
                                ? <Dashboard />
                                : <Navigate to="/" />
                        }
                    />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPass />} />
                    <Route path="/my-profile" element={<MyProfile />} />
                    <Route path="/public-user-profile" element={<PublicUPser_profile />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;