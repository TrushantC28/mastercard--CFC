import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { authApi } from '../services/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Volunteer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Contact number is required';
    if (role === 'Corporate SPOC' && !formData.companyName.trim()) newErrors.companyName = 'Company Name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (validate()) {
      setIsLoading(true);
      try {
        const payload = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: role === 'Volunteer' ? 'volunteer' : 'spoc',
          corporatePartnerId: null // Per API spec for new signups
        };

        await authApi.register(payload);
        
        // On success, redirect back to the specific login page
        navigate(`/login/${role === 'Volunteer' ? 'volunteer' : 'corporate'}`);
      } catch (err) {
        setApiError(err.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-[440px] bg-white border border-slate-100 p-8 rounded-2xl shadow-md relative overflow-hidden">
          {/* Top Yellow Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
          
          <h2 className="text-2xl font-extrabold mb-1 text-center text-[#0A2540]">Create Your Account</h2>
          <p className="text-sm text-slate-500 mb-6 text-center">
            Join the SevaSahayog Volunteer Experience Portal
          </p>

          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Role Selection Toggle */}
            <div>
              <span className="block text-sm font-bold text-slate-700 mb-2">Register as</span>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => {
                    setRole('Volunteer');
                    setErrors({});
                    setApiError('');
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    role === 'Volunteer' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Volunteer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('Corporate SPOC');
                    setErrors({});
                    setApiError('');
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    role === 'Corporate SPOC' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Corporate SPOC
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                className={`w-full px-4 py-2.5 border ${errors.name ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-slate-50 transition-all text-slate-900`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Company Name Field (SPOC only) */}
            {role === 'Corporate SPOC' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="companyName">
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => {
                    setFormData({ ...formData, companyName: e.target.value });
                    if (errors.companyName) setErrors({ ...errors, companyName: null });
                  }}
                  className={`w-full px-4 py-2.5 border ${errors.companyName ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-slate-50 transition-all text-slate-900`}
                  placeholder="Enter your company name"
                />
                {errors.companyName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.companyName}</p>}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                className={`w-full px-4 py-2.5 border ${errors.email ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-slate-50 transition-all text-slate-900`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Contact Number Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="phone">
                Contact Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: null });
                }}
                className={`w-full px-4 py-2.5 border ${errors.phone ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-slate-50 transition-all text-slate-900`}
                placeholder="Enter your contact number"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                className={`w-full px-4 py-2.5 border ${errors.password ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-slate-50 transition-all text-slate-900`}
                placeholder="Create a password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                }}
                className={`w-full px-4 py-2.5 border ${errors.confirmPassword ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-slate-50 transition-all text-slate-900`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full bg-amber-400 text-[#0A2540] font-extrabold text-sm py-3 px-4 rounded-xl hover:bg-amber-300 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer h-[46px]"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#0A2540] hover:text-amber-600 transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignupPage;
