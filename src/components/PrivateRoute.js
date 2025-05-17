// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook

const PrivateRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        // You can return a loading spinner or a simple loading message here
        return <div>Loading authentication...</div>;
    }

    // If there's no current user, redirect to the sign-in page
    if (!currentUser) {
        return <Navigate to="/sign-in" replace />;
    }

    // If there's a user, render the children (the protected component)
    return children;
};

export default PrivateRoute;