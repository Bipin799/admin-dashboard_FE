// components/UserTable.jsx
import React from "react";

const UserTable = ({filterRole, setFilterRole, users, selectedUsers, handleCheckboxChange, 
    handleSelectAll, handleEditClick, handleDeleteUser,handleDeleteSelected }) => {
  return (
    <React.Fragment>
    <div className="d-flex justify-content-between mb-2">
    <select className="form-select w-25" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
      <option value="">Select Role</option>
      <option value="admin">Admin</option>
      <option value="client">Client</option>
      <option value="customer">Customer</option>
    </select>
    <button className="btn btn-danger" onClick={handleDeleteSelected} disabled={selectedUsers.length === 0}>
      Delete Selected
    </button>
  </div>

    <table className="table table-bordered">
      <thead>
        <tr>
          <th><input type="checkbox" checked={selectedUsers.length === users.length} onChange={handleSelectAll} /></th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleCheckboxChange(user.id)} />
            </td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(user)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>Remove</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </React.Fragment>
  );
};
export default UserTable;
