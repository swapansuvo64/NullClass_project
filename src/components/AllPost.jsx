import React, { useEffect, useState } from 'react';
import './mypost.css'; // Use the same CSS file or create a separate one for AllPost

const AllPost = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/all-posts'); 
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        console.log('Fetched all posts:', data); 
        setPosts(data);
      } catch (error) {
        console.error('Error fetching all posts:', error);
        setError('Failed to fetch posts.'); 
      }
    };

    fetchAllPosts();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="all-posts-container">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div key={post._id || index} className="tweet-container">
            <div className="tweet-header">
              <img 
                className="profile-image" 
                src={post.userPhotoURL || 'default-avatar.png'} 
                alt="Profile" 
              />
              <div className="user-info">
                <span className="user-name">{post.userName || 'Unknown User'}</span>
                <span className="handle">@{post.userHandle || 'unknown'}</span>
              </div>
            </div>
            <div className="tweet-content">
              <p className="tweet-text">{post.content || 'No content available.'}</p>
              <div className={`tweet-images images-${post.images ? post.images.length : 0}`}>
                {post.images && post.images.map((img, imgIndex) => (
                  <img 
                    key={imgIndex} 
                    className="tweet-image" 
                    src={img} 
                    alt={`Tweet image ${imgIndex + 1}`} 
                  />
                ))}
              </div>
              {post.location && (
                <div className="tweet-location">
                  <span>{post.location}</span>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default AllPost;
