import { useTranslation } from "react-i18next";
import { formatPrice } from "../../../utils/constants";
import type { OrderItem } from "../types/order.type";

interface Props {
  item: OrderItem;
  locale: string;
}

export const OrderItemCard = ({ item, locale }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-4 border rounded-xl p-3">
      <img
        src={item.thumbnailUrl}
        alt={item.productName}
        className="w-20 h-20 object-cover rounded-lg border"
      />

      <div className="flex-1">
        <h3 className="font-medium line-clamp-2">{item.productName}</h3>

        <p className="text-sm text-gray-500 mt-1">
          {formatPrice(item.unitPrice, locale)}
        </p>

        <div className="text-sm mt-2">
          {t("common.quantity")}: {item.quantity}
        </div>
      </div>

      <div className="font-semibold">{formatPrice(item.subtotal, locale)}</div>
    </div>
  );
};
