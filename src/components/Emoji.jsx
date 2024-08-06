import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Emoji.css'; // Import CSS for styling

const Emoji = ({ onSelectEmoji, onClose }) => {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const response = await axios.get('https://emoji-api.com/emojis', {
          params: {
            access_key: '421f16a5d1096a1e7ddad1950d61db90578ef00b' 
          }
        });
        setEmojis(response.data);
      } catch (error) {
        console.error('Error fetching emojis:', error);
      }
    };

    fetchEmojis();
  }, []);

  return (
    <div className="emoji-popup">
      <div className="emoji-popup-content">
        <div className="emoji-popup-header">
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="emoji-list">
          {emojis.map((emoji, index) => (
            <span key={index} className="emoji-item" onClick={() => onSelectEmoji(emoji.character)}>
              {emoji.character}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Emoji;
