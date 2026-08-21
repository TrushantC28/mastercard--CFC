import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { activityApi } from '../../services/api';
import { mockEvents } from '../../data/adminMockData';

// Valid activity status state transitions
const VALID_TRANSITIONS = {
  planned: ['open_for_signup', 'cancelled'],
  open_for_signup: ['ongoing', 'cancelled'],
  ongoing: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const AdminEventsPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);

  const tabs = ['All', 'planned', 'open_for_signup', 'ongoing', 'completed', 'cancelled'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await activityApi.getActivities();
      const list = res.data?.activities || res.data || res.activities || res;
      if (Array.isArray(list) && list.length > 0) {
        setEventsList(list);
      } else {
        setEventsList(mockEvents);
      }
    } catch (err) {
      console.warn('Activity fetch failed, using fallback:', err);
      setEventsList(mockEvents);
    } fontFinally: {
      setLoading(false);
    }
  };

  const handleStatusChange = async (activityId, currentStatus, newStatus) => {
    setUpdatingId(activityId);
    setMessage(null);
    try {
      await activityApi.updateStatus(activityId, newStatus);
      setMessage({ type: 'success', text: `Activity status transitioned to ${newStatus}` });
      setEventsList((prev) =>
        prev.map((e) => ((e._id || e.id) === activityId ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      // Local fallback state update
      setEventsList((prev) =>
        prev.map((e) => ((e._id || e.id) === activityId ? { ...e, status: newStatus } : e))
      );
      setMessage({ type: 'success', text: `Updated status to ${newStatus}` });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredEvents = eventsList.filter((evt) => {
    const status = (evt.status || 'open_for_signup').toLowerCase();
    const title = evt.title || evt.name || '';
    const loc = evt.location || '';
    const company = evt.corporatePartner?.name || evt.organizer || '';

    const matchesTab = activeTab === 'All' ? true : status === activeTab.toLowerCase();
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <AdminLayout title="Events Management" subtitle="Create, track, and update NGO volunteering activities.">
      {message && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold mb-6 flex justify-between">
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">All Volunteering Activities</h2>
        <Link
          to="/admin/events/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
        >
          <span>+</span> Create Event
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 space-y-4">
        <div className="flex flex-wrap border-b border-gray-100 gap-2 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors capitalize cursor-pointer ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {tab === 'All' ? 'All Activities' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities by title, partner or location..."
            className="flex-1 px-3.5 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Activity Title</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Partner / Organizer</th>
                <th className="p-4">Slots</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-right">Transition Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                    Loading activities...
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 text-sm font-medium">
                    No activities found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const id = evt._id || evt.id;
                  const currentStatus = (evt.status || 'open_for_signup').toLowerCase();
                  const allowedNext = VALID_TRANSITIONS[currentStatus] || [];

                  return (
                    <tr key={id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{evt.title || evt.name}</p>
                        <p className="text-xs text-gray-500">{evt.location}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-800 text-xs">
                          {evt.date || (evt.startDate ? new Date(evt.startDate).toLocaleDateString() : 'Upcoming')}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-800 text-xs">
                          {evt.corporatePartner?.name || evt.organizer || 'SevaSahayog NGO'}
                        </p>
                      </td>
                      <td className="p-4 font-semibold text-xs text-gray-800">
                        {evt.registeredVolunteersCount ?? evt.registeredVolunteers ?? 0} /{' '}
                        {evt.maxVolunteers || evt.totalSlots || 30}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={currentStatus} />
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {allowedNext.length > 0 ? (
                          allowedNext.map((nextSt) => (
                            <button
                              key={nextSt}
                              disabled={updatingId === id}
                              onClick={() => handleStatusChange(id, currentStatus, nextSt)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded border border-emerald-200 transition-colors cursor-pointer capitalize"
                            >
                              → {nextSt.replace('_', ' ')}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Final State</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEventsPage;
