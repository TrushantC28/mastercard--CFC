import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;
  if (userStr) {
    try { user = JSON.parse(userStr); } catch (e) {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="logo-text">SevaSahayog</h1>
        </Link>
      </div>
      
      <div className="nav-center">
        <span className="portal-text">Volunteer Experience Portal</span>
      </div>
      
      <div className="nav-right">
        {token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#fbbf24', fontWeight: 'bold', fontSize: '14px' }}>
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-login" style={{ background: '#ef4444', color: '#fff', border: 'none' }}>
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="btn btn-login">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
