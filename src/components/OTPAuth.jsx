import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OTPAuth.css';

const OTPAuth = ({ onClose }) => {
  const [email, setEmail] = useState('');
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
      if (response.data.message === 'OTP verified') {
        alert('OTP verified successfully');
        onClose(); 
        navigate('/language-selector'); 
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
      setError('Error verifying OTP. Please try again.');
    }
  };

  return (
    <div className="otp-auth-popup">
    <button className="close-button2" onClick={onClose}>&times;</button>
      <div className="otp-auth-content">
        
        <h4>Email Authentication</h4>
        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">Verify OTP</button>
          </form>
        )}
        {error && <p className="error">{error}</p>}
        {otpSent && <p>OTP has been sent to your email. Check your inbox.</p>}
      </div>
    </div>
  );
};

export default OTPAuth;
