import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Property from './pages/Property';
import UserProfile from './pages/UserProfile';
import Cookies from "js-cookie";

function App() {
  // Check if the user is logged in
  let refresh_token = Cookies.get("Refresh");
  let access_token = Cookies.get("Access");
  let isLoggedIn;
  if (access_token){
    isLoggedIn = true;
  }
  else{
    isLoggedIn = false;
  }

  return (
    <div className="root">
      {window.location.pathname !== '/register' && window.location.pathname !== '/login' && <Navbar/>}
      <Routes>

        {!isLoggedIn && (
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </>
        )}
        {isLoggedIn && (
          <>
            <Route path="/register" element={<Navigate to="/home" />} />
            <Route path="/login" element={<Navigate to="/home" />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/property/:listingID" element={<Property />} />
            <Route path="/user/:userID" element={<UserProfile />} />
          </>
        )}
      </Routes>
      {window.location.pathname !== '/register' && window.location.pathname !== '/login' && <Footer/>}
    </div>
  );
}

export default App;
