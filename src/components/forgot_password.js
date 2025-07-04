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

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#FFFFFF',
      color: '#1F2937',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    resetContainer: {
      width: '100%',
      maxWidth: '420px',
      padding: '40px 32px',
      animation: 'fadeIn 0.5s ease-out'
    },
    logoSection: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    logo: {
      width: '60px',
      height: '60px',
      backgroundColor: '#0d47a1',
      borderRadius: '12px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
      position: 'relative',
      overflow: 'hidden'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6B7280',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    successBox: {
      backgroundColor: '#D1FAE5',
      border: '1px solid #A7F3D0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      textAlign: 'center'
    },
    successIcon: {
      width: '48px',
      height: '48px',
      backgroundColor: '#059669',
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '12px'
    },
    successTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#059669',
      marginBottom: '8px'
    },
    successText: {
      fontSize: '14px',
      color: '#047857'
    },
    formGroup: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#1F2937',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: '#FFFFFF',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputError: {
      borderColor: '#DC2626'
    },
    errorMessage: {
      color: '#DC2626',
      fontSize: '13px',
      marginTop: '6px',
      display: 'block'
    },
    submitButton: {
      width: '100%',
      padding: '12px 24px',
      backgroundColor: loading ? '#6B7280' : '#0d47a1',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      marginBottom: '24px'
    },
    buttonText: {
      visibility: loading ? 'hidden' : 'visible'
    },
    spinner: {
      display: loading ? 'inline-block' : 'none',
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTopColor: 'white',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    backLink: {
      textAlign: 'center',
      fontSize: '14px'
    },
    link: {
      color: '#0d47a1',
      textDecoration: 'none',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          input:focus {
            border-color: #0d47a1 !important;
            box-shadow: 0 0 0 3px rgba(13, 71, 161, 0.1) !important;
          }
          
          .submit-button:hover {
            background-color: #1565c0 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(13, 71, 161, 0.25);
          }
          
          .submit-button:active {
            transform: translateY(0);
          }
          
          .link:hover {
            text-decoration: underline;
          }
        `}
      </style>
      
      <div style={styles.resetContainer}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="8" width="28" height="24" rx="3" stroke="white" strokeWidth="2" fill="none"/>
              <rect x="4" y="8" width="28" height="8" fill="white" opacity="0.3"/>
              <line x1="10" y1="4" x2="10" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="26" y1="4" x2="26" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="22" r="2" fill="white"/>
              <circle cx="18" cy="22" r="2" fill="white"/>
              <circle cx="24" cy="22" r="2" fill="white"/>
              <circle cx="12" cy="27" r="2" fill="white" opacity="0.6"/>
              <circle cx="18" cy="27" r="2" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <h1 style={styles.title}>Reset Password</h1>
          <p style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {success ? (
          <div>
            <div style={styles.successBox}>
              <div style={styles.successIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style={styles.successTitle}>Check your email</h3>
              <p style={styles.successText}>
                We've sent a password reset link to {email}
              </p>
            </div>
            
            <button 
              onClick={() => alert('Redirect to login page')}
              style={styles.submitButton}
              className="submit-button"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
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
                style={{
                  ...styles.input,
                  ...(error ? styles.inputError : {})
                }}
              />
              {error && (
                <div style={styles.errorMessage}>{error}</div>
              )}
            </div>

            <button 
              onClick={handleSubmit}
              style={styles.submitButton}
              className="submit-button"
              disabled={loading}
            >
              <span style={styles.buttonText}>Send Reset Link</span>
              <div style={styles.spinner}></div>
            </button>

            <div style={styles.backLink}>
              <a 
                href="#" 
                style={styles.link}
                className="link"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Redirect to login page');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L3.414 7H14a1 1 0 110 2H3.414l4.293 4.293a1 1 0 010 1.414z"/>
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