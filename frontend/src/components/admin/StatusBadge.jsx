import React from 'react';

const StatusBadge = ({ status }) => {
  let badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";

  const lower = (status || "").toLowerCase();
  if (lower === "upcoming") {
    badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
  } else if (lower === "ongoing") {
    badgeStyle = "bg-blue-50 text-blue-700 border-blue-200 font-bold";
  } else if (lower === "completed") {
    badgeStyle = "bg-slate-100 text-slate-700 border-slate-200 font-medium";
  } else if (lower === "cancelled" || lower === "inactive") {
    badgeStyle = "bg-red-50 text-red-700 border-red-200 font-bold";
  }

  return (
    <span className={`inline-block px-2.5 py-1 text-xs rounded-md border ${badgeStyle}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
