import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { authApi } from '../services/api';

const LoginForm = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const isCorporate = role === 'corporate' || role === 'spoc';
  const isAdmin = role === 'admin';
  const isVolunteer = role === 'volunteer' || (!isAdmin && !isCorporate);

  const [email, setEmail] = useState(
    isAdmin ? 'admin@sevasahayog.org' : isCorporate ? 'spoc@techcorp.com' : 'volunteer@example.com'
  );
  const [password, setPassword] = useState('password123');
  const [companyName, setCompanyName] = useState('Tech Corp India');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  let roleTitle = 'Login';
  let showRegister = !isAdmin;

  if (isAdmin) {
    roleTitle = 'Admin / NGO Staff Login';
  } else if (isVolunteer) {
    roleTitle = 'Volunteer Login';
  } else if (isCorporate) {
    roleTitle = 'Corporate SPOC Login';
    isCorporate = true;
  }

  const navigateToDashboard = (userRole) => {
    if (userRole === 'admin' || isAdmin) {
      navigate('/admin/dashboard');
    } else if (userRole === 'spoc' || userRole === 'corporate' || isCorporate) {
      navigate('/spoc/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const userRole = isAdmin ? 'admin' : isCorporate ? 'spoc' : 'volunteer';
    const mockUser = {
      name: isAdmin ? 'SevaSahayog Admin' : isCorporate ? 'Corporate Coordinator' : 'Volunteer User',
      email: email || 'user@example.com',
      role: userRole,
      companyName: isCorporate ? companyName || 'Tech Corp India' : undefined,
    };

    try {
      const loginPayload = { email, password, role: userRole };
      if (isCorporate) {
        loginPayload.companyName = companyName;
      }
      
      const response = await authApi.login(loginPayload);
      
      // Extract auth payload from backend ApiResponse ({ data: { token, user } })
      const authData = response?.data || response;
      const token = authData?.token || response?.token;
      const user = authData?.user || response?.user || {
        email,
        role: role || 'volunteer',
        name: email.split('@')[0],
      };
      
      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("Login submission error:", err, err?.response?.data);
      
      let errorMessage = 'Login failed. Please check your email and password.';
      
      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (typeof data.error === 'string') {
          errorMessage = data.error;
        } else if (data.error && typeof data.error.message === 'string') {
          errorMessage = data.error.message;
        }
      } else if (err?.message && err.message !== '[object Object]' && err.message !== 'Something went wrong') {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg min-h-[550px] flex flex-col justify-center bg-white border border-slate-100 p-8 sm:p-12 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>

          <div className="text-center mb-6">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-200 uppercase">
              {isAdmin ? '🛡️ NGO Admin Portal' : isCorporate ? '🏢 Corporate SPOC Portal' : '🤝 Volunteer Portal'}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">{roleTitle}</h2>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {isCorporate && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1" htmlFor="companyName">
                  Corporate Partner / Company Name *
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 font-semibold text-slate-900 text-sm"
                  placeholder="e.g. Tech Corp India"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1" htmlFor="email">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 font-semibold text-slate-900 text-sm"
                placeholder="Enter email address"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1" htmlFor="password">
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 font-semibold text-slate-900 text-sm"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Signing In...' : `Sign In & View ${isAdmin ? 'Admin' : isCorporate ? 'SPOC' : 'Volunteer'} Dashboard`}
            </button>
          </form>

          {showRegister && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-sm">
              <p className="text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link to="/signup" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Register here
                </Link>
              </p>
            </div>
          )}

          <div className="mt-4 text-center">
            <Link to="/login" className="inline-block text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors bg-slate-100 px-3 py-2 rounded-lg">
              ← Switch Role Selection
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginForm;
