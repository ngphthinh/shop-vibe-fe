import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import HomePage from "../page/public/HomePage";
import LoginPage from "../page/auth/LoginPage";
import RegisterPage from "../page/auth/RegisterPage";
import type { RouteObject } from "react-router-dom";
import ProductDetailPage from "../features/products/components/ProductDetailPage";

export const publicRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "products/:id/:slug", element: <ProductDetailPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
];
