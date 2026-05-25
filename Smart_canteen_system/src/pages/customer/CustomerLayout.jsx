import React, { useState } from "react";
import CustomerSide from "../../components/CustomerSide";
import CustomerHome from "./CustomerHome";
import CustomerMenu from "./CustomerMenu";
import CustomerHistory from "./CustomerHistory";
import CustomerReport from "./CustomerReport";

const CustomerLayout = () => {
  const [activeNav, setActiveNav] = useState("Home");
  const [cartCount, setCartCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <CustomerSide activeNav={activeNav} setActiveNav={(nav) => { setActiveNav(nav); setSidebarOpen(false); }} cartCount={cartCount} sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className="flex-1 lg:ml-56 pt-14 lg:pt-0">
        <button onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-10 w-9 h-9 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center text-gray-700 text-xl">
          &#9776;
        </button>
        {activeNav === "Home" && <CustomerHome setActiveNav={setActiveNav} />}
        {activeNav === "Menu" && <CustomerMenu setCartCount={setCartCount} />}
        {activeNav === "History" && <CustomerHistory />}
        {activeNav === "Report" && <CustomerReport />}
      </main>
    </div>
  );
};

export default CustomerLayout;
