import { useTranslation } from "react-i18next";
import { formatPrice } from "../../../utils/constants";
import type { CartItem } from "../types/cart.type";

interface Props {
  item: CartItem;
  onIncrease: (itemId: number, quantity: number) => void;
  onDecrease: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

export const CartItemCard = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) => {
  const { t, i18n } = useTranslation("", { keyPrefix: "cart" });

  return (
    <div className="flex gap-3 p-3 sm:p-4 border rounded-xl bg-white shadow-sm">
      {/* IMAGE */}
      <img
        src={item.product.primaryImageUrl}
        alt={item.product.name}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border shrink-0"
      />

      {/* CONTENT */}
      <div className="flex flex-col flex-1 min-w-0 justify-between">
        {/* INFO */}
        <div>
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 text-gray-900">
            {item.product.name}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {formatPrice(item.unitPrice, i18n.language)}
          </p>
        </div>

        {/* ACTION BAR */}
        <div className="flex items-center justify-between mt-3">
          {/* quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onDecrease(item.id, Math.max(0, item.quantity - 1))
              }
              className="w-8 h-8 flex items-center justify-center rounded-md border hover:bg-gray-50">
              -
            </button>

            <span className="min-w-6 text-center text-sm font-medium">
              {item.quantity}
            </span>

            <button
              onClick={() => onIncrease(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md border hover:bg-gray-50">
              +
            </button>
          </div>

          {/* subtotal + remove */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm sm:text-base text-gray-900">
              {formatPrice(item.subtotal, i18n.language)}
            </span>

            <button
              onClick={() => onRemove(item.id)}
              className="text-xs sm:text-sm text-white bg-red-600 rounded-md px-2  py-1 hover:bg-red-900 font-medium">
              {t("remove")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
