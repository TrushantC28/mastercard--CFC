import React from 'react';
import { Link } from 'react-router-dom';

const EventsPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-lg text-gray-600">Browse and manage volunteering activities.</p>
        </div>
        <Link to="/events/1" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          View Event Details
        </Link>
      </div>
    </div>
  );
};

export default EventsPage;
