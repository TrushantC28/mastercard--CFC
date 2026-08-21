import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { mockEvents, mockVolunteers, mockFeedback } from '../../data/adminMockData';

const AdminEventDetails = () => {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id) || mockEvents[0];
  const registeredList = mockVolunteers.slice(0, 4);
  const eventFeedback = mockFeedback.filter((f) => f.eventId === event.id || f.eventId === 'evt-101');

  return (
    <AdminLayout>
      {/* Back Link */}
      <Link
        to="/admin/events"
        className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        ← Back to Events List
      </Link>

      {/* Main Details Card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={event.status} />
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                {event.eventType}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">{event.name}</h1>
            <p className="text-slate-500 font-medium mt-1">Organized by {event.organizer}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => alert('Editing Event')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg transition-colors cursor-pointer"
            >
              Edit Event
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-sm">
          <div className="p-4 bg-slate-50 rounded-lg">
            <span className="text-xs font-bold text-slate-400 uppercase">Date & Time</span>
            <div className="font-bold text-slate-900 mt-1">{event.date}</div>
            <span className="text-xs text-slate-500">{event.time}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <span className="text-xs font-bold text-slate-400 uppercase">Location</span>
            <div className="font-bold text-slate-900 mt-1">{event.location}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <span className="text-xs font-bold text-slate-400 uppercase">Volunteer Slots</span>
            <div className="font-bold text-emerald-700 mt-1">
              {event.registeredVolunteers} / {event.totalSlots} Registered
            </div>
          </div>
        </div>

        {/* Description & Skills */}
        <div className="space-y-4 text-sm border-t border-slate-100 pt-6">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Event Description</h3>
            <p className="text-slate-600 leading-relaxed">{event.description}</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Required Skills / Notes</h3>
            <p className="text-slate-600">{event.requiredSkills}</p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Registered Volunteers & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registered Volunteers */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Registered Volunteers ({registeredList.length})</h2>
            <Link to="/admin/volunteers" className="text-xs font-bold text-emerald-600 hover:underline">
              View All Volunteers →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {registeredList.map((vol) => (
              <div key={vol.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{vol.name}</div>
                  <div className="text-xs text-slate-500">{vol.email}</div>
                </div>
                <span className="text-xs font-semibold text-slate-600">{vol.phone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event Feedback */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Event Feedback</h2>
            <Link to="/admin/feedback" className="text-xs font-bold text-emerald-600 hover:underline">
              View All Feedback →
            </Link>
          </div>

          <div className="flex items-center gap-4 bg-emerald-50/60 p-4 rounded-lg mb-4">
            <div className="text-3xl font-extrabold text-slate-900">4.6 / 5</div>
            <div className="text-xs font-medium text-slate-600">
              Based on {eventFeedback.length} volunteer submissions
            </div>
          </div>

          <div className="space-y-3">
            {eventFeedback.map((fb) => (
              <div key={fb.id} className="p-3 bg-slate-50 rounded-lg text-xs">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="text-slate-900">{fb.volunteerName}</span>
                  <span className="text-amber-500">★ {fb.rating}</span>
                </div>
                <p className="text-slate-600 italic">"{fb.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEventDetails;
