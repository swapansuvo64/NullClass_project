import React, { useState } from 'react';
import './sidebar.css';
import xIcon from '../asset/twitter.png';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase.init';
import { Link } from "react-router-dom";
import Post from './post';
import OTPAuth from './OTPAuth';

function Sidebar() {
  const [user] = useAuthState(auth);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isPhoneAuthOpen, setIsPhoneAuthOpen] = useState(false);

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('User logged out');
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  const handlePostButtonClick = () => {
    setIsPostOpen(true);
  };

  const handleClosePost = () => {
    setIsPostOpen(false);
  };

  const handleLanguageClick = () => {
    setIsPhoneAuthOpen(true); // Open PhoneAuth popup
  };

  const handleClosePhoneAuth = () => {
    setIsPhoneAuthOpen(false); // Close PhoneAuth popup
  };

  // Debugging
  console.log('User:', user);

  return (
    <div className='sidebar'>
      <div className='sidebarItem'>
        <div className='items'>
          <img className='img' src={xIcon} alt="Twitter Icon" />
        </div>
        <Link to='/feed' className='sidebarLink'>
          <div className='item'>
            <div className='icondiv'>
              <HomeIcon className='icon' style={{ fontSize: '40px' }} />
            </div>
            <div className='text' style={{ fontWeight: 'bolder' }}>
              Home
            </div>
          </div>
        </Link>
        <Link to='/explore' className='sidebarLink'>
          <div className='item'>
            <div className='icondiv'>
              <SearchIcon className='icon' style={{ fontSize: '40px' }} />
            </div>
            <div className='text' style={{ fontWeight: '10px' }}>
              Explore
            </div>
          </div>
        </Link>
        <Link to='/notification' className='sidebarLink'>
          <div className='item'>
            <div className='icondiv'>
              <NotificationsIcon className='icon' style={{ fontSize: '40px' }} />
            </div>
            <div className='text' style={{ fontWeight: '10px' }}>
              Notifications
            </div>
          </div>
        </Link>
        <Link to='/messages' className='sidebarLink'>
          <div className='item'>
            <div className='icondiv'>
              <MailOutlineIcon className='icon' style={{ fontSize: '40px' }} />
            </div>
            <div className='text' style={{ fontWeight: '10px' }}>
              Messages
            </div>
          </div>
        </Link>
        <Link to='/bookmarks' className='sidebarLink'>
          <div className='item'>
            <div className='icondiv'>
              <BookmarkBorderIcon className='icon' style={{ fontSize: '40px' }} />
            </div>
            <div className='text' style={{ fontWeight: '10px' }}>
              Bookmarks
            </div>
          </div>
        </Link>
        <div className='item' onClick={handleLanguageClick}>
          <div className='icondiv'>
            <FeaturedPlayListIcon className='icon' style={{ fontSize: '40px' }} />
          </div>
          <div className='text' style={{ fontWeight: '10px' }}>
            Languages
          </div>
        </div>
        <Link to='/profile' className='sidebarLink'>
          <div className='item'>
            <div className='icondiv'>
              <PermIdentityIcon className='icon' style={{ fontSize: '40px' }} />
            </div>
            <div className='text' style={{ fontWeight: '10px' }}>
              Profile
            </div>
          </div>
        </Link>
        <Link to='/more' className='sidebarLink'>
          <div className='item'>
            <div className='icondiv'>
              <MoreHorizIcon className='icon' style={{ fontSize: '40px' }} />
            </div>
            <div className='text' style={{ fontWeight: '10px' }}>
              More
            </div>
          </div>
        </Link>
        <div className='tweet'>
          <button className='postButton' onClick={handlePostButtonClick}>Post</button>
        </div>
        <div className='user'>
          <div className='circularpicture'>
            {user && user.photoURL ? (
              <img src={user.photoURL} alt="Profile" onError={(e) => { e.target.src = 'fallback-image-url.png'; }} />
            ) : (
              <span>No Profile Picture</span>
            )}
          </div>
          <div className='username'>
            @{user ? <span>{user.displayName || user.email}</span> : 'Loading...'}
          </div>
          <div className='logout sign'>
            <LogoutIcon className='icon' style={{ fontSize: '20px', cursor: 'pointer' }} onClick={handleLogout} />
          </div>
        </div>
      </div>
      {isPostOpen && <Post onClose={handleClosePost} />}
      {isPhoneAuthOpen && <OTPAuth onClose={handleClosePhoneAuth} />}
    </div>
  );
}

export default Sidebar;
