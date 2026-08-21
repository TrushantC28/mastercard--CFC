import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mockStats } from '../../data/adminMockData';

const AdminReportsPage = () => {
  const handleExport = (type) => {
    alert(`Exporting ${type} report as CSV...`);
  };

  return (
    <AdminLayout>
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500 font-medium">
            Generate and export stakeholder performance and feedback summary reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleExport('Activity Performance')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            📥 Export Report
          </button>
          <button
            onClick={() => handleExport('Volunteer Feedback')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            📊 Export Feedback CSV
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Events</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{mockStats.totalEvents}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Volunteers</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{mockStats.totalVolunteers}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Average Rating</span>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1">{mockStats.averageRating} / 5</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Feedback Submissions</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">128</div>
        </div>
      </div>

      {/* Report Sections */}
      <div className="space-y-6">
        {/* Event Performance */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Event Performance Summary</h2>
          <p className="text-slate-500 text-sm mb-4">
            Analysis of event completion rates, corporate partner engagement, and volunteer attendance slots.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
            <div className="p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-400 font-bold uppercase block mb-1">Completion Rate</span>
              <div className="text-xl font-extrabold text-slate-900">92%</div>
              <span className="text-slate-500">32 of 35 events completed successfully</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-400 font-bold uppercase block mb-1">Avg Slot Utilization</span>
              <div className="text-xl font-extrabold text-emerald-700">86%</div>
              <span className="text-slate-500">Average registered volunteers per event</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-400 font-bold uppercase block mb-1">Active SPOC Partners</span>
              <div className="text-xl font-extrabold text-slate-900">18 Companies</div>
              <span className="text-slate-500">Corporate partners actively sponsoring</span>
            </div>
          </div>
        </div>

        {/* Volunteer Participation */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Volunteer Participation Trends</h2>
          <p className="text-slate-500 text-sm mb-4">
            Demographic breakdown and retention rates of active volunteers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
            <div className="p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-400 font-bold uppercase block mb-1">Repeat Volunteers</span>
              <div className="text-xl font-extrabold text-slate-900">64%</div>
              <span className="text-slate-500">Participated in 3+ events</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-400 font-bold uppercase block mb-1">New Registrations</span>
              <div className="text-xl font-extrabold text-emerald-700">+124 This Month</div>
              <span className="text-slate-500">New volunteer signups</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-400 font-bold uppercase block mb-1">Active Engagement</span>
              <div className="text-xl font-extrabold text-slate-900">94% Active</div>
              <span className="text-slate-500">Engaged within last 90 days</span>
            </div>
          </div>
        </div>

        {/* Feedback Summary */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Feedback & Sentiment Summary</h2>
          <p className="text-slate-500 text-sm mb-4">
            Common feedback themes and actionable operational recommendations extracted from submissions.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg font-semibold flex items-center justify-between">
              <span>Top Positive Theme: Excellent Event Organization & Meaningful Impact</span>
              <span className="font-extrabold">78% Mentions</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-800 rounded-lg font-semibold flex items-center justify-between">
              <span>Top Area for Improvement: Event Onboarding Time & Logistics Instructions</span>
              <span className="font-extrabold">14% Mentions</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
