import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
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
        <Link to="/login">
          <button className="btn btn-login">Login</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
