import axiosClient from "../../../services/api/axiosClient";
import { API_ENDPOINTS } from "../../../services/api/endpoints";
import type { ApiResponse } from "../../../types/api.type";
import { getErrorMessage } from "../../../utils/constants";
import type {
  OverviewResponse,
  RevenueResponse,
  TopCustomerResponse,
  TopProductResponse,
} from "../types/statistics.type";

export const dashboardService = {
  getOverview: async (): Promise<OverviewResponse> => {
    try {
      const response = await axiosClient.get<ApiResponse<OverviewResponse>>(
        API_ENDPOINTS.OVERVIEW,
      );

      const data = response.data;
      if (data.code !== 8003) {
        throw new Error(data.message || "Failed to fetch overview statistics");
      }
      return data.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Failed to fetch overview statistics"),
      );
    }
  },

  getRevenue: async (
    from: Date | null,
    to: Date | null,
  ): Promise<RevenueResponse> => {
    try {
      const response = await axiosClient.get<ApiResponse<RevenueResponse>>(
        API_ENDPOINTS.REVENUE,
        {
          params: {
            from: from
              ? from.toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            to: to
              ? to.toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
          },
        },
      );
      const data = response.data;
      if (data.code !== 8000) {
        throw new Error(data.message || "Failed to fetch revenue statistics");
      }
      return data.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Failed to fetch revenue statistics"),
      );
    }
  },

  getTopProducts: async (limit: number): Promise<TopProductResponse> => {
    try {
      const response = await axiosClient.get<ApiResponse<TopProductResponse>>(
        API_ENDPOINTS.TOP_PRODUCTS,
        {
          params: { limit },
        },
      );
      const data = response.data;
      if (data.code !== 8001) {
        throw new Error(data.message || "Failed to fetch top products");
      }
      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch top products"));
    }
  },
  getTopCustomers: async (limit: number): Promise<TopCustomerResponse> => {
    try {
      const response = await axiosClient.get<ApiResponse<TopCustomerResponse>>(
        API_ENDPOINTS.TOP_CUSTOMERS,
        {
          params: { limit },
        },
      );
      const data = response.data;
      if (data.code !== 8002) {
        throw new Error(data.message || "Failed to fetch top customers");
      }
      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to fetch top customers"));
    }
  },
};
