import React from "react";

const EditUserModal = ({ 
  isOpen, 
  userData, 
  onClose, 
  onChange, 
  onSave, 
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <div className="modal-body">
            <label>Name:</label>
            <input 
              type="text" 
              className="form-control mb-2" 
              value={userData.name} 
              onChange={(e) => onChange({ ...userData, name: e.target.value })} 
            />

            <label>Email:</label>
            <input 
              type="email" 
              className="form-control mb-2" 
              value={userData.email} 
              onChange={(e) => onChange({ ...userData, email: e.target.value })} 
            />

            <label>Password:</label>
            <input 
              type="password" 
              className="form-control mb-2" 
              value={userData.password} 
              onChange={(e) => onChange({ ...userData, password: e.target.value })}
              placeholder="please enter new password"
            />

            <label>Role:</label>
            <select 
              className="form-select mb-2" 
              value={userData.role} 
              onChange={(e) => onChange({ ...userData, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="client">Client</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <div className="modal-footer">
            <button 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isLoading}
            >
              Close
            </button>
            <button 
              className="btn btn-primary" 
              onClick={onSave}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;