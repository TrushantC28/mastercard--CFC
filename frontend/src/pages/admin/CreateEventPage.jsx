import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    organizer: 'ABC Corporation',
    date: '',
    time: '',
    location: '',
    totalSlots: 50,
    requiredSkills: '',
    eventType: 'Environment',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Event "${formData.name}" created successfully (Mock State)!`);
    navigate('/admin/events');
  };

  return (
    <AdminLayout>
      <Link
        to="/admin/events"
        className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        ← Back to Events List
      </Link>

      <div className="max-w-3xl bg-white p-6 sm:p-10 rounded-xl border border-slate-200/80 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Create New Event</h1>
        <p className="text-slate-500 text-sm mb-8">
          Fill out the details below to schedule a new volunteering activity.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Event Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Tree Plantation Drive"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Organizer / Corporate SPOC</label>
              <select
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50"
              >
                <option value="ABC Corporation">ABC Corporation</option>
                <option value="TechCorp Global">TechCorp Global</option>
                <option value="HealthPlus Foundation">HealthPlus Foundation</option>
                <option value="EcoPartners India">EcoPartners India</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50"
              >
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Community Outreach">Community Outreach</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Time Range</label>
              <input
                type="text"
                required
                placeholder="e.g. 9:00 AM - 12:00 PM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Volunteer Slots</label>
              <input
                type="number"
                required
                min={1}
                value={formData.totalSlots}
                onChange={(e) => setFormData({ ...formData, totalSlots: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Location</label>
            <input
              type="text"
              required
              placeholder="e.g. Pune City Park"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              required
              placeholder="Provide event details, objectives, and instructions for volunteers..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Required Skills / Prerequisites</label>
            <input
              type="text"
              placeholder="e.g. Basic teaching experience, physical stamina"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50"
            />
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/admin/events')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateEventPage;
