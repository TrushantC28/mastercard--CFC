import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const SpocLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const companyName = user?.corporatePartnerId?.name || user?.companyName || 'Tech Corp India';
  const spocName = user?.name || 'Corporate Coordinator';

  const navItems = [
    { label: 'Company Dashboard', path: '/spoc/dashboard', icon: '📊' },
    { label: 'Propose Activity', path: '/spoc/propose', icon: '📝' },
    { label: 'Registered Volunteers', path: '/spoc/volunteers', icon: '👥' },
    { label: 'Company Feedback', path: '/spoc/feedback', icon: '💬' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
            🏢
          </span>
          <div>
            <h1 className="font-bold text-gray-900 text-sm leading-tight">{companyName}</h1>
            <p className="text-[10px] text-gray-500 font-semibold">SPOC Coordinator Portal</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 font-bold"
        >
          {isMobileOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ height: '100vh' }}
      >
        {/* Company & SPOC Badge */}
        <div className="p-5 border-b border-gray-100 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-extrabold text-lg flex items-center justify-center shadow-sm">
              🏢
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900 text-sm leading-tight line-clamp-1">
                {companyName}
              </h2>
              <p className="text-xs text-emerald-700 font-bold mt-0.5">SPOC Portal</p>
            </div>
          </div>

          <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 text-[11px] font-semibold text-emerald-800 flex items-center gap-2">
            <span>👤</span>
            <span className="truncate">{spocName}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer & Logout */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span>🌐</span>
            <span>Volunteer App</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-full uppercase border border-emerald-200 mb-1">
              Corporate Partner Dashboard • {companyName}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">{title}</h1>
            {subtitle && <p className="text-xs text-gray-500 font-medium mt-0.5">{subtitle}</p>}
          </div>

          <button
            onClick={() => navigate('/spoc/propose')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-center"
          >
            + Propose New Activity
          </button>
        </header>

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

export default SpocLayout;
