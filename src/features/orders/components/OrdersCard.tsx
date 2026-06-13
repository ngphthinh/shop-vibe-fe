import { Link } from "react-router-dom";
import {
  formatPrice,
  formatDate,
  getPaymentMethodLabel,
} from "../../../utils/constants";
import type { OrderSummary } from "../types/order.type";
import { useTranslation } from "react-i18next";

interface Props {
  order: OrderSummary;
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  DELIVERED: {
    label: "orders.status.DELIVERED",
    className: "bg-green-50  text-green-700",
  },
  PENDING: {
    label: "orders.status.PENDING",
    className: "bg-amber-50  text-amber-700",
  },
  CONFIRMED: {
    label: "orders.status.CONFIRMED",
    className: "bg-blue-50   text-blue-700",
  },
  SHIPPING: {
    label: "orders.status.SHIPPING",
    className: "bg-cyan-50   text-cyan-700",
  },
  CANCELLED: {
    label: "orders.status.CANCELLED",
    className: "bg-red-50    text-red-600",
  },
};

export const OrderCard = ({ order }: Props) => {
  const { t, i18n } = useTranslation();
  const status = STATUS_MAP[order.status] ?? {
    label: order.status,
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <Link
      to={`/orders/${order.id}/${order.orderCode}`}
      className="group flex flex-col gap-3 bg-white border border-gray-100 rounded-xl p-3.5 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
      {/* Hàng trên: Mã đơn + Giá */}
      <div className="flex items-start justify-between gap-3">
        {/* Trái: mã + status + meta */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-medium text-gray-900">
              {order.orderCode}
            </span>
            <span
              className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-md ${status.className}`}>
              {t(status.label)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-gray-400">
            <span className="flex items-center gap-1">
              {/* calendar icon */}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {formatDate(order.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              {/* box icon */}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              {t("cart.summary.itemCount", { count: order.itemCount })}
            </span>
          </div>
        </div>
        {/* Phải: Giá + Thanh toán */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-base font-medium text-gray-900">
            {formatPrice(order.totalAmount, i18n.language)}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-gray-400">
            {/* card icon */}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <path d="M1 10h22" />
            </svg>
            {t(getPaymentMethodLabel(order.payment.method))}
          </span>
        </div>
      </div>

      {/* Hàng dưới: CTA */}
      <div className="flex justify-end">
        <span className="flex items-center gap-1 text-[12px] text-gray-400 group-hover:text-blue-500 transition-colors">
          {t("common.viewDetail")}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
};
