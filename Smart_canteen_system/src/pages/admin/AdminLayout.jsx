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
      <AdminSide activeNav={activeNav === "MenuReview" ? "Verifications" : activeNav} setActiveNav={(nav) => { setActiveNav(nav); if (nav !== "MenuReview") setReviewSellerId(null); }} pendingCount={pendingCount} />
      <main className="ml-56 flex-1">
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
