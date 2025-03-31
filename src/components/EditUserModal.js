// components/EditUserModal.jsx
import React from "react";

const EditUserModal = ({ editingUser, editedData, setEditedData, handleUpdateUser, setEditingUser }) => {
  if (!editingUser) return null;

  return (
    <div className="modal show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button type="button" className="btn-close" onClick={() => setEditingUser(null)}></button>
          </div>
          <div className="modal-body">
            <label>Name:</label>
            <input type="text" className="form-control mb-2" value={editedData.name} 
              onChange={(e) => setEditedData({ ...editedData, name: e.target.value })} />

            <label>Email:</label>
            <input type="email" className="form-control mb-2" value={editedData.email} 
              onChange={(e) => setEditedData({ ...editedData, email: e.target.value })} />

            <label>Password:</label>
            <input type="text" className="form-control mb-2" value={editedData.password} 
              onChange={(e) => setEditedData({ ...editedData, password: e.target.value })} />

            <label>Role:</label>
            <select className="form-select mb-2" value={editedData.role} 
              onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>Close</button>
            <button className="btn btn-primary" onClick={handleUpdateUser}>Update</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
