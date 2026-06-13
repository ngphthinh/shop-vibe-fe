import axiosClient from "../../../services/api/axiosClient";
import { API_ENDPOINTS } from "../../../services/api/endpoints";
import type { ApiResponse, PaginationResponse } from "../../../types/api.type";
import { getErrorMessage } from "../../../utils/constants";
import type { User } from "../types/user.type";

export const userService = {
  getProfile: async (): Promise<User> => {
    try {
      const res = await axiosClient.get<ApiResponse<User>>(
        API_ENDPOINTS.PROFILE,
      );
      const data = res.data;
      if (data.code !== 7000) {
        throw new Error(data.message || "Lỗi khi tải thông tin người dùng");
      }
      return data.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Lỗi khi tải thông tin người dùng"),
      );
    }
  },
  updateProfile: async (request: {
    fullName: string;
    phone: string;
  }): Promise<User> => {
    try {
      const res = await axiosClient.put<ApiResponse<User>>(
        API_ENDPOINTS.PROFILE,
        request,
      );
      const data = res.data;
      if (data.code !== 7001) {
        throw new Error(
          data.message || "Lỗi khi cập nhật thông tin người dùng",
        );
      }
      return data.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Lỗi khi cập nhật thông tin người dùng"),
      );
    }
  },

  getUsers: async (
    page: number,
    size: number,
  ): Promise<PaginationResponse<User>> => {
    try {
      const res = await axiosClient.get<ApiResponse<PaginationResponse<User>>>(
        API_ENDPOINTS.ADMIN_USERS,
        {
          params: { page, size },
        },
      );
      const data = res.data;
      if (data.code !== 7002) {
        throw new Error(data.message || "Lỗi khi tải danh sách người dùng");
      }

      return data.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Lỗi khi tải danh sách người dùng"),
      );
    }
  },

  toggleActive: async (id: number, isLock: boolean): Promise<void> => {
    try {
      if (isLock) {
        const res = await axiosClient.put<ApiResponse<null>>(
          API_ENDPOINTS.ADMIN_USERS_LOCK(id),
        );
        const data = res.data;
        if (data.code !== 7003) {
          throw new Error(data.message || "Lỗi khi khóa người dùng");
        }
      } else {
        const res = await axiosClient.put<ApiResponse<null>>(
          API_ENDPOINTS.ADMIN_USERS_UNLOCK(id),
        );
        const data = res.data;
        if (data.code !== 7004) {
          throw new Error(data.message || "Lỗi khi mở khóa người dùng");
        }
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi khóa người dùng"));
    }
  },
};
