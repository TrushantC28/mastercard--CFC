import { useState } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { upcomingActivities } from '../data/mockData';
import { CalendarDays, MapPin, Clock, Users, ArrowLeft, CheckCircle2 } from 'lucide-react';

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user } = useOutletContext();
  
  // Find event or default to the first one for demo purposes
  const event = upcomingActivities.find(a => a.id === parseInt(id)) || upcomingActivities[0];
  
  const [status, setStatus] = useState(event.status);

  const handleRegister = () => {
    setStatus('Registered');
    // In a real app, make API call here
  };

  if (user?.role !== 'volunteer') {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Event Details</h1>
          <p className="text-lg text-slate-600">Detailed information about the selected event will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 font-sans space-y-6">
      
      {/* Back Button */}
      <Link to="/events" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
        <ArrowLeft size={20} /> Back to Events
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header Image */}
        <div className="h-64 sm:h-80 md:h-96 w-full relative">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 text-white">
            <span className={`inline-block px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full mb-4 shadow-sm ${
              status === 'Registered' ? 'bg-amber-400 text-amber-950' :
              status === 'Completed' ? 'bg-slate-700 text-white' :
              'bg-emerald-400 text-emerald-950'
            }`}>
              {status}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 leading-tight">{event.title}</h1>
            <p className="text-lg sm:text-xl font-medium text-slate-200">Organized by <span className="text-white font-bold">{event.ngo}</span></p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-black text-slate-900 mb-4">About the Event</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {event.description}
                </p>
                {/* Simulated extended description */}
                <p className="text-slate-600 text-lg leading-relaxed mt-4">
                  This volunteering activity is a great way to give back to the community while meeting like-minded individuals. We provide all necessary materials and a brief orientation session before we begin.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-slate-900 mb-4">Volunteer Requirements</h2>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                  <ul className="space-y-3 text-slate-700 font-medium">
                    <li className="flex gap-3">
                      <CheckCircle2 className="text-amber-500 shrink-0 mt-0.5" size={20} />
                      <span>{event.requirements}</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="text-amber-500 shrink-0 mt-0.5" size={20} />
                      <span>Enthusiasm and willingness to help.</span>
                    </li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Sticky Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-6">
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shrink-0"><CalendarDays size={24} /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Date</p>
                      <p className="text-slate-900 font-bold">{event.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shrink-0"><Clock size={24} /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Time</p>
                      <p className="text-slate-900 font-bold">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shrink-0"><MapPin size={24} /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Location</p>
                      <p className="text-slate-900 font-bold">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shrink-0"><Users size={24} /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Availability</p>
                      <p className="text-slate-900 font-bold">
                        {event.slots > 0 ? `${event.slots} slots available` : 'Event Full'}
                      </p>
                      <p className="text-sm text-slate-500 mt-0.5">{event.registeredVolunteers} volunteers registered</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  {status === 'Open' ? (
                    <button 
                      onClick={handleRegister}
                      disabled={event.slots === 0}
                      className={`w-full py-4 rounded-xl font-black text-lg transition-all shadow-md ${
                        event.slots === 0 
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                      }`}
                    >
                      {event.slots === 0 ? 'Fully Booked' : 'Register for Event'}
                    </button>
                  ) : status === 'Registered' ? (
                    <button disabled className="w-full py-4 rounded-xl font-black text-lg bg-amber-100 text-amber-800 cursor-default flex items-center justify-center gap-2">
                      <CheckCircle2 size={24} /> You're Registered
                    </button>
                  ) : (
                    <button disabled className="w-full py-4 rounded-xl font-black text-lg bg-slate-100 text-slate-500 cursor-default">
                      Event Completed
                    </button>
                  )}
                </div>

              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                <p className="text-sm font-bold text-blue-900 mb-2">Have questions?</p>
                <p className="text-blue-600/80 mb-4 text-sm">Contact the organizer directly.</p>
                <button className="text-blue-700 font-black hover:underline">Contact {event.ngo}</button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
