import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, userType }) {
  const isAuthenticated = () => {
    if (userType === 'student') {
      return sessionStorage.getItem('student_id') !== null;
    } else if (userType === 'guardian') {
      return sessionStorage.getItem('guardian_id') !== null;
    }
    return false;
  };

  const getRedirectPath = () => {
    return userType === 'student' ? '/student-login' : '/guardian-login';
  };

  if (!isAuthenticated()) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  return children;
}

export default ProtectedRoute;