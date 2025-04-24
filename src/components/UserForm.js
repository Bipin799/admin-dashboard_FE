import React from 'react';
import PropTypes from 'prop-types';
//import FullScreenLoader from "./FullScreenLoader";

const UserForm = ({ formik, isLoading }) => {
  const { errors, touched } = formik;
  
  return (
    <form onSubmit={formik.handleSubmit} className="mb-4 p-3 border rounded">
      <h3 className="h5 mb-3">Add New User</h3>
      
      <div className="row g-2">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              name="name"
              type="text"
              className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
              placeholder="Enter name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
              placeholder="Enter email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>
      </div>

      <div className="row g-2">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
              placeholder="Enter password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={formik.values.role}
              onChange={formik.handleChange}
            >
              <option value="admin">Admin</option>
              <option value="client">Client</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isLoading}
      >
        { isLoading ?  (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Adding...
          </>
        ) : 'Add User'}
      </button>
    </form>
  );
};

UserForm.propTypes = {
  formik: PropTypes.object.isRequired,
  isLoading: PropTypes.bool
};

UserForm.defaultProps = {
  isLoading: false
};

export default UserForm;