import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  const userRole = (user?.role || '').toLowerCase();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-20">
      {/* Logo */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 text-emerald-700 font-extrabold text-xl tracking-tight">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm">
            S
          </span>
          <span>SevaSahayog</span>
        </Link>

        {/* Navigation Links - ONLY shown when authenticated */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1 pl-4 border-l border-gray-200 text-xs font-bold text-gray-600">
            {userRole === 'admin' ? (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname.startsWith('/admin') ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'hover:bg-gray-100'
                }`}
              >
                Admin Dashboard
              </Link>
            ) : userRole === 'spoc' || userRole === 'corporate' ? (
              <Link
                to="/spoc/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname.startsWith('/spoc') ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'hover:bg-gray-100'
                }`}
              >
                SPOC Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname === '/dashboard' ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/events"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname.startsWith('/events') ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'hover:bg-gray-100'
                  }`}
                >
                  Browse Events
                </Link>
                <Link
                  to="/feedback/new"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname.startsWith('/feedback') ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'hover:bg-gray-100'
                  }`}
                >
                  Give Feedback
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Header Action: ONLY Login if unauthenticated; User Info + Sign Out if authenticated */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700 hidden sm:inline-block bg-gray-100 px-2.5 py-1 rounded-lg">
              👤 {user?.name || 'User'} ({userRole.toUpperCase()})
            </span>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
