import axiosClient from "../../../services/api/axiosClient";
import { API_ENDPOINTS } from "../../../services/api/endpoints";
import type { ApiResponse } from "../../../types/api.type";
import { getErrorMessage } from "../../../utils/constants";
import type { AddToCartRequest, Cart } from "../types/cart.type";

export const cartService = {
  getCart: async (): Promise<Cart> => {
    try {
      const res = await axiosClient.get<ApiResponse<Cart>>(API_ENDPOINTS.CART);

      const data = res.data;

      if (data.code !== 4000) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi tải giỏ hàng"));
    }
  },
  updateQuantity: async (itemId: number, quantity: number): Promise<void> => {
    await axiosClient.put(`${API_ENDPOINTS.CART_ITEMS}/${itemId}`, {
      quantity,
    });
  },

  removeItem: async (itemId: number): Promise<void> => {
    await axiosClient.delete(`${API_ENDPOINTS.CART_ITEMS}/${itemId}`);
  },

  clearCart: async (): Promise<void> => {
    await axiosClient.delete(API_ENDPOINTS.CART_CLEAR);
  },
  addToCart: async (request: AddToCartRequest) => {
    try {
      const res = await axiosClient.post<ApiResponse<void>>(
        API_ENDPOINTS.CART_ITEMS,
        request,
      );
      const data = res.data;
      if (data.code !== 4000) {
        throw new Error(data.message || "Lỗi khi thêm sản phẩm vào giỏ hàng");
      }
      return data.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Lỗi khi thêm sản phẩm vào giỏ hàng"),
      );
    }
  },
};
