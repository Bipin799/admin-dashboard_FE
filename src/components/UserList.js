import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser, updateUser, deleteUser } from "../redux/slices/userSlice";
import { nanoid } from "@reduxjs/toolkit";

const UserList = () => {
  const dispatch = useDispatch();
  const { users,status, error } = useSelector((state) => state.users);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());   
      
  }, [dispatch]);
  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      dispatch(addUser({ ...newUser, id: nanoid() }));
      setNewUser({ name: "", email: "" });
    }
  };
  const handleUpdateUser = () => {
    if (editUser) {
      dispatch(updateUser(editUser)); // Dispatch correct user object
      setEditUser(null);
    }
  };
  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id)); // Dispatch correct ID
  };
  return (
    <div>
      <h2>User List</h2>
      <input
        type="text"
        placeholder="Name"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <button onClick={handleAddUser}>Add User</button>

      {status === "loading" && <p>Loading users...</p>}
      {status === "failed" && <p style={{ color: "red" }}>Error: {error}</p>}

      {editUser && (
        <>
          <input
            type="text"
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <input
            type="email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          />
          <button onClick={handleUpdateUser}>Update</button>
        </>
      )}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => setEditUser(user)}>Edit</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
