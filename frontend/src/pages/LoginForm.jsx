import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { authApi } from '../services/api';

const LoginForm = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Determine display titles and registration based on role
  let roleTitle = 'Login';
  let showRegister = true;
  let isCorporate = false;

  if (role === 'admin') {
    roleTitle = 'Admin / NGO Login';
    showRegister = false;
  } else if (role === 'volunteer') {
    roleTitle = 'Volunteer Login';
  } else if (role === 'corporate') {
    roleTitle = 'Corporate SPOC Login';
    isCorporate = true;
  } else {
    roleTitle = 'Login';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Send email, password, and the requested role
      const loginPayload = { email, password, role };
      if (isCorporate) {
        loginPayload.companyName = companyName; // Just in case it's useful for future backend checks
      }
      
      const response = await authApi.login(loginPayload);
      
      // Store token and user
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg min-h-[600px] flex flex-col justify-center bg-white border border-slate-100 p-8 sm:p-12 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-slate-800">{roleTitle}</h2>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {isCorporate && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="companyName">
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-slate-50 transition-all text-slate-900 text-lg"
                  placeholder="Enter company name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-slate-50 transition-all text-slate-900 text-lg"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-slate-50 transition-all text-slate-900 text-lg"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full bg-amber-400 text-slate-900 font-extrabold text-lg py-4 px-4 rounded-xl hover:bg-amber-300 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {showRegister && (
            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-base">
              <p className="text-slate-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-bold text-amber-500 hover:text-amber-600 transition-colors">
                  Register below
                </Link>
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-block text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 px-4 py-3 rounded-lg">
              ← Back to role selection
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginForm;
