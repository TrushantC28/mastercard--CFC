import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { feedbackApi } from '../services/api';

const FeedbackFormPage = () => {
  const navigate = useNavigate();
  const [activityId, setActivityId] = useState('66aa1111bb2222cc33333030'); // Sample default ID
  const [overallRating, setOverallRating] = useState(5);
  const [organizationRating, setOrganizationRating] = useState(5);
  const [impactRating, setImpactRating] = useState(5);
  const [comments, setComments] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [language, setLanguage] = useState('en');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await feedbackApi.submitFeedback(activityId, {
        overallRating: Number(overallRating),
        organizationRating: Number(organizationRating),
        impactRating: Number(impactRating),
        comments,
        suggestions,
        language,
      });

      setMessage({
        type: 'success',
        text: 'Thank you! Your feedback has been submitted and sent for AI classification.',
      });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to submit feedback. Check eligibility or duplicate status.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto p-6 sm:p-8">
        <div className="bg-white border border-slate-100 p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Volunteer Feedback Form</h1>
          <p className="text-slate-500 mb-8">
            Share your experience! Takes less than 1 minute and helps improve future volunteering events.
          </p>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl font-semibold text-sm ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Activity ID</label>
              <input
                type="text"
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-mono text-sm"
                placeholder="Activity ID"
                required
              />
            </div>

            {/* Overall Rating */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Overall Experience Rating (1 - 5)
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className={`w-12 h-12 rounded-xl text-xl font-extrabold flex items-center justify-center transition-all cursor-pointer ${
                      overallRating >= star
                        ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    ★ {star}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-semibold"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="mr">Marathi (मराठी)</option>
              </select>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Comments & Experience</label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900"
                placeholder="What went well? Any issues faced?"
              ></textarea>
            </div>

            {/* Suggestions */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Suggestions for Next Event</label>
              <textarea
                rows={3}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900"
                placeholder="How can we improve logistics, safety, or timing?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer text-lg"
            >
              {isLoading ? 'Submitting & Classifying...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeedbackFormPage;
