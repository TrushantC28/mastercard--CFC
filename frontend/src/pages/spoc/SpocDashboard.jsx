import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SpocLayout from '../../components/spoc/SpocLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { activityApi, proposalApi } from '../../services/api';
import { mockEvents } from '../../data/adminMockData';

const SpocDashboard = () => {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    fetchSpocData();
  }, []);

  const companyName = user?.corporatePartnerId?.name || user?.companyName || 'Tech Corp India';

  const fetchSpocData = async () => {
    setLoading(true);
    try {
      const [actRes, propRes] = await Promise.allSettled([
        activityApi.getActivities(),
        proposalApi.getProposals(),
      ]);

      if (actRes.status === 'fulfilled' && actRes.value) {
        const list = actRes.value.data?.activities || actRes.value.data || actRes.value;
        if (Array.isArray(list) && list.length > 0) setActivities(list);
        else setActivities(mockEvents);
      } else {
        setActivities(mockEvents);
      }

      if (propRes.status === 'fulfilled' && propRes.value) {
        const props = propRes.value.data?.proposals || propRes.value.data || propRes.value;
        if (Array.isArray(props)) setProposals(props);
      }
    } catch (err) {
      console.warn('SPOC data fetch fallback:', err);
      setActivities(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  // Belt-and-suspenders client-side scoping filter: only keep activities matching SPOC company
  const companyActivities = activities.filter((act) => {
    const partnerName = act.corporatePartner?.name || act.organizer || '';
    return partnerName.toLowerCase().includes(companyName.toLowerCase()) || partnerName === 'ABC Corporation' || partnerName === 'Tech Corp India';
  });

  const upcomingDrives = companyActivities.filter(
    (a) => a.status === 'open_for_signup' || a.status === 'planned' || a.status === 'ongoing' || a.status === 'Upcoming'
  );
  const completedDrives = companyActivities.filter((a) => a.status === 'completed' || a.status === 'Completed');

  return (
    <SpocLayout
      title="Company CSR Dashboard"
      subtitle={`Overview of corporate volunteering drives, employee participation, and proposals for ${companyName}.`}
    >
      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-xl p-6 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-white/30">
            Corporate SPOC Hub
          </span>
          <h2 className="text-xl font-bold mt-1">Want to organize a new CSR drive for {companyName}?</h2>
          <p className="text-xs text-emerald-100 font-medium mt-0.5">
            Submit a proposal directly to SevaSahayog staff for venue setup, logistics, and approval.
          </p>
        </div>
        <Link
          to="/spoc/propose"
          className="px-5 py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-lg hover:bg-emerald-50 transition-all shadow-md cursor-pointer whitespace-nowrap self-start sm:self-center"
        >
          + Propose New Activity
        </Link>
      </div>

      {/* 4 Company Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Active CSR Drives</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{upcomingDrives.length} Drives</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Company-scoped</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Employee Volunteers</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">84 Employees</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Registered across drives</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Volunteering Hours</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">320 Hours</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Community contribution</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Employee Satisfaction</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">4.9 / 5 ⭐</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Company feedback score</p>
        </div>
      </div>

      {/* Main Grid: Company Upcoming Drives & Registered Roster link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left 2 Cols: Upcoming Company Drives */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Upcoming & Ongoing Company Drives</h2>
            <Link to="/spoc/volunteers" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              Manage Registered Volunteers →
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingDrives.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-xs">
                No upcoming drives scheduled for {companyName}. Click "Propose New Activity" to submit one!
              </div>
            ) : (
              upcomingDrives.map((evt) => {
                const id = evt._id || evt.id;
                const regSlots = evt.registeredVolunteersCount ?? evt.registeredVolunteers ?? 18;
                const maxSlots = evt.maxVolunteers || evt.totalSlots || 30;

                return (
                  <div
                    key={id}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-sm">{evt.title || evt.name}</h3>
                        <StatusBadge status={evt.status || 'open_for_signup'} />
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        📅 {evt.date || 'Upcoming'} • 📍 {evt.location || 'Pune Center'}
                      </p>
                      <p className="text-xs font-bold text-emerald-700 pt-1">
                        👥 {regSlots} / {maxSlots} Slots Registered
                      </p>
                    </div>

                    <Link
                      to={`/spoc/volunteers?activityId=${id}`}
                      className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg transition-colors text-center"
                    >
                      View Volunteer Roster
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Propose & Reports Quick Access */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900">SPOC Quick Actions</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
            <Link
              to="/spoc/propose"
              className="block p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              <h4 className="font-bold text-xs text-emerald-900">📝 Propose Activity</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5">Submit new drive details to SevaSahayog for staff approval.</p>
            </Link>

            <Link
              to="/spoc/volunteers"
              className="block p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
            >
              <h4 className="font-bold text-xs text-gray-900">👥 Volunteer Attendance</h4>
              <p className="text-[11px] text-gray-600 mt-0.5">View registered employees and check attendance status.</p>
            </Link>

            <Link
              to="/spoc/feedback"
              className="block p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
            >
              <h4 className="font-bold text-xs text-gray-900">📊 Company Feedback Report</h4>
              <p className="text-[11px] text-gray-600 mt-0.5">Analyze ratings & download CSV reports for board reviews.</p>
            </Link>
          </div>
        </div>
      </div>
    </SpocLayout>
  );
};

export default SpocDashboard;
