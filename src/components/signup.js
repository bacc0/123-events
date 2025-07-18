import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
} from "@mui/material"
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { updateProfile } from 'firebase/auth';
const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, text: '', color: '#E5E7EB' };

        const hasMinLength = password.length >= 7;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);

        if (hasMinLength && hasUppercase && hasLowercase) {
            return { strength: 3, text: 'Good', color: '#3B82F6' };
        } else {
            return { strength: 1, text: 'Weak', color: '#DC2626' };
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async () => {
        const newErrors = {};

        if (!formData.fullName || formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Please enter your full name';
        }

        if (!formData.email || !validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password || formData.password.length < 7 || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password)) {
            newErrors.password = 'Password must be at least 7 characters, with at least one uppercase and one lowercase letter';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            await updateProfile(userCredential.user, {
                displayName: formData.fullName
            });

            const db = getDatabase();
            const userRef = ref(db, 'users/' + userCredential.user.uid);
            await set(userRef, {
                fullName: formData.fullName,
                email: formData.email,
                about: "Welcome to my profile!",
                profileImageUrl: ""
            });

            console.log("User registered:", userCredential.user);
            alert('Sign up successful!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error("Registration error:", error.message);
            alert("Failed to register: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = getPasswordStrength(formData.password);

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
        signupContainer: {
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
            fontSize: '14px'
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
        passwordStrength: {
            marginTop: '8px'
        },
        strengthBar: {
            height: '4px',
            backgroundColor: '#E5E7EB',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '4px'
        },
        strengthFill: {
            height: '100%',
            transition: 'all 0.3s ease',
            borderRadius: '2px'
        },
        strengthText: {
            fontSize: '12px',
            fontWeight: '500'
        },
        errorMessage: {
            color: '#DC2626',
            fontSize: '13px',
            marginTop: '6px',
            display: 'block'
        },
        termsGroup: {
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
        },
        checkbox: {
            marginTop: '2px',
            cursor: 'pointer',
            flexShrink: 0
        },
        termsLabel: {
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#6B7280'
        },
        termsLink: {
            color: '#0d47a1',
            textDecoration: 'none',
            cursor: 'pointer'
        },
        signupButton: {
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
        loginLink: {
            textAlign: 'center',
            fontSize: '14px',
            color: '#6B7280'
        },
        loginAnchor: {
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
          
          input:focus {
            border-color: #0d47a1 !important;
            box-shadow: 0 0 0 3px rgba(13, 71, 161, 0.1) !important;
          }
          
          .signup-button:hover {
            background-color: #1565c0 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(13, 71, 161, 0.25);
          }
          
          .signup-button:active {
            transform: translateY(0);
          }
          
          .terms-link:hover {
            text-decoration: underline;
          }
        `}
            </style>

            <div style={styles.signupContainer}>
                <div style={styles.logoSection}>
                    <div >
                        <img src="/appLogoEvents.svg" alt="App Logo" width="54" height="54" />
                    </div>
                    <h1 style={styles.title}>Create Account</h1>
                    <p style={styles.subtitle}>Join us to start managing your events</p>
                </div>

                <div>
                    <div style={styles.formGroup}>
                        <label htmlFor="fullName" style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="John Doe"
                            autoComplete="name"
                            required
                            value={formData.fullName}
                            onChange={handleInputChange}
                            style={{
                                ...styles.input,
                                ...(errors.fullName ? styles.inputError : {})
                            }}
                        />
                        {errors.fullName && (
                            <div style={styles.errorMessage}>{errors.fullName}</div>
                        )}
                    </div>

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
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
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
                                    <path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z" />
                                    <circle cx="10" cy="10" r="3" />
                                </svg>
                            </span>
                        </div>
                        {formData.password && (
                            <div style={styles.passwordStrength}>
                                <div style={styles.strengthBar}>
                                    <div
                                        style={{
                                            ...styles.strengthFill,
                                            width: `${passwordStrength.strength * 25}%`,
                                            backgroundColor: passwordStrength.color
                                        }}
                                    />
                                </div>
                                {passwordStrength.text && (
                                    <span style={{ ...styles.strengthText, color: passwordStrength.color }}>
                                        Password strength: {passwordStrength.text}
                                    </span>
                                )}
                            </div>
                        )}
                        <div style={{ fontSize: '9px', color: '#A9A9A9', marginTop: '4px' }}>
                            Minimum 7 characters, with at least 1 uppercase and 1 lowercase letter
                        </div>
                        {errors.password && (
                            <div style={styles.errorMessage}>{errors.password}</div>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                style={{
                                    ...styles.input,
                                    ...(errors.confirmPassword ? styles.inputError : {})
                                }}
                            />
                            <span
                                style={styles.togglePassword}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z" />
                                    <circle cx="10" cy="10" r="3" />
                                </svg>
                            </span>
                        </div>
                        {errors.confirmPassword && (
                            <div style={styles.errorMessage}>{errors.confirmPassword}</div>
                        )}
                    </div>

                    <div style={styles.termsGroup}>
                        <input
                            type="checkbox"
                            id="acceptTerms"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleInputChange}
                            style={styles.checkbox}
                        />
                        <label htmlFor="acceptTerms" style={styles.termsLabel}>
                            I agree to the{' '}
                            <a
                                href="#"
                                style={styles.termsLink}
                                className="terms-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Open Terms of Service');
                                }}
                            >
                                Terms of Service
                            </a>
                            {' '}and{' '}
                            <a
                                href="#"
                                style={styles.termsLink}
                                className="terms-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Open Privacy Policy');
                                }}
                            >
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                    {errors.acceptTerms && (
                        <div style={{ ...styles.errorMessage, marginTop: '-16px', marginBottom: '16px' }}>
                            {errors.acceptTerms}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        style={styles.signupButton}
                        className="signup-button"
                        disabled={loading}
                    >
                        <span style={styles.buttonText}>CREATE ACCOUNT</span>
                        <div style={styles.spinner}></div>
                    </button>
                </div>

                <div style={styles.divider}>
                    <div style={styles.dividerLine}></div>
                    <span style={styles.dividerText}>or</span>
                    <div style={styles.dividerLine}></div>
                </div>

                <div style={styles.loginLink}>
                    Already have an account?{' '}
                    <a
                        href="#"
                        style={styles.loginAnchor}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/login');
                        }}
                    >
                        Log in
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




export default SignUpPage;




// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     Typography,
//     Button,
// } from "@mui/material"
// import { auth } from '../firebase';
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// const SignUpPage = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         fullName: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         acceptTerms: false
//     });

//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);

//     const validateEmail = (email) => {
//         const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return re.test(email);
//     };

//     const getPasswordStrength = (password) => {
//         if (!password) return { strength: 0, text: '', color: '#E5E7EB' };

//         const hasMinLength = password.length >= 7;
//         const hasUppercase = /[A-Z]/.test(password);
//         const hasLowercase = /[a-z]/.test(password);

//         if (hasMinLength && hasUppercase && hasLowercase) {
//             return { strength: 3, text: 'Good', color: '#3B82F6' };
//         } else {
//             return { strength: 1, text: 'Weak', color: '#DC2626' };
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));

//         setErrors(prev => ({ ...prev, [name]: '' }));
//     };

//     const handleSubmit = async () => {
//         const newErrors = {};

//         if (!formData.fullName || formData.fullName.trim().length < 2) {
//             newErrors.fullName = 'Please enter your full name';
//         }

//         if (!formData.email || !validateEmail(formData.email)) {
//             newErrors.email = 'Please enter a valid email address';
//         }

//         if (!formData.password || formData.password.length < 7 || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password)) {
//             newErrors.password = 'Password must be at least 7 characters, with at least one uppercase and one lowercase letter';
//         }

//         if (formData.password !== formData.confirmPassword) {
//             newErrors.confirmPassword = 'Passwords do not match';
//         }

//         if (!formData.acceptTerms) {
//             newErrors.acceptTerms = 'You must accept the terms and conditions';
//         }

//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//             return;
//         }

//         setLoading(true);

//         try {
//             const userCredential = await createUserWithEmailAndPassword(
//                 auth,
//                 formData.email,
//                 formData.password
//             );
//             await updateProfile(userCredential.user, {
//                 displayName: formData.fullName
//             });
//             console.log("User registered:", userCredential.user);
//             alert('Sign up successful!');
//             setTimeout(() => {
//                 navigate('/login');
//             }, 2000);
//         } catch (error) {
//             console.error("Registration error:", error.message);
//             alert("Failed to register: " + error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const passwordStrength = getPasswordStrength(formData.password);

//     const styles = {
//         container: {
//             fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//             backgroundColor: '#FFFFFF',
//             color: '#1F2937',
//             minHeight: '100vh',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             padding: '20px'
//         },
//         signupContainer: {
//             width: '100%',
//             maxWidth: '420px',
//             padding: '40px 32px',
//             animation: 'fadeIn 0.5s ease-out'
//         },
//         logoSection: {
//             textAlign: 'center',
//             marginBottom: '32px'
//         },
//         logo: {
//             width: '60px',
//             height: '60px',
//             backgroundColor: '#0d47a1',
//             borderRadius: '12px',
//             display: 'inline-flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginBottom: '16px',
//             position: 'relative',
//             overflow: 'hidden'
//         },
//         title: {
//             fontSize: '24px',
//             fontWeight: '700',
//             color: '#1F2937',
//             marginBottom: '8px'
//         },
//         subtitle: {
//             color: '#6B7280',
//             fontSize: '14px'
//         },
//         formGroup: {
//             marginBottom: '20px'
//         },
//         label: {
//             display: 'block',
//             fontSize: '14px',
//             fontWeight: '500',
//             color: '#1F2937',
//             marginBottom: '8px'
//         },
//         input: {
//             width: '100%',
//             padding: '12px 16px',
//             border: '1px solid #D1D5DB',
//             borderRadius: '8px',
//             fontSize: '16px',
//             transition: 'all 0.3s ease',
//             backgroundColor: '#FFFFFF',
//             outline: 'none',
//             boxSizing: 'border-box'
//         },
//         inputError: {
//             borderColor: '#DC2626'
//         },
//         passwordWrapper: {
//             position: 'relative'
//         },
//         togglePassword: {
//             position: 'absolute',
//             right: '12px',
//             top: '50%',
//             transform: 'translateY(-50%)',
//             cursor: 'pointer',
//             padding: '4px',
//             color: '#6B7280',
//             transition: 'color 0.3s ease'
//         },
//         passwordStrength: {
//             marginTop: '8px'
//         },
//         strengthBar: {
//             height: '4px',
//             backgroundColor: '#E5E7EB',
//             borderRadius: '2px',
//             overflow: 'hidden',
//             marginBottom: '4px'
//         },
//         strengthFill: {
//             height: '100%',
//             transition: 'all 0.3s ease',
//             borderRadius: '2px'
//         },
//         strengthText: {
//             fontSize: '12px',
//             fontWeight: '500'
//         },
//         errorMessage: {
//             color: '#DC2626',
//             fontSize: '13px',
//             marginTop: '6px',
//             display: 'block'
//         },
//         termsGroup: {
//             marginBottom: '24px',
//             display: 'flex',
//             alignItems: 'flex-start',
//             gap: '8px'
//         },
//         checkbox: {
//             marginTop: '2px',
//             cursor: 'pointer',
//             flexShrink: 0
//         },
//         termsLabel: {
//             fontSize: '14px',
//             lineHeight: '1.5',
//             color: '#6B7280'
//         },
//         termsLink: {
//             color: '#0d47a1',
//             textDecoration: 'none',
//             cursor: 'pointer'
//         },
//         signupButton: {
//             width: '100%',
//             padding: '12px 24px',
//             backgroundColor: loading ? '#6B7280' : '#0d47a1',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             fontSize: '16px',
//             fontWeight: '600',
//             cursor: loading ? 'not-allowed' : 'pointer',
//             transition: 'all 0.3s ease',
//             position: 'relative',
//             overflow: 'hidden',
//             boxSizing: 'border-box'
//         },
//         buttonText: {
//             visibility: loading ? 'hidden' : 'visible'
//         },
//         spinner: {
//             display: loading ? 'inline-block' : 'none',
//             width: '20px',
//             height: '20px',
//             border: '2px solid transparent',
//             borderTopColor: 'white',
//             borderRadius: '50%',
//             animation: 'spin 0.8s linear infinite',
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)'
//         },
//         divider: {
//             display: 'flex',
//             alignItems: 'center',
//             margin: '28px 0',
//             gap: '16px'
//         },
//         dividerLine: {
//             flex: 1,
//             height: '1px',
//             backgroundColor: '#D1D5DB'
//         },
//         dividerText: {
//             color: '#6B7280',
//             fontSize: '14px'
//         },
//         loginLink: {
//             textAlign: 'center',
//             fontSize: '14px',
//             color: '#6B7280'
//         },
//         loginAnchor: {
//             color: '#0d47a1',
//             textDecoration: 'none',
//             fontWeight: '600',
//             cursor: 'pointer'
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <style>
//                 {`
//           * {
//             box-sizing: border-box;
//           }
          
//           @keyframes fadeIn {
//             from {
//               opacity: 0;
//               transform: translateY(20px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
          
//           @keyframes spin {
//             to { transform: rotate(360deg); }
//           }
          
//           input:focus {
//             border-color: #0d47a1 !important;
//             box-shadow: 0 0 0 3px rgba(13, 71, 161, 0.1) !important;
//           }
          
//           .signup-button:hover {
//             background-color: #1565c0 !important;
//             transform: translateY(-1px);
//             box-shadow: 0 4px 12px rgba(13, 71, 161, 0.25);
//           }
          
//           .signup-button:active {
//             transform: translateY(0);
//           }
          
//           .terms-link:hover {
//             text-decoration: underline;
//           }
//         `}
//             </style>

//             <div style={styles.signupContainer}>
//                 <div style={styles.logoSection}>
//                     <div >
//                         <img src="/appLogoEvents.svg" alt="App Logo" width="54" height="54" />
//                     </div>
//                     <h1 style={styles.title}>Create Account</h1>
//                     <p style={styles.subtitle}>Join us to start managing your events</p>
//                 </div>

//                 <div>
//                     <div style={styles.formGroup}>
//                         <label htmlFor="fullName" style={styles.label}>Full Name</label>
//                         <input
//                             type="text"
//                             id="fullName"
//                             name="fullName"
//                             placeholder="John Doe"
//                             autoComplete="name"
//                             required
//                             value={formData.fullName}
//                             onChange={handleInputChange}
//                             style={{
//                                 ...styles.input,
//                                 ...(errors.fullName ? styles.inputError : {})
//                             }}
//                         />
//                         {errors.fullName && (
//                             <div style={styles.errorMessage}>{errors.fullName}</div>
//                         )}
//                     </div>

//                     <div style={styles.formGroup}>
//                         <label htmlFor="email" style={styles.label}>Email Address</label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             placeholder="your@email.com"
//                             autoComplete="email"
//                             required
//                             value={formData.email}
//                             onChange={handleInputChange}
//                             style={{
//                                 ...styles.input,
//                                 ...(errors.email ? styles.inputError : {})
//                             }}
//                         />
//                         {errors.email && (
//                             <div style={styles.errorMessage}>{errors.email}</div>
//                         )}
//                     </div>

//                     <div style={styles.formGroup}>
//                         <label htmlFor="password" style={styles.label}>Password</label>
//                         <div style={styles.passwordWrapper}>
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 id="password"
//                                 name="password"
//                                 placeholder="Create a strong password"
//                                 autoComplete="new-password"
//                                 required
//                                 value={formData.password}
//                                 onChange={handleInputChange}
//                                 style={{
//                                     ...styles.input,
//                                     ...(errors.password ? styles.inputError : {})
//                                 }}
//                             />
//                             <span
//                                 style={styles.togglePassword}
//                                 onClick={() => setShowPassword(!showPassword)}
//                             >
//                                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
//                                     <path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z" />
//                                     <circle cx="10" cy="10" r="3" />
//                                 </svg>
//                             </span>
//                         </div>
//                         {formData.password && (
//                             <div style={styles.passwordStrength}>
//                                 <div style={styles.strengthBar}>
//                                     <div
//                                         style={{
//                                             ...styles.strengthFill,
//                                             width: `${passwordStrength.strength * 25}%`,
//                                             backgroundColor: passwordStrength.color
//                                         }}
//                                     />
//                                 </div>
//                                 {passwordStrength.text && (
//                                     <span style={{ ...styles.strengthText, color: passwordStrength.color }}>
//                                         Password strength: {passwordStrength.text}
//                                     </span>
//                                 )}
//                             </div>
//                         )}
//                         <div style={{ fontSize: '9px', color: '#A9A9A9', marginTop: '4px' }}>
//                             Minimum 7 characters, with at least 1 uppercase and 1 lowercase letter
//                         </div>
//                         {errors.password && (
//                             <div style={styles.errorMessage}>{errors.password}</div>
//                         )}
//                     </div>

//                     <div style={styles.formGroup}>
//                         <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
//                         <div style={styles.passwordWrapper}>
//                             <input
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 id="confirmPassword"
//                                 name="confirmPassword"
//                                 placeholder="Confirm your password"
//                                 autoComplete="new-password"
//                                 required
//                                 value={formData.confirmPassword}
//                                 onChange={handleInputChange}
//                                 style={{
//                                     ...styles.input,
//                                     ...(errors.confirmPassword ? styles.inputError : {})
//                                 }}
//                             />
//                             <span
//                                 style={styles.togglePassword}
//                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                             >
//                                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
//                                     <path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z" />
//                                     <circle cx="10" cy="10" r="3" />
//                                 </svg>
//                             </span>
//                         </div>
//                         {errors.confirmPassword && (
//                             <div style={styles.errorMessage}>{errors.confirmPassword}</div>
//                         )}
//                     </div>

//                     <div style={styles.termsGroup}>
//                         <input
//                             type="checkbox"
//                             id="acceptTerms"
//                             name="acceptTerms"
//                             checked={formData.acceptTerms}
//                             onChange={handleInputChange}
//                             style={styles.checkbox}
//                         />
//                         <label htmlFor="acceptTerms" style={styles.termsLabel}>
//                             I agree to the{' '}
//                             <a
//                                 href="#"
//                                 style={styles.termsLink}
//                                 className="terms-link"
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     alert('Open Terms of Service');
//                                 }}
//                             >
//                                 Terms of Service
//                             </a>
//                             {' '}and{' '}
//                             <a
//                                 href="#"
//                                 style={styles.termsLink}
//                                 className="terms-link"
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     alert('Open Privacy Policy');
//                                 }}
//                             >
//                                 Privacy Policy
//                             </a>
//                         </label>
//                     </div>
//                     {errors.acceptTerms && (
//                         <div style={{ ...styles.errorMessage, marginTop: '-16px', marginBottom: '16px' }}>
//                             {errors.acceptTerms}
//                         </div>
//                     )}

//                     <button
//                         onClick={handleSubmit}
//                         style={styles.signupButton}
//                         className="signup-button"
//                         disabled={loading}
//                     >
//                         <span style={styles.buttonText}>CREATE ACCOUNT</span>
//                         <div style={styles.spinner}></div>
//                     </button>
//                 </div>

//                 <div style={styles.divider}>
//                     <div style={styles.dividerLine}></div>
//                     <span style={styles.dividerText}>or</span>
//                     <div style={styles.dividerLine}></div>
//                 </div>

//                 <div style={styles.loginLink}>
//                     Already have an account?{' '}
//                     <a
//                         href="#"
//                         style={styles.loginAnchor}
//                         onClick={(e) => {
//                             e.preventDefault();
//                             navigate('/login');
//                         }}
//                     >
//                         Log in
//                     </a>
//                 </div>
//                 <div style={{ textAlign: 'center', marginTop: '20px' }}>
//                     <a
//                         href="#"
//                         onClick={(e) => {
//                             e.preventDefault();
//                             navigate('/');
//                         }}
//                         style={{ color: '#0d47a1', textDecoration: 'none', fontWeight: '500' }}
//                     >
//                         ← Back to Home
//                     </a>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SignUpPage;