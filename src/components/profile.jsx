import React, { useState, useEffect } from 'react';
import './profile.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MyPost from './mypost';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase.init';
import axios from 'axios';

const Profile = () => {
    const [user] = useAuthState(auth);
    const [postCount, setPostCount] = useState(0);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user) {
                try {
                    console.log('Fetching details for user:', user.uid);
                    const response = await axios.get('http://localhost:5000/user', {
                        params: { uid: user.uid }
                    });

                    console.log('Response from server:', response); 

                    if (response.status === 200) {
                        const userPremium = response.data.premium;
                        setIsPremium(userPremium !== "Nan");
                    } else {
                        throw new Error(`Failed to fetch user details: ${response.status}`);
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        fetchUserDetails();
    }, [user]);

    const handlePostCountUpdate = (count) => {
        setPostCount(count);
    };

    return (
        <div className="profile">
            <div className="up">
                <div className="icon1">
                    <ArrowBackIcon style={{ fontSize: '30px', cursor: 'pointer' }} />
                </div>
                {user && (
                    <div className="profileText">{user.displayName}</div>
                )}
                <div className="postNumber">{postCount} posts</div>
            </div>
            <div className="coverPhoto"></div>
            <div className="profile-photo-container">
                {user && user.photoURL && (
                    <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className={`profile-photo ${isPremium ? 'premium' : ''}`} 
                    />
                )}
            </div>
            {user && (
                <div className="profileN">
                    {user.displayName}
                </div>
            )}
            <div className="follow">
                <div className="follows">
                    <div className="followingNum">
                        0
                    </div>
                    <div className="following">
                        Following
                    </div>
                </div>
                <div className="follows">
                    <div className="followingNum">
                        0
                    </div>
                    <div className="following">
                        Followers
                    </div>
                </div>
            </div>
            <div className="myPost">
                <div className="item">Posts</div>
                <div className="item">Articles</div>
                <div className="item">Media</div>
            </div>
            <div className="EditBtn">
                <button className="Btn">Edit Profile</button>
            </div>
            <div className="post">
                <MyPost onPostCountUpdate={handlePostCountUpdate} isPremium={isPremium} />
            </div>
        </div>
    );
};

export default Profile;
