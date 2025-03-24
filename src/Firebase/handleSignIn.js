import { auth } from './client'; // Your client-side config
import { signInWithEmailAndPassword } from 'firebase/auth';

const handleSignIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed in:', user);
    // Optionally, redirect the user or perform other actions
    return user;
  } catch (error) {
    console.error('Sign-in error:', error);
    // Handle errors (e.g., display error messages to the user)
    return null;
  }
};