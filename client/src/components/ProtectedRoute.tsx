import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Adjust the path as necessary

const ProtectedRoute = () => {
  const { authenticated } = useAuth();
  return authenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
