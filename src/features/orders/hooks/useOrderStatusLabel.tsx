import { useTranslation } from "react-i18next";
import type { OrderStatus } from "../types/order.type";

export function useOrderStatusLabel() {
  const { t } = useTranslation();

  const getLabel = (status: OrderStatus) => t(`orders.status.${status}`);

  return { getLabel };
}
