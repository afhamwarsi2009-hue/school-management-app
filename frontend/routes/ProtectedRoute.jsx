import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function dashboardForRole(role) {
  if (role === 'admin') return '/admin';
  if (role === 'student') return '/student';
  return '/login/student';
}

export function ProtectedRoute({ roles = [], loginRole = 'student' }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={`/login/${loginRole}`} replace state={{ from: location }} />;
  }

  if (roles.length && !roles.includes(user?.role)) {
    return <Navigate to={dashboardForRole(user?.role)} replace />;
  }

  return <Outlet />;
}
