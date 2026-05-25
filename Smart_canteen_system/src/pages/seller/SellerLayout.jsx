import React, { useState } from "react";
import SellerSide from "../../components/SellerSide";
import SellerDashboard from "./SellerDashboard";
import SellerMenu from "./SellerMenu";
import SellerInventory from "./SellerInventory";
import SellerOrders from "./SellerOrders";
import SellerReports from "./SellerReports";
import SellerSettings from "./SellerSettings";

const SellerLayout = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <SellerSide activeNav={activeNav} setActiveNav={(nav) => { setActiveNav(nav); setSidebarOpen(false); }} sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className="flex-1 lg:ml-56 pt-14 lg:pt-0">
        <button onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-10 w-9 h-9 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center text-gray-700 text-xl">
          &#9776;
        </button>
        {activeNav === "Dashboard" && <SellerDashboard />}
        {activeNav === "Menu" && <SellerMenu />}
        {activeNav === "Inventory" && <SellerInventory />}
        {activeNav === "Orders" && <SellerOrders />}
        {activeNav === "Reports" && <SellerReports />}
        {activeNav === "Settings" && <SellerSettings />}
      </main>
    </div>
  );
};

export default SellerLayout;
