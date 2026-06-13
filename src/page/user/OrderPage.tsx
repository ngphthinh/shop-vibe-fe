import { useEffect, useState } from "react";
import type {
  OrderStatus,
  OrderSummary,
} from "../../features/orders/types/order.type";
import type { PaginationResponse } from "../../types/api.type";
import Loading from "../../components/common/Loading";
import { useFetch } from "../../hooks/useFetch";
import Pagination from "../../components/common/Pagination";
import { OrderCard } from "../../features/orders/components/OrdersCard";
import { DateRangePicker } from "../../components/common/DateRangeCalendar";
import { useTranslation } from "react-i18next";
import OrderStatusFilter from "../../features/orders/components/OrderStatusFilter";
import { orderService } from "../../features/orders/services/orderService";

const ORDER_DEFAULT_PAGE_SIZE = 10;
const OrderPage = () => {
  const { t } = useTranslation("", { keyPrefix: "orders" });
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [range, setRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [committedRange, setCommittedRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const handleRangeChange = (r: {
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    setRange(r); // cập nhật UI ngay
    if ((r.startDate && r.endDate) || (!r.startDate && !r.endDate)) {
      setCommittedRange(r); // chỉ trigger fetch khi đủ 2 ngày hoặc xóa hết
    }
  };

  const {
    data: paginate,
    loading,
    refetch,
  } = useFetch<PaginationResponse<OrderSummary>>(() =>
    orderService.getUserOrders(
      ORDER_DEFAULT_PAGE_SIZE,
      currentPage,
      status === "ALL" ? null : status,
      range.startDate,
      range.endDate,
    ),
  );

  useEffect(() => {
    if (paginate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPageCount(paginate.totalPages); // hoặc data.totalPages tuỳ backend
    }
  }, [paginate]);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch, status, committedRange]);

  if (loading || !paginate) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
        <DateRangePicker
          value={range}
          onChange={handleRangeChange}
          placeholder={[
            t("dateRangeCalendar.start"),
            t("dateRangeCalendar.end"),
          ]}
        />
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {t("admin.table.status")}
          </span>
          <OrderStatusFilter value={status} onChange={setStatus} />
        </div>
      </div>
      <div className="space-y-4">
        {paginate.content.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
      {pageCount > 1 && paginate.totalElements > 0 && (
        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default OrderPage;
