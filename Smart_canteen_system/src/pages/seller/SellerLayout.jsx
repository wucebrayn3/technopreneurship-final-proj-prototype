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

  return (
    <div className="min-h-screen flex bg-gray-50">
      <SellerSide activeNav={activeNav} setActiveNav={setActiveNav} />
      <main className="ml-56 flex-1">
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