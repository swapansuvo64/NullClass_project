import React from "react";
import { useAuthState } from 'react-firebase-hooks/auth'; // Use useAuthState
import { auth } from '../firebase.init'; // Adjust the path as needed
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        return <div>Loading...</div>; // You can customize this as needed
    }

    if (error) {
        console.error(error);
        return <div>Error: {error.message}</div>; // Customize error handling
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
