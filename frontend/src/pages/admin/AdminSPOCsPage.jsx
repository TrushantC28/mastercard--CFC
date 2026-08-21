import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mockSPOCs, mockEvents } from '../../data/adminMockData';

const AdminSPOCsPage = () => {
  const [selectedSPOC, setSelectedSPOC] = useState(null);
  const [spocList, setSpocList] = useState(mockSPOCs);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newPartner, setNewPartner] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
  });

  const handleAddPartner = (e) => {
    e.preventDefault();
    const created = {
      id: `spoc-${Date.now()}`,
      ...newPartner,
      eventsOrganized: 0,
      status: 'Active',
    };
    setSpocList([created, ...spocList]);
    setShowAddModal(false);
    setNewPartner({ company: '', name: '', email: '', phone: '' });
  };

  return (
    <AdminLayout title="Corporate Partners & SPOCs" subtitle="Manage corporate partnerships and SPOC contacts.">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Corporate SPOCs Directory</h2>
          <p className="text-xs text-gray-500 font-medium">{spocList.length} Partner Corporations</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <span>+</span> Add Partner
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Company</th>
                <th className="p-4">SPOC Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Events Organized</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {spocList.map((spoc) => (
                <tr key={spoc.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{spoc.company}</td>
                  <td className="p-4 font-medium text-gray-800 text-xs">{spoc.name}</td>
                  <td className="p-4 text-xs font-mono text-gray-600">{spoc.email}</td>
                  <td className="p-4 font-bold text-emerald-700 text-xs">{spoc.eventsOrganized} Events</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedSPOC(spoc)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
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

      {/* SPOC View Details Modal */}
      {selectedSPOC && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">{selectedSPOC.company} Details</h3>
              <button onClick={() => setSelectedSPOC(null)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">SPOC Name</span>
                  <p className="font-bold text-gray-900">{selectedSPOC.name}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Email</span>
                  <p className="font-medium text-gray-800 text-xs">{selectedSPOC.email}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Organized Events</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {mockEvents
                    .filter((e) => e.organizer === selectedSPOC.company)
                    .map((evt) => (
                      <div key={evt.id} className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-gray-900">{evt.name}</p>
                          <p className="text-gray-500">{evt.date}</p>
                        </div>
                        <span className="font-semibold text-emerald-700">{evt.status}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSPOC(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Add Corporate Partner</h3>
            <form onSubmit={handleAddPartner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newPartner.company}
                  onChange={(e) => setNewPartner({ ...newPartner, company: e.target.value })}
                  placeholder="e.g. Acme Tech Solutions"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">SPOC Name *</label>
                <input
                  type="text"
                  required
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newPartner.email}
                  onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                  placeholder="e.g. rajesh@acme.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSPOCsPage;
