import { auth } from './client'; // Your client-side config
import { signOut } from 'firebase/auth';

const handleSignOut = async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
    // Optionally, redirect the user or perform other actions
  } catch (error) {
    console.error('Sign-out error:', error);
    // Handle errors (e.g., display error messages to the user)
  }
};