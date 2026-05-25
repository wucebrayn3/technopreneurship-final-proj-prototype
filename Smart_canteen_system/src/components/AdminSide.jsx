import React from "react";
import { useNavigate } from "react-router-dom";
import bitehublogo from "../assets/BiteHub.png";
import { logout, getUser } from "../api";

const navItems = [
  { label: "Dashboard", icon: "\u{1F4CA}" },
  { label: "Accounts", icon: "\u{1F465}" },
  { label: "Verifications", icon: "\u2705" },
  { label: "Reports", icon: "\u{1F6A9}" },
  { label: "Settings", icon: "\u{2699}\u{FE0F}" },
];

const AdminSide = ({ activeNav, setActiveNav, pendingCount = 0, sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const user = getUser();

  const handleSignOut = () => { logout(); navigate("/"); };

  return (
    <>
      <aside className={`w-56 bg-white border-r border-gray-100 flex flex-col py-6 px-4 gap-2 fixed h-full z-30 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <img src={bitehublogo} alt="BiteHub Logo" className="w-16 h-16 rounded-full" />
            <span className="text-xl font-bold text-gray-800">BiteHub</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="px-2 mb-4 text-xs text-gray-400 truncate">{user?.username || "Admin"}</div>
        {navItems.map((item) => (
          <button key={item.label} onClick={() => setActiveNav(item.label)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors w-full text-left ${activeNav === item.label ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            <span>{item.icon}</span>
            {item.label}
            {item.label === "Verifications" && pendingCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{pendingCount}</span>
            )}
          </button>
        ))}
        <div className="mt-auto px-2">
          <button onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors bg-red-50 text-red-600 hover:bg-red-100">
            <span className="text-lg">{'\u21A9'}</span>Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSide;
