// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9zLskP462GcFHumlD8EH_Ex7RlWIiPE0",
  authDomain: "voice-prep.firebaseapp.com",
  projectId: "voice-prep",
  storageBucket: "voice-prep.firebasestorage.app",
  messagingSenderId: "677308890702",
  appId: "1:677308890702:web:d321846e9134bb4ef88d1f",
  measurementId: "G-CPMV8GGG0C"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);