import { API_ENDPOINTS } from "../../../services/api/endpoints";
import publicClient from "../../../services/api/publicClient";
import type { ApiResponse } from "../../../types/api.type";
import { getErrorMessage } from "../../../utils/constants";
import type { CategoryTreeData } from "../types/category.type";

export const categoryService = {
  getCategories: async (): Promise<CategoryTreeData[]> => {
    try {
      const res = await publicClient.get<ApiResponse<CategoryTreeData[]>>(
        API_ENDPOINTS.CATEGORIES,
      );

      const data = res.data;

      if (data.code !== 2000) {
        throw new Error(data.message || "Lỗi khi tải danh mục");
      }

      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi tải danh mục"));
    }
  },
};
