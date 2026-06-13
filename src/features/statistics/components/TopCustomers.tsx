import React from "react";
import { dashboardService } from "../services/dashboardService";
import { useFetch } from "../../../hooks/useFetch";
import type { TopCustomerResponse } from "../types/statistics.type";
import Loading from "../../../components/common/Loading";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../../utils/constants";

const TopCustomers: React.FC = () => {
  const { t, i18n } = useTranslation("", {
    keyPrefix: "statistics.topCustomers",
  });
  const { data: topCustomers, loading } = useFetch<TopCustomerResponse>(() =>
    dashboardService.getTopCustomers(5),
  );

  if (loading || !topCustomers) return <Loading />;

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="font-semibold mb-3">{t("title")}</h2>

      <ul className="space-y-3">
        {topCustomers.data.map((c) => (
          <li
            key={c.customerId}
            className="p-3 border rounded flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{c.fullName}</p>
              <p className="text-[11px] text-gray-500">
                {t("email")}: {c.email}
              </p>
              <p className="text-[10px] text-gray-400">
                ID: {c.customerId} • {t("rank")} {c.rank}
              </p>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                {formatPrice(c.totalSpent, i18n.language)}
              </p>
              <p className="text-[10px] text-gray-500">{t("totalSpent")}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCustomers;
