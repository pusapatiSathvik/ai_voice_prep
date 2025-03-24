import { auth } from './admin'; // Your admin-side config

const verifyToken = async (token) => {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Decoded token:', decodedToken);
    // Access user information from decodedToken
    return decodedToken;
  } catch (error) {
    console.error('Token verification error:', error);
    // Handle errors (e.g., token expired, invalid token)
    return null;
  }
};