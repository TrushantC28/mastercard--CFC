import { UserCheck, Mail, Shield } from 'lucide-react';

const UsersPage = () => {
  const users = [
    { name: "John Doe", email: "john.doe@example.com", role: "Volunteer", org: "KJ Somaiya College", status: "Active" },
    { name: "Priya Sharma", email: "priya.s@mastercard.com", role: "Corporate SPOC", org: "Mastercard", status: "Active" },
    { name: "Rahul Verma", email: "rahul@greenearth.ngo", role: "NGO Admin", org: "Green Earth Foundation", status: "Active" },
    { name: "Aarav Mehta", email: "aarav.m@example.com", role: "Volunteer", org: "IIT Bombay", status: "Active" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-1">User Management</h1>
        <p className="text-slate-500 font-medium">View and manage registered volunteers, corporate partners, and NGO administrators.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Organization</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {users.map((u) => (
                <tr key={u.email} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12} /> {u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                      <Shield size={12} /> {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{u.org}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <UserCheck size={12} /> {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
