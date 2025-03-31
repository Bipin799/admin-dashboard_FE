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



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const AdminDashboard = () => {

//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   //const [newUser, setNewUser] = useState({ name:"",email: "", password: "", role: "client" });
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [filterRole, setFilterRole] = useState("");
//   const [editingUser, setEditingUser] = useState(null);
//   const [editedData, setEditedData] = useState({name:"", email: "",password: "", role: "" });

//   // ✅ Get logged-in user from localStorage
//   const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
//   const username = storedUser?.email || "Admin";

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // ✅ Fetch all users
//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/loggedInUsers");
//       setUsers(response.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       toast.error("⚠️ Failed to load users.");
//     }
//   };

//   // ✅ Logout Function
//   const handleLogout = () => {
//     localStorage.removeItem("loggedInUser");
//     localStorage.removeItem("role");
//     toast.success("Logged out successfully!");
//     setTimeout(() => navigate("/login"), 1000);
//   };

//      // ✅ Formik Configuration for New User( Create New User)
//    const formik = useFormik({
//     initialValues: {
//       name: "",
//       email: "",
//       password: "",
//       role: "client",
//     },
//     validationSchema: Yup.object({
//       name: Yup.string()
//         .min(3, "Name must be at least 3 characters")
//         .max(20, "Name must be 20 characters or less")
//         .required("Name is required"),
//       email: Yup.string()
//         .matches(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, "eg. abc123@gmail.com/in")
//         .email("Invalid email address")
//         .required("Email is required"),
//       password: Yup.string()
//         .min(6, "Password must be at least 6 characters")
//         .matches(/[a-z]/, "Must contain at least one lowercase letter")
//         .matches(/[A-Z]/, "Must contain at least one uppercase letter")
//         .matches(/\d/, "Must contain at least one number")
//         .matches(/[!@#$%^&*]/, "Must contain at least one special character")
//         .required("Password is required"),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const response = await axios.get("http://localhost:5000/loggedInUsers");
//         const users = response.data;

//         const lastUserId =
//           users.length > 0
//             ? Math.max(...users.map((user) => parseInt(user.id, 10) || 0))
//             : 0;
//         const newUserId = (lastUserId + 1).toString();

//         const newUserData = { ...values, id: newUserId };

//         await axios.post("http://localhost:5000/loggedInUsers", newUserData);
//         toast.success(User added successfully with ID ${newUserId}!);
//         fetchUsers();
//         resetForm();
//       } catch (error) {
//         toast.error("⚠️ Failed to add user.");
//         console.error("Add User Error:", error);
//       }
//     },
//   });

//   // ✅ Delete a Single User
//   const handleDeleteUser = async (id) => {
//     try {
//       await axios.delete(http://localhost:5000/loggedInUsers/${id});
//       toast.success("User removed successfully!");
//       fetchUsers();
//     } catch (error) {
//       toast.error("⚠️ Failed to delete user.");
//       console.error("Delete User Error:", error);
//     }
//   };

//   // ✅ Delete Selected Users
//   const handleDeleteSelected = async () => {
//     if (selectedUsers.length === 0) {
//       toast.warning("No users selected for deletion.");
//       return;
//     }

//     try {
//       await Promise.all(selectedUsers.map(id => axios.delete(http://localhost:5000/loggedInUsers/${id})));
//       toast.success("Selected users deleted successfully!");
//       fetchUsers();
//       setSelectedUsers([]);
//     } catch (error) {
//       toast.error("⚠️ Failed to delete selected users.");
//       console.error("Delete Selected Users Error:", error);
//     }
//   };

//   // ✅ Edit User (Open Modal)
//   const handleEditClick = (user) => {
//     setEditingUser(user);
//     setEditedData({name:user.name, email: user.email,password:user.password, role: user.role });
//   };

//   // ✅ Update User
//   const handleUpdateUser = async () => {
//     if (!editingUser || !editingUser.id) {
//       toast.error("⚠️ Error: No user selected for update.");
//       return;
//     }

//     try {
//       await axios.put(http://localhost:5000/loggedInUsers/${editingUser.id}, editedData);
//       toast.success("User updated successfully!");
//       fetchUsers();
//       setEditingUser(null);
//     } catch (error) {
//       toast.error("⚠️ Failed to update user.");
//       console.error("Update User Error:", error);
//     }
//   };


//   // ✅ Checkbox Selection
//   const handleCheckboxChange = (id) => {
//     setSelectedUsers(prev =>
//       prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
//     );
//   };

//   // ✅ Select All Checkboxes
//   const handleSelectAll = () => {
//     if (selectedUsers.length === users.length) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(users.map(user => user.id));
//     }
//   };

//   // ✅ Filter Users by Role
//      const filteredUsers = users.filter(user => (filterRole ? user.role === filterRole : true));
//     //const filteredUsers = users.filter(user => (user.role === filterRole));
//     //console.log("filteredUsers",filteredUsers)
//   return (
      
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center">
//         <h2>Welcome, {username}!</h2>
//         <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
//       </div>

  
//       <h3 className="mt-4">Manage Users</h3>
//          <form onSubmit={formik.handleSubmit} className="mb-3">
//            <input
//           type="text"
//           placeholder="Name"
//           className="form-control mb-2"
//           {...formik.getFieldProps("name")}
//         />
//         {formik.touched.name && formik.errors.name && (
//           <div className="text-danger">{formik.errors.name}</div>
//         )}

//         <input
//           type="email"
//           placeholder="Email"
//           className="form-control mb-2"
//           {...formik.getFieldProps("email")}
//         />
//         {formik.touched.email && formik.errors.email && (
//           <div className="text-danger">{formik.errors.email}</div>
//         )}

//         <input
//           type="password"
//           placeholder="Password"
//           className="form-control mb-2"
//           {...formik.getFieldProps("password")}
//         />
//         {formik.touched.password && formik.errors.password && (
//           <div className="text-danger">{formik.errors.password}</div>
//         )}

//         <select
//           className="form-select form-select-sm mb-2"
//           {...formik.getFieldProps("role")}
//         >
//           <option value="admin">Admin</option>
//           <option value="client">Client</option>
//           <option value="customer">Customer</option>
//         </select>

//         <button type="submit" className="btn btn-primary">
//           Add User
//         </button>
//       </form>


//       <div className="d-flex justify-content-between mb-2">
//         <select className="form-select w-25" onChange={(e) => setFilterRole(e.target.value)}>
//           <option value="">Select Role</option>
//           <option value="admin">Admin</option>
//           <option value="client">Client</option>
//           <option value="customer">Customer</option>
//         </select>
//         <button className="btn btn-danger" onClick={handleDeleteSelected} disabled={selectedUsers.length === 0}>
//           Delete Selected
//         </button>
//       </div>

//       <table className="table table-bordered">
//         <thead>
//           <tr>
//             <th><input type="checkbox" checked={selectedUsers.length === users.length} onChange={handleSelectAll} /></th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredUsers.map((user) => (
//             <tr key={user.id}>
//               <td><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleCheckboxChange(user.id)} /></td>
//               <td>{user.name}</td>
//               <td>{user.email}</td>
//               <td>{user.role}</td>
//               <td>
//                 <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(user)}>Edit</button>
//                 <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>Remove</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ✅ Edit User Modal */}
// {editingUser && (
//   <div className="modal show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
//     <div className="modal-dialog">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h5 className="modal-title">Edit User</h5>
//           <button type="button" className="btn-close" onClick={() => setEditingUser(null)}></button>
//         </div>
//         <div className="modal-body">
          
//         <label>Name:</label>
//           <input type="text" className="form-control mb-2" value={editedData.name} 
//             onChange={(e) => setEditedData({ ...editedData, name: e.target.value })} />

//           <label>Email:</label>
//           <input type="email" className="form-control mb-2" value={editedData.email} 
//             onChange={(e) => setEditedData({ ...editedData, email: e.target.value })} />

//           <label>Password:</label>
//           <input type="text" className="form-control mb-2" value={editedData.password} 
//             onChange={(e) => setEditedData({ ...editedData, password: e.target.value })} />
          
//           <label>Role:</label>
//           <select className="form-select mb-2" value={editedData.role} 
//             onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}>
//             <option value="admin">Admin</option>
//             <option value="client">Client</option>
//             <option value="customer">Customer</option>
//           </select>
//         </div>
//         <div className="modal-footer">
//           <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>Close</button>
//           <button className="btn btn-primary" onClick={handleUpdateUser}>Update</button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
//     <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} />
//     </div> 
//   );
// };
// export default AdminDashboard; 