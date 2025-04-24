import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Loader2 } from 'lucide-react';
import logo from './logo.svg';
import { auth, db } from '../Firebase/client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthLayout = ({ isSignin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

    // Function to get user data.  Use this!
    const getUserData = async (uid) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                    uid,
                    name: userData.name || '',
                    email: userData.email || '',
                    // Add other user data from Firestore as needed
                };
            } else {
                return { uid, name: '', email: auth.currentUser?.email || ''}; // Return available data
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to fetch user data. Some features may be unavailable.");
            return { uid, name: '', email: auth.currentUser?.email || '' }; // Return partial data
        }
    };

  // Handle Sign Up
  const handleSignUp = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: name,
      });

      // Store user data in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name,
        email,
        registrationDate: new Date(),
      });

      toast.success('Sign up successful!');
      return user;
    } catch (error) {
      // Improved error handling
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
        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        const user = userCredential.user;

        if (!user) {
          toast.error('Authentication failed.');
          setIsLoading(false);
          return;
        }

        const userData = await getUserData(user.uid);
        localStorage.setItem('userId', userData.uid);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', userData.email);
        toast.success('Signed in successfully!');
        navigate('/');
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
          const userData = await getUserData(user.uid);
          localStorage.setItem('userId', userData.uid);
          localStorage.setItem('userName', userData.name);
           localStorage.setItem('userEmail', userData.email);
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

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

