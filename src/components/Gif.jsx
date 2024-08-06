import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gif.css'; // Import CSS for styling

const Gif = ({ onSelectGif, onClose }) => {
  const [gifSearchTerm, setGifSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedGifs, setSuggestedGifs] = useState([]); // State for suggested GIFs

  // Fetch trending GIFs when the component mounts
  useEffect(() => {
    const fetchTrendingGifs = async () => {
      try {
        const response = await axios.get('https://api.giphy.com/v1/gifs/trending', {
          params: {
            api_key: 'PsiL1rJuiXC6vLkSFzOiGGNTERqPk4AZ',
            limit: 20, 
            rating: 'g', 
          }
        });
        const gifResults = response.data.data;
        setSuggestedGifs(gifResults);
      } catch (error) {
        console.error('Error fetching trending GIFs:', error);
      }
    };

    fetchTrendingGifs();
  }, []);

  const handleGifSearch = async () => {
    try {
      const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
          api_key: 'PsiL1rJuiXC6vLkSFzOiGGNTERqPk4AZ',
          q: gifSearchTerm,
          rating: 'g',
        }
      });
      const gifResults = response.data.data;
      setSearchResults(gifResults);
    } catch (error) {
      console.error('Error searching GIFs:', error);
    }
  };

  const handleSelectGif = (gifUrl) => {
    onSelectGif(gifUrl);
    onClose(); 
    setGifSearchTerm('');
    setSearchResults([]);
  };

  const handleChange = (e) => {
    setGifSearchTerm(e.target.value);
    if (e.target.value.trim() !== '') {
      handleGifSearch();
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="gif-popup">
      <div className="gif-popup-content">
        <div className="gif-popup-header">
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <form className="gif-search-form" onSubmit={(e) => { e.preventDefault(); handleGifSearch(); }}>
          <input
            type="text"
            placeholder="Search GIFs"
            value={gifSearchTerm}
            onChange={handleChange} 
          />
        </form>
        <div className="gif-search-results">
          {gifSearchTerm.trim() === '' ? (
            suggestedGifs.map(gif => (
              <img
                key={gif.id}
                src={gif.images.fixed_height.url}
                alt={gif.title}
                className="gif-result"
                onClick={() => handleSelectGif(gif.images.fixed_height.url)}
              />
            ))
          ) : (
            searchResults.map(gif => (
              <img
                key={gif.id}
                src={gif.images.fixed_height.url}
                alt={gif.title}
                className="gif-result"
                onClick={() => handleSelectGif(gif.images.fixed_height.url)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Gif;
