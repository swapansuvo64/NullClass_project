import React from "react";
import { useAuthState } from 'react-firebase-hooks/auth'; 
import { auth } from '../firebase.init';
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        console.error(error);
        return <div>Error: {error.message}</div>; 
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
