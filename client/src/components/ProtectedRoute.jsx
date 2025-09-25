import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated === null) return null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;