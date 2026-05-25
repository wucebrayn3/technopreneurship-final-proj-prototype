import React, { useState, useEffect } from "react";
import { getAdminReports, resolveReport } from "../../api";

const statusStyle = { Open: "bg-red-50 text-red-500", Resolved: "bg-green-50 text-green-700" };

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => { setReports(await getAdminReports()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const toggleResolve = async (id, currentStatus) => {
    const newStatus = currentStatus === "Open" ? "Resolved" : "Open";
    await resolveReport(id, newStatus);
    load();
  };

  const filtered = filterStatus === "All" ? reports : reports.filter((r) => r.status === filterStatus);

  return (
    <div className="px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-red-500 mt-1">{'\u{1F6A9}'} {reports.filter((r) => r.status === "Open").length} open report(s)</p>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        {["All", "Open", "Resolved"].map((status) => (
          <button key={status} onClick={() => setFilterStatus(status)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === status ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
            {status}
            <span className="ml-1.5 text-xs">({reports.filter((r) => status === "All" ? true : r.status === status).length})</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-5xl">{'\u{1F6A9}'}</div>
            <h2 className="text-xl font-bold text-gray-900">No {filterStatus.toLowerCase()} reports</h2>
          </div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-gray-900">{r.subject}</p>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[r.status]}`}>{r.status}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.role === "Customer" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                      {r.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{r.reporter_name} \u00B7 {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    {expanded === r.id ? "Hide" : "View"}
                  </button>
                  <button onClick={() => toggleResolve(r.id, r.status)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${r.status === "Open" ? "border-green-100 text-green-600 hover:bg-green-50" : "border-red-100 text-red-400 hover:bg-red-50"}`}>
                    {r.status === "Open" ? "Mark Resolved" : "Reopen"}
                  </button>
                </div>
              </div>
              {expanded === r.id && (
                <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600">{r.description}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReports;
