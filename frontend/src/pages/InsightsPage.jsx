import { TrendingUp, Users, HeartHandshake, Award } from 'lucide-react';

const InsightsPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-1">Impact Insights & Analytics</h1>
        <p className="text-slate-500 font-medium">Real-time statistics across all Mastercard CFC volunteering drives.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-3xl font-black text-slate-900 mb-1">1,240+</p>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Volunteers</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <HeartHandshake size={24} />
          </div>
          <p className="text-3xl font-black text-slate-900 mb-1">84</p>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">NGO Drives Completed</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-3xl font-black text-slate-900 mb-1">4,820 hrs</p>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Service Hours</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Award size={24} />
          </div>
          <p className="text-3xl font-black text-slate-900 mb-1">98.4%</p>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Positive Feedback</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Drive Categories Overview</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-bold mb-1">
              <span>Environment & Cleanliness</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-bold mb-1">
              <span>Education & Mentorship</span>
              <span>35%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-bold mb-1">
              <span>Community Welfare & Healthcare</span>
              <span>20%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div className="bg-purple-500 h-3 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
