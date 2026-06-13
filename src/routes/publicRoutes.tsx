import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import HomePage from "../page/public/HomePage";
import LoginPage from "../page/auth/LoginPage";
import RegisterPage from "../page/auth/RegisterPage";
import type { RouteObject } from "react-router-dom";
import ProductDetailPage from "../features/products/components/ProductDetailPage";
import FaqPage from "../page/public/FaqPage";
import ShippingPage from "../page/public/ShippingPage";
import ReturnsPage from "../page/public/ReturnsPage";
import PrivacyPolicyPage from "../page/public/PrivacyPolicyPage";

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
      { path: "/faq", element: <FaqPage /> },
{ path: "/shipping", element: <ShippingPage /> },
{ path: "/returns", element: <ReturnsPage /> },
{ path: "/privacy-policy", element: <PrivacyPolicyPage /> },


    ],
  },
];