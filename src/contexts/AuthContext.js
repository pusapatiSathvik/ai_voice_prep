import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from '../Firebase/client';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const signUp = async (email, password, firstName, lastName, username) => { // Add username
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const name = `${firstName} ${lastName}`; // Combine first and last names

            // Update the user's display name in their Firebase Auth profile.
            await updateProfile(user, {
                displayName: name,
            });

            // Create a user document in Firestore.  Include the displayName and username
            const userDocRef = doc(db, 'users', user.uid);
            const newUser = {
                uid: user.uid,
                email: user.email,
                firstName,
                lastName,
                name, // Use the combined name
                username, // Store the username
                registrationDate: new Date(),
            };
            await setDoc(userDocRef, newUser);

            // Update the local state
            setCurrentUser(user);
            setUserData(newUser); // set the user data
            return user;

        } catch (error) {
            console.error("Error signing up:", error);
            throw error; // Re-throw the error to be caught by the component
        }
    };

    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Error signing in:", error);
            throw error;
        }
    };

    const signOutUser = () => {
        return signOut(auth);
    };

    //  useEffect to handle user authentication state changes and fetch additional user data.
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch the user's data from Firestore
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    setUserData(userDocSnap.data());
                } else {
                    // Handle the case where the user document doesn't exist.
                    // This might occur if user was created before this logic was in place.
                    console.warn("User document not found in Firestore.  Creating an empty user data object.");
                    setUserData({
                        uid: user.uid,
                        email: user.email,
                        firstName: '',
                        lastName: '',
                        name: user.displayName || '',
                        username: '', // Add username
                        registrationDate: new Date(),
                    }); // Set minimal user data
                }
            } else {
                setUserData(null); // Clear user data when logged out
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        currentUser,
        userData,
        loading,
        signUp,
        signIn,
        signOutUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
