import React, { useState, useRef, useEffect } from 'react';
import './midpart.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase.init';
import { FiImage, FiSmile, FiMapPin } from 'react-icons/fi';
import { MdGif } from 'react-icons/md';
import Gif from './Gif'; // Import the Gif component
import Emoji from './Emoji'; // Import the Emoji component
import axios from 'axios';

const Post = ({ onClose }) => {
  const [user] = useAuthState(auth);
  const [content, setContent] = useState('');
  const [textareaRows, setTextareaRows] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showGifPopup, setShowGifPopup] = useState(false); // State to control GIF popup visibility
  const [showEmojiPopup, setShowEmojiPopup] = useState(false); // State to control Emoji popup visibility
  const [locationPermission, setLocationPermission] = useState(false); // State to manage location permission
  const [location, setLocation] = useState(''); // State to manage location information
  const [premium, setPremium] = useState(null); // State to store premium field
  const [maxCharLimit, setMaxCharLimit] = useState(200); // State for max character limit

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTextareaRows(Math.min(5, textareaRef.current.scrollHeight / 20));
  }, [content]);

  useEffect(() => {
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
            setPremium(userPremium);

            // Set the max character limit based on premium status
            if ([55000].includes(userPremium)) {
              setMaxCharLimit(300);
            } else if ([85000, 16000].includes(userPremium)) {
              setMaxCharLimit(500);
            } else {
              setMaxCharLimit(200);
            }
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

  const handlePost = async () => {
    try {
      const post = {
        content,
        selectedImages,
        location,
        user,
      };
  
      const response = await fetch('http://localhost:5000/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });
  
      if (response.status === 403) {
        // Handle post limit reached
        alert('Post limit reached for today. Please try again tomorrow.');
        window.location.href = '/subscription';
        return;
      }
  
      if (!response.ok) {
        throw new Error('Failed to post data');
      }
  
      // Close the post popup after successful submission
      onClose();
    } catch (error) {
      console.error('Error posting data:', error);
      // Handle error (e.g., show error message to user)
    }
  };
  
  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleGifIconClick = () => {
    setShowGifPopup(true); // Show GIF popup when MdGif icon is clicked
  };

  const handleSelectGif = (gifUrl) => {
    setSelectedImages(prevImages => [...prevImages, gifUrl]);
    setShowGifPopup(false); // Hide GIF popup after selecting a GIF
  };

  const handleEmojiIconClick = () => {
    setShowEmojiPopup(true); // Show Emoji popup when FiSmile icon is clicked
  };

  const handleSelectEmoji = (emoji) => {
    setContent(prevContent => prevContent + emoji); // Append selected emoji to the content
    setShowEmojiPopup(false); // Hide Emoji popup after selecting an emoji
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
        setLocationPermission(true); // Grant permission after fetching location
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
      });
  };

  let charLimitClassName = 'char-limit';
  if (content.length >= 150 && content.length < 190) {
    charLimitClassName += ' yellow';
  } else if (content.length >= 190) {
    charLimitClassName += ' red';
  }

  return (
    <div className="post-popup">
      <div className="post-content">
        <div className="close-button1" onClick={onClose}>&times;</div>
        <div className="post-header">
          {user && user.photoURL && <img src={user.photoURL} alt="Profile" />}
          <textarea
            ref={textareaRef}
            className="post-input"
            placeholder="What's happening?"
            value={content}
            onChange={handleInputChange}
            rows={textareaRows}
          />
          <div className={charLimitClassName}>{content.length}/{maxCharLimit} characters</div>
        </div>

        {selectedImages.length > 0 && (
          <div className="selected-images-container">
            {selectedImages.map((image, index) => (
              <div key={index} className="selected-image-container">
                <img src={image} alt={`Selected ${index}`} className="selected-image" />
                <button className="deselect-button" onClick={() => handleDeselectImage(index)}>×</button>
              </div>
            ))}
          </div>
        )}
        {locationPermission && (
          <div className="location-input">
            <input
              type="text"
              placeholder="Location"
              value={location}
              readOnly
            />
          </div>
        )}
        <div className="post-buttons" style={{ paddingBottom: '2%' }}>
          <div className="extras">
            <FiImage size={24} onClick={handleImageUploadClick} />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*"
              multiple // Allow multiple file selection
            />
            <MdGif size={44} onClick={handleGifIconClick} />
            <FiSmile size={24} onClick={handleEmojiIconClick} />
            <FiMapPin size={24} onClick={handleLocationIconClick} />
          </div>
          <button onClick={handlePost} disabled={!content.trim() && !selectedImages.length}>Post</button>
        </div>
      </div>

      {showGifPopup && (
        <Gif onSelectGif={handleSelectGif} onClose={() => setShowGifPopup(false)} />
      )}

      {showEmojiPopup && (
        <Emoji onSelectEmoji={handleSelectEmoji} onClose={() => setShowEmojiPopup(false)} />
      )}
    </div>
  );
};

export default Post;
