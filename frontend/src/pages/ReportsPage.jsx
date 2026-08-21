import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { feedbackApi } from '../services/api';

const ReportsPage = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setMessage('');
    try {
      await feedbackApi.exportCSV();
      setMessage('CSV Report downloaded successfully!');
    } catch (err) {
      setMessage(err.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-8">
        <div className="bg-white border border-slate-100 p-8 sm:p-12 rounded-3xl shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>

          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">
            📊
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
            Multi-Tenant CSV Stakeholder Reporting
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto mb-8 text-base">
            Export structured feedback metrics, sentiment themes, urgent alerts, and rating analytics formatted for Excel and corporate board reviews.
          </p>

          {message && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded-xl text-sm max-w-md mx-auto">
              {message}
            </div>
          )}

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? 'Generating CSV Stream...' : '📥 Download CSV Report'}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportsPage;
