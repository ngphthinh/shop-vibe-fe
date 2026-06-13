import axiosClient from "../../../services/api/axiosClient";
import { API_ENDPOINTS } from "../../../services/api/endpoints";
import publicClient from "../../../services/api/publicClient";
import type { ApiResponse, PaginationResponse } from "../../../types/api.type";
import { getErrorMessage } from "../../../utils/constants";
import type { Review, ReviewCreateRequest } from "../types/review.type";

export const reviewService = {
  getReviewsByProductId: async (
    productId: number,
    page: number,
    size: number,
  ): Promise<PaginationResponse<Review>> => {
    try {
      const response = await publicClient.get<
        ApiResponse<PaginationResponse<Review>>
      >(API_ENDPOINTS.REVIEWS(productId), {
        params: {
          page,
          size,
        },
      });
      const data = response.data;
      if (data.code !== 6000) {
        throw new Error(data.message || "Failed to load reviews");
      }
      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi tải đánh giá"));
    }
  },
  createReview: async (productId: number, reviewData: ReviewCreateRequest) => {
    try {
      const response = await axiosClient.post(
        API_ENDPOINTS.REVIEWS(productId),
        reviewData,
      );
      const data = response.data;
      if (data.code !== 6001) {
        throw new Error(data.message || "Failed to submit review");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi gửi đánh giá"));
    }
  },
  updateReview: async (reviewId: number, reviewData: ReviewCreateRequest) => {
    try {
      const response = await axiosClient.put(
        API_ENDPOINTS.REVIEW_DETAIL(reviewId),
        reviewData,
      );
      const data = response.data;
      if (data.code !== 6002) {
        throw new Error(data.message || "Failed to update review");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi cập nhật đánh giá"));
    }
  },

  deleteReview: async (reviewId: number) => {
    try {
      await axiosClient.delete(API_ENDPOINTS.REVIEW_DETAIL(reviewId));
    } catch (error) {
      throw new Error(getErrorMessage(error, "Lỗi khi xóa đánh giá"));
    }
  },
};
