import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../Firebase/client'; // Correct import
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Ensure that the check is based on the latest isAuthenticated value
  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/sign-in" />;
  }
};

export default ProtectedRoute;