import { useTranslation } from "react-i18next";
import { Button } from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import { CartItemCard } from "../../features/cart/components/CartItemCard";
import { CartSummary } from "../../features/cart/components/CartSummary";
import { cartService } from "../../features/cart/services/cartService";
import { useFetch } from "../../hooks/useFetch";
import type { CreateOrderRequest } from "../../features/orders/types/order.type";
import { toast } from "react-toastify/unstyled";
import { orderService } from "../../features/orders/services/orderService";

export const CartPage = () => {
  const {
    data: cart,
    loading,
    refetch,
  } = useFetch(() => cartService.getCart());
  const { t } = useTranslation("", { keyPrefix: "cart" });

  const { t: t_checkout } = useTranslation("", { keyPrefix: "checkout" });

  const handleIncrease = async (itemId: number, quantity: number) => {
    await cartService.updateQuantity(itemId, quantity);
    refetch();
  };

  const handleDecrease = async (itemId: number, quantity: number) => {
    await cartService.updateQuantity(itemId, quantity);
    refetch();
  };

  const handleRemove = async (itemId: number) => {
    await cartService.removeItem(itemId);
    refetch();
  };

  const handleClear = async () => {
    await cartService.clearCart();
    refetch();
  };

  const handleCreateOrder = async (request: CreateOrderRequest) => {
    await orderService.createOrder(request);
    toast.success(t_checkout("success.title"));
  };
  if (loading) {
    return <Loading />;
  }

  if (!cart || cart.items.length === 0) {
    return <div className="text-center py-10">{t("empty")}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>

        <Button size="sm" variant="error" onClick={handleClear}>
          {t("clearCart")}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
              onRemove={handleRemove}
            />
          ))}
        </div>

        <CartSummary
          totalItems={cart.totalItems}
          totalAmount={cart.totalAmount}
          onCheckout={handleCreateOrder}
        />
      </div>
    </div>
  );
};
