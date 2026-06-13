import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Loading from "../../components/common/Loading";
import { useFetch } from "../../hooks/useFetch";

import ConfirmModal from "../../features/orders/components/ConfirmModal";
import OrderStatusBadge from "../../features/orders/components/OrderStatusBadge";
import Row from "../../features/orders/components/Row";
import Section from "../../features/statistics/components/Section";

import { orderService } from "../../features/orders/services/orderService";

import {
  STATUS_LABEL,
  VALID_TRANSITIONS,
  type OrderDetail,
  type OrderStatus,
} from "../../features/orders/types/order.type";
import { formatDate, formatPrice, randomUUID } from "../../utils/constants";

const TRANSITION_STYLE: Record<OrderStatus, string> = {
  CONFIRMED: "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100",
  SHIPPING:
    "border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100",
  DELIVERED: "border-green-200 bg-green-50 text-green-600 hover:bg-green-100",
  CANCELLED: "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  PENDING: "",
};

const AdminOrderDetailPage = () => {
  const { t, i18n } = useTranslation("", { keyPrefix: "admin.orders" });
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  const {
    data: order,
    loading,
    refetch,
  } = useFetch<OrderDetail>(() => orderService.getAdminOrderDetail(Number(id)));

  const handleConfirmTransition = async () => {
    if (!order || !pendingStatus) return;
    try {
      await orderService.updateOrderStatus(order.id, pendingStatus);
      toast.success(
        t("toast.statusUpdated", {
          code: order.orderCode,
          status: t(`status.${pendingStatus}`),
        }),
      );
      setPendingStatus(null);
      refetch();
    } catch {
      toast.error(t("toast.updateFailed"));
    }
  };

  if (loading || !order) return <Loading />;

  const transitions = VALID_TRANSITIONS[order.status];

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4 md:space-y-6 md:p-6">
      {/* ── Header card ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1 text-sm font-medium text-slate-400 transition hover:text-slate-700">
          ← {t("detail.back")}
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Order meta */}
          <div className="min-w-0">
            <h1 className="break-all font-mono text-xl font-bold text-slate-900 md:text-2xl">
              {order.orderCode}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Status + transitions */}
          <div className="flex flex-col gap-3 sm:items-end">
            <OrderStatusBadge status={order.status} />
            {transitions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {transitions.map((next) => (
                  <button
                    key={next}
                    onClick={() => setPendingStatus(next)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${TRANSITION_STYLE[next]}`}>
                    {t(STATUS_LABEL[next])}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Info grid ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <Section title={t("detail.customer")}>
          <Row label={t("detail.name")} value={order.customerName || "N/A"} />
          <Row label={t("detail.address")} value={order.shippingAddress} />
          {order.note && (
            <Row label={t("detail.note")} value={order.note} muted />
          )}
        </Section>

        <Section title={t("detail.payment")}>
          <Row
            label={t("detail.paymentMethod")}
            value={t(`paymentMethod.${order.payment.method}`)}
          />
          <Row
            label={t("detail.paymentStatus")}
            value={t(`paymentStatus.${order.payment.status}`)}
          />
          <Row
            label={t("detail.transactionId")}
            value={`${order.payment.method}-${order.id}`}
            mono
          />
        </Section>
      </div>

      {/* ── Items ── */}
      <Section title={t("detail.items")}>
        {order.items.map((item) => (
          <div
            key={randomUUID()}
            className="flex items-center gap-3 py-3 md:gap-4">
            {item.thumbnailUrl && (
              <img
                src={item.thumbnailUrl}
                alt={item.productName}
                className="h-12 w-12 flex-shrink-0 rounded-xl border object-cover md:h-14 md:w-14"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {item.productName}
              </p>
            
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-sm font-medium text-slate-800">
                {formatPrice(item.unitPrice, i18n.language)}
              </p>
              <p className="text-xs text-slate-400">x{item.quantity}</p>
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="flex justify-end py-4">
          <div className="text-right">
            <p className="text-sm text-slate-400">{t("detail.total")}</p>
            <p className="text-xl font-bold text-slate-900 md:text-2xl">
              {formatPrice(order.totalAmount, i18n.language)}
            </p>
          </div>
        </div>
      </Section>

      {pendingStatus && (
        <ConfirmModal
          title={t("modal.title")}
          description={t("modal.description", {
            code: order.orderCode,
            status: t(`status.${pendingStatus}`),
          })}
          onConfirm={handleConfirmTransition}
          onCancel={() => setPendingStatus(null)}
        />
      )}
    </div>
  );
};

export default AdminOrderDetailPage;
