import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mockAdminProfile } from '../../data/adminMockData';

const AdminProfilePage = () => {
  const [profile, setProfile] = useState(mockAdminProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setMsg('Profile updated successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <AdminLayout title="Admin Profile" subtitle="View and edit NGO administrator account information.">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
              AD
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-xs font-semibold text-emerald-700">{profile.role} • {profile.organization}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-gray-200"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {msg && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-lg text-xs">
            ✓ {msg}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Organization</label>
                <input
                  type="text"
                  value={profile.organization}
                  onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Full Name</span>
              <p className="font-bold text-gray-900 mt-0.5">{profile.name}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Email Address</span>
              <p className="font-medium text-gray-800 mt-0.5">{profile.email}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Organization</span>
              <p className="font-bold text-gray-900 mt-0.5">{profile.organization}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Phone Number</span>
              <p className="font-medium text-gray-800 mt-0.5">{profile.phone}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Role</span>
              <p className="font-bold text-emerald-700 mt-0.5">{profile.role}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Joined Date</span>
              <p className="font-medium text-gray-800 mt-0.5">{profile.joinedDate}</p>
            </div>

            <div className="sm:col-span-2 grid grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-lg border border-emerald-100 mt-2">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase">Total Events Managed</span>
                <p className="text-xl font-extrabold text-gray-900 mt-0.5">{profile.totalEventsManaged}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase">Volunteers Engaged</span>
                <p className="text-xl font-extrabold text-gray-900 mt-0.5">{profile.totalVolunteersEngaged}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
