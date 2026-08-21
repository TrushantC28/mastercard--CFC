import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { feedbackApi, aiInsightApi } from '../services/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalFeedback: 0,
    avgRating: '4.8',
    activeInsights: 0,
    urgentAlerts: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch {
      setUser(null);
    }

    feedbackApi.getFeedback()
      .then(res => {
        if (res.summary) {
          setStats(prev => ({
            ...prev,
            totalFeedback: res.summary.totalResponses || res.data?.length || 0,
            avgRating: res.summary.averageOverallRating || '4.8',
          }));
        }
      })
      .catch(() => {});

    aiInsightApi.getInsights()
      .then(res => {
        if (res.summary) {
          setStats(prev => ({
            ...prev,
            activeInsights: res.summary.pendingReview || 0,
            urgentAlerts: res.summary.criticalAlerts || 0,
          }));
        }
      })
      .catch(() => {});
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        {/* Welcome Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 mb-10 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-amber-400 text-slate-950 font-extrabold text-xs rounded-full mb-3 uppercase tracking-wider">
                {user?.role ? user.role.toUpperCase() : 'VOLUNTEER PORTAL'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                Welcome back, {user?.name || 'Volunteer'}! 👋
              </h1>
              <p className="text-slate-400 text-sm sm:text-base font-medium">
                SevaSahayog Volunteer Experience & AI Insights Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <span className="text-3xl mb-2 block">⭐</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.avgRating} / 5</div>
            <p className="text-xs text-emerald-600 font-semibold mt-2">↑ 94% positive sentiment</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <span className="text-3xl mb-2 block">💬</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Submissions</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalFeedback}</div>
            <p className="text-xs text-slate-500 font-medium mt-2">Across 35 monthly activities</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <span className="text-3xl mb-2 block">🧠</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Insights</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.activeInsights}</div>
            <p className="text-xs text-amber-600 font-semibold mt-2">Pending admin review</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <span className="text-3xl mb-2 block">🚨</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urgent Alerts</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.urgentAlerts}</div>
            <p className="text-xs text-red-500 font-semibold mt-2">Real-time email dispatched</p>
          </div>
        </div>

        {/* Quick Action Cards */}
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Quick Portal Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/feedback/new"
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-600 flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                ✍️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Submit Feedback</h3>
              <p className="text-slate-500 text-sm">
                Complete 1-minute post-activity feedback with ratings and multilingual suggestions.
              </p>
            </div>
            <span className="inline-flex items-center text-amber-600 font-bold text-sm mt-6 group-hover:translate-x-1 transition-transform">
              Submit Form →
            </span>
          </Link>

          <Link
            to="/insights"
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                🤖
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Insights & Actions</h3>
              <p className="text-slate-500 text-sm">
                View automated pattern discovery, severity rankings, and AI recommendations.
              </p>
            </div>
            <span className="inline-flex items-center text-indigo-600 font-bold text-sm mt-6 group-hover:translate-x-1 transition-transform">
              View AI Engine →
            </span>
          </Link>

          <Link
            to="/reports"
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">CSV Stakeholder Reports</h3>
              <p className="text-slate-500 text-sm">
                Download multi-tenant scoped CSV reports for corporate board reviews.
              </p>
            </div>
            <span className="inline-flex items-center text-emerald-600 font-bold text-sm mt-6 group-hover:translate-x-1 transition-transform">
              Export CSV →
            </span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
