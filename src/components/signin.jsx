import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import xIcon from '../asset/twitter.png';
import { auth } from '../firebase.init';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import GoogleButton from "react-google-button";
import './sign.css'; // Import the CSS file
import axios from "axios";

const Sign = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorM, setError] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const navigate = useNavigate();

    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);

    const [
        signInWithGoogle,
        googleUser,
        googleLoading,
        googleError
    ] = useSignInWithGoogle(auth);

    useEffect(() => {
        const device = navigator.userAgent; 

       
        const fetchIpAddress = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setIpAddress(response.data.ip);
            } catch (error) {
                console.error("Error fetching IP address:", error);
            }
        };

        fetchIpAddress();

        if (googleUser) {
            const userToSave = {
                username: googleUser.user.displayName || '',
                name: googleUser.user.displayName || '',
                email: googleUser.user.email || '',
                photoURL: googleUser.user.photoURL || '',
                uid: googleUser.user.uid,
                premium: 'Nan',
                device: device, 
                ipAddress: ipAddress 
            };

            axios.post('http://localhost:5000/register', userToSave)
                .then(response => {
                    console.log(response.data);
                    navigate('/feed');
                })
                .catch(error => {
                    setError(error.message);
                    navigate('/feed');  
                });
        } else if (user) {
            const userToSave = {
                username: username,
                name: name,
                email: email,
                photoURL: "",
                uid: user.user.uid,
                premium: 'Nan',
                device: device, 
                ipAddress: ipAddress 
            };

            axios.post('http://localhost:5000/register', userToSave)
                .then(response => {
                    console.log(response.data);
                    navigate('/feed');
                })
                .catch(error => {
                    setError(error.message);
                });
        }

        if (error || googleError) {
            setError((error || googleError).message);
        }
    }, [user, googleUser, error, googleError, navigate, ipAddress]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await createUserWithEmailAndPassword(email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleSignIn = () => {
        signInWithGoogle();
    };

    return (
        <div className="sign">
            <div className="img-container">
                <img style={{ height: '450px', width: '450px' }} src={xIcon} alt="Twitter Icon" />
            </div>
            <div className="form-container">
                <h2>Happening now</h2>
                <h3>Join today.</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="@username" className="username" onChange={(e) => setUsername(e.target.value)} />
                    <input type="text" placeholder="Name" className="name" onChange={(e) => setName(e.target.value)} />
                    <input type="email" placeholder="Email" className="email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="password" onChange={(e) => setPassword(e.target.value)} />
                    <div className="btn-log">
                        <button type="submit" className="btn">Sign-up</button>
                    </div>
                    {errorM && <p style={{ color: 'red' }}>{errorM}</p>}
                </form>
                <hr />
                <div className="google-button">
                    <GoogleButton className="g-btn" type="light" onClick={handleGoogleSignIn} />
                </div>
                <div className="al">Already have an account?
                    <Link to='/login' style={{ color: 'skyblue', textDecoration: 'none', fontWeight: '600', marginLeft: '5px' }}>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sign;
