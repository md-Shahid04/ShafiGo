import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to respective authorized dashboard
    if (user.role === 'ROLE_ADMIN') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'ROLE_DRIVER') {
      return <Navigate to="/driver" replace />;
    } else {
      return <Navigate to="/rider" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
