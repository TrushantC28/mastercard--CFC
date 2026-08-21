import React from 'react';

const StatCard = ({ title, value, subtext, icon, trend }) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
            {icon}
          </div>
        )}
      </div>
      {subtext && (
        <p className="text-xs text-gray-500 mt-2 font-medium">
          {trend && <span className="text-emerald-600 font-semibold mr-1">{trend}</span>}
          {subtext}
        </p>
      )}
    </div>
  );
};

export default StatCard;
