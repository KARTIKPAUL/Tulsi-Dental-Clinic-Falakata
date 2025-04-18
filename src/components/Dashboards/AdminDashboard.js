// src/components/AdminDashboard.js
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext"; // import { useDispatch } from 'react-redux';
// import { logout } from '../features/auth/authSlice';

const AdminDashboard = () => {
  const { loginUser, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h2>Welcome to the Admin Dashboard!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
