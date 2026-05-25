import React, { useState, useEffect } from "react";
import { getAdminDashboard, getUser } from "../../api";

const AdminDashboard = ({ setActiveNav }) => {
  const user = getUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const d = await getAdminDashboard();
      setData(d);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="px-10 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-500">Welcome back,</p>
          <h1 className="text-3xl font-bold text-gray-900">{user?.username || "Admin"}</h1>
          <span className="inline-block mt-1 text-xs font-medium bg-orange-50 text-orange-600 px-2.5 py-0.5 rounded-full capitalize">{user?.role || "admin"}</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : !data ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
          <div className="text-5xl">{'\u{1F4CA}'}</div>
          <h2 className="text-2xl font-bold text-gray-900">No data yet!</h2>
          <p className="text-gray-400 text-sm max-w-xs">Data will appear here once users start registering and placing orders.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Customers", value: data.total_customers.toString(), icon: "\u{1F464}" },
              { label: "Total Sellers", value: data.total_sellers.toString(), icon: "\u{1F3EA}" },
              { label: "Pending Verifications", value: data.pending_verifications.toString(), icon: "\u23F3" },
              { label: "Open Reports", value: data.open_reports.toString(), icon: "\u{1F6A9}" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Recent Accounts</h2>
                <button onClick={() => setActiveNav("Accounts")} className="text-xs text-green-600 hover:underline">View all</button>
              </div>
              <div className="flex flex-col gap-3">
                {data.recent_accounts?.map((acc) => (
                  <div key={acc.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{acc.username}</p>
                      <p className="text-xs text-gray-400">{acc.role} \u00B7 {new Date(acc.date_joined).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${acc.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"}`}>
                      {acc.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Recent Reports</h2>
                <button onClick={() => setActiveNav("Reports")} className="text-xs text-green-600 hover:underline">View all</button>
              </div>
              <div className="flex flex-col gap-3">
                {data.recent_reports?.map((r, i) => (
                  <div key={r.id || i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{r.subject}</p>
                      <p className="text-xs text-gray-400">{r.reporter__username} \u00B7 {new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.role === "Customer" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                      {r.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
