import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { mockVolunteers, summaryStats } from '../../data/adminMockData';

const AdminVolunteersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const filteredVolunteers = mockVolunteers.filter(
    (vol) =>
      vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.phone.includes(searchQuery)
  );

  return (
    <AdminLayout
      title="Volunteers Management"
      subtitle={`Track registered volunteers across NGO activities (${summaryStats.totalVolunteers} Total).`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Volunteers Directory</h2>
          <p className="text-xs text-gray-500 font-medium">Showing {filteredVolunteers.length} registered volunteers</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search volunteers by name or email..."
            className="w-full sm:w-72 px-3.5 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Volunteer Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Events Participated</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredVolunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{vol.name}</td>
                  <td className="p-4 font-medium text-gray-700 text-xs">{vol.email}</td>
                  <td className="p-4 text-xs font-mono text-gray-600">{vol.phone}</td>
                  <td className="p-4 font-bold text-emerald-700 text-xs">{vol.eventsParticipated} events</td>
                  <td className="p-4">
                    <StatusBadge status={vol.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedVolunteer(vol)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Volunteer View Details Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Volunteer Profile</h3>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase">Full Name</span>
                <p className="font-bold text-gray-900 text-base">{selectedVolunteer.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Email</span>
                  <p className="font-medium text-gray-800 text-xs">{selectedVolunteer.email}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Phone</span>
                  <p className="font-medium text-gray-800 text-xs">{selectedVolunteer.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Joined Date</span>
                  <p className="font-medium text-gray-800 text-xs">{selectedVolunteer.joinedDate}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                  <div className="mt-0.5">
                    <StatusBadge status={selectedVolunteer.status} />
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">
                  Participation Summary
                </span>
                <p className="text-sm font-bold text-gray-900">
                  {selectedVolunteer.eventsParticipated} Completed Volunteering Activities
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminVolunteersPage;
