import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { upcomingActivities } from '../data/mockData';
import { Search, MapPin, CalendarDays, Filter } from 'lucide-react';

const EventsPage = () => {
  const { user } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');

  if (user?.role !== 'volunteer') {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-lg text-gray-600">Browse and manage volunteering activities.</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter activities based on search term
  const filteredActivities = upcomingActivities.filter(activity => 
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    activity.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.ngo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Volunteering Events</h1>
          <p className="text-slate-500 font-medium">Discover opportunities to make a difference.</p>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by event, NGO, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 text-slate-900 placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap transition-colors">
            <Filter size={18} /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap transition-colors">
            <CalendarDays size={18} /> Date
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap transition-colors">
            <MapPin size={18} /> Location
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map(activity => (
          <div key={activity.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
            <div className="h-48 relative">
              <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm ${
                  activity.status === 'Registered' ? 'bg-amber-400 text-amber-950' :
                  activity.status === 'Completed' ? 'bg-slate-800 text-white' :
                  'bg-emerald-400 text-emerald-950'
                }`}>
                  {activity.status}
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">{activity.title}</h3>
                <p className="text-blue-600 text-sm font-bold mb-3">{activity.ngo}</p>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
                
                <div className="space-y-2 text-sm text-slate-600 font-medium mb-6 bg-slate-50 p-3 rounded-xl">
                  <p className="flex items-center gap-2"><CalendarDays size={16} className="text-slate-400" /> {activity.date}</p>
                  <p className="flex items-center gap-2 truncate"><MapPin size={16} className="text-slate-400 shrink-0" /> <span className="truncate">{activity.location}</span></p>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <Link to={`/events/${activity.id}`} className="text-slate-600 font-bold hover:text-blue-600 py-2 transition-colors">
                  View Details
                </Link>
                {activity.status === 'Open' ? (
                  <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
                    Register
                  </button>
                ) : activity.status === 'Registered' ? (
                  <button disabled className="bg-amber-100 text-amber-800 px-5 py-2.5 rounded-xl font-bold cursor-not-allowed">
                    Registered
                  </button>
                ) : (
                  <button disabled className="bg-slate-100 text-slate-500 px-5 py-2.5 rounded-xl font-bold cursor-not-allowed">
                    Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredActivities.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No events found</h3>
            <p className="text-slate-500">We couldn't find any events matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
