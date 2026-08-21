import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mockAdminProfile } from '../../data/adminMockData';

const AdminProfilePage = () => {
  const [profile, setProfile] = useState(mockAdminProfile);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Admin Profile</h1>
        <p className="text-slate-500 font-medium">Manage your NGO Lead administrator details and system preferences.</p>
      </div>

      <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-sm">
            NK
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{profile.fullName}</h2>
            <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block mt-1">
              {profile.role}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Full Name</span>
              <div className="font-bold text-slate-900">{profile.fullName}</div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Email Address</span>
              <div className="font-bold text-slate-900">{profile.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Organization</span>
              <div className="font-bold text-slate-900">{profile.organization}</div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Phone Contact</span>
              <div className="font-bold text-slate-900">{profile.phone}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Joined Date</span>
              <div className="font-bold text-slate-800">{profile.joinedDate}</div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Events Managed</span>
              <div className="font-bold text-emerald-700">{profile.totalEventsManaged} Events</div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Total Volunteers</span>
              <div className="font-bold text-emerald-700">{profile.totalVolunteers} Volunteers</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg transition-colors cursor-pointer"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
