import { useTranslation } from "react-i18next";
import type { Product } from "../types/product.type";
import { formatPrice } from "../../../utils/constants";
import StarRating from "../../../components/common/StarRating";
import { Button } from "../../../components/common/Button";
import { Link } from "react-router-dom";

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onReview: (p: Product) => void;
}

const ProductTable = ({ products, onEdit, onDelete, onReview }: Props) => {
  const { t, i18n } = useTranslation("", { keyPrefix: "products.admin" });

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* ✅ Overlay xoay ngang — chỉ hiện khi màn hình < md (768px) */}
      <div className="flex md:hidden flex-col items-center justify-center gap-4 py-16 px-6 text-center">
        <svg
          className="w-14 h-14 text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M8 2L4 5l4 3" />
          <path d="M16 22l4-3-4-3" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-gray-600">
            {t("rotateScreen.title")}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {t("rotateScreen.message")}
          </p>
        </div>
      </div>

      {/* ✅ Bảng chỉ hiện từ md trở lên */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-12">
                {t("table.id")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                {t("table.name")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                {t("table.category")}
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">
                {t("table.price")}
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">
                {t("table.stock")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                {t("table.rating")}
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-gray-400">
                  {t("noProducts")}
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                    {p.id}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/products/${p.id}/${p.slug}`}>
                      <div className="flex items-center gap-3">
                        <img
                          src={p.primaryImageUrl}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-[200px] hover:text-blue-600 transition-colors">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px] hover:text-gray-600 transition-colors">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 text-[11px] bg-blue-50 text-blue-700 rounded-md">
                      {p.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    {formatPrice(p.price, i18n.language)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-medium ${p.stockQuantity <= 10 ? "text-red-500" : "text-gray-700"}`}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onReview(p)}
                      className="flex items-center gap-1.5 hover:opacity-75 transition-opacity"
                      aria-label={t("table.rating")}>
                      <StarRating rating={p.averageRating} />
                      <span className="text-xs text-gray-400">
                        ({p.totalReviews})
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="save"
                        onClick={() => onEdit(p)}
                        aria-label={t("editProduct")}>
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        {t("editProduct")}
                      </Button>
                      <Button
                        size="sm"
                        variant="error"
                        onClick={() => onDelete(p)}
                        aria-label={t("deleteProduct")}>
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                        {t("deleteProduct")}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
