import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();
    if (selectedRole) {
      navigate(`/login/${selectedRole}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg min-h-[550px] flex flex-col justify-center bg-white border border-slate-100 p-8 sm:p-12 rounded-2xl shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-center text-slate-800">Welcome Back</h2>
          <p className="text-base text-slate-500 mb-10 text-center">
            Please select your portal role to continue
          </p>

          <form onSubmit={handleContinue} className="flex flex-col gap-6">
            <div>
              <label htmlFor="roleSelect" className="block text-sm font-bold text-slate-700 mb-2">
                Select Role
              </label>
              <select
                id="roleSelect"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-slate-50 transition-all cursor-pointer font-medium text-slate-700 text-lg"
                required
              >
                <option value="" disabled>-- Select a role --</option>
                <option value="admin">Admin / NGO</option>
                <option value="volunteer">Volunteer</option>
                <option value="corporate">Corporate SPOC</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!selectedRole}
              className="mt-6 w-full bg-amber-400 text-slate-900 font-extrabold text-lg py-4 px-4 rounded-xl hover:bg-amber-300 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Continue
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
