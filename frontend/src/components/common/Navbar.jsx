import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#0A2540] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-6">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-decoration-none">
              <span className="text-2xl font-extrabold text-amber-400 tracking-tight">SevaSahayog</span>
            </Link>
          </div>

          {/* Navigation Links for Logged-In Users */}
          {user ? (
            <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isActive('/dashboard') ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-200 hover:text-amber-400 hover:bg-slate-800/60'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/feedback"
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isActive('/feedback') ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-200 hover:text-amber-400 hover:bg-slate-800/60'
                }`}
              >
                Feedback Analytics
              </Link>
              <Link
                to="/feedback/new"
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isActive('/feedback/new') ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-200 hover:text-amber-400 hover:bg-slate-800/60'
                }`}
              >
                + Submit Feedback
              </Link>
              <Link
                to="/insights"
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isActive('/insights') ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-200 hover:text-amber-400 hover:bg-slate-800/60'
                }`}
              >
                🤖 AI Insights
              </Link>
              <Link
                to="/reports"
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isActive('/reports') ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-200 hover:text-amber-400 hover:bg-slate-800/60'
                }`}
              >
                📊 CSV Reports
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center">
              <span className="text-slate-300 font-medium text-sm">Volunteer Experience & Feedback Platform</span>
            </div>
          )}

          {/* Right Action Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">{user.role || 'Volunteer'}</span>
                  <span className="text-sm font-semibold text-white truncate max-w-[120px]">{user.name || user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-extrabold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
