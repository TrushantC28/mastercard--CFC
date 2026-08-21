import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = (status || '').toLowerCase();
  
  let colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';

  if (normalized === 'upcoming') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
  } else if (normalized === 'ongoing') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
  } else if (normalized === 'completed') {
    colorClasses = 'bg-gray-100 text-gray-600 border-gray-200 font-medium';
  } else if (normalized === 'cancelled' || normalized === 'canceled') {
    colorClasses = 'bg-red-50 text-red-700 border-red-200 font-semibold';
  } else if (normalized === 'active') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
  } else if (normalized === 'inactive') {
    colorClasses = 'bg-gray-100 text-gray-500 border-gray-200 font-medium';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${colorClasses}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
