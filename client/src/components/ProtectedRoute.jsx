import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function ProtectedRoute({ children, admin }) {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (admin && !isAdmin) return <Navigate to="/user" replace />;
  if (!admin && isAdmin) return <Navigate to="/admin" replace />;
  return children;
}
