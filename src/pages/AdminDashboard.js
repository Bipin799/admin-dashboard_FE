import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Container } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import AdminAppBar from "../components/AdminAppBar";
import UsersSection from "../components/UsersSection";
import FullScreenLoader from "../components/FullScreenLoader";
import AddEditProduct from "../components/AddEditProduct";
import DashboardSection from "../components/DashboardSection";
import SettingsSection from "../components/SettingsSection";

const USERS_API_URL = process.env.REACT_APP_USERS_API_URL;

const TOAST_CONFIG = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState("dashboard"); // Default to users section
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const username = storedUser.name || "Admin";

  const handleLogout = () => {
    setLoading(true);
    localStorage.clear();
    toast.success("Logged out successfully!");
    setTimeout(() => navigate("/login"), 1000);
  };

  const renderSection = () => {
    switch (currentSection) {
      case "users":
        return <UsersSection USERS_API_URL={USERS_API_URL} TOAST_CONFIG={TOAST_CONFIG} />;
      case "dashboard":
       // return <div>Dashboard Content</div>;
       return <DashboardSection />;
      case "settings":
        //return <div>Settings Content</div>;
        return <SettingsSection />;
      case "products":
        return <AddEditProduct />;
        default:
          return currentSection;
      // default:
      //   return <UsersSection USERS_API_URL={USERS_API_URL} TOAST_CONFIG={TOAST_CONFIG} />;
    }
  };

  return (
    <div className="admin-dashboard">
      {loading && <FullScreenLoader />}
      
      <AdminAppBar 
        username={username} 
        onLogout={handleLogout}
        onSectionChange={setCurrentSection}
      />
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {renderSection()}
        <ToastContainer {...TOAST_CONFIG} />
      </Container>
    </div>
  );
};

export default AdminDashboard;