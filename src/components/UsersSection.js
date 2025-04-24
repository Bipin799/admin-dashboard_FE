// components/UsersSection.js
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import UserTable from "./UserTable";
import EditUserModal from "./EditUserModal";
//import FullScreenLoader from "./FullScreenLoader";
import UserForm from "./UserForm";
import FullScreenLoader from "./FullScreenLoader";

//const USERS_API_URL = process.env.REACT_APP_USERS_API_URL;

const UsersSection = ({ USERS_API_URL, TOAST_CONFIG }) => {
    
  const [state, setState] = useState({
    users: [],
    selectedUsers: [],
    editingUser: null,
    filterRole: "",
    loading: false,
    editedData: { name: "", email: "", password: "", role: "client" }
  });

  const { users, selectedUsers, editingUser, filterRole, loading, editedData } = state;

  const fetchUsers = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const { data } = await axios.get(USERS_API_URL);
      setState(prev => ({ ...prev, users: data, loading: false }));
    } catch (error) {
      toast.error("⚠️ Failed to load users. Please try again later.");
      setState(prev => ({ ...prev, loading: false }));
      console.error("Fetch Users Error:", error);
    }
  }, [USERS_API_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Formik configuration
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", role: "client" },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .max(20, "Name cannot exceed 20 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const { data: existingUsers } = await axios.get(USERS_API_URL);
        
        if (existingUsers.some(user => user.email === values.email)) {
          toast.error("User with this email already exists");
          setState(prev => ({ ...prev, loading: false }));
          return;
        }

        const newUserId = existingUsers.length 
          ? String(Math.max(...existingUsers.map(user => +user.id)) + 1) 
          : "1";

        await axios.post(USERS_API_URL, { ...values, id: newUserId });
        toast.success("User added successfully!");
        resetForm();
        await fetchUsers();
      } catch (error) {
        toast.error("⚠️ Failed to add user. Please try again.");
        console.error("Add User Error:", error);
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    },
  });

  // User management handlers
  const handleEditClick = (user) => {
    setState(prev => ({
      ...prev,
      editingUser: user,
      editedData: { ...user, password: "" }
    }));
  };

  const handleUpdateUser = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await axios.put(`${USERS_API_URL}/${editingUser.id}`, editedData);
      toast.success("User updated successfully!");
      await fetchUsers();
      setState(prev => ({ ...prev, editingUser: null }));
    } catch (error) {
      toast.error("⚠️ Failed to update user. Please try again.");
      console.error("Update User Error:", error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSelectAll = () => {
    setState(prev => ({
      ...prev,
      selectedUsers: selectedUsers.length === users.length ? [] : users.map(user => user.id)
    }));
  };

  const handleCheckboxChange = (id) => {
    setState(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(id)
        ? prev.selectedUsers.filter(selectedId => selectedId !== id)
        : [...prev.selectedUsers, id]
    }));
  };

  const handleDeleteUser = async (id) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await axios.delete(`${USERS_API_URL}/${id}`);
      toast.success("User removed successfully!");
      await fetchUsers();
    } catch (error) {
      toast.error("⚠️ Failed to delete user. Please try again.");
      console.error("Delete User Error:", error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      toast.warning("No users selected for deletion.");
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true }));
      await Promise.all(
        selectedUsers.map(id => axios.delete(`${USERS_API_URL}/${id}`))
      );
      toast.success(`${selectedUsers.length} users deleted successfully!`);
      await fetchUsers();
      setState(prev => ({ ...prev, selectedUsers: [] }));
    } catch (error) {
      toast.error("⚠️ Failed to delete selected users. Please try again.");
      console.error("Delete Selected Users Error:", error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const filteredUsers = filterRole 
    ? users.filter(user => user.role === filterRole)
    : users;

  
  const handleExportToExcel = () => {
      if (users.length === 0) {
        toast.warning("No data available to export.");
        return;
      }
    
      const formattedUsers = users.map(({ id, name, email, role }) => ({
        ID: id,
        Name: name,
        Email: email,
        Role: role,
      }));
    
      const worksheet = XLSX.utils.json_to_sheet(formattedUsers);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
      
      saveAs(data, "UsersData.xlsx");
    };    

  return (
    <div className="users-section">
      {loading}
      
      <UserForm 
        formik={formik}
        isLoading={loading}
      />
      
      <button className="btn btn-success mb-3" onClick={handleExportToExcel}>
        📥 Export to Excel
      </button>

      <UserTable
        users={filteredUsers}
        selectedUsers={selectedUsers}
        filterRole={filterRole}
        setFilterRole={(role) => setState(prev => ({ ...prev, filterRole: role }))}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteUser}
        onSelectAll={handleSelectAll}
        onCheckboxChange={handleCheckboxChange}
        onDeleteSelected={handleDeleteSelected}
      />

      <EditUserModal
        isOpen={!!editingUser}
        userData={editedData}
        onClose={() => setState(prev => ({ ...prev, editingUser: null }))}
        onChange={(data) => setState(prev => ({ ...prev, editedData: data }))}
        onSave={handleUpdateUser}
        isLoading={loading}
      />
    </div>
  );
};

export default UsersSection;