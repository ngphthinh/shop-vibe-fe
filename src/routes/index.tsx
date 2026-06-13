import { useRoutes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { userRoutes } from "./userRoutes";
import { publicRoutes } from "./publicRoutes";
import { adminRoutes } from "./AdminRoute";
import NotFound from "../page/public/NotFound";

export const AppRoutes = () => {
  const routes: RouteObject[] = [
    ...publicRoutes,
    ...userRoutes,
    ...adminRoutes,

    {
      path: "*", // Bắt tất cả các đường dẫn lạ không khai báo ở trên
      element: <NotFound />,
    },
  ];

  return useRoutes(routes);
};
