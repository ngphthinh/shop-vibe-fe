import React from "react";
import OverviewSection from "../../features/statistics/components/OverviewSection";
import RevenueChart from "../../features/statistics/components/RevenueChart";
import TopProducts from "../../features/statistics/components/TopProducts";
import TopCustomers from "../../features/statistics/components/TopCustomers";
import { useTranslation } from "react-i18next";

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t("statistics.title")}</h1>

      <OverviewSection />

      <RevenueChart />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TopProducts />
        <TopCustomers />
      </div>
    </div>
  );
};

export default DashboardPage;
