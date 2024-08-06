import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OTPAuth.css';

const OTPAuth = ({ email, onClose }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/reqOTP', { email });
      alert('OTP sent successfully');
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error.response ? error.response.data : error.message);
      setError('Error sending OTP. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/verifyOTP', { email, otp });
      if (response.data.success) {
        alert('Email verified successfully');
        onClose();
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
      setError('Error verifying OTP. Please try again.');
    }
  };

  return (
    <div className="otp-popup">
      <div className="otp-popup-content">
        <span className="otp-popup-close" onClick={onClose}>&times;</span>
        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <h2>Send OTP</h2>
            <button type="submit">Send OTP</button>
            {error && <p className="error">{error}</p>}
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <h2>Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">Verify OTP</button>
            {error && <p className="error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default OTPAuth;
