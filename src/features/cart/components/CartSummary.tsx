import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import { formatPrice } from "../../../utils/constants";
import type {
  CreateOrderRequest,
  PaymentMethod,
} from "../../orders/types/order.type";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Props {
  totalItems: number;
  totalAmount: number;
  onCheckout: (request: CreateOrderRequest) => Promise<void>;
}

const paymentMethods = [
  {
    value: "COD",
    label: "payment.cod",
    description: "payment.codDesc",
  },
  {
    value: "BANK_TRANSFER",
    label: "payment.bankTransfer",
    description: "payment.bankTransferDesc",
  },
  {
    value: "MOMO",
    label: "payment.momo",
    description: "payment.momoDesc",
  },
];

export const CartSummary = ({ totalItems, totalAmount, onCheckout }: Props) => {
  const { t, i18n } = useTranslation("", { keyPrefix: "cart.summary" });
  const { t: t_checkout } = useTranslation("", { keyPrefix: "checkout" });

  const [shippingAddress, setShippingAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error(t_checkout("shippingAddressRequired"));
      return;
    }

    if (note.length > 300) {
      toast.error(t_checkout("noteRequired"));
      return;
    }

    try {
      setLoading(true);

      await onCheckout({
        shippingAddress,
        note,
        paymentMethod,
      });

      toast.success(t_checkout("success.title"));
      navigate("/orders");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t_checkout("error.generic"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border rounded-xl shadow-sm p-4 sm:p-5">
      {/* HEADER */}
      <h2 className="text-base sm:text-lg font-semibold mb-4">{t("title")}</h2>

      {/* SUMMARY */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>{t("quantity")}</span>
          <span className="font-medium">{totalItems}</span>
        </div>

        <div className="flex justify-between font-semibold text-base sm:text-lg border-t pt-3">
          <span>{t("total")}</span>
          <span>{formatPrice(totalAmount, i18n.language)}</span>
        </div>
      </div>

      {/* FORM */}
      <div className="mt-4 space-y-3">
        <input
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder={t_checkout("shippingAddressPlaceholder")}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t_checkout("notePlaceholder")}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-300"
        />

        {/* PAYMENT */}
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <label
              key={method.value}
              className={`flex gap-3 p-3 border rounded-lg cursor-pointer transition text-sm ${
                paymentMethod === method.value
                  ? "border-slate-900 bg-slate-50"
                  : "border-gray-200"
              }`}>
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
                className="mt-1"
              />

              <div className="min-w-0">
                <div className="font-medium">{t_checkout(method.label)}</div>
                <div className="text-xs text-gray-500 break-words">
                  {t_checkout(method.description)}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* ACTION */}
      <Button
        className="w-full mt-5"
        isLoading={loading}
        onClick={handleCheckout}>
        {t("checkout")}
      </Button>
    </div>
  );
};
