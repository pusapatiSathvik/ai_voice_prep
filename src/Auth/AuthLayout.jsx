// src/components/AuthLayout.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Loader2 } from 'lucide-react';
import logo from './logo.svg';
import { auth, db } from '../Firebase/client'; // Ensure 'auth' is exported from Firebase client
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Removed getDoc, it's now handled in AuthContext
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const AuthLayout = ({ isSignin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser, loading } = useAuth(); // Get auth state from context

    // Redirect if already authenticated
    useEffect(() => {
        // If loading is false and a user is found, redirect.
        // This makes sure we wait for the auth state to be resolved.
        if (!loading && currentUser) {
            navigate('/');
        }
    }, [currentUser, loading, navigate]); // Depend on currentUser and loading

    // The getUserData function is now primarily handled within AuthProvider
    // when a user logs in or their state changes. You might not need it here
    // unless you want to re-fetch data for a very specific reason.

    // Handle Sign Up (simplified, AuthProvider handles data fetching after creation)
    const handleSignUp = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name,
            });

            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                name,
                email,
                registrationDate: new Date(),
                // Add other initial user data as needed
            });

            toast.success('Sign up successful!');
            return user; // Return the user object
        } catch (error) {
            switch (error.code) {
                case 'auth/weak-password':
                    toast.error('Password should be at least 6 characters.');
                    break;
                case 'auth/email-already-in-use':
                    toast.error('Email already in use.');
                    break;
                case 'auth/invalid-email':
                    toast.error('Invalid email format.');
                    break;
                default:
                    console.error('Sign-up error:', error);
                    toast.error(error.message || 'An error occurred during sign up.');
            }
            return null;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedName = name.trim();

        try {
            if (isSignin) {
                await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
                // Firebase's onAuthStateChanged listener will handle navigation automatically
                // after successful sign-in.
                toast.success('Signed in successfully!');
                // No need to set localStorage items here for auth status
            } else {
                if (!trimmedName) {
                    toast.warn('Name is required');
                    setIsLoading(false);
                    return;
                }
                if (trimmedPassword !== confirmPassword.trim()) {
                    toast.warn('Passwords do not match');
                    setIsLoading(false);
                    return;
                }

                const user = await handleSignUp(trimmedEmail, trimmedPassword, trimmedName);
                if (user) {
                    // Firebase's onAuthStateChanged listener will handle navigation automatically
                    // after successful sign-up.
                    // No need to set localStorage items here for auth status
                }
            }
        } catch (error) {
            console.error('Authentication error:', error);
            // Firebase errors have codes, so you can handle them specifically
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    toast.error('Invalid email or password.');
                    break;
                case 'auth/invalid-email':
                    toast.error('Invalid email format.');
                    break;
                default:
                    toast.error(error.message || 'An unexpected error occurred during sign-in.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // If still loading auth state, you might want to show a spinner
    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Loader2 className="h-8 w-8 animate-spin" />
            </Container>
        );
    }

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <ToastContainer position="top-right" autoClose={3000} />
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={5} xl={4} style={{ maxWidth: '400px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="border p-4 rounded bg-dark text-white shadow-lg"
                    >
                        <div className="d-flex align-items-center justify-content-center mb-4">
                            <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '10px' }} />
                            <h3 className="m-0">Practice with AI</h3>
                        </div>
                        <h2 className="text-center mb-4">{isSignin ? 'Sign In' : 'Sign Up'}</h2>
                        <Form onSubmit={handleSubmit} noValidate>
                            {!isSignin && (
                                <Form.Group controlId="formBasicName" className="mb-3">
                                    <Form.Label>
                                        <User className="me-2" size={16} />
                                        Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ backgroundColor: 'white', color: 'black' }}
                                        required
                                    />
                                </Form.Group>
                            )}

                            <Form.Group controlId="formBasicEmail" className="mb-3">
                                <Form.Label>
                                    <Mail className="me-2" size={16} />
                                    Email address
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ backgroundColor: 'white', color: 'black' }}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" className="mb-3">
                                <Form.Label>
                                    <Lock className="me-2" size={16} />
                                    Password
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ backgroundColor: 'white', color: 'black' }}
                                    required
                                />
                            </Form.Group>

                            {!isSignin && (
                                <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
                                    <Form.Label>
                                        <Lock className="me-2" size={16} />
                                        Confirm Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{ backgroundColor: 'white', color: 'black' }}
                                        required
                                    />
                                </Form.Group>
                            )}

                            <Button
                                variant="success"
                                type="submit"
                                className="w-100 mt-3"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="me-2 h-4 w-4 animate-spin" />
                                        {isSignin ? 'Signing In...' : 'Creating Account...'}
                                    </>
                                ) : (
                                    isSignin ? 'Sign In' : 'Sign Up'
                                )}
                            </Button>

                            <p className="text-center mt-3">
                                {isSignin ? (
                                    <>
                                        Don't have an Account? <Link to="/sign-up" className="text-info">Sign Up</Link>
                                    </>
                                ) : (
                                    <>
                                        Already have an Account? <Link to="/sign-in" className="text-info">Sign In</Link>
                                    </>
                                )}
                            </p>
                        </Form>
                    </motion.div>
                </Col>
            </Row>
        </Container>
    );
};

export default AuthLayout;