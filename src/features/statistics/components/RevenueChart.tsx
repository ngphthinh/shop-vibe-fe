import React, { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";
import type { RevenueResponse } from "../types/statistics.type";
import { useFetch } from "../../../hooks/useFetch";
import Loading from "../../../components/common/Loading";
import { useTranslation } from "react-i18next";
import { formatDate, formatPrice } from "../../../utils/constants";
import { DateRangePicker } from "../../../components/common/DateRangeCalendar";
import { toast } from "react-toastify";

const RevenueChart: React.FC = () => {
  const { t, i18n } = useTranslation("", {
    keyPrefix: "statistics.revenue",
  });
  const { t: t_date } = useTranslation("", { keyPrefix: "dateRangeCalendar" });

  const [range, setRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });
  const [committedRange, setCommittedRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const { data, loading, refetch } = useFetch<RevenueResponse>(() =>
    dashboardService.getRevenue(range.startDate, range.endDate),
  );
  useEffect(() => {
    refetch();
  }, [refetch, committedRange]);

  const handleRangeChange = (r: {
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    setRange(r); // cập nhật UI ngay
    if ((r.startDate && r.endDate) || (!r.startDate && !r.endDate)) {
      if (r.startDate && r.endDate) {
        const diffTime = Math.abs(r.endDate.getTime() - r.startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 30) {
          toast.error(t("errorRangeTooLong"));
          return;
        }
      }
      setCommittedRange(r); // chỉ trigger fetch khi đủ 2 ngày hoặc xóa hết
    }
  };
  if (loading || !data) return <Loading />;

  return (
    <div className="p-4 border rounded-lg bg-white space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">{t("title")}</h2>
        <DateRangePicker
          value={range}
          onChange={handleRangeChange}
          placeholder={[t_date("start"), t_date("end")]}
        />
      </div>

      {/* SUMMARY */}
      <div className="text-sm text-gray-600">
        {t("totalRevenue")}:{" "}
        <span className="font-semibold text-black">
          {formatPrice(data.totalRevenue, i18n.language)}
        </span>
      </div>

      {/* SIMPLE CHART (BAR STYLE) */}
      <div className="space-y-2">
        {data.data.map((item) => (
          <div key={item.date} className="flex items-center gap-3">
            <div className="w-24 text-xs text-gray-500">
              {formatDate(item.date)}
            </div>

            <div className="flex-1 bg-gray-200 h-2 rounded">
              <div
                className="bg-green-500 h-2 rounded"
                style={{
                  width: `${(item.revenue / data.totalRevenue) * 100}%`,
                }}
              />
            </div>

            <div className="w-24 text-right text-xs font-medium">
              {formatPrice(item.revenue, i18n.language)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;
