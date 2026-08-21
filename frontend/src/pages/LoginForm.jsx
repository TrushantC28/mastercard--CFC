import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const LoginForm = ({ role = 'Volunteer', onBack, onRoleChange }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isSPOC = role === 'Corporate SPOC';
  const isAdmin = role === 'Admin/NGO' || role === 'Admin';
  const isVolunteer = role === 'Volunteer';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (isSPOC && !formData.companyName.trim()) {
      setError('Please enter your company name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    setIsSubmitting(true);

    // Simulate authentication
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      console.log('Login submitted successfully:', { role, ...formData });
    }, 1000);
  };

  const getRoleConfig = () => {
    switch (role) {
      case 'Corporate SPOC':
        return {
          title: 'Corporate SPOC Login',
          subtitle: 'Access your corporate CSR dashboard and track employee volunteer engagement',
          icon: <Building2 size={24} color="#0A2540" />,
          badgeColor: '#E0F2FE',
          badgeText: '#0369A1'
        };
      case 'Admin/NGO':
      case 'Admin':
        return {
          title: 'Admin / NGO Login',
          subtitle: 'Authorized administration portal for NGO coordinators and platform managers',
          icon: <ShieldCheck size={24} color="#0A2540" />,
          badgeColor: '#FEF3C7',
          badgeText: '#92400E'
        };
      case 'Volunteer':
      default:
        return {
          title: 'Volunteer Login',
          subtitle: 'Welcome back! Sign in to view upcoming drives, track hours and submit feedback',
          icon: <User size={24} color="#0A2540" />,
          badgeColor: '#DCFCE7',
          badgeText: '#15803D'
        };
    }
  };

  const roleConfig = getRoleConfig();

  return (
    <div className="login-form-container">
      {/* Embedded CSS */}
      <style>{`
        .login-form-container {
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(10, 37, 64, 0.08), 0 1px 3px rgba(10, 37, 64, 0.05);
          border: 1px solid #E2E8F0;
          overflow: hidden;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: all 0.3s ease;
        }

        .login-form-header {
          padding: 2rem 2rem 1.25rem 2rem;
          position: relative;
          background: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%);
          border-bottom: 1px solid #F1F5F9;
        }

        .back-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #64748B;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 6px;
          margin-bottom: 1.25rem;
          transition: all 0.2s ease;
        }

        .back-nav-btn:hover {
          color: #0A2540;
          background-color: #E2E8F0;
        }

        .role-badge-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 0.825rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .form-main-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #0A2540;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .form-main-subtitle {
          font-size: 0.875rem;
          color: #64748B;
          margin: 0;
          line-height: 1.5;
        }

        .login-form-body {
          padding: 2rem;
        }

        .role-switch-pills {
          display: flex;
          background: #F1F5F9;
          padding: 4px;
          border-radius: 10px;
          margin-bottom: 1.75rem;
          gap: 4px;
        }

        .role-pill-btn {
          flex: 1;
          background: transparent;
          border: none;
          padding: 8px 6px;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 7px;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          text-align: center;
        }

        .role-pill-btn.active {
          background: #FFFFFF;
          color: #0A2540;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .role-pill-btn:hover:not(.active) {
          color: #0A2540;
        }

        .form-group {
          margin-bottom: 1.25rem;
          text-align: left;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1E293B;
          margin-bottom: 0.5rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #94A3B8;
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 2.75rem;
          font-size: 0.95rem;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          color: #0F172A;
          background-color: #FFFFFF;
          transition: all 0.2s ease;
          outline: none;
          font-family: inherit;
        }

        .form-input:focus {
          border-color: #0A2540;
          box-shadow: 0 0 0 3px rgba(10, 37, 64, 0.1);
        }

        .form-input.has-toggle {
          padding-right: 2.75rem;
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }

        .password-toggle-btn:hover {
          color: #0A2540;
        }

        .form-row-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1.25rem 0 1.75rem 0;
          font-size: 0.85rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          cursor: pointer;
          font-weight: 500;
          user-select: none;
        }

        .checkbox-input {
          width: 16px;
          height: 16px;
          accent-color: #0A2540;
          cursor: pointer;
        }

        .forgot-link {
          color: #0A2540;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .forgot-link:hover {
          color: #FF9800;
          text-decoration: underline;
        }

        /* Yellow Login Button */
        .btn-yellow-login {
          width: 100%;
          background-color: #FFC107;
          color: #0A2540;
          border: none;
          padding: 0.9rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.35);
          letter-spacing: 0.3px;
        }

        .btn-yellow-login:hover:not(:disabled) {
          background-color: #FFD54F;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 193, 7, 0.45);
        }

        .btn-yellow-login:active:not(:disabled) {
          background-color: #FFB300;
          transform: translateY(0);
        }

        .btn-yellow-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid #0A2540;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #FEF2F2;
          color: #991B1B;
          border: 1px solid #F87171;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .success-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #F0FDF4;
          color: #166534;
          border: 1px solid #86EFAC;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .form-footer-area {
          margin-top: 1.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid #F1F5F9;
          text-align: center;
          font-size: 0.875rem;
        }

        .admin-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #64748B;
          font-size: 0.8rem;
          background: #F8FAFC;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px dashed #CBD5E1;
          line-height: 1.4;
        }
      `}</style>

      {/* Header */}
      <div className="login-form-header">
        {onBack && (
          <button 
            type="button" 
            className="back-nav-btn" 
            onClick={onBack}
            aria-label="Back to role selection"
          >
            <ArrowLeft size={16} />
            <span>Back to Role Selection</span>
          </button>
        )}

        <div 
          className="role-badge-wrapper"
          style={{ backgroundColor: roleConfig.badgeColor, color: roleConfig.badgeText }}
        >
          {roleConfig.icon}
          <span>{role}</span>
        </div>

        <h2 className="form-main-title">{roleConfig.title}</h2>
        <p className="form-main-subtitle">{roleConfig.subtitle}</p>
      </div>

      {/* Form Body */}
      <div className="login-form-body">
        {/* Quick Role Switcher */}
        {onRoleChange && (
          <div className="role-switch-pills">
            <button 
              type="button"
              className={`role-pill-btn ${isVolunteer ? 'active' : ''}`}
              onClick={() => onRoleChange('Volunteer')}
            >
              Volunteer
            </button>
            <button 
              type="button"
              className={`role-pill-btn ${isSPOC ? 'active' : ''}`}
              onClick={() => onRoleChange('Corporate SPOC')}
            >
              Corporate SPOC
            </button>
            <button 
              type="button"
              className={`role-pill-btn ${isAdmin ? 'active' : ''}`}
              onClick={() => onRoleChange('Admin/NGO')}
            >
              Admin / NGO
            </button>
          </div>
        )}

        {/* Feedback Messages */}
        {error && (
          <div className="error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {isSuccess && (
          <div className="success-alert">
            <CheckCircle2 size={18} />
            <span>Login successful! Redirecting to {role} portal...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* FIELD 1: Company Name (Corporate SPOC only) */}
          {isSPOC && (
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">
                Company / Organization Name
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Building2 size={18} />
                </span>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Mastercard, Tata, Infosys"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* FIELD 2: Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              {isSPOC ? 'Corporate Email Address' : 'Email Address'}
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={18} />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder={isSPOC ? "name@company.com" : "you@example.com"}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* FIELD 3: Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={18} />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input has-toggle"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="form-row-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot-password" className="forgot-link" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn-yellow-login"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Login as {role === 'Admin/NGO' ? 'Admin' : role}</span>
            )}
          </button>
        </form>

        {/* Footer Area: Support Note */}
        {isAdmin && (
          <div className="form-footer-area">
            <div className="admin-notice">
              <HelpCircle size={18} style={{ flexShrink: 0 }} />
              <span>
                Admin & NGO accounts are pre-provisioned. Contact the system administrator for access.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
export { LoginForm };
