import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GoogleTranslate.css'; // Import the CSS file

const GoogleTranslate = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const scriptId = 'google-translate-script';

    const loadScript = () => {
      if (!document.getElementById(scriptId)) {
        const addScript = document.createElement('script');
        addScript.src = 'https://translate.google.com/translate_a/element.js?cb=loadGoogleTranslate';
        addScript.id = scriptId;
        addScript.async = true;
        addScript.onerror = () => console.error('Google Translate script failed to load.');
        document.body.appendChild(addScript);
      } else {
        initializeGoogleTranslate();
      }
    };

    const initializeGoogleTranslate = () => {
      if (window.google && window.google.translate && !window.googleTranslateElementInit) {
        window.googleTranslateElementInit = true;
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en' },
          'google_element'
        );
      }
    };

    window.loadGoogleTranslate = initializeGoogleTranslate;

    loadScript();

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.body.removeChild(existingScript);
        window.googleTranslateElementInit = false;
      }
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    navigate('/');
  };

  return (
    isVisible && (
      <div className="google-translate-popup">
        <div className="google-translate-content">
          <div id="google_element" className="google-element"></div>
          <span className="close-button" onClick={handleClose}>×</span>
        </div>
      </div>
    )
  );
};

export default GoogleTranslate;
