import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import StatusBadge from '../components/admin/StatusBadge';
import { activityApi, registrationApi } from '../services/api';
import { mockEvents } from '../data/adminMockData';

const EventsPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('open_for_signup');
  const [registeringId, setRegisteringId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, [statusFilter]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await activityApi.getActivities(statusFilter !== 'all' ? { status: statusFilter } : {});
      const list = res.data?.activities || res.data || res.activities || res;
      if (Array.isArray(list) && list.length > 0) {
        setActivities(list);
      } else {
        // Fallback to mock data if API returns empty array or fails
        setActivities(mockEvents);
      }
    } catch (err) {
      console.warn('Backend activity fetch failed, using fallback:', err);
      setActivities(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (activityId) => {
    setRegisteringId(activityId);
    setMessage(null);
    try {
      await registrationApi.registerForActivity(activityId);
      setMessage({ type: 'success', text: '🎉 Successfully registered for this activity!' });
      fetchActivities();
    } catch (err) {
      const errMsg = err.message || '';
      if (errMsg.toLowerCase().includes('already') || errMsg.toLowerCase().includes('duplicate')) {
        setMessage({ type: 'info', text: 'ℹ️ You are already registered for this activity!' });
      } else {
        setMessage({ type: 'error', text: `Registration failed: ${errMsg || 'Please try again.'}` });
      }
    } finally {
      setRegisteringId(null);
    }
  };

  const filteredActivities = activities.filter((act) => {
    const title = act.title || act.name || '';
    const loc = act.location || '';
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="max-w-3xl">
            <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full mb-2 border border-emerald-200">
              COMMUNITY INITIATIVES
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Browse Volunteering Activities
            </h1>
            <p className="text-sm text-gray-600 font-medium mt-1">
              Find upcoming CSR & NGO drives, register your participation, and make a real impact.
            </p>
          </div>
        </div>

        {/* Status Message Alert */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 font-medium text-sm border flex items-center justify-between ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : message.type === 'info'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="text-xs font-bold px-2 py-1 hover:opacity-75 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'open_for_signup', label: 'Open for Signup' },
              { id: 'planned', label: 'Planned' },
              { id: 'ongoing', label: 'Ongoing' },
              { id: 'completed', label: 'Completed' },
              { id: 'all', label: 'All Activities' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or location..."
              className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Activities List / Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading activities...</div>
        ) : filteredActivities.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            <p className="text-base font-bold">No activities found</p>
            <p className="text-xs text-gray-400 mt-1">Try selecting a different filter or search phrase.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((act) => {
              const id = act._id || act.id;
              const title = act.title || act.name;
              const status = act.status || 'open_for_signup';
              const maxSlots = act.maxVolunteers || act.totalSlots || 30;
              const regSlots = act.registeredVolunteersCount ?? act.registeredVolunteers ?? 0;
              const isFull = regSlots >= maxSlots;
              const isOpen = status === 'open_for_signup';

              return (
                <div
                  key={id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={status} />
                      <span className="text-[10px] font-bold uppercase text-gray-400">
                        {act.category || act.eventType || 'Community Drive'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-3 font-normal">
                      {act.description || 'Join us for a impactful volunteering initiative organized with SevaSahayog partners.'}
                    </p>

                    <div className="pt-2 text-xs text-gray-500 space-y-1.5 font-medium">
                      <p className="flex items-center gap-1.5">
                        <span>📅</span>
                        <span>{act.date || act.startDate ? new Date(act.date || act.startDate).toLocaleDateString() : 'Upcoming'}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span>📍</span>
                        <span>{act.location || 'Pune Center'}</span>
                      </p>
                      {act.corporatePartner?.name && (
                        <p className="flex items-center gap-1.5">
                          <span>🏢</span>
                          <span>{act.corporatePartner.name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-700">
                        {regSlots} / {maxSlots}
                      </span>
                      <span className="text-[10px] text-gray-400 block font-medium">slots filled</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/events/${id}`}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Details
                      </Link>

                      {isOpen && !isFull && (
                        <button
                          disabled={registeringId === id}
                          onClick={() => handleRegister(id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
                        >
                          {registeringId === id ? 'Registering...' : 'Sign Up'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EventsPage;
