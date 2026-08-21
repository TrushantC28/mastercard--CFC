import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mockFeedback } from '../../data/adminMockData';

const AdminFeedbackPage = () => {
  const [filterType, setFilterType] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState('');

  const ratingCounts = {
    5: 72,
    4: 41,
    3: 10,
    2: 4,
    1: 1,
  };

  const filteredList = mockFeedback.filter((f) => {
    if (selectedEvent && f.eventName !== selectedEvent) return false;
    return true;
  });

  return (
    <AdminLayout>
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Feedback Intelligence</h1>
        <p className="text-slate-500 font-medium">
          Monitor volunteer experiences, rating distributions, and improvement suggestions.
        </p>
      </div>

      {/* Top 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Average Rating</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">4.4 / 5</div>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">★ High Satisfaction</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Feedbacks</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">128</div>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Across all activities</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Positive Feedback</span>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1">88%</div>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">Rated 4 or 5 stars</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Needs Improvement</span>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">12%</div>
          <span className="text-xs text-amber-600 font-medium mt-1 inline-block">Flagged for follow-up</span>
        </div>
      </div>

      {/* Rating Distribution Grid */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-4">Rating Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
              <div className="text-xs font-bold text-amber-500 mb-1">{"★".repeat(stars)} {stars} Stars</div>
              <div className="text-xl font-extrabold text-slate-900">{ratingCounts[stars]}</div>
              <span className="text-[11px] text-slate-400 font-medium">Submissions</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['All Feedback', 'By Event', 'By Volunteer', 'By SPOC'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                filterType === filter
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 font-semibold"
        >
          <option value="">Filter by Specific Event...</option>
          <option value="Tree Plantation Drive">Tree Plantation Drive</option>
          <option value="Youth Career Guidance Workshop">Youth Career Guidance Workshop</option>
          <option value="Blood Donation Camp">Blood Donation Camp</option>
          <option value="Beach Clean-up Drive">Beach Clean-up Drive</option>
        </select>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Event</th>
                <th className="p-4">Volunteer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Feedback / Comment</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {filteredList.map((fb) => (
                <tr key={fb.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{fb.eventName}</td>
                  <td className="p-4 text-slate-800">{fb.volunteerName}</td>
                  <td className="p-4">
                    <span className="font-extrabold text-amber-500 text-sm">★ {fb.rating}</span>
                  </td>
                  <td className="p-4 max-w-sm text-slate-700">
                    <p className="line-clamp-2">"{fb.comment}"</p>
                    {fb.isUrgent && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 font-bold text-[10px] rounded-md">
                        🚨 Urgent Attention
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-slate-500">{fb.date}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => alert(`Feedback detail for ID ${fb.id}`)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-md transition-colors cursor-pointer"
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
    </AdminLayout>
  );
};

export default AdminFeedbackPage;
