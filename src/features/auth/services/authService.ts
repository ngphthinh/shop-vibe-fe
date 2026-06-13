/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../../../services/api/axiosClient";
import { API_ENDPOINTS } from "../../../services/api/endpoints";
import publicClient from "../../../services/api/publicClient";
import type { ApiResponse } from "../../../types/api.type";
import { getErrorMessage } from "../../../utils/constants";
import type {
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth.slice";

export const authService = {
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await publicClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.LOGIN,
        request,
      );

      const data = response.data;

      if (data.code !== 1001) {
        const errorMessage = data.message || "Login failed";
        throw new Error(errorMessage);
      }
      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Login failed"));
    }
  },
  register: async (request: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const res = await publicClient.post<ApiResponse<RegisterResponse>>(
        API_ENDPOINTS.REGISTER,
        request,
      );

      const data = res.data;

      if (data.code !== 1000) {
        throw new Error(data.message || "Registration failed");
      }

      return data.data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error, "Registration failed"));
    }
  },
  refreshToken: async (
    refreshToken: RefreshTokenRequest,
  ): Promise<AuthResponse> => {
    try {
      const res = await publicClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.REFRESH_TOKEN,
        refreshToken,
      );

      const data = res.data;

      if (data.code !== 1001) {
        throw new Error(data.message || "Lỗi khi làm mới token");
      }

      return data.data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error, "Lỗi khi làm mới token"));
    }
  },

  logout: async (request: LogoutRequest) => {
    try {
      const response = await axiosClient.post<ApiResponse<void>>(
        API_ENDPOINTS.LOGOUT,
        request,
      );

      const data = response.data;

      if (data.code !== 1004) {
        throw new Error(data.message || "Logout failed");
      }
    } catch (error: any) {
      throw new Error(getErrorMessage(error, "Logout failed"));
    }
  },
  changePassword: async (request: {
    oldPassword: string;
    newPassword: string;
  }) => {
    try {
      const response = await axiosClient.put<ApiResponse<void>>(
        API_ENDPOINTS.CHANGE_PASSWORD,
        request,
      );

      const data = response.data;

      if (data.code !== 1003) {
        throw new Error(data.message || "Change password failed");
      }
    } catch (error: any) {
      throw new Error(getErrorMessage(error, "Change password failed"));
    }
  },
};
