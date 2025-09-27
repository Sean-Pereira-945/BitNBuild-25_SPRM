import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../UI/LoadingSpinner';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user, getDashboardPath } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullscreen message="Preparing your dashboard" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to={getDashboardPath()} state={{ from: location, unauthorized: true }} replace />;
  }

  return children;
};

export default ProtectedRoute;
