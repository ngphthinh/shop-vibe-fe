import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/store/authSlice";

export const ProtectedRoute: React.FC = () => {
  const user = useSelector(selectCurrentUser);

  // Nếu chưa đăng nhập, đá user về trang login ngay lập tức
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, cho phép đi tiếp vào các trang con bên trong
  return <Outlet />;
};
