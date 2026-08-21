import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { mockVolunteers } from '../../data/adminMockData';

const AdminVolunteersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const filteredVolunteers = mockVolunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.includes(searchTerm)
  );

  return (
    <AdminLayout>
      {/* Header & Total Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Volunteers</h1>
          <p className="text-slate-500 font-medium">Manage and review registered NGO volunteers.</p>
        </div>

        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-lg font-bold text-sm self-start sm:self-auto">
          Total Volunteers: 842
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by volunteer name, email, or contact number..."
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Events Participated</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {filteredVolunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{vol.name}</td>
                  <td className="p-4 text-slate-600">{vol.email}</td>
                  <td className="p-4 text-slate-600">{vol.phone}</td>
                  <td className="p-4 font-bold text-slate-800">{vol.eventsParticipated} Events</td>
                  <td className="p-4">
                    <StatusBadge status={vol.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedVolunteer(vol)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-md transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Volunteer Modal Details */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl relative">
            <button
              onClick={() => setSelectedVolunteer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">{selectedVolunteer.name}</h3>
            <p className="text-xs text-slate-500 mb-4">Volunteer Profile & Activity Summary</p>

            <div className="space-y-3 text-sm border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Email:</span>
                <span className="font-bold text-slate-800">{selectedVolunteer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Phone:</span>
                <span className="font-bold text-slate-800">{selectedVolunteer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Joined Date:</span>
                <span className="font-bold text-slate-800">{selectedVolunteer.joinedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Events Participated:</span>
                <span className="font-bold text-emerald-700">{selectedVolunteer.eventsParticipated} events</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Account Status:</span>
                <StatusBadge status={selectedVolunteer.status} />
              </div>
            </div>

            <button
              onClick={() => setSelectedVolunteer(null)}
              className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminVolunteersPage;
