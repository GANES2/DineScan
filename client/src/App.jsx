import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import ShowcasePage from './pages/ShowcasePage';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import PaymentPage from './pages/customer/PaymentPage';
import StatusPage from './pages/customer/StatusPage';
import TableRedirect from './components/TableRedirect';

// Staff Pages
import CashierDashboard from './pages/staff/CashierDashboard';
import KitchenDashboard from './pages/staff/KitchenDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* LANDING / PORTFOLIO SHOWCASE */}
        <Route path="/" element={<ShowcasePage />} />

        {/* CUSTOMER FLOW */}
        <Route path="/table/:tableCode" element={<TableRedirect />} />
        <Route path="/table/:tableCode/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/status/:orderId" element={<StatusPage />} />

        {/* STAFF & ADMIN FLOW */}
        <Route path="/cashier" element={<CashierDashboard />} />
        <Route path="/kitchen" element={<KitchenDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
