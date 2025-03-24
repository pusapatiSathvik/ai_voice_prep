import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import { auth, db } from '../Firebase/client'; // Import db
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore'; // Import firestore functions

const AuthLayout = ({ isSignin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Add name state
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore
      const userDocRef = doc(collection(db, 'users'), user.uid);
      await setDoc(userDocRef, {
        name: name,
        email: email,
        registrationDate: new Date(),
        // Add other user data as needed
      });

      console.log('User signed up and data stored in Firestore:', user);
      return user;
    } catch (error) {
        if (error.code === 'auth/weak-password') {
            alert('Password should be at least 6 characters.');
          } else {
            console.error('Sign-up error:', error);
            alert(error.message); // Display other error messages
          }
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignin) {
        // Sign-in
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        // Sign-up
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        await handleSignUp(email, password, name); // Pass name to handleSignUp
        navigate('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert(error.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
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
                // ... (Sign-in form)
                <>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ backgroundColor: 'white', color: 'black' }}
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
                    />
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100 mt-3">
                    Sign In
                  </Button>
                  <p style={{ textAlign: 'center' }}>
                    Don't have an Account? <Link to="/sign-up">Sign-up</Link>
                  </p>
                </>
              ) : (
                // ... (Sign-up form)
                <>
                  <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ backgroundColor: 'white', color: 'black' }}
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
                    />
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100 mt-3">
                    Sign Up
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

export default AuthLayout;