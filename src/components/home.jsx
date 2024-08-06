import React from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase.init';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from "./sidebar";
import './home.css'
import TwitterWidget from "./wiget";

const Home = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut().then(() => {
            // Redirect to login page or any other page after logout
            navigate('/login');
        }).catch((error) => {
            console.error('Error signing out:', error);
            // Handle any errors during logout
        });
    };

    return (
        <div className="home" >
            {/* <h2>Welcome, {user ? user.email : 'Guest'}</h2>
            <button onClick={handleLogout}>Logout</button> */}
            <Sidebar/>
            <Outlet/>
            <TwitterWidget/>
            
        </div>
    );
};

export default Home;
