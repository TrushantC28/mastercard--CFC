import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import StatusBadge from '../components/admin/StatusBadge';
import { activityApi, registrationApi } from '../services/api';
import { mockEvents } from '../data/adminMockData';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [regRes, actRes] = await Promise.allSettled([
        registrationApi.getMyRegistrations('me'),
        activityApi.getActivities({ status: 'open_for_signup' }),
      ]);

      if (regRes.status === 'fulfilled' && regRes.value) {
        const regs = regRes.value.data?.registrations || regRes.value.data || regRes.value;
        if (Array.isArray(regs)) setMyRegistrations(regs);
      }

      if (actRes.status === 'fulfilled' && actRes.value) {
        const acts = actRes.value.data?.activities || actRes.value.data || actRes.value;
        if (Array.isArray(acts) && acts.length > 0) setUpcomingActivities(acts.slice(0, 3));
        else setUpcomingActivities(mockEvents.slice(0, 3));
      } else {
        setUpcomingActivities(mockEvents.slice(0, 3));
      }
    } catch (err) {
      console.warn('Error loading dashboard data:', err);
      setUpcomingActivities(mockEvents.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* Welcome Banner */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full mb-2 border border-emerald-200">
              VOLUNTEER PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Welcome back, {user?.name || 'Volunteer'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Thank you for contributing to SevaSahayog community initiatives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/events"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
            >
              Browse Activities
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg transition-colors border border-gray-200 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Volunteer Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase">My Registrations</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {myRegistrations.length > 0 ? `${myRegistrations.length} Activities` : '4 Activities'}
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Active volunteer</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase">Volunteering Hours</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">24 Hours</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Community impact</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase">Feedback Submitted</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">3 Responses</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">High feedback engagement</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase">Average Rating Given</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">4.8 / 5 ⭐</p>
            <p className="text-xs text-gray-500 font-medium mt-1">High satisfaction</p>
          </div>
        </div>

        {/* My Registered Activities Section */}
        {myRegistrations.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-bold text-gray-900">My Registered Activities</h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-500 uppercase">
                      <th className="p-4">Activity</th>
                      <th className="p-4">Registration Status</th>
                      <th className="p-4">Attendance</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {myRegistrations.map((reg) => {
                      const act = reg.activityId || reg.activity || {};
                      const isAttended = reg.attendanceStatus === 'attended';
                      const isCompleted = act.status === 'completed';

                      return (
                        <tr key={reg._id || reg.id}>
                          <td className="p-4 font-bold text-gray-900">
                            {act.title || 'Community Volunteering Drive'}
                            <span className="block text-[10px] text-gray-400 font-normal">
                              {act.location || 'Pune Center'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-full border border-blue-200 text-[10px]">
                              {reg.status || 'Registered'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 font-bold rounded-full text-[10px] ${
                                isAttended
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {reg.attendanceStatus || 'Pending'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {isCompleted && isAttended ? (
                              <Link
                                to={`/feedback/new?activityId=${act._id || act.id}`}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px]"
                              >
                                Give Feedback
                              </Link>
                            ) : (
                              <span className="text-[10px] text-gray-400">
                                {isCompleted ? 'Attendance Pending' : 'Event Upcoming'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Available Volunteering Drives */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 font-sans">Upcoming Volunteering Drives</h2>
            <Link to="/events" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              Browse All Events →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingActivities.map((evt) => (
              <div key={evt._id || evt.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={evt.status || 'open_for_signup'} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {evt.category || evt.eventType || 'CSR Drive'}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base">{evt.title || evt.name}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{evt.description}</p>

                  <div className="pt-2 text-xs text-gray-500 space-y-1">
                    <p>📅 {evt.date || 'Upcoming'}</p>
                    <p>📍 {evt.location || 'Pune'}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700">
                    {evt.registeredVolunteersCount || evt.registeredVolunteers || 12} / {evt.maxVolunteers || evt.totalSlots || 30} Slots
                  </span>
                  <Link
                    to={`/events/${evt._id || evt.id}`}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors"
                  >
                    View Drive
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
