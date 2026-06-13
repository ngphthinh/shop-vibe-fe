import React from "react";
import type { ProductCardProps } from "../types/product.type";
import { formatPrice } from "../../../utils/constants";
import { Link} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import Loading from "../../../components/common/Loading";
import { toast } from "react-toastify";
import { cartService } from "../../cart/services/cartService";

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, i18n } = useTranslation("");

  const [loading, setLoading] = React.useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await cartService.addToCart({ productId: product.id, quantity: 1 });
      toast.success(t("products.detail.addedToCart"));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("products.detail.addToCartFail");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border border-gray-100 rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Hình ảnh */}
      <div className="relative w-full aspect-square md:aspect-video bg-gray-50 overflow-hidden">
        <img
          src={product.primaryImageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <span className="absolute top-2 left-2 bg-blue-50 text-blue-600 text-[10px] md:text-xs font-semibold px-2 py-1 rounded-full border border-blue-100">
          {product.category.name}
        </span>
      </div>

      {/* Nội dung */}
      <div className="flex flex-col flex-grow p-2 md:p-4">
        <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 mb-1 hover:text-blue-600 transition-colors">
          <Link to={`products/${product.id}/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        <p className="hidden md:block text-xs text-gray-400 line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Rating & Stock */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 text-[11px] md:text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>

            <span className="font-medium text-gray-700">
              {product.averageRating.toFixed(1)}
            </span>

            <span className="text-gray-400">({product.totalReviews})</span>
          </div>

          <div>
            {t("products.stock")}
            {": "}
            <span className="font-medium text-gray-700">
              {product.stockQuantity}
            </span>
          </div>
        </div>

        {/* Giá & Nút mua */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-sm md:text-lg font-bold text-red-500">
            {formatPrice(product.price, i18n.language)}
          </span>

          <Button
            onClick={handleAddToCart}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-[10px] md:text-xs font-medium px-2 py-1.5 md:px-3 md:py-2 rounded-lg transition-colors">
            {t("products.detail.addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
};
