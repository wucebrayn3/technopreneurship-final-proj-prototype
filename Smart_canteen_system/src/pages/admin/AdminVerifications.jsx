import React, { useState, useEffect } from "react";
import { getVerifications, handleVerification } from "../../api";

const statusStyle = {
  Pending: "bg-yellow-50 text-yellow-700",
  Approved: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-500",
};

const AdminVerifications = ({ onReviewMenu }) => {
  const [verifications, setVerifications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => { setVerifications(await getVerifications()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleAction = async (id, action) => {
    await handleVerification(id, action);
    load();
  };

  const filtered = filterStatus === "All" ? verifications : verifications.filter((v) => v.status === filterStatus);
  const pendingCount = verifications.filter((v) => v.status === "Pending").length;

  return (
    <div className="px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verifications</h1>
          {pendingCount > 0 && <p className="text-sm text-yellow-600 mt-1">{'\u23F3'} {pendingCount} pending seller registration(s)</p>}
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        {["All", "Pending", "Approved", "Rejected"].map((status) => (
          <button key={status} onClick={() => setFilterStatus(status)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === status ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
            {status}
            <span className="ml-1.5 text-xs">({verifications.filter((v) => status === "All" ? true : v.status === status).length})</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-5xl">{'\u2705'}</div>
            <h2 className="text-xl font-bold text-gray-900">No {filterStatus.toLowerCase()} verifications</h2>
          </div>
        ) : (
          filtered.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 flex items-center justify-between">
                <div
                  className="flex flex-col gap-1 cursor-pointer flex-1"
                  onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
                >
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-gray-900">{v.seller_name}</p>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[v.status]}`}>{v.status}</span>
                  </div>
                  <p className="text-xs text-gray-500">{v.seller_email} \u00B7 {v.school}</p>
                  <p className="text-xs text-gray-400">Submitted: {new Date(v.submitted_at).toLocaleDateString()}</p>
                </div>
                {v.status === "Pending" && (
                  <div className="flex items-center gap-2">
                    {v.menu_items.length > 0 && (
                      <button onClick={() => onReviewMenu(v.seller)}
                        className="border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors">Review Menu</button>
                    )}
                    <button onClick={() => handleAction(v.id, "Approved")}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">Approve</button>
                    <button onClick={() => handleAction(v.id, "Rejected")}
                      className="border border-red-100 text-red-400 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors">Reject</button>
                  </div>
                )}
              </div>
              {expandedId === v.id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Menu Items ({v.menu_items.length})</p>
                  {v.menu_items.length === 0 ? (
                    <p className="text-xs text-gray-400">No menu items created yet.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {v.menu_items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.description || "No description"}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 capitalize">{item.category}</span>
                            <span className="text-sm font-semibold text-green-600">\u20B1{parseFloat(item.price).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminVerifications;
