import { useTranslation } from "react-i18next";
import {
  STATUS_LABEL,
  VALID_TRANSITIONS,
  type OrderStatus,
  type OrderSummary,
} from "../../features/orders/types/order.type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PaginationResponse } from "../../types/api.type";
import { useFetch } from "../../hooks/useFetch";
import { orderService } from "../../features/orders/services/orderService";
import { toast } from "react-toastify";
import OrderStatusFilter from "../../features/orders/components/OrderStatusFilter";
import Loading from "../../components/common/Loading";
import Pagination from "../../components/common/Pagination";
import OrderStatusBadge from "../../features/orders/components/OrderStatusBadge";
import ConfirmModal from "../../features/orders/components/ConfirmModal";
import { DateRangePicker } from "../../components/common/DateRangeCalendar";
import { Search } from "../../components/common/Search";
import { formatDate, formatPrice } from "../../utils/constants";


const TRANSITION_STYLE: Record<OrderStatus, string> = {
  CONFIRMED: "text-blue-600 border-blue-200 hover:bg-blue-50",
  SHIPPING: "text-purple-600 border-purple-200 hover:bg-purple-50",
  DELIVERED: "text-green-600 border-green-200 hover:bg-green-50",
  CANCELLED: "text-red-500 border-red-200 hover:bg-red-50",
  PENDING: "",
};

const ORDER_DEFAULT_PAGE_SIZE = 10;

const OrderManagerPage = () => {
  const { t, i18n } = useTranslation("", { keyPrefix: "admin.orders" });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [range, setRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });
  const [committedRange, setCommittedRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });
  const [pendingChange, setPendingChange] = useState<{
    orderId: number;
    newStatus: OrderStatus;
    orderCode: string;
  } | null>(null);

  const handleRangeChange = (r: {
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    setRange(r);
    if ((r.startDate && r.endDate) || (!r.startDate && !r.endDate)) {
      setCommittedRange(r);
      setCurrentPage(0);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: paginate,
    loading,
    refetch,
  } = useFetch<PaginationResponse<OrderSummary>>(() =>
    orderService.getAdminOrders(
      ORDER_DEFAULT_PAGE_SIZE,
      currentPage,
      status === "ALL" ? null : status,
      debouncedSearch || null,
      committedRange.startDate,
      committedRange.endDate,
    ),
  );

  useEffect(() => {
    refetch();
  }, [currentPage, status, debouncedSearch, committedRange, refetch]);

  const pageCount = paginate?.totalPages ?? 0;

  const handleStatusChange = (newStatus: OrderStatus | "ALL") => {
    setStatus(newStatus);
    setCurrentPage(0);
  };

  const handleConfirmTransition = async () => {
    if (!pendingChange) return;
    try {
      await orderService.updateOrderStatus(
        pendingChange.orderId,
        pendingChange.newStatus,
      );
      toast.success(
        t("toast.statusUpdated", {
          orderCode: pendingChange.orderCode,
          status: t(`status.${pendingChange.newStatus}`),
        }),
      );
      setPendingChange(null);
      refetch();
    } catch {
      toast.error(t("toast.updateFailed"));
    }
  };

  const openDetail = (id: number) => navigate(`/admin/orders/${id}`);

  const openTransition = (order: OrderSummary, newStatus: OrderStatus) =>
    setPendingChange({
      orderId: order.id,
      newStatus,
      orderCode: order.orderCode,
    });

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Search
            value={search}
            onChange={setSearch}
            placeholder={t("searchPlaceholder")}
          />
          <DateRangePicker
            value={range}
            onChange={handleRangeChange}
            placeholder={[
              t("dateRangeCalendar.start"),
              t("dateRangeCalendar.end"),
            ]}
          />
          <OrderStatusFilter value={status} onChange={handleStatusChange} />
        </div>
      </div>

      {loading || !paginate ? (
        <Loading />
      ) : (
        <>
          {/* ── Desktop: table ── */}
          <div className="hidden md:block rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">{t("table.code")}</th>
                  <th className="px-4 py-3 text-left">{t("table.customer")}</th>
                  <th className="px-4 py-3 text-left">{t("table.date")}</th>
                  <th className="px-4 py-3 text-right">{t("table.amount")}</th>
                  <th className="px-4 py-3 text-center">{t("table.status")}</th>
                  <th className="px-4 py-3 text-left">
                    {t("table.actions.label")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginate.content.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      {t("empty")}
                    </td>
                  </tr>
                ) : (
                  paginate.content.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {order.orderCode}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatPrice(order.totalAmount, i18n.language)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap items-center">
                          <button
                            onClick={() => openDetail(order.id)}
                            className="text-xs px-2.5 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                            {t("table.actions.detail")}
                          </button>
                          {VALID_TRANSITIONS[order.status].map((next) => (
                            <button
                              key={next}
                              onClick={() => openTransition(order, next)}
                              className={`text-xs px-2.5 py-1 rounded border transition-colors ${TRANSITION_STYLE[next]}`}>
                              {t(STATUS_LABEL[next])}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile: card list ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {paginate.content.length === 0 ? (
              <p className="text-center py-10 text-gray-400 text-sm">
                {t("empty")}
              </p>
            ) : (
              paginate.content.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border bg-white p-4 flex flex-col gap-3">
                  {/* top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs text-gray-400">
                        {order.orderCode}
                      </p>
                      <p className="font-semibold text-sm mt-0.5">
                        {order.customerName}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  {/* meta */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(order.totalAmount, i18n.language)}
                    </span>
                  </div>

                  {/* actions */}
                  <div className="flex flex-wrap gap-2 pt-1 border-t">
                    <button
                      onClick={() => openDetail(order.id)}
                      className="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                      {t("table.actions.detail")}
                    </button>
                    {VALID_TRANSITIONS[order.status].map((next) => (
                      <button
                        key={next}
                        onClick={() => openTransition(order, next)}
                        className={`text-xs px-3 py-1.5 rounded border transition-colors ${TRANSITION_STYLE[next]}`}>
                        {t(STATUS_LABEL[next])}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {pageCount > 1 && (
            <div className="mt-4">
              <Pagination
                pageCount={pageCount}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {pendingChange && (
        <ConfirmModal
          title={t("modal.title")}
          description={t("modal.description", {
            code: pendingChange.orderCode,
            status: STATUS_LABEL[pendingChange.newStatus],
          })}
          onConfirm={handleConfirmTransition}
          onCancel={() => setPendingChange(null)}
        />
      )}
    </div>
  );
};

export default OrderManagerPage;
