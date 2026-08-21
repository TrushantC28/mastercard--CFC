import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { volunteerProfile } from '../data/mockData';

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getStoredUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        return JSON.parse(storedUser);
      } catch {
        return volunteerProfile;
      }
    }
    return volunteerProfile;
  };

  const user = getStoredUser();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const role = user?.role ? user.role.toLowerCase() : 'volunteer';

  const navItems = role === 'admin'
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Events', path: '/events' },
        { name: 'Insights', path: '/insights' },
        { name: 'Reports', path: '/reports' },
        { name: 'Users', path: '/users' },
        { name: 'Profile', path: '/profile' },
      ]
    : role === 'spoc' || role === 'corporate'
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Events', path: '/events' },
        { name: 'Feedback', path: '/feedback' },
        { name: 'Reports', path: '/reports' },
        { name: 'Profile', path: '/profile' },
      ]
    : [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Events', path: '/events' },
        { name: 'Feedback', path: '/feedback' },
        { name: 'Profile', path: '/profile' },
      ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#1a4760] border-b border-[#13364a] sticky top-0 z-30 shadow-md">
        <div className="w-full px-6 sm:px-12 lg:px-16">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-black text-white tracking-tight">SevaSahayog</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-10 h-full ml-16 flex-1 items-center">
              {navItems.map((item) => {
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `inline-flex items-center h-full px-4 border-b-4 text-base font-bold tracking-wide transition-colors ${
                        isActive 
                          ? 'border-amber-400 text-amber-400' 
                          : 'border-transparent text-white hover:text-amber-200 hover:border-amber-200/50'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Side - User & Logout (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-base font-black text-white leading-tight">
                    {user?.name || 'Volunteer'}
                  </p>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-0.5">
                    {user?.role || 'VOLUNTEER'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-[#1a4760] font-black text-xl shadow-inner">
                  {user?.name?.charAt(0) || 'V'}
                </div>
              </div>
              <div className="w-px h-10 bg-[#285d7c]"></div>
              <button
                onClick={handleLogout}
                className="text-white font-bold hover:text-amber-400 transition-colors px-4 py-2 rounded-xl hover:bg-[#13364a] flex items-center gap-2 tracking-wide"
                title="Logout"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-amber-400 p-3 rounded-xl hover:bg-[#13364a] transition-colors"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#13364a] bg-[#1a4760]">
            <div className="px-6 pt-6 pb-8 space-y-2 shadow-inner">
              {/* User Profile Mobile */}
              <div className="flex items-center gap-4 mb-8 p-3 border-b border-[#285d7c] pb-6">
                <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-[#1a4760] font-black text-xl shadow-inner">
                  {user?.name?.charAt(0) || 'V'}
                </div>
                <div>
                  <p className="text-base font-black text-white">
                    {user?.name || 'Volunteer'}
                  </p>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-0.5">
                    {user?.role || 'VOLUNTEER'}
                  </p>
                </div>
              </div>

              {navItems.map((item) => {
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-4 rounded-2xl text-base font-bold tracking-wide transition-all ${
                        isActive 
                          ? 'bg-[#13364a] text-amber-400 border-l-4 border-amber-400' 
                          : 'text-white hover:bg-[#13364a] hover:text-amber-200 border-l-4 border-transparent'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="flex items-center justify-center px-4 py-4 mt-6 w-full rounded-2xl text-base font-bold text-red-400 hover:bg-red-400/10 transition-all tracking-wide"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 w-full max-w-[1500px] mx-auto px-6 lg:px-8 py-8 text-left">
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
