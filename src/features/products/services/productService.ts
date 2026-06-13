import type {
  Product,
  ProductDetail,
  ProductForm,
} from "../types/product.type";
import publicClient from "../../../services/api/publicClient";
import { API_ENDPOINTS } from "../../../services/api/endpoints";
import type { ApiResponse, PaginationResponse } from "../../../types/api.type";
import { getErrorMessage } from "../../../utils/constants";
import axiosClient from "../../../services/api/axiosClient";

export const productService = {
  getProducts: async (
    page: number,
    size: number,
    sort?: string,
  ): Promise<PaginationResponse<Product>> => {
    try {
      const res = await publicClient.get<
        ApiResponse<PaginationResponse<Product>>
      >(API_ENDPOINTS.PRODUCTS, {
        params: { page, size, sort },
      });

      const data = res.data;

      if (data.code !== 3000) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi tải danh sách sản phẩm"));
    }
  },

  getProductById: async (id: number): Promise<ProductDetail> => {
    try {
      const res = await publicClient.get<ApiResponse<ProductDetail>>(
        `${API_ENDPOINTS.PRODUCTS}/${id}`,
      );

      const data = res.data;

      if (data.code !== 3001) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi tải chi tiết sản phẩm"));
    }
  },

  searchProducts: async (
    keyword: string | null,
    page: number,
    size: number,
    sort: string,
    categoryId?: string | number | null,
  ): Promise<PaginationResponse<Product>> => {
    try {
      const res = await publicClient.get<
        ApiResponse<PaginationResponse<Product>>
      >(API_ENDPOINTS.PRODUCTS_SEARCH, {
        params: {
          keyword,
          page,
          size,
          sort,
          categoryId,
        },
      });

      const data = res.data;

      if (data.code !== 3000) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi tìm kiếm sản phẩm"));
    }
  },
  createProduct: async (form: ProductForm, images: File[]) => {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.PRODUCTS, form);
      if (response.data.code !== 3002) {
        throw new Error(response.data.message);
      }

      const productId = response.data.data.id;

      const formData = new FormData();

      images.forEach((file) => {
        formData.append("images", file);
      });

      const responseImage = await axiosClient.post(
        API_ENDPOINTS.PRODUCT_IMAGE(Number(productId)),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (responseImage.data.code !== 3003) {
        throw new Error(responseImage.data.message);
      }

      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi tạo sản phẩm"));
    }
  },
  deleteProductById: async (id: number) => {
    try {
      await axiosClient.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi xóa sản phẩm"));
    }
  },

  updateProductById: async (id: number, form: ProductForm, images: File[]) => {
    try {
      // Update product details
      // delete old images if new images are provided

      const response = await axiosClient.put(
        `${API_ENDPOINTS.PRODUCTS}/${id}`,
        form,
      );
      if (response.data.code !== 3003) {
        throw new Error(response.data.message);
      }
      // Upload new images
      if (images && images.length > 0) {
        await axiosClient.delete(API_ENDPOINTS.PRODUCT_IMAGE(id));
        const formData = new FormData();
        images.forEach((file) => {
          formData.append("images", file);
        });
        const responseImage = await axiosClient.post(
          API_ENDPOINTS.PRODUCT_IMAGE(Number(id)),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (responseImage.data.code !== 3003) {
          throw new Error(responseImage.data.message);
        }
      }

      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi cập nhật sản phẩm"));
    }
  },
};
