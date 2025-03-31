// AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import UserTable from "../components/UserTable";
import EditUserModal from "../components/EditUserModal";
import FullScreenLoader from "../components/FullScreenLoader";


const USERS_API_URL = process.env.REACT_APP_USERS_API_URL; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedData, setEditedData] = useState({ name: "", email: "", password: "", role: "" });
  const [filterRole, setFilterRole] = useState("");
  const [loading, setLoading] = useState(false);


  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const username = storedUser?.email || "Admin";

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    },500);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(USERS_API_URL);
      setUsers(data);
    } catch (error) {
      toast.error("⚠️ Failed to load users.");
    }
  };

  const handleLogout = () => {
    setLoading(true);
    localStorage.clear();
    toast.success("Logged out successfully!");
    setTimeout(() =>{
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", role: "client" },
    validationSchema: Yup.object({
      name: Yup.string().min(3).max(20).required("Name is required"),
      email: Yup.string().email().required("Email is required"),
      password: Yup.string().min(6).required("Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const { data } = await axios.get(USERS_API_URL);
        const newUserId = data.length ? String(Math.max(...data.map(user => +user.id)) + 1) : "1";
        //const newUserId = data.length ? String(Math.max(...data.map(user => +user.id)) + 1) : "1";

        await axios.post(USERS_API_URL, { ...values, id: newUserId });
        toast.success("User added successfully!");
        fetchUsers();
        resetForm();
      } catch {
        toast.error("⚠️ Failed to add user.");
      }
    },
  });

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditedData(user);
  };

  const handleUpdateUser = async () => {
    await axios.put(`${USERS_API_URL}/${editingUser.id}`, editedData);
    toast.success("User updated successfully!");
    fetchUsers();
    setEditingUser(null);
  };

       
  // ✅ Select All Checkboxes
    const handleSelectAll = () => {
      if (selectedUsers.length === users.length) {
        setSelectedUsers([]);
      } else {
        setSelectedUsers(users.map(user => user.id));
      }
    };
  
       // ✅ Checkbox Selection
      const handleCheckboxChange = (id) => {
          setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
          );
        };
  
      // ✅ Delete a Single User
      const handleDeleteUser = async (id) => {
        setLoading(true); 
          try {
           // await axios.delete(http://localhost:5000/loggedInUsers/${id});
           await axios.delete(`${USERS_API_URL}/${id}`);
           toast.success("User removed successfully!");
           setTimeout(() => {
            setLoading(false);
          },300);
            fetchUsers();
          } catch (error) {
            toast.error("⚠️ Failed to delete user.");
            console.error("Delete User Error:", error);
          }
        };
  
       // ✅ Delete Selected Users
      const handleDeleteSelected = async () => {
      if (selectedUsers.length === 0) {
        toast.warning("No users selected for deletion.");
        return;
      }
      try {
        await Promise.all(selectedUsers.map(id=> axios.delete(`${USERS_API_URL}/${id}`)));
        toast.success("Selected users deleted successfully!");
        fetchUsers();
        setSelectedUsers([]);
      } catch (error) {
        toast.error("⚠️ Failed to delete selected users.");
        console.error("Delete Selected Users Error:", error);
      }
    };

    // ✅ Filter Users by Role
    useEffect(() => {
      setLoading(true);
    
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 500);
    
      return () => clearTimeout(timeout);
    }, [filterRole]);

    const filteredUsers = users.filter(user => {
      if (filterRole === "admin") {
        return user.role === "admin";
      } else if (filterRole === "client") {
        return user.role === "client";
      } else if (filterRole === "customer") {
        return user.role === "customer";
      } else {
        return true; 
      }
    });
    
     //const filteredUsers = users.filter(user=>(filterRole ? user.role === filterRole : true))
  
  return (
    <React.Fragment>
      {loading && <FullScreenLoader/>}
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Welcome, {username}!</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <form onSubmit={formik.handleSubmit} className="mb-3">
        <input type="text" placeholder="Name" {...formik.getFieldProps("name")} className="form-control mb-2" />
        <input type="email" placeholder="Email" {...formik.getFieldProps("email")} className="form-control mb-2" />
        <input type="password" placeholder="Password" {...formik.getFieldProps("password")} className="form-control mb-2" />

         <select className="form-select mb-2" value={editedData.role} 
            onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
              <option value="customer">Customer</option>
         </select>

        <button type="submit" className="btn btn-primary">Add User</button>
      </form>
      <UserTable users={filteredUsers} selectedUsers={selectedUsers} handleEditClick={handleEditClick}
       handleDeleteUser={handleDeleteUser} setFilterRole={setFilterRole}
       handleDeleteSelected={handleDeleteSelected} handleCheckboxChange={handleCheckboxChange} 
       handleSelectAll={handleSelectAll} />
      <EditUserModal editingUser={editingUser} editedData={editedData} setEditedData={setEditedData} 
      handleUpdateUser={handleUpdateUser} setEditingUser={setEditingUser} />

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
    </React.Fragment>
  );
};

export default AdminDashboard;
