import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { upcomingActivities } from '../data/mockData';
import { Star, CheckCircle2, ArrowLeft } from 'lucide-react';

const FeedbackFormPage = () => {
  const { user } = useOutletContext();
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const completedEvents = upcomingActivities.filter(a => a.status === 'Completed');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (user?.role !== 'volunteer') {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Share Your Feedback</h1>
          <p className="text-lg text-slate-600">The feedback submission form will be implemented here.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 font-sans">
        <div className="bg-white p-10 sm:p-16 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Thank you for your feedback!</h1>
          <p className="text-lg text-slate-600 max-w-lg mx-auto mb-10">
            Your experience helps us create better volunteering opportunities. We appreciate the time you took to share your thoughts.
          </p>
          <Link to="/feedback" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-md hover:shadow-lg">
            Return to Feedback
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12 font-sans space-y-6">
      
      <Link to="/feedback" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
        <ArrowLeft size={20} /> Back
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-8 sm:p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2">Share Your Experience</h1>
            <p className="text-blue-100 font-medium">Your feedback helps us improve future volunteering activities.</p>
          </div>
          <Star className="absolute -right-10 -bottom-10 text-white opacity-10" size={180} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
          
          {/* Event Selection */}
          <div className="space-y-3">
            <label htmlFor="event" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
              Select Event
            </label>
            <div className="relative">
              <select 
                id="event" 
                required
                className="w-full appearance-none pl-4 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-medium cursor-pointer"
              >
                <option value="" disabled selected>Choose a completed event</option>
                {completedEvents.map(event => (
                  <option key={event.id} value={event.id}>{event.title} ({event.date})</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
              Overall Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    size={40} 
                    fill={(hoveredRating || rating) >= star ? "#fbbf24" : "none"} 
                    className={(hoveredRating || rating) >= star ? "text-amber-400" : "text-slate-200"}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Themes */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
              What went well? (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-3">
              {['Organization', 'Communication', 'Event Experience', 'Impact', 'Volunteer Support'].map(theme => (
                <label key={theme} className="cursor-pointer">
                  <input type="checkbox" className="peer sr-only" name="themes" value={theme} />
                  <span className="inline-block px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:border-blue-200 transition-colors">
                    {theme}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Text Areas */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="enjoyed" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                What did you enjoy the most?
              </label>
              <textarea 
                id="enjoyed" 
                rows={3} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                placeholder="Share your positive highlights..."
                required
              />
            </div>
            
            <div className="space-y-3">
              <label htmlFor="improvements" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                What could be improved?
              </label>
              <textarea 
                id="improvements" 
                rows={3} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                placeholder="Let us know how we can do better next time..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={rating === 0}
              className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
                rating === 0 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              Submit Feedback
            </button>
            {rating === 0 && (
              <p className="text-center text-sm text-slate-500 mt-3">Please select a rating to continue.</p>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};

export default FeedbackFormPage;
