import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const UserForm = ({ onSubmit, initialValues, validationSchema, isLoading }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form className="mb-4 p-3 border rounded">
          <h3 className="h5 mb-3">Add New User</h3>
          
          <div className="row g-2">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <Field
                  name="name"
                  type="text"
                  className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                  placeholder="Enter name"
                />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <Field
                  name="email"
                  type="email"
                  className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                  placeholder="Enter email"
                />
                <ErrorMessage name="email" component="div" className="invalid-feedback" />
              </div>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <Field
                  name="password"
                  type="password"
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  placeholder="Enter password"
                />
                <ErrorMessage name="password" component="div" className="invalid-feedback" />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Role</label>
                <Field
                  as="select"
                  name="role"
                  className="form-select"
                >
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                  <option value="customer">Customer</option>
                </Field>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : 'Add User'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

UserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.string
  }).isRequired,
  validationSchema: PropTypes.object.isRequired,
  isLoading: PropTypes.bool
};

UserForm.defaultProps = {
  initialValues: {
    name: '',
    email: '',
    password: '',
    role: 'client'
  },
  isLoading: false
};

export default UserForm;