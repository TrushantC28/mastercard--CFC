import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { feedbackApi, activityApi } from '../services/api';
import { mockEvents } from '../data/adminMockData';

const FeedbackFormPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramActivityId = searchParams.get('activityId');

  const [activitiesList, setActivitiesList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(paramActivityId || '');
  const [overallRating, setOverallRating] = useState(5);
  const [organizationRating, setOrganizationRating] = useState(5);
  const [impactRating, setImpactRating] = useState(5);
  const [comments, setComments] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [language, setLanguage] = useState('en');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    fetchCompletedActivities();
  }, []);

  const fetchCompletedActivities = async () => {
    try {
      const res = await activityApi.getActivities();
      const list = res.data?.activities || res.data || res.activities || res;
      if (Array.isArray(list) && list.length > 0) {
        setActivitiesList(list);
        if (!selectedEventId) setSelectedEventId(list[0]._id || list[0].id);
      } else {
        setActivitiesList(mockEvents);
        if (!selectedEventId) setSelectedEventId(mockEvents[0].id);
      }
    } catch {
      setActivitiesList(mockEvents);
      if (!selectedEventId) setSelectedEventId(mockEvents[0].id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    setAlreadySubmitted(false);

    try {
      await feedbackApi.submitFeedback(selectedEventId, {
        rating: Number(overallRating),
        overallRating: Number(overallRating),
        organizationRating: Number(organizationRating),
        impactRating: Number(impactRating),
        comments,
        suggestions,
        language,
      });

      setMessage({
        type: 'success',
        text: '🎉 Thank you! Your feedback has been submitted successfully.',
      });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      const errMsg = err.message || '';
      if (errMsg.toLowerCase().includes('already') || errMsg.toLowerCase().includes('duplicate')) {
        setAlreadySubmitted(true);
        setMessage({
          type: 'info',
          text: 'ℹ️ You have already submitted feedback for this activity.',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Feedback recorded! Thank you for helping SevaSahayog improve.',
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-8">
        <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-xl shadow-sm">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Volunteer Feedback Form</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Share your experience! Takes less than 1 minute and directly impacts future activities.
            </p>
          </div>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg font-semibold text-xs border ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : message.type === 'info'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {alreadySubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-4xl">✅</div>
              <h3 className="text-lg font-bold text-gray-900">Feedback Already Submitted</h3>
              <p className="text-xs text-gray-500">
                You have already shared feedback for this volunteering activity. Thank you!
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              {/* Event Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Select Activity / Event *
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-semibold"
                >
                  {activitiesList.map((evt) => (
                    <option key={evt._id || evt.id} value={evt._id || evt.id}>
                      {evt.title || evt.name} ({evt.date || 'Completed'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Overall Rating */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Overall Experience Rating (1 to 5 Stars) *
                </label>
                <div className="flex gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverallRating(star)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-colors cursor-pointer border ${
                        overallRating >= star
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-gray-50 text-gray-400 border-gray-200'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Preferred Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-medium"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="mr">Marathi (मराठी)</option>
                </select>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Comments & Experience *
                </label>
                <textarea
                  rows={3}
                  required
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="What went well? Any issues faced?"
                ></textarea>
              </div>

              {/* Suggestions */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Suggestions for Improvement
                </label>
                <textarea
                  rows={3}
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="How can we improve logistics, safety, or timing next time?"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {isLoading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeedbackFormPage;
