import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import { summaryStats, mockEvents, mockFeedback } from '../../data/adminMockData';

const AdminDashboard = () => {
  const upcomingEvents = mockEvents.filter(e => e.status === 'Upcoming').slice(0, 3);
  const recentFeedback = mockFeedback.slice(0, 3);

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Here's an overview of your NGO activities and volunteer feedback."
    >
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Events"
          value={summaryStats.totalEvents}
          subtext="35 activities organized"
          icon="📅"
        />
        <StatCard
          title="Total Volunteers"
          value={summaryStats.totalVolunteers}
          subtext="Across all partners"
          icon="👥"
        />
        <StatCard
          title="Corporate Partners"
          value={summaryStats.corporatePartners}
          subtext="Active corporate SPOCs"
          icon="🏢"
        />
        <StatCard
          title="Average Rating"
          value={`${summaryStats.avgRating} / 5`}
          subtext="Based on 128 responses"
          icon="⭐"
        />
      </div>

      {/* Main Grid: Upcoming Events & Recent Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Upcoming Events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Upcoming Events</h2>
            <Link
              to="/admin/events"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-sm">{evt.name}</h3>
                    <StatusBadge status={evt.status} />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    📅 {evt.date} • ⏰ {evt.time}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    📍 {evt.location} • 🏢 {evt.organizer}
                  </p>
                  <p className="text-xs font-semibold text-emerald-700 pt-1">
                    👥 {evt.registeredVolunteers} / {evt.totalSlots} Volunteers Registered
                  </p>
                </div>

                <Link
                  to={`/admin/events/${evt.id}`}
                  className="self-start sm:self-center px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Recent Feedback */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Recent Feedback</h2>
            <Link
              to="/admin/feedback"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View All Feedback →
            </Link>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm divide-y divide-gray-100">
            {recentFeedback.map((fb) => (
              <div key={fb.id} className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">{fb.volunteerName}</span>
                  <span className="text-xs font-bold text-amber-500">★ {fb.rating}</span>
                </div>
                <p className="text-xs font-medium text-gray-500">{fb.eventName}</p>
                <p className="text-xs text-gray-700 italic">"{fb.comment}"</p>
                <span className="text-[10px] text-gray-400 block pt-0.5">{fb.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
