import React, { useEffect, useState } from 'react';
import './mypost.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase.init';

const MyPost = ({ onPostCountUpdate, isPremium }) => {
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:5000/post?userId=${user.uid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          const data = await response.json();
          setPosts(data);
          onPostCountUpdate(data.length);  
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    };

    fetchPosts();
  }, [user, onPostCountUpdate]);

  return (
    <div>
      {posts.map((post, index) => (
        <div key={index} className="tweet-container">
          <div className="tweet-header">
            <img
              className={`profile-image ${isPremium ? 'premium' : ''}`} 
              src={user.photoURL}
              alt="Profile"
            />
            <div className="user-info">
              <span className="user-name">{user.displayName}</span>
              <span className="handle">@{user.email.split('@')[0]}</span>
            </div>
          </div>
          <div className="tweet-content">
            <p className="tweet-text">{post.content}</p>
            <div className={`tweet-images images-${post.images.length}`}>
              {post.images.map((img, imgIndex) => (
                <img key={imgIndex} className="tweet-image" src={img} alt={`Tweet image ${imgIndex + 1}`} />
              ))}
            </div>
            {post.location && (
              <div className="tweet-location">
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPost;
