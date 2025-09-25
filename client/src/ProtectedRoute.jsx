import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, userType }) {
  const isAuthenticated = () => {
    if (userType === 'student') {
      return sessionStorage.getItem('student_id') !== null;
    } else if (userType === 'guardian') {
      return sessionStorage.getItem('guardian_id') !== null;
    } else if (userType === 'teacher') {
      return sessionStorage.getItem('teacher_id') !== null;
    } else if (userType === 'classteacher') {
      return sessionStorage.getItem('classteacher_id') !== null;
    }
    return false;
  };

  const getRedirectPath = () => {
    if (userType === 'student') return '/student-login';
    if (userType === 'guardian') return '/guardian-login';
    if (userType === 'teacher') return '/teacher-login';
    if (userType === 'classteacher') return '/classteacher-login';
    return '/';
  };

  if (!isAuthenticated()) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  return children;
}

export default ProtectedRoute;