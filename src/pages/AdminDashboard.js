// // AdminDashboard.js
// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "react-toastify/dist/ReactToastify.css";

// // Components
// import UserTable from "../components/UserTable";
// import EditUserModal from "../components/EditUserModal";
// import FullScreenLoader from "../components/FullScreenLoader";
// import UserForm from "../components/UserForm";

// // Constants
// const USERS_API_URL = process.env.REACT_APP_USERS_API_URL;
// const TOAST_CONFIG = {
//   position: "top-center",
//   autoClose: 2000,
//   hideProgressBar: false,
//   closeOnClick: true,
//   pauseOnHover: true,
//   draggable: true,
// };

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [state, setState] = useState({
//     users: [],
//     selectedUsers: [],
//     editingUser: null,
//     filterRole: "",
//     loading: false,
//     editedData: { name: "", email: "", password: "", role: "client" }
//   });

//   const { users, selectedUsers, editingUser, filterRole, loading, editedData } = state;
//   const storedUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
//   const username = storedUser.name || "Admin";

//   // Memoized fetch function
//   const fetchUsers = useCallback(async () => {
//     try {
//       setState(prev => ({ ...prev, loading: true }));
//       const { data } = await axios.get(USERS_API_URL);
//       setState(prev => ({ ...prev, users: data, loading: false }));
//     } catch (error) {
//       toast.error("⚠️ Failed to load users. Please try again later.");
//       setState(prev => ({ ...prev, loading: false }));
//       console.error("Fetch Users Error:", error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   const handleLogout = () => {
//     setState(prev => ({ ...prev, loading: true }));
//     localStorage.clear();
//     toast.success("Logged out successfully!");
//     setTimeout(() => navigate("/login"), 1000);
//   };

//   // Formik configuration
//   const formik = useFormik({
//     initialValues: { name: "", email: "", password: "", role: "client" },
//     validationSchema: Yup.object({
//       name: Yup.string()
//         .min(3, "Name must be at least 3 characters")
//         .max(20, "Name cannot exceed 20 characters")
//         .required("Name is required"),
//       email: Yup.string()
//         .email("Invalid email format")
//         .required("Email is required"),
//       password: Yup.string()
//         .min(6, "Password must be at least 6 characters")
//         .required("Password is required"),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         setState(prev => ({ ...prev, loading: true }));
//         const { data: existingUsers } = await axios.get(USERS_API_URL);
        
//         // Check if email already exists
//         if (existingUsers.some(user => user.email === values.email)) {
//           toast.error("User with this email already exists");
//           setState(prev => ({ ...prev, loading: false }));
//           return;
//         }

//         const newUserId = existingUsers.length 
//           ? String(Math.max(...existingUsers.map(user => +user.id)) + 1) 
//           : "1";

//         await axios.post(USERS_API_URL, { ...values, id: newUserId });
//         toast.success("User added successfully!");
//         resetForm();
//         await fetchUsers();
//       } catch (error) {
//         toast.error("⚠️ Failed to add user. Please try again.");
//         console.error("Add User Error:", error);
//       } finally {
//         setState(prev => ({ ...prev, loading: false }));
//       }
//     },
//   });

//   // User management handlers
//   const handleEditClick = (user) => {
//     console.log("Edit clicked for user:", user); // Add thi
//     setState(prev => ({
//       ...prev,
//       editingUser: user,
//       editedData: { ...user, password: "" } // Never show actual password
//     }));
//   };

//   const handleUpdateUser = async () => {
//     try {
//       setState(prev => ({ ...prev, loading: true }));
//       await axios.put(`${USERS_API_URL}/${editingUser.id}`, editedData);
//       toast.success("User updated successfully!");
//       await fetchUsers();
//       setState(prev => ({ ...prev, editingUser: null }));
//     } catch (error) {
//       toast.error("⚠️ Failed to update user. Please try again.");
//       console.error("Update User Error:", error);
//     } finally {
//       setState(prev => ({ ...prev, loading: false }));
//     }
//   };

//   const handleSelectAll = () => {
//     setState(prev => ({
//       ...prev,
//       selectedUsers: selectedUsers.length === users.length ? [] : users.map(user => user.id)
//     }));
//   };

//   const handleCheckboxChange = (id) => {
//     setState(prev => ({
//       ...prev,
//       selectedUsers: prev.selectedUsers.includes(id)
//         ? prev.selectedUsers.filter(selectedId => selectedId !== id)
//         : [...prev.selectedUsers, id]
//     }));
//   };

//   const handleDeleteUser = async (id) => {
//     try {
//       setState(prev => ({ ...prev, loading: true }));
//       await axios.delete(`${USERS_API_URL}/${id}`);
//       toast.success("User removed successfully!");
//       await fetchUsers();
//     } catch (error) {
//       toast.error("⚠️ Failed to delete user. Please try again.");
//       console.error("Delete User Error:", error);
//     } finally {
//       setState(prev => ({ ...prev, loading: false }));
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedUsers.length === 0) {
//       toast.warning("No users selected for deletion.");
//       return;
//     }

//     try {
//       setState(prev => ({ ...prev, loading: true }));
//       await Promise.all(
//         selectedUsers.map(id => axios.delete(`${USERS_API_URL}/${id}`))
//       );
//       toast.success(`${selectedUsers.length} users deleted successfully!`);
//       await fetchUsers();
//       setState(prev => ({ ...prev, selectedUsers: [] }));
//     } catch (error) {
//       toast.error("⚠️ Failed to delete selected users. Please try again.");
//       console.error("Delete Selected Users Error:", error);
//     } finally {
//       setState(prev => ({ ...prev, loading: false }));
//     }
//   };

//   // Filter users by role
//   const filteredUsers = filterRole 
//     ? users.filter(user => user.role === filterRole)
//     : users;

//   return (
//     <div className="admin-dashboard">
//       {loading && <FullScreenLoader />}
      
//       <div className="container mt-4">
//         <header className="d-flex justify-content-between align-items-center mb-4">
//         <h1 className="display-5 fw-bold text-center">
//             Welcome, <span className="text-primary">{username}</span>
//         </h1>
//           <button 
//             className="btn btn-danger"
//             onClick={handleLogout}
//             disabled={loading}
//           >
//             Logout
//           </button>
//         </header>

//         <UserForm 
//           onSubmit={formik.handleSubmit}
//           initialValues={formik.initialValues}
//           validationSchema={formik.validationSchema}
//           isLoading={loading}
//         />

//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h2 className="h4">User Management</h2>
//         </div>

//         <UserTable
//           users={filteredUsers}
//           selectedUsers={selectedUsers}
//           filterRole={filterRole}
//           setFilterRole={(role) => setState(prev => ({ ...prev, filterRole: role }))}
//           onEditClick={handleEditClick}
//           onDeleteClick={handleDeleteUser}
//           onSelectAll={handleSelectAll}
//           onCheckboxChange={handleCheckboxChange}
//           onDeleteSelected={handleDeleteSelected}
//         />

//         <EditUserModal
//           isOpen={!!editingUser}  // Should be true when editingUser exists
//           userData={editedData}
//           onClose={() => setState(prev => ({ ...prev, editingUser: null }))}
//           onChange={(data) => setState(prev => ({ ...prev, editedData: data }))}
//           onSave={handleUpdateUser}
//           isLoading={loading}
//         />

//         <ToastContainer {...TOAST_CONFIG} />
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// AdminDashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Container } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Components
import AdminAppBar from "../components/AdminAppBar";
import UsersSection from "../components/UsersSection";
import FullScreenLoader from "../components/FullScreenLoader";
import AddEditProduct from "../components/AddEditProduct";

// Constants
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
        return <div>Dashboard Content</div>;
      case "settings":
        return <div>Settings Content</div>;
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