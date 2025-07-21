import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async () => {
        setError('');

        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        const auth = getAuth();

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
        } catch (err) {
            setError('Error sending reset email: ' + err.message);
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
                    <div>
                          <img src="/appLogoEvents.svg" alt="App Logo" width="55" height="55" />
                    </div>
                    <h1 className="auth-title">Reset Password</h1>
                    <p className="auth-subtitle">
                        Enter your email address and we'll send you a link to reset your password
                    </p>
                </div>

                {success ? (
                    <div>
                        <div className="success-box">
                            <div className="success-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3 className="success-title">Check your email</h3>
                            <p className="success-text">
                                We've sent a password reset link to {email}
                            </p>
                        </div>

                        <button
                            onClick={() => window.location.href = '/login'}
                            className="btn btn-primary btn-lg btn-full"
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
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
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                className={`form-input ${error ? 'form-input-error' : ''}`}
                            />
                            {error && (
                                <div className="form-error">{error}</div>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            className={`btn btn-primary btn-lg btn-full ${loading ? 'btn-loading' : ''}`}
                            disabled={loading}
                            style={{marginTop: 22}}
                        >
                            <span className={loading ? 'text-hidden' : ''}>Send Reset Link</span>
                            <div className={`spinner ${loading ? '' : 'hidden'}`}></div>
                        </button>

                        <div className="auth-footer" style={{ marginTop: '24px' }}>
                            <a
                                href="/login"
                                className="auth-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = '/login';
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '4px' }}>
                                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L3.414 7H14a1 1 0 110 2H3.414l4.293 4.293a1 1 0 010 1.414z" />
                                </svg>
                                Back to Login
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;