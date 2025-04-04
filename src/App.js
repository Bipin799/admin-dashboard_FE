import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./router/ProtectedRoute";
import NotFound from "./pages/NotFound";
import ProductDetails from "./pages/ProductDetails";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/Signup";
const App = () => {
  //console.log("Product API:", process.env.REACT_APP_PRODUCT_API_URL);
  // console.log("Users API:", process.env.REACT_APP_USERS_API_URL);

  return (
    <React.Fragment>
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />

        {/* ✅ Protected Routes with Outlet */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
          <Route path="/client-dashboard" element={<ClientDashboard />} /> ✅ No nested routes
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>

        {/* ✅ Default Route */}
        <Route path="/" element={<Login />} />

        {/* ✅ 404 Route */}
        <Route path="*" element={<NotFound /> }/>

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Signup />} />

      </Routes>
    </Router>

   

</React.Fragment>

  );
};

export default App;
