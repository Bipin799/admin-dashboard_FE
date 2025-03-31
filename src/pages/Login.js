import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
   // console.log("loggedInUser",loggedInUser);
    if (loggedInUser?.role) { 
      switch (loggedInUser.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "client":
          navigate("/client-dashboard");
          break;
        case "customer":
          navigate("/customer-dashboard");
          break;
        default:
          break;
      }
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      toast.error("⚠️ Email and password cannot be empty!");
      return;
    }
    axios
      // for local host
      //.get("http://localhost:5000/loggedInUsers")
      // for the backend
      .get("http://localhost:5000/users")
      .then((response) => {
        const users = response.data || [];

        if (users.length === 0) {
          setError("No user found. Please register first.");
          toast.error("No user found. Please register first.");
          return;
        }

        // Check if user exists
        const matchedUser = users.find(
          (user) => user.email === email && user.password === password
        );

        if (!matchedUser) {
          setError("Invalid email or password. Please try again.");
          toast.error("❌ Incorrect email or password!");
          return;
        }

        // ✅ Store user data in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
        localStorage.setItem("role", matchedUser.role); // Store role separately

        // ✅ Log after saving to confirm
        console.log(
          "Logged-in User Saved:",
          JSON.parse(localStorage.getItem("loggedInUser"))
        );
        // ✅ Successful login
        toast.success("🎉 Login Successful!");

        setTimeout(() => {
          // ✅ Navigate based on role
          switch (matchedUser.role) {
            case "admin":
              navigate("/admin-dashboard");
              break;
            case "client":
              navigate("/client-dashboard");
              break;
            case "customer":
              navigate("/customer-dashboard");
              break;
            default:
              navigate("/login");
          }
        }, 1000);
      })
      .catch((error) => {
        setError("Something went wrong. Please try again later.");
        toast.error("⚠️ Error fetching users. Please try again later.");
        console.error("Login Error:", error);
      });
  };
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <p className="login-heading">Login</p>

        <div>
          <p className="login-field">Email</p>
          <input
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="login-field">Password</p>
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} />
    </div>
  );
};
export default Login;
