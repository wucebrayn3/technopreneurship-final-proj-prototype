import React, { useState, useEffect } from "react";
import AdminSide from "../../components/AdminSide";
import AdminDashboard from "./AdminDashboard";
import AdminAccounts from "./AdminAccounts";
import AdminVerifications from "./AdminVerifications";
import AdminMenuReview from "./AdminMenuReview";
import AdminReports from "./AdminReports";
import AdminSettings from "./AdminSettings";
import { getAdminDashboard } from "../../api";

const AdminLayout = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [pendingCount, setPendingCount] = useState(0);
  const [reviewSellerId, setReviewSellerId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getAdminDashboard();
      if (data) setPendingCount(data.pending_verifications);
    })();
  }, [activeNav]);

  const onReviewMenu = (sellerId) => {
    setReviewSellerId(sellerId);
    setActiveNav("MenuReview");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <AdminSide activeNav={activeNav === "MenuReview" ? "Verifications" : activeNav} setActiveNav={(nav) => { setActiveNav(nav); if (nav !== "MenuReview") setReviewSellerId(null); setSidebarOpen(false); }} pendingCount={pendingCount} sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className="flex-1 lg:ml-56 pt-14 lg:pt-0">
        <button onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-10 w-9 h-9 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center text-gray-700 text-xl">
          &#9776;
        </button>
        {activeNav === "Dashboard" && <AdminDashboard setActiveNav={setActiveNav} />}
        {activeNav === "Accounts" && <AdminAccounts />}
        {activeNav === "Verifications" && <AdminVerifications onReviewMenu={onReviewMenu} />}
        {activeNav === "MenuReview" && <AdminMenuReview sellerId={reviewSellerId} onBack={() => setActiveNav("Verifications")} />}
        {activeNav === "Reports" && <AdminReports />}
        {activeNav === "Settings" && <AdminSettings />}
      </main>
    </div>
  );
};

export default AdminLayout;
