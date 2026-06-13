import axiosClient from "../../../services/api/axiosClient";
import { API_ENDPOINTS } from "../../../services/api/endpoints";
import type { ApiResponse, PaginationResponse } from "../../../types/api.type";
import { getErrorMessage } from "../../../utils/constants";
import type {
  CreateOrderRequest,
  Order,
  OrderDetail,
  OrderStatus,
  OrderSummary,
} from "../types/order.type";

export const orderService = {
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    try {
      const response = await axiosClient.post<ApiResponse<Order>>(
        API_ENDPOINTS.ORDERS,
        request,
      );
      const data = response.data;
      if (data.code !== 5000) {
        throw new Error(data.message || "Failed to create order");
      }
      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to create order"));
    }
  },

  getOrderById: async (orderId: number): Promise<OrderDetail> => {
    try {
      const response = await axiosClient.get<ApiResponse<OrderDetail>>(
        API_ENDPOINTS.ORDER_DETAIL(orderId),
      );
      const data = response.data;
      if (data.code !== 5002) {
        throw new Error(data.message || "Failed to fetch order details");
      }
      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch order details"));
    }
  },

  getUserOrders: async (
    size: number,
    page: number,
    status: OrderStatus | null,
    from: Date | null,
    to: Date | null,
  ): Promise<PaginationResponse<OrderSummary>> => {
    try {
      const response = await axiosClient.get<
        ApiResponse<PaginationResponse<OrderSummary>>
      >(API_ENDPOINTS.ORDERS, {
        params: {
          size,
          page,
          status,
          from: from
            ? from.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          to: to
            ? to.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        },
      });
      const data = response.data;
      if (data.code !== 5001) {
        throw new Error(data.message || "Failed to fetch orders");
      }
      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch orders"));
    }
  },
  cancelOrder: async (orderId: number, body: { reason: string }) => {
    try {
      const response = await axiosClient.put(
        API_ENDPOINTS.CANCEL_ORDER(orderId),
        body,
      );

      const data = response.data;
      if (data.code !== 5003) {
        throw new Error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to cancel order"));
    }
  },
  getAdminOrders: async (
    size: number,
    page: number,
    status: OrderStatus | null,
    search: string | null,
    from: Date | null,
    to: Date | null,
  ): Promise<PaginationResponse<OrderSummary>> => {
    try {
      const keyword = search ? search.trim() : "";

      const response = await axiosClient.get<
        ApiResponse<PaginationResponse<OrderSummary>>
      >(API_ENDPOINTS.ADMIN_ORDERS, {
        params: {
          size,
          page,
          status,
          keyword,
          from: from
            ? from.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          to: to
            ? to.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        },
      });
      const data = response.data;
      if (data.code !== 5001) {
        throw new Error(data.message || "Failed to fetch orders");
      }
      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch orders"));
    }
  },
  updateOrderStatus: async (orderId: number, newStatus: OrderStatus) => {
    try {
      const response = await axiosClient.put(
        API_ENDPOINTS.UPDATE_ORDER_STATUS(orderId),
        { newStatus },
      );
      const data = response.data;
      if (data.code !== 5004) {
        throw new Error(data.message || "Failed to update order status");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to update order status"));
    }
  }, 
  getAdminOrderDetail: async (orderId: number): Promise<OrderDetail> => {
    try {
      const response = await axiosClient.get<ApiResponse<OrderDetail>>(
        API_ENDPOINTS.ADMIN_ORDER_DETAIL(orderId),
      );
      const data = response.data;
      if (data.code !== 5002) {
        throw new Error(data.message || "Failed to fetch order details");
      }
      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch order details"));
    }
  },
};
