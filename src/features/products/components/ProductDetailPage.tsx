import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ProductDetail } from "../types/product.type";
import { useFetch } from "../../../hooks/useFetch";
import { productService } from "../services/productService";
import Loading from "../../../components/common/Loading";
import { useTranslation } from "react-i18next";
import { ReviewList } from "./ReviewList";
import Pagination from "../../../components/common/Pagination";
import type { Review, ReviewCreateRequest } from "../types/review.type";
import type { PaginationResponse } from "../../../types/api.type";
import { reviewService } from "../services/reviewService";
import { Button } from "../../../components/common/Button";
import { formatPrice } from "../../../utils/constants";
import { cartService } from "../../cart/services/cartService";
import { toast } from "react-toastify";
import { WriteReview } from "./WriteReview";

const DEFAULT_REVIEW = 3;
export const ProductDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation("");

  const { id } = useParams<{ id: string }>();

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const { data: product, loading } = useFetch<ProductDetail>(() =>
    productService.getProductById(Number(id)),
  );

  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);

  const {
    data: paginateReview,
    loading: loadingReviews,
    refetch: fetchReviews,
  } = useFetch<PaginationResponse<Review>>(() =>
    reviewService.getReviewsByProductId(
      Number(id),
      currentPage,
      DEFAULT_REVIEW,
    ),
  );
  useEffect(() => {
    if (paginateReview) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPageCount(paginateReview.totalPages);
    }
  }, [paginateReview]);

  useEffect(() => {
    fetchReviews();
  }, [currentPage, fetchReviews]);

  if (!product) return <Loading />;

  if (loading || loadingReviews || !product) {
    return <Loading />;
  }
  if (loading) {
    return <Loading />;
  }
  if (!product) {
    return (
      <div className="text-center py-10 text-gray-500">{t("noProducts")}</div>
    );
  }
  const handleSubmitReview = async (data: ReviewCreateRequest) => {
    try {
      setLoadingReview(true);

      await reviewService.createReview(product.id, data);

      await fetchReviews(); // nếu có
      toast.success(t("reviews.reviewPosted"));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("reviews.submitFailed");
      toast.error(errorMessage);
    } finally {
      setLoadingReview(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setLoadingAddToCart(true);
      await cartService.addToCart({ productId: Number(id), quantity: 1 });
      toast.success(t("products.detail.addedToCart"));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("products.detail.addToCartFail");
      toast.error(errorMessage);
    } finally {
      setLoadingAddToCart(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* IMAGE SECTION */}
        <div className="space-y-3">
          <img
            src={product.primaryImageUrl}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-xl border"
          />

          <div className="grid grid-cols-4 gap-2">
            {product.imageUrls.map((img) => (
              <img
                key={img.id}
                src={img.imageUrl}
                className="h-20 w-full object-cover rounded-md border hover:opacity-80 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

            <p className="text-sm text-gray-500 mt-1">
              {product.category.name}
            </p>
          </div>

          <div className="text-2xl font-semibold text-red-500">
            {formatPrice(product.price, i18n.language)}
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="p-3 border rounded-lg">
              <div className="font-medium">{t("products.stock")}</div>
              <div>{product.stockQuantity}</div>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="font-medium">{t("reviews.rating")}</div>
              <div>{product.averageRating.toFixed(2)} / 5</div>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            isLoading={loadingAddToCart}
            className="w-full transition text-white px-4 py-2 rounded-lg">
            {t("products.detail.addToCart")}
          </Button>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold">
            {t("reviews.comment")} ({product.totalReviews})
          </h2>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <WriteReview onSubmit={handleSubmitReview} loading={loadingReview} />
          <ReviewList reviews={paginateReview?.content || []} />
          {pageCount > 1 && (paginateReview?.totalElements ?? 0) > 0 && (
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
