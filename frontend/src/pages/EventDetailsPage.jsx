import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import StatusBadge from '../components/admin/StatusBadge';
import { activityApi, registrationApi } from '../services/api';
import { mockEvents } from '../data/adminMockData';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchActivityDetails();
  }, [id]);

  const fetchActivityDetails = async () => {
    setLoading(true);
    try {
      const res = await activityApi.getActivityById(id);
      const data = res.data || res.activity || res;
      if (data && (data._id || data.id)) {
        setActivity(data);
      } else {
        // Fallback to mock data
        const found = mockEvents.find((e) => String(e.id) === String(id));
        setActivity(found || mockEvents[0]);
      }
    } catch (err) {
      console.warn('Activity fetch failed, using fallback:', err);
      const found = mockEvents.find((e) => String(e.id) === String(id));
      setActivity(found || mockEvents[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    setMessage(null);
    try {
      await registrationApi.registerForActivity(activity._id || activity.id);
      setMessage({ type: 'success', text: '🎉 You are now registered for this event!' });
    } catch (err) {
      const errMsg = err.message || '';
      if (errMsg.toLowerCase().includes('already') || errMsg.toLowerCase().includes('duplicate')) {
        setMessage({ type: 'info', text: 'ℹ️ You are already registered for this event!' });
      } else {
        setMessage({ type: 'error', text: `Registration error: ${errMsg || 'Unable to complete signup.'}` });
      }
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20 text-gray-500 font-medium">Loading event details...</div>
        <Footer />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800">Event Not Found</h2>
          <Link to="/events" className="mt-4 inline-block text-emerald-600 font-semibold text-sm">
            ← Back to Events
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = activity.title || activity.name;
  const status = activity.status || 'open_for_signup';
  const maxSlots = activity.maxVolunteers || activity.totalSlots || 30;
  const regSlots = activity.registeredVolunteersCount ?? activity.registeredVolunteers ?? 0;
  const isOpen = status === 'open_for_signup';

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8">
        <div className="mb-6">
          <Link to="/events" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
            ← Back to All Activities
          </Link>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 text-sm font-medium border flex items-center justify-between ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : message.type === 'info'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-xs font-bold cursor-pointer">
              ✕
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={status} />
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {activity.category || activity.eventType || 'Community Drive'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{title}</h1>
            </div>

            {isOpen && (
              <button
                disabled={registering}
                onClick={handleRegister}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                {registering ? 'Processing...' : 'Register Now'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg text-xs font-semibold">
            <div>
              <span className="text-gray-400 block uppercase text-[10px]">Date & Time</span>
              <p className="text-gray-800 text-sm mt-0.5">
                📅 {activity.date || activity.startDate ? new Date(activity.date || activity.startDate).toLocaleDateString() : 'Upcoming'}
              </p>
            </div>
            <div>
              <span className="text-gray-400 block uppercase text-[10px]">Location</span>
              <p className="text-gray-800 text-sm mt-0.5">📍 {activity.location || 'Pune Venue'}</p>
            </div>
            <div>
              <span className="text-gray-400 block uppercase text-[10px]">Capacity & Slots</span>
              <p className="text-emerald-700 text-sm mt-0.5 font-bold">
                👥 {regSlots} / {maxSlots} Registered
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Activity Details</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {activity.description ||
                'This activity is organized in collaboration with SevaSahayog to empower community development, local outreach, and hands-on volunteering. All tools and orientation will be provided at the venue.'}
            </p>
          </div>

          {status === 'completed' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-emerald-900">Activity Completed!</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Attended this drive? Share your feedback to help us measure community impact.
                </p>
              </div>
              <Link
                to={`/feedback/new?activityId=${activity._id || activity.id}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
              >
                Submit Feedback
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetailsPage;
