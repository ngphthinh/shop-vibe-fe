import React from "react";
import StatCard from "./StatCard";
import { dashboardService } from "../services/dashboardService";
import type { OverviewResponse } from "../types/statistics.type";
import { useFetch } from "../../../hooks/useFetch";
import Loading from "../../../components/common/Loading";
import Section from "./Section";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../../utils/constants";

const OverviewSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data, loading } = useFetch<OverviewResponse>(() =>
    dashboardService.getOverview(),
  );

  if (loading || !data) return <Loading />;

  return (
    <div className="space-y-6">
      {/* TODAY */}
      <Section title={t("statistics.today.label")}>
        <StatCard
          label={t("statistics.today.ordersLabel")}
          value={t("statistics.today.orders", { count: data.today.orders ?? 0 })}
        />
        <StatCard
          label={t("statistics.today.revenueLabel")}
          value={t("statistics.today.revenue", {
            amount: formatPrice(data.today.revenue ?? 0, i18n.language),
          })}
        />
        <StatCard
          label={t("statistics.today.customerLabel")}
          value={t("statistics.today.customer", {
            count: data.today.newCustomers ?? 0,
          })}
        />
      </Section>

      {/* THIS MONTH */}
      <Section title={t("statistics.thisMonth.label")}>
        <StatCard
          label={t("statistics.thisMonth.ordersLabel")}
          value={t("statistics.thisMonth.orders", {
            count: data.thisMonth.orders ?? 0,
          })}
        />
        <StatCard
          label={t("statistics.thisMonth.revenueLabel")}
          value={t("statistics.thisMonth.revenue", {
            amount: formatPrice(data.thisMonth.revenue ?? 0, i18n.language),
          })}
        />
        <StatCard
          label={t("statistics.thisMonth.customerLabel")}
          value={t("statistics.thisMonth.customer", {
            count: data.thisMonth.newCustomers ?? 0,
          })}
        />
      </Section>

      {/* ORDER STATUS */}
      <Section title={t("statistics.orderStatus.title")}>
        <StatCard
          label={t("statistics.orderStatus.pending")}
          value={`${data.thisMonth.ordersByStatus.pending} ${t("statistics.orderLabel")}`}
        />
        <StatCard
          label={t("statistics.orderStatus.confirmed")}
          value={`${data.thisMonth.ordersByStatus.confirmed} ${t("statistics.orderLabel")}`}
        />
        <StatCard
          label={t("statistics.orderStatus.shipping")}
          value={`${data.thisMonth.ordersByStatus.shipping} ${t("statistics.orderLabel")}`}
        />
        <StatCard
          label={t("statistics.orderStatus.delivered")}
          value={`${data.thisMonth.ordersByStatus.delivered} ${t("statistics.orderLabel")}`}
        />
        <StatCard
          label={t("statistics.orderStatus.cancelled")}
          value={`${data.thisMonth.ordersByStatus.cancelled} ${t("statistics.orderLabel")}`}
        />
      </Section>

      {/* ALL TIME (compact hơn) */}
      <Section title={t("statistics.allTime.label")}>
        <StatCard
          label={t("statistics.allTime.ordersLabel")}
          value={t("statistics.allTime.orders", {
            count: data.allTime.totalOrders,
          })}
        />
        <StatCard
          label={t("statistics.allTime.customerLabel")}
          value={t("statistics.allTime.customer", {
            count: data.allTime.totalCustomers,
          })}
        />
        <StatCard
          label={t("statistics.allTime.productLabel")}
          value={t("statistics.allTime.product", {
            count: data.allTime.totalProducts,
          })}
        />
      </Section>
    </div>
  );
};

export default OverviewSection;
