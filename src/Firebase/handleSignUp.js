import { auth } from './client'; // Your client-side config
import { createUserWithEmailAndPassword } from 'firebase/auth';

const handleSignUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user);
    // Optionally, redirect the user or perform other actions
    return user;
  } catch (error) {
    console.error('Sign-up error:', error);
    // Handle errors (e.g., display error messages to the user)
    return null;
  }
};