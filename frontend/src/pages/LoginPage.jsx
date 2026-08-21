import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Building2, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Building
} from 'lucide-react';

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null); // 'Volunteer' | 'Corporate SPOC' | 'Admin/NGO'
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

  const roles = [
    {
      id: 'Volunteer',
      title: 'Volunteer',
      badge: 'Individuals & Students',
      icon: HeartHandshake,
      iconBg: 'bg-emerald-100 text-emerald-700',
      description: 'Join volunteer drives, submit event feedback, and track your social impact hours.',
      features: ['Browse volunteering drives', 'Submit event feedback', 'Track impact hours']
    },
    {
      id: 'Corporate SPOC',
      title: 'Corporate SPOC',
      badge: 'CSR Leads & Organizations',
      icon: Building2,
      iconBg: 'bg-sky-100 text-sky-700',
      description: 'Coordinate corporate CSR events, organize team drives, and monitor company engagement.',
      features: ['Coordinate team drives', 'Company participation stats', 'CSR analytics & reports']
    },
    {
      id: 'Admin/NGO',
      title: 'Admin / NGO',
      badge: 'Coordinators & Managers',
      icon: ShieldCheck,
      iconBg: 'bg-amber-100 text-amber-700',
      description: 'Manage platform operations, verify drives, review feedback, and configure permissions.',
      features: ['Drive & event management', 'Feedback analytics', 'Pre-authorized NGO access']
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setError('');
    setIsSuccess(false);
  };

  const handleInputChange = (e) => {
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

    if (selectedRole === 'Corporate SPOC' && !formData.companyName.trim()) {
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
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const currentRoleInfo = roles.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2540] via-[#0F365E] to-[#1E293B] text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden font-sans">
      
      {/* Decorative ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto text-center z-10 pt-4 pb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-3 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 font-extrabold tracking-wide text-sm sm:text-base">SevaSahayog</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Volunteer Experience Portal
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mt-2">
          Connecting volunteers, corporate CSR leaders, and NGO coordinators to create lasting community impact.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl mx-auto flex-1 flex items-center justify-center z-10 py-4">
        {!selectedRole ? (
          /* STEP 1: ROLE SELECTION CARDS */
          <div className="w-full">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Select Your Portal Role</h2>
              <p className="text-slate-300 text-sm">Choose an account type to proceed to the sign-in form</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roles.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleRoleSelect(item.id)}
                    className="bg-white text-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer border-2 border-transparent hover:border-amber-400 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.iconBg} shadow-sm group-hover:scale-105 transition-transform`}>
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#0A2540] mb-2 group-hover:text-amber-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>

                      <ul className="space-y-2 mb-6">
                        {item.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center text-xs text-slate-700 font-medium gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleSelect(item.id);
                      }}
                      className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#0A2540] group-hover:bg-amber-400 text-white group-hover:text-[#0A2540] font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
                    >
                      <span>Login as {item.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* STEP 2: DIRECT LOGIN FORM FOR SELECTED ROLE */
          <div className="w-full max-w-md bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300">
            
            {/* Form Header */}
            <div className="bg-gradient-to-b from-slate-50 to-white px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0A2540] transition-colors mb-3 px-2 py-1 -ml-2 rounded-md hover:bg-slate-200/50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Role Selection</span>
              </button>

              {currentRoleInfo && (
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentRoleInfo.iconBg}`}>
                    <currentRoleInfo.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {selectedRole} Portal
                  </span>
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A2540]">
                {selectedRole === 'Corporate SPOC' 
                  ? 'Corporate SPOC Login' 
                  : selectedRole === 'Admin/NGO' 
                    ? 'Admin / NGO Login' 
                    : 'Volunteer Login'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {selectedRole === 'Corporate SPOC'
                  ? 'Enter company name and credentials to access CSR console'
                  : selectedRole === 'Admin/NGO'
                    ? 'Authorized credentials for coordinators and portal managers'
                    : 'Enter your credentials to access your volunteer account'}
              </p>
            </div>

            {/* Quick Role Switcher Pills */}
            <div className="px-6 sm:px-8 pt-4 pb-2">
              <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 gap-1">
                {roles.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`py-1.5 px-2 rounded-lg text-center transition-all truncate ${
                      selectedRole === r.id 
                        ? 'bg-white text-[#0A2540] shadow-sm font-bold' 
                        : 'hover:text-slate-900'
                    }`}
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 pt-3">
              {/* Alert Feedback */}
              {error && (
                <div className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {isSuccess && (
                <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3.5 py-2.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Login successful! Redirecting to {selectedRole} portal...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* FIELD 1: Company Name (Corporate SPOC Only) */}
                {selectedRole === 'Corporate SPOC' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="companyName">
                      Company / Organization Name
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Mastercard, Infosys, TCS"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2540]/20 focus:border-[#0A2540] transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* FIELD 2: Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="email">
                    {selectedRole === 'Corporate SPOC' ? 'Corporate Email Address' : 'Email Address'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={selectedRole === 'Corporate SPOC' ? 'name@company.com' : 'you@example.com'}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2540]/20 focus:border-[#0A2540] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* FIELD 3: Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="password">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2540]/20 focus:border-[#0A2540] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Options: Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium select-none">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded text-[#0A2540] focus:ring-[#0A2540] accent-[#0A2540] border-slate-300"
                    />
                    <span>Remember me</span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    className="font-semibold text-[#0A2540] hover:text-amber-600 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* YELLOW LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-[#0A2540] font-extrabold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-[#0A2540] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Login as {selectedRole === 'Admin/NGO' ? 'Admin' : selectedRole}</span>
                  )}
                </button>
              </form>

              {/* FOOTER AREA */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs">
                {/* Volunteer: Registration Option */}
                {selectedRole === 'Volunteer' && (
                  <p className="text-slate-500">
                    Don't have an account?{' '}
                    <a
                      href="#register-volunteer"
                      onClick={(e) => e.preventDefault()}
                      className="font-bold text-[#0A2540] hover:text-amber-600 transition-colors"
                    >
                      Sign up as Volunteer
                    </a>
                  </p>
                )}

                {/* Corporate SPOC: Registration Option */}
                {selectedRole === 'Corporate SPOC' && (
                  <p className="text-slate-500">
                    Need corporate onboarding?{' '}
                    <a
                      href="#register-corporate"
                      onClick={(e) => e.preventDefault()}
                      className="font-bold text-[#0A2540] hover:text-amber-600 transition-colors"
                    >
                      Register Company
                    </a>
                  </p>
                )}

                {/* Admin/NGO: NO REGISTRATION OPTION */}
                {selectedRole === 'Admin/NGO' && (
                  <div className="flex items-center justify-center gap-2 text-slate-500 bg-slate-50 border border-dashed border-slate-200 p-2.5 rounded-xl">
                    <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Admin accounts are pre-assigned. Contact systems manager for access.</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto text-center text-xs text-slate-400 py-3 z-10">
        <p>© {new Date().getFullYear()} Seva Sahayog Foundation. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
export { LoginPage };
