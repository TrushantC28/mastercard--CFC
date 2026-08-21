import { FileText, Download, CheckCircle } from 'lucide-react';

const ReportsPage = () => {
  const reports = [
    { title: "Monthly CSR Impact Summary - August 2026", date: "Aug 15, 2026", size: "2.4 MB", type: "PDF" },
    { title: "Quarterly Volunteer Engagement Report Q2 2026", date: "Jul 01, 2026", size: "4.8 MB", type: "PDF" },
    { title: "Annual Sustainability & Tree Plantation Impact", date: "Jun 20, 2026", size: "1.9 MB", type: "PDF" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-1">Impact & CSR Reports</h1>
        <p className="text-slate-500 font-medium">Download verified audit and activity reports for CSR compliance.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
        {reports.map((report) => (
          <div key={report.title} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{report.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>Generated: {report.date}</span>
                  <span>•</span>
                  <span>{report.size}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle size={12} /> Verified
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Downloading ${report.title}...`)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
            >
              <Download size={16} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
