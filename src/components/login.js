import React, { useState } from 'react';

const LoginPage = () => {
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

  const handleSubmit = () => {
    const newErrors = {};
    
    // Validate email
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Simulate API call
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setAlertType('error');
      setAlertMessage('This is a UI demo. Backend logic not implemented.');
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
    loginContainer: {
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
      overflow: 'hidden',
      cursor: 'pointer'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6B7280',
      fontSize: '14px'
    },
    alert: {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '14px',
      display: alertMessage ? 'flex' : 'none',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: alertType === 'error' ? '#FEE2E2' : '#D1FAE5',
      color: alertType === 'error' ? '#DC2626' : '#059669',
      border: `1px solid ${alertType === 'error' ? '#FECACA' : '#A7F3D0'}`
    },
    formGroup: {
      marginBottom: '20px'
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
    inputFocus: {
      borderColor: '#0d47a1',
      boxShadow: '0 0 0 3px rgba(13, 71, 161, 0.1)'
    },
    passwordWrapper: {
      position: 'relative'
    },
    togglePassword: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      padding: '4px',
      color: '#6B7280',
      transition: 'color 0.3s ease'
    },
    errorMessage: {
      color: '#DC2626',
      fontSize: '13px',
      marginTop: '6px',
      display: 'block'
    },
    rememberForgot: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    rememberMe: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    checkbox: {
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    rememberLabel: {
      fontSize: '14px',
      cursor: 'pointer',
      userSelect: 'none'
    },
    forgotPassword: {
      color: '#0d47a1',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'color 0.3s ease',
      cursor: 'pointer'
    },
    loginButton: {
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
      boxSizing: 'border-box'
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
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '28px 0',
      gap: '16px'
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#D1D5DB'
    },
    dividerText: {
      color: '#6B7280',
      fontSize: '14px'
    },
    signupLink: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#6B7280'
    },
    signupAnchor: {
      color: '#0d47a1',
      textDecoration: 'none',
      fontWeight: '600',
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
          
          @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          }
          
          .logo-hover:hover::before {
            animation: shimmer 0.6s ease-in-out;
          }
          
          .logo-hover::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg);
            transition: all 0.6s;
          }
          
          input:focus {
            border-color: #0d47a1 !important;
            box-shadow: 0 0 0 3px rgba(13, 71, 161, 0.1) !important;
          }
          
          .login-button:hover {
            background-color: #1565c0 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(13, 71, 161, 0.25);
          }
          
          .login-button:active {
            transform: translateY(0);
          }
          
          @media (max-width: 480px) {
            .remember-forgot {
              flex-direction: column !important;
              gap: 12px;
              align-items: flex-start !important;
            }
          }
        `}
      </style>
      
      <div style={styles.loginContainer}>
        <div style={styles.logoSection}>
          <div style={styles.logo} className="logo-hover">
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
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Log in to manage your events</p>
        </div>

        <div style={styles.alert}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zM8 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM9 9H7V4h2v5z"/>
          </svg>
          <span>{alertMessage}</span>
        </div>

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
              value={formData.email}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {})
              }}
            />
            {errors.email && (
              <div style={styles.errorMessage}>{errors.email}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
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
                style={{
                  ...styles.input,
                  ...(errors.password ? styles.inputError : {})
                }}
              />
              <span
                style={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z"/>
                  <circle cx="10" cy="10" r="3"/>
                </svg>
              </span>
            </div>
            {errors.password && (
              <div style={styles.errorMessage}>{errors.password}</div>
            )}
          </div>

          <div style={styles.rememberForgot} className="remember-forgot">
            <div style={styles.rememberMe}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                style={styles.checkbox}
              />
              <label htmlFor="rememberMe" style={styles.rememberLabel}>
                Remember me
              </label>
            </div>
            <a 
              href="#" 
              style={styles.forgotPassword}
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
            style={styles.loginButton}
            className="login-button"
            disabled={loading}
          >
            <span style={styles.buttonText}>LOG IN</span>
            <div style={styles.spinner}></div>
          </button>
        </div>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine}></div>
        </div>

        <div style={styles.signupLink}>
          Don't have an account?{' '}
          <a 
            href="#" 
            style={styles.signupAnchor}
            onClick={(e) => {
              e.preventDefault();
              alert('Redirect to registration page');
            }}
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;