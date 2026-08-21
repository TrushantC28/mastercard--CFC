import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { mockEvents } from '../../data/adminMockData';

const AdminEventsPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventsList, setEventsList] = useState(mockEvents);

  const tabs = ['All Events', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

  const filteredEvents = eventsList.filter((evt) => {
    const matchesTab =
      activeTab === 'All Events' || activeTab === 'All'
        ? true
        : evt.status.toLowerCase() === activeTab.toLowerCase();

    const matchesSearch =
      evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete/cancel this event?')) {
      setEventsList(eventsList.filter(e => e.id !== id));
    }
  };

  return (
    <AdminLayout title="Events Management" subtitle="Create and maintain NGO volunteering activities.">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Events</h2>
        <Link
          to="/admin/events/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
        >
          <span>+</span> Create Event
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 space-y-4">
        <div className="flex flex-wrap border-b border-gray-100 gap-2 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, partner or location..."
            className="flex-1 px-3.5 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Event</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Organizer / SPOC</th>
                <th className="p-4">Volunteers</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500 text-sm font-medium">
                    No events found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{evt.name}</p>
                      <p className="text-xs text-gray-500">{evt.location}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-800 text-xs">{evt.date}</p>
                      <p className="text-xs text-gray-500">{evt.time}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-800 text-xs">{evt.organizer}</p>
                      <p className="text-xs text-gray-500">{evt.spocName}</p>
                    </td>
                    <td className="p-4 font-semibold text-xs text-gray-800">
                      {evt.registeredVolunteers} / {evt.totalSlots}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={evt.status} />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/admin/events/${evt.id}`}
                        className="inline-block px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-md transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(evt.id)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEventsPage;
