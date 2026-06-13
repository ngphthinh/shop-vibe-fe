import React from "react";
import { dashboardService } from "../services/dashboardService";
import type { TopProductResponse } from "../types/statistics.type";
import { useFetch } from "../../../hooks/useFetch";
import Loading from "../../../components/common/Loading";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../../utils/constants";
import { Link } from "react-router-dom";

const TopProducts: React.FC = () => {
  const { t, i18n } = useTranslation("", {
    keyPrefix: "statistics.topProducts",
  });
  const { data: topProducts, loading } = useFetch<TopProductResponse>(() =>
    dashboardService.getTopProducts(5),
  );

  if (loading || !topProducts) return <Loading />;

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="font-semibold mb-3">{t("title")}</h2>

      <ul className="space-y-3">
        {topProducts.data.map((p) => (
          <Link
            to={`/products/${p.productId}/${p.productName}`}
            key={p.productId}
            className="p-3 border rounded flex items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <img
                src={p.thumbnail}
                alt={p.productName}
                className="w-10 h-10 rounded object-cover border"
              />

              <div>
                <p className="text-sm font-medium"> {p.productName}</p>
                <p className="text-[10px] text-gray-500">
                  ID: {p.productId} • {t("rank")}: {p.rank}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right text-xs">
              <p className="font-semibold">
                {t("sold")}: {p.totalQuantitySold}
              </p>
              <p className="text-gray-500">
                {t("revenue")}: {formatPrice(p.totalRevenue, i18n.language)}
              </p>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default TopProducts;
