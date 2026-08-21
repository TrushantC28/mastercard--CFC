import { useOutletContext, Link } from "react-router-dom";
import {
  volunteerStats,
  upcomingActivities,
  recentFeedback,
} from "../data/mockData";

const StatCard = ({ label, value, type }) => {
  const styles = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      value: "text-[#173b59]",
    },
    green: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      value: "text-emerald-700",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      value: "text-purple-700",
    },
    yellow: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      value: "text-amber-700",
    },
  };

  const style = styles[type] || styles.blue;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            {label}
          </p>

          <p className={`text-3xl font-extrabold ${style.value}`}>
            {value}
          </p>
        </div>

        <div
          className={`w-11 h-11 rounded-xl ${style.bg} flex items-center justify-center`}
        >
          {type === "blue" && <span className={`text-xl ${style.icon}`}>▣</span>}
          {type === "green" && <span className={`text-xl ${style.icon}`}>◷</span>}
          {type === "purple" && <span className={`text-xl ${style.icon}`}>♛</span>}
          {type === "yellow" && <span className={`text-xl ${style.icon}`}>★</span>}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Registered: "bg-amber-100 text-amber-800",
    Completed: "bg-slate-100 text-slate-700",
    Open: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || "bg-slate-100 text-slate-700"
        }`}
    >
      {status}
    </span>
  );
};

const DashboardPage = () => {
  const { user } = useOutletContext();
  const role = user?.role ? user.role.toLowerCase() : "volunteer";

  if (role === "admin") {
    return (
      <div className="w-full font-sans pb-10">
        <section className="w-full rounded-3xl bg-gradient-to-r from-[#173b59] to-[#245c7a] text-white px-6 sm:px-8 lg:px-10 py-8 shadow-md mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-blue-100 mb-2">
                Administrator / NGO Portal
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Welcome, <span className="text-amber-400">{user?.name || "Admin"}</span>
              </h1>
              <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-2xl">
                Manage activities, review volunteer proposals, view impact analytics, and manage portal users.
              </p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center justify-center bg-amber-400 hover:bg-amber-300 text-[#173b59] font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              Manage Activities →
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/events" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <span className="text-3xl mb-3 block">📅</span>
            <h3 className="text-xl font-bold text-slate-800">Activities</h3>
            <p className="text-sm text-slate-500 mt-1">Create and manage events</p>
          </Link>
          <Link to="/insights" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <span className="text-3xl mb-3 block">📊</span>
            <h3 className="text-xl font-bold text-slate-800">Insights</h3>
            <p className="text-sm text-slate-500 mt-1">View participation analytics</p>
          </Link>
          <Link to="/reports" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <span className="text-3xl mb-3 block">📑</span>
            <h3 className="text-xl font-bold text-slate-800">Reports</h3>
            <p className="text-sm text-slate-500 mt-1">Generate impact summaries</p>
          </Link>
          <Link to="/users" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <span className="text-3xl mb-3 block">👥</span>
            <h3 className="text-xl font-bold text-slate-800">Users</h3>
            <p className="text-sm text-slate-500 mt-1">Manage volunteers and SPOCs</p>
          </Link>
        </section>
      </div>
    );
  }

  if (role === "spoc" || role === "corporate") {
    return (
      <div className="w-full font-sans pb-10">
        <section className="w-full rounded-3xl bg-gradient-to-r from-[#173b59] to-[#245c7a] text-white px-6 sm:px-8 lg:px-10 py-8 shadow-md mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-blue-100 mb-2">
                Corporate SPOC Portal
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Welcome, <span className="text-amber-400">{user?.name || "Corporate Partner"}</span>
              </h1>
              <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-2xl">
                Track your organization's CSR volunteering drives, employee participation, and impact reports.
              </p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center justify-center bg-amber-400 hover:bg-amber-300 text-[#173b59] font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              Browse Events →
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Link to="/events" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <span className="text-3xl mb-3 block">📅</span>
            <h3 className="text-xl font-bold text-slate-800">CSR Activities</h3>
            <p className="text-sm text-slate-500 mt-1">View active volunteering drives</p>
          </Link>
          <Link to="/feedback" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <span className="text-3xl mb-3 block">💬</span>
            <h3 className="text-xl font-bold text-slate-800">Feedback</h3>
            <p className="text-sm text-slate-500 mt-1">Review volunteer feedback</p>
          </Link>
          <Link to="/reports" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <span className="text-3xl mb-3 block">📊</span>
            <h3 className="text-xl font-bold text-slate-800">Impact Reports</h3>
            <p className="text-sm text-slate-500 mt-1">Download CSR reports</p>
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full font-sans pb-10">

      {/* ================= HERO ================= */}
      <section className="w-full rounded-3xl bg-gradient-to-r from-[#173b59] to-[#245c7a] text-white px-6 sm:px-8 lg:px-10 py-7 shadow-md mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>
            <p className="text-sm font-semibold text-blue-100 mb-2">
              Volunteer Dashboard
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back,{" "}
              <span className="text-amber-400">
                {user.name}
              </span>
              !
            </h1>

            <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-2xl">
              Track your volunteering journey, discover upcoming activities,
              and see the impact you're making in the community.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center justify-center bg-amber-400 hover:bg-amber-300 text-[#173b59] font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            Explore Activities →
          </Link>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

        <StatCard
          label="Activities Joined"
          value={volunteerStats.activitiesJoined}
          type="blue"
        />

        <StatCard
          label="Feedback Submitted"
          value={volunteerStats.feedbackSubmitted}
          type="yellow"
        />

        <StatCard
          label="Volunteer Hours"
          value={volunteerStats.volunteerHours}
          type="green"
        />

        <StatCard
          label="Impact Points"
          value={volunteerStats.impactPoints}
          type="purple"
        />

      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-6">

        {/* ================= ACTIVITIES ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Upcoming Activities
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Activities you have joined or can register for
              </p>
            </div>

            <Link
              to="/events"
              className="text-sm font-bold text-blue-600 hover:text-blue-800"
            >
              View all →
            </Link>

          </div>

          <div className="divide-y divide-slate-100">

            {upcomingActivities.map((activity) => (

              <div
                key={activity.id}
                className="px-6 py-5 hover:bg-slate-50 transition-colors"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  {/* Activity information */}
                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-3 mb-2">

                      <h3 className="text-lg font-extrabold text-slate-900 truncate">
                        {activity.title}
                      </h3>

                      <StatusBadge status={activity.status} />

                    </div>

                    <p className="text-sm font-semibold text-[#1a4760] mb-3">
                      {activity.ngo}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-slate-500">

                      <span>
                        📅 {activity.date}
                      </span>

                      <span>
                        🕐 {activity.time}
                      </span>

                      <span>
                        📍 {activity.location}
                      </span>

                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0">

                    <Link
                      to={`/events/${activity.id}`}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-700 hover:border-[#173b59] hover:text-[#173b59] transition-colors"
                    >
                      View Details
                    </Link>

                    {activity.status === "Open" && (
                      <button
                        className="px-5 py-2 rounded-lg bg-[#173b59] text-white text-sm font-bold hover:bg-[#102d44] transition-colors"
                      >
                        Register
                      </button>
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="space-y-6">

          {/* Feedback CTA */}
          <div className="bg-amber-400 rounded-2xl p-6 shadow-sm">

            <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center mb-4">
              <span className="text-xl">★</span>
            </div>

            <h2 className="text-xl font-extrabold text-amber-950">
              Your Voice Creates Impact
            </h2>

            <p className="text-sm text-amber-900 mt-2 leading-relaxed">
              Share your experience and help us improve every volunteering
              activity.
            </p>

            <Link
              to="/feedback/new"
              className="mt-5 block text-center bg-[#173b59] hover:bg-[#102d44] text-white font-bold py-3 rounded-xl transition-colors"
            >
              Share Feedback
            </Link>

          </div>

          {/* Recent Feedback */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Recent Feedback
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Your latest submissions
                </p>
              </div>

              <Link
                to="/feedback"
                className="text-sm font-bold text-blue-600 hover:text-blue-800"
              >
                View all →
              </Link>

            </div>

            <div className="divide-y divide-slate-100">

              {recentFeedback.map((item) => (

                <div
                  key={item.id}
                  className="px-6 py-4 hover:bg-slate-50 transition-colors"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        {item.eventName}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1">
                        {item.date}
                      </p>

                    </div>

                    <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                      {item.status}
                    </span>

                  </div>

                  <div className="mt-3 flex items-center gap-3">

                    <span className="text-amber-500 font-bold tracking-wider">
                      {"★".repeat(item.rating)}
                      <span className="text-slate-200">
                        {"★".repeat(5 - item.rating)}
                      </span>
                    </span>

                    <span className="text-xs font-bold text-slate-500">
                      {item.rating}/5
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Impact reminder */}
          <div className="bg-[#173b59] rounded-2xl p-6 text-white">

            <p className="text-xs uppercase tracking-widest text-blue-200 font-bold">
              Keep making an impact
            </p>

            <h3 className="text-xl font-extrabold mt-2">
              Every hour counts.
            </h3>

            <p className="text-sm text-blue-100 mt-2 leading-relaxed">
              Your time, feedback and participation help create meaningful
              change in the community.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
};

export default DashboardPage;