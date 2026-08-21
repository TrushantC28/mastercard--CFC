import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="logo-text">SevaSahayog</h1>
      </div>
      
      <div className="nav-center">
        <span className="portal-text">Volunteer Experience Portal</span>
      </div>
      
      <div className="nav-right">
        <button className="btn btn-login">Login</button>
        <button className="btn btn-signup">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
