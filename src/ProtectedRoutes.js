// components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ProductContext } from './context/FoodContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { email, userRole } = useContext(ProductContext);

  if (userRole !== 'admin') {
    return <Navigate to="/Login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/Unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
