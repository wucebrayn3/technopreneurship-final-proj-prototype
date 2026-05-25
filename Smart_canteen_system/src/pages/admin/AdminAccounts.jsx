import React, { useState, useEffect } from "react";
import { getAdminAccounts, toggleAccount } from "../../api";

const statusStyle = { true: "bg-green-50 text-green-700", false: "bg-red-50 text-red-500" };

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [filterRole, setFilterRole] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => { setAccounts(await getAdminAccounts()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleToggle = async (id) => {
    await toggleAccount(id);
    load();
  };

  const filtered = accounts.filter((acc) => {
    const matchesRole = filterRole === "All" || acc.role === filterRole.toLowerCase();
    const matchesSearch = acc.username.toLowerCase().includes(search.toLowerCase()) || acc.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="px-10 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Accounts</h1>
      <div className="flex items-center gap-4 mb-6">
        <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 w-72" />
        <div className="flex gap-2">
          {["All", "Customer", "Seller", "Admin"].map((role) => (
            <button key={role} onClick={() => setFilterRole(role)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterRole === role ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>{role}</button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="text-5xl">{'\u{1F465}'}</div>
            <h2 className="text-xl font-bold text-gray-900">No accounts found</h2>
            <p className="text-gray-400 text-sm">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Username</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Email</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Role</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((acc) => (
                <tr key={acc.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4"><p className="text-sm font-semibold text-gray-900">{acc.username}</p></td>
                  <td className="px-6 py-4"><p className="text-sm text-gray-500">{acc.email}</p></td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${acc.role === "seller" ? "bg-purple-50 text-purple-600" : acc.role === "admin" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"}`}>
                      {acc.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[acc.is_active]}`}>
                      {acc.is_active ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggle(acc.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${acc.is_active ? "border-red-100 text-red-400 hover:bg-red-50" : "border-green-100 text-green-600 hover:bg-green-50"}`}>
                      {acc.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminAccounts;
