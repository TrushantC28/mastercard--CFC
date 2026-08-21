import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import { feedbackApi, activityApi } from '../../services/api';
import { mockFeedback, summaryStats, mockEvents, mockSPOCs } from '../../data/adminMockData';

const mockThemeBreakdown = [
  { theme: 'Logistics & Refreshments', count: 45, percentage: 35, sentiment: 'Positive', confidence: 0.92, statusColor: 'bg-emerald-500' },
  { theme: 'On-site Safety & Guidance', count: 34, percentage: 27, sentiment: 'Positive', confidence: 0.88, statusColor: 'bg-emerald-500' },
  { theme: 'Briefing & Orientation Quality', count: 28, percentage: 22, sentiment: 'Mixed', confidence: 0.81, statusColor: 'bg-amber-500' },
  { theme: 'Timing & Waiting Duration', count: 21, percentage: 16, sentiment: 'Needs Improvement', confidence: 0.76, statusColor: 'bg-rose-500' },
];

const AdminFeedbackPage = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedSPOC, setSelectedSPOC] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, [selectedEvent, selectedSPOC, selectedRating]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await feedbackApi.getFeedback({
        eventId: selectedEvent || undefined,
        rating: selectedRating || undefined,
      });
      const list = res.data?.feedback || res.data || res.feedback || res;
      if (Array.isArray(list) && list.length > 0) {
        setFeedbackList(list);
      } else {
        setFeedbackList(mockFeedback);
      }
    } catch (err) {
      console.warn('Feedback API fetch fallback:', err);
      setFeedbackList(mockFeedback);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      await feedbackApi.exportCSV({ eventId: selectedEvent, rating: selectedRating });
    } catch (err) {
      alert('Export failed or running offline. Generating CSV fallback.');
      const csvData = "ID,Event,Volunteer,Rating,Comment,Date\n" +
        feedbackList.map(f => `"${f.id || f._id}","${f.eventName || 'Drive'}","${f.volunteerName || 'Volunteer'}",${f.rating},"${f.comment || ''}","${f.date || ''}"`).join("\n");
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Feedback_Export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } finally {
      setExporting(false);
    }
  };

  const filteredFeedback = feedbackList.filter((item) => {
    const matchEvent = selectedEvent ? item.eventId === selectedEvent || item.eventName === selectedEvent : true;
    const matchSPOC = selectedSPOC ? item.companyName === selectedSPOC : true;
    const matchRating = selectedRating ? item.rating === Number(selectedRating) : true;
    return matchEvent && matchSPOC && matchRating;
  });

  return (
    <AdminLayout
      title="Feedback & Theme Classification Intelligence"
      subtitle="Analyze recurring feedback themes, sentiment breakdown, rating trends, and suggestions across all partners."
    >
      {/* Top Header Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Feedback Analytics Overview</h2>
        <button
          disabled={exporting}
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <span>📥</span> {exporting ? 'Exporting...' : 'Export Feedback CSV'}
        </button>
      </div>

      {/* 4 Feedback Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Average Rating"
          value={`${summaryStats.avgRating} / 5`}
          subtext="Overall Volunteer Satisfaction"
          icon="⭐"
        />
        <StatCard
          title="Total Submissions"
          value="128 Responses"
          subtext="Verified volunteer feedback"
          icon="💬"
        />
        <StatCard
          title="Positive Sentiment"
          value="92%"
          subtext="4 & 5 Star ratings"
          icon="👍"
        />
        <StatCard
          title="Urgent Concerns"
          value="8%"
          subtext="Low ratings & safety items"
          icon="⚠️"
        />
      </div>

      {/* PROMINENT RECURRING THEME BREAKDOWN & SENTIMENT ANALYSIS */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded uppercase border border-emerald-200">
              AI / Rule Classification Engine
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-1">
              Recurring Feedback Themes & Frequency Breakdown
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-semibold">
            Analyzed across 128 submissions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockThemeBreakdown.map((thm) => (
            <div key={thm.theme} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">{thm.theme}</span>
                <span className="text-xs font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {thm.count} mentions ({thm.percentage}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${thm.statusColor} rounded-full transition-all duration-500`}
                  style={{ width: `${thm.percentage * 2}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 pt-1">
                <span>Sentiment: <strong className="text-gray-800">{thm.sentiment}</strong></span>
                <span>Confidence Score: <strong className="text-emerald-700">{(thm.confidence * 100).toFixed(0)}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Controls & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Rating Distribution */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Rating Breakdown
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
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Multi-Criteria Filters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Filter by Activity</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 font-semibold"
              >
                <option value="">All Activities</option>
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
                <option value="">All Corporate Partners</option>
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Activity</th>
                <th className="p-4">Volunteer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Feedback Comment & Suggestion</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Theme Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">Loading feedback...</td>
                </tr>
              ) : filteredFeedback.map((fb) => (
                <tr key={fb.id || fb._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4 font-bold text-gray-900 text-xs">
                    {fb.eventName || 'Tree Plantation Drive'}
                    <span className="block text-[10px] font-normal text-gray-500">{fb.companyName || 'Corporate Partner'}</span>
                  </td>
                  <td className="p-4 font-medium text-gray-800 text-xs">{fb.volunteerName || 'Rahul Sharma'}</td>
                  <td className="p-4 font-bold text-amber-500 text-xs">★ {fb.rating}</td>
                  <td className="p-4 text-xs text-gray-700 max-w-md">
                    <p className="font-medium">"{fb.comment}"</p>
                    {fb.suggestions && (
                      <p className="text-gray-500 mt-1">
                        <strong className="text-emerald-700">Suggestion:</strong> {fb.suggestions}
                      </p>
                    )}
                  </td>
                  <td className="p-4 text-xs text-gray-400">{fb.date || '2026-08-15'}</td>
                  <td className="p-4 text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
                      Logistics
                    </span>
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
