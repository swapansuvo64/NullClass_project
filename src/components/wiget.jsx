import React, { useEffect, useState } from 'react';
import './TwitterWidget.css';

const TwitterWidget = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // Fetch accounts from the backend
    fetch('http://localhost:5000/all-posts')
      .then(response => response.json())
      .then(data => {
        setAccounts(data);
      })
      .catch(error => console.error('Error fetching accounts:', error));
  }, []);

  const handleSubscribeClick = () => {
    window.location.href = '/subscription';
  };

  return (
    <div className="twitter-widget">
      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>
      <div className="subscribe-section">
        <div className="first">Subscribe to Premium</div>
        <div className="second">Subscribe to unlock new features and if eligible, receive a share of ads revenue.</div>
        <button className="subscribe-button" onClick={handleSubscribeClick}>Subscribe</button>
      </div>
      
      <div className="h"><h4>See what they are posting</h4></div>
      

      <div className="whats-happening">
        <div className="all-accounts">
          {accounts.map((account) => (
            <div className="account" key={account._id}>
              <img src={account.userPhotoURL || 'default-avatar.png'} alt={account.userName} />
              <div className="account-info">
                <p className="account-name">{account.userName}</p>
                <p className="account-handle">@{account.userHandle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TwitterWidget;
