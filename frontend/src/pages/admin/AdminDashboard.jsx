import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { mockStats, mockEvents, mockFeedback } from '../../data/adminMockData';

const AdminDashboard = () => {
  const upcomingEvents = mockEvents.filter((e) => e.status === 'Upcoming').slice(0, 3);
  const recentFeedback = mockFeedback.slice(0, 3);

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Welcome, Admin! 👋</h1>
        <p className="text-slate-500 font-medium">Here's an overview of your NGO activities and volunteer feedback.</p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Events</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-lg">
              📅
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{mockStats.totalEvents}</div>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Active & Completed Events</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Volunteers</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-lg">
              👥
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{mockStats.totalVolunteers}</div>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Registered Volunteers</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Partners</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-lg">
              🏢
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{mockStats.corporatePartners}</div>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Active SPOC Organizations</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Feedback Rating</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-lg">
              ⭐
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{mockStats.averageRating} / 5</div>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">★ High Satisfaction Rate</span>
        </div>
      </div>

      {/* Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Events (2 cols on large) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Upcoming Events</h2>
            <Link
              to="/admin/events"
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={evt.status} />
                    <span className="text-xs text-slate-400 font-semibold">{evt.organizer}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{evt.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mt-2">
                    <span>📅 {evt.date}</span>
                    <span>⏰ {evt.time}</span>
                    <span>📍 {evt.location}</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-700 mt-2">
                    👥 {evt.registeredVolunteers} / {evt.totalSlots} Volunteers Registered
                  </div>
                </div>

                <Link
                  to={`/admin/events/${evt.id}`}
                  className="self-start sm:self-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Feedback (1 col) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Recent Feedback</h2>
            <Link
              to="/admin/feedback"
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">
            {recentFeedback.map((fb) => (
              <div key={fb.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-sm">{fb.volunteerName}</span>
                  <span className="font-extrabold text-amber-500 text-xs">★ {fb.rating}</span>
                </div>
                <span className="block text-xs font-semibold text-slate-500 mb-2">{fb.eventName}</span>
                <p className="text-xs text-slate-600 italic">"{fb.comment}"</p>
                <span className="block text-[11px] text-slate-400 font-medium mt-2">{fb.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
