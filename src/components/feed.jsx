import React, { useState, useEffect, useRef } from 'react';
import './pages.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase.init';
import axios from 'axios';
import { FiImage, FiSmile, FiMapPin } from 'react-icons/fi';
import { MdGif } from 'react-icons/md';
import Gif from './Gif';
import Emoji from './Emoji';
import AllPost from './AllPost'; // Import AllPost component

const Feed = () => {
  const [user] = useAuthState(auth);
  const [content, setContent] = useState('');
  const [textareaRows, setTextareaRows] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showGifPopup, setShowGifPopup] = useState(false);
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [location, setLocation] = useState('');
  const [isPremium, setIsPremium] = useState(false); // State to manage user's premium status
  const maxCharLimit = 200;
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTextareaRows(Math.min(5, textareaRef.current.scrollHeight / 20));
  }, [content]);

  useEffect(() => {
    // Fetch user details to check if the user is premium
    const fetchUserDetails = async () => {
      if (user) {
        try {
          console.log('Fetching details for user:', user.uid);
          const response = await axios.get('http://localhost:5000/user', {
            params: { uid: user.uid }
          });

          console.log('Response from server:', response); // Log the entire response

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

  const handleInputChange = (e) => {
    const inputContent = e.target.value;
    if (inputContent.length <= maxCharLimit) {
      setContent(inputContent);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      const imagesArray = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          imagesArray.push(reader.result);
          if (imagesArray.length === files.length) {
            setSelectedImages(imagesArray);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const handlePost = () => {
    console.log('Post content:', content);
    console.log('Selected images and GIFs:', selectedImages);
    if (locationPermission && location) {
      console.log('Location:', location);
    }
    // Clear inputs after posting
    setContent('');
    setSelectedImages([]);
    setLocation('');
    setLocationPermission(false);
  };

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleGifIconClick = () => {
    setShowGifPopup(true);
  };

  const handleSelectGif = (gifUrl) => {
    setSelectedImages(prevImages => [...prevImages, gifUrl]);
    setShowGifPopup(false);
  };

  const handleEmojiIconClick = () => {
    setShowEmojiPopup(true);
  };

  const handleSelectEmoji = (emoji) => {
    setContent(prevContent => prevContent + emoji);
    setShowEmojiPopup(false);
  };

  const handleDeselectImage = (index) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleLocationIconClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchLocationFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const fetchLocationFromCoordinates = (latitude, longitude) => {
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
      .then(response => response.json())
      .then(data => {
        const { city, principalSubdivision, countryCode } = data;
        const fetchedLocation = `${city}, ${principalSubdivision}, ${countryCode}`;
        setLocation(fetchedLocation);
        setLocationPermission(true);
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
      });
  };

  let charLimitClassName = 'prefix-char-limit';
  if (content.length >= 150 && content.length < 190) {
    charLimitClassName += ' prefix-yellow';
  } else if (content.length >= 190) {
    charLimitClassName += ' prefix-red';
  }

  return (
    <div className="page">
      <div className='upper'>
        <div>For you</div>
        <div>Following</div>
      </div>

      <div className="feed-post-container">
        <div className="feed-post-header">
          {user && user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              className={isPremium ? 'premium' : ''}
            />
          )}
          <textarea
            ref={textareaRef}
            className="feed-post-input"
            placeholder="Use post button to post not here"
            value={content}
            onChange={handleInputChange}
            rows={textareaRows}
          />
          <div className={charLimitClassName}>{content.length}/{maxCharLimit} characters</div>
        </div>
        {selectedImages.length > 0 && (
          <div className="feed-selected-images-container">
            {selectedImages.map((image, index) => (
              <div key={index} className="feed-selected-image-container">
                <img src={image} alt={`Selected ${index}`} className="feed-selected-image" />
                <button className="feed-deselect-button" onClick={() => handleDeselectImage(index)}>×</button>
              </div>
            ))}
          </div>
        )}
        {locationPermission && (
          <div className="feed-location-input">
            <input
              type="text"
              placeholder="Location"
              value={location}
              readOnly
            />
          </div>
        )}
        <div className="feed-post-buttons">
          <div className="feed-extras">
            <FiImage size={24} onClick={handleImageUploadClick} />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*"
              multiple
            />
            <MdGif size={44} onClick={handleGifIconClick} />
            <FiSmile size={24} onClick={handleEmojiIconClick} />
            <FiMapPin size={24} onClick={handleLocationIconClick} />
          </div>
          <button onClick={handlePost} disabled={!content.trim() && !selectedImages.length}>Post</button>
        </div>

        {showGifPopup && (
          <Gif onSelectGif={handleSelectGif} onClose={() => setShowGifPopup(false)} />
        )}

        {showEmojiPopup && (
          <Emoji onSelectEmoji={handleSelectEmoji} onClose={() => setShowEmojiPopup(false)} />
        )}
      </div>

      {/* Display random posts */}
      <div className="random-posts-section">
        <AllPost isPremium={isPremium} />
      </div>
    </div>
  );
};

export default Feed;
