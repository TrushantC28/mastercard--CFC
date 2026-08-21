import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { mockEvents, mockVolunteers, mockFeedback } from '../../data/adminMockData';

const AdminEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = mockEvents.find((e) => e.id === id) || mockEvents[0];
  const registeredList = mockVolunteers.slice(0, 4);
  const eventFeedbackList = mockFeedback.filter(f => f.eventId === event.id || f.eventName === event.name);

  return (
    <AdminLayout title="Event Details" subtitle={`Viewing full details for ${event.name}`}>
      {/* Back Link */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/admin/events')}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← Back to Events List
        </button>
      </div>

      {/* Main Event Details Card */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
              <StatusBadge status={event.status} />
            </div>
            <p className="text-xs font-semibold text-emerald-700">Organized by {event.organizer} ({event.spocName})</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/events"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
            >
              Edit Event
            </Link>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Date & Time</span>
            <p className="text-sm font-semibold text-gray-900 mt-1">{event.date}</p>
            <p className="text-xs text-gray-500">{event.time}</p>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Location</span>
            <p className="text-sm font-semibold text-gray-900 mt-1">{event.location}</p>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Volunteer Slots</span>
            <p className="text-sm font-bold text-emerald-700 mt-1">
              {event.registeredVolunteers} / {event.totalSlots} Registered
            </p>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Category & Skills</span>
            <p className="text-sm font-semibold text-gray-900 mt-1">{event.eventType}</p>
            <p className="text-xs text-gray-500">{event.requiredSkills}</p>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Event Description</span>
          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
            {event.description}
          </p>
        </div>
      </div>

      {/* Two Column Grid for Registered Volunteers & Event Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registered Volunteers */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">Registered Volunteers ({registeredList.length})</h3>
            <Link to="/admin/volunteers" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              View Volunteers →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {registeredList.map((vol) => (
              <div key={vol.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">{vol.name}</p>
                  <p className="text-xs text-gray-500">{vol.email} • {vol.phone}</p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">Event Feedback</h3>
            <Link to="/admin/feedback" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              View Feedback →
            </Link>
          </div>

          <div className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
            <div className="text-3xl font-extrabold text-gray-900">4.6 ⭐</div>
            <div className="text-xs text-gray-600">
              <p className="font-bold">Average Volunteer Rating</p>
              <p>{eventFeedbackList.length || 1} submissions logged</p>
            </div>
          </div>

          <div className="space-y-3">
            {(eventFeedbackList.length > 0 ? eventFeedbackList : mockFeedback.slice(0, 2)).map((fb) => (
              <div key={fb.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900">{fb.volunteerName}</span>
                  <span className="font-bold text-amber-500">★ {fb.rating}</span>
                </div>
                <p className="text-xs text-gray-700 italic">"{fb.comment}"</p>
                <span className="text-[10px] text-gray-400 block">{fb.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEventDetails;
