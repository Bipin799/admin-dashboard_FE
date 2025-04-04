import React from "react";

const UserTable = ({
  filterRole,
  setFilterRole,
  users,
  selectedUsers,
  onCheckboxChange, 
  onSelectAll,
  onEditClick,
  onDeleteClick,
  onDeleteSelected 
}) => {
  return (
    <div className="table-responsive">
      <div className="d-flex justify-content-between mb-2">
        <select 
          className="form-select w-25" 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="client">Client</option>
          <option value="customer">Customer</option>
        </select>

        <div className="d-flex justify-content-between align-items-center mb-4 text-primary">
            <h2 className="h4">User Management</h2>
        </div>

        <button 
          className="btn btn-danger" 
          onClick={onDeleteSelected} 
          disabled={selectedUsers.length === 0}
        >
          Delete Selected
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={selectedUsers.length === users.length && users.length > 0}
                onChange={onSelectAll} 
              />
            </th>
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
                <input 
                  type="checkbox" 
                  checked={selectedUsers.includes(user.id)} 
                  onChange={() => onCheckboxChange(user.id)} 
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button 
                  className="btn btn-warning btn-sm me-2" 
                  onClick={() => onEditClick(user)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => onDeleteClick(user.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;