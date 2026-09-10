import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect waiting users to approval page
  if (!currentUser?.role_type) {
    return <Navigate to="/waiting-approval" replace />;
  }

  return <Outlet />;
}
