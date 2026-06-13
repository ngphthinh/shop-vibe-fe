import { useTranslation } from "react-i18next";
import StarRating from "../../../components/common/StarRating";
import type { Product } from "../types/product.type";
import { useFetch } from "../../../hooks/useFetch";
import type { PaginationResponse } from "../../../types/api.type";
import type { Review } from "../types/review.type";
import { reviewService } from "../services/reviewService";
import Loading from "../../../components/common/Loading";

// ── Review Modal ───────────────────────────────────────────────────────────
const ReviewModal = ({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) => {
  const { t } = useTranslation("", { keyPrefix: "products.admin" });

  const { data: paginate, loading } = useFetch<PaginationResponse<Review>>(() =>
    reviewService.getReviewsByProductId(product.id, 0, 5),
  );

  if (loading || !paginate) return <Loading />;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {t("review.title")}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
              {product.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 flex items-center gap-4 bg-gray-50 border-b border-gray-100">
          <span className="text-4xl font-semibold text-gray-900">
            {product.averageRating.toFixed(1)}
          </span>
          <div>
            <StarRating rating={product.averageRating} />
            <p className="text-xs text-gray-400 mt-1">
              {t("review.totalReviews", { count: product.totalReviews })}
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {product.totalReviews === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-400">
              {t("review.noReviews")}
            </div>
          ) : (
            paginate.content.map((r) => (
              <div key={r.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">
                    {r.user.email}
                  </span>
                  <span className="text-xs text-gray-400">{r.updatedAt}</span>
                </div>
                <StarRating rating={r.rating} />
                <p className="text-sm text-gray-600 mt-1.5">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
