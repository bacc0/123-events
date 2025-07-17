import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = (props) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear errors when user types
        setErrors(prev => ({ ...prev, [name]: '' }));
        setAlertMessage('');
    };

    const handleSubmit = async () => {
        const newErrors = {};

        if (!formData.email || !validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            console.log('Logged in:', userCredential.user);
            setAlertType('success');
            setAlertMessage('Login successful!');
            if (typeof props.onLogin === 'function') {
                props.onLogin(); // notify App.js
            }
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            console.error("Login failed:", error.message);
            setAlertType('error');
            setAlertMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="auth-container">
            <link rel="stylesheet" href="universal-styles.css" />

            <div className="auth-box">
                <div className="auth-logo-section">
                    <div >
                        <img src="/appLogoEvents.svg" alt="App Logo" width="55" height="55" />
                    </div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Log in to manage your events</p>
                </div>

                <div className={`alert alert-${alertType} ${alertMessage ? '' : 'hidden'}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zM8 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM9 9H7V4h2v5z" />
                    </svg>
                    <span>{alertMessage}</span>
                </div>

                <div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                        />
                        {errors.email && (
                            <div className="form-error">{errors.email}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                            />
                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z" />
                                    <circle cx="10" cy="10" r="3" />
                                </svg>
                            </span>
                        </div>
                        {errors.password && (
                            <div className="form-error">{errors.password}</div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                className="checkbox"

                            />
                            <label htmlFor="rememberMe" className="checkbox-label">
                                Remember me
                            </label>
                        </div>
                        <a
                            href="#"
                            className="auth-link"
                            onClick={(e) => {
                                e.preventDefault();
                                alert('Redirect to password reset page');
                            }}
                        >
                            Forgot password?
                        </a>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className={`btn btn-primary btn-lg btn-full ${loading ? 'btn-loading' : ''}`}
                        disabled={loading}
                    >
                        <span className={loading ? 'text-hidden' : ''}>Log In</span>
                        <div className={`spinner ${loading ? '' : 'hidden'}`}></div>
                    </button>
                </div>

                <div className="auth-divider">
                    <div className="auth-divider-line"></div>
                    <span className="auth-divider-text">or</span>
                    <div className="auth-divider-line"></div>
                </div>

                <div className="auth-footer">
                    Don't have an account?{' '}
                    <a
                        href="#"
                        className="auth-link"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/signup');
                        }}
                    >
                        Sign up
                    </a>
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                        }}
                        style={{ color: '#0d47a1', textDecoration: 'none', fontWeight: '500' }}
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;