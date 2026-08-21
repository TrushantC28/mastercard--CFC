import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import { mockFeedback, summaryStats, mockEvents, mockSPOCs } from '../../data/adminMockData';

const AdminFeedbackPage = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedSPOC, setSelectedSPOC] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const filteredFeedback = mockFeedback.filter((item) => {
    const matchEvent = selectedEvent ? item.eventId === selectedEvent || item.eventName === selectedEvent : true;
    const matchSPOC = selectedSPOC ? item.companyName === selectedSPOC : true;
    const matchRating = selectedRating ? item.rating === Number(selectedRating) : true;
    return matchEvent && matchSPOC && matchRating;
  });

  return (
    <AdminLayout
      title="Feedback & Experience Intelligence"
      subtitle="Analyze volunteer sentiments, rating trends, and operational suggestions."
    >
      {/* 4 Feedback Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Average Rating"
          value={`${summaryStats.avgRating} / 5`}
          subtext="Overall Volunteer Satisfaction"
          icon="⭐"
        />
        <StatCard
          title="Total Feedback"
          value="128"
          subtext="Submissions logged"
          icon="💬"
        />
        <StatCard
          title="Positive Feedback"
          value="92%"
          subtext="4 & 5 Star ratings"
          icon="👍"
        />
        <StatCard
          title="Needs Improvement"
          value="8%"
          subtext="Urgent issues & low ratings"
          icon="⚠️"
        />
      </div>

      {/* Simple Rating Distribution Bar & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Rating Distribution */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Rating Distribution
          </h3>
          <div className="space-y-2 text-xs font-semibold">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = summaryStats.ratingBreakdown[stars];
              const pct = Math.round((count / 128) * 100);
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-12 text-gray-700">{stars} Stars</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-right text-gray-500">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Filter Feedback Submissions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Filter by Event</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 font-semibold"
              >
                <option value="">All Events</option>
                {mockEvents.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Filter by SPOC / Partner</label>
              <select
                value={selectedSPOC}
                onChange={(e) => setSelectedSPOC(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 font-semibold"
              >
                <option value="">All Partners</option>
                {mockSPOCs.map((s) => (
                  <option key={s.id} value={s.company}>
                    {s.company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Filter by Rating</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 font-semibold"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Event</th>
                <th className="p-4">Volunteer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Feedback Comment</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredFeedback.map((fb) => (
                <tr key={fb.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4 font-bold text-gray-900 text-xs">
                    {fb.eventName}
                    <span className="block text-[10px] font-normal text-gray-500">{fb.companyName}</span>
                  </td>
                  <td className="p-4 font-medium text-gray-800 text-xs">{fb.volunteerName}</td>
                  <td className="p-4 font-bold text-amber-500 text-xs">★ {fb.rating}</td>
                  <td className="p-4 text-xs text-gray-700 max-w-md">
                    <p className="font-medium">"{fb.comment}"</p>
                    {fb.suggestions && (
                      <p className="text-gray-500 mt-1">
                        <strong className="text-emerald-700">Suggestion:</strong> {fb.suggestions}
                      </p>
                    )}
                  </td>
                  <td className="p-4 text-xs text-gray-400">{fb.date}</td>
                  <td className="p-4 text-right">
                    {fb.isUrgent ? (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200">
                        🚨 Urgent
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                        Reviewed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFeedbackPage;
