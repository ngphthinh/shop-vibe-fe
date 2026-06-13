import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/store/authSlice";

export const AdminRoute: React.FC = () => {
  const user = useSelector(selectCurrentUser);

  if (!user || user.role !== "ROLE_ADMIN") {
    console.log("AdminRoute render, user:", user);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
