import { useOutletContext } from 'react-router-dom';
import { volunteerStats } from '../data/mockData';
import { User, Mail, Phone, MapPin, Building, Edit2, Shield, CalendarDays, Clock, Trophy, Star } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useOutletContext();

  // Extended profile data with logged in user details
  const profileDetails = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    phone: user?.phone || "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    organization: user?.organization || "Mastercard / SevaSahayog",
    joinDate: "January 2026",
    role: (user?.role || "VOLUNTEER").toUpperCase()
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-12">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-900 to-blue-700 relative">
          <div className="absolute inset-0 bg-white/10 pattern-grid opacity-20"></div>
        </div>
        
        <div className="px-6 sm:px-10 pb-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-5">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white p-2 rounded-full shadow-md">
                <div className="w-full h-full bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-5xl font-black">
                  {profileDetails.name.charAt(0)}
                </div>
              </div>
              <div className="mb-2 hidden sm:block">
                <h1 className="text-3xl font-black text-slate-900 leading-tight">{profileDetails.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-widest">
                    <Shield size={14} /> {profileDetails.role}
                  </span>
                  <span className="text-slate-500 font-medium text-sm">Joined {profileDetails.joinDate}</span>
                </div>
              </div>
            </div>
            
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
              <Edit2 size={18} /> Edit Profile
            </button>
          </div>

          {/* Mobile Name Display */}
          <div className="mb-8 sm:hidden">
            <h1 className="text-3xl font-black text-slate-900 mb-2">{profileDetails.name}</h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-widest">
                <Shield size={14} /> {profileDetails.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-wider">Contact Details</h2>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl"><User size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Full Name</p>
                  <p className="font-bold text-slate-800">{profileDetails.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl"><Mail size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
                  <p className="font-bold text-slate-800 break-all">{profileDetails.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl"><Phone size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
                  <p className="font-bold text-slate-800">{profileDetails.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
                  <p className="font-bold text-slate-800">{profileDetails.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl"><Building size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">College / Org</p>
                  <p className="font-bold text-slate-800">{profileDetails.organization}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 h-full">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Your Impact</h2>
            <p className="text-slate-500 font-medium mb-8">A summary of your contribution to the community.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CalendarDays size={24} />
                </div>
                <p className="text-4xl font-black text-blue-950 mb-1">{volunteerStats.activitiesJoined}</p>
                <p className="text-sm font-bold text-blue-700 uppercase tracking-wider">Total Activities</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock size={24} />
                </div>
                <p className="text-4xl font-black text-emerald-950 mb-1">{volunteerStats.volunteerHours}</p>
                <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Volunteer Hours</p>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trophy size={24} />
                </div>
                <p className="text-4xl font-black text-purple-950 mb-1">{volunteerStats.impactPoints}</p>
                <p className="text-sm font-bold text-purple-700 uppercase tracking-wider">Impact Points</p>
              </div>

            </div>
            
            <div className="mt-10 p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center shrink-0">
                <Star size={32} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-1">Top Contributor Status</h3>
                <p className="text-slate-600 font-medium">You are in the top 10% of volunteers this month. Keep up the great work!</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
