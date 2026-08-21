import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mockSPOCs } from '../../data/adminMockData';

const AdminSPOCsPage = () => {
  const [selectedSPOC, setSelectedSPOC] = useState(null);

  return (
    <AdminLayout>
      {/* Header & Add Partner Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">SPOCs / Corporate Partners</h1>
          <p className="text-slate-500 font-medium">Manage partner organization Single Points of Contact (SPOCs).</p>
        </div>

        <button
          onClick={() => alert('Add Corporate Partner modal')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <span>+</span>
          <span>Add Partner</span>
        </button>
      </div>

      {/* Corporate Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Company Name</th>
                <th className="p-4">SPOC Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Events Organized</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {mockSPOCs.map((spoc) => (
                <tr key={spoc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{spoc.company}</td>
                  <td className="p-4 text-slate-800">{spoc.name}</td>
                  <td className="p-4 text-slate-600">{spoc.email}</td>
                  <td className="p-4 text-slate-600">{spoc.phone}</td>
                  <td className="p-4 font-bold text-emerald-700">{spoc.eventsOrganized} Events</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedSPOC(spoc)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => alert(`Edit SPOC ${spoc.name}`)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-md transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for View SPOC */}
      {selectedSPOC && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-xl relative">
            <button
              onClick={() => setSelectedSPOC(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">{selectedSPOC.company}</h3>
            <p className="text-xs text-slate-500 mb-4">Corporate SPOC Partnership Overview</p>

            <div className="space-y-3 text-sm border-t border-slate-100 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">SPOC Contact:</span>
                <span className="font-bold text-slate-900">{selectedSPOC.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Email:</span>
                <span className="font-bold text-slate-800">{selectedSPOC.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Phone:</span>
                <span className="font-bold text-slate-800">{selectedSPOC.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Events Co-Organized:</span>
                <span className="font-bold text-emerald-700">{selectedSPOC.eventsOrganized} Events</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg text-xs space-y-2 mb-6">
              <span className="font-bold text-slate-700 uppercase block">Associated Activities</span>
              <div className="flex justify-between font-medium">
                <span>Tree Plantation Drive (24 Aug 2026)</span>
                <span className="text-emerald-700 font-bold">Upcoming</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Annual CSR Cleanliness Drive</span>
                <span className="text-slate-500 font-bold">Completed</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSPOC(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSPOCsPage;
