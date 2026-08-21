import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { feedbackApi } from '../services/api';

const FeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [summary, setSummary] = useState(null);
  const [minRating, setMinRating] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedback = () => {
    setIsLoading(true);
    const params = {};
    if (minRating) params.minRating = minRating;

    feedbackApi.getFeedback(params)
      .then((res) => {
        setFeedbackList(res.data || []);
        setSummary(res.summary || null);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchFeedback();
  }, [minRating]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Feedback Analytics & Submissions</h1>
            <p className="text-slate-500">View role-scoped volunteer feedback responses and extracted themes</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-slate-700">Filter Rating:</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 font-semibold"
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="1">1 - 2 Stars (Low)</option>
            </select>
          </div>
        </div>

        {/* Analytics Summary */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Average Rating</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{summary.averageOverallRating || '5.0'} / 5</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Responses</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{summary.totalResponses || feedbackList.length}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Top Theme</span>
              <div className="text-lg font-extrabold text-amber-600 mt-1">
                {summary.topThemes?.[0]?.themeName || 'Timing & Logistics'}
              </div>
            </div>
          </div>
        )}

        {/* Feedback List Table */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 font-semibold">Loading feedback records...</div>
          ) : feedbackList.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-semibold">No feedback submissions found matching criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Rating</th>
                    <th className="p-4">Volunteer</th>
                    <th className="p-4">Comments</th>
                    <th className="p-4">Themes</th>
                    <th className="p-4">Urgent</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {feedbackList.map((fb) => (
                    <tr key={fb._id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-amber-600">★ {fb.overallRating}</td>
                      <td className="p-4 font-semibold text-slate-900">{fb.volunteerId?.name || 'Volunteer'}</td>
                      <td className="p-4 max-w-xs truncate text-slate-600">{fb.comments || 'No comments'}</td>
                      <td className="p-4">
                        {Array.isArray(fb.themes) && fb.themes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {fb.themes.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-md">
                                {t.themeName}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Uncategorized</span>
                        )}
                      </td>
                      <td className="p-4">
                        {fb.isUrgent ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-lg animate-pulse">
                            🚨 URGENT
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Normal</span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-slate-400">
                        {new Date(fb.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeedbackPage;
