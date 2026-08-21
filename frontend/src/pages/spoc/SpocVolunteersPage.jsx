import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SpocLayout from '../../components/spoc/SpocLayout';
import { activityApi, registrationApi } from '../../services/api';
import { mockEvents } from '../../data/adminMockData';

const mockVolunteersList = [
  { id: 'v1', name: 'Rahul Sharma', email: 'rahul.s@techcorp.com', phone: '+91 98765 43210', attendanceStatus: 'attended', registeredAt: '2026-08-10' },
  { id: 'v2', name: 'Priya Kulkarni', email: 'priya.k@techcorp.com', phone: '+91 98765 43211', attendanceStatus: 'attended', registeredAt: '2026-08-11' },
  { id: 'v3', name: 'Amitabh Joshi', email: 'amitabh.j@techcorp.com', phone: '+91 98765 43212', attendanceStatus: 'registered', registeredAt: '2026-08-12' },
  { id: 'v4', name: 'Sneha Patel', email: 'sneha.p@techcorp.com', phone: '+91 98765 43213', attendanceStatus: 'registered', registeredAt: '2026-08-14' },
];

const SpocVolunteersPage = () => {
  const [searchParams] = useSearchParams();
  const activityParamId = searchParams.get('activityId');

  const [activities, setActivities] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState(activityParamId || '');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyActivities();
  }, []);

  useEffect(() => {
    if (selectedActivityId) {
      fetchRegistrations(selectedActivityId);
    }
  }, [selectedActivityId]);

  const fetchCompanyActivities = async () => {
    setLoading(true);
    try {
      const res = await activityApi.getActivities();
      const list = res.data?.activities || res.data || res.activities || res;
      if (Array.isArray(list) && list.length > 0) {
        setActivities(list);
        if (!selectedActivityId) setSelectedActivityId(list[0]._id || list[0].id);
      } else {
        setActivities(mockEvents);
        if (!selectedActivityId) setSelectedActivityId(mockEvents[0].id);
      }
    } catch {
      setActivities(mockEvents);
      if (!selectedActivityId) setSelectedActivityId(mockEvents[0].id);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async (activityId) => {
    try {
      const res = await registrationApi.getActivityRegistrations(activityId);
      const list = res.data?.registrations || res.data || res.registrations || res;
      if (Array.isArray(list) && list.length > 0) {
        setRegistrations(list);
      } else {
        setRegistrations(mockVolunteersList);
      }
    } catch {
      setRegistrations(mockVolunteersList);
    }
  };

  const currentActivity = activities.find((a) => String(a._id || a.id) === String(selectedActivityId)) || activities[0];
  const maxSlots = currentActivity?.maxVolunteers || currentActivity?.totalSlots || 30;
  const regCount = registrations.length > 0 ? registrations.length : 18;
  const pctFilled = Math.min(100, Math.round((regCount / maxSlots) * 100));

  return (
    <SpocLayout
      title="Registered Volunteers & Capacity Tracking"
      subtitle="View registered employees, capacity utilization, and attendance rosters per activity."
    >
      {/* Activity Selector & Capacity Overview */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Select Company Activity Drive
            </label>
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-bold text-sm"
            >
              {activities.map((act) => (
                <option key={act._id || act.id} value={act._id || act.id}>
                  {act.title || act.name} ({act.date || 'Upcoming'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100 min-w-72">
            <div className="text-3xl">👥</div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-800">
                Volunteers Required vs Registered
              </span>
              <p className="text-xl font-black text-emerald-900">
                {regCount} / {maxSlots} <span className="text-xs font-bold">Slots Filled</span>
              </p>
            </div>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1.5 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gray-700">Registration Fill Rate</span>
            <span className="text-emerald-700">{pctFilled}% Capacity</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${pctFilled}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Registered Volunteers Roster Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Registered Employee Roster</h3>
          <span className="text-xs text-gray-500 font-semibold">{registrations.length} Registrations Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-500 uppercase">
                <th className="p-4">Volunteer Name</th>
                <th className="p-4">Corporate Email</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Registration Date</th>
                <th className="p-4 text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {registrations.map((vol) => {
                const volUser = vol.volunteerId || vol;
                const name = volUser.name || vol.name || 'Volunteer';
                const email = volUser.email || vol.email || 'employee@company.com';
                const status = vol.attendanceStatus || vol.status || 'registered';

                return (
                  <tr key={vol._id || vol.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{name}</td>
                    <td className="p-4 text-gray-600">{email}</td>
                    <td className="p-4 text-gray-600">{vol.phone || '+91 98765 43210'}</td>
                    <td className="p-4 text-gray-400">{vol.registeredAt || '2026-08-12'}</td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize border ${
                          status === 'attended'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </SpocLayout>
  );
};

export default SpocVolunteersPage;
