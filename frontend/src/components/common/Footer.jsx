import React from 'react';
import { Mail, Globe, MessageCircle, Share2 } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">SevaSahayog</div>
          <p className="footer-description">
            Together, we listen, learn and create better volunteering experiences.
          </p>
        </div>
        
        <div className="footer-middle">
          <a href="#home" className="footer-link">Home</a>
          <a href="#about" className="footer-link">About Us</a>
          <a href="#contact" className="footer-link">Contact Us</a>
          <a href="#privacy" className="footer-link">Privacy Policy</a>
          <a href="#terms" className="footer-link">Terms & Conditions</a>
        </div>
        
        <div className="footer-right">
          <h3>Connect With Us</h3>
          <div className="contact-emails">
            <span className="contact-email">pune@sevasahayog.com</span>
            <span className="contact-email">mumbai@sevasahayog.com</span>
          </div>
          <div className="social-icons">
            <Globe className="social-icon" size={24} />
            <MessageCircle className="social-icon" size={24} />
            <Share2 className="social-icon" size={24} />
            <Mail className="social-icon" size={24} />
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 SevaSahayog Foundation. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
