import React, { useState } from 'react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = () => {
        setError('');

        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1500);
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
                    <div className="auth-logo">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="4" y="8" width="28" height="24" rx="3" stroke="white" strokeWidth="2" fill="none" />
                            <rect x="4" y="8" width="28" height="8" fill="white" opacity="0.3" />
                            <line x1="10" y1="4" x2="10" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <line x1="26" y1="4" x2="26" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="22" r="2" fill="white" />
                            <circle cx="18" cy="22" r="2" fill="white" />
                            <circle cx="24" cy="22" r="2" fill="white" />
                            <circle cx="12" cy="27" r="2" fill="white" opacity="0.6" />
                            <circle cx="18" cy="27" r="2" fill="white" opacity="0.6" />
                        </svg>
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
                            onClick={() => alert('Redirect to login page')}
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
                                    alert('Redirect to login page');
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