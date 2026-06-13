import { useTranslation } from "react-i18next";
import type { OrderStatus } from "../types/order.type";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> =
  {
    PENDING: {
      label: "status.pending",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    CONFIRMED: {
      label: "status.confirmed",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    SHIPPING: {
      label: "status.shipping",
      className: "bg-purple-50 text-purple-700 border-purple-200",
    },
    DELIVERED: {
      label: "status.delivered",
      className: "bg-green-50 text-green-700 border-green-200",
    },
    CANCELLED: {
      label: "status.cancelled",
      className: "bg-red-50 text-red-600 border-red-200",
    },
  };

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const { t } = useTranslation("", {
    keyPrefix: "admin.orders",
  });

  const { label, className } = STATUS_CONFIG[status];

  return (
    <span
      className={`
        inline-flex
        max-w-full
        items-center
        justify-center
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-medium
        whitespace-nowrap
        sm:text-sm
        ${className}
      `}>
      {t(label)}
    </span>
  );
};

export default OrderStatusBadge;
