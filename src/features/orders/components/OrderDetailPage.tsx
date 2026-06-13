import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { useFetch } from "../../../hooks/useFetch";
import Loading from "../../../components/common/Loading";
import { OrderItemCard } from "../components/OrderItemCard";
import {
  formatDateTime,
  formatPrice,
  getPaymentMethodLabel,
} from "../../../utils/constants";
import { orderService } from "../services/orderService";
import { Button } from "../../../components/common/Button";
import type { OrderDetail, OrderStatus } from "../types/order.type";
import { CancelOrderBox } from "./CancelOrderBox";
import { toast } from "react-toastify";
const getLabel = (status: OrderStatus | "ALL") =>
  status === "ALL" ? "orders.filter.allStatus" : `orders.status.${status}`;
export const OrderDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelBox, setShowCancelBox] = useState(false);
  const {
    data: order,
    loading,
    refetch,
  } = useFetch<OrderDetail>(() => orderService.getOrderById(Number(id)));

  if (loading || !order) return <Loading />;

  const canCancel = order.status === "PENDING";

  const handleCancel = async (reason: string) => {
    try {
      setCancelLoading(true);

      await orderService.cancelOrder(order.id, { reason });

      setShowCancelBox(false);
      toast.success(t("orders.detail.cancelSuccess"));
      await refetch();
    } catch {
      toast.error(t("orders.detail.cancelFailed"));
    } finally {
      setCancelLoading(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-3 space-y-4">
      {/* CARD 1 */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex justify-between items-center border-b pb-3 mb-3 border-gray-100">
          {/* LEFT */}
          <div>
            <h1 className="font-semibold text-base text-gray-900">
              {t("orders.orderId", { id: order.orderCode })}
            </h1>
            <p className="text-gray-400 text-[11px] mt-0.5">
              {t("orders.placedOn", {
                date: formatDateTime(order.createdAt, i18n.language),
              })}
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              {t(`orders.status.${order.status}`)}
            </span>
            {canCancel && (
              <Button
                onClick={() => setShowCancelBox(true)}
                size="sx"
                variant="error">
                {t("orders.detail.cancelOrder")}
              </Button>
            )}
          </div>
        </div>

        {/* INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <div className="sm:col-span-2">
            <span className="text-gray-400 inline-block w-24">
              {t("orders.detail.shippingAddress")}
            </span>
            <span className="text-gray-700 font-medium">
              {order.shippingAddress}
            </span>
          </div>

          <div>
            <span className="text-gray-400 inline-block w-24">
              {t("orders.detail.paymentMethod")}
            </span>
            <span className="text-gray-700 font-medium">
              {t(getPaymentMethodLabel(order.payment.method))}
            </span>
          </div>

          <div>
            <span className="text-gray-400 inline-block w-24">
              {t("orders.admin.table.status")}
            </span>
            <span className="text-gray-700 font-medium">
              {t(getLabel(order.payment.status as OrderStatus | "ALL"))}
            </span>
          </div>

          {order.note && (
            <div className="sm:col-span-2 border-t pt-2 mt-1 border-dashed border-gray-100">
              <div className="text-gray-400 text-xs mb-1">
                {t("orders.detail.note")}
              </div>
              <div className="text-gray-600 italic break-words">
                {order.note}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CARD 2 */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          {t("orders.detail.items")}
        </h2>

        <div className="space-y-2">
          {order.items.map((item) => (
            <Link
              to={`/products/${item.productId}/${item.productName}`}
              key={item.productId}>
              <OrderItemCard item={item} locale={i18n.language} />
            </Link>
          ))}
        </div>
      </div>

      {/* CARD 3 */}
      <div className="bg-white border rounded-lg p-3.5 flex justify-between items-center text-sm font-semibold text-gray-900">
        <span className="text-gray-500 font-normal">
          {t("orders.summary.grandTotal")}
        </span>

        <span className="text-base text-red-600">
          {formatPrice(order.totalAmount, i18n.language)}
        </span>
      </div>
      <CancelOrderBox
        open={showCancelBox}
        loading={cancelLoading}
        onCancel={handleCancel}
        onClose={() => setShowCancelBox(false)}
      />
    </div>
  );
};
