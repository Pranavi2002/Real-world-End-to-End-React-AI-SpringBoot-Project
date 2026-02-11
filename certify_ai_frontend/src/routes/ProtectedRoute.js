import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const { token, user, loading } = useAuth();

  // ⏳ Wait for auth to initialize
  if (loading) {
    return null; // or <Spinner />
  }

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Role-based restriction (ONLY if requiredRole is provided)
  if (
    requiredRole &&
    user?.role?.toLowerCase() !== requiredRole.toLowerCase()
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;