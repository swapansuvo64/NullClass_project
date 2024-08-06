import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import xIcon from '../asset/twitter.png';
import { auth } from '../firebase.init';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import './log.css';
import GoogleButton from "react-google-button";

const Log = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorM, setError] = useState('');
    const navigate = useNavigate();

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    const [
        signInWithGoogle,
        googleUser,
        googleLoading,
        googleError
    ] = useSignInWithGoogle(auth);

    useEffect(() => {
        if (user || googleUser) {
            navigate('/feed');
        }
        if (error || googleError) {
            setError((error || googleError).message);
        }
    }, [user, googleUser, error, googleError, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleSignIn = () => {
        signInWithGoogle();
    };

    return (
        <div className="login">
            <div className="container">
                <img src={xIcon} alt="Twitter Icon" />
            </div>
            <div className="container">
                <h2>Happening now</h2>
                <h3>Join today.</h3>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" className="email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="password" onChange={(e) => setPassword(e.target.value)} />
                    <div className="btn-log">
                        <button type="submit" className="btn">Login</button>
                    </div>
                    {errorM && <p style={{ color: 'red' }}>{errorM}</p>}
                </form>
                <div className="google-button1">
                    <GoogleButton className="g-btn" type="light" onClick={handleGoogleSignIn} />
                </div>
                <div className="al">Already don't have an account?
                    <Link to='/signup' style={{ color: 'skyblue', textDecoration: 'none', fontWeight: '600', marginLeft: '5px' }}>
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Log;
