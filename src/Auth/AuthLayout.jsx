import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import { auth, db } from '../Firebase/client';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthLayout = ({ isSignin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) navigate('/');
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserNameFromFirestore = async (uid) => {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data().name : '';
  };

  const handleSignUp = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(collection(db, 'users'), user.uid);
      await setDoc(userDocRef, {
        name: name,
        email: email,
        registrationDate: new Date(),
      });
      toast.success('Sign up successful!');
      return user;
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters.');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email format.');
      } else {
        console.error('Sign-up error:', error);
        toast.error(error.message);
      }
      return null;
    }
  };

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

        const name = await fetchUserNameFromFirestore(user.uid);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userName', name);
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

        if (!user) {
          setIsLoading(false);
          return;
        }

        const name = await fetchUserNameFromFirestore(user.uid);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userName', name);
        navigate('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
    <ToastContainer position="top-right" autoClose={3000} />
    <Row className="w-100 justify-content-center">
      <Col md={6} lg={5} xl={4} style={{ maxWidth: '400px' }}>
        <div
          className="border p-4 rounded"
          style={{ backgroundColor: 'black', color: 'white' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '10px' }} />
            <h3 style={{ margin: '0' }}>Practice with Ai</h3>
          </div>
          <h2 className="text-center mb-4">{isSignin ? 'Sign In' : 'Sign Up'}</h2>
          <Form onSubmit={handleSubmit}>
            {isSignin ? (
              <>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ backgroundColor: 'white', color: 'black' }}
                    required
                  />
                </Form.Group>
  
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ backgroundColor: 'white', color: 'black' }}
                    required
                  />
                </Form.Group>
  
                <Button variant="success" type="submit" className="w-100 mt-3" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
                <p style={{ textAlign: 'center' }}>
                  Don't have an Account? <Link to="/sign-up">Sign-up</Link>
                </p>
              </>
            ) : (
              <>
                <Form.Group controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ backgroundColor: 'white', color: 'black' }}
                    required
                  />
                </Form.Group>
  
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ backgroundColor: 'white', color: 'black' }}
                    required
                  />
                </Form.Group>
  
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ backgroundColor: 'white', color: 'black' }}
                    required
                  />
                </Form.Group>
  
                <Form.Group controlId="formBasicConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ backgroundColor: 'white', color: 'black' }}
                    required
                  />
                </Form.Group>
  
                <Button variant="success" type="submit" className="w-100 mt-3" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
                <p style={{ textAlign: 'center' }}>
                  Already have an Account? <Link to="/sign-in">Sign-in</Link>
                </p>
              </>
            )}
          </Form>
        </div>
      </Col>
    </Row>
  </Container>
  
  );
};

export default  AuthLayout; 