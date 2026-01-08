<<<<<<< HEAD
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
=======
import React from 'react'
import { Navigate } from 'react-router-dom';

function ProtectedRoute({children}) {
  const isAuthenticated = () => !!localStorage.getItem("token"); //boolean value is returned

  return isAuthenticated() ? children : <Navigate to="/signin" replace/>
}

export default ProtectedRoute
>>>>>>> 56ff55ab4453c3ba2de8a4ad51ad40bdba011632
