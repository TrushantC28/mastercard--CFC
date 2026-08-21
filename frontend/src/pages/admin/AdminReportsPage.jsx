import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import { summaryStats } from '../../data/adminMockData';

const AdminReportsPage = () => {
  const [downloadMsg, setDownloadMsg] = useState('');

  const handleExport = (type) => {
    setDownloadMsg(`Preparing ${type} export... CSV report downloaded!`);
    setTimeout(() => setDownloadMsg(''), 3000);
  };

  return (
    <AdminLayout
      title="Reports & Stakeholder Summaries"
      subtitle="Export high-level reports for NGO board and corporate partners."
    >
      {/* Export Action Banner */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Stakeholder Reporting Suite</h2>
          <p className="text-xs text-gray-500 font-medium">Download aggregated activity and feedback data in CSV format.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('Activity Performance')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            📥 Export Report
          </button>
          <button
            onClick={() => handleExport('Volunteer Feedback')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-gray-200"
          >
            📊 Export Feedback
          </button>
        </div>
      </div>

      {downloadMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-lg text-sm">
          ✓ {downloadMsg}
        </div>
      )}

      {/* 4 Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Events" value={summaryStats.totalEvents} subtext="Organized to date" icon="📅" />
        <StatCard title="Total Volunteers" value={summaryStats.totalVolunteers} subtext="Registered across events" icon="👥" />
        <StatCard title="Average Rating" value={`${summaryStats.avgRating} / 5`} subtext="Satisfaction index" icon="⭐" />
        <StatCard title="Total Feedback" value="128" subtext="Submissions received" icon="💬" />
      </div>

      {/* Summary Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Event Performance
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Over 85% of planned volunteering events were completed on schedule. Environment and Education drives achieved the highest volunteer turnout.
          </p>
          <ul className="text-xs font-semibold text-gray-700 space-y-1.5 pt-2">
            <li>• Completed Events: 28</li>
            <li>• Upcoming Events: 5</li>
            <li>• Cancelled Events: 2</li>
          </ul>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Volunteer Participation
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Active volunteer retention rate stands at 78%. Corporate partnerships generated 60% of total volunteer registrations.
          </p>
          <ul className="text-xs font-semibold text-gray-700 space-y-1.5 pt-2">
            <li>• Active Volunteers: 720</li>
            <li>• First-time Volunteers: 122</li>
            <li>• Avg Attendance Rate: 91%</li>
          </ul>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Feedback & Insights
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Volunteer satisfaction remains high at 4.4/5. Primary logistics suggestions involve water availability and venue ventilation.
          </p>
          <ul className="text-xs font-semibold text-gray-700 space-y-1.5 pt-2">
            <li>• 5-Star Reviews: 68</li>
            <li>• 4-Star Reviews: 38</li>
            <li>• Critical Alerts Resolved: 3</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
