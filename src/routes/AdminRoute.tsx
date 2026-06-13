import MainLayout from "../layouts/MainLayout";
import { AdminRoute } from "../components/common/AdminRoute";
import DashboardPage from "../page/admin/DashboardPage";
import type { RouteObject } from "react-router-dom";
import ProductManagerPage from "../page/admin/ProductManagerPage";
import UserManagerPage from "../page/admin/UserManagerPage";
import OrderManagerPage from "../page/admin/OrderManagerPage";
import AdminOrderDetailPage from "../page/admin/AdminOrderDetailPage";

export const adminRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        element: <AdminRoute />, // Tuyến phòng thủ lớp 2 (Yêu cầu quyền Admin)
        children: [
          { path: "/admin", element: <DashboardPage /> },
          { path: "/admin/products", element: <ProductManagerPage /> },
          { path: "/admin/users", element: <UserManagerPage /> },
          { path: "/admin/orders", element: <OrderManagerPage /> },
          { path: "/admin/orders/:id", element: <AdminOrderDetailPage /> },
        ],
      },
    ],
  },
];
