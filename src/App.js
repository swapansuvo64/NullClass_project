import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Log from './components/login';
import Sign from './components/signin';
import ProtectedRoute from './components/protectedRoute';
import Feed from './components/feed';
import Profile from './components/profile';
import Explore from './components/explore';
import Notification from './components/notification';
import Msg from './components/messages';
import Bookmark from './components/bookmarks';
import LanguageSelector from './components/LanguageSelector';
import More from './components/more';
import Subs from './components/Subscription';
import OTPAuth from './components/OTPAuth';
import OTPAuth1 from './components/OTPAuth1';
import PaymentComponent from './components/PaymentComponent';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}>
          <Route index element={<Feed />} />
          <Route path="feed" element={<Feed />} />
          <Route path="explore" element={<Explore />} />
          <Route path="notification" element={<Notification />} />
          <Route path="messages" element={<Msg />} />
          <Route path="bookmarks" element={<Bookmark />} />
          <Route path="language-selector" element={<LanguageSelector />} />
          <Route path="profile" element={<Profile />} />
          <Route path="more" element={<More />} />
          <Route path="OTPAuth" element={<OTPAuth />} />
          <Route path="OTPAuth1" element={<OTPAuth1 />} />
        </Route>
        <Route path="/login" element={<Log />} />
        <Route path="/signup" element={<Sign />} />
        <Route path="/subscription" element={<Subs />} />
        <Route path="/Payments" element={<PaymentComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
