import React, { useState } from "react";
import CustomerSide from "../../components/CustomerSide";
import CustomerHome from "./CustomerHome";
import CustomerMenu from "./CustomerMenu";
import CustomerHistory from "./CustomerHistory";
import CustomerReport from "./CustomerReport";

const CustomerLayout = () => {
  const [activeNav, setActiveNav] = useState("Home");
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <CustomerSide activeNav={activeNav} setActiveNav={setActiveNav} cartCount={cartCount} />
      <main className="ml-56 flex-1">
        {activeNav === "Home" && <CustomerHome setActiveNav={setActiveNav} />}
        {activeNav === "Menu" && <CustomerMenu setCartCount={setCartCount} />}
        {activeNav === "History" && <CustomerHistory />}
        {activeNav === "Report" && <CustomerReport />}
      </main>
    </div>
  );
};

export default CustomerLayout;