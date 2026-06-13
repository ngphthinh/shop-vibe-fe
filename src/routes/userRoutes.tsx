import type { RouteObject } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ProtectedRoute } from "../components/common/ProductedRouter";
import ProfilePage from "../page/user/ProfilePage";
import { CartPage } from "../page/user/CardPage";
import OrderPage from "../page/user/OrderPage";
import { OrderDetailPage } from "../features/orders/components/OrderDetailPage";

export const userRoutes: RouteObject[] = [
  {
    element: <MainLayout />, // Vẫn nằm trong layout chính
    children: [
      {
        element: <ProtectedRoute />, // Tuyến phòng thủ lớp 1 (Yêu cầu Login)
        children: [
          { path: "/profile", element: <ProfilePage /> },
          { path: "/cart", element: <CartPage /> },
          { path: "/orders", element: <OrderPage /> },
          { path: "/orders/:id/:orderCode", element: <OrderDetailPage /> },
        ],
      },
    ],
  },
];
