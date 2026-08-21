import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { mockEvents } from '../../data/adminMockData';

const AdminEventsPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = mockEvents.filter((evt) => {
    const matchesTab = activeTab === 'All' || evt.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      evt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AdminLayout>
      {/* Header & Create Event Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Events</h1>
          <p className="text-slate-500 font-medium">Manage all NGO volunteering activities and schedules.</p>
        </div>

        <Link
          to="/admin/events/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <span>+</span>
          <span>Create Event</span>
        </Link>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
          {['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab} Events
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search event name, SPOC, location..."
          className="px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50 w-full sm:w-64"
        />
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-medium">
            No events found matching tab or search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Event Name</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Organizer / SPOC</th>
                  <th className="p-4">Volunteers</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      <div>{evt.name}</div>
                      <span className="text-xs font-normal text-slate-400">📍 {evt.location}</span>
                    </td>
                    <td className="p-4 text-slate-700">
                      <div>{evt.date}</div>
                      <span className="text-xs text-slate-400">{evt.time}</span>
                    </td>
                    <td className="p-4 text-slate-800">{evt.organizer}</td>
                    <td className="p-4 text-slate-700 font-bold">
                      {evt.registeredVolunteers} / {evt.totalSlots}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={evt.status} />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/admin/events/${evt.id}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors inline-block"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => alert(`Edit ${evt.name}`)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-md transition-colors inline-block cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEventsPage;
