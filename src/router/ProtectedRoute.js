
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(loggedInUser.role)) {
    return <Navigate to="/unauthorized" />; // Redirect unauthorized users
  }

  return <Outlet />;
};

export default ProtectedRoute;
