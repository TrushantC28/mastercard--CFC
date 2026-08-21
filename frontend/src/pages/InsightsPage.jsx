import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { aiInsightApi } from '../services/api';

const InsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewMessage, setReviewMessage] = useState('');

  const fetchInsights = () => {
    setIsLoading(true);
    aiInsightApi.getInsights()
      .then((res) => {
        setInsights(res.data || []);
        setSummary(res.summary || null);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleReview = async (id, status) => {
    try {
      await aiInsightApi.reviewInsight(id, { status });
      setReviewMessage(`Recommendation marked as '${status}'!`);
      fetchInsights();
      setTimeout(() => setReviewMessage(''), 3000);
    } catch (err) {
      setReviewMessage(err.message || 'Review failed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">🤖 AI Pattern Discovery & Action Engine</h1>
          <p className="text-slate-500">Automated recurring issue identification, operational recommendations & learning metrics</p>
        </div>

        {reviewMessage && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded-xl text-sm">
            {reviewMessage}
          </div>
        )}

        {/* Summary Metrics */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Discovered Insights</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{summary.totalInsights}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Pending Review</span>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">{summary.pendingReview}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Accepted Actions</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">{summary.acceptedActions}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Critical Alerts</span>
              <div className="text-3xl font-extrabold text-red-600 mt-1">{summary.criticalAlerts}</div>
            </div>
          </div>
        )}

        {/* AI Recommendations List */}
        {isLoading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-500 font-semibold">
            Analyzing volunteer feedback patterns with AI Engine...
          </div>
        ) : insights.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-500 font-semibold">
            No recurring issue patterns currently detected. All activities running smoothly! 🎉
          </div>
        ) : (
          <div className="space-y-6">
            {insights.map((item) => (
              <div
                key={item._id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        item.severity === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : item.severity === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {item.severity} Severity
                    </span>
                    <span className="text-sm font-bold text-slate-500">
                      Recurring Count: {item.recurringCount} volunteers
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-extrabold rounded-xl ${
                      item.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'rejected'
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}
                  >
                    STATUS: {item.status.toUpperCase().replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.insightText}</h3>

                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl mb-6">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
                    💡 AI Recommended Action:
                  </span>
                  <p className="text-slate-800 font-semibold text-base">{item.recommendedAction}</p>
                </div>

                {item.effectivenessScore !== undefined && (
                  <div className="mb-4 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl inline-block">
                    📈 Closed-Loop Effectiveness Score: {item.effectivenessScore}% rating improvement post-action
                  </div>
                )}

                {/* Admin Review Controls */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Admin Action:</span>
                  <button
                    onClick={() => handleReview(item._id, 'accepted')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    ✓ Accept Recommendation
                  </button>
                  <button
                    onClick={() => handleReview(item._id, 'modified')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    ✏️ Modify Action
                  </button>
                  <button
                    onClick={() => handleReview(item._id, 'rejected')}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    ✕ Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default InsightsPage;
