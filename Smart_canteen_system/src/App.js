import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import PartnerPage from "./components/PartnerPage";
import CustomerLayout from "./pages/customer/CustomerLayout";
import SellerLayout from "./pages/seller/SellerLayout";
import AdminLayout from "./pages/admin/AdminLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/customer" element={<CustomerLayout />} />
        <Route path="/seller" element={<SellerLayout />} />
        <Route path="/admin" element={<AdminLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
