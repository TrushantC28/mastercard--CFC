import { Link } from 'react-router-dom';
import { recentFeedback, volunteerStats } from '../data/mockData';
import { Star, MessageSquare, Plus, ChevronRight } from 'lucide-react';

const FeedbackPage = () => {


  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Your Feedback</h1>
          <p className="text-slate-500 font-medium">Your insights help us improve the volunteering experience.</p>
        </div>
        <Link to="/feedback/new" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={20} /> Share Feedback
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 rounded-full bg-blue-100 text-blue-600">
            <MessageSquare size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Submitted</p>
            <p className="text-3xl font-black text-slate-900">{volunteerStats.feedbackSubmitted}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 rounded-full bg-amber-100 text-amber-500">
            <Star size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-black text-slate-900">4.5</p>
              <div className="flex text-amber-400">
                {[1,2,3,4].map(i => <Star key={i} size={16} fill="currentColor" />)}
                <Star size={16} className="text-amber-200" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-black text-slate-900">Past Submissions</h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {recentFeedback.map(item => (
            <div key={item.id} className="p-6 sm:p-8 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start">
              
              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-slate-900">{item.eventName}</h3>
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-500">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-400">{item.date}</p>
                </div>
                
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < item.rating ? "currentColor" : "none"} className={i < item.rating ? "" : "text-slate-200"} />
                  ))}
                </div>
                
                <p className="text-slate-700 italic border-l-4 border-amber-200 pl-4 py-1">
                  "{item.shortFeedback}"
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                    Theme: {item.theme}
                  </span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                    item.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    item.sentiment === 'Negative' ? 'bg-red-50 text-red-700 border-red-100' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    Sentiment: {item.sentiment}
                  </span>
                </div>
              </div>
              
              <button className="flex items-center gap-1 text-blue-600 font-bold hover:text-blue-800 transition-colors py-2 whitespace-nowrap">
                View Feedback <ChevronRight size={16} />
              </button>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FeedbackPage;
