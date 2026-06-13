import { useTranslation } from "react-i18next";
import type {
  OrderStatusFilter,
} from "../types/order.type";
import { useRef, useState } from "react";
type Props = {
  value: OrderStatusFilter;
  onChange: (v: OrderStatusFilter) => void;
};

export default function OrderStatusFilter({ value, onChange }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const getLabel = (status: OrderStatusFilter) =>
    status === "ALL"
      ? t("orders.filter.allStatus")
      : t(`orders.status.${status}`);

  return (
    <div ref={wrapRef} className="flex items-center gap-3">
      {/* COMBOBOX */}
      <div className="relative inline-block min-w-[200px]">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white text-sm">
          <span>{getLabel(value)}</span>
          <span className="text-gray-400">▾</span>
        </button>

        {open && (
          <div className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg overflow-hidden">
            {[
              "ALL",
              "PENDING",
              "CONFIRMED",
              "SHIPPING",
              "DELIVERED",
              "CANCELLED",
            ].map((status) => (
              <button
                key={status}
                onClick={() => {
                  onChange(status as OrderStatusFilter);
                  setOpen(false);
                }}
                className={[
                  "w-full text-left px-3 py-2 text-sm hover:bg-gray-50",
                  value === status ? "bg-gray-100 font-medium" : "",
                ].join(" ")}>
                {getLabel(status as OrderStatusFilter)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
